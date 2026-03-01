import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { regenerateCaption } from '@/lib/instagram/content-generator'
import { fetchAndStoreImage } from '@/lib/instagram/image-generator'
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

    // Regenerate caption
    const { caption, hashtags } = await regenerateCaption(
      post.caption || '',
      (post.category as ContentCategory) || 'visa_tip',
      body.feedback
    )

    updates.caption = caption
    updates.hashtags = hashtags

    // Optionally regenerate image
    if (body.regenerate_image && post.image_prompt) {
      const { storagePath, publicUrl } = await fetchAndStoreImage(
        post.image_prompt,
        post.id
      )
      updates.image_url = publicUrl
      updates.image_storage_path = storagePath
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
      details: `Regenerated${body.regenerate_image ? ' with new image' : ''}`,
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
