import Anthropic from '@anthropic-ai/sdk'
import { BRAND_VOICE, TOPIC_POOLS, MAX_CAPTION_LENGTH } from './constants'
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
  customTopic?: string
): Promise<GeneratedContent> {
  const topics = TOPIC_POOLS[category]
  const topic = customTopic || topics[Math.floor(Math.random() * topics.length)]

  const captionPrompt = template?.caption_prompt
    || `Write an Instagram caption about: "${topic}". Category: ${category.replace('_', ' ')}.`

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
  newsUrl?: string
): Promise<GeneratedContent> {
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
