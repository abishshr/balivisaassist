import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data: customers, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customers })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: customer, error } = await (supabase
      .from('customers') as any)
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email || null,
        whatsapp_number: body.whatsapp_number,
        nationality: body.nationality,
        date_of_birth: body.date_of_birth || null,
        passport_number: body.passport_number || null,
        passport_expiry: body.passport_expiry || null,
        passport_scan_path: body.passport_scan_path || null,
        place_of_birth: body.place_of_birth || null,
        phone_number: body.phone_number || null,
        indonesia_residence_type: body.indonesia_residence_type || null,
        indonesia_address: body.indonesia_address || null,
        indonesia_postal_code: body.indonesia_postal_code || null,
        indonesia_province: body.indonesia_province || null,
        indonesia_city: body.indonesia_city || null,
        notes: body.notes || null,
      })
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating customer:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to update customer' },
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

    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email || null,
        whatsapp_number: body.whatsapp_number,
        nationality: body.nationality,
        date_of_birth: body.date_of_birth || null,
        passport_number: body.passport_number || null,
        passport_expiry: body.passport_expiry || null,
        passport_scan_path: body.passport_scan_path || null,
        place_of_birth: body.place_of_birth || null,
        phone_number: body.phone_number || null,
        indonesia_residence_type: body.indonesia_residence_type || null,
        indonesia_address: body.indonesia_address || null,
        indonesia_postal_code: body.indonesia_postal_code || null,
        indonesia_province: body.indonesia_province || null,
        indonesia_city: body.indonesia_city || null,
        source: body.source || 'whatsapp',
        notes: body.notes || null,
      } as any)
      .select()
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    )
  }
}
