import { NextResponse } from 'next/server'
import { fetchLatestVisaNews } from '@/lib/news-scraper'
import { retryPendingImages } from '@/lib/instagram/pipeline'
import { scrapeBaliNewsAccounts } from '@/lib/instagram/bali-news-scraper'
import fs from 'fs/promises'
import path from 'path'

/**
 * Evening Cron: 0 6 * * * UTC (2 PM Bali)
 * 1. Scrape visa news
 * 2. Scrape Bali news from Instagram accounts
 * 3. Retry any pending image generations
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: Record<string, unknown> = {}

  try {
    // 1. Scrape news from all sources (immigration + Bali lifestyle)
    const scrapedNews = await fetchLatestVisaNews()
    const newsFilePath = path.join(process.cwd(), 'data', 'scraped-news.json')
    const newsData = { lastUpdated: new Date().toISOString(), news: scrapedNews }
    await fs.writeFile(newsFilePath, JSON.stringify(newsData, null, 2), 'utf-8')
    results.newsScrape = { count: scrapedNews.length }

    // 2. Scrape Bali news Instagram accounts
    try {
      const scraped = await scrapeBaliNewsAccounts()
      results.instagramScrape = { newItems: scraped }
    } catch (error) {
      results.instagramScrape = { error: error instanceof Error ? error.message : 'Failed' }
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
