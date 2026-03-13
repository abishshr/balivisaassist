import { Metadata } from 'next'
import { XCircle } from 'lucide-react'
import { COMPANY } from '@/constants/company'

export const metadata: Metadata = {
  title: 'Payment Not Completed',
  robots: { index: false },
}

export default function PaymentFailedPage() {
  const whatsappLink = `https://wa.me/${(COMPANY.whatsapp || '').replace(/\D/g, '')}`

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Payment Not Completed
        </h1>
        <p className="text-gray-600 mb-8">
          Your payment was not completed. If you experienced an issue, please contact us via WhatsApp and we will assist you.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Contact Us on WhatsApp
        </a>
      </div>
    </div>
  )
}
