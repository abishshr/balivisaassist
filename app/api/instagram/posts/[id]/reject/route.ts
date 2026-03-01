import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

  const { data, error } = await supabase
    .from('instagram_posts')
    .update({
      status: 'rejected',
      error_message: body.reason || 'Rejected by admin',
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('instagram_activity_log').insert({
    action: 'post_rejected',
    post_id: id,
    details: body.reason || 'Rejected by admin',
    status: 'success',
  })

  return NextResponse.json({ data })
}
