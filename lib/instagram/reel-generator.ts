import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL, fetchFile } from '@ffmpeg/util'
import {
  REEL_WIDTH,
  REEL_HEIGHT,
  REEL_FPS,
  REEL_DURATION_SECONDS,
  REEL_SAFE_ZONE_TOP,
  REEL_SAFE_ZONE_BOTTOM,
} from './constants'

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

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

let ffmpegInstance: FFmpeg | null = null

/**
 * Get or create a singleton FFmpeg WASM instance
 */
async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance && ffmpegInstance.loaded) {
    return ffmpegInstance
  }

  const ffmpeg = new FFmpeg()

  // Load from CDN — works in Node.js and serverless
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })

  ffmpegInstance = ffmpeg
  return ffmpeg
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
 * Generate a transparent PNG text overlay for a specific phase
 */
async function generateTextOverlay(
  text: string,
  phase: 'hook' | 'detail' | 'cta'
): Promise<Buffer> {
  const config = {
    hook: { fontSize: 56, fontWeight: 700, color: 'white', y: REEL_SAFE_ZONE_TOP + 400 },
    detail: { fontSize: 40, fontWeight: 400, color: '#e0e0e0', y: REEL_SAFE_ZONE_TOP + 500 },
    cta: { fontSize: 36, fontWeight: 700, color: '#00D4AA', y: REEL_SAFE_ZONE_TOP + 580 },
  }

  const { fontSize, fontWeight, color, y } = config[phase]
  const escaped = escapeXml(text)

  // Wrap text if too wide (max ~900px for 1080 with padding)
  const maxCharsPerLine = Math.floor(900 / (fontSize * 0.55))
  const words = escaped.split(' ')
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

  const lineHeight = fontSize * 1.3
  const textElements = lines
    .map((line, i) => `<text x="90" y="${y + i * lineHeight}" class="overlay">${line}</text>`)
    .join('\n')

  const svg = `
    <svg width="${REEL_WIDTH}" height="${REEL_HEIGHT}">
      <style>
        .overlay {
          fill: ${color};
          font-size: ${fontSize}px;
          font-weight: ${fontWeight};
          font-family: sans-serif;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.8));
        }
      </style>
      ${textElements}
    </svg>
  `

  return sharp(Buffer.from(svg))
    .resize(REEL_WIDTH, REEL_HEIGHT)
    .png()
    .toBuffer()
}

/**
 * Generate a brand watermark overlay
 */
async function generateBrandOverlay(): Promise<Buffer> {
  const y = REEL_HEIGHT - REEL_SAFE_ZONE_BOTTOM - 20

  const svg = `
    <svg width="${REEL_WIDTH}" height="${REEL_HEIGHT}">
      <style>
        .brand {
          fill: rgba(255,255,255,0.7);
          font-size: 24px;
          font-weight: 600;
          font-family: sans-serif;
          filter: drop-shadow(0 1px 3px rgba(0,0,0,0.6));
        }
      </style>
      <text x="90" y="${y}" class="brand">@balivisaassist</text>
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
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin()
  const ffmpeg = await getFFmpeg()

  const totalFrames = REEL_FPS * REEL_DURATION_SECONDS

  // Prepare base image + text overlays + brand in parallel
  const [baseImage, hookOverlay, detailOverlay, ctaOverlay, brandOverlay] = await Promise.all([
    prepareBaseImage(imageUrl),
    generateTextOverlay(text.hook, 'hook'),
    generateTextOverlay(text.detail, 'detail'),
    generateTextOverlay(text.cta, 'cta'),
    generateBrandOverlay(),
  ])

  // Fetch background music from Supabase storage
  const { data: audioData } = supabase.storage
    .from('instagram-media')
    .getPublicUrl('audio/background-music.mp3')

  const audioBytes = await fetchFile(audioData.publicUrl)

  // Write all files to ffmpeg virtual filesystem
  await ffmpeg.writeFile('base.jpg', new Uint8Array(baseImage))
  await ffmpeg.writeFile('hook.png', new Uint8Array(hookOverlay))
  await ffmpeg.writeFile('detail.png', new Uint8Array(detailOverlay))
  await ffmpeg.writeFile('cta.png', new Uint8Array(ctaOverlay))
  await ffmpeg.writeFile('brand.png', new Uint8Array(brandOverlay))
  await ffmpeg.writeFile('music.mp3', audioBytes)

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

  // ffmpeg command
  const exitCode = await ffmpeg.exec([
    // Inputs
    '-loop', '1', '-i', 'base.jpg',
    '-loop', '1', '-i', 'hook.png',
    '-loop', '1', '-i', 'detail.png',
    '-loop', '1', '-i', 'cta.png',
    '-loop', '1', '-i', 'brand.png',
    '-i', 'music.mp3',
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
    'output.mp4',
  ], 120000) // 2 minute timeout for encoding

  if (exitCode !== 0) {
    throw new Error(`FFmpeg encoding failed with exit code ${exitCode}`)
  }

  // Read the output video
  const videoData = await ffmpeg.readFile('output.mp4')
  const videoBuffer = Buffer.from(videoData as Uint8Array)

  // Clean up ffmpeg filesystem
  await Promise.all([
    ffmpeg.deleteFile('base.jpg'),
    ffmpeg.deleteFile('hook.png'),
    ffmpeg.deleteFile('detail.png'),
    ffmpeg.deleteFile('cta.png'),
    ffmpeg.deleteFile('brand.png'),
    ffmpeg.deleteFile('music.mp3'),
    ffmpeg.deleteFile('output.mp4'),
  ])

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
  }
}
