export interface WhatsAppTemplate {
  serviceId: string;
  message: string;
}

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    serviceId: 'c1-visa',
    message: `Hi BaliVisaAssist! 👋

I'm interested in the *C1 Tourist Visa* (60-day single entry visa).

My details:
- Nationality: [Your nationality]
- Intended arrival date: [Date]
- Purpose: [Tourism/Family visit/Attending event]
- Planned duration: [60 days / Need extensions to 180 days]

Please let me know the next steps and exact pricing for my nationality. Thank you!`,
  },
  {
    serviceId: 'retirement-kitas',
    message: `Hi BaliVisaAssist! 👋

I'm interested in the *Retirement KITAS* (1-year permit).

My details:
- Age: [Your age - must be 55+]
- Nationality: [Your nationality]
- Monthly pension/retirement income: [USD amount]
- Current location: [Country]
- Planned move date: [Date]

Note: Minimum USD 3,000/month pension required.

I'd like to know more about the process and requirements. Thank you!`,
  },
  {
    serviceId: 'digital-nomad-kitas',
    message: `Hi BaliVisaAssist! 👋

I'm interested in the *E33 Second Home Visa* (5-year Digital Nomad permit).

My details:
- Nationality: [Your nationality]
- Current location: [Country]
- Work: [Remote/Freelance/Business owner/Investor]
- Financial commitment option: [USD 130k bank savings / USD 1M property purchase]
- Planned move date: [Date]

Please let me know the requirements and next steps. Thank you!`,
  },
  {
    serviceId: 'investor-kitas',
    message: `Hi BaliVisaAssist! 👋

I'm interested in the *Investor/Working KITAS*.

My details:
- Nationality: [Your nationality]
- Status: [Have PT PMA / Need PT PMA setup / Employed by Indonesian company]
- Current location: [Country]
- Planned start date: [Date]

Please advise on the process and requirements. Thank you!`,
  },
  {
    serviceId: 'voa-visa',
    message: `Hi BaliVisaAssist! 👋

I'm interested in *VOA Visa assistance* and/or extension.

My details:
- Nationality: [Your nationality]
- Arrival date: [Date]
- Need: [Pre-arrangement / Extension / Both]

Please let me know how you can help. Thank you!`,
  },
  {
    serviceId: 'd12-visa',
    message: `Hi BaliVisaAssist! 👋

I'm interested in the *D12 Pre-Investment Visit Visa*.

My details:
- Nationality: [Your nationality]
- Purpose: [Business survey/Investment exploration/Field research]
- Intended arrival date: [Date]
- Visa validity preference: [1 year / 2 years]

Please help me with the application process and requirements. Thank you!`,
  },
  {
    serviceId: 'pt-pma',
    message: `Hi BaliVisaAssist! 👋

I'm interested in *PT PMA company setup*.

My details:
- Nationality: [Your nationality]
- Business type: [Your planned business]
- Number of shareholders: [Number]
- Timeline: [When do you want to start?]

Please provide more information about the setup process and costs. Thank you!`,
  },
  {
    serviceId: 'general',
    message: `Hi BaliVisaAssist! 👋

I'm interested in learning more about your visa services for Indonesia.

My details:
- Nationality: [Your nationality]
- Purpose: [Tourism/Business/Retirement/Work/Investment]
- Timeline: [When do you plan to come to Indonesia?]

Please let me know which visa option would be best for me. Thank you!`,
  },
];

export function getWhatsAppTemplate(serviceId: string): string {
  const template = whatsappTemplates.find((t) => t.serviceId === serviceId);
  return template?.message || whatsappTemplates.find((t) => t.serviceId === 'general')!.message;
}
