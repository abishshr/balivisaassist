import { Metadata } from 'next';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { CTASection } from '@/components/sections/CTASection';
import faqData from '@/data/faqs.json';
import { JsonLd } from '@/components/seo/JsonLd';
import { faqPageJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: 'Get answers to common questions about Indonesia visa services, processing times, pricing, extensions, and requirements. Expert guidance for all 17 visa types.',
  keywords: 'Indonesia visa FAQ, Bali visa questions, KITAS requirements, visa processing time Indonesia, visa costs Indonesia, B1 extension FAQ',
  alternates: { canonical: '/faq' },
};

const allFaqs = faqData.categories.flatMap((cat) => cat.faqs);

export default function FAQPage() {
  return (
    <div>
      <JsonLd data={faqPageJsonLd(allFaqs)} />
      {/* Header */}
      <section className="pt-12 pb-8 sm:pt-16 sm:pb-10 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-500">
              Answers to common questions about visa services, processing, and requirements.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-10 sm:py-14 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-12">
            {faqData.categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  {category.name}
                </h2>
                <Accordion>
                  {category.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      title={faq.question}
                      defaultOpen={index === 0}
                    >
                      <p className="whitespace-pre-line">{faq.answer}</p>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
}
