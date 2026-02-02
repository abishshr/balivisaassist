import { Metadata } from 'next';
import { services, PRICING_DISCLAIMER } from '@/data/services';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ComplianceDisclaimer } from '@/components/sections/ComplianceDisclaimer';
import { CTASection } from '@/components/sections/CTASection';
import { AlertCircle } from 'lucide-react';
import { BaliWatermark } from '@/components/layout/BaliBackground';

export const metadata: Metadata = {
  title: 'Visa Services & Pricing - BaliVisaAssist',
  description: 'Comprehensive visa services for Indonesia. C1 Visa, KITAS, Retirement Visa, Digital Nomad Visa, Investor Visa, PT PMA setup. Transparent pricing, fast processing.',
  keywords: 'Indonesia visa services, Bali visa pricing, KITAS cost, retirement visa Indonesia price, digital nomad visa Bali, visa fees Indonesia',
};

export default function ServicesPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <BaliWatermark />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Indonesia Visa Services & Pricing
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              Transparent pricing for all visa types. Choose the right visa for your needs
              and get started today.
            </p>

            {/* Pricing Disclaimer */}
            <div className="inline-flex items-start gap-3 bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 text-left max-w-2xl shadow-xl">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-white drop-shadow-sm">
                {PRICING_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Disclaimer */}
      <ComplianceDisclaimer />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
