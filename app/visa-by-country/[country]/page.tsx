import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { countries, getCountryBySlug } from '@/data/countries';
import { services } from '@/data/services';
import { formatPrice } from '@/lib/utils';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/structured-data';
import { SEO } from '@/constants/company';

interface CountryPageProps {
  params: Promise<{ country: string }>;
}

export async function generateStaticParams() {
  return countries.map((country) => ({
    country: country.slug,
  }));
}

export async function generateMetadata({ params }: CountryPageProps): Promise<Metadata> {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    return { title: 'Country Not Found' };
  }

  return {
    title: `Indonesia Visa for ${country.demonym} Citizens`,
    description: `Complete guide to Indonesia visas for ${country.demonym} citizens. ${country.voaEligible ? 'VOA eligible.' : ''} Tourist visas, business visas, KITAS, extensions & more.`,
    keywords: `Indonesia visa ${country.name}, ${country.demonym} visa Indonesia, Bali visa ${country.name}`,
    alternates: { canonical: `/visa-by-country/${country.slug}` },
  };
}

function ServiceRow({ service }: { service: (typeof services)[number] }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="flex items-center justify-between gap-4 bg-white rounded-2xl p-5 border border-gray-200 hover:border-[#0F4C5C]/20 transition-colors duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#0F4C5C] transition-colors">
            {service.name}
          </h3>
          {service.popular && (
            <span className="text-[10px] font-semibold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full">
              Popular
            </span>
          )}
          {service.processingDays && (
            <span className="text-[10px] text-gray-400 hidden sm:inline">{service.processingDays}</span>
          )}
        </div>
        <p className="text-xs text-gray-400 truncate">{service.shortDescription}</p>
      </div>
      <div className="text-right flex-shrink-0 flex items-center gap-3">
        <div>
          <p className="text-[10px] text-gray-400">From</p>
          <p className="text-sm font-bold text-gray-900">{formatPrice(service.startingPrice)}</p>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#0F4C5C] transition-colors" />
      </div>
    </Link>
  );
}

export default async function CountryPage({ params }: CountryPageProps) {
  const { country: slug } = await params;
  const country = getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const availableServices = country.availableVisas
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as typeof services;

  const groups = [
    { key: 'visa' as const, label: 'Visas', items: availableServices.filter((s) => s.category === 'visa') },
    { key: 'extension' as const, label: 'Extensions', items: availableServices.filter((s) => s.category === 'extension') },
    { key: 'permit' as const, label: 'Stay Permits', items: availableServices.filter((s) => s.category === 'permit') },
    { key: 'business' as const, label: 'Business', items: availableServices.filter((s) => s.category === 'business') },
  ].filter((g) => g.items.length > 0);

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: SEO.siteUrl },
        { name: 'Visa by Country', url: `${SEO.siteUrl}/visa-by-country` },
        { name: `${country.demonym} Citizens`, url: `${SEO.siteUrl}/visa-by-country/${country.slug}` },
      ])} />
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
              {country.voaEligible ? 'VOA Eligible' : 'Visa Required'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Indonesia Visa for {country.demonym} Citizens
            </h1>
            <p className="text-lg text-gray-500">
              {country.voaEligible
                ? `Citizens of ${country.name} are eligible for Visa on Arrival. We also offer ${availableServices.length} visa services.`
                : `Complete visa assistance for ${country.name} citizens. ${availableServices.length} services available.`
              }
            </p>
          </div>
        </div>
      </section>

      {/* VOA Notice */}
      {country.voaEligible && (
        <section className="pb-8 relative z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-2xl p-5">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700">
                  {country.demonym} citizens can enter with a Visa on Arrival (30 days, extendable to 60) for IDR 500,000. No pre-application needed.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Service Groups */}
      {groups.map((group) => (
        <section key={group.key} className="py-8 sm:py-10 relative z-10 border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                {group.label}
              </h2>
              <div className="space-y-3">
                {group.items.map((service) => (
                  <ServiceRow key={service.id} service={service} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTASection />
    </div>
  );
}
