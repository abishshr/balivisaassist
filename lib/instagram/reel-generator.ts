import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { execFile as execFileCb } from 'child_process'
import { promisify } from 'util'
import { writeFile, readFile, mkdir, rm } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import {
  REEL_WIDTH,
  REEL_HEIGHT,
  REEL_FPS,
  REEL_DURATION_SECONDS,
  REEL_SAFE_ZONE_TOP,
  REEL_SAFE_ZONE_BOTTOM,
  REEL_MUSIC_TRACKS,
} from './constants'

const execFile = promisify(execFileCb)

// ffmpeg-static exports the path to the binary
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static')

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface ReelText {
  hook: string
  detail: string
  cta: string
}

/**
 * Query recent REELS posts to find which music tracks were used in the last 7 days
 */
async function getRecentlyUsedTracks(): Promise<string[]> {
  const supabase = getSupabaseAdmin()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data } = await supabase
    .from('instagram_posts')
    .select('metadata')
    .eq('media_type', 'REELS')
    .gte('created_at', sevenDaysAgo)
    .not('metadata', 'is', null)

  if (!data) return []

  return data
    .map((row) => (row.metadata as Record<string, unknown>)?.music_track as string)
    .filter(Boolean)
}

/**
 * Pick a random music track, avoiding recently used ones
 */
async function pickMusicTrack(): Promise<string> {
  const recentlyUsed = await getRecentlyUsedTracks()
  const available = REEL_MUSIC_TRACKS.filter((t) => !recentlyUsed.includes(t))
  const pool = available.length > 0 ? available : REEL_MUSIC_TRACKS
  return pool[Math.floor(Math.random() * pool.length)]
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
 * Resize source image to 1080x1920 for reel background
 */
async function prepareBaseImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image for reel: ${response.status}`)
  }
  const imageBuffer = Buffer.from(await response.arrayBuffer())

  return sharp(imageBuffer)
    .resize(REEL_WIDTH, REEL_HEIGHT, {
      fit: 'cover',
      position: 'centre',
    })
    .jpeg({ quality: 95 })
    .toBuffer()
}

/**
 * Wrap text into lines that fit within maxWidth (estimated from font metrics)
 */
function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
  const avgCharWidth = fontSize * 0.55
  const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth)
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length > maxCharsPerLine && currentLine) {
      lines.push(currentLine.trim())
      currentLine = word
    } else {
      currentLine = (currentLine + ' ' + word).trim()
    }
  }
  if (currentLine) lines.push(currentLine.trim())
  return lines
}

// Text block vertical positions — centered in safe zone with clear spacing
const centerY = (REEL_SAFE_ZONE_TOP + (REEL_HEIGHT - REEL_SAFE_ZONE_BOTTOM)) / 2
const TEXT_Y = {
  hook: centerY - 100,
  detail: centerY + 60,
  cta: centerY + 200,
} as const

const TEXT_CONFIG = {
  hook: {
    fontSize: 52,
    fontWeight: 700,
    color: '#FFFFFF',
    bgColor: 'rgba(0,0,0,0.72)',
    paddingX: 36,
    paddingY: 20,
    radius: 16,
  },
  detail: {
    fontSize: 34,
    fontWeight: 400,
    color: '#FFFFFF',
    bgColor: 'rgba(0,0,0,0.65)',
    paddingX: 28,
    paddingY: 16,
    radius: 12,
  },
  cta: {
    fontSize: 32,
    fontWeight: 700,
    color: '#00D4AA',
    bgColor: 'rgba(0,0,0,0.7)',
    paddingX: 32,
    paddingY: 16,
    radius: 24,
  },
} as const

/**
 * Generate a transparent PNG text overlay with a pill-shaped background
 */
async function generateTextOverlay(
  text: string,
  phase: 'hook' | 'detail' | 'cta'
): Promise<Buffer> {
  const cfg = TEXT_CONFIG[phase]
  const baseY = TEXT_Y[phase]
  const escaped = escapeXml(text)

  const maxTextWidth = REEL_WIDTH - 160 // 80px padding each side
  const lines = wrapText(escaped, cfg.fontSize, maxTextWidth)
  const lineHeight = cfg.fontSize * 1.4

  // Calculate pill dimensions
  const textBlockHeight = lines.length * lineHeight
  const pillHeight = textBlockHeight + cfg.paddingY * 2

  // Estimate the widest line for pill width
  const avgCharWidth = cfg.fontSize * 0.55
  const widestLineChars = Math.max(...lines.map(l => l.length))
  const pillWidth = Math.min(
    widestLineChars * avgCharWidth + cfg.paddingX * 2,
    REEL_WIDTH - 80
  )

  const pillX = (REEL_WIDTH - pillWidth) / 2
  const pillY = baseY - cfg.paddingY - cfg.fontSize * 0.3 // account for text baseline

  const textElements = lines
    .map((line, i) => `<text x="${REEL_WIDTH / 2}" y="${baseY + i * lineHeight}" class="overlay">${line}</text>`)
    .join('\n')

  const svg = `
    <svg width="${REEL_WIDTH}" height="${REEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <style>
        .overlay {
          fill: ${cfg.color};
          font-size: ${cfg.fontSize}px;
          font-weight: ${cfg.fontWeight};
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          text-anchor: middle;
        }
      </style>
      <rect x="${pillX}" y="${pillY}" width="${pillWidth}" height="${pillHeight}" rx="${cfg.radius}" ry="${cfg.radius}" fill="${cfg.bgColor}" />
      ${textElements}
    </svg>
  `

  return sharp(Buffer.from(svg))
    .resize(REEL_WIDTH, REEL_HEIGHT)
    .png()
    .toBuffer()
}

/**
 * Generate a gradient + brand watermark overlay (always visible).
 * Dark gradient on the lower third improves text readability + frames the brand.
 */
async function generateBrandOverlay(): Promise<Buffer> {
  const brandY = REEL_HEIGHT - REEL_SAFE_ZONE_BOTTOM + 40

  const svg = `
    <svg width="${REEL_WIDTH}" height="${REEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bottomGrad" x1="0" y1="0.6" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(0,0,0,0)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.45)" />
        </linearGradient>
      </defs>
      <rect width="${REEL_WIDTH}" height="${REEL_HEIGHT}" fill="url(#bottomGrad)" />
      <style>
        .brand {
          fill: rgba(255,255,255,0.85);
          font-size: 22px;
          font-weight: 600;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          text-anchor: middle;
          letter-spacing: 1px;
        }
      </style>
      <text x="${REEL_WIDTH / 2}" y="${brandY}" class="brand">@balivisaassist</text>
    </svg>
  `

  return sharp(Buffer.from(svg))
    .resize(REEL_WIDTH, REEL_HEIGHT)
    .png()
    .toBuffer()
}

/**
 * Generate a reel MP4 video:
 * 1. Ken Burns zoom on image (100% to 115%)
 * 2. Sequential text overlays (hook at 1s, detail at 3s, cta at 5s)
 * 3. Background music with fade in/out
 * 4. Upload to Supabase storage
 */
export async function generateReelVideo(
  imageUrl: string,
  text: ReelText,
  postId: string
): Promise<{ storagePath: string; publicUrl: string; musicTrack: string }> {
  const supabase = getSupabaseAdmin()

  const totalFrames = REEL_FPS * REEL_DURATION_SECONDS

  // Create a temp directory for this reel
  const tempDir = join(tmpdir(), `reel-${postId}-${Date.now()}`)
  await mkdir(tempDir, { recursive: true })

  try {
    // Prepare base image + text overlays + brand in parallel
    const [baseImage, hookOverlay, detailOverlay, ctaOverlay, brandOverlay] = await Promise.all([
      prepareBaseImage(imageUrl),
      generateTextOverlay(text.hook, 'hook'),
      generateTextOverlay(text.detail, 'detail'),
      generateTextOverlay(text.cta, 'cta'),
      generateBrandOverlay(),
    ])

    // Pick a music track (rotated to avoid repeats)
    const musicTrack = await pickMusicTrack()

    // Fetch background music from Supabase storage
    const { data: audioData } = supabase.storage
      .from('instagram-media')
      .getPublicUrl(musicTrack)

    const audioResponse = await fetch(audioData.publicUrl)
    if (!audioResponse.ok) {
      throw new Error(`Failed to download background music: ${audioResponse.status}`)
    }
    const audioBytes = Buffer.from(await audioResponse.arrayBuffer())

    // Write all files to temp directory
    const basePath = join(tempDir, 'base.jpg')
    const hookPath = join(tempDir, 'hook.png')
    const detailPath = join(tempDir, 'detail.png')
    const ctaPath = join(tempDir, 'cta.png')
    const brandPath = join(tempDir, 'brand.png')
    const musicPath = join(tempDir, 'music.mp3')
    const outputPath = join(tempDir, 'output.mp4')

    await Promise.all([
      writeFile(basePath, baseImage),
      writeFile(hookPath, hookOverlay),
      writeFile(detailPath, detailOverlay),
      writeFile(ctaPath, ctaOverlay),
      writeFile(brandPath, brandOverlay),
      writeFile(musicPath, audioBytes),
    ])

    // Build the filter_complex string
    const filterComplex = [
      // Ken Burns: slow zoom 100% to 115% over duration
      `[0:v]zoompan=z='min(zoom+0.00065,1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=${REEL_WIDTH}x${REEL_HEIGHT}:fps=${REEL_FPS}[zoomed]`,
      // Overlay hook text (appears at 1s, stays)
      `[zoomed][1:v]overlay=0:0:enable='between(t,1,${REEL_DURATION_SECONDS})'[v1]`,
      // Overlay detail text (appears at 3s, stays)
      `[v1][2:v]overlay=0:0:enable='between(t,3,${REEL_DURATION_SECONDS})'[v2]`,
      // Overlay CTA text (appears at 5s, stays)
      `[v2][3:v]overlay=0:0:enable='between(t,5,${REEL_DURATION_SECONDS})'[v3]`,
      // Overlay brand (always visible)
      `[v3][4:v]overlay=0:0[vout]`,
      // Audio: fade in 0.5s, fade out 1s ending at duration
      `[5:a]afade=t=in:st=0:d=0.5,afade=t=out:st=${REEL_DURATION_SECONDS - 1}:d=1,atrim=0:${REEL_DURATION_SECONDS}[aout]`,
    ].join(';')

    // FFmpeg args — executed via execFile (no shell, safe from injection)
    const args = [
      // Inputs
      '-loop', '1', '-i', basePath,
      '-loop', '1', '-i', hookPath,
      '-loop', '1', '-i', detailPath,
      '-loop', '1', '-i', ctaPath,
      '-loop', '1', '-i', brandPath,
      '-i', musicPath,
      // Filter complex
      '-filter_complex', filterComplex,
      '-map', '[vout]',
      '-map', '[aout]',
      // Output settings
      '-c:v', 'libx264',
      '-preset', 'fast',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-pix_fmt', 'yuv420p',
      '-t', String(REEL_DURATION_SECONDS),
      '-movflags', '+faststart',
      '-y', outputPath,
    ]

    console.log('[reel-generator] Starting FFmpeg encoding...')
    const { stderr } = await execFile(ffmpegPath, args, {
      timeout: 120_000, // 2 minute timeout
      maxBuffer: 10 * 1024 * 1024, // 10MB for stderr output
    })
    console.log('[reel-generator] FFmpeg encoding complete')
    if (stderr) {
      // FFmpeg writes progress info to stderr — log last few lines for debugging
      const lines = stderr.split('\n').filter(Boolean)
      console.log('[reel-generator] FFmpeg output (last 5 lines):', lines.slice(-5).join('\n'))
    }

    // Read the output video
    const videoBuffer = await readFile(outputPath)

    // Upload to Supabase Storage
    const storagePath = `reels/${postId}/reel.mp4`

    const { error } = await supabase.storage
      .from('instagram-media')
      .upload(storagePath, videoBuffer, {
        contentType: 'video/mp4',
        upsert: true,
      })

    if (error) {
      throw new Error(`Failed to upload reel video: ${error.message}`)
    }

    const { data: urlData } = supabase.storage
      .from('instagram-media')
      .getPublicUrl(storagePath)

    return {
      storagePath,
      publicUrl: urlData.publicUrl,
      musicTrack,
    }
  } finally {
    // Clean up temp directory
    await rm(tempDir, { recursive: true, force: true }).catch(() => {
      // Ignore cleanup errors
    })
  }
}
