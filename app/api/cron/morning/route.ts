import { NextResponse } from 'next/server'
import { publishApprovedPosts, generatePost, getConfig } from '@/lib/instagram/pipeline'
import { ensureValidToken } from '@/lib/instagram/token-manager'
import type { InstagramConfig } from '@/types/instagram'

/**
 * Morning Cron: 0 2 * * * UTC (10 AM Bali)
 * 1. Refresh Meta access token if needed
 * 2. Publish approved posts
 * 3. Generate tomorrow's content
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  try {
    // 1. Token refresh
    const config = await getConfig()
    if (config) {
      await ensureValidToken(config as InstagramConfig)
      results.tokenRefresh = 'checked'
    }

    // 2. Publish approved posts
    const published = await publishApprovedPosts()
    results.published = published

    // 3. Generate tomorrow's content
    try {
      const post = await generatePost()
      results.generated = { id: post.id, status: post.status, category: post.category }
    } catch (error) {
      results.generated = { error: error instanceof Error ? error.message : 'Failed' }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Morning cron error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
