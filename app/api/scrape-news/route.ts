import { NextResponse } from 'next/server';
import { fetchLatestVisaNews } from '@/lib/news-scraper';
import fs from 'fs/promises';
import path from 'path';

/**
 * API Route to scrape latest visa news
 * This endpoint is called by Render Cron Job daily
 */
export async function GET(request: Request) {
  try {
    // Check for secret key to prevent unauthorized scraping
    // Vercel Cron uses Authorization header
    const authHeader = request.headers.get('authorization');
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Allow either Vercel Cron header or secret query param
    const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
    const isValidSecret = secret === process.env.CRON_SECRET;

    if (!isVercelCron && !isValidSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Starting news scraping...');

    // Fetch latest news from all sources
    const scrapedNews = await fetchLatestVisaNews();

    // Save to a JSON file that the app can read
    const newsFilePath = path.join(process.cwd(), 'data', 'scraped-news.json');

    const newsData = {
      lastUpdated: new Date().toISOString(),
      news: scrapedNews,
    };

    await fs.writeFile(newsFilePath, JSON.stringify(newsData, null, 2), 'utf-8');

    console.log(`✅ Successfully scraped and saved ${scrapedNews.length} news items`);

    return NextResponse.json({
      success: true,
      count: scrapedNews.length,
      lastUpdated: newsData.lastUpdated,
      news: scrapedNews,
    });
  } catch (error) {
    console.error('❌ Error scraping news:', error);
    return NextResponse.json(
      {
        error: 'Failed to scrape news',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Allow POST as well for manual triggers
export async function POST(request: Request) {
  return GET(request);
}
