import Replicate from 'replicate'
import { createClient } from '@supabase/supabase-js'
import { REPLICATE_MODELS } from './constants'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/**
 * Generate an image using Replicate's Flux model
 */
export async function generateImage(
  prompt: string,
  aspectRatio: '1:1' | '4:5' | '9:16' = '1:1'
): Promise<string> {
  const output = await replicate.run(REPLICATE_MODELS.flux, {
    input: {
      prompt: `${prompt}. High quality, professional photography style, vibrant colors, Instagram-worthy.`,
      aspect_ratio: aspectRatio,
      num_outputs: 1,
      output_format: 'webp',
      output_quality: 90,
    },
  })

  // Flux returns an array of FileOutput objects (Replicate SDK v1.x)
  const results = output as unknown[]
  if (!results || results.length === 0) {
    throw new Error('No image generated from Replicate')
  }

  const imageOutput = results[0]
  if (typeof imageOutput === 'string') {
    return imageOutput
  }

  // Handle FileOutput objects from Replicate SDK v1.x
  // FileOutput has a .url() method and toString() that returns the URL
  if (imageOutput && typeof imageOutput === 'object') {
    const url = String(imageOutput)
    if (url && url.startsWith('http')) {
      return url
    }
  }

  throw new Error('Unexpected Replicate output format')
}

/**
 * Download image from URL and upload to Supabase Storage
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  postId: string
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin()

  // Download the image
  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }

  const imageBuffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') || 'image/webp'
  const extension = contentType.includes('png') ? 'png' : contentType.includes('jpeg') ? 'jpg' : 'webp'

  const storagePath = `posts/${postId}/image.${extension}`

  const { error } = await supabase.storage
    .from('instagram-media')
    .upload(storagePath, imageBuffer, {
      contentType,
      upsert: true,
    })

  if (error) {
    throw new Error(`Failed to upload to Supabase Storage: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('instagram-media')
    .getPublicUrl(storagePath)

  return {
    storagePath,
    publicUrl: urlData.publicUrl,
  }
}

/**
 * Generate image and store in Supabase Storage
 */
export async function generateAndStoreImage(
  prompt: string,
  postId: string,
  aspectRatio: '1:1' | '4:5' | '9:16' = '1:1'
): Promise<{ storagePath: string; publicUrl: string }> {
  const imageUrl = await generateImage(prompt, aspectRatio)
  return downloadAndStoreImage(imageUrl, postId)
}
