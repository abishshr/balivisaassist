'use client'

import { MessageCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { getServiceBySlug } from '@/data/services'

interface DocumentChecklistButtonProps {
  serviceId: string
  serviceName: string
  customerName: string
  whatsappNumber: string
}

function generateChecklistMessage(
  serviceId: string,
  serviceName: string,
  customerName: string
): string {
  const service = getServiceBySlug(serviceId)
  const firstName = customerName.split(' ')[0]

  const requirements = service?.requirements || []

  const checklist = requirements
    .map((req) => `- ${req}`)
    .join('\n')

  return [
    `Hi ${firstName}!`,
    ``,
    `Here's the document checklist for your *${serviceName}* application:`,
    ``,
    checklist,
    ``,
    `Please send clear photos or scans of each document right here on WhatsApp. We'll review and get your application started right away!`,
    ``,
    `If you have any questions about any of the items, just ask.`,
    ``,
    `- BaliVisaAssist`,
  ].join('\n')
}

export function DocumentChecklistButton({
  serviceId,
  serviceName,
  customerName,
  whatsappNumber,
}: DocumentChecklistButtonProps) {
  const [copied, setCopied] = useState(false)

  const message = generateChecklistMessage(serviceId, serviceName, customerName)

  const handleSendWhatsApp = () => {
    const cleanPhone = whatsappNumber.replace(/\D/g, '')
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSendWhatsApp}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
      >
        <MessageCircle className="w-4 h-4" />
        Send Document Checklist
      </button>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors"
        title="Copy checklist to clipboard"
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-500" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
