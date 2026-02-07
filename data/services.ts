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
    name: 'C1 Tourist Visa (Single Entry)',
    slug: 'c1-visa',
    shortDescription: '60-day single entry visa for tourism, family visits, and events (extendable to 180 days)',
    description: 'The C1 Single Entry Tourist Visa (formerly B211A) allows you to stay in Indonesia for 60 days with the option to extend twice for a maximum total stay of 180 days. Perfect for tourists, family visits, and attending conventions or exhibitions. Apply online through the official e-visa system.',
    startingPrice: 2500000,
    duration: '60 days (extendable to 180 days)',
    icon: 'Plane',
    benefits: [
      'Initial 60-day stay in Indonesia',
      'Extendable twice (60 + 60 + 60 = 180 days total)',
      'Suitable for tourism and visiting family/friends',
      'Can attend meetings, conventions, and exhibitions',
      'Apply online through e-visa system',
      'Valid for 90 days to enter Indonesia after issuance',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means',
      'Return or onward flight ticket',
      'Proof of accommodation in Indonesia',
      'Sponsor/guarantor (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide passport copy, flight tickets, and accommodation proof via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Online Application',
        description: 'We submit your application through the official e-visa portal (evisa.imigrasi.go.id).',
      },
      {
        step: 3,
        title: 'Visa Processing',
        description: 'Immigration processes your application. You have 90 days to enter Indonesia after visa issuance.',
      },
      {
        step: 4,
        title: 'Extension (Optional)',
        description: 'Extend twice for 60 days each time. Must visit immigration office in person for biometric verification.',
      },
    ],
    faqs: [
      {
        question: 'Can I do business on a C1 visa?',
        answer: 'The C1 is a tourist visa. You can attend meetings, conventions, and exhibitions, but CANNOT conduct business negotiations, sales, or work. For business activities, you need a C2 business visa or work permit.',
      },
      {
        question: 'How do I extend my C1 visa?',
        answer: 'You can extend twice, each for 60 days (180 days total). Since 2025, you must visit the local immigration office in person for biometric verification (fingerprints and photo) during extension.',
      },
      {
        question: 'What happens if I enter Indonesia after 90 days?',
        answer: 'Once your C1 visa is issued, you have 90 days to enter Indonesia. If you don\'t enter within 90 days, the visa expires and you need to apply for a new one.',
      },
      {
        question: 'Is this the same as B211A?',
        answer: 'Yes, the C1 is the new designation for what was previously called the B211A single-entry tourist visa. Same visa, new name.',
      },
    ],
  },
  {
    id: 'retirement-kitas',
    name: 'Retirement KITAS',
    slug: 'retirement-kitas',
    shortDescription: 'Limited stay permit for retirees aged 55+ (1-year validity, renewable up to 5 years)',
    description: 'The Retirement KITAS is designed for foreign nationals aged 55 and above who wish to retire in Indonesia. Valid for 1 year and renewable annually for up to 5 years, this permit allows you to enjoy your retirement in beautiful Bali or anywhere in Indonesia.',
    startingPrice: 8400000,
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
      'Proof of pension or retirement income (min. USD 3,000/month or USD 36,000/year)',
      'Personal bank statement showing min. USD 2,000 (last 3 months)',
      'Health and life insurance (min. IDR 25 million coverage)',
      'Third party liability insurance',
      'Rental agreement valid for at least 12 months',
      'Must hire a local domestic helper',
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
        answer: 'Yes, you must show proof of pension or retirement income of at least USD 3,000 per month (USD 36,000/year) plus bank statements showing minimum USD 2,000 for the last 3 months.',
      },
      {
        question: 'Can I bring my spouse?',
        answer: 'Yes, your spouse can be added as a dependent on your KITAS (additional fees apply).',
      },
      {
        question: 'Is there a different visa for those 60 and older?',
        answer: 'Yes, Indonesia offers the Silver Hair Visa (E33E) for those aged 60+, which may have different benefits. Contact us to discuss which option is best for you.',
      },
    ],
  },
  {
    id: 'digital-nomad-kitas',
    name: 'Digital Nomad KITAS (E33 Second Home Visa)',
    slug: 'digital-nomad-kitas',
    shortDescription: '5-year multiple entry visa for remote workers and digital nomads',
    description: 'The E33 Second Home Visa is a 5-year limited stay permit for remote workers, investors, and those conducting business activities in Indonesia. No sponsor required - apply directly online! Live in Bali while working remotely or managing investments.',
    startingPrice: 14300000,
    duration: '5 years (multiple entry)',
    icon: 'Laptop',
    popular: true,
    benefits: [
      'Valid for 5 years (no annual renewal required)',
      'Multiple entry and exit privileges',
      'No sponsor or guarantor required',
      'Can work remotely for overseas companies or manage investments',
      'Bring spouse and children (additional fees apply)',
      'Access to local banking and utilities',
      'Fast processing: 5 business days after payment',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means: minimum USD 2,000 (3-month bank statements)',
      'Special commitment within 90 days: Maintain USD 130,000 in bank savings OR purchase property worth minimum USD 1,000,000',
      'CV/Resume',
      'Travel itinerary',
      'No sponsor required - direct online application',
    ],
    process: [
      {
        step: 1,
        title: 'Online Registration',
        description: 'Create account at evisa.imigrasi.go.id and prepare required documents.',
      },
      {
        step: 2,
        title: 'Document Submission & Payment',
        description: 'Submit electronic documents and pay government fees (IDR 13,000,000 total for 5 years).',
      },
      {
        step: 3,
        title: 'Immigration Verification',
        description: 'Immigration office processes and verifies your application within 5 business days.',
      },
      {
        step: 4,
        title: 'Fulfill Commitment & Receive Permit',
        description: 'Within 90 days, fulfill financial commitment (USD 130k savings or USD 1M property). Receive your 5-year permit and re-entry permit.',
      },
    ],
    faqs: [
      {
        question: 'Can I work for Indonesian companies?',
        answer: 'The E33 is for business/investment activities and remote work with overseas clients. For local employment, you need a separate work permit.',
      },
      {
        question: 'What is the USD 130,000 requirement?',
        answer: 'Within 90 days of permit issuance, you must either: (1) Maintain USD 130,000 in Indonesian bank savings, OR (2) Purchase property (apartment/residence) worth minimum USD 1,000,000.',
      },
      {
        question: 'Do I need to renew this visa annually?',
        answer: 'No! The E33 Second Home Visa is valid for the full 5 years without annual renewal. The government fee of IDR 13,000,000 covers the entire 5-year period including re-entry permit.',
      },
      {
        question: 'What are the total official government fees?',
        answer: 'IDR 13,000,000 total: Limited Stay Visa (500k) + Verification (2M) + 5-year Stay Permit (7M) + 5-year Re-entry Permit (3.5M).',
      },
    ],
  },
  {
    id: 'investor-kitas',
    name: 'Working KITAS (E23 Work Visa)',
    slug: 'investor-kitas',
    shortDescription: '6-12 month work permit for foreign employees and investors in Indonesia',
    description: 'The E23 Working KITAS is a limited stay permit for foreign nationals employed by Indonesian companies or managing their own PT PMA. Includes work permit (IMTA) and allows legal employment in Indonesia. Duration depends on position: Directors/Senior Managers get 12 months, Advisors get 6 months.',
    startingPrice: 17800000,
    duration: '6-12 months (renewable)',
    icon: 'Briefcase',
    benefits: [
      'Legal permission to work in Indonesia',
      'Multiple entry and exit privileges',
      'Valid for 6-12 months depending on position (renewable)',
      'Includes work permit (IMTA)',
      'Bring spouse and children as dependents (E31 Family Visa)',
      'Access to local banking and utilities',
      'Directors/Senior Managers: 12-month extendable permit',
      'Advisors/Consultants: 6-month non-extendable permit',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Company sponsorship (sponsoring company must have min. IDR 1 billion capital per foreign worker)',
      'Relevant qualifications, skills, and experience not easily available locally',
      'Minimum 5 years relevant experience (for long-term permits)',
      'Educational certificates/diplomas matching the role',
      'CV/Resume stamped by company',
      'Minimum salary: typically IDR 25-30 million/month (varies by industry)',
      'Employment contract',
      'Health insurance valid in Indonesia',
    ],
    process: [
      {
        step: 1,
        title: 'RPTKA (Foreign Worker Plan) Submission',
        description: 'Sponsoring company submits Foreign Worker Placement Plan (RPTKA) to Ministry of Manpower.',
      },
      {
        step: 2,
        title: 'Work Permit (IMTA) Notification',
        description: 'After RPTKA approval, submit Work Permit notification to immigration. Processing typically 2-3 months.',
      },
      {
        step: 3,
        title: 'E-Visa Issuance',
        description: 'Once Work Permit approved, E-Visa issued within 5-10 working days. Valid for 90 days to enter Indonesia.',
      },
      {
        step: 4,
        title: 'KITAS Activation & Collection',
        description: 'Enter Indonesia within 90 days to activate KITAS. Complete onshore processing (4 weeks) and receive KITAS card.',
      },
    ],
    faqs: [
      {
        question: 'Do I need a company to sponsor me?',
        answer: 'Yes, you must be sponsored by a legally registered Indonesian company (PT or PT PMA) authorized to hire foreign workers, with minimum IDR 1 billion capital per foreign employee.',
      },
      {
        question: 'What is the monthly foreign worker levy?',
        answer: 'Foreign workers must pay DPKK (work permit levy) of USD 100 per month. Employers also pay DKP-TKA levy of USD 100/month, typically pre-paid for the contract duration.',
      },
      {
        question: 'How long does processing take?',
        answer: 'Total process takes 2-3 months: RPTKA submission, IMTA approval, then E-Visa issuance (5-10 days). After arrival, onshore KITAS processing takes about 4 weeks.',
      },
      {
        question: 'Can I work for multiple companies?',
        answer: 'No, your work permit (IMTA) is tied to one sponsoring company. Working for other companies requires additional permits and approvals.',
      },
    ],
  },
  {
    id: 'voa-visa',
    name: 'VOA Visa (Visa on Arrival)',
    slug: 'voa-visa',
    shortDescription: '30-day visa on arrival, extendable once for 30 more days (60 days total)',
    description: 'The Visa on Arrival (VOA) is the simplest and fastest way to enter Indonesia. Available at all major airports and online (e-VOA), it allows you to stay for 30 days and can be extended once for another 30 days (60 days total). Perfect for tourists and short-term visitors.',
    startingPrice: 650000,
    duration: '30 days (extendable to 60 days)',
    icon: 'Stamp',
    benefits: [
      'Fast and easy entry to Indonesia',
      'Available at all major airports or apply online',
      'Extendable once for 30 more days (total 60 days)',
      'Suitable for tourism and business meetings',
      'Online e-VOA option available',
      'Extension now available online through evisa.imigrasi.go.id',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity with 2 blank pages)',
      'Return or onward flight ticket',
      'Proof of accommodation (hotel booking)',
      'Proof of sufficient funds (approx. USD 2,000 or equivalent)',
      'Digital passport photo (for e-VOA)',
      'Payment: IDR 500,000 (online or at airport)',
    ],
    process: [
      {
        step: 1,
        title: 'Choose Application Method',
        description: 'Apply online at evisa.imigrasi.go.id OR pay on arrival at the airport VOA counter.',
      },
      {
        step: 2,
        title: 'Payment & Approval',
        description: 'Pay IDR 500,000 online (Mastercard/Visa/JCB) or at airport counter. E-VOA processed immediately.',
      },
      {
        step: 3,
        title: 'Arrival & Immigration',
        description: 'Present your e-VOA approval or payment receipt at immigration. Get your passport stamped for 30 days.',
      },
      {
        step: 4,
        title: 'Extension (Optional)',
        description: 'Apply for extension online or in person 14 days before expiry. Extension fee: IDR 500,000. Must visit immigration office for biometrics.',
      },
    ],
    faqs: [
      {
        question: 'Can I extend my VOA?',
        answer: 'Yes, you can extend once for 30 more days. Apply between 14 days before expiry and 1 business day before expiry. Extension fee is IDR 500,000. You must visit immigration office in person for biometric data (fingerprints/photos).',
      },
      {
        question: 'Which nationalities are eligible for VOA?',
        answer: 'Over 90 nationalities are eligible, including USA, UK, Australia, Canada, EU countries, and more. Check the official immigration website for the complete list.',
      },
      {
        question: 'Should I apply online or at the airport?',
        answer: 'Both options cost IDR 500,000. Online e-VOA is faster and more convenient. At-airport VOA may have longer queues but is fine if you prefer to pay on arrival.',
      },
      {
        question: 'What happens if I overstay?',
        answer: 'Overstay penalty is approximately IDR 1,000,000 per day. Overstaying beyond 60 days may result in deportation or being blacklisted. Always extend on time!',
      },
    ],
  },
  {
    id: 'd12-visa',
    name: 'D12 Visa (Pre-Investment Visit Visa)',
    slug: 'd12-visa',
    shortDescription: 'Multiple entry visa for pre-investment activities and business exploration (up to 2 years)',
    description: 'The D12 Visa is a multiple-entry pre-investment visit visa that allows foreigners to conduct business surveys, explore investment opportunities, and plan business ventures in Indonesia. Valid for 1 or 2 years with 180-day stays per entry. No sponsor required - apply directly online.',
    startingPrice: 7300000,
    duration: '1 or 2 years (180 days per entry)',
    icon: 'TrendingUp',
    benefits: [
      'Multiple entry visa with up to 2 years validity',
      'Stay up to 180 days per entry',
      'Extendable once for another 180 days (total 360 days per visit)',
      'No sponsor or guarantor required',
      'Can conduct field surveys and pre-investment activities',
      'Also suitable for tourism and visiting friends/family',
      'Fast processing: 5 business days after payment',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity for passport; 12 months for other travel documents)',
      'Recent color passport photo (4x6 cm, white background)',
      'Proof of financial means: minimum USD 5,000 (bank statements from past 3 months)',
      'Curriculum vitae (CV/Resume)',
      'Travel itinerary or planned activities',
      'Letter or invitation from Indonesian government agency or private institution',
      'Return entry permit and onward ticket (for non-passport holders)',
    ],
    process: [
      {
        step: 1,
        title: 'Online Registration',
        description: 'Create an account at evisa.imigrasi.go.id and submit electronic documents.',
      },
      {
        step: 2,
        title: 'Payment & Verification',
        description: 'Pay visa fee (IDR 5M for 1 year or 7M for 2 years). Immigration office verifies your application.',
      },
      {
        step: 3,
        title: 'Approval',
        description: 'Receive approval within 5 business days after payment confirmation.',
      },
      {
        step: 4,
        title: 'Visa Issuance',
        description: 'Receive your D12 visa and begin your pre-investment activities in Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'Do I need a PT PMA or sponsor for D12 visa?',
        answer: 'No! The D12 visa does not require a sponsor or guarantor. You apply directly through the online e-visa system.',
      },
      {
        question: 'Can I work or do business on a D12 visa?',
        answer: 'No, the D12 visa is for pre-investment activities and surveys only. You cannot sell goods/services or receive wages. For actual business operations, you need a KITAS.',
      },
      {
        question: 'What is the difference between 1-year and 2-year validity?',
        answer: 'The 1-year costs IDR 5,000,000 and the 2-year costs IDR 7,000,000. Both allow 180-day stays per entry, extendable once per visit.',
      },
      {
        question: 'Can I convert D12 to a work permit or KITAS?',
        answer: 'No, the D12 visa cannot be converted to a limited residence permit (KITAS). You must apply for KITAS separately if you want to work or do business.',
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
