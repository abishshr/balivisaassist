export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  startingPrice: number; // in IDR
  duration: string;
  icon: string; // Lucide icon name
  popular?: boolean;
  benefits: string[];
  requirements: string[];
  process: {
    step: number;
    title: string;
    description: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const services: Service[] = [
  {
    id: 'c1-visa',
    name: 'C1 Visa (Single Entry Business Visa)',
    slug: 'c1-visa',
    shortDescription: '60-day single entry business visa, extendable up to 4 times (max 210 days)',
    description: 'The C1 Visa is a single-entry business visa that allows you to stay in Indonesia for 60 days, with the option to extend up to 4 times for a maximum total stay of 210 days. Perfect for business travelers, consultants, or those exploring long-term opportunities in Indonesia.',
    startingPrice: 2700000,
    duration: '60 days (extendable to 210 days)',
    icon: 'Plane',
    benefits: [
      'Initial 60-day stay in Indonesia',
      'Extendable up to 4 times (60 + 30 + 30 + 30 + 30 = 210 days total)',
      'Suitable for business activities',
      'Can be used for exploring long-term visa options',
      'Faster processing than KITAS applications',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Sponsorship letter from Indonesian company',
      'Flight tickets (inbound)',
      'Proof of accommodation in Indonesia',
      'CV/Resume',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide us with your passport copy, photos, and required documents via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Visa Processing',
        description: 'We process your C1 visa application with Indonesian immigration authorities.',
      },
      {
        step: 3,
        title: 'Approval & VOA Letter',
        description: 'Receive your visa approval letter via email (usually within 3-5 business days).',
      },
      {
        step: 4,
        title: 'Arrival & Visa Collection',
        description: 'Present the approval letter at the Indonesian airport to receive your C1 visa stamp.',
      },
    ],
    faqs: [
      {
        question: 'How long does C1 visa processing take?',
        answer: 'Typically 3-5 business days. We recommend applying at least 1 week before your intended travel date.',
      },
      {
        question: 'Can I work on a C1 visa?',
        answer: 'The C1 visa is for business purposes only. For employment, you need a work permit and KITAS.',
      },
      {
        question: 'Can I extend my C1 visa?',
        answer: 'Yes, you can extend up to 4 times (30 days each extension) for a maximum total stay of 210 days.',
      },
    ],
  },
  {
    id: 'retirement-kitas',
    name: 'Retirement KITAS',
    slug: 'retirement-kitas',
    shortDescription: 'Limited stay permit for retirees aged 55+ (1-year validity, renewable up to 5 years)',
    description: 'The Retirement KITAS is designed for foreign nationals aged 55 and above who wish to retire in Indonesia. Valid for 1 year and renewable annually for up to 5 years, this permit allows you to enjoy your retirement in beautiful Bali or anywhere in Indonesia.',
    startingPrice: 8500000,
    duration: '1 year (renewable up to 5 years)',
    icon: 'Palmtree',
    popular: true,
    benefits: [
      'Live in Indonesia for 1 year (renewable)',
      'Multiple entry and exit privileges',
      'Bring spouse and dependents (additional fees apply)',
      'Access to local banking and utilities',
      'Pathway to long-term residency',
      'No need to leave the country for renewal',
    ],
    requirements: [
      'Age 55 years or older',
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Proof of pension or retirement income (min. USD 1,500/month)',
      'Health insurance valid in Indonesia',
      'Rental agreement or property ownership in Indonesia',
      'Clean criminal record (police certificate from home country)',
      'Sponsorship from licensed sponsor (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Initial Consultation',
        description: 'We review your eligibility and gather all required documents.',
      },
      {
        step: 2,
        title: 'Sponsor Assignment',
        description: 'We assign your application to our licensed sponsor company.',
      },
      {
        step: 3,
        title: 'KITAS Application',
        description: 'We submit your application to the immigration office. Processing takes 2-4 weeks.',
      },
      {
        step: 4,
        title: 'Approval & KITAS Collection',
        description: 'You receive your KITAS card and can stay in Indonesia for 1 year.',
      },
    ],
    faqs: [
      {
        question: 'Can I work on a Retirement KITAS?',
        answer: 'No, the Retirement KITAS does not permit employment. It is strictly for retirement purposes.',
      },
      {
        question: 'Do I need to show proof of funds?',
        answer: 'Yes, you must show proof of pension or retirement income of at least USD 1,500 per month.',
      },
      {
        question: 'Can I bring my spouse?',
        answer: 'Yes, your spouse can be added as a dependent on your KITAS (additional fees apply).',
      },
    ],
  },
  {
    id: 'digital-nomad-kitas',
    name: 'Digital Nomad KITAS (Second Home Visa)',
    slug: 'digital-nomad-kitas',
    shortDescription: '5-year multiple entry visa for remote workers and digital nomads',
    description: 'The Digital Nomad KITAS (officially called the Second Home Visa) is a 5-year multiple entry permit designed for remote workers, freelancers, and digital nomads who want to live in Bali while working remotely for overseas clients or companies.',
    startingPrice: 14500000,
    duration: '5 years (multiple entry)',
    icon: 'Laptop',
    popular: true,
    benefits: [
      'Valid for 5 years (no annual renewal required)',
      'Multiple entry and exit privileges',
      'Work remotely for overseas companies',
      'Bring spouse and children (additional fees apply)',
      'Access to local banking and utilities',
      'No need to report every 90 days',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Proof of income: IDR 2 billion/year OR proof of ownership of property/business in Indonesia worth IDR 2 billion',
      'Health insurance valid in Indonesia',
      'CV/Resume',
      'Rental agreement or proof of accommodation',
      'Clean criminal record (police certificate)',
      'Sponsorship from licensed sponsor (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Eligibility Check',
        description: 'We verify that you meet the income or investment requirements.',
      },
      {
        step: 2,
        title: 'Document Preparation',
        description: 'We help you gather and prepare all required documents.',
      },
      {
        step: 3,
        title: 'Application Submission',
        description: 'We submit your Second Home Visa application. Processing takes 4-8 weeks.',
      },
      {
        step: 4,
        title: 'Visa Issuance',
        description: 'Receive your 5-year Digital Nomad KITAS and start living in Bali!',
      },
    ],
    faqs: [
      {
        question: 'Can I work for Indonesian companies?',
        answer: 'No, this visa is only for remote work with overseas clients/employers. For local employment, you need a work permit.',
      },
      {
        question: 'What if I don\'t have IDR 2 billion income?',
        answer: 'You can also qualify by owning property or a business in Indonesia valued at IDR 2 billion or more.',
      },
      {
        question: 'Do I need to renew this visa?',
        answer: 'No, the Second Home Visa is valid for 5 years without annual renewal. You can extend it after 5 years.',
      },
    ],
  },
  {
    id: 'investor-kitas',
    name: 'Investor / Working KITAS',
    slug: 'investor-kitas',
    shortDescription: '1-year work permit for investors, employees, or business owners',
    description: 'The Investor/Working KITAS is a 1-year limited stay permit for foreign nationals who are investing in Indonesia, working for an Indonesian company, or running their own business (PT PMA). This is the most common KITAS for expats employed or doing business in Indonesia.',
    startingPrice: 18000000,
    duration: '1 year (renewable)',
    icon: 'Briefcase',
    benefits: [
      'Legal permission to work in Indonesia',
      'Multiple entry and exit privileges',
      'Valid for 1 year (renewable)',
      'Includes work permit (IMTA)',
      'Bring spouse and children as dependents',
      'Access to local banking and utilities',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Employment contract or proof of investment in Indonesian company',
      'Company sponsorship letter (from Indonesian PT)',
      'Educational certificates/diplomas',
      'CV/Resume',
      'Health insurance valid in Indonesia',
      'Clean criminal record (police certificate)',
      'Proof of accommodation in Indonesia',
    ],
    process: [
      {
        step: 1,
        title: 'Company Sponsorship',
        description: 'Your employer or PT PMA company sponsors your KITAS application.',
      },
      {
        step: 2,
        title: 'Work Permit (IMTA) Application',
        description: 'We apply for your work permit (IMTA) from the Ministry of Manpower.',
      },
      {
        step: 3,
        title: 'KITAS Processing',
        description: 'We submit your KITAS application to immigration. Processing takes 4-6 weeks.',
      },
      {
        step: 4,
        title: 'KITAS & Work Permit Issuance',
        description: 'Receive your KITAS card and work permit. You can now legally work in Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'Do I need a company to sponsor me?',
        answer: 'Yes, you must be sponsored by an Indonesian company (PT or PT PMA). If you don\'t have one, we can help set up a PT PMA.',
      },
      {
        question: 'Can I work for multiple companies?',
        answer: 'Your work permit is tied to one company. Working for others requires additional permits.',
      },
      {
        question: 'How long does processing take?',
        answer: 'Typically 4-6 weeks for the full KITAS + work permit process.',
      },
    ],
  },
  {
    id: 'voa-visa',
    name: 'VOA Visa (Visa on Arrival)',
    slug: 'voa-visa',
    shortDescription: '30-day visa on arrival, extendable once for 30 more days (60 days total)',
    description: 'The Visa on Arrival (VOA) is the simplest and fastest way to enter Indonesia. Available at all major airports, it allows you to stay for 30 days and can be extended once for another 30 days (60 days total). Perfect for tourists and short-term visitors.',
    startingPrice: 650000,
    duration: '30 days (extendable to 60 days)',
    icon: 'Stamp',
    benefits: [
      'Fast and easy entry to Indonesia',
      'Available at all major airports',
      'Extendable once for 30 more days',
      'Suitable for tourism and business meetings',
      'No advance application required (can pay at airport)',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Return or onward flight ticket',
      'Proof of accommodation (hotel booking)',
      'Payment at airport (IDR 500,000) OR pre-arranged with us',
    ],
    process: [
      {
        step: 1,
        title: 'Arrive at Airport',
        description: 'Land at any major Indonesian airport (Ngurah Rai Bali, Soekarno-Hatta Jakarta, etc.).',
      },
      {
        step: 2,
        title: 'VOA Counter',
        description: 'Go to the VOA counter before immigration. Pay IDR 500,000 (or show our pre-arranged approval).',
      },
      {
        step: 3,
        title: 'Immigration',
        description: 'Proceed to immigration with your VOA receipt. Get your passport stamped for 30 days.',
      },
      {
        step: 4,
        title: 'Extension (Optional)',
        description: 'Contact us before day 30 to extend for another 30 days (total 60 days).',
      },
    ],
    faqs: [
      {
        question: 'Can I extend my VOA?',
        answer: 'Yes, you can extend once for 30 more days. Contact us at least 7 days before your visa expires.',
      },
      {
        question: 'Which nationalities are eligible for VOA?',
        answer: 'Over 90 nationalities are eligible, including USA, UK, Australia, EU countries, and more. Check with us to confirm.',
      },
      {
        question: 'Do I need to pre-arrange VOA with you?',
        answer: 'No, you can pay directly at the airport. However, we offer pre-arrangement and extension services for convenience.',
      },
    ],
  },
  {
    id: 'd12-visa',
    name: 'D12 Visa (Investor Visa)',
    slug: 'd12-visa',
    shortDescription: '1-year investor visa for business owners with PT PMA',
    description: 'The D12 Visa is a 1-year investor visa for foreign nationals who own or co-own a PT PMA (foreign-owned limited liability company) in Indonesia. This visa allows you to manage your business operations in Indonesia legally.',
    startingPrice: 7500000,
    duration: '1 year (renewable)',
    icon: 'TrendingUp',
    benefits: [
      'Legal permission to manage your Indonesian business',
      'Multiple entry and exit privileges',
      'Valid for 1 year (renewable)',
      'Bring spouse and children as dependents',
      'Access to local banking and business facilities',
      'Pathway to permanent residency',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Proof of PT PMA ownership (deed of establishment)',
      'Company investment documents (min. IDR 10 billion capital)',
      'Business plan or operational license',
      'CV/Resume',
      'Health insurance valid in Indonesia',
      'Clean criminal record (police certificate)',
    ],
    process: [
      {
        step: 1,
        title: 'PT PMA Verification',
        description: 'We verify your PT PMA registration and investment capital.',
      },
      {
        step: 2,
        title: 'Document Preparation',
        description: 'We prepare all required documents for the D12 visa application.',
      },
      {
        step: 3,
        title: 'Visa Application',
        description: 'We submit your D12 visa application. Processing takes 3-5 weeks.',
      },
      {
        step: 4,
        title: 'Visa Issuance',
        description: 'Receive your D12 visa and legally manage your Indonesian business.',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum investment for D12 visa?',
        answer: 'Your PT PMA must have a minimum paid-up capital of IDR 10 billion to qualify for the D12 visa.',
      },
      {
        question: 'Can I work for other companies with D12?',
        answer: 'The D12 visa is specifically for managing your own PT PMA. Working for others requires a separate work permit.',
      },
      {
        question: 'Do I need to own 100% of the PT PMA?',
        answer: 'No, you can be a co-owner or shareholder, but you must have a significant ownership stake.',
      },
    ],
  },
  {
    id: 'pt-pma',
    name: 'PT PMA Company Setup',
    slug: 'pt-pma',
    shortDescription: 'Full setup of foreign-owned company (PT PMA) in Indonesia',
    description: 'PT PMA (Penanaman Modal Asing) is a foreign-owned limited liability company in Indonesia. We handle the complete setup process, including company registration, business licenses, tax registration, and sponsor services for your KITAS applications.',
    startingPrice: 17500000,
    duration: 'One-time setup (ongoing support available)',
    icon: 'Building2',
    benefits: [
      'Full foreign ownership (up to 100% in most sectors)',
      'Legal entity for business operations in Indonesia',
      'Can sponsor KITAS for foreign employees',
      'Access to Indonesian banking and business facilities',
      'Ability to invoice clients and receive payments',
      'Tax-deductible business expenses',
      'Complete documentation and legal compliance',
    ],
    requirements: [
      'Passport copies of all shareholders and directors',
      'Company name ideas (3 options)',
      'Business activity description',
      'Registered office address in Indonesia (we can provide virtual office)',
      'Minimum capital requirement varies by business sector',
      'Tax identification numbers (NPWP) for shareholders',
    ],
    process: [
      {
        step: 1,
        title: 'Company Name Reservation',
        description: 'We reserve your company name with the Ministry of Law and Human Rights.',
      },
      {
        step: 2,
        title: 'Deed of Establishment',
        description: 'We prepare the company deed with a notary and register it with the government.',
      },
      {
        step: 3,
        title: 'Business Licenses (NIB)',
        description: 'We obtain your business identification number (NIB) and sector-specific licenses.',
      },
      {
        step: 4,
        title: 'Tax Registration & Bank Account',
        description: 'We register your company for taxes (NPWP) and help open a corporate bank account.',
      },
      {
        step: 5,
        title: 'Ongoing Support',
        description: 'We provide ongoing accounting, tax filing, and KITAS sponsorship support.',
      },
    ],
    faqs: [
      {
        question: 'How long does PT PMA setup take?',
        answer: 'Typically 4-6 weeks from document submission to full company registration.',
      },
      {
        question: 'What is the minimum capital requirement?',
        answer: 'It varies by business sector. Most sectors require IDR 10 billion. We can advise based on your business type.',
      },
      {
        question: 'Can I own 100% of the PT PMA?',
        answer: 'Yes, in most business sectors foreign ownership up to 100% is allowed. Some sectors have restrictions.',
      },
      {
        question: 'Do I need a physical office?',
        answer: 'You need a registered address. We can provide virtual office services if you don\'t have a physical location yet.',
      },
    ],
  },
];

// Helper function to get service by slug
export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

// Helper function to get popular services
export function getPopularServices(): Service[] {
  return services.filter((service) => service.popular);
}

// Pricing disclaimer
export const PRICING_DISCLAIMER = 'Prices shown are starting prices and may vary based on your nationality, processing time, and specific requirements. Government fees are included. Contact us for an exact quote.';
