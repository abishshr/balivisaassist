import Anthropic from '@anthropic-ai/sdk'
import { BRAND_VOICE, TOPIC_POOLS, MAX_CAPTION_LENGTH, VISA_TYPES_FOR_MIXING } from './constants'
import type { ContentCategory, ContentTemplate } from '@/types/instagram'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/** Strip markdown code fences from Claude's JSON responses */
function cleanJsonResponse(text: string): string {
  // Remove any leading/trailing whitespace first
  let cleaned = text.trim()
  // Strip opening code fence (```json or ```) anywhere at the start
  cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '')
  // Strip closing code fence
  cleaned = cleaned.replace(/\n?```\s*$/i, '')
  cleaned = cleaned.trim()
  // If the result still doesn't start with {, try to extract JSON object
  if (!cleaned.startsWith('{')) {
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (match) cleaned = match[0]
  }
  return cleaned
}

interface GeneratedContent {
  caption: string
  hashtags: string[]
  imageSearchQuery: string
  topic: string
}

/**
 * Generate a full Instagram post (caption + hashtags + image prompt) using Claude
 */
export async function generateContent(
  category: ContentCategory,
  template?: ContentTemplate | null,
  customTopic?: string,
  recentImageQueries?: string[],
  recentCaptions?: string[]
): Promise<GeneratedContent> {
  const topics = TOPIC_POOLS[category]
  const topic = customTopic || topics[Math.floor(Math.random() * topics.length)]

  const captionPrompt = template?.caption_prompt
    || `Write an Instagram caption about: "${topic}". Category: ${category.replace('_', ' ')}.`

  const avoidQueriesNote = recentImageQueries?.length
    ? `\nIMPORTANT: Do NOT use any of these previously used image search queries (or very similar ones). Pick something visually different:\n${recentImageQueries.map(q => `- "${q}"`).join('\n')}`
    : ''

  const avoidCaptionsNote = recentCaptions?.length
    ? `\nIMPORTANT: Do NOT repeat similar captions. Here are recent ones to avoid:\n${recentCaptions.slice(0, 10).map(c => `- "${c.slice(0, 80)}"`).join('\n')}`
    : ''

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

${captionPrompt}

Topic: ${topic}

Respond in JSON:
{
  "caption": "1-2 sentences max (under ${MAX_CAPTION_LENGTH} chars). Sound human, not like AI.",
  "hashtags": ["4-6", "relevant", "hashtags"],
  "imageSearchQuery": "2-4 word Unsplash search query for a real photo (e.g. 'Bali temple sunrise', 'passport visa stamps')"
}
${avoidQueriesNote}
${avoidCaptionsNote}

${template?.hashtag_pool?.length ? `Include some of these hashtags: ${template.hashtag_pool.join(', ')}` : ''}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
      imageSearchQuery: parsed.imageSearchQuery || `Bali ${topic.split(' ')[0]}`,
      topic,
    }
  } catch {
    return {
      caption: responseText.slice(0, MAX_CAPTION_LENGTH),
      hashtags: ['balivisaassist', 'balivisa', 'bali'],
      imageSearchQuery: 'Bali tropical landscape',
      topic,
    }
  }
}

/**
 * Transform scraped news into an Instagram caption
 */
export async function generateNewsCaption(
  newsTitle: string,
  newsDescription: string,
  newsUrl?: string,
  recentImageQueries?: string[],
  recentCaptions?: string[]
): Promise<GeneratedContent> {
  const avoidQueriesNote = recentImageQueries?.length
    ? `\nIMPORTANT: Do NOT use any of these previously used image search queries (or very similar ones). Pick something visually different:\n${recentImageQueries.map(q => `- "${q}"`).join('\n')}`
    : ''

  const avoidCaptionsNote = recentCaptions?.length
    ? `\nIMPORTANT: Do NOT repeat similar captions. Here are recent ones to avoid:\n${recentCaptions.slice(0, 10).map(c => `- "${c.slice(0, 80)}"`).join('\n')}`
    : ''

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

News story — turn it into a 1-2 sentence Instagram caption. React naturally, not like a press release.

Title: ${newsTitle}
Description: ${newsDescription}
${newsUrl ? `Source: ${newsUrl}` : ''}

Respond in JSON:
{
  "caption": "1-2 sentences max (under ${MAX_CAPTION_LENGTH} chars). Quick, natural reaction.",
  "hashtags": ["4-6", "relevant", "hashtags"],
  "imageSearchQuery": "2-4 word Unsplash search query for a real photo related to this news"
}
${avoidQueriesNote}
${avoidCaptionsNote}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
      imageSearchQuery: parsed.imageSearchQuery || 'Indonesia immigration office',
      topic: newsTitle,
    }
  } catch {
    return {
      caption: `${newsTitle} — DM us if you need help with this.`,
      hashtags: ['balivisaassist', 'indonesiavisa', 'immigrationnews', 'balivisa'],
      imageSearchQuery: 'Indonesia immigration',
      topic: newsTitle,
    }
  }
}

/**
 * Generate a mixed Bali news + visa caption from scraped Instagram news
 */
export async function generateMixedCaption(
  newsCaption: string,
  sourceAccount: string,
  visaType?: string,
  recentCaptions?: string[]
): Promise<GeneratedContent> {
  const visa = visaType
    ? VISA_TYPES_FOR_MIXING.find((v) => v.name === visaType)
    : VISA_TYPES_FOR_MIXING[Math.floor(Math.random() * VISA_TYPES_FOR_MIXING.length)]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

You're rewriting a local Bali news post from @${sourceAccount} into your own Instagram caption. Read the original, then write something inspired by it — but naturally weave in a mention of ${visa?.name} (${visa?.angle}).

Original post from @${sourceAccount}:
"${newsCaption.slice(0, 500)}"

Rules:
- 1-2 sentences. First sentence about the Bali news, second sentence naturally pivots to the visa angle
- Don't copy the original — be inspired by it
- The visa mention should feel natural, not forced. Like "If you're planning a longer stay..." or "Perfect reason to extend your trip..."
- Credit @${sourceAccount} with a small mention
${recentCaptions?.length ? `\nIMPORTANT: Do NOT repeat similar captions. Here are recent ones to avoid:\n${recentCaptions.slice(0, 10).map(c => `- "${c.slice(0, 80)}"`).join('\n')}` : ''}

Respond in JSON:
{
  "caption": "1-2 sentences (under ${MAX_CAPTION_LENGTH} chars)",
  "hashtags": ["4-6", "mix of bali + visa hashtags"],
  "imageSearchQuery": "not needed, will use scraped image"
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
      imageSearchQuery: parsed.imageSearchQuery || '',
      topic: `Bali news from @${sourceAccount}`,
    }
  } catch {
    return {
      caption: `Spotted on @${sourceAccount} — ${visa?.name} gives you ${visa?.angle}. DM us for help.`,
      hashtags: ['balivisaassist', 'balivisa', 'bali', 'balinews'],
      imageSearchQuery: '',
      topic: `Bali news from @${sourceAccount}`,
    }
  }
}

interface StoryText {
  line1: string
  line2: string
  cta: string
}

/**
 * Generate short overlay text for an Instagram Story
 */
export async function generateStoryText(
  newsCaption: string,
  sourceAccount: string
): Promise<StoryText> {
  const visa = VISA_TYPES_FOR_MIXING[Math.floor(Math.random() * VISA_TYPES_FOR_MIXING.length)]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You run @balivisaassist. Generate SHORT text for an Instagram Story overlay (text on top of a photo).

Original Bali news from @${sourceAccount}:
"${newsCaption.slice(0, 300)}"

Generate 3 lines:
- line1: Hook about the news (max 40 chars, attention-grabbing)
- line2: Natural visa angle with ${visa.name} (max 50 chars)
- cta: Call to action (max 30 chars, e.g. "DM us for help", "Link in bio")

Respond in JSON:
{
  "line1": "short hook",
  "line2": "visa angle",
  "cta": "call to action"
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      line1: (parsed.line1 || 'Bali update').slice(0, 40),
      line2: (parsed.line2 || `${visa.name} — ${visa.angle}`).slice(0, 50),
      cta: (parsed.cta || 'DM us for visa help').slice(0, 30),
    }
  } catch {
    return {
      line1: 'Bali update',
      line2: `${visa.name} — ${visa.angle}`,
      cta: 'DM us for visa help',
    }
  }
}

interface ReelText {
  hook: string
  detail: string
  cta: string
  caption: string
  hashtags: string[]
}

/**
 * Generate text for a Reel: hook, detail, CTA overlays + feed caption/hashtags
 */
export async function generateReelText(
  newsCaption: string,
  sourceAccount: string
): Promise<ReelText> {
  const visa = VISA_TYPES_FOR_MIXING[Math.floor(Math.random() * VISA_TYPES_FOR_MIXING.length)]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `You run @balivisaassist. Generate text for an Instagram Reel (text appears over a zooming photo).

Bali news from @${sourceAccount}:
"${newsCaption.slice(0, 300)}"

Generate:
- hook: Attention-grabbing first line (max 35 chars). Appears at 1s.
- detail: Visa angle with ${visa.name} (max 50 chars). Appears at 3s.
- cta: Call to action (max 25 chars). Appears at 5s.
- caption: Feed caption, 1-2 sentences (under ${MAX_CAPTION_LENGTH} chars).
- hashtags: 4-6 relevant hashtags.

Respond in JSON:
{
  "hook": "short attention grabber",
  "detail": "visa angle",
  "cta": "call to action",
  "caption": "feed caption",
  "hashtags": ["tag1", "tag2"]
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      hook: (parsed.hook || 'Bali update').slice(0, 35),
      detail: (parsed.detail || `${visa.name} — ${visa.angle}`).slice(0, 50),
      cta: (parsed.cta || 'DM us for visa help').slice(0, 25),
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || ['balivisaassist', 'balivisa']).map((h: string) => h.replace(/^#/, '')),
    }
  } catch {
    return {
      hook: 'Bali update',
      detail: `${visa.name} — ${visa.angle}`,
      cta: 'DM us for visa help',
      caption: `Latest from Bali via @${sourceAccount}. Need visa help? DM us.`,
      hashtags: ['balivisaassist', 'balivisa', 'bali', 'balireels'],
    }
  }
}

/**
 * Generate short overlay text for an Instagram Story from a topic (no news dependency)
 */
export async function generateStoryTextFromTopic(
  topic: string
): Promise<StoryText> {
  const visa = VISA_TYPES_FOR_MIXING[Math.floor(Math.random() * VISA_TYPES_FOR_MIXING.length)]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 300,
    messages: [
      {
        role: 'user',
        content: `You run @balivisaassist. Generate SHORT text for an Instagram Story overlay (text on top of a photo).

Topic: "${topic}"

Generate 3 lines:
- line1: Hook about the topic (max 40 chars, attention-grabbing)
- line2: Helpful detail or ${visa.name} angle (max 50 chars)
- cta: Call to action (max 30 chars, e.g. "DM us for help", "Link in bio")

Respond in JSON:
{
  "line1": "short hook",
  "line2": "helpful detail",
  "cta": "call to action"
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      line1: (parsed.line1 || 'Visa tip').slice(0, 40),
      line2: (parsed.line2 || `${visa.name} — ${visa.angle}`).slice(0, 50),
      cta: (parsed.cta || 'DM us for visa help').slice(0, 30),
    }
  } catch {
    return {
      line1: 'Visa tip',
      line2: `${visa.name} — ${visa.angle}`,
      cta: 'DM us for visa help',
    }
  }
}

/**
 * Generate text for a Reel from a topic (no news dependency)
 */
export async function generateReelTextFromTopic(
  topic: string
): Promise<ReelText> {
  const visa = VISA_TYPES_FOR_MIXING[Math.floor(Math.random() * VISA_TYPES_FOR_MIXING.length)]

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 400,
    messages: [
      {
        role: 'user',
        content: `You run @balivisaassist. Generate text for an Instagram Reel (text appears over a zooming photo).

Topic: "${topic}"

Generate:
- hook: Attention-grabbing first line (max 35 chars). Appears at 1s.
- detail: Visa angle with ${visa.name} (max 50 chars). Appears at 3s.
- cta: Call to action (max 25 chars). Appears at 5s.
- caption: Feed caption, 1-2 sentences (under ${MAX_CAPTION_LENGTH} chars).
- hashtags: 4-6 relevant hashtags.

Respond in JSON:
{
  "hook": "short attention grabber",
  "detail": "visa angle",
  "cta": "call to action",
  "caption": "feed caption",
  "hashtags": ["tag1", "tag2"]
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      hook: (parsed.hook || 'Visa tip').slice(0, 35),
      detail: (parsed.detail || `${visa.name} — ${visa.angle}`).slice(0, 50),
      cta: (parsed.cta || 'DM us for visa help').slice(0, 25),
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || ['balivisaassist', 'balivisa']).map((h: string) => h.replace(/^#/, '')),
    }
  } catch {
    return {
      hook: 'Visa tip',
      detail: `${visa.name} — ${visa.angle}`,
      cta: 'DM us for visa help',
      caption: `${topic}. Need visa help? DM us.`,
      hashtags: ['balivisaassist', 'balivisa', 'bali', 'balireels'],
    }
  }
}

/**
 * Regenerate just the caption for an existing post
 */
export async function regenerateCaption(
  currentCaption: string,
  category: ContentCategory,
  feedback?: string
): Promise<{ caption: string; hashtags: string[] }> {
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

Rewrite this caption to be 1-2 sentences max:

"${currentCaption}"

Category: ${category.replace('_', ' ')}
${feedback ? `Feedback: ${feedback}` : 'Make it shorter and more human.'}

Respond in JSON:
{
  "caption": "1-2 sentences (max ${MAX_CAPTION_LENGTH} chars)",
  "hashtags": ["4-6", "hashtags"]
}

Return ONLY valid JSON, no markdown.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
    }
  } catch {
    return { caption: currentCaption, hashtags: [] }
  }
}
