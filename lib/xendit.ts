import { Xendit } from 'xendit-node'
import { timingSafeEqual } from 'crypto'
import type { PaymentStatus } from '@/types/application'

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY!,
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://balivisaassist.com'
const INVOICE_DURATION_SECONDS = 24 * 60 * 60 // 24 hours

interface CreateInvoiceParams {
  paymentId: string
  amount: number
  customerName: string
  customerEmail?: string
  serviceName: string
  applicationNumber: string
}

interface CreateInvoiceResult {
  invoiceId: string
  invoiceUrl: string
  expiresAt: string
}

export async function createPaymentInvoice(
  params: CreateInvoiceParams
): Promise<CreateInvoiceResult> {
  const { paymentId, amount, customerName, customerEmail, serviceName, applicationNumber } = params

  const invoice = await xenditClient.Invoice.createInvoice({
    data: {
      externalId: paymentId,
      amount,
      payerEmail: customerEmail || undefined,
      description: `${serviceName} - ${applicationNumber}`,
      invoiceDuration: INVOICE_DURATION_SECONDS,
      currency: 'IDR',
      successRedirectUrl: `${SITE_URL}/payment/success`,
      failureRedirectUrl: `${SITE_URL}/payment/failed`,
      paymentMethods: [
        'CREDIT_CARD',
        'BCA',
        'BNI',
        'BSI',
        'BRI',
        'MANDIRI',
        'PERMATA',
        'SAHABAT_SAMPOERNA',
        'BNC',
        'OVO',
        'DANA',
        'SHOPEEPAY',
        'LINKAJA',
        'QRIS',
      ],
      shouldSendEmail: !!customerEmail,
      customer: {
        givenNames: customerName,
        email: customerEmail || undefined,
      },
      metadata: {
        application_number: applicationNumber,
      },
    },
  })

  return {
    invoiceId: invoice.id!,
    invoiceUrl: invoice.invoiceUrl,
    expiresAt: invoice.expiryDate.toISOString(),
  }
}

export function verifyWebhookToken(token: string | null): boolean {
  const expected = process.env.XENDIT_WEBHOOK_TOKEN
  if (!token || !expected) return false

  try {
    const tokenBuffer = Buffer.from(token)
    const expectedBuffer = Buffer.from(expected)
    if (tokenBuffer.length !== expectedBuffer.length) return false
    return timingSafeEqual(tokenBuffer, expectedBuffer)
  } catch {
    return false
  }
}

export function mapXenditStatus(status: string): PaymentStatus {
  switch (status) {
    case 'PAID':
    case 'SETTLED':
      return 'received'
    case 'EXPIRED':
      return 'expired'
    default:
      return 'pending'
  }
}
