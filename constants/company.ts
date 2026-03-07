export const COMPANY = {
  legalName: 'CIPTA SOLUSI GLOBAL',
  brandName: 'BaliVisaAssist',
  tagline: 'Your Trusted Partner for Indonesia Visa Services',
  email: 'info@balivisaassist.com',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  nib: '3001260059407',
  npwp: '1000000008078107',

  // Social Media (optional - add when available)
  social: {
    facebook: '',
    instagram: 'balivisaassist',
    twitter: '',
  },

  // Office Information
  office: {
    address: 'JL. PANTAI BATU BOLONG NO.38, CANGGU, Kec. Kuta Utara, Kabupaten Badung, Bali 80363',
    city: 'Bali',
    country: 'Indonesia',
  },

  // Director Information
  director: {
    name: 'Nadia Feby Claudia',
    title: 'Director',
    phone: '082234529826',
    email: 'pt.ciptasolusiglobal@gmail.com',
  },

  // Legal Disclaimers
  disclaimer: 'We provide visa assistance and sponsorship support. Final decisions are made by Indonesian immigration authorities.',
  operatorDisclosure: 'BaliVisaAssist is operated by CIPTA SOLUSI GLOBAL, Indonesia.',

  // Business Hours (optional)
  businessHours: 'Daily: 7:00 AM - 11:00 PM WITA',
} as const;

export const SEO = {
  defaultTitle: 'BaliVisaAssist - Indonesia Visa Services, KITAS & Extensions',
  defaultDescription: 'Professional visa assistance for Indonesia. 17 visa types including C1, C2, D12, KITAS, extensions, and PT PMA setup. Fast processing, transparent pricing, licensed agents.',
  defaultKeywords: 'Indonesia visa, Bali visa, KITAS, retirement visa Indonesia, digital nomad visa Bali, investor visa, PT PMA, visa sponsorship, C1 visa, B1 extension, C2 business visa, D12 visa, visa extension Bali',
  siteUrl: 'https://balivisaassist.com',
  ogImage: '/images/og-image.webp',
} as const;
