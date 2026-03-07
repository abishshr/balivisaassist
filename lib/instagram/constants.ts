import type { ContentCategory } from '@/types/instagram'

export const WEEKLY_ROTATION: Record<number, ContentCategory> = {
  0: 'visa_tip',        // Sunday
  1: 'visa_tip',        // Monday
  2: 'bali_lifestyle',  // Tuesday
  3: 'visa_tip',        // Wednesday
  4: 'service_promo',   // Thursday
  5: 'bali_lifestyle',  // Friday
  6: 'faq_answer',      // Saturday
}

export const BRAND_VOICE = `You run @balivisaassist on Instagram — a visa service in Bali. Write like a real person, not a brand.

Rules:
- 1-2 sentences ONLY. Be concise. Think tweet-length, not blog post
- 1-2 emojis max, natural placement
- 4-6 hashtags
- No listicles, no emoji bullets, no "Here's the thing:", no "Pro tip:", no AI clichés
- Sound like a friend who knows about visas, not a marketing agency
- For image search queries: provide 2-4 word Unsplash search terms (e.g. "Bali rice terrace", "passport stamps", "coworking cafe Bali")`

export const TOPIC_POOLS: Record<ContentCategory, string[]> = {
  visa_tip: [
    'B211A visa application process and requirements',
    'KITAS (temporary stay permit) guide for expats',
    'KITAP (permanent stay permit) eligibility',
    'Tourist visa extension (B1 to 60 days)',
    'E-visa vs visa on arrival differences',
    'Visa overstay penalties and how to avoid them',
    'Documents needed for Indonesia visa applications',
    'Passport validity requirements for Indonesia',
    'Working permit (IMTA) essentials',
    'Social/cultural visa (sosial budaya) explained',
    'Second home visa for retirees',
    'Golden visa for investors',
    'Visa renewal timeline and deadlines',
    'Common visa application mistakes',
    'Sponsor letter requirements explained',
  ],
  bali_lifestyle: [
    'Best coworking spaces in Bali for digital nomads',
    'Bali cost of living guide for expats',
    'Indonesian cultural etiquette tips',
    'Top neighborhoods for expats in Bali',
    'Bali health and wellness scene',
    'Local Balinese ceremonies and traditions',
    'Best beaches in Bali for different activities',
    'Bali food scene - local vs international cuisine',
    'Transportation tips for getting around Bali',
    'Setting up a bank account in Indonesia',
    'Indonesian language basics for daily life',
    'Bali weather and best time to visit',
  ],
  service_promo: [
    'Why choose a visa agent over DIY',
    'BaliVisaAssist full-service visa packages',
    'Document preparation service highlights',
    'Fast-track visa processing',
    'Immigration office accompaniment service',
    'Visa consultation service overview',
    'Company formation and business visa packages',
    'Family visa package deals',
  ],
  faq_answer: [
    'How long can I stay in Indonesia on a tourist visa?',
    'Can I work remotely on a tourist visa in Indonesia?',
    'What happens if my visa expires while I am in Bali?',
    'How early should I start my visa application?',
    'Do I need a sponsor for an Indonesia visa?',
    'Can I extend my visa without leaving Indonesia?',
    'What is the difference between KITAS and KITAP?',
    'How much does a visa agent cost in Bali?',
    'Is the Indonesian e-visa legitimate?',
    'Can I change my visa type while in Indonesia?',
  ],
  immigration_news: [
    'Latest Indonesian immigration policy changes',
    'New visa regulations and updates',
    'Immigration office announcements',
    'Indonesia digital nomad visa updates',
    'Visa fee changes and updates',
  ],
  testimonial: [
    'Client success story - KITAS approval',
    'Client experience - visa extension process',
    'Why expats trust BaliVisaAssist',
  ],
}

export const INSTAGRAM_API_BASE = 'https://graph.instagram.com/v21.0'
export const GRAPH_API_BASE = 'https://graph.facebook.com/v21.0'

export const MAX_CAPTION_LENGTH = 300
export const MAX_HASHTAGS = 30
export const IMAGE_PUBLISH_WAIT_MS = 30000 // 30 seconds for IG to process

