import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { STORY_WIDTH, STORY_HEIGHT } from './constants'

// Font family for SVG text rendering (must be available to libvips/fontconfig)
const FONT_FAMILY = "'Helvetica Neue', Helvetica, Arial, sans-serif"

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface StoryText {
  line1: string
  line2: string
  cta: string
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generate a 1080x1920 story image from a source photo with gradient overlay + text
 */
export async function generateStoryImage(
  imageUrl: string,
  text: StoryText,
  postId: string
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin()

  // Download the source image
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image for story: ${response.status}`)
  }
  const imageBuffer = Buffer.from(await response.arrayBuffer())

  // Resize and crop to 9:16 (1080x1920)
  const resizedImage = await sharp(imageBuffer)
    .resize(STORY_WIDTH, STORY_HEIGHT, {
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality: 90 })
    .toBuffer()

  // Create gradient overlay (dark at bottom for text readability)
  const gradientSvg = `
    <svg width="${STORY_WIDTH}" height="${STORY_HEIGHT}">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="black" stop-opacity="0.1"/>
          <stop offset="50%" stop-color="black" stop-opacity="0.15"/>
          <stop offset="75%" stop-color="black" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect width="${STORY_WIDTH}" height="${STORY_HEIGHT}" fill="url(#grad)"/>
    </svg>
  `

  // Create text overlay SVG
  const line1Escaped = escapeXml(text.line1)
  const line2Escaped = escapeXml(text.line2)
  const ctaEscaped = escapeXml(text.cta)

  const textSvg = `
    <svg width="${STORY_WIDTH}" height="${STORY_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .line1 { fill: white; font-size: 52px; font-weight: 700; font-family: ${FONT_FAMILY}; }
          .line2 { fill: #e0e0e0; font-size: 36px; font-weight: 400; font-family: ${FONT_FAMILY}; }
          .cta { fill: #00D4AA; font-size: 32px; font-weight: 700; font-family: ${FONT_FAMILY}; }
          .brand { fill: rgba(255,255,255,0.7); font-size: 24px; font-weight: 600; font-family: ${FONT_FAMILY}; }
        </style>
      </defs>
      <text x="60" y="1560" class="line1">${line1Escaped}</text>
      <text x="60" y="1620" class="line2">${line2Escaped}</text>
      <text x="60" y="1700" class="cta">${ctaEscaped}</text>
      <text x="60" y="1780" class="brand">@balivisaassist</text>
    </svg>
  `

  // Composite: base image + gradient + text
  const storyBuffer = await sharp(resizedImage)
    .composite([
      { input: Buffer.from(gradientSvg), blend: 'over' },
      { input: Buffer.from(textSvg), blend: 'over' },
    ])
    .jpeg({ quality: 90 })
    .toBuffer()

  // Upload to Supabase Storage
  const storagePath = `stories/${postId}/story.jpg`

  const { error } = await supabase.storage
    .from('instagram-media')
    .upload(storagePath, storyBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload story image: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('instagram-media')
    .getPublicUrl(storagePath)

  return {
    storagePath,
    publicUrl: urlData.publicUrl,
  }
}
