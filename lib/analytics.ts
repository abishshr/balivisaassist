// Google Analytics 4 Event Tracking

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void;
    fbq?: (
      track: string,
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}

/**
 * Google Analytics pageview event
 */
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function pageview(url: string) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
}

/**
 * Google Analytics custom events
 */
export function gtagEvent(
  action: string,
  params?: Record<string, any>
) {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', action, params);
  }
}

/**
 * Track service page view
 */
export function trackServiceView(serviceName: string, serviceId: string) {
  gtagEvent('view_service', {
    service_name: serviceName,
    service_id: serviceId,
  });

  // Meta Pixel
  metaPixelEvent('ViewContent', {
    content_name: serviceName,
    content_category: 'Service',
    content_ids: [serviceId],
  });
}

/**
 * Track WhatsApp button click
 */
export function trackWhatsAppClick(serviceId?: string) {
  gtagEvent('click_whatsapp', {
    service_id: serviceId || 'general',
    button_location: window.location.pathname,
  });

  // Meta Pixel
  metaPixelEvent('Contact', {
    contact_method: 'WhatsApp',
    service_id: serviceId || 'general',
  });
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmit(serviceId: string) {
  gtagEvent('submit_contact_form', {
    service_id: serviceId,
    form_location: window.location.pathname,
  });

  // Meta Pixel
  metaPixelEvent('Lead', {
    content_name: 'Contact Form',
    service_id: serviceId,
  });
}

/**
 * Track pricing page view
 */
export function trackPricingView() {
  gtagEvent('view_pricing', {
    page_location: window.location.pathname,
  });

  // Meta Pixel
  metaPixelEvent('ViewContent', {
    content_name: 'Services & Pricing',
    content_category: 'Pricing',
  });
}

// Meta Pixel (Facebook Pixel)

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Meta Pixel pageview event
 */
export function metaPixelPageview() {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', 'PageView');
  }
}

/**
 * Meta Pixel custom events
 */
export function metaPixelEvent(
  eventName: string,
  params?: Record<string, any>
) {
  if (typeof window.fbq !== 'undefined') {
    window.fbq('track', eventName, params);
  }
}
