import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('content_templates')
    .select('*')
    .order('category')
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()

  const { data, error } = await supabase
    .from('content_templates')
    .insert({
      name: body.name,
      category: body.category,
      caption_prompt: body.caption_prompt,
      image_prompt_template: body.image_prompt_template,
      hashtag_pool: body.hashtag_pool || [],
      is_active: body.is_active ?? true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 201 })
}
