import Anthropic from '@anthropic-ai/sdk'
import { BRAND_VOICE, TOPIC_POOLS, MAX_CAPTION_LENGTH } from './constants'
import type { ContentCategory, ContentTemplate } from '@/types/instagram'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/** Strip markdown code fences from Claude's JSON responses */
function cleanJsonResponse(text: string): string {
  return text.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim()
}

interface GeneratedContent {
  caption: string
  hashtags: string[]
  imagePrompt: string
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
    || `Generate an Instagram caption about: "${topic}". Category: ${category.replace('_', ' ')}.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

${captionPrompt}

Topic: ${topic}

Respond in JSON format with these fields:
{
  "caption": "The Instagram caption text (max ${MAX_CAPTION_LENGTH} chars, include 2-4 relevant emojis, end with a call-to-action)",
  "hashtags": ["array", "of", "relevant", "hashtags", "without", "the", "hash", "symbol"],
  "imagePrompt": "A detailed prompt for generating an image to accompany this post. Describe the visual style, composition, colors, and mood. Do NOT include any text in the image."
}

${template?.hashtag_pool?.length ? `Preferred hashtags to include: ${template.hashtag_pool.join(', ')}` : ''}

Return ONLY valid JSON, no markdown formatting.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
      imagePrompt: parsed.imagePrompt || `Professional image related to ${topic}, Bali tropical setting`,
      topic,
    }
  } catch {
    // Fallback if JSON parsing fails
    return {
      caption: responseText.slice(0, MAX_CAPTION_LENGTH),
      hashtags: ['balivisaassist', 'balivisa', 'bali'],
      imagePrompt: `Professional image related to ${topic}, Bali tropical setting, clean modern design`,
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
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

Transform this immigration news into an engaging Instagram post:

Title: ${newsTitle}
Description: ${newsDescription}
${newsUrl ? `Source: ${newsUrl}` : ''}

Requirements:
- Make it informative but accessible to non-experts
- Explain what this means for expats/tourists in Bali
- Include practical advice or next steps
- Add a call-to-action to contact BaliVisaAssist for help
- Keep caption under ${MAX_CAPTION_LENGTH} characters

Respond in JSON format:
{
  "caption": "The Instagram caption",
  "hashtags": ["relevant", "hashtags", "without", "hash"],
  "imagePrompt": "A prompt for generating an image for this news post. News/announcement style, professional, no text in the image."
}

Return ONLY valid JSON, no markdown formatting.`,
      },
    ],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''

  try {
    const parsed = JSON.parse(cleanJsonResponse(responseText))
    return {
      caption: (parsed.caption || '').slice(0, MAX_CAPTION_LENGTH),
      hashtags: (parsed.hashtags || []).map((h: string) => h.replace(/^#/, '')),
      imagePrompt: parsed.imagePrompt || 'Immigration news announcement, professional infographic style, teal and white',
      topic: newsTitle,
    }
  } catch {
    return {
      caption: `📢 Immigration Update: ${newsTitle}\n\n${newsDescription}\n\nNeed help understanding how this affects your visa? DM us or visit the link in our bio!\n\n#balivisaassist #indonesiavisa #immigrationnews`,
      hashtags: ['balivisaassist', 'indonesiavisa', 'immigrationnews', 'balivisa', 'baliexpat'],
      imagePrompt: 'Immigration news announcement, official document style, professional, Indonesia flag colors',
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
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

The following Instagram caption needs to be rewritten:

"${currentCaption}"

Category: ${category.replace('_', ' ')}
${feedback ? `Feedback: ${feedback}` : 'Make it better, more engaging, and more on-brand.'}

Respond in JSON format:
{
  "caption": "The new caption (max ${MAX_CAPTION_LENGTH} chars)",
  "hashtags": ["updated", "hashtags"]
}

Return ONLY valid JSON, no markdown formatting.`,
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
