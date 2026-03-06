import { COMPANY, SEO } from '@/constants/company';
import type { Service } from '@/data/services';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.brandName,
    legalName: COMPANY.legalName,
    url: SEO.siteUrl,
    logo: `${SEO.siteUrl}/images/og-image.webp`,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'JL. PANTAI BATU BOLONG NO.38',
      addressLocality: 'Canggu, Kuta Utara',
      addressRegion: 'Bali',
      postalCode: '80363',
      addressCountry: 'ID',
    },
  };
}

export function localBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.brandName,
    description: SEO.defaultDescription,
    url: SEO.siteUrl,
    email: COMPANY.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'JL. PANTAI BATU BOLONG NO.38',
      addressLocality: 'Canggu, Kuta Utara',
      addressRegion: 'Bali',
      postalCode: '80363',
      addressCountry: 'ID',
    },
    openingHours: 'Mo-Fr 09:00-17:00',
    priceRange: 'IDR 765,000 - IDR 18,500,000',
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.brandName,
    url: SEO.siteUrl,
    description: SEO.defaultDescription,
    publisher: {
      '@type': 'Organization',
      name: COMPANY.brandName,
    },
  };
}

export function faqPageJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: COMPANY.brandName,
      url: SEO.siteUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Indonesia',
    },
    offers: {
      '@type': 'Offer',
      price: service.startingPrice,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
