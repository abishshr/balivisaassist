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
  category?: 'visa' | 'extension' | 'permit' | 'business';
  processingDays?: string;
  isExtension?: boolean;
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
    startingPrice: 2070000,
    duration: '60 days (extendable to 180 days)',
    icon: 'Plane',
    category: 'visa',
    processingDays: '3-5 working days',
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
    id: 'c2-business-visa',
    name: 'C2 Business Visa (Single Entry)',
    slug: 'c2-business-visa',
    shortDescription: '60-day single entry visa for business meetings, negotiations, and trade activities',
    description: 'The C2 Single Entry Business Visa allows you to conduct business activities in Indonesia for 60 days with the option to extend. Suitable for business meetings, negotiations, contract signings, purchasing goods, and attending trade events. Requires a sponsor or guarantor in Indonesia.',
    startingPrice: 4000000,
    duration: '60 days (extendable to 180 days)',
    icon: 'Briefcase',
    category: 'visa',
    processingDays: '3-5 working days',
    benefits: [
      'Conduct business meetings and negotiations in Indonesia',
      'Attend trade fairs and business exhibitions',
      'Sign contracts and purchase goods',
      'Extendable twice (up to 180 days total)',
      'Apply online through e-visa system',
      'Valid for 90 days to enter Indonesia after issuance',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means',
      'Business invitation letter from Indonesian company',
      'Company letter from your employer',
      'Institution letter from private company (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide passport copy, business invitation letter, and company documents via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Online Application',
        description: 'We submit your application through the official e-visa portal with business sponsor support.',
      },
      {
        step: 3,
        title: 'Visa Processing',
        description: 'Immigration processes your application within 3-5 business days.',
      },
      {
        step: 4,
        title: 'Business Activities',
        description: 'Enter Indonesia and conduct your business activities. Extend if needed (60-day increments).',
      },
    ],
    faqs: [
      {
        question: 'Can I work for an Indonesian company on a C2 visa?',
        answer: 'No, the C2 allows business activities like meetings, negotiations, and trade, but not employment. For employment, you need a Working KITAS (E23).',
      },
      {
        question: 'What is the difference between C1 and C2?',
        answer: 'C1 is for tourism/family visits. C2 is for business activities like meetings, negotiations, purchasing goods, and trade events. C2 typically requires a business invitation letter.',
      },
      {
        question: 'Can I extend a C2 business visa?',
        answer: 'Yes, you can extend twice for 60 days each (180 days total). Extension requires visiting the immigration office for biometric verification.',
      },
    ],
  },
  {
    id: 'c6-social-visa',
    name: 'C6 Social/Volunteer Visa',
    slug: 'c6-social-visa',
    shortDescription: '60-day visa for social visits, volunteering, education, and cultural activities',
    description: 'The C6 Social/Volunteer Visa is designed for foreign nationals participating in social activities, volunteering, educational programs, or cultural exchanges in Indonesia. Valid for 60 days with the option to extend twice for a total of 180 days.',
    startingPrice: 4000000,
    duration: '60 days (extendable to 180 days)',
    icon: 'Heart',
    category: 'visa',
    processingDays: '3-5 working days',
    benefits: [
      'Participate in social and volunteer activities',
      'Join educational and cultural exchange programs',
      'Visit for medical treatment or health purposes',
      'Extendable twice (up to 180 days total)',
      'Apply online through e-visa system',
      'No work activities required',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means',
      'Invitation letter from Indonesian organization',
      'Description of social/volunteer activities',
      'Sponsor/guarantor & institution letter (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide passport copy, invitation letter, and activity description via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Online Application',
        description: 'We submit your application through the official e-visa portal with sponsor support.',
      },
      {
        step: 3,
        title: 'Visa Processing',
        description: 'Immigration processes your application within 3-5 business days.',
      },
      {
        step: 4,
        title: 'Arrival & Activities',
        description: 'Enter Indonesia and begin your social/volunteer activities. Extend if needed.',
      },
    ],
    faqs: [
      {
        question: 'Can I work on a C6 social visa?',
        answer: 'No, the C6 is strictly for social, volunteer, educational, and cultural activities. Paid employment is not permitted.',
      },
      {
        question: 'What activities are allowed on a C6 visa?',
        answer: 'Social visits, volunteering with NGOs, educational programs, cultural exchanges, medical treatment, and joining social organizations.',
      },
      {
        question: 'Do I need an invitation letter?',
        answer: 'Yes, you need an invitation from an Indonesian organization, educational institution, or social group. We can help arrange this if needed.',
      },
    ],
  },
  {
    id: 'voa-visa',
    name: 'VOA Visa (Visa on Arrival)',
    slug: 'voa-visa',
    shortDescription: '30-day visa on arrival, extendable once for 30 more days (60 days total)',
    description: 'The Visa on Arrival (VOA) is the simplest and fastest way to enter Indonesia. Available at all major airports and online (e-VOA), it allows you to stay for 30 days and can be extended once for another 30 days (60 days total). Perfect for tourists and short-term visitors.',
    startingPrice: 765000,
    duration: '30 days (extendable to 60 days)',
    icon: 'Stamp',
    category: 'visa',
    processingDays: 'Same day',
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
    id: 'bali-tourist-levy',
    name: 'Bali Tourist Levy',
    slug: 'bali-tourist-levy',
    shortDescription: 'Mandatory IDR 150,000 tourist levy for all international visitors to Bali',
    description: 'The Bali Tourist Levy is a mandatory fee for all international visitors arriving in Bali. This contribution supports cultural preservation, environmental sustainability, and tourism infrastructure development. We help you register and pay quickly so you can start enjoying Bali right away.',
    startingPrice: 250000,
    duration: 'One-time payment per visit',
    icon: 'Ticket',
    category: 'visa',
    processingDays: 'Same day',
    benefits: [
      'Quick online registration and payment',
      'Hassle-free processing - we handle everything',
      'Supports Bali cultural preservation',
      'Contributes to environmental sustainability',
      'Digital receipt for immigration check',
      'Valid for the duration of your visit',
    ],
    requirements: [
      'Valid passport',
      'Flight details (arrival date)',
      'Payment method (card or bank transfer)',
    ],
    process: [
      {
        step: 1,
        title: 'Provide Details',
        description: 'Share your passport information and arrival date with us.',
      },
      {
        step: 2,
        title: 'Registration',
        description: 'We register you on the official Bali tourist levy portal.',
      },
      {
        step: 3,
        title: 'Payment',
        description: 'We process the payment on your behalf.',
      },
      {
        step: 4,
        title: 'Receive Confirmation',
        description: 'You receive a digital confirmation to show upon arrival.',
      },
    ],
    faqs: [
      {
        question: 'Is the Bali tourist levy mandatory?',
        answer: 'Yes, all international visitors to Bali must pay the tourist levy. It is checked upon arrival at the airport.',
      },
      {
        question: 'How much is the levy?',
        answer: 'The government levy is IDR 150,000 per person. Our service fee covers registration assistance and ensures everything is processed correctly.',
      },
      {
        question: 'Do I need to pay this if I already have a visa?',
        answer: 'Yes, the tourist levy is separate from your visa. All international visitors to Bali must pay it regardless of visa type.',
      },
    ],
  },
  {
    id: 'd1-multi-entry-tourist',
    name: 'D1 Multi-Entry Tourist Visa',
    slug: 'd1-multi-entry-tourist',
    shortDescription: 'Multiple entry tourist visa for frequent visitors to Indonesia (1-2 year validity)',
    description: 'The D1 Multiple Entry Tourist Visa is perfect for frequent visitors who want the flexibility to enter and exit Indonesia multiple times. Valid for 1-2 years with stays of up to 60 days per entry. Ideal for those who regularly visit Bali or other parts of Indonesia.',
    startingPrice: 6000000,
    duration: '1-2 years (60 days per entry)',
    icon: 'Globe',
    category: 'visa',
    processingDays: '5-7 working days',
    benefits: [
      'Multiple entries for 1-2 years',
      'Stay up to 60 days per entry',
      'Perfect for frequent visitors',
      'Apply online through e-visa system',
      'Fast processing within 5-7 business days',
      'Institution letter included in our service',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means (min. USD 2,000 bank statements)',
      'Return or onward flight ticket for first entry',
      'Proof of accommodation',
      'Institution letter from private company (we provide this)',
      'Travel itinerary',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide passport copy, financial documents, and travel plans via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Online Application',
        description: 'We submit your application through the official e-visa portal.',
      },
      {
        step: 3,
        title: 'Visa Processing',
        description: 'Immigration processes your application within 5-7 business days.',
      },
      {
        step: 4,
        title: 'Multi-Entry Access',
        description: 'Receive your visa and enjoy unlimited entries to Indonesia for the visa validity period.',
      },
    ],
    faqs: [
      {
        question: 'How many times can I enter Indonesia?',
        answer: 'Unlimited entries during the validity period. Each stay is limited to 60 days per entry.',
      },
      {
        question: 'Can I extend each stay beyond 60 days?',
        answer: 'Multi-entry visa stays are generally limited to 60 days per entry. For longer stays, consider a D12 visa or KITAS.',
      },
      {
        question: 'Do I need an institution letter?',
        answer: 'Yes, the D1 requires a letter from a government agency or private institution explaining the relationship. We provide this letter as part of our service.',
      },
    ],
  },
  {
    id: 'd2-multi-entry-business',
    name: 'D2 Multi-Entry Business Visa',
    slug: 'd2-multi-entry-business',
    shortDescription: 'Multiple entry business visa for frequent business travelers (1-2 year validity)',
    description: 'The D2 Multiple Entry Business Visa is designed for business professionals who frequently travel to Indonesia. Valid for 1-2 years with stays of up to 60 days per entry. Conduct business meetings, attend events, and manage business relationships with the flexibility of multiple entries.',
    startingPrice: 6000000,
    duration: '1-2 years (60 days per entry)',
    icon: 'Building',
    category: 'visa',
    processingDays: '5-7 working days',
    benefits: [
      'Multiple entries for 1-2 years',
      'Stay up to 60 days per entry',
      'Conduct business meetings and negotiations',
      'Attend trade fairs and business events',
      'Sign contracts and manage business relationships',
      'Fast processing within 5-7 business days',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of financial means (min. USD 2,000 bank statements)',
      'Business invitation from Indonesian company',
      'Company letter from your employer',
      'Institution letter from private company (we provide this)',
      'Business activity description',
    ],
    process: [
      {
        step: 1,
        title: 'Document Submission',
        description: 'Provide passport copy, business documents, and company letters via WhatsApp or email.',
      },
      {
        step: 2,
        title: 'Online Application',
        description: 'We submit your application with business sponsor support through the e-visa portal.',
      },
      {
        step: 3,
        title: 'Visa Processing',
        description: 'Immigration processes your application within 5-7 business days.',
      },
      {
        step: 4,
        title: 'Business Access',
        description: 'Receive your visa and enjoy unlimited business entries to Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'Can I work for an Indonesian company on D2?',
        answer: 'No, the D2 is for business visits only (meetings, negotiations, trade). For employment, you need a Working KITAS.',
      },
      {
        question: 'What business activities are allowed?',
        answer: 'Business meetings, negotiations, contract signing, trade fairs, purchasing goods, quality control inspections, and business relationship management.',
      },
      {
        question: 'How is D2 different from C2?',
        answer: 'D2 is a multi-entry visa valid for 1-2 years, while C2 is a single-entry visa. D2 is better for frequent business travelers.',
      },
    ],
  },
  {
    id: 'd12-visa-1year',
    name: 'D12 Visa - 1 Year (Pre-Investment Visit Visa)',
    slug: 'd12-visa-1year',
    shortDescription: 'Multiple entry visa for pre-investment activities and business exploration (1 year validity)',
    description: 'The D12 Visa is a multiple-entry pre-investment visit visa that allows foreigners to conduct business surveys, explore investment opportunities, and plan business ventures in Indonesia. Valid for 1 year with 180-day stays per entry, extendable once for another 180 days. We provide the required sponsor letter as part of our service.',
    startingPrice: 6750000,
    duration: '1 year (180 days per entry)',
    icon: 'TrendingUp',
    category: 'visa',
    processingDays: '5 working days',
    benefits: [
      'Multiple entry visa with 1 year validity',
      'Stay up to 180 days per entry',
      'Extendable once for another 180 days (total 360 days per visit)',
      'Can conduct field surveys and pre-investment activities',
      'Also suitable for tourism and visiting friends/family',
      'Fast processing: 5 business days after payment',
      'Government fee: IDR 5,000,000 (Visa IDR 3,000,000 + Verification IDR 2,000,000)',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity for passport; 12 months for other travel documents)',
      'Recent color passport photo (within 1 year, white background)',
      'Proof of financial means: minimum USD 5,000 (bank statements)',
      'Letter or invitation from Indonesian government agency or private institution',
      'Institution letter from private company (we provide this)',
      'Curriculum vitae / CV (optional)',
      'Travel itinerary or planned activities (optional)',
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
        description: 'Pay government fee of IDR 5,000,000 (Visa: IDR 3,000,000 + Verification: IDR 2,000,000).',
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
        question: 'Do I need a sponsor for a D12 visa?',
        answer: 'Yes, the D12 visa requires a sponsor/guarantor letter. We provide this as part of our service, so you don\'t need to find one yourself.',
      },
      {
        question: 'Can I work or do business on a D12 visa?',
        answer: 'No, the D12 visa is for pre-investment activities and surveys only. You cannot sell goods/services or receive wages. For actual business operations, you need a KITAS.',
      },
      {
        question: 'What is the difference between 1-year and 2-year?',
        answer: 'The 1-year government fee is IDR 5,000,000 (Visa IDR 3M + Verification IDR 2M). The 2-year is IDR 7,000,000 (Visa IDR 5M + Verification IDR 2M). Both allow 180-day stays per entry, extendable once.',
      },
      {
        question: 'Can I convert D12 to a work permit or KITAS?',
        answer: 'No, the D12 visa cannot be converted to a limited residence permit (KITAS). You must apply for KITAS separately if you want to work or do business.',
      },
    ],
  },
  {
    id: 'd12-visa-2year',
    name: 'D12 Visa - 2 Years (Pre-Investment Visit Visa)',
    slug: 'd12-visa-2year',
    shortDescription: 'Multiple entry visa for pre-investment activities and business exploration (2 years validity)',
    description: 'The D12 Visa is a multiple-entry pre-investment visit visa that allows foreigners to conduct business surveys, explore investment opportunities, and plan business ventures in Indonesia. Valid for 2 years with 180-day stays per entry, extendable once for another 180 days. We provide the required sponsor letter as part of our service.',
    startingPrice: 9450000,
    duration: '2 years (180 days per entry)',
    icon: 'TrendingUp',
    category: 'visa',
    processingDays: '5 working days',
    benefits: [
      'Multiple entry visa with 2 years validity',
      'Stay up to 180 days per entry',
      'Extendable once for another 180 days (total 360 days per visit)',
      'Can conduct field surveys and pre-investment activities',
      'Also suitable for tourism and visiting friends/family',
      'Fast processing: 5 business days after payment',
      'Government fee: IDR 7,000,000 (Visa IDR 5,000,000 + Verification IDR 2,000,000)',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity for passport; 12 months for other travel documents)',
      'Recent color passport photo (within 1 year, white background)',
      'Proof of financial means: minimum USD 5,000 (bank statements)',
      'Letter or invitation from Indonesian government agency or private institution',
      'Institution letter from private company (we provide this)',
      'Curriculum vitae / CV (optional)',
      'Travel itinerary or planned activities (optional)',
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
        description: 'Pay government fee of IDR 7,000,000 (Visa: IDR 5,000,000 + Verification: IDR 2,000,000).',
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
        question: 'Do I need a sponsor for a D12 visa?',
        answer: 'Yes, the D12 visa requires a sponsor/guarantor letter. We provide this as part of our service, so you don\'t need to find one yourself.',
      },
      {
        question: 'Can I work or do business on a D12 visa?',
        answer: 'No, the D12 visa is for pre-investment activities and surveys only. You cannot sell goods/services or receive wages. For actual business operations, you need a KITAS.',
      },
      {
        question: 'What is the difference between 1-year and 2-year?',
        answer: 'The 1-year government fee is IDR 5,000,000 (Visa IDR 3M + Verification IDR 2M). The 2-year is IDR 7,000,000 (Visa IDR 5M + Verification IDR 2M). Both allow 180-day stays per entry, extendable once.',
      },
      {
        question: 'Can I convert D12 to a work permit or KITAS?',
        answer: 'No, the D12 visa cannot be converted to a limited residence permit (KITAS). You must apply for KITAS separately if you want to work or do business.',
      },
    ],
  },
  {
    id: 'retirement-kitas',
    name: 'Retirement KITAS (E33F)',
    slug: 'retirement-kitas',
    shortDescription: 'Limited stay permit for retirees aged 60+ (1-year validity, renewable up to 5 years)',
    description: 'The Retirement KITAS (E33F) is designed for foreign nationals aged 60 and above who wish to retire in Indonesia. Valid for 1 year and renewable annually for up to 5 years, this permit allows you to enjoy your retirement in beautiful Bali or anywhere in Indonesia.',
    startingPrice: 7350000,
    duration: '1 year (renewable up to 5 years)',
    icon: 'Palmtree',
    popular: true,
    category: 'permit',
    processingDays: '2-4 weeks',
    benefits: [
      'Live in Indonesia for 1 year (renewable)',
      'Multiple entry and exit privileges',
      'Bring spouse and dependents (additional fees apply)',
      'Access to local banking and utilities',
      'Pathway to long-term residency',
      'No need to leave the country for renewal',
    ],
    requirements: [
      'Age 60 years or older',
      'Valid passport (minimum 18 months validity)',
      'Passport-sized photos (4x6 cm, white background)',
      'Proof of pension or retirement income (min. USD 3,000/month or USD 36,000/year)',
      'Declaration of intent to deposit min. USD 50,000 in Indonesian state bank',
      'Health and life insurance (min. IDR 25 million coverage)',
      'Third party liability insurance',
      'Rental agreement valid for at least 12 months',
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
        question: 'What about the Silver Hair Visa (E33E)?',
        answer: 'The E33E Silver Hair Visa is a 5-year retirement permit for those aged 60+. It costs more upfront but avoids annual renewals. Contact us to discuss which option is best for you.',
      },
    ],
  },
  {
    id: 'digital-nomad-kitas',
    name: 'Remote Worker KITAS (E33G Digital Nomad Visa)',
    slug: 'digital-nomad-kitas',
    shortDescription: '1-year multiple entry visa for remote workers and digital nomads',
    description: 'The E33G Remote Worker KITAS is a 1-year limited stay permit designed specifically for digital nomads and remote workers employed by overseas companies. Live in Bali while working remotely — no Indonesian sponsor required. Must earn at least USD 60,000 per year.',
    startingPrice: 11250000,
    duration: '1 year (multiple entry, reapply annually)',
    icon: 'Laptop',
    popular: true,
    category: 'permit',
    processingDays: '5-10 working days',
    benefits: [
      'Valid for 1 year with multiple entry',
      'Work remotely for overseas employers from Indonesia',
      'No Indonesian sponsor or guarantor required',
      'Apply directly online through e-visa portal',
      'Bring spouse and children (additional fees apply)',
      'Access to local banking and utilities',
    ],
    requirements: [
      'Valid passport (minimum 6 months validity)',
      'Passport-sized photos (recent color photo)',
      'Proof of minimum annual income of USD 60,000',
      'Bank statements showing min. USD 2,000 (last 3 months)',
      'Employment contract or proof of remote work arrangement',
      'CV/Resume',
      'Must enter Indonesia within 90 days of visa issuance',
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
        description: 'Submit electronic documents including proof of income and employment. Pay government fees.',
      },
      {
        step: 3,
        title: 'Immigration Verification',
        description: 'Immigration office processes and verifies your application within 5-10 business days.',
      },
      {
        step: 4,
        title: 'Visa Issuance & Entry',
        description: 'Receive your E33G visa and enter Indonesia within 90 days. Your 1-year KITAS begins upon arrival.',
      },
    ],
    faqs: [
      {
        question: 'Can I work for Indonesian companies?',
        answer: 'No, the E33G is strictly for remote workers employed by overseas companies. All income must come from outside Indonesia. For local employment, you need an E23 Working KITAS.',
      },
      {
        question: 'What is the income requirement?',
        answer: 'You must earn at least USD 60,000 per year from overseas employment. You also need bank statements showing a minimum balance of USD 2,000 for the last 3 months.',
      },
      {
        question: 'Can I renew the E33G visa?',
        answer: 'The E33G is non-extendable. When it expires after 1 year, you can reapply for a new E33G visa to continue your stay.',
      },
      {
        question: 'What about the E33 Second Home Visa?',
        answer: 'The E33 Second Home Visa is a separate 5-year permit for high-net-worth individuals requiring a USD 130,000 bank deposit. The E33G is specifically for remote workers with lower financial requirements. Contact us to discuss which is right for you.',
      },
    ],
  },
  {
    id: 'investor-kitas',
    name: 'Working KITAS (E23 Work Visa)',
    slug: 'investor-kitas',
    shortDescription: '6-12 month work permit for foreign employees and investors in Indonesia',
    description: 'The E23 Working KITAS is a limited stay permit for foreign nationals employed by Indonesian companies or managing their own PT PMA. Includes work permit (IMTA) and allows legal employment in Indonesia. Duration depends on position: Directors/Senior Managers get 12 months, Advisors get 6 months.',
    startingPrice: 15500000,
    duration: '6-12 months (renewable)',
    icon: 'Briefcase',
    category: 'permit',
    processingDays: '2-3 months',
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
    id: 'investor-itas-e28a',
    name: 'Investor ITAS (E28A)',
    slug: 'investor-itas-e28a',
    shortDescription: 'Investor stay permit for foreign nationals with investments in Indonesian companies',
    description: 'The E28A Investor ITAS is a limited stay permit for foreign nationals who have made significant investments in Indonesian companies. This permit allows you to oversee and manage your investments while residing in Indonesia. Valid for 2 years and renewable.',
    startingPrice: 18500000,
    duration: '2 years (renewable)',
    icon: 'Landmark',
    category: 'permit',
    processingDays: '4-8 weeks',
    benefits: [
      'Legal residency for investors in Indonesia',
      'Valid for 2 years (renewable)',
      'Multiple entry and exit privileges',
      'Oversee and manage your investments',
      'Bring spouse and dependents',
      'Access to local banking and business facilities',
      'Pathway to permanent residency (KITAP)',
    ],
    requirements: [
      'Valid passport (minimum 18 months validity)',
      'Proof of investment in Indonesian company (PT PMA)',
      'Company registration documents (NIB, deed of establishment)',
      'Minimum investment amount as per BKPM regulations',
      'Passport-sized photos (4x6 cm, white background)',
      'Health insurance valid in Indonesia',
      'Sponsorship from PT PMA (we assist with setup)',
    ],
    process: [
      {
        step: 1,
        title: 'Investment Verification',
        description: 'We verify your investment documents and PT PMA registration with BKPM.',
      },
      {
        step: 2,
        title: 'ITAS Application',
        description: 'We submit your investor ITAS application to immigration with all supporting documents.',
      },
      {
        step: 3,
        title: 'Immigration Processing',
        description: 'Immigration office processes and verifies your application (4-8 weeks).',
      },
      {
        step: 4,
        title: 'ITAS Issuance',
        description: 'Receive your Investor ITAS card and begin managing your investments in Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'What is the minimum investment required?',
        answer: 'The minimum investment depends on the business sector and is regulated by BKPM (Investment Coordinating Board). Contact us for specific requirements for your investment type.',
      },
      {
        question: 'Do I need a PT PMA first?',
        answer: 'Yes, you need an established PT PMA (foreign-owned company) in Indonesia. We can help with PT PMA setup as well.',
      },
      {
        question: 'Can I work in the company I invested in?',
        answer: 'The Investor ITAS allows you to oversee and manage your investments. For active employment roles, you may need a separate work permit.',
      },
      {
        question: 'Can I convert this to permanent residency?',
        answer: 'Yes, after holding an Investor ITAS for several consecutive years, you may be eligible for KITAP (permanent residency). Requirements vary.',
      },
    ],
  },
  {
    id: 'voa-extension',
    name: 'VOA Extension',
    slug: 'voa-extension',
    shortDescription: 'Extend your Visa on Arrival by 30 additional days (60 days total)',
    description: 'Need more time in Bali? We handle the entire VOA extension process for you - from application to biometric appointment scheduling at the immigration office. Extend your stay by 30 additional days without the hassle of dealing with bureaucracy.',
    startingPrice: 810000,
    duration: '30 days additional',
    icon: 'RefreshCw',
    category: 'extension',
    processingDays: '3-5 working days',
    isExtension: true,
    benefits: [
      'Extend your stay by 30 additional days',
      'We handle all paperwork and applications',
      'Biometric appointment scheduling included',
      'Immigration office liaison support',
      'Online application through evisa.imigrasi.go.id',
      'Quick processing within 3-5 business days',
    ],
    requirements: [
      'Valid VOA stamp in passport',
      'Passport with minimum 6 months validity',
      'Apply at least 14 days before VOA expiry',
      'Proof of accommodation for extended stay',
      'Return or onward flight ticket',
    ],
    process: [
      {
        step: 1,
        title: 'Contact Us',
        description: 'Reach out via WhatsApp with your passport details and current VOA information.',
      },
      {
        step: 2,
        title: 'Application Filing',
        description: 'We submit your extension application online through the immigration system.',
      },
      {
        step: 3,
        title: 'Biometric Appointment',
        description: 'We schedule your biometric appointment at the nearest immigration office.',
      },
      {
        step: 4,
        title: 'Extension Approval',
        description: 'Receive your extension approval and enjoy 30 more days in Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'When should I apply for a VOA extension?',
        answer: 'Apply between 14 days before and 1 business day before your VOA expiry date. We recommend applying as early as possible to ensure timely processing.',
      },
      {
        question: 'Do I need to visit the immigration office?',
        answer: 'Yes, you must visit the immigration office once for biometric data collection (fingerprints and photo). We schedule the appointment and guide you through the process.',
      },
      {
        question: 'Can I extend the VOA more than once?',
        answer: 'No, the VOA can only be extended once for 30 days. For longer stays, consider a C1 visa (up to 180 days) or a D12 visa.',
      },
    ],
  },
  {
    id: 'c1-extension',
    name: 'C1 Visa Extension',
    slug: 'c1-extension',
    shortDescription: 'Extend your C1 tourist visa by 60 additional days (up to 180 days total)',
    description: 'Extend your C1 Single Entry Tourist Visa for an additional 60 days. Can be done twice for a maximum total stay of 180 days. We handle the paperwork, biometric scheduling, and immigration office visits to make the process hassle-free.',
    startingPrice: 2250000,
    duration: '60 days per extension',
    icon: 'RefreshCw',
    category: 'extension',
    processingDays: '5-7 working days',
    isExtension: true,
    benefits: [
      'Extend your stay by 60 additional days',
      'Can extend twice (up to 180 days total)',
      'We handle all paperwork and applications',
      'Biometric appointment scheduling included',
      'Immigration office liaison support',
      'Hassle-free process from start to finish',
    ],
    requirements: [
      'Valid C1 visa stamp in passport',
      'Passport with minimum 6 months validity',
      'Apply before current stay period expires',
      'Proof of accommodation for extended stay',
      'Proof of financial means',
      'Sponsor/guarantor (we provide this)',
    ],
    process: [
      {
        step: 1,
        title: 'Contact Us',
        description: 'Reach out via WhatsApp with your passport details and current C1 visa information.',
      },
      {
        step: 2,
        title: 'Extension Application',
        description: 'We submit your extension application through the immigration system.',
      },
      {
        step: 3,
        title: 'Biometric Appointment',
        description: 'Visit the immigration office for biometric verification (fingerprints and photo).',
      },
      {
        step: 4,
        title: 'Extension Approval',
        description: 'Receive your extension stamp and enjoy 60 more days in Indonesia.',
      },
    ],
    faqs: [
      {
        question: 'How many times can I extend my C1 visa?',
        answer: 'You can extend twice, each for 60 days. Total maximum stay: 180 days (60 initial + 60 first extension + 60 second extension).',
      },
      {
        question: 'When should I apply for extension?',
        answer: 'Apply before your current stay period expires. We recommend starting the process at least 14 days before your expiry date.',
      },
      {
        question: 'Do I need to visit the immigration office?',
        answer: 'Yes, since 2025 you must visit the local immigration office in person for biometric verification during each extension.',
      },
    ],
  },
  {
    id: 'd12-extension',
    name: 'D12 Visa Extension',
    slug: 'd12-extension',
    shortDescription: 'Extend your D12 visa stay by 180 additional days (PT PMA required since Feb 2026)',
    description: 'Extend your D12 Pre-Investment Visit Visa stay for an additional 180 days. As of February 2026, extensions require proof of a registered PT PMA with your name in the Deed of Establishment. We handle the entire extension process including biometric scheduling.',
    startingPrice: 4500000,
    duration: '180 days additional',
    icon: 'RefreshCw',
    category: 'extension',
    processingDays: '5-7 working days',
    isExtension: true,
    benefits: [
      'Extend your stay by 180 additional days',
      'Total stay of 360 days per entry',
      'We handle all paperwork and applications',
      'Biometric appointment scheduling included',
      'Immigration office liaison support',
      'Continue pre-investment activities without leaving',
    ],
    requirements: [
      'Valid D12 visa with active entry',
      'Passport with minimum 6 months validity',
      'Apply before current 180-day stay expires',
      'Registered PT PMA with your name in the Deed of Establishment (required since Feb 2026)',
      'Proof of legitimate pre-investment activities',
      'Proof of accommodation for extended stay',
      'Proof of financial means',
    ],
    process: [
      {
        step: 1,
        title: 'Contact Us',
        description: 'Reach out via WhatsApp with your passport details and current D12 visa information.',
      },
      {
        step: 2,
        title: 'Extension Application',
        description: 'We submit your extension application through the immigration system.',
      },
      {
        step: 3,
        title: 'Immigration Processing',
        description: 'Immigration processes your extension request (5-7 working days).',
      },
      {
        step: 4,
        title: 'Extension Approval',
        description: 'Receive your extension and continue your activities for an additional 180 days.',
      },
    ],
    faqs: [
      {
        question: 'Do I need a PT PMA to extend my D12?',
        answer: 'Yes, as of February 2026, D12 extensions require a registered PT PMA with your name in the Deed of Establishment, plus evidence of genuine pre-investment activities. Without this, the extension will be rejected.',
      },
      {
        question: 'Can I extend D12 more than once per entry?',
        answer: 'No, each D12 entry can only be extended once for 180 days. After the extension, you must exit and re-enter to start a new 180-day period.',
      },
      {
        question: 'When should I apply for the D12 extension?',
        answer: 'Apply before your current 180-day stay expires. We recommend starting at least 14 days before your expiry date. You must visit the immigration office in person for biometric verification.',
      },
    ],
  },
  {
    id: 'pt-pma',
    name: 'PT PMA Company Setup',
    slug: 'pt-pma',
    shortDescription: 'Full setup of foreign-owned company (PT PMA) in Indonesia',
    description: 'PT PMA (Penanaman Modal Asing) is a foreign-owned limited liability company in Indonesia. We handle the complete setup process, including company registration, business licenses, tax registration, and sponsor services for your KITAS applications.',
    startingPrice: 15000000,
    duration: 'One-time setup (ongoing support available)',
    icon: 'Building2',
    category: 'business',
    processingDays: '4-6 weeks',
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
        answer: 'As of October 2025, the minimum paid-up capital is IDR 2.5 billion (reduced from IDR 10 billion). Total investment value must still exceed IDR 10 billion per business activity per project. We can advise based on your business type.',
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

// Helper function to get services by category
export function getServicesByCategory(category: Service['category']): Service[] {
  return services.filter((service) => service.category === category);
}

// Helper function to get extension services
export function getExtensionServices(): Service[] {
  return services.filter((service) => service.isExtension);
}

// Pricing disclaimer
export const PRICING_DISCLAIMER = 'Prices shown are starting prices and may vary based on your nationality, processing time, and specific requirements. Government fees are included. Contact us for an exact quote.';
