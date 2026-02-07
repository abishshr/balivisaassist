/**
 * Test script to verify news scraping works locally
 * Run with: npx tsx scripts/test-scraper.ts
 */

import { fetchLatestVisaNews } from '../lib/news-scraper';

async function test() {
  console.log('🧪 Testing news scraper...\n');

  try {
    const news = await fetchLatestVisaNews();

    console.log(`✅ Successfully scraped ${news.length} news items:\n`);

    news.forEach((item, index) => {
      console.log(`${index + 1}. [${item.category.toUpperCase()}] ${item.title}`);
      console.log(`   Date: ${item.date}`);
      console.log(`   ${item.description.substring(0, 100)}...`);
      if (item.link) {
        console.log(`   Link: ${item.link}`);
      }
      console.log('');
    });

    if (news.length === 0) {
      console.log('⚠️  No news items found. This might be normal if:');
      console.log('   - Immigration websites are down');
      console.log('   - Website structure changed (scraper needs update)');
      console.log('   - Network connectivity issues\n');
    }

    console.log('✅ Test complete!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();
