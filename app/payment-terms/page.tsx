import { Metadata } from 'next'
import { COMPANY } from '@/constants/company'

export const metadata: Metadata = {
  title: 'Payment Terms',
  description: 'Payment terms, accepted methods, and bank transfer details for BaliVisaAssist visa services.',
  alternates: { canonical: '/payment-terms' },
}

export default function PaymentTermsPage() {
  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Payment Terms
          </h1>
          <p className="text-xs text-gray-400 mb-10">
            Last Updated: March 2026
          </p>

          <div className="space-y-10">
            {/* Payment Policy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Payment Policy
              </h2>
              <div className="text-sm text-gray-500 leading-relaxed space-y-2">
                <p>
                  Full payment is required before we begin processing any visa application or service. This ensures we can dedicate our resources to your case and begin work immediately.
                </p>
                <p>
                  Once payment is confirmed, our team will start processing your application and keep you updated via WhatsApp throughout the process.
                </p>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Accepted Payment Methods
              </h2>
              <div className="text-sm text-gray-500 leading-relaxed space-y-2">
                <p>We accept the following payment methods:</p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li><strong className="text-gray-700">Bank Transfer</strong> — Direct transfer to our company bank account (details below)</li>
                  <li><strong className="text-gray-700">QRIS</strong> — Scan and pay via any QRIS-compatible app (GoPay, OVO, Dana, ShopeePay, etc.)</li>
                  <li><strong className="text-gray-700">Cash</strong> — Payment in person at our Canggu office</li>
                </ul>
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Bank Transfer Details
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Bank</span>
                    <span className="text-sm font-semibold text-gray-900">{COMPANY.banking.bankName}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Account Number</span>
                    <span className="text-sm font-semibold text-gray-900 font-mono">{COMPANY.banking.accountNumber}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-sm text-gray-500 w-32 flex-shrink-0">Account Name</span>
                    <span className="text-sm font-semibold text-gray-900">{COMPANY.banking.accountHolder}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Please send your payment confirmation (screenshot or transfer receipt) via WhatsApp after completing the transfer.
                </p>
              </div>
            </div>

            {/* Refund Policy */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Refund Policy
              </h2>
              <div className="text-sm text-gray-500 leading-relaxed space-y-2">
                <p>
                  Refund requests are evaluated on a case-by-case basis at the discretion of {COMPANY.legalName}. We strive to be fair and transparent in all refund decisions.
                </p>
                <p>
                  Please note that government fees paid to Indonesian immigration authorities are <strong className="text-gray-700">non-refundable</strong> under any circumstances, as these are collected by the government and cannot be recovered.
                </p>
                <p>
                  For more details, please refer to our{' '}
                  <a href="/refund-policy" className="text-emerald-600 hover:text-emerald-700 underline">
                    Refund Policy
                  </a>.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Questions?
              </h2>
              <div className="text-sm text-gray-500 leading-relaxed space-y-2">
                <p>
                  If you have any questions about payment or need assistance, please contact us:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-1">
                  <li>
                    <strong className="text-gray-700">WhatsApp</strong>:{' '}
                    <a
                      href={`https://wa.me/${COMPANY.whatsapp.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      Message us on WhatsApp
                    </a>
                  </li>
                  <li>
                    <strong className="text-gray-700">Email</strong>:{' '}
                    <a
                      href={`mailto:${COMPANY.email}`}
                      className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                      {COMPANY.email}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
