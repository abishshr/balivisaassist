import { createClient } from '@supabase/supabase-js'
import { downloadAndStoreImage } from './image-generator'
import { BALI_NEWS_ACCOUNTS } from './constants'
import type { ScrapedInstagramNews } from '@/types/instagram'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

interface InstagramWebPost {
  id: string
  caption?: { text: string }
  image_versions2?: { candidates: Array<{ url: string; width: number; height: number }> }
  taken_at?: number
}

interface InstagramWebProfileResponse {
  data?: {
    user?: {
      edge_owner_to_timeline_media?: {
        edges: Array<{
          node: {
            id: string
            shortcode: string
            edge_media_to_caption?: { edges: Array<{ node: { text: string } }> }
            display_url: string
            taken_at_timestamp: number
          }
        }>
      }
    }
  }
  graphql?: {
    user?: {
      edge_owner_to_timeline_media?: {
        edges: Array<{
          node: {
            id: string
            shortcode: string
            edge_media_to_caption?: { edges: Array<{ node: { text: string } }> }
            display_url: string
            taken_at_timestamp: number
          }
        }>
      }
    }
  }
}

/**
 * Scrape recent posts from a single Instagram account using the web profile API
 */
export async function scrapeAccount(
  username: string,
  limit: number = 5
): Promise<Array<{ postId: string; caption: string; imageUrl: string; timestamp: number }>> {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'X-IG-App-ID': '936619743392459',
      'X-Requested-With': 'XMLHttpRequest',
    },
  })

  if (!res.ok) {
    console.error(`Failed to scrape @${username}: ${res.status}`)
    return []
  }

  const data: InstagramWebProfileResponse = await res.json()

  // Handle both possible response structures
  const user = data.data?.user || data.graphql?.user
  const edges = user?.edge_owner_to_timeline_media?.edges || []

  return edges.slice(0, limit).map((edge) => {
    const node = edge.node
    const captionText = node.edge_media_to_caption?.edges?.[0]?.node?.text || ''
    return {
      postId: node.shortcode || node.id,
      caption: captionText,
      imageUrl: node.display_url,
      timestamp: node.taken_at_timestamp,
    }
  })
}

/**
 * Scrape all configured Bali news accounts, dedup, and store new posts
 */
export async function scrapeBaliNewsAccounts(): Promise<number> {
  const supabase = getSupabaseAdmin()
  let totalNew = 0

  for (const account of BALI_NEWS_ACCOUNTS) {
    try {
      const posts = await scrapeAccount(account)

      for (const post of posts) {
        // Check if already scraped (dedup)
        const { data: existing } = await supabase
          .from('instagram_scraped_news')
          .select('id')
          .eq('source_account', account)
          .eq('source_post_id', post.postId)
          .single()

        if (existing) continue

        // Download and store the image in Supabase
        let imageStoredUrl: string | null = null
        let imageStoragePath: string | null = null
        try {
          const stored = await downloadAndStoreImage(
            post.imageUrl,
            `scraped-${account}-${post.postId}`
          )
          imageStoredUrl = stored.publicUrl
          imageStoragePath = stored.storagePath
        } catch (err) {
          console.error(`Failed to store image for @${account}/${post.postId}:`, err)
        }

        // Insert scraped news item
        const { error } = await supabase.from('instagram_scraped_news').insert({
          source_account: account,
          source_post_id: post.postId,
          caption_text: post.caption,
          image_url: post.imageUrl,
          image_stored_url: imageStoredUrl,
          image_storage_path: imageStoragePath,
          post_timestamp: post.timestamp
            ? new Date(post.timestamp * 1000).toISOString()
            : null,
        })

        if (!error) totalNew++
      }
    } catch (err) {
      console.error(`Error scraping @${account}:`, err)
    }
  }

  return totalNew
}

/**
 * Get unused scraped news items for content generation
 */
export async function getUnusedScrapedNews(
  limit: number = 3
): Promise<ScrapedInstagramNews[]> {
  const supabase = getSupabaseAdmin()

  const { data } = await supabase
    .from('instagram_scraped_news')
    .select('*')
    .eq('is_used', false)
    .not('caption_text', 'is', null)
    .order('scraped_at', { ascending: false })
    .limit(limit)

  return (data || []) as unknown as ScrapedInstagramNews[]
}

/**
 * Mark a scraped news item as used by a post
 */
export async function markScrapedAsUsed(
  scrapedId: string,
  postId: string
): Promise<void> {
  const supabase = getSupabaseAdmin()

  await supabase
    .from('instagram_scraped_news')
    .update({ is_used: true, used_by_post_id: postId })
    .eq('id', scrapedId)
}
