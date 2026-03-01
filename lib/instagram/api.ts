import { GRAPH_API_BASE, IMAGE_PUBLISH_WAIT_MS } from './constants'
import type { InstagramConfig } from '@/types/instagram'

interface CreateContainerResponse {
  id: string
}

interface PublishResponse {
  id: string
}

interface MediaInsightsResponse {
  data: Array<{
    name: string
    values: Array<{ value: number }>
  }>
}

interface IGAccountResponse {
  instagram_business_account: {
    id: string
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Get the Instagram Business Account ID from the Facebook Page
 */
export async function getIGBusinessAccountId(
  config: InstagramConfig
): Promise<string> {
  if (config.ig_business_account_id) {
    return config.ig_business_account_id
  }

  const res = await fetch(
    `${GRAPH_API_BASE}/${config.facebook_page_id}?fields=instagram_business_account&access_token=${config.meta_access_token}`
  )

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to get IG account: ${JSON.stringify(error)}`)
  }

  const data: IGAccountResponse = await res.json()
  return data.instagram_business_account.id
}

/**
 * Step 1: Create a media container on Instagram
 */
export async function createMediaContainer(
  igAccountId: string,
  accessToken: string,
  imageUrl: string,
  caption: string,
  mediaType: 'IMAGE' | 'VIDEO' | 'STORIES' | 'REELS' = 'IMAGE'
): Promise<string> {
  const params = new URLSearchParams({
    access_token: accessToken,
    caption,
  })

  if (mediaType === 'IMAGE' || mediaType === 'STORIES') {
    params.set('image_url', imageUrl)
  } else if (mediaType === 'VIDEO' || mediaType === 'REELS') {
    params.set('video_url', imageUrl)
    params.set('media_type', mediaType)
  }

  const res = await fetch(`${GRAPH_API_BASE}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to create container: ${JSON.stringify(error)}`)
  }

  const data: CreateContainerResponse = await res.json()
  return data.id
}

/**
 * Step 2: Publish the media container
 */
export async function publishMedia(
  igAccountId: string,
  accessToken: string,
  containerId: string
): Promise<string> {
  // Wait for Instagram to process the image
  await sleep(IMAGE_PUBLISH_WAIT_MS)

  const params = new URLSearchParams({
    access_token: accessToken,
    creation_id: containerId,
  })

  const res = await fetch(`${GRAPH_API_BASE}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`Failed to publish media: ${JSON.stringify(error)}`)
  }

  const data: PublishResponse = await res.json()
  return data.id
}

/**
 * Get the permalink for a published media
 */
export async function getMediaPermalink(
  mediaId: string,
  accessToken: string
): Promise<string | null> {
  const res = await fetch(
    `${GRAPH_API_BASE}/${mediaId}?fields=permalink&access_token=${accessToken}`
  )

  if (!res.ok) return null

  const data = await res.json()
  return data.permalink || null
}

/**
 * Get media insights (engagement metrics)
 */
export async function getMediaInsights(
  mediaId: string,
  accessToken: string
): Promise<Record<string, number>> {
  const metrics = 'impressions,reach,likes,comments,saved,shares'
  const res = await fetch(
    `${GRAPH_API_BASE}/${mediaId}/insights?metric=${metrics}&access_token=${accessToken}`
  )

  if (!res.ok) return {}

  const data: MediaInsightsResponse = await res.json()
  const result: Record<string, number> = {}

  for (const metric of data.data) {
    result[metric.name] = metric.values[0]?.value ?? 0
  }

  return result
}

/**
 * Full publish flow: create container -> wait -> publish -> get permalink
 */
export async function publishToInstagram(
  config: InstagramConfig,
  imageUrl: string,
  caption: string,
  mediaType: 'IMAGE' | 'VIDEO' | 'STORIES' | 'REELS' = 'IMAGE'
): Promise<{ mediaId: string; containerId: string; permalink: string | null }> {
  if (!config.meta_access_token) {
    throw new Error('No Meta access token configured')
  }

  const igAccountId = await getIGBusinessAccountId(config)

  const containerId = await createMediaContainer(
    igAccountId,
    config.meta_access_token,
    imageUrl,
    caption,
    mediaType
  )

  const mediaId = await publishMedia(
    igAccountId,
    config.meta_access_token,
    containerId
  )

  const permalink = await getMediaPermalink(mediaId, config.meta_access_token)

  return { mediaId, containerId, permalink }
}
