import { Metadata } from 'next';
import { services, PRICING_DISCLAIMER } from '@/data/services';
import { ServiceCard } from '@/components/services/ServiceCard';

export const metadata: Metadata = {
  title: 'Visa Services & Pricing',
  description: 'Comprehensive visa services for Indonesia. 17 visa types including C1, C2, D12, KITAS, extensions, and PT PMA setup. Transparent pricing, fast processing.',
  keywords: 'Indonesia visa services, Bali visa pricing, KITAS cost, retirement visa Indonesia price, digital nomad visa Bali, visa fees Indonesia, VOA extension, C1 extension',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <div>
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Visa Services & Pricing
            </h1>
            <p className="text-lg text-gray-500 mb-6">
              {services.length} services for tourists, digital nomads, retirees, investors, and businesses.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed">
              {PRICING_DISCLAIMER}
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
