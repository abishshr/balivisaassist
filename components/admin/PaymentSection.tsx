'use client'

import { useState, useEffect, useCallback } from 'react'
import { CreditCard, ExternalLink, Copy, MessageCircle, Loader2, Check, Clock, AlertCircle } from 'lucide-react'
import { COMPANY } from '@/constants/company'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Payment } from '@/types/application'

interface PaymentSectionProps {
  applicationId: string
  applicationNumber: string
  serviceName: string
  quotedPrice: number
  customerName: string
  customerWhatsApp: string
  initialPayments: Payment[]
}

export function PaymentSection({
  applicationId,
  applicationNumber,
  serviceName,
  quotedPrice,
  customerName,
  customerWhatsApp,
  initialPayments,
}: PaymentSectionProps) {
  const [payments, setPayments] = useState<Payment[]>(initialPayments)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Find the active Xendit payment (pending + not expired)
  const activeXenditPayment = payments.find(p =>
    p.payment_method === 'xendit' &&
    p.payment_status === 'pending' &&
    p.xendit_payment_url &&
    p.xendit_expires_at &&
    new Date(p.xendit_expires_at) > new Date()
  )

  // Poll for status updates on pending Xendit payments
  const pollPaymentStatus = useCallback(async () => {
    if (!activeXenditPayment) return

    try {
      const res = await fetch(`/api/payments/${activeXenditPayment.id}/status`)
      if (!res.ok) return
      const { payment: updated } = await res.json()

      if (updated.payment_status !== activeXenditPayment.payment_status) {
        setPayments(prev =>
          prev.map(p => p.id === updated.id ? { ...p, ...updated } : p)
        )
      }
    } catch {
      // Silently ignore polling errors
    }
  }, [activeXenditPayment])

  useEffect(() => {
    if (!activeXenditPayment) return
    const interval = setInterval(pollPaymentStatus, 10000)
    return () => clearInterval(interval)
  }, [activeXenditPayment, pollPaymentStatus])

  const handleCreateInvoice = async () => {
    setError(null)
    setCreating(true)

    try {
      const res = await fetch('/api/payments/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, amount: quotedPrice }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create payment link')
      }

      const { payment } = await res.json()
      setPayments(prev => [payment, ...prev])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment link')
    } finally {
      setCreating(false)
    }
  }

  const handleCopyLink = async () => {
    if (!activeXenditPayment?.xendit_payment_url) return
    await navigator.clipboard.writeText(activeXenditPayment.xendit_payment_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendWhatsApp = () => {
    if (!activeXenditPayment?.xendit_payment_url) return

    const phone = customerWhatsApp.replace(/\D/g, '')
    const message = `Hi ${customerName.split(' ')[0]},

Thank you for choosing BaliVisaAssist for your *${serviceName}*.

Here is your payment link:
${activeXenditPayment.xendit_payment_url}

*Amount:* ${formatPrice(quotedPrice)}
*Accepted methods:* Credit/Debit Card, Bank Transfer (BCA, BNI, BRI, Mandiri), E-Wallets (OVO, DANA, ShopeePay, LinkAja), QRIS

This link is valid for 24 hours.

Alternatively, you can pay via direct bank transfer:
Bank: ${COMPANY.banking.bankName}
Account: ${COMPANY.banking.accountNumber}
Name: ${COMPANY.banking.accountHolder}

Please send your payment confirmation after transfer.

Thank you!
— BaliVisaAssist Team`

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank')
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      received: 'bg-green-500/10 text-green-700 dark:text-green-400',
      verified: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      expired: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
      refunded: 'bg-red-500/10 text-red-700 dark:text-red-400',
    }
    return (
      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${styles[status] || styles.pending}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Create Payment Link */}
      {!activeXenditPayment && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            onClick={handleCreateInvoice}
            disabled={creating}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            Create Payment Link
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatPrice(quotedPrice)}
          </span>
        </div>
      )}

      {/* Active Payment Link Actions */}
      {activeXenditPayment && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Payment link active
            </span>
            <span className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
              Expires {formatDate(activeXenditPayment.xendit_expires_at!)}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSendWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Send via WhatsApp
            </button>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
            <a
              href={activeXenditPayment.xendit_payment_url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Payment History */}
      {payments.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Payment History
          </h3>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {payments.map((payment) => (
              <div key={payment.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {formatPrice(payment.amount)}
                  </span>
                  {statusBadge(payment.payment_status)}
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                    {payment.payment_method === 'xendit'
                      ? (payment.xendit_payment_channel || payment.xendit_payment_method || 'Xendit')
                      : (payment.payment_method || '—')}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 flex-shrink-0">
                  {formatDate(payment.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {payments.length === 0 && !activeXenditPayment && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No payments recorded yet.
        </p>
      )}
    </div>
  )
}
