import { Metadata } from 'next';
import legalData from '@/data/legal.json';

export const metadata: Metadata = {
  title: 'Terms of Service - BaliVisaAssist',
  description: 'Terms of Service for BaliVisaAssist, operated by PT CIPTA SOLUSI GLOBAL. Read our terms and conditions for using our visa assistance services.',
};

export default function TermsOfServicePage() {
  const { termsOfService } = legalData;

  return (
    <div className="py-20 sm:py-28 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
            Terms of Service
          </h1>
          <p className="text-gray-200 mb-10 drop-shadow-md">
            Last Updated: {termsOfService.lastUpdated}
          </p>

          <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 sm:p-10 border border-white/30 shadow-2xl">
            <div className="space-y-8">
              {termsOfService.sections.map((section, index) => (
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
