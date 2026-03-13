import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyWebhookToken, mapXenditStatus } from '@/lib/xendit'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface PaymentRecord {
  id: string
  payment_status: string
  application_id: string
}

export async function POST(request: Request) {
  // Verify webhook token
  const callbackToken = request.headers.get('x-callback-token')
  if (!verifyWebhookToken(callbackToken)) {
    console.error('Webhook: invalid callback token')
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  const body = await request.json()
  const {
    external_id: externalId,
    id: xenditInvoiceId,
    status,
    payment_method: paymentMethod,
    payment_channel: paymentChannel,
    paid_at: paidAt,
  } = body

  if (!externalId || !status) {
    // Always return 200 to prevent Xendit retries
    console.error('Webhook: missing external_id or status', body)
    return NextResponse.json({ received: true })
  }

  const supabase = getSupabaseAdmin()

  // Look up payment by external_id (payment UUID), fall back to xendit_invoice_id
  let { data: payment } = await supabase
    .from('payments')
    .select('id, payment_status, application_id')
    .eq('id', externalId)
    .single() as { data: PaymentRecord | null }

  if (!payment && xenditInvoiceId) {
    const result = await supabase
      .from('payments')
      .select('id, payment_status, application_id')
      .eq('xendit_invoice_id', xenditInvoiceId)
      .single() as { data: PaymentRecord | null }
    payment = result.data
  }

  if (!payment) {
    console.error('Webhook: payment not found', { externalId, xenditInvoiceId })
    return NextResponse.json({ received: true })
  }

  // Idempotent: skip if already in terminal state
  if (payment.payment_status === 'received' || payment.payment_status === 'verified') {
    return NextResponse.json({ received: true })
  }

  const newStatus = mapXenditStatus(status)

  // Update payment record
  const { error: updateError } = await supabase
    .from('payments')
    .update({
      payment_status: newStatus,
      xendit_payment_method: paymentMethod || null,
      xendit_payment_channel: paymentChannel || null,
      payment_date: paidAt || (newStatus === 'received' ? new Date().toISOString() : null),
    })
    .eq('id', payment.id)

  if (updateError) {
    console.error('Webhook: failed to update payment', updateError)
  }

  // On successful payment, auto-advance application from 'new' -> 'documents_pending'
  if (newStatus === 'received') {
    const { data: application } = await supabase
      .from('applications')
      .select('status')
      .eq('id', payment.application_id)
      .single() as { data: { status: string } | null }

    if (application && application.status === 'new') {
      await supabase
        .from('applications')
        .update({ status: 'documents_pending' })
        .eq('id', payment.application_id)
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      application_id: payment.application_id,
      action: 'payment_received',
      description: `Payment received via Xendit (${paymentChannel || paymentMethod || 'unknown'})`,
      metadata: {
        payment_id: payment.id,
        xendit_invoice_id: xenditInvoiceId,
        payment_method: paymentMethod,
        payment_channel: paymentChannel,
      },
    })
  }

  // Always return 200 to prevent retries
  return NextResponse.json({ received: true })
}
