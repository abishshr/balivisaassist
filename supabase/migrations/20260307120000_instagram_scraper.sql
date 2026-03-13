-- Instagram Scraper: Bali news scraping + Stories support
-- Adds scraped news table and expands category/source enums

-- 1. New table for scraped Instagram news
CREATE TABLE IF NOT EXISTS instagram_scraped_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_account TEXT NOT NULL,
  source_post_id TEXT NOT NULL,
  caption_text TEXT,
  image_url TEXT,
  image_stored_url TEXT,
  image_storage_path TEXT,
  post_timestamp TIMESTAMPTZ,
  is_used BOOLEAN DEFAULT FALSE,
  used_by_post_id UUID REFERENCES instagram_posts(id) ON DELETE SET NULL,
  scraped_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index for dedup
CREATE UNIQUE INDEX IF NOT EXISTS idx_scraped_news_dedup
  ON instagram_scraped_news(source_account, source_post_id);

-- Index for finding unused items
CREATE INDEX IF NOT EXISTS idx_scraped_news_unused
  ON instagram_scraped_news(is_used, scraped_at DESC);

-- 2. Add 'instagram_scraper' to instagram_posts source values
ALTER TABLE instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_source_check;
ALTER TABLE instagram_posts ADD CONSTRAINT instagram_posts_source_check
  CHECK (source IN ('ai_generated', 'news_scraper', 'manual', 'template', 'instagram_scraper'));

-- 3. Add 'bali_news' to category values on instagram_posts
ALTER TABLE instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_category_check;
ALTER TABLE instagram_posts ADD CONSTRAINT instagram_posts_category_check
  CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial', 'bali_news'));

-- 4. Add 'bali_news' to category values on content_templates
ALTER TABLE content_templates DROP CONSTRAINT IF EXISTS content_templates_category_check;
ALTER TABLE content_templates ADD CONSTRAINT content_templates_category_check
  CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial', 'bali_news'));

-- 5. Add 'bali_news' to category values on content_calendar
ALTER TABLE content_calendar DROP CONSTRAINT IF EXISTS content_calendar_category_check;
ALTER TABLE content_calendar ADD CONSTRAINT content_calendar_category_check
  CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial', 'bali_news'));

-- 6. RLS for scraped news table
ALTER TABLE instagram_scraped_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated access to instagram_scraped_news"
  ON instagram_scraped_news FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow service role access to instagram_scraped_news"
  ON instagram_scraped_news FOR ALL USING (auth.role() = 'service_role');
