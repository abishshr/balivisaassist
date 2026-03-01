import { createClient } from '@supabase/supabase-js'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface UnsplashPhoto {
  imageUrl: string
  photographerName: string
  photographerUrl: string
}

/**
 * Search Unsplash for a photo matching the query
 */
async function searchUnsplashPhoto(
  query: string,
  orientation: 'squarish' | 'landscape' | 'portrait' = 'squarish'
): Promise<UnsplashPhoto> {
  const params = new URLSearchParams({
    query,
    orientation,
    per_page: '10',
  })

  const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
  })

  if (!res.ok) {
    throw new Error(`Unsplash search failed: ${res.status}`)
  }

  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    throw new Error('No Unsplash results')
  }

  // Pick a random result from top 10 for variety
  const photo = data.results[Math.floor(Math.random() * data.results.length)]

  // Trigger download event per Unsplash ToS
  if (photo.links?.download_location) {
    fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    }).catch(() => {})
  }

  return {
    imageUrl: photo.urls.regular,
    photographerName: photo.user.name,
    photographerUrl: photo.user.links.html,
  }
}

/**
 * Download image from URL and upload to Supabase Storage
 */
export async function downloadAndStoreImage(
  imageUrl: string,
  postId: string
): Promise<{ storagePath: string; publicUrl: string }> {
  const supabase = getSupabaseAdmin()

  const response = await fetch(imageUrl)
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }

  const imageBuffer = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg'

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
 * Fetch a photo from Unsplash and store in Supabase Storage
 */
export async function fetchAndStoreImage(
  searchQuery: string,
  postId: string
): Promise<{ storagePath: string; publicUrl: string; unsplashAttribution: string }> {
  let photo: UnsplashPhoto

  try {
    photo = await searchUnsplashPhoto(searchQuery)
  } catch {
    // Fallback to broader query if specific one returns nothing
    photo = await searchUnsplashPhoto('Bali')
  }

  const { storagePath, publicUrl } = await downloadAndStoreImage(photo.imageUrl, postId)

  return {
    storagePath,
    publicUrl,
    unsplashAttribution: `Photo by ${photo.photographerName} on Unsplash (${photo.photographerUrl})`,
  }
}
