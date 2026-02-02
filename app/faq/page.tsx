import { Metadata } from 'next';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { CTASection } from '@/components/sections/CTASection';
import faqData from '@/data/faqs.json';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions - BaliVisaAssist',
  description: 'Get answers to common questions about Indonesia visa services, processing times, pricing, and requirements. Expert guidance for all visa types.',
  keywords: 'Indonesia visa FAQ, Bali visa questions, KITAS requirements, visa processing time Indonesia, visa costs Indonesia',
};

export default function FAQPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 drop-shadow-lg">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed drop-shadow-md">
              Find answers to common questions about our visa services, processing times,
              pricing, and requirements.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqData.categories.map((category) => (
              <div key={category.id}>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-8 drop-shadow-lg">
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

      {/* Still Have Questions */}
      <section className="py-16 sm:py-20 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 drop-shadow-lg">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-200 mb-8 drop-shadow-md">
              Can't find the answer you're looking for? Our team is here to help you
              with any questions about visa requirements and processes.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
