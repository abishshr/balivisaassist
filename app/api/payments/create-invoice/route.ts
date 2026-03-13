import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPaymentInvoice } from '@/lib/xendit'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import type { Payment } from '@/types/application'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limit
  const ip = getClientIP(request.headers)
  const rateLimit = checkRateLimit(`create-invoice:${ip}`)
  if (!rateLimit.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const body = await request.json()
  const { applicationId, amount } = body as { applicationId: string; amount: number }

  if (!applicationId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'applicationId and positive amount are required' }, { status: 400 })
  }

  // Fetch application with customer
  const { data: appData, error: appError } = await supabase
    .from('applications')
    .select('*, customer:customers(*)')
    .eq('id', applicationId)
    .single()

  if (appError || !appData) {
    return NextResponse.json({ error: 'Application not found' }, { status: 404 })
  }

  const application = appData as unknown as {
    id: string
    application_number: string
    service_name: string
    customer: { first_name: string; last_name: string; email: string | null }
  }
  const customer = application.customer

  // Check for existing active Xendit payment (prevent duplicates)
  const { data: existingRaw } = await supabase
    .from('payments')
    .select('*')
    .eq('application_id', applicationId)

  const existingPayments = (existingRaw || []) as unknown as Payment[]
  const activePayment = existingPayments.find(p =>
    p.payment_method === 'xendit' &&
    p.payment_status === 'pending' &&
    p.xendit_expires_at &&
    new Date(p.xendit_expires_at) > new Date()
  )

  if (activePayment) {
    return NextResponse.json(
      { error: 'An active payment link already exists for this application' },
      { status: 409 }
    )
  }

  // Create payment record in DB first
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: paymentRaw, error: paymentError } = await (supabase as any)
    .from('payments')
    .insert({
      application_id: applicationId,
      amount,
      payment_method: 'xendit',
      payment_status: 'pending',
      recorded_by: user.id,
      notes: 'Xendit payment link',
    })
    .select()
    .single()

  const payment = paymentRaw as Payment | null

  if (paymentError || !payment) {
    console.error('Failed to create payment record:', paymentError)
    return NextResponse.json({ error: 'Failed to create payment record' }, { status: 500 })
  }

  // Call Xendit API
  try {
    const invoice = await createPaymentInvoice({
      paymentId: payment.id,
      amount,
      customerName: `${customer.first_name} ${customer.last_name}`,
      customerEmail: customer.email || undefined,
      serviceName: application.service_name,
      applicationNumber: application.application_number,
    })

    // Update payment with Xendit details
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('payments')
      .update({
        xendit_invoice_id: invoice.invoiceId,
        xendit_payment_url: invoice.invoiceUrl,
        xendit_expires_at: invoice.expiresAt,
      })
      .eq('id', payment.id)

    if (updateError) {
      console.error('Failed to update payment with Xendit details:', updateError)
    }

    // Log activity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('activity_logs').insert({
      application_id: applicationId,
      user_id: user.id,
      action: 'payment_link_created',
      description: `Payment link created for IDR ${amount.toLocaleString('id-ID')}`,
      metadata: {
        payment_id: payment.id,
        xendit_invoice_id: invoice.invoiceId,
      },
    })

    return NextResponse.json({
      payment: {
        id: payment.id,
        xendit_invoice_id: invoice.invoiceId,
        xendit_payment_url: invoice.invoiceUrl,
        xendit_expires_at: invoice.expiresAt,
        amount,
        payment_method: 'xendit',
        payment_status: 'pending',
        created_at: new Date().toISOString(),
      },
    }, { status: 201 })
  } catch (err) {
    console.error('Xendit API error:', err)

    // Clean up orphaned payment record
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('payments').delete().eq('id', payment.id)

    return NextResponse.json(
      { error: 'Failed to create Xendit invoice. Please try again.' },
      { status: 502 }
    )
  }
}
