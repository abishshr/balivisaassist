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
    || `Write an Instagram caption about: "${topic}". Category: ${category.replace('_', ' ')}.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: `${BRAND_VOICE}

${captionPrompt}

Topic: ${topic}

Write it like a real Instagram post from someone who actually lives in Bali — not like a brand or AI. Vary your format: sometimes a short story, sometimes a quick thought, sometimes a longer explainer. Don't follow the same template every time.

Respond in JSON:
{
  "caption": "The caption (max ${MAX_CAPTION_LENGTH} chars). Make it sound human. No listicles with emoji bullets. No generic hooks. Write like a real person.",
  "hashtags": ["6-12", "relevant", "hashtags", "mix", "of", "niche", "and", "broad"],
  "imagePrompt": "A photo-realistic image prompt. Think: the kind of photo someone would actually take in Bali with their phone. Natural lighting, real locations, candid feel. NO text overlays, NO graphic design, NO corporate stock photo vibes."
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

Here's a news story. Turn it into a natural Instagram post — like you just read about it and want to share it with your followers in your own words. Don't make it sound like a press release.

Title: ${newsTitle}
Description: ${newsDescription}
${newsUrl ? `Source: ${newsUrl}` : ''}

Guidelines:
- React to the news like a real person would ("just saw this", "heads up everyone", "so this is interesting...")
- Explain what it actually means in plain language
- If it's Bali lifestyle news, tie it to the expat experience naturally
- If it's immigration news, share what people should actually do about it
- Don't force a sales pitch — if it makes sense to mention your services, do it casually
- Keep it under ${MAX_CAPTION_LENGTH} characters

Respond in JSON:
{
  "caption": "Your natural reaction to the news, written like a real person",
  "hashtags": ["relevant", "hashtags", "without", "hash"],
  "imagePrompt": "A photo-realistic image related to this news. Think editorial photography — candid Bali scenes, real places, natural lighting. NO text, NO graphics, NO stock photo feel."
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

Rewrite this Instagram caption. It sounds too much like AI wrote it:

"${currentCaption}"

Category: ${category.replace('_', ' ')}
${feedback ? `Feedback: ${feedback}` : 'Make it sound like a real person wrote it. Less polished, more authentic.'}

Respond in JSON:
{
  "caption": "Rewritten caption (max ${MAX_CAPTION_LENGTH} chars) — should sound human and natural",
  "hashtags": ["updated", "hashtags"]
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
