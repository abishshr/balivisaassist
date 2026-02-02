import { z } from 'zod';

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),

  whatsapp: z
    .string()
    .min(8, 'WhatsApp number must be at least 8 digits')
    .max(20, 'WhatsApp number is too long')
    .regex(
      /^[\d\s\+\-\(\)]+$/,
      'WhatsApp number can only contain numbers, spaces, +, -, ( )'
    ),

  nationality: z
    .string()
    .min(2, 'Please enter your nationality')
    .max(100, 'Nationality is too long'),

  service: z
    .string()
    .min(1, 'Please select a service'),

  desiredStartDate: z
    .string()
    .optional(),

  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),

  // Honeypot field for spam protection
  website: z.string().max(0, 'Invalid submission').optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Email validation (simple)
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * WhatsApp number validation
 * Accepts formats like: +628123456789, 628123456789, 08123456789, etc.
 */
export function isValidWhatsApp(number: string): boolean {
  const cleaned = number.replace(/[\s\-\(\)]/g, '');
  const whatsappRegex = /^(\+?62|0)[\d]{8,13}$/;
  return whatsappRegex.test(cleaned);
}

/**
 * Sanitize WhatsApp number to international format
 * Converts 08xxx to +628xxx
 */
export function sanitizeWhatsAppNumber(number: string): string {
  let cleaned = number.replace(/[\s\-\(\)]/g, '');

  // If starts with 0, replace with +62
  if (cleaned.startsWith('0')) {
    cleaned = '+62' + cleaned.substring(1);
  }

  // If starts with 62 but no +, add +
  if (cleaned.startsWith('62') && !cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  // If doesn't start with +, add +62
  if (!cleaned.startsWith('+')) {
    cleaned = '+62' + cleaned;
  }

  return cleaned;
}
