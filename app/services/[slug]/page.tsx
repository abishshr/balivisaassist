import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import { getServiceBySlug, services, PRICING_DISCLAIMER } from '@/data/services';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { WhatsAppButton } from '@/components/common/WhatsAppButton';
import { Card, CardBody } from '@/components/ui/Card';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';

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
    return {
      title: 'Service Not Found',
    };
  }

  return {
    title: `${service.name} - BaliVisaAssist`,
    description: service.description,
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
      {/* Breadcrumb */}
      <div className="bg-white/10 backdrop-blur-xl py-4 border-b border-white/20 relative z-10">
        <div className="container mx-auto px-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-white hover:text-amber-300 font-semibold drop-shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Services
          </Link>
        </div>
      </div>

      {/* Service Header */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {service.popular && (
              <Badge variant="secondary" className="mb-4 bg-orange-500/90 text-white border-orange-400/50 shadow-lg">
                Popular Choice
              </Badge>
            )}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              {service.name}
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed drop-shadow-md">
              {service.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                <p className="text-sm text-gray-200 mb-2 font-semibold">Starting from</p>
                <p className="text-4xl font-black text-white drop-shadow-lg">
                  {formatPrice(service.startingPrice)}
                </p>
              </div>
              <div className="h-12 w-px bg-white/30" />
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-200 font-semibold">Duration</p>
                  <p className="font-bold text-white drop-shadow-md">{service.duration}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <WhatsAppButton serviceId={service.id} fixed={false} />
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/30 shadow-xl">
                  Request Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 drop-shadow-lg">
              Benefits & Features
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 bg-white/10 backdrop-blur-lg rounded-2xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <CheckCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white drop-shadow-sm">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 drop-shadow-lg">
              Required Documents
            </h2>
            <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl">
              <ul className="space-y-4">
                {service.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-white drop-shadow-sm pt-1">{requirement}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-10 drop-shadow-lg">
              Application Process
            </h2>
            <div className="space-y-6">
              {service.process.map((step, index) => (
                <div key={index} className="flex gap-5 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-black text-xl">{step.step}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-md">{step.title}</h3>
                    <p className="text-gray-200 drop-shadow-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 drop-shadow-lg">
              Frequently Asked Questions
            </h2>
            <Accordion>
              {service.faqs.map((faq, index) => (
                <AccordionItem key={index} title={faq.question}>
                  <p>{faq.answer}</p>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-10 text-center">
              <p className="text-gray-200 mb-4 drop-shadow-md">Still have questions?</p>
              <Link href="/faq">
                <Button variant="outline" className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/30 shadow-xl">View All FAQs</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Note & CTA */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-6 mb-8 shadow-xl">
              <p className="text-sm text-white drop-shadow-sm">
                <strong className="text-amber-300">Note:</strong> {PRICING_DISCLAIMER}
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 drop-shadow-lg">
              Ready to Apply for Your {service.name}?
            </h2>
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
              Contact us today for a free consultation and personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <WhatsAppButton serviceId={service.id} fixed={false} />
              <Link href="/contact">
                <Button variant="outline" className="bg-white/20 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/30 shadow-xl">Email Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
