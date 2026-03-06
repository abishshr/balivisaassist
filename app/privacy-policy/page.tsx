import { Metadata } from 'next';
import legalData from '@/data/legal.json';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for BaliVisaAssist, operated by CIPTA SOLUSI GLOBAL. Learn how we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  const { privacyPolicy } = legalData;

  return (
    <div className="py-12 sm:py-16 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 mb-10">
            Last Updated: {privacyPolicy.lastUpdated}
          </p>

          <div className="space-y-10">
            {privacyPolicy.sections.map((section, index) => (
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
