import { Metadata } from 'next';
import { COMPANY } from '@/constants/company';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund Policy for BaliVisaAssist. Learn about our cancellation, refund conditions, and what happens if your visa application is rejected.',
  alternates: { canonical: '/refund-policy' },
};

export default function RefundPolicyPage() {
  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Refund Policy
          </h1>
          <p className="text-xs text-gray-400 mb-10">
            Last Updated: March 2026
          </p>

          <div className="space-y-10">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Overview</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                At {COMPANY.brandName}, operated by {COMPANY.legalName}, we strive to provide excellent visa assistance services. This refund policy outlines the conditions under which refunds may be issued.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Cancellation by Client</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p><strong className="text-gray-700">Before processing begins:</strong> Full refund minus a 10% administrative fee.</p>
                <p><strong className="text-gray-700">After processing has begun:</strong> Assessed case-by-case. Government fees already paid are non-refundable.</p>
                <p><strong className="text-gray-700">After visa issuance:</strong> No refunds available.</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Application Rejection</h2>
              <div className="space-y-3 text-sm text-gray-500 leading-relaxed">
                <p>If your visa application is rejected by Indonesian immigration authorities:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>We will review the rejection reason and advise on next steps.</li>
                  <li>Government fees paid to immigration authorities are non-refundable.</li>
                  <li>Our service fee may be partially refundable depending on the circumstances.</li>
                  <li>If the rejection is due to our error, we resubmit at no additional charge.</li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Non-Refundable Items</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-gray-500 leading-relaxed">
                <li>Government fees once paid to immigration authorities</li>
                <li>Completed visa extensions</li>
                <li>PT PMA registration fees once submitted</li>
                <li>Completed consultation fees</li>
                <li>Services already rendered (document preparation, translation, etc.)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Refund Process</h2>
              <ol className="list-decimal pl-5 space-y-1.5 text-sm text-gray-500 leading-relaxed">
                <li>Contact us via WhatsApp or email at {COMPANY.email} with your details.</li>
                <li>We review your request within 3 business days.</li>
                <li>If approved, refunds processed within 7-14 business days via original payment method.</li>
                <li>IDR refunds calculated at the exchange rate on the date of refund.</li>
              </ol>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Force Majeure</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                In events beyond our control (natural disasters, pandemics, policy changes, etc.), we work with you to find a suitable solution including rescheduling, alternatives, or partial refund.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Questions?</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                Contact us at{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-[#0F4C5C] hover:underline">
                  {COMPANY.email}
                </a>{' '}
                or via WhatsApp.
              </p>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
              {COMPANY.operatorDisclosure} This refund policy is subject to change. The version in effect at the time of your purchase applies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
