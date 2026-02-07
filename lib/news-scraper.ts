/**
 * Auto News Scraper for Indonesian Immigration Updates
 * Fetches latest visa news from official sources automatically
 */

import { VisaNews } from '@/data/visa-news';

interface ScrapedNews {
  title: string;
  description: string;
  date: string;
  link?: string;
  category: 'update' | 'alert' | 'reminder' | 'info';
}

/**
 * Scrape news from Indonesian Immigration official website
 */
async function scrapeImigrasiGovId(): Promise<ScrapedNews[]> {
  try {
    const response = await fetch('https://www.imigrasi.go.id/en/berita/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch from imigrasi.go.id:', response.status);
      return [];
    }

    const html = await response.text();
    const news: ScrapedNews[] = [];

    // Parse HTML for news items
    // Note: This is a simplified parser. Real implementation would use cheerio or similar
    const newsPattern = /<article[^>]*>(.*?)<\/article>/gs;
    const matches = html.matchAll(newsPattern);

    for (const match of matches) {
      const article = match[1];

      // Extract title
      const titleMatch = article.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
      const title = titleMatch ? stripHtml(titleMatch[1]).trim() : '';

      // Extract description/excerpt
      const descMatch = article.match(/<p[^>]*>(.*?)<\/p>/i);
      const description = descMatch ? stripHtml(descMatch[1]).trim().substring(0, 200) : '';

      // Extract date
      const dateMatch = article.match(/(\d{4}-\d{2}-\d{2})|(\d{1,2}\s+\w+\s+\d{4})/i);
      const date = dateMatch ? parseDate(dateMatch[0]) : new Date().toISOString().split('T')[0];

      // Extract link
      const linkMatch = article.match(/href=["']([^"']+)["']/i);
      const link = linkMatch ? linkMatch[1] : undefined;

      if (title && description) {
        news.push({
          title: title.substring(0, 100),
          description,
          date,
          link: link?.startsWith('http') ? link : `https://www.imigrasi.go.id${link}`,
          category: categorizeNews(title + ' ' + description),
        });
      }
    }

    return news.slice(0, 5); // Return top 5 news items
  } catch (error) {
    console.error('Error scraping imigrasi.go.id:', error);
    return [];
  }
}

/**
 * Scrape news from E-visa system announcements
 */
async function scrapeEvisaAnnouncements(): Promise<ScrapedNews[]> {
  try {
    const response = await fetch('https://evisa.imigrasi.go.id/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch from evisa.imigrasi.go.id:', response.status);
      return [];
    }

    const html = await response.text();
    const news: ScrapedNews[] = [];

    // Look for announcement banners or notification sections
    const announcementPattern = /<div[^>]*class="[^"]*announcement[^"]*"[^>]*>(.*?)<\/div>/gis;
    const matches = html.matchAll(announcementPattern);

    for (const match of matches) {
      const content = stripHtml(match[1]).trim();
      if (content.length > 20) {
        news.push({
          title: content.substring(0, 80),
          description: content.substring(0, 200),
          date: new Date().toISOString().split('T')[0],
          link: 'https://evisa.imigrasi.go.id/',
          category: 'info',
        });
      }
    }

    return news.slice(0, 2);
  } catch (error) {
    console.error('Error scraping evisa:', error);
    return [];
  }
}

/**
 * Fetch news from RSS feed if available
 */
async function fetchRSSFeed(url: string): Promise<ScrapedNews[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) return [];

    const xml = await response.text();
    const news: ScrapedNews[] = [];

    // Simple RSS parser
    const itemPattern = /<item>(.*?)<\/item>/gs;
    const matches = xml.matchAll(itemPattern);

    for (const match of matches) {
      const item = match[1];

      const titleMatch = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]).trim() : '';

      const descMatch = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/is);
      const description = descMatch ? stripHtml(descMatch[1] || descMatch[2]).trim() : '';

      const linkMatch = item.match(/<link>(.*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1].trim() : undefined;

      const dateMatch = item.match(/<pubDate>(.*?)<\/pubDate>/i);
      const date = dateMatch ? parseDate(dateMatch[1]) : new Date().toISOString().split('T')[0];

      if (title && description) {
        news.push({
          title: title.substring(0, 100),
          description: description.substring(0, 200),
          date,
          link,
          category: categorizeNews(title + ' ' + description),
        });
      }
    }

    return news.slice(0, 5);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return [];
  }
}

/**
 * Automatically categorize news based on content
 */
function categorizeNews(content: string): 'update' | 'alert' | 'reminder' | 'info' {
  const lower = content.toLowerCase();

  // Alert keywords
  if (
    lower.includes('urgent') ||
    lower.includes('deadline') ||
    lower.includes('expired') ||
    lower.includes('overstay') ||
    lower.includes('penalty') ||
    lower.includes('closed') ||
    lower.includes('suspended')
  ) {
    return 'alert';
  }

  // Reminder keywords
  if (
    lower.includes('reminder') ||
    lower.includes('don\'t forget') ||
    lower.includes('remember') ||
    lower.includes('must') ||
    lower.includes('apply before')
  ) {
    return 'reminder';
  }

  // Update keywords
  if (
    lower.includes('new') ||
    lower.includes('updated') ||
    lower.includes('changed') ||
    lower.includes('now available') ||
    lower.includes('increased') ||
    lower.includes('decreased') ||
    lower.includes('requirement')
  ) {
    return 'update';
  }

  // Default to info
  return 'info';
}

/**
 * Parse various date formats to YYYY-MM-DD
 */
function parseDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Strip HTML tags from text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generate unique ID from title and date
 */
function generateId(title: string, date: string): string {
  const hash = title.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
  return `auto-${date}-${hash}`;
}

/**
 * Main function to scrape all sources and combine news
 */
export async function fetchLatestVisaNews(): Promise<VisaNews[]> {
  console.log('🔍 Starting automated news scraping...');

  const allNews: ScrapedNews[] = [];

  // Scrape from multiple sources in parallel
  const [imigrasiNews, evisaNews] = await Promise.all([
    scrapeImigrasiGovId(),
    scrapeEvisaAnnouncements(),
  ]);

  allNews.push(...imigrasiNews, ...evisaNews);

  // Remove duplicates based on similar titles
  const uniqueNews = allNews.filter((news, index, self) =>
    index === self.findIndex(n =>
      similarity(n.title, news.title) > 0.8
    )
  );

  // Convert to VisaNews format
  const visaNews: VisaNews[] = uniqueNews.map(news => ({
    id: generateId(news.title, news.date),
    title: news.title,
    description: news.description,
    date: news.date,
    category: news.category,
    link: news.link,
  }));

  // Sort by date (newest first)
  visaNews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  console.log(`✅ Scraped ${visaNews.length} news items`);

  return visaNews.slice(0, 10); // Return top 10 news items
}

/**
 * Calculate similarity between two strings (0-1)
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}
