import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { execFile as execFileCb } from 'child_process'
import { promisify } from 'util'
import { readFile, rm, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'

const execFile = promisify(execFileCb)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegPath: string = require('ffmpeg-static')

/**
 * Generate 6 distinct ambient background music tracks using ffmpeg
 * and upload them to Supabase Storage for reel music rotation.
 *
 * Usage: npx tsx scripts/download-music-tracks.ts
 *
 * Each track uses different frequencies and patterns to sound unique.
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 6 distinct "chill" audio profiles using sine/triangle waves + filters
const TRACKS = [
  {
    name: 'Warm Ambient Pad',
    // C major chord pad with reverb
    filter: `sine=f=261.63:d=12[c];sine=f=329.63:d=12[e];sine=f=392:d=12[g];[c][e]amix=inputs=2[ce];[ce][g]amix=inputs=2,volume=0.3,afade=t=in:d=2,afade=t=out:st=10:d=2,aecho=0.8:0.88:60:0.4,lowpass=f=2000`,
  },
  {
    name: 'Ocean Waves Chill',
    // Low drone with noise modulation
    filter: `sine=f=110:d=12,tremolo=f=0.15:d=0.7,volume=0.25,afade=t=in:d=1.5,afade=t=out:st=10:d=2,aecho=0.8:0.9:40:0.3,lowpass=f=1500`,
  },
  {
    name: 'Tropical Sunrise',
    // G major with gentle tremolo
    filter: `sine=f=196:d=12[g];sine=f=246.94:d=12[b];sine=f=293.66:d=12[d];[g][b]amix=inputs=2[gb];[gb][d]amix=inputs=2,volume=0.3,tremolo=f=2:d=0.3,afade=t=in:d=2,afade=t=out:st=10:d=2,aecho=0.8:0.85:80:0.35`,
  },
  {
    name: 'Island Breeze',
    // F major with flanger effect
    filter: `sine=f=174.61:d=12[f];sine=f=220:d=12[a];sine=f=261.63:d=12[c];[f][a]amix=inputs=2[fa];[fa][c]amix=inputs=2,volume=0.3,flanger=delay=3:depth=2:speed=0.3,afade=t=in:d=1.5,afade=t=out:st=10:d=2,lowpass=f=2500`,
  },
  {
    name: 'Bali Nights',
    // Am chord with deep reverb
    filter: `sine=f=220:d=12[a];sine=f=261.63:d=12[c];sine=f=329.63:d=12[e];[a][c]amix=inputs=2[ac];[ac][e]amix=inputs=2,volume=0.3,afade=t=in:d=2,afade=t=out:st=10:d=2,aecho=0.8:0.9:100:0.5,lowpass=f=1800`,
  },
  {
    name: 'Golden Hour',
    // D major bright and airy
    filter: `sine=f=293.66:d=12[d];sine=f=369.99:d=12[fs];sine=f=440:d=12[a];[d][fs]amix=inputs=2[dfs];[dfs][a]amix=inputs=2,volume=0.3,tremolo=f=1.5:d=0.2,afade=t=in:d=2,afade=t=out:st=10:d=2,aecho=0.8:0.88:70:0.3,highpass=f=150`,
  },
]

async function generateTrack(filter: string, outputPath: string): Promise<void> {
  const args = [
    '-f', 'lavfi',
    '-i', filter,
    '-c:a', 'libmp3lame',
    '-b:a', '128k',
    '-ar', '44100',
    '-y', outputPath,
  ]

  await execFile(ffmpegPath, args, { timeout: 30000 })
}

async function main() {
  const tempDir = join(tmpdir(), `music-tracks-${Date.now()}`)
  await mkdir(tempDir, { recursive: true })

  console.log(`Generating ${TRACKS.length} ambient music tracks...\n`)

  let uploaded = 0

  try {
    for (let i = 0; i < TRACKS.length; i++) {
      const track = TRACKS[i]
      const trackNum = i + 1
      const storagePath = `audio/tracks/track-${trackNum}.mp3`
      const localPath = join(tempDir, `track-${trackNum}.mp3`)

      console.log(`[${trackNum}/${TRACKS.length}] ${track.name}`)

      try {
        await generateTrack(track.filter, localPath)
        const buffer = await readFile(localPath)
        console.log(`  Generated ${(buffer.length / 1024).toFixed(0)} KB`)

        const { error } = await supabase.storage
          .from('instagram-media')
          .upload(storagePath, buffer, {
            contentType: 'audio/mpeg',
            upsert: true,
          })

        if (error) {
          console.error(`  Upload failed: ${error.message}\n`)
          continue
        }

        const { data: urlData } = supabase.storage
          .from('instagram-media')
          .getPublicUrl(storagePath)
        console.log(`  Uploaded: ${urlData.publicUrl}\n`)
        uploaded++
      } catch (err) {
        console.error(`  Error: ${err instanceof Error ? err.message : err}\n`)
      }
    }

    console.log(`Done! Uploaded ${uploaded}/${TRACKS.length} tracks.`)
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {})
  }
}

main()
