import { createClient } from '@supabase/supabase-js'
import { generateContent, generateNewsCaption } from './content-generator'
import { fetchAndStoreImage } from './image-generator'
import { publishToInstagram } from './api'
import { ensureValidToken } from './token-manager'
import { WEEKLY_ROTATION } from './constants'
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

    // Generate content with Claude
    const content = await generateContent(postCategory, template, customTopic)

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

    // Fetch photo from Unsplash and store
    const { storagePath, publicUrl } = await fetchAndStoreImage(
      content.imageSearchQuery,
      post.id
    )

    // Get auto-approve setting
    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    // Update post with image
    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        image_url: publicUrl,
        image_storage_path: storagePath,
        status: finalStatus,
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
    // Generate caption from news
    const content = await generateNewsCaption(newsTitle, newsDescription, newsUrl)

    await supabase
      .from('instagram_posts')
      .update({
        caption: content.caption,
        hashtags: content.hashtags,
        image_prompt: content.imageSearchQuery,
        status: 'image_pending',
      })
      .eq('id', post.id)

    // Fetch photo from Unsplash and store
    const { storagePath, publicUrl } = await fetchAndStoreImage(
      content.imageSearchQuery,
      post.id
    )

    const config = await getConfig()
    const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

    const { data: updatedPost } = await supabase
      .from('instagram_posts')
      .update({
        image_url: publicUrl,
        image_storage_path: storagePath,
        status: finalStatus,
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

      // Mark as publishing
      await supabase
        .from('instagram_posts')
        .update({ status: 'publishing' })
        .eq('id', post.id)

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

  let retried = 0

  for (const post of posts) {
    try {
      if (!post.image_prompt) continue

      const { storagePath, publicUrl } = await fetchAndStoreImage(
        post.image_prompt,
        post.id
      )

      const config = await getConfig()
      const finalStatus = config?.auto_approve ? 'approved' : 'pending_review'

      await supabase
        .from('instagram_posts')
        .update({
          image_url: publicUrl,
          image_storage_path: storagePath,
          status: finalStatus,
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
