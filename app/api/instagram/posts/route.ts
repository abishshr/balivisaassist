import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin()
  const { searchParams } = new URL(request.url)

  const status = searchParams.get('status')
  const category = searchParams.get('category')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = parseInt(searchParams.get('offset') || '0')

  let query = supabase
    .from('instagram_posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) query = query.eq('status', status)
  if (category) query = query.eq('category', category)

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data, count, limit, offset })
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()

  const { data, error } = await supabase
    .from('instagram_posts')
    .insert({
      caption: body.caption,
      hashtags: body.hashtags || [],
      image_url: body.image_url,
      image_prompt: body.image_prompt,
      media_type: body.media_type || 'IMAGE',
      status: body.status || 'pending_review',
      category: body.category,
      source: 'manual',
      scheduled_for: body.scheduled_for,
      created_by: 'admin',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
