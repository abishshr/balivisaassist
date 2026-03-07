'use client'

import { useState } from 'react'
import { FileDown, Loader2, MessageCircle } from 'lucide-react'
import { COMPANY } from '@/constants/company'
import { formatPrice } from '@/lib/utils'

interface AgreementFormProps {
  customerName: string
  nationality: string
  passportNumber: string
  whatsappNumber: string
  email: string
  serviceName: string
  serviceDescription: string
  quotedPrice: number
}

export function AgreementForm({
  customerName,
  nationality,
  passportNumber,
  whatsappNumber,
  email,
  serviceName,
  serviceDescription,
  quotedPrice,
}: AgreementFormProps) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setError(null)
    setGenerating(true)

    try {
      const res = await fetch('/api/agreement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          nationality,
          passportNumber,
          whatsappNumber,
          email,
          serviceName,
          serviceDescription,
          quotedPrice: formatPrice(quotedPrice),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to generate agreement')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Service_Agreement_${customerName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setError('Failed to generate agreement. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleWhatsApp = () => {
    const phone = whatsappNumber.replace(/\D/g, '')
    const message = [
      `Hi ${customerName.split(' ')[0]},`,
      '',
      `Thank you for choosing BaliVisaAssist for your ${serviceName}.`,
      '',
      `Please find the Service Agreement attached. The total is ${formatPrice(quotedPrice)}.`,
      '',
      'Payment details:',
      `Bank: ${COMPANY.banking.bankName}`,
      `Account: ${COMPANY.banking.accountNumber}`,
      `Name: ${COMPANY.banking.accountHolder}`,
      '',
      'We also accept QRIS and cash.',
      '',
      'Please send payment confirmation once completed. We will begin processing immediately after.',
      '',
      'Best regards,',
      'BaliVisaAssist',
    ].join('\n')

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Service Agreement for <strong className="text-zinc-900 dark:text-zinc-100">{customerName}</strong> ({nationality}),
        passport <strong className="text-zinc-900 dark:text-zinc-100">{passportNumber}</strong>.
        Service: <strong className="text-zinc-900 dark:text-zinc-100">{serviceName}</strong> &mdash;{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">{formatPrice(quotedPrice)}</strong>.
      </p>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white text-sm font-medium rounded-md transition-colors"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Generate Agreement PDF
            </>
          )}
        </button>

        {whatsappNumber && (
          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Send via WhatsApp
          </button>
        )}
      </div>
    </div>
  )
}
