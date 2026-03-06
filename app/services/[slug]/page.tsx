import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { getServiceBySlug, services, PRICING_DISCLAIMER } from '@/data/services';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { JsonLd } from '@/components/seo/JsonLd';
import { serviceJsonLd, breadcrumbJsonLd, faqPageJsonLd } from '@/lib/structured-data';
import { SEO } from '@/constants/company';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: service.name,
    description: service.description,
    keywords: `${service.name}, Indonesia visa, Bali visa, ${service.category === 'extension' ? 'visa extension Indonesia' : service.category === 'permit' ? 'KITAS Indonesia' : service.category === 'business' ? 'PT PMA Indonesia' : 'Indonesia visa application'}`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: service.name,
      description: service.shortDescription,
    },
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <div>
      <JsonLd data={serviceJsonLd(service)} />
      <JsonLd data={breadcrumbJsonLd([
        { name: 'Home', url: SEO.siteUrl },
        { name: 'Services', url: `${SEO.siteUrl}/services` },
        { name: service.name, url: `${SEO.siteUrl}/services/${service.slug}` },
      ])} />
      {service.faqs.length > 0 && <JsonLd data={faqPageJsonLd(service.faqs)} />}
      {/* Breadcrumb */}
      <div className="pt-6 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#0F4C5C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Services
          </Link>
        </div>
      </div>

      {/* Header */}
      <section className="pt-6 pb-8 sm:pt-8 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {service.popular && (
                <span className="text-[10px] font-semibold text-[#E07A5F] bg-[#E07A5F]/10 px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              {service.isExtension && (
                <span className="text-[10px] font-semibold text-[#0F4C5C] bg-[#0F4C5C]/10 px-2 py-0.5 rounded-full">
                  Extension
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              {service.name}
            </h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              {service.description}
            </p>

            {/* Price / Duration / Processing row */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-1">From</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(service.startingPrice)}
                </p>
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="text-sm font-medium text-gray-900">{service.duration}</p>
                </div>
              </div>
              {service.processingDays && (
                <>
                  <div className="h-8 w-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-400">Processing</p>
                      <p className="text-sm font-medium text-gray-900">{service.processingDays}</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <WhatsAppButton serviceId={service.id} fixed={false} className="text-sm" />
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto text-sm">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Benefits & Features
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#0F4C5C] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Required Documents
            </h2>
            <ol className="space-y-3">
              {service.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full border border-[#0F4C5C] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#0F4C5C]">{index + 1}</span>
                  </span>
                  <p className="text-sm text-gray-600">{requirement}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Application Process
            </h2>
            <div className="space-y-6">
              {service.process.map((step) => (
                <div key={step.step} className="flex gap-4">
                  <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-gray-900">{step.step}</span>
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
              Frequently Asked Questions
            </h2>
            <Accordion>
              {service.faqs.map((faq, index) => (
                <AccordionItem key={index} title={faq.question}>
                  <p>{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-8">
              <Link
                href="/faq"
                className="text-sm font-medium text-gray-400 hover:text-[#0F4C5C] transition-colors"
              >
                View all FAQs &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-10 sm:py-14 relative z-10 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">{PRICING_DISCLAIMER}</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Ready to apply?
            </h2>
            <p className="text-gray-500 mb-6">
              Contact us for a free consultation and personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppButton serviceId={service.id} fixed={false} className="text-sm" />
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto text-sm">Email Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
