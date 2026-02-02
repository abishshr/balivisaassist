import { Metadata } from 'next';
import legalData from '@/data/legal.json';

export const metadata: Metadata = {
  title: 'Privacy Policy - BaliVisaAssist',
  description: 'Privacy Policy for BaliVisaAssist, operated by PT CIPTA SOLUSI GLOBAL. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  const { privacyPolicy } = legalData;

  return (
    <div className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Privacy Policy
          </h1>
          <p className="text-gray-200 mb-10 drop-shadow-md">
            Last Updated: {privacyPolicy.lastUpdated}
          </p>

          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/30 shadow-2xl">
            <div className="space-y-8">
              {privacyPolicy.sections.map((section, index) => (
                <div key={index}>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 drop-shadow-md">
                    {section.title}
                  </h2>
                  <div className="text-gray-200 whitespace-pre-line leading-relaxed drop-shadow-sm">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
