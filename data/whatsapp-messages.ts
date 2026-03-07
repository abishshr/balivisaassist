export interface WhatsAppTemplate {
  serviceId: string;
  message: string;
}

export const whatsappTemplates: WhatsAppTemplate[] = [
  {
    serviceId: 'c1-visa',
    message: `Hi, I'm interested in the C1 Tourist Visa. Can you help?`,
  },
  {
    serviceId: 'retirement-kitas',
    message: `Hi, I'm interested in the Retirement KITAS. Can you tell me more?`,
  },
  {
    serviceId: 'digital-nomad-kitas',
    message: `Hi, I'm interested in the Digital Nomad KITAS (E33G). Can you help?`,
  },
  {
    serviceId: 'investor-kitas',
    message: `Hi, I'm interested in the Working KITAS. Can you tell me more?`,
  },
  {
    serviceId: 'investor-itas-e28a',
    message: `Hi, I'm interested in the Investor ITAS. Can you tell me more?`,
  },
  {
    serviceId: 'b1-visa',
    message: `Hi, I need help with a B1 Visa on Arrival. Can you assist?`,
  },
  {
    serviceId: 'b1-extension',
    message: `Hi, I need to extend my B1 visa. Can you help?`,
  },
  {
    serviceId: 'c1-extension',
    message: `Hi, I need to extend my C1 visa. Can you help?`,
  },
  {
    serviceId: 'c2-business-visa',
    message: `Hi, I'm interested in the C2 Business Visa. Can you help?`,
  },
  {
    serviceId: 'c6-social-visa',
    message: `Hi, I'm interested in the C6 Social/Volunteer Visa. Can you help?`,
  },
  {
    serviceId: 'd1-multi-entry-tourist',
    message: `Hi, I'm interested in the D1 Multi-Entry Tourist Visa. Can you tell me more?`,
  },
  {
    serviceId: 'd2-multi-entry-business',
    message: `Hi, I'm interested in the D2 Multi-Entry Business Visa. Can you tell me more?`,
  },
  {
    serviceId: 'd12-visa-1year',
    message: `Hi, I'm interested in the D12 Pre-Investment Visa (1 Year). Can you help?`,
  },
  {
    serviceId: 'd12-visa-2year',
    message: `Hi, I'm interested in the D12 Pre-Investment Visa (2 Years). Can you help?`,
  },
  {
    serviceId: 'd12-extension',
    message: `Hi, I need to extend my D12 visa. Can you help?`,
  },
  {
    serviceId: 'pt-pma',
    message: `Hi, I'm interested in PT PMA company setup. Can you tell me more?`,
  },
  {
    serviceId: 'bali-tourist-levy',
    message: `Hi, I need help with the Bali Tourist Levy. Can you assist?`,
  },
  {
    serviceId: 'general',
    message: `Hi, I need help with a visa for Indonesia. Can you assist?`,
  },
];

export function getWhatsAppTemplate(serviceId: string): string {
  const template = whatsappTemplates.find((t) => t.serviceId === serviceId);
  return template?.message || whatsappTemplates.find((t) => t.serviceId === 'general')!.message;
}
