import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      first_name,
      last_name,
      email,
      whatsapp_number,
      nationality,
      date_of_birth,
      place_of_birth,
      passport_number,
      passport_expiry,
      indonesia_address,
      indonesia_city,
      indonesia_province,
      indonesia_postal_code,
      indonesia_residence_type,
      service_interest,
    } = body

    // Validate required fields
    if (!first_name || !last_name || !whatsapp_number || !nationality || !passport_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if customer already exists by passport number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase
      .from('customers') as any)
      .select('id')
      .eq('passport_number', passport_number)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'A customer with this passport number already exists. Please contact us via WhatsApp for assistance.' },
        { status: 409 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase
      .from('customers') as any)
      .insert({
        first_name,
        last_name,
        email: email || null,
        whatsapp_number,
        nationality,
        date_of_birth: date_of_birth || null,
        place_of_birth: place_of_birth || null,
        passport_number,
        passport_expiry: passport_expiry || null,
        indonesia_address: indonesia_address || null,
        indonesia_city: indonesia_city || null,
        indonesia_province: indonesia_province || null,
        indonesia_postal_code: indonesia_postal_code || null,
        indonesia_residence_type: indonesia_residence_type || null,
        source: 'onboarding_form',
        notes: service_interest ? `Service interest: ${service_interest}` : null,
      })
      .select('id')
      .single()

    if (error) {
      console.error('Onboard insert error:', error)
      return NextResponse.json(
        { error: 'Failed to save your information. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
