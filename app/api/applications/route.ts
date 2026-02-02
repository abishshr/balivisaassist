import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        customer:customers (
          id,
          first_name,
          last_name,
          email,
          whatsapp_number,
          nationality
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        customer_id: body.customer_id,
        service_id: body.service_id,
        service_name: body.service_name,
        quoted_price: body.quoted_price,
        status: body.status || 'new',
        priority: body.priority || 'normal',
        desired_start_date: body.desired_start_date || null,
        created_by: user.id,
      } as any)
      .select(`
        *,
        customer:customers (
          id,
          first_name,
          last_name,
          email,
          whatsapp_number,
          nationality
        )
      `)
      .single()

    if (error) {
      console.error('Error creating application:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    if (application) {
      await supabase.from('activity_logs').insert({
        application_id: (application as any).id,
        user_id: user.id,
        action: 'application_created',
        description: `Application ${(application as any).application_number} created`,
      } as any)
    }

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
