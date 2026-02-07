# Automatic Visa News Scraping - Setup Guide

## Overview
Your site now automatically scrapes visa news from Indonesian Immigration official websites. **No manual updates needed!**

## How It Works

1. **Daily Scraping**: A cron job runs every day at 6 AM UTC (2 PM Jakarta time)
2. **Auto-fetches** news from:
   - https://www.imigrasi.go.id (Official Immigration website)
   - https://evisa.imigrasi.go.id (E-visa system)
3. **Auto-categorizes** news as UPDATE, ALERT, REMINDER, or INFO
4. **Updates instantly** - no redeployment needed
5. **Removes duplicates** automatically
6. **Shows latest** news in banner and /news page

## Setup on Render

### Option 1: Automatic Setup (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add automatic news scraping"
   git push
   ```

2. **Deploy on Render**:
   - Render will detect `render.yaml` and set up everything automatically
   - Two services will be created:
     - **balivisaassist** (your main website)
     - **visa-news-scraper** (cron job to scrape daily)

3. **Set Environment Variable**:
   - Go to your service dashboard on Render
   - Add environment variable:
     - Key: `CRON_SECRET`
     - Value: Generate a random secret (e.g., `openssl rand -hex 32`)
   - Apply the same secret to both web service and cron job

### Option 2: Manual Setup

If you prefer to set up manually:

1. **Deploy Main Service**:
   - Create a new Web Service on Render
   - Connect your GitHub repository
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

2. **Add Environment Variable**:
   - In your web service settings, add:
     - `CRON_SECRET`: (generate a random 32-character string)

3. **Create Cron Job**:
   - In Render dashboard, create a new Cron Job
   - Schedule: `0 6 * * *` (daily at 6 AM UTC)
   - Command:
     ```bash
     curl -X GET "https://YOUR-SITE.onrender.com/api/scrape-news?secret=YOUR_CRON_SECRET"
     ```
   - Replace `YOUR-SITE` and `YOUR_CRON_SECRET` with your values

## How to Test

### Test Scraping Manually:

Visit this URL in your browser:
```
https://YOUR-SITE.onrender.com/api/scrape-news?secret=YOUR_CRON_SECRET
```

You should see a JSON response with scraped news items:
```json
{
  "success": true,
  "count": 8,
  "lastUpdated": "2026-02-07T12:00:00.000Z",
  "news": [...]
}
```

### Check the News Banner:

1. Visit your homepage
2. You should see the latest scraped news in the top banner
3. The news should update automatically after each scrape

## Cron Schedule Options

The default schedule is `0 6 * * *` (daily at 6 AM UTC).

You can change it to:

- **Every 6 hours**: `0 */6 * * *`
- **Every 12 hours**: `0 */12 * * *`
- **Twice daily (6 AM & 6 PM)**: `0 6,18 * * *`
- **Every hour**: `0 * * * *`
- **Monday-Friday at 9 AM**: `0 9 * * 1-5`

Edit `render.yaml` and update the `schedule` field.

## Monitoring

### Check Last Scrape Time:

The scraped news is saved in `/data/scraped-news.json` with a timestamp:

```json
{
  "lastUpdated": "2026-02-07T12:00:00.000Z",
  "news": [...]
}
```

### View Logs:

1. Go to Render dashboard
2. Select your cron job service
3. Check "Logs" tab to see scraping activity

## Fallback News

The system includes fallback news in case scraping fails:

- **Scraped news** is shown first (latest from websites)
- **Manual news** is used as fallback (from `/data/visa-news.ts`)
- You can still manually add urgent news if needed

## Customization

### Add More News Sources:

Edit `/lib/news-scraper.ts` and add new scraping functions:

```typescript
async function scrapeYourSource(): Promise<ScrapedNews[]> {
  // Your scraping logic
}

// Add to fetchLatestVisaNews():
const [source1, source2, yourSource] = await Promise.all([
  scrapeImigrasiGovId(),
  scrapeEvisaAnnouncements(),
  scrapeYourSource(), // Add here
]);
```

### Change Categorization Logic:

Edit the `categorizeNews()` function in `/lib/news-scraper.ts`:

```typescript
function categorizeNews(content: string): 'update' | 'alert' | 'reminder' | 'info' {
  // Add your own keywords
  if (content.includes('your-keyword')) {
    return 'alert';
  }
  // ...
}
```

## Troubleshooting

### No News Showing?

1. **Check cron job ran**:
   - Go to Render dashboard → Cron Jobs → Logs
   - Should see successful execution

2. **Check API endpoint**:
   - Visit `/api/scrape-news?secret=YOUR_SECRET`
   - Should return JSON with news items

3. **Check scraped-news.json**:
   - File should exist at `/data/scraped-news.json`
   - Should contain recent news

4. **Clear browser cache**:
   - Hard refresh (Cmd+Shift+R / Ctrl+Shift+R)

### Cron Job Failing?

1. **Check secret key**:
   - Ensure `CRON_SECRET` matches between web service and cron job

2. **Check URL**:
   - Ensure the cron job uses the correct domain

3. **Check source websites**:
   - Make sure immigration websites are accessible
   - They might have changed structure (update scraper)

### Want to Force Update?

Trigger the scraper manually:
```bash
curl -X GET "https://YOUR-SITE.onrender.com/api/scrape-news?secret=YOUR_SECRET"
```

## Cost

- **Render Free Tier**: Includes cron jobs!
- **Zero additional cost** for automatic scraping
- No database needed

## Benefits

✅ **100% Automatic** - No manual work needed
✅ **Always up-to-date** - Latest visa news daily
✅ **Official sources** - Directly from government websites
✅ **Auto-categorized** - Smart categorization
✅ **No redeployment** - Updates happen automatically
✅ **Free** - No additional costs

## Support

If you encounter issues:

1. Check Render logs (Dashboard → Logs)
2. Test the API endpoint manually
3. Verify the CRON_SECRET matches
4. Check that source websites are accessible

---

**You're all set!** Your visa news will update automatically every day. 🎉
