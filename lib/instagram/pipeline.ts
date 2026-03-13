import { createClient } from '@supabase/supabase-js'
import { generateContent, generateNewsCaption, generateMixedCaption, generateStoryText, generateReelText, generateStoryTextFromTopic, generateReelTextFromTopic } from './content-generator'
import { fetchAndStoreImage, getUsedUnsplashIds, getRecentImageQueries, getRecentCaptions } from './image-generator'
import { publishToInstagram } from './api'
import { ensureValidToken } from './token-manager'
import { getUnusedScrapedNews, markScrapedAsUsed } from './bali-news-scraper'
import { generateStoryImage } from './story-generator'
import { generateReelVideo } from './reel-generator'
import { WEEKLY_ROTATION, TOPIC_POOLS } from './constants'
import type {
  ContentCategory,
  InstagramConfig,
  InstagramPost,
  ContentTemplate,
} from '@/types/instagram'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function logActivity(
  action: string,
  details: string,
  postId?: string,
  status: 'success' | 'error' | 'warning' = 'success'
) {
  const supabase = getSupabaseAdmin()
  await supabase.from('instagram_activity_log').insert({
    action,
    details,
    post_id: postId || null,
    status,
  })
}

/**
 * Get the Instagram config (singleton)
 */
export async function getConfig(): Promise<InstagramConfig | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('instagram_config')
    .select('*')
    .limit(1)
    .single()

  return data as InstagramConfig | null
}

/**
 * Get today's category from the content calendar, or fall back to weekly rotation
 */
export async function getTodayCategory(): Promise<ContentCategory> {
  const supabase = getSupabaseAdmin()
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('content_calendar')
    .select('category')
    .eq('date', today)
    .single()

  if (data?.category) {
    return data.category as ContentCategory
  }

  // Fall back to weekly rotation
  const dayOfWeek = new Date().getDay()
  return WEEKLY_ROTATION[dayOfWeek]
}

/**
 * Get a random active template for a category
 */
async function getTemplate(category: ContentCategory): Promise<ContentTemplate | null> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('content_templates')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('last_used_at', { ascending: true, nullsFirst: true })
    .limit(1)
    .single()

  return data as ContentTemplate | null
}

/**
 * Generate a new Instagram post (content + image)
 */
export async function generatePost(
  category?: ContentCategory,
  customTopic?: string,
  templateId?: string
): Promise<InstagramPost> {
  const supabase = getSupabaseAdmin()

  const postCategory = category || await getTodayCategory()

  // Create a placeholder post
  const { data: post, error: insertError } = await supabase
    .from('instagram_posts')
    .insert({
      status: 'generating',
      category: postCategory,
      source: 'ai_generated',
    })
    .select()
    .single()

  if (insertError || !post) {
    throw new Error(`Failed to create post: ${insertError?.message}`)
  }

  try {
    // Get template
    let template: ContentTemplate | null = null
    if (templateId) {
      const { data } = await supabase
        .from('content_templates')
        .select('*')
        .eq('id', templateId)
        .single()
      template = data as ContentTemplate | null
    } else {
      template = await getTemplate(postCategory)
    }

    // Fetch used IDs + recent queries + recent captions in parallel for deduplication
    const [usedIds, recentQueries, recentCaps] = await Promise.all([
      getUsedUnsplashIds(),
      getRecentImageQueries(),
      getRecentCaptions(),
    ])

    // Generate content with Claude (pass recent queries + captions to avoid repetition)
    const content = await generateContent(postCategory, template, customTopic, recentQueries, recentCaps)

    // Update post with caption
    await supabase
      .from('instagram_posts')
      .update({
        caption: content.caption,
        hashtags: content.hashtags,
        image_prompt: content.imageSearchQuery,
        status: 'image_pending',
      })
      .eq('id', post.id)

    // Update template usage
    if (template) {
      await supabase
        .from('content_templates')
        .update({
          usage_count: (template.usage_count || 0) + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq('id', template.id)
    }

    // Fetch photo from Unsplash and store (excluding previously used photos)
    const { storagePath, publicUrl, unsplashPhotoId } = await fetchAndStoreImage(
      content.imageSearchQuery,
      post.id,
      usedIds
    )

    // Get auto-approve setting
    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    // Update post with image + store Unsplash photo ID in metadata for future dedup
    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        image_url: publicUrl,
        image_storage_path: storagePath,
        status: finalStatus,
        metadata: { unsplash_photo_id: unsplashPhotoId },
      })
      .eq('id', post.id)
      .select()
      .single()

    await logActivity('post_generated', `Generated ${postCategory} post: ${content.topic}`, post.id)

    return updatedPost as InstagramPost
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', post.id)

    await logActivity('post_generation_failed', message, post.id, 'error')
    throw error
  }
}

/**
 * Convert scraped news items into Instagram posts
 */
export async function convertNewsToPost(
  newsTitle: string,
  newsDescription: string,
  newsUrl?: string,
  category: string = 'immigration_news'
): Promise<InstagramPost> {
  const supabase = getSupabaseAdmin()

  // Create placeholder post
  const { data: post, error: insertError } = await supabase
    .from('instagram_posts')
    .insert({
      status: 'generating',
      category,
      source: 'news_scraper',
      news_source_url: newsUrl || null,
      news_title: newsTitle,
    })
    .select()
    .single()

  if (insertError || !post) {
    throw new Error(`Failed to create news post: ${insertError?.message}`)
  }

  try {
    // Fetch dedup context in parallel
    const [usedIds, recentQueries, recentCaps] = await Promise.all([
      getUsedUnsplashIds(),
      getRecentImageQueries(),
      getRecentCaptions(),
    ])

    // Generate caption from news (with dedup)
    const content = await generateNewsCaption(newsTitle, newsDescription, newsUrl, recentQueries, recentCaps)

    await supabase
      .from('instagram_posts')
      .update({
        caption: content.caption,
        hashtags: content.hashtags,
        image_prompt: content.imageSearchQuery,
        status: 'image_pending',
      })
      .eq('id', post.id)

    // Fetch photo from Unsplash and store (excluding previously used photos)
    const { storagePath, publicUrl, unsplashPhotoId } = await fetchAndStoreImage(
      content.imageSearchQuery,
      post.id,
      usedIds
    )

    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        image_url: publicUrl,
        image_storage_path: storagePath,
        status: finalStatus,
        metadata: { unsplash_photo_id: unsplashPhotoId },
      })
      .eq('id', post.id)
      .select()
      .single()

    await logActivity('news_post_generated', `News post: ${newsTitle}`, post.id)

    return updatedPost as InstagramPost
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', post.id)

    await logActivity('news_post_failed', message, post.id, 'error')
    throw error
  }
}

/**
 * Generate a mixed Bali news + visa post using scraped Instagram content
 */
export async function generateMixedNewsPost(): Promise<InstagramPost | null> {
  const supabase = getSupabaseAdmin()

  // Get unused scraped news
  const scrapedItems = await getUnusedScrapedNews(1)
  if (scrapedItems.length === 0) {
    await logActivity('mixed_post_skipped', 'No unused scraped news available', undefined, 'warning')
    return null
  }

  const newsItem = scrapedItems[0]

  // Create placeholder post
  const { data: post, error: insertError } = await supabase
    .from('instagram_posts')
    .insert({
      status: 'generating',
      category: 'bali_news',
      source: 'instagram_scraper',
      news_source_url: `https://instagram.com/${newsItem.source_account}`,
      news_title: newsItem.caption_text?.slice(0, 200) || null,
    })
    .select()
    .single()

  if (insertError || !post) {
    throw new Error(`Failed to create mixed news post: ${insertError?.message}`)
  }

  try {
    // Fetch recent captions for dedup
    const recentCaps = await getRecentCaptions()

    // Generate mixed caption (with dedup)
    const content = await generateMixedCaption(
      newsItem.caption_text || '',
      newsItem.source_account,
      undefined,
      recentCaps
    )

    // Use the scraped image (already stored in Supabase), fallback to Unsplash
    let imageUrl = newsItem.image_stored_url
    let storagePath = newsItem.image_storage_path
    let unsplashId: string | undefined

    if (!imageUrl) {
      const fallback = await fetchAndStoreImage('Bali lifestyle', post.id)
      imageUrl = fallback.publicUrl
      storagePath = fallback.storagePath
      unsplashId = fallback.unsplashPhotoId
    }

    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    const metadata: Record<string, unknown> = {
      scraped_news_id: newsItem.id,
      source_account: newsItem.source_account,
    }
    if (unsplashId) metadata.unsplash_photo_id = unsplashId

    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        caption: content.caption,
        hashtags: content.hashtags,
        image_url: imageUrl,
        image_storage_path: storagePath,
        status: finalStatus,
        metadata,
      })
      .eq('id', post.id)
      .select()
      .single()

    // Mark scraped item as used
    await markScrapedAsUsed(newsItem.id, post.id)

    await logActivity('mixed_post_generated', `Mixed news+visa post from @${newsItem.source_account}`, post.id)

    return updatedPost as InstagramPost
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', post.id)

    await logActivity('mixed_post_failed', message, post.id, 'error')
    throw error
  }
}

/**
 * Generate a Story post from scraped Bali news, or fall back to topic + Unsplash
 */
export async function generateStoryPost(): Promise<InstagramPost | null> {
  const supabase = getSupabaseAdmin()

  const scrapedItems = await getUnusedScrapedNews(1)
  const newsItem = scrapedItems.length > 0 ? scrapedItems[0] : null
  const useScrapedNews = !!newsItem

  // Pick category and topic for fallback
  const category = useScrapedNews ? 'bali_news' : await getTodayCategory()
  const topics = TOPIC_POOLS[category] || TOPIC_POOLS['visa_tip']
  const fallbackTopic = topics[Math.floor(Math.random() * topics.length)]

  // Create placeholder post
  const { data: post, error: insertError } = await supabase
    .from('instagram_posts')
    .insert({
      status: 'generating',
      category,
      source: useScrapedNews ? 'instagram_scraper' : 'ai_generated',
      media_type: 'STORIES',
      news_source_url: useScrapedNews ? `https://instagram.com/${newsItem!.source_account}` : null,
      news_title: useScrapedNews ? newsItem!.caption_text?.slice(0, 200) : null,
    })
    .select()
    .single()

  if (insertError || !post) {
    throw new Error(`Failed to create story post: ${insertError?.message}`)
  }

  try {
    // Generate story overlay text
    const storyText = useScrapedNews
      ? await generateStoryText(newsItem!.caption_text || '', newsItem!.source_account)
      : await generateStoryTextFromTopic(fallbackTopic)

    // Get image: scraped or Unsplash
    let sourceImageUrl: string | null = null
    let unsplashId: string | undefined

    if (useScrapedNews) {
      sourceImageUrl = newsItem!.image_stored_url || newsItem!.image_url
    }

    if (!sourceImageUrl) {
      // Fallback to Unsplash (with dedup)
      const [usedIds, recentQueries] = await Promise.all([
        getUsedUnsplashIds(),
        getRecentImageQueries(),
      ])
      // Pick a search query that avoids recent ones
      let searchQuery = useScrapedNews ? 'Bali lifestyle' : fallbackTopic.split(' ').slice(0, 3).join(' ')
      const recentSet = new Set(recentQueries.map(q => q.toLowerCase()))
      if (recentSet.has(searchQuery.toLowerCase())) {
        searchQuery = `Bali ${fallbackTopic.split(' ').pop() || 'tropical'}`
      }
      const { publicUrl: unsplashUrl, unsplashPhotoId } = await fetchAndStoreImage(searchQuery, `story-src-${post.id}`, usedIds)
      sourceImageUrl = unsplashUrl
      unsplashId = unsplashPhotoId
    }

    // Generate story image (crop to 9:16, add overlay)
    const { storagePath, publicUrl } = await generateStoryImage(
      sourceImageUrl,
      storyText,
      post.id
    )

    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    const metadata: Record<string, unknown> = { story_text: storyText }
    if (useScrapedNews) {
      metadata.scraped_news_id = newsItem!.id
      metadata.source_account = newsItem!.source_account
    }
    if (unsplashId) metadata.unsplash_photo_id = unsplashId

    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        caption: `${storyText.line1} — ${storyText.line2}`,
        hashtags: ['balivisaassist', 'balivisa', category === 'bali_news' ? 'balinews' : category.replace('_', '')],
        image_url: publicUrl,
        image_storage_path: storagePath,
        media_type: 'STORIES',
        status: finalStatus,
        metadata,
      })
      .eq('id', post.id)
      .select()
      .single()

    if (useScrapedNews) {
      await markScrapedAsUsed(newsItem!.id, post.id)
    }

    const source = useScrapedNews ? `@${newsItem!.source_account}` : `topic: ${fallbackTopic}`
    await logActivity('story_generated', `Story from ${source}`, post.id)

    return updatedPost as InstagramPost
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', post.id)

    await logActivity('story_failed', message, post.id, 'error')
    throw error
  }
}

/**
 * Generate a Reel post from scraped Bali news or topic + Unsplash (Ken Burns video + music)
 */
export async function generateReelPost(): Promise<InstagramPost | null> {
  const supabase = getSupabaseAdmin()

  const scrapedItems = await getUnusedScrapedNews(1)
  const newsItem = scrapedItems.length > 0 ? scrapedItems[0] : null
  const useScrapedNews = !!newsItem

  // Pick category and topic for fallback
  const category = useScrapedNews ? 'bali_news' : await getTodayCategory()
  const topics = TOPIC_POOLS[category] || TOPIC_POOLS['visa_tip']
  const fallbackTopic = topics[Math.floor(Math.random() * topics.length)]

  // Create placeholder post
  const { data: post, error: insertError } = await supabase
    .from('instagram_posts')
    .insert({
      status: 'generating',
      category,
      source: useScrapedNews ? 'instagram_scraper' : 'ai_generated',
      media_type: 'REELS',
      news_source_url: useScrapedNews ? `https://instagram.com/${newsItem!.source_account}` : null,
      news_title: useScrapedNews ? newsItem!.caption_text?.slice(0, 200) : null,
    })
    .select()
    .single()

  if (insertError || !post) {
    throw new Error(`Failed to create reel post: ${insertError?.message}`)
  }

  try {
    // Generate reel overlay text + caption
    const reelText = useScrapedNews
      ? await generateReelText(newsItem!.caption_text || '', newsItem!.source_account)
      : await generateReelTextFromTopic(fallbackTopic)

    // Get image: scraped or Unsplash
    let sourceImageUrl: string | null = null
    let unsplashId: string | undefined

    if (useScrapedNews) {
      sourceImageUrl = newsItem!.image_stored_url || newsItem!.image_url
    }

    if (!sourceImageUrl) {
      // Fallback to Unsplash (with dedup)
      const [usedIds, recentQueries] = await Promise.all([
        getUsedUnsplashIds(),
        getRecentImageQueries(),
      ])
      let searchQuery = useScrapedNews ? 'Bali lifestyle' : fallbackTopic.split(' ').slice(0, 3).join(' ')
      const recentSet = new Set(recentQueries.map(q => q.toLowerCase()))
      if (recentSet.has(searchQuery.toLowerCase())) {
        searchQuery = `Bali ${fallbackTopic.split(' ').pop() || 'tropical'}`
      }
      const { publicUrl: unsplashUrl, unsplashPhotoId } = await fetchAndStoreImage(searchQuery, `reel-src-${post.id}`, usedIds)
      sourceImageUrl = unsplashUrl
      unsplashId = unsplashPhotoId
    }

    // Generate reel video (Ken Burns zoom + text overlays + music)
    const { storagePath, publicUrl } = await generateReelVideo(
      sourceImageUrl,
      { hook: reelText.hook, detail: reelText.detail, cta: reelText.cta },
      post.id
    )

    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    const metadata: Record<string, unknown> = { reel_text: reelText }
    if (useScrapedNews) {
      metadata.scraped_news_id = newsItem!.id
      metadata.source_account = newsItem!.source_account
    }
    if (unsplashId) metadata.unsplash_photo_id = unsplashId

    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        caption: reelText.caption,
        hashtags: reelText.hashtags,
        image_url: publicUrl,
        image_storage_path: storagePath,
        media_type: 'REELS',
        status: finalStatus,
        metadata,
      })
      .eq('id', post.id)
      .select()
      .single()

    if (useScrapedNews) {
      await markScrapedAsUsed(newsItem!.id, post.id)
    }

    const source = useScrapedNews ? `@${newsItem!.source_account}` : `topic: ${fallbackTopic}`
    await logActivity('reel_generated', `Reel from ${source}`, post.id)

    return updatedPost as InstagramPost
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', post.id)

    await logActivity('reel_failed', message, post.id, 'error')
    throw error
  }
}

/**
 * Publish all approved posts that are scheduled for now or earlier
 */
export async function publishApprovedPosts(): Promise<number> {
  const supabase = getSupabaseAdmin()
  let config = await getConfig()

  if (!config || !config.is_active) {
    await logActivity('publish_skipped', 'Instagram automation is not active', undefined, 'warning')
    return 0
  }

  config = await ensureValidToken(config)

  // Get approved posts ready to publish
  const { data: posts } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('status', 'approved')
    .or(`scheduled_for.is.null,scheduled_for.lte.${new Date().toISOString()}`)
    .order('created_at', { ascending: true })

  if (!posts || posts.length === 0) return 0

  let published = 0

  for (const post of posts) {
    try {
      if (!post.image_url || !post.caption) {
        await logActivity('publish_skipped', 'Post missing image or caption', post.id, 'warning')
        continue
      }

      // Atomically claim the post — only update if still 'approved' to prevent duplicates
      const { data: claimed } = await supabase
        .from('instagram_posts')
        .update({ status: 'publishing' })
        .eq('id', post.id)
        .eq('status', 'approved')
        .select('id')
        .single()

      if (!claimed) {
        // Another process already claimed this post
        continue
      }

      // Build full caption with hashtags
      const hashtagString = (post.hashtags as string[])
        .map((h: string) => `#${h}`)
        .join(' ')
      const fullCaption = `${post.caption}\n\n${hashtagString}`

      // Publish to Instagram
      const result = await publishToInstagram(
        config,
        post.image_url,
        fullCaption,
        (post.media_type as 'IMAGE' | 'VIDEO' | 'STORIES' | 'REELS') || 'IMAGE'
      )

      // Update post as published
      await supabase
        .from('instagram_posts')
        .update({
          status: 'published',
          published_at: new Date().toISOString(),
          ig_media_id: result.mediaId,
          ig_container_id: result.containerId,
          ig_permalink: result.permalink,
        })
        .eq('id', post.id)

      // Link to content calendar
      const today = new Date().toISOString().split('T')[0]
      await supabase
        .from('content_calendar')
        .upsert({
          date: today,
          category: post.category || 'visa_tip',
          post_id: post.id,
        })

      await logActivity('post_published', `Published to Instagram: ${result.permalink}`, post.id)
      published++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      const retryCount = (post.retry_count || 0) + 1

      await supabase
        .from('instagram_posts')
        .update({
          status: retryCount >= 3 ? 'failed' : 'approved',
          error_message: message,
          retry_count: retryCount,
        })
        .eq('id', post.id)

      await logActivity('publish_failed', message, post.id, 'error')
    }
  }

  return published
}

/**
 * Retry generating images for posts stuck in image_pending
 */
export async function retryPendingImages(): Promise<number> {
  const supabase = getSupabaseAdmin()

  const { data: posts } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('status', 'image_pending')
    .lt('retry_count', 3)

  if (!posts || posts.length === 0) return 0

  const usedIds = await getUsedUnsplashIds()
  let retried = 0

  for (const post of posts) {
    try {
      if (!post.image_prompt) continue

      const { storagePath, publicUrl, unsplashPhotoId } = await fetchAndStoreImage(
        post.image_prompt,
        post.id,
        usedIds
      )

      // Add the newly used ID to the exclude list for subsequent retries
      usedIds.push(unsplashPhotoId)

      const config = await getConfig()
      const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

      const existingMetadata = post.metadata && typeof post.metadata === 'object' ? post.metadata : {}

      await supabase
        .from('instagram_posts')
        .update({
          image_url: publicUrl,
          image_storage_path: storagePath,
          status: finalStatus,
          metadata: { ...existingMetadata, unsplash_photo_id: unsplashPhotoId },
        })
        .eq('id', post.id)

      await logActivity('image_retry_success', 'Image generated on retry', post.id)
      retried++
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      await supabase
        .from('instagram_posts')
        .update({
          retry_count: (post.retry_count || 0) + 1,
          error_message: message,
        })
        .eq('id', post.id)

      await logActivity('image_retry_failed', message, post.id, 'error')
    }
  }

  return retried
}
