export interface Country {
  slug: string;
  name: string;
  demonym: string;
  voaEligible: boolean;
  availableVisas: string[]; // service IDs
}

export const countries: Country[] = [
  {
    slug: 'united-states',
    name: 'United States',
    demonym: 'American',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'united-kingdom',
    name: 'United Kingdom',
    demonym: 'British',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'australia',
    name: 'Australia',
    demonym: 'Australian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'canada',
    name: 'Canada',
    demonym: 'Canadian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'germany',
    name: 'Germany',
    demonym: 'German',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'france',
    name: 'France',
    demonym: 'French',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'netherlands',
    name: 'Netherlands',
    demonym: 'Dutch',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'india',
    name: 'India',
    demonym: 'Indian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'china',
    name: 'China',
    demonym: 'Chinese',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'japan',
    name: 'Japan',
    demonym: 'Japanese',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'south-korea',
    name: 'South Korea',
    demonym: 'South Korean',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'russia',
    name: 'Russia',
    demonym: 'Russian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'brazil',
    name: 'Brazil',
    demonym: 'Brazilian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'italy',
    name: 'Italy',
    demonym: 'Italian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'spain',
    name: 'Spain',
    demonym: 'Spanish',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'new-zealand',
    name: 'New Zealand',
    demonym: 'New Zealand',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'south-africa',
    name: 'South Africa',
    demonym: 'South African',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    demonym: 'Singaporean',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'thailand',
    name: 'Thailand',
    demonym: 'Thai',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
  {
    slug: 'malaysia',
    name: 'Malaysia',
    demonym: 'Malaysian',
    voaEligible: true,
    availableVisas: ['voa-visa', 'c1-visa', 'c2-business-visa', 'c6-social-visa', 'd1-multi-entry-tourist', 'd2-multi-entry-business', 'd12-visa-1year', 'd12-visa-2year', 'retirement-kitas', 'digital-nomad-kitas', 'investor-kitas', 'investor-itas-e28a', 'pt-pma', 'voa-extension', 'c1-extension', 'd12-extension', 'bali-tourist-levy'],
  },
];

export function getCountryBySlug(slug: string): Country | undefined {
  return countries.find((c) => c.slug === slug);
}
