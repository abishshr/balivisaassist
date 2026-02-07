# Visa News Ticker - Update Guide (NYSE Style)

## Overview
The visa news ticker displays breaking visa-related news in a continuous scrolling format, inspired by NYSE and Bloomberg financial news tickers. Features premium liquid glass/glassmorphism design that appears at the top of every page.

## Features
- 🎯 **NYSE-style scrolling ticker**: Continuous horizontal animation (60-second loop)
- 💎 **Liquid glass design**: Premium glassmorphism with backdrop blur and transparency
- ⏸️ **Pause on hover**: Users can hover to read details
- 🔄 **Seamless infinite loop**: News items scroll continuously without gaps
- 🏷️ **Category badges**: UPDATE, ALERT, REMINDER, INFO with gradient glass badges
- 🌟 **Shimmer effects**: Subtle animated shimmer for premium feel
- ✨ **Floating animation**: Gentle breathing/floating effect
- 📰 **Dedicated news page**: Full news archive at `/news`

## How to Add/Update News

### 1. Open the news data file
Navigate to: `/data/visa-news.ts`

### 2. Add a new news item to the array

```typescript
{
  id: 'news-004', // Unique ID - increment the number
  title: 'Your News Title Here',
  description: 'Detailed description of the news or update. Keep it concise but informative.',
  date: '2026-02-10', // ISO date format (YYYY-MM-DD)
  category: 'update', // Options: 'update', 'alert', 'reminder', 'info'
  link: 'https://example.com', // Optional - external link for more info
  expiryDate: '2026-03-10', // Optional - when to stop showing this news
},
```

### 3. Category Guide

| Category | When to Use | Color |
|----------|-------------|-------|
| `update` | New visa types, policy changes, system updates | Blue |
| `alert` | Urgent information, deadline warnings | Red/Orange |
| `reminder` | Gentle reminders about processes, requirements | Yellow/Amber |
| `info` | General information, clarifications | Green |

### 4. Best Practices

**Title**: Keep it under 60 characters, clear and attention-grabbing
- ✅ Good: "D12 Visa Now Available Online"
- ❌ Too long: "The Indonesian Immigration Department Has Announced That The D12 Visa Application Process Is Now Available Through Their Online Portal"

**Description**: 1-2 sentences, provide key details
- ✅ Good: "Apply through evisa.imigrasi.go.id with 5-day processing. No sponsor required!"
- ❌ Too vague: "There's a new way to apply for visas now."

**Date**: Always use the actual news date, not future dates

**Link**: Only add if there's an official source to reference

**Expiry Date**:
- Use for time-sensitive news (deadlines, temporary changes)
- Don't set expiry for permanent updates
- Format: `YYYY-MM-DD`

### 5. Example News Items

```typescript
// Time-sensitive reminder
{
  id: 'news-005',
  title: 'VOA Extension Deadline Reminder',
  description: 'If your VOA expires in the next 7 days, apply for extension immediately to avoid penalties.',
  date: '2026-02-15',
  category: 'reminder',
  expiryDate: '2026-03-01', // After this date, reminder is no longer relevant
},

// Permanent update
{
  id: 'news-006',
  title: 'Second Home Visa Income Requirements Updated',
  description: 'New clarification on income requirements: USD 130,000/year (IDR 2B) or equivalent property value.',
  date: '2026-02-20',
  category: 'update',
  link: 'https://www.imigrasi.go.id/en/second-home-visa',
  // No expiry date - this is permanent information
},

// Important alert
{
  id: 'news-007',
  title: 'Immigration Office Closed for National Holiday',
  description: 'All immigration offices will be closed Feb 25-27. Plan your applications accordingly.',
  date: '2026-02-18',
  category: 'alert',
  expiryDate: '2026-02-28', // Auto-hide after the holiday
},
```

## How It Works

### Display Logic
- The banner shows the **latest** (most recent date) **active** (not expired) news item
- When a user dismisses the banner, the news ID is stored in their browser's localStorage
- If you add a new news item with a different ID, it will show even if they dismissed the previous one

### News Page
- All active news items are shown at `/news`
- Sorted by date (newest first)
- Users can always access this page to see updates they may have dismissed

## Testing Your Changes

1. Add a new news item to `/data/visa-news.ts`
2. Save the file
3. Refresh your website
4. The banner should appear at the top with your new news
5. Check that the category color is correct
6. Test the dismiss button
7. Visit `/news` to see all news items

## Pro Tips

### Regular Updates Schedule
- **Weekly**: Check for immigration news on official sites
- **Monthly**: Review and remove outdated news (even without expiry dates)
- **After Major Changes**: Update immediately when visa regulations change

### Content Sources
- Official: https://www.imigrasi.go.id
- E-visa system: https://evisa.imigrasi.go.id
- Indonesian Embassy websites
- Official government announcements

### Keep It Fresh
- Remove news older than 3-6 months (unless still very relevant)
- Update the array order doesn't matter - it auto-sorts by date
- Always verify information before posting

## Troubleshooting

**Banner not showing?**
- Check if there are any active news items in the array
- Verify the date format is correct (YYYY-MM-DD)
- Check browser console for errors
- Clear localStorage and refresh

**Banner won't dismiss?**
- Check browser localStorage is enabled
- Verify the news item has a unique `id`

**Wrong colors?**
- Verify the `category` is one of: 'update', 'alert', 'reminder', 'info'
- Check for typos in the category name

## Need Help?

The banner component is located at:
- Component: `/components/common/VisaNewsBanner.tsx`
- Data file: `/data/visa-news.ts`
- News page: `/app/news/page.tsx`

You can customize colors, icons, and behavior by editing the component file.
