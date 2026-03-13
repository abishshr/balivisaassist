import { NextResponse } from 'next/server'
import { fetchLatestVisaNews } from '@/lib/news-scraper'
import { convertNewsToPost, retryPendingImages, generateMixedNewsPost } from '@/lib/instagram/pipeline'
import { scrapeBaliNewsAccounts } from '@/lib/instagram/bali-news-scraper'
import fs from 'fs/promises'
import path from 'path'

/**
 * Evening Cron: 0 6 * * * UTC (2 PM Bali)
 * 1. Scrape visa news (replaces old /api/scrape-news)
 * 2. Convert top news to Instagram posts
 * 3. Scrape Bali news from Instagram accounts
 * 4. Generate mixed news+visa post
 * 5. Retry any pending image generations
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

    // 2. Convert top news item to IG post (only if there's fresh news)
    if (scrapedNews.length > 0) {
      const topNews = scrapedNews[0]
      const isImmigrationNews = topNews.category === 'alert' || topNews.category === 'update'
        || /visa|immigration|passport|kitas|kitap|overstay|permit/i.test(topNews.title + ' ' + topNews.description)
      const category = isImmigrationNews ? 'immigration_news' : 'bali_lifestyle'

      try {
        const post = await convertNewsToPost(
          topNews.title,
          topNews.description,
          topNews.link,
          category
        )
        results.newsPost = { id: post.id, status: post.status, category }
      } catch (error) {
        results.newsPost = { error: error instanceof Error ? error.message : 'Failed' }
      }
    }

    // 3. Scrape Bali news Instagram accounts
    try {
      const scraped = await scrapeBaliNewsAccounts()
      results.instagramScrape = { newItems: scraped }
    } catch (error) {
      results.instagramScrape = { error: error instanceof Error ? error.message : 'Failed' }
    }

    // 4. Generate mixed news+visa post from scraped content
    try {
      const mixedPost = await generateMixedNewsPost()
      results.mixedPost = mixedPost
        ? { id: mixedPost.id, status: mixedPost.status }
        : { skipped: 'No scraped news available' }
    } catch (error) {
      results.mixedPost = { error: error instanceof Error ? error.message : 'Failed' }
    }

    // 5. Retry pending images
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
