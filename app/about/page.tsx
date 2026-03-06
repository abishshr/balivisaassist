import { Metadata } from 'next';
import { Shield, Users, Clock, Award } from 'lucide-react';
import { COMPANY } from '@/constants/company';
import { CTASection } from '@/components/sections/CTASection';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about BaliVisaAssist, operated by CIPTA SOLUSI GLOBAL. Professional visa assistance services in Indonesia with expert guidance and full compliance.',
  keywords: 'about BaliVisaAssist, CIPTA SOLUSI GLOBAL, Indonesia visa company, Bali visa services',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Legal Compliance',
      description: 'Full compliance with Indonesian immigration laws. Licensed sponsors and strict regulatory adherence.',
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Years of experience navigating Indonesia\'s visa system. Personalized support throughout.',
    },
    {
      icon: Clock,
      title: 'Fast Processing',
      description: 'We know the fastest routes. Most applications processed faster than industry averages.',
    },
    {
      icon: Award,
      title: 'Transparent Pricing',
      description: 'No hidden fees. Government fees, processing, and service fee — all included upfront.',
    },
  ];

  return (
    <div>
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              About BaliVisaAssist
            </h1>
            <p className="text-lg text-gray-500">
              Professional visa assistance operated by CIPTA SOLUSI GLOBAL.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5 text-gray-500 leading-relaxed">
            <p>
              BaliVisaAssist was founded to simplify the complex process of obtaining visas
              and permits for Indonesia. Navigating immigration requirements in a foreign
              country can be overwhelming — we make it straightforward.
            </p>
            <p>
              Operated by <strong className="text-gray-900">CIPTA SOLUSI GLOBAL</strong>, a registered Indonesian company,
              we provide fully compliant visa assistance for tourists, retirees, digital nomads,
              investors, and businesses.
            </p>
            <p>
              Our mission is to make the visa process smooth and stress-free so you can focus
              on what matters — your Indonesian adventure, retirement, business, or remote work.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-8">
              Why Choose Us
            </h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="flex gap-4">
                  <value.icon className="w-5 h-5 text-[#0F4C5C] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Legal Entity */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Legal Entity
            </h2>
            <p className="text-sm text-gray-900 font-medium mb-1">
              {COMPANY.operatorDisclosure}
            </p>
            <p className="text-xs text-gray-400">
              We are not affiliated with the Indonesian government or any government immigration agency.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
