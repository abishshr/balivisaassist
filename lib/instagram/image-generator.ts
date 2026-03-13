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
  unsplashPhotoId: string
}

/**
 * Get all Unsplash photo IDs previously used in posts (stored in metadata)
 */
export async function getUsedUnsplashIds(): Promise<string[]> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('instagram_posts')
    .select('metadata')
    .not('metadata', 'is', null)
    .not('status', 'in', '("failed","cancelled")')

  if (!data) return []

  return data
    .map((row: { metadata: Record<string, unknown> | null }) =>
      row.metadata && typeof row.metadata === 'object'
        ? (row.metadata as Record<string, unknown>).unsplash_photo_id
        : null
    )
    .filter((id: unknown): id is string => typeof id === 'string')
}

/**
 * Get recent image search queries to help Claude avoid repetition
 */
export async function getRecentImageQueries(limit = 20): Promise<string[]> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('instagram_posts')
    .select('image_prompt')
    .not('image_prompt', 'is', null)
    .not('status', 'in', '("failed","cancelled")')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data) return []

  return data
    .map((row: { image_prompt: string | null }) => row.image_prompt)
    .filter((q: string | null): q is string => !!q)
}

/**
 * Get recent captions to help Claude avoid generating duplicate content
 */
export async function getRecentCaptions(limit = 30): Promise<string[]> {
  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('instagram_posts')
    .select('caption')
    .not('caption', 'is', null)
    .not('status', 'in', '("failed","cancelled")')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (!data) return []

  return data
    .map((row: { caption: string | null }) => row.caption)
    .filter((c: string | null): c is string => !!c)
}

/**
 * Search Unsplash for a photo matching the query, excluding previously used photos
 */
async function searchUnsplashPhoto(
  query: string,
  orientation: 'squarish' | 'landscape' | 'portrait' = 'squarish',
  excludeIds: string[] = []
): Promise<UnsplashPhoto> {
  const excludeSet = new Set(excludeIds)

  // Fetch more results to have room after filtering out used photos
  const perPage = excludeSet.size > 0 ? '30' : '10'
  const params = new URLSearchParams({
    query,
    orientation,
    per_page: perPage,
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

  // Filter out previously used photos
  const available = data.results.filter(
    (p: { id: string }) => !excludeSet.has(p.id)
  )

  // If all results were used, try page 2
  if (available.length === 0) {
    const page2Params = new URLSearchParams({
      query,
      orientation,
      per_page: '30',
      page: '2',
    })
    const res2 = await fetch(`https://api.unsplash.com/search/photos?${page2Params}`, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    })
    if (res2.ok) {
      const data2 = await res2.json()
      const available2 = (data2.results || []).filter(
        (p: { id: string }) => !excludeSet.has(p.id)
      )
      if (available2.length > 0) {
        const photo = available2[Math.floor(Math.random() * available2.length)]
        triggerUnsplashDownload(photo)
        return extractPhoto(photo)
      }
    }
    // Last resort: use original results (better than failing)
    const photo = data.results[Math.floor(Math.random() * data.results.length)]
    triggerUnsplashDownload(photo)
    return extractPhoto(photo)
  }

  // Pick a random result from available (unused) photos
  const photo = available[Math.floor(Math.random() * available.length)]
  triggerUnsplashDownload(photo)
  return extractPhoto(photo)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function triggerUnsplashDownload(photo: any) {
  if (photo.links?.download_location) {
    fetch(photo.links.download_location, {
      headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` },
    }).catch(() => {})
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractPhoto(photo: any): UnsplashPhoto {
  return {
    imageUrl: photo.urls.regular,
    photographerName: photo.user.name,
    photographerUrl: photo.user.links.html,
    unsplashPhotoId: photo.id,
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
 * Fetch a photo from Unsplash and store in Supabase Storage.
 * Excludes previously used Unsplash photo IDs to prevent duplicates.
 */
export async function fetchAndStoreImage(
  searchQuery: string,
  postId: string,
  excludeIds?: string[]
): Promise<{ storagePath: string; publicUrl: string; unsplashAttribution: string; unsplashPhotoId: string }> {
  // If no exclude list provided, fetch from DB
  const usedIds = excludeIds ?? await getUsedUnsplashIds()

  let photo: UnsplashPhoto

  try {
    photo = await searchUnsplashPhoto(searchQuery, 'squarish', usedIds)
  } catch {
    // Fallback to broader query if specific one returns nothing
    photo = await searchUnsplashPhoto('Bali', 'squarish', usedIds)
  }

  const { storagePath, publicUrl } = await downloadAndStoreImage(photo.imageUrl, postId)

  return {
    storagePath,
    publicUrl,
    unsplashAttribution: `Photo by ${photo.photographerName} on Unsplash (${photo.photographerUrl})`,
    unsplashPhotoId: photo.unsplashPhotoId,
  }
}
