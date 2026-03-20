import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentInvoice } from '@/lib/xendit'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { getServiceBySlug } from '@/data/services'

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = getClientIP(request.headers)
  const rateLimit = checkRateLimit(`checkout:${ip}`)
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 })
  }

  try {
    const body = await request.json()
    const {
      service_slug,
      first_name,
      last_name,
      email,
      whatsapp_number,
      nationality,
      passport_number,
    } = body

    // Validate required fields
    if (!service_slug || !first_name || !last_name || !whatsapp_number || !nationality || !passport_number) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate service exists
    const service = getServiceBySlug(service_slug)
    if (!service) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if customer already exists by passport number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingCustomer } = await (supabase.from('customers') as any)
      .select('id, first_name, last_name, email')
      .eq('passport_number', passport_number)
      .maybeSingle()

    let customerId: string

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      // Create customer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newCustomer, error: customerError } = await (supabase.from('customers') as any)
        .insert({
          first_name,
          last_name,
          email: email || null,
          whatsapp_number,
          nationality,
          passport_number,
          source: 'checkout',
        })
        .select('id')
        .single()

      if (customerError || !newCustomer) {
        console.error('Checkout customer create error:', customerError)
        return NextResponse.json({ error: 'Failed to save your information' }, { status: 500 })
      }
      customerId = newCustomer.id
    }

    // Create application
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: application, error: appError } = await (supabase.from('applications') as any)
      .insert({
        customer_id: customerId,
        service_id: service.id,
        service_name: service.name,
        status: 'new',
        priority: 'normal',
        notes: `Online checkout for ${service.name}`,
      })
      .select('id, application_number')
      .single()

    if (appError || !application) {
      console.error('Checkout application create error:', appError)
      return NextResponse.json({ error: 'Failed to create application' }, { status: 500 })
    }

    // Create payment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: payment, error: paymentError } = await (supabase as any)
      .from('payments')
      .insert({
        application_id: application.id,
        amount: service.startingPrice,
        payment_method: 'xendit',
        payment_status: 'pending',
        notes: `Online checkout - ${service.name}`,
      })
      .select('id')
      .single()

    if (paymentError || !payment) {
      console.error('Checkout payment create error:', paymentError)
      return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }

    // Create Xendit invoice
    const invoice = await createPaymentInvoice({
      paymentId: payment.id,
      amount: service.startingPrice,
      customerName: `${first_name} ${last_name}`,
      customerEmail: email || undefined,
      serviceName: service.name,
      applicationNumber: application.application_number,
    })

    // Update payment with Xendit details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('payments')
      .update({
        xendit_invoice_id: invoice.invoiceId,
        xendit_payment_url: invoice.invoiceUrl,
        xendit_expires_at: invoice.expiresAt,
      })
      .eq('id', payment.id)

    // Log activity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('activity_logs').insert({
      application_id: application.id,
      action: 'checkout_payment_created',
      description: `Online checkout payment for ${service.name} - IDR ${service.startingPrice.toLocaleString('id-ID')}`,
      metadata: {
        payment_id: payment.id,
        xendit_invoice_id: invoice.invoiceId,
        source: 'public_checkout',
      },
    })

    return NextResponse.json({
      payment_url: invoice.invoiceUrl,
      application_number: application.application_number,
    }, { status: 201 })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
