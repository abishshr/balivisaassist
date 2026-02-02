import { getWhatsAppTemplate } from '@/data/whatsapp-messages';

/**
 * Generate WhatsApp click-to-chat URL with prefilled message
 * @param serviceId - The service ID to use for the message template
 * @param phoneNumber - WhatsApp number (from env or custom)
 * @returns WhatsApp URL with encoded message
 */
export function generateWhatsAppURL(
  serviceId?: string,
  phoneNumber?: string
): string {
  const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';

  // Remove any non-numeric characters from phone number
  const cleanPhone = phone.replace(/\D/g, '');

  // Get the appropriate message template
  const message = serviceId ? getWhatsAppTemplate(serviceId) : getWhatsAppTemplate('general');

  // URL encode the message
  const encodedMessage = encodeURIComponent(message);

  // Return wa.me URL
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp URL with custom message
 * @param message - Custom message to send
 * @param phoneNumber - WhatsApp number (from env or custom)
 * @returns WhatsApp URL with encoded message
 */
export function generateCustomWhatsAppURL(
  message: string,
  phoneNumber?: string
): string {
  const phone = phoneNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
