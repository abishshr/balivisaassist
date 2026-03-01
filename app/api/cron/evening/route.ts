import { NextResponse } from 'next/server'
import { fetchLatestVisaNews } from '@/lib/news-scraper'
import { convertNewsToPost, retryPendingImages } from '@/lib/instagram/pipeline'
import fs from 'fs/promises'
import path from 'path'

/**
 * Evening Cron: 0 6 * * * UTC (2 PM Bali)
 * 1. Scrape visa news (replaces old /api/scrape-news)
 * 2. Convert top news to Instagram posts
 * 3. Retry any pending image generations
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  try {
    // 1. Scrape news (existing functionality)
    const scrapedNews = await fetchLatestVisaNews()
    const newsFilePath = path.join(process.cwd(), 'data', 'scraped-news.json')
    const newsData = { lastUpdated: new Date().toISOString(), news: scrapedNews }
    await fs.writeFile(newsFilePath, JSON.stringify(newsData, null, 2), 'utf-8')
    results.newsScrape = { count: scrapedNews.length }

    // 2. Convert top news item to IG post (only if there's fresh news)
    if (scrapedNews.length > 0) {
      const topNews = scrapedNews[0]
      try {
        const post = await convertNewsToPost(
          topNews.title,
          topNews.description,
          topNews.link
        )
        results.newsPost = { id: post.id, status: post.status }
      } catch (error) {
        results.newsPost = { error: error instanceof Error ? error.message : 'Failed' }
      }
    }

    // 3. Retry pending images
    const retried = await retryPendingImages()
    results.imageRetries = retried

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Evening cron error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
