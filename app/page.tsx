import { Suspense, lazy } from 'react';
import { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { TrustBadges } from '@/components/sections/TrustBadges';
import { ServiceHighlights } from '@/components/sections/ServiceHighlights';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ComplianceDisclaimer } from '@/components/sections/ComplianceDisclaimer';
import { CTASection } from '@/components/sections/CTASection';
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteJsonLd, faqPageJsonLd } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: { absolute: 'BaliVisaAssist - Indonesia Visa Services, KITAS & Extensions' },
  description: 'Professional visa assistance for Indonesia. 17 visa types including C1, C2, D12, KITAS, extensions, and PT PMA setup. Fast processing, transparent pricing, licensed agents.',
  alternates: { canonical: '/' },
};

const homepageFaqs = [
  { question: 'What is BaliVisaAssist?', answer: 'BaliVisaAssist is a professional visa assistance service operated by CIPTA SOLUSI GLOBAL. We help foreigners obtain the right visa and permits to live, work, or retire in Indonesia legally and hassle-free.' },
  { question: 'How many visa types do you offer?', answer: 'We offer 17 visa and permit services, including tourist visas, business visas, multi-entry visas, KITAS permits, visa extensions, and PT PMA company setup.' },
  { question: 'How do I get started?', answer: 'Simply contact us via WhatsApp or fill out our contact form. Tell us which visa you\'re interested in, your nationality, and your timeline. We\'ll guide you through the entire process step by step.' },
];

// Lazy load below-the-fold components
const Testimonials = lazy(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })));
const FAQPreview = lazy(() => import('@/components/sections/FAQPreview').then(mod => ({ default: mod.FAQPreview })));

// Loading placeholder
function SectionLoader() {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-64 bg-[#F5E6D3]/20 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <JsonLd data={faqPageJsonLd(homepageFaqs)} />
      <Hero />
      <TrustBadges />
      <ServiceHighlights />
      <HowItWorks />

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQPreview />
      </Suspense>

      <CTASection />
      <ComplianceDisclaimer />
    </>
  );
}
