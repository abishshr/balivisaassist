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
    .from('instagram_config')
    .select('*')
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Mask sensitive fields
  const masked = {
    ...data,
    meta_access_token: data.meta_access_token
      ? `...${data.meta_access_token.slice(-8)}`
      : null,
    meta_app_secret: data.meta_app_secret
      ? `...${data.meta_app_secret.slice(-4)}`
      : null,
  }

  return NextResponse.json({ data: masked })
}

export async function PATCH(request: Request) {
  const supabase = getSupabaseAdmin()
  const body = await request.json()

  // Get existing config
  const { data: existing } = await supabase
    .from('instagram_config')
    .select('id')
    .limit(1)
    .single()

  if (!existing) {
    // Create if not exists
    const { data, error } = await supabase
      .from('instagram_config')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  }

  const { data, error } = await supabase
    .from('instagram_config')
    .update(body)
    .eq('id', existing.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await supabase.from('instagram_activity_log').insert({
    action: 'config_updated',
    details: `Config updated: ${Object.keys(body).join(', ')}`,
    status: 'success',
  })

  return NextResponse.json({ data })
}
