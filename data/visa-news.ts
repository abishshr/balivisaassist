export interface VisaNews {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  category: 'update' | 'alert' | 'reminder' | 'info';
  link?: string; // Optional link to more details
  expiryDate?: string; // Optional expiry date for time-sensitive news
}

/**
 * Load scraped news from JSON file (auto-updated by cron job)
 */
function loadScrapedNews(): VisaNews[] {
  try {
    // In browser/client-side, return empty array
    if (typeof window !== 'undefined') {
      return [];
    }

    // Server-side: read from file
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'data', 'scraped-news.json');

    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return data.news || [];
    }
  } catch (error) {
    console.error('Error loading scraped news:', error);
  }
  return [];
}

// Manual fallback news (used if scraping fails or for additional curated items)
export const manualVisaNewsItems: VisaNews[] = [
  {
    id: 'news-001',
    title: 'D12 Visa Online Application Now Available',
    description: 'The D12 Pre-Investment Visa can now be applied online through evisa.imigrasi.go.id with 5-day processing time. No sponsor required!',
    date: '2026-02-07',
    category: 'update',
    link: 'https://www.imigrasi.go.id/wna/daftar-visa-indonesia/D12',
  },
  {
    id: 'news-006',
    title: 'E33 Second Home Visa: USD 130,000 Bank Commitment Required',
    description: 'Official clarification: E33 Second Home Visa holders must maintain USD 130,000 in Indonesian bank OR purchase USD 1M property within 90 days of permit issuance.',
    date: '2026-02-07',
    category: 'info',
    link: 'https://www.imigrasi.go.id/wna/daftar-visa-indonesia/E33',
  },
  {
    id: 'news-007',
    title: 'Retirement KITAS Income Requirement Increased to USD 3,000/Month',
    description: 'Updated 2026 requirement: Retirement KITAS applicants must show proof of USD 3,000/month pension (USD 36,000/year) plus USD 2,000 minimum bank balance.',
    date: '2026-02-06',
    category: 'update',
  },
  {
    id: 'news-008',
    title: 'VOA Extension Now Requires Biometric Data Collection',
    description: 'New procedure: VOA extensions must be done in person at immigration offices for fingerprint and photo collection. Apply 14 days before expiry.',
    date: '2026-02-05',
    category: 'alert',
  },
  {
    id: 'news-002',
    title: 'Reminder: VOA Extension Must Be Done 14 Days Before Expiry',
    description: 'Don\'t wait until the last minute! Apply for your VOA extension between 14 days and 1 business day before expiry. Overstay penalty: IDR 1M/day.',
    date: '2026-02-01',
    category: 'reminder',
  },
  {
    id: 'news-009',
    title: 'C1 Tourist Visa: Extensions Require In-Person Visit',
    description: 'C1 single-entry tourist visa can be extended twice (180 days total). Starting 2025, extensions require in-person visit to immigration office for biometric verification.',
    date: '2026-01-28',
    category: 'info',
  },
];

// Combine scraped and manual news
export const visaNewsItems = (): VisaNews[] => {
  const scraped = loadScrapedNews();
  const combined = [...scraped, ...manualVisaNewsItems];

  // Remove duplicates based on ID
  const unique = combined.filter((news, index, self) =>
    index === self.findIndex(n => n.id === news.id)
  );

  return unique;
};

// Get the latest active news item
export function getLatestVisaNews(): VisaNews | null {
  const now = new Date();

  // Filter out expired news
  const activeNews = visaNewsItems().filter(news => {
    if (!news.expiryDate) return true;
    return new Date(news.expiryDate) > now;
  });

  // Sort by date (newest first) and return the latest
  const sorted = activeNews.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return sorted[0] || null;
}

// Get all active news items
export function getAllActiveVisaNews(): VisaNews[] {
  const now = new Date();

  return visaNewsItems()
    .filter(news => {
      if (!news.expiryDate) return true;
      return new Date(news.expiryDate) > now;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
