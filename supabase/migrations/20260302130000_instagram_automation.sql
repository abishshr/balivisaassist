-- Instagram Automation Tables
-- Supports AI-generated content pipeline for @balivisaassist Instagram

-- 1. Instagram Config (singleton)
CREATE TABLE IF NOT EXISTS instagram_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ig_business_account_id TEXT,
  facebook_page_id TEXT DEFAULT '1019058627948610',
  meta_access_token TEXT,
  meta_token_expires_at TIMESTAMPTZ,
  meta_app_id TEXT,
  meta_app_secret TEXT,
  auto_approve BOOLEAN DEFAULT FALSE,
  default_posting_time TIME DEFAULT '10:00:00',
  posting_timezone TEXT DEFAULT 'Asia/Makassar',
  max_hashtags INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Instagram Posts
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caption TEXT,
  hashtags TEXT[] DEFAULT '{}',
  image_url TEXT,
  image_prompt TEXT,
  image_storage_path TEXT,
  media_type TEXT DEFAULT 'IMAGE' CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM', 'STORIES', 'REELS')),
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'image_pending', 'pending_review', 'approved', 'publishing', 'published', 'failed', 'rejected')),
  category TEXT CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial')),
  source TEXT DEFAULT 'ai_generated' CHECK (source IN ('ai_generated', 'news_scraper', 'manual', 'template')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  ig_media_id TEXT,
  ig_container_id TEXT,
  ig_permalink TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  news_source_url TEXT,
  news_title TEXT,
  template_id UUID,
  metadata JSONB DEFAULT '{}',
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Content Templates
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial')),
  caption_prompt TEXT NOT NULL,
  image_prompt_template TEXT,
  hashtag_pool TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Content Calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('visa_tip', 'bali_lifestyle', 'service_promo', 'faq_answer', 'immigration_news', 'testimonial')),
  post_id UUID REFERENCES instagram_posts(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Instagram Analytics
CREATE TABLE IF NOT EXISTS instagram_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES instagram_posts(id) ON DELETE CASCADE,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5, 2) DEFAULT 0,
  profile_visits INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Instagram Activity Log
CREATE TABLE IF NOT EXISTS instagram_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  post_id UUID REFERENCES instagram_posts(id) ON DELETE SET NULL,
  details TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error', 'warning')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_instagram_posts_status ON instagram_posts(status);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_scheduled ON instagram_posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_category ON instagram_posts(category);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_created ON instagram_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_calendar_date ON content_calendar(date);
CREATE INDEX IF NOT EXISTS idx_instagram_analytics_post ON instagram_analytics(post_id);
CREATE INDEX IF NOT EXISTS idx_instagram_activity_log_created ON instagram_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_activity_log_action ON instagram_activity_log(action);

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_instagram_config_updated_at') THEN
    CREATE TRIGGER update_instagram_config_updated_at
      BEFORE UPDATE ON instagram_config
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_instagram_posts_updated_at') THEN
    CREATE TRIGGER update_instagram_posts_updated_at
      BEFORE UPDATE ON instagram_posts
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_templates_updated_at') THEN
    CREATE TRIGGER update_content_templates_updated_at
      BEFORE UPDATE ON content_templates
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_content_calendar_updated_at') THEN
    CREATE TRIGGER update_content_calendar_updated_at
      BEFORE UPDATE ON content_calendar
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Row Level Security
ALTER TABLE instagram_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow authenticated users)
CREATE POLICY "Allow authenticated access to instagram_config" ON instagram_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to instagram_posts" ON instagram_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to content_templates" ON content_templates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to content_calendar" ON content_calendar FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to instagram_analytics" ON instagram_analytics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated access to instagram_activity_log" ON instagram_activity_log FOR ALL USING (auth.role() = 'authenticated');

-- Service role policies (for cron jobs and API routes using service role key)
CREATE POLICY "Allow service role access to instagram_config" ON instagram_config FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role access to instagram_posts" ON instagram_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role access to content_templates" ON content_templates FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role access to content_calendar" ON content_calendar FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role access to instagram_analytics" ON instagram_analytics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role access to instagram_activity_log" ON instagram_activity_log FOR ALL USING (auth.role() = 'service_role');

-- Supabase Storage bucket for Instagram media
INSERT INTO storage.buckets (id, name, public)
VALUES ('instagram-media', 'instagram-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow authenticated upload to instagram-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'instagram-media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow public read from instagram-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'instagram-media');

CREATE POLICY "Allow authenticated delete from instagram-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'instagram-media' AND auth.role() = 'authenticated');

CREATE POLICY "Allow service role access to instagram-media" ON storage.objects
  FOR ALL USING (bucket_id = 'instagram-media' AND auth.role() = 'service_role');

-- Insert default content templates
INSERT INTO content_templates (name, category, caption_prompt, image_prompt_template, hashtag_pool) VALUES
(
  'Visa Tip of the Day',
  'visa_tip',
  'Generate an informative Instagram caption about an Indonesia visa tip for expats and tourists in Bali. The tip should be practical, actionable, and include a call-to-action to contact BaliVisaAssist. Keep it under 2200 characters. Use a friendly, professional tone.',
  'Professional infographic style image about Indonesia visa tips, tropical Bali setting, clean modern design, teal and white color scheme, no text',
  ARRAY['#balivisaassist', '#balivisa', '#indonesiavisa', '#visatips', '#bali', '#expat', '#expatlife', '#digitalnomadbali', '#baliliving', '#visaagent', '#visaservices', '#indonesiatravel', '#baliexpat']
),
(
  'Bali Lifestyle',
  'bali_lifestyle',
  'Generate an engaging Instagram caption about Bali lifestyle, culture, or travel tips that subtly connects to visa/immigration topics. Include a soft mention of BaliVisaAssist services. Keep it under 2200 characters. Use an inspiring, warm tone.',
  'Beautiful Bali landscape photography, rice terraces, temples, tropical sunset, vibrant colors, professional travel photography style',
  ARRAY['#bali', '#balilife', '#balilifestyle', '#baliliving', '#explorebali', '#balitravel', '#islandlife', '#tropicalliving', '#balivibes', '#baliculture', '#indonesia', '#travelindonesia']
),
(
  'Service Promotion',
  'service_promo',
  'Generate a compelling Instagram caption promoting BaliVisaAssist visa services (KITAS, KITAP, business visa, tourist visa extension). Highlight the ease and professionalism of the service. Include a clear call-to-action. Keep it under 2200 characters.',
  'Professional business service graphic, modern office in tropical setting, visa documents, clean design, green and white color palette, no text',
  ARRAY['#balivisaassist', '#visaservices', '#kitasbali', '#kitapbali', '#businessvisa', '#visaextension', '#visaagentbali', '#immigrationbali', '#workpermitbali', '#stayinbali']
),
(
  'FAQ Answer',
  'faq_answer',
  'Generate an Instagram caption that answers a frequently asked question about Indonesia visas, immigration, or living in Bali. Make it educational and easy to understand. Include a CTA to save the post. Keep it under 2200 characters.',
  'Clean FAQ-style infographic design, question mark icon, tropical Bali elements, modern minimalist style, informative layout, no text',
  ARRAY['#balivisaassist', '#visafaq', '#indonesiavisa', '#baliexpat', '#visaquestions', '#immigrationfaq', '#balivisa', '#indonesiaimmigration', '#expatbali', '#visahelp']
);

-- Insert default config
INSERT INTO instagram_config (facebook_page_id, ig_business_account_id, auto_approve, default_posting_time, posting_timezone)
VALUES ('1019058627948610', '17841480451853078', false, '10:00:00', 'Asia/Makassar')
ON CONFLICT DO NOTHING;
