export const COMPANY = {
  legalName: 'PT CIPTA SOLUSI GLOBAL',
  brandName: 'BaliVisaAssist',
  tagline: 'Your Trusted Partner for Indonesia Visa Services',
  email: 'info@balivisaassist.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',

  // Social Media (optional - add when available)
  social: {
    facebook: '',
    instagram: '',
    twitter: '',
  },

  // Office Information (optional - add when available)
  office: {
    address: '',
    city: 'Bali',
    country: 'Indonesia',
  },

  // Legal Disclaimers
  disclaimer: 'We provide visa assistance and sponsorship support. Final decisions are made by Indonesian immigration authorities.',
  operatorDisclosure: 'BaliVisaAssist is operated by PT CIPTA SOLUSI GLOBAL, Indonesia.',

  // Business Hours (optional)
  businessHours: 'Monday - Friday: 9:00 AM - 5:00 PM WITA',
} as const;

export const SEO = {
  defaultTitle: 'BaliVisaAssist - Indonesia Visa Services & KITAS Support',
  defaultDescription: 'Professional visa assistance for Indonesia. C1 Visa, Retirement KITAS, Digital Nomad KITAS, Investor KITAS, and PT PMA sponsorship. Fast, reliable, compliant.',
  defaultKeywords: 'Indonesia visa, Bali visa, KITAS, retirement visa Indonesia, digital nomad visa Bali, investor visa, PT PMA, visa sponsorship, C1 visa',
  siteUrl: 'https://balivisaassist.com',
  ogImage: '/images/og-image.webp',
} as const;
