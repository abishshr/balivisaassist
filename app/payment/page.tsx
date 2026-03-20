import { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/constants/company'

export const metadata: Metadata = {
  title: 'Make a Payment',
  description: 'Pay for your BaliVisaAssist visa services via bank transfer, QRIS, or cash at our office.',
  alternates: { canonical: '/payment' },
}

export default function PaymentPage() {
  const whatsappNumber = COMPANY.whatsapp?.replace(/\D/g, '') || ''
  const whatsappMessage = encodeURIComponent(
    'Hi, I would like to make a payment for my visa service. Could you share the details?'
  )

  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Make a Payment
            </h1>
            <p className="text-gray-500">
              Choose your preferred payment method below
            </p>
          </div>

          <div className="space-y-6">
            {/* Bank Transfer */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 0h.008v.008h-.008V7.5Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Bank Transfer</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Bank</span>
                  <span className="text-sm font-semibold text-gray-900">{COMPANY.banking.bankName}</span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <span className="text-sm font-bold text-gray-900 font-mono tracking-wide">{COMPANY.banking.accountNumber}</span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Account Name</span>
                  <span className="text-sm font-semibold text-gray-900">{COMPANY.banking.accountHolder}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-3">
                After transferring, please send your payment receipt or screenshot via WhatsApp so we can confirm it.
              </p>
            </div>

            {/* QRIS */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">QRIS</h2>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Scan and pay using any e-wallet or banking app that supports QRIS — GoPay, OVO, Dana, ShopeePay, LinkAja, and more.
              </p>
              <p className="text-sm text-gray-500">
                Contact us on WhatsApp and we will send you the QRIS code for your payment amount.
              </p>
            </div>

            {/* Cash at Office */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Cash at Office</h2>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                Visit our office in Canggu to pay in person. We accept cash in IDR.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-900">{COMPANY.office.address}</p>
                <p className="text-xs text-gray-400 mt-1">{COMPANY.businessHours}</p>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="bg-[#0F4C5C] rounded-xl p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Ready to pay?</h3>
              <p className="text-sm text-white/70 mb-5">
                Send us a message on WhatsApp and we will confirm your service details and payment amount.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Message us on WhatsApp
              </a>
            </div>

            {/* Note */}
            <p className="text-xs text-gray-400 text-center">
              Full payment is required before we begin processing your visa application.
              See our{' '}
              <Link href="/payment-terms" className="text-emerald-600 hover:underline">
                Payment Terms
              </Link>{' '}
              and{' '}
              <Link href="/refund-policy" className="text-emerald-600 hover:underline">
                Refund Policy
              </Link>{' '}
              for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
