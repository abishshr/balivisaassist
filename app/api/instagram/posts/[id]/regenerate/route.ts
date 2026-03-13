import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import {
  regenerateCaption,
  generateStoryTextFromTopic,
  generateReelTextFromTopic,
} from '@/lib/instagram/content-generator'
import { fetchAndStoreImage } from '@/lib/instagram/image-generator'
import { generateStoryImage } from '@/lib/instagram/story-generator'
import { generateReelVideo } from '@/lib/instagram/reel-generator'
import type { ContentCategory } from '@/types/instagram'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const body = await request.json().catch(() => ({}))

  const { data: post, error: fetchError } = await supabase
    .from('instagram_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  try {
    const updates: Record<string, unknown> = { status: 'generating' }
    await supabase.from('instagram_posts').update(updates).eq('id', id)

    const metadata = (post.metadata as Record<string, unknown>) || {}
    const category = (post.category as ContentCategory) || 'visa_tip'

    if (post.media_type === 'STORIES') {
      // Regenerate story: new text + new overlay image
      const topic = post.news_title || category.replace('_', ' ')
      const storyText = await generateStoryTextFromTopic(topic)

      updates.caption = `${storyText.line1} — ${storyText.line2}`

      // Always fetch a new source image for stories — the image IS the content
      const searchQuery = `Bali ${topic.split(' ').slice(0, 3).join(' ')}`.trim() || 'Bali lifestyle'
      const { publicUrl: imageUrl, unsplashPhotoId } = await fetchAndStoreImage(searchQuery, `story-src-${post.id}`, undefined, 'portrait')

      // Generate the story overlay image
      const { storagePath, publicUrl } = await generateStoryImage(
        imageUrl,
        storyText,
        post.id
      )

      updates.image_url = publicUrl
      updates.image_storage_path = storagePath
      updates.metadata = { ...metadata, story_text: storyText, unsplash_photo_id: unsplashPhotoId }
    } else if (post.media_type === 'REELS') {
      // Regenerate reel: new text + new video
      const topic = post.news_title || category.replace('_', ' ')
      const reelText = await generateReelTextFromTopic(topic)

      updates.caption = reelText.caption
      updates.hashtags = reelText.hashtags

      // For reels, we always need a source image to rebuild the video
      const searchQuery = `Bali ${topic.split(' ').slice(0, 3).join(' ')}`.trim() || 'Bali lifestyle'
      const { publicUrl: srcUrl, unsplashPhotoId } = await fetchAndStoreImage(searchQuery, `reel-src-${post.id}`, undefined, 'portrait')

      // Generate the reel video
      const { storagePath, publicUrl, musicTrack } = await generateReelVideo(
        srcUrl,
        { hook: reelText.hook, detail: reelText.detail, cta: reelText.cta },
        post.id
      )

      updates.image_url = publicUrl
      updates.image_storage_path = storagePath
      updates.metadata = { ...metadata, reel_text: reelText, music_track: musicTrack, unsplash_photo_id: unsplashPhotoId }
    } else {
      // IMAGE posts: existing behavior (caption + optional image)
      const { caption, hashtags } = await regenerateCaption(
        post.caption || '',
        category,
        body.feedback
      )

      updates.caption = caption
      updates.hashtags = hashtags

      if (body.regenerate_image && post.image_prompt) {
        const { storagePath, publicUrl, unsplashPhotoId } = await fetchAndStoreImage(
          post.image_prompt,
          post.id
        )
        updates.image_url = publicUrl
        updates.image_storage_path = storagePath
        updates.metadata = { ...metadata, unsplash_photo_id: unsplashPhotoId }
      }
    }

    updates.status = 'pending_review'
    updates.error_message = null

    const { data: updated } = await supabase
      .from('instagram_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    await supabase.from('instagram_activity_log').insert({
      action: 'post_regenerated',
      post_id: id,
      details: `Regenerated ${post.media_type || 'IMAGE'}${body.regenerate_image ? ' with new image' : ''}`,
      status: 'success',
    })

    return NextResponse.json({ data: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await supabase
      .from('instagram_posts')
      .update({ status: 'failed', error_message: message })
      .eq('id', id)

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
