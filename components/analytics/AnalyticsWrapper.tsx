'use client';

import dynamic from 'next/dynamic';

// Import analytics components with ssr: false to prevent hydration issues
const GoogleAnalytics = dynamic(
  () => import('./GoogleAnalytics').then((mod) => mod.GoogleAnalytics),
  { ssr: false }
);

const MetaPixel = dynamic(
  () => import('./MetaPixel').then((mod) => mod.MetaPixel),
  { ssr: false }
);

export function AnalyticsWrapper() {
  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
    </>
  );
}
