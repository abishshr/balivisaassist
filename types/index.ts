import { Service } from '@/data/services';

export type { Service };

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  faqs: FAQ[];
}

export interface LegalSection {
  title: string;
  content: string;
}

export interface LegalDocument {
  lastUpdated: string;
  sections: LegalSection[];
}

export interface NavLink {
  href: string;
  label: string;
  children?: NavLink[];
}

export interface ContactFormSubmission {
  name: string;
  email: string;
  whatsapp: string;
  nationality: string;
  service: string;
  desiredStartDate?: string;
  message: string;
  submittedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}
