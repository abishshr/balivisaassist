import { Suspense, lazy } from 'react';
import { Hero } from '@/components/sections/Hero';
import { Features } from '@/components/sections/Features';
import { ServiceHighlights } from '@/components/sections/ServiceHighlights';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ComplianceDisclaimer } from '@/components/sections/ComplianceDisclaimer';
import { CTASection } from '@/components/sections/CTASection';

// Lazy load below-the-fold components
const Testimonials = lazy(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })));
const FAQPreview = lazy(() => import('@/components/sections/FAQPreview').then(mod => ({ default: mod.FAQPreview })));

// Loading placeholder
function SectionLoader() {
  return (
    <div className="py-20 sm:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-96 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/20 animate-pulse" />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <ServiceHighlights />
      <HowItWorks />

      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <FAQPreview />
      </Suspense>

      <ComplianceDisclaimer />
      <CTASection />
    </>
  );
}
