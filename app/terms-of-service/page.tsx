import { Metadata } from 'next';
import legalData from '@/data/legal.json';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for BaliVisaAssist, operated by CIPTA SOLUSI GLOBAL. Read our terms and conditions for using our visa assistance services.',
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsOfServicePage() {
  const { termsOfService } = legalData;

  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-400 mb-10">
            Last Updated: {termsOfService.lastUpdated}
          </p>

          <div className="space-y-10">
            {termsOfService.sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {section.title}
                </h2>
                <div className="text-sm text-gray-500 whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
