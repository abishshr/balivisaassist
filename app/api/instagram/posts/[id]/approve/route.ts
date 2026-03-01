import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('instagram_posts')
    .update({ status: 'approved' })
    .eq('id', id)
    .in('status', ['pending_review'])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json(
      { error: 'Post not found or not in reviewable state' },
      { status: 400 }
    )
  }

  await supabase.from('instagram_activity_log').insert({
    action: 'post_approved',
    post_id: id,
    details: 'Post approved for publishing',
    status: 'success',
  })

  return NextResponse.json({ data })
}
