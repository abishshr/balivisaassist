export type PostStatus =
  | 'generating'
  | 'image_pending'
  | 'pending_review'
  | 'approved'
  | 'publishing'
  | 'published'
  | 'failed'
  | 'rejected'

export type ContentCategory =
  | 'visa_tip'
  | 'bali_lifestyle'
  | 'service_promo'
  | 'faq_answer'
  | 'immigration_news'
  | 'testimonial'

export type PostSource = 'ai_generated' | 'news_scraper' | 'manual' | 'template'

export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'STORIES' | 'REELS'

export type ActivityLogStatus = 'success' | 'error' | 'warning'

// Instagram Config (singleton)
export interface InstagramConfig {
  id: string
  ig_business_account_id: string | null
  facebook_page_id: string | null
  meta_access_token: string | null
  meta_token_expires_at: string | null
  meta_app_id: string | null
  meta_app_secret: string | null
  auto_approve: boolean
  default_posting_time: string
  posting_timezone: string
  max_hashtags: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InstagramConfigUpdate {
  ig_business_account_id?: string | null
  facebook_page_id?: string | null
  meta_access_token?: string | null
  meta_token_expires_at?: string | null
  meta_app_id?: string | null
  meta_app_secret?: string | null
  auto_approve?: boolean
  default_posting_time?: string
  posting_timezone?: string
  max_hashtags?: number
  is_active?: boolean
}

// Instagram Post
export interface InstagramPost {
  id: string
  caption: string | null
  hashtags: string[]
  image_url: string | null
  image_prompt: string | null
  image_storage_path: string | null
  media_type: MediaType
  status: PostStatus
  category: ContentCategory | null
  source: PostSource
  scheduled_for: string | null
  published_at: string | null
  ig_media_id: string | null
  ig_container_id: string | null
  ig_permalink: string | null
  error_message: string | null
  retry_count: number
  news_source_url: string | null
  news_title: string | null
  template_id: string | null
  metadata: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
}

export interface InstagramPostInsert {
  caption?: string | null
  hashtags?: string[]
  image_url?: string | null
  image_prompt?: string | null
  image_storage_path?: string | null
  media_type?: MediaType
  status?: PostStatus
  category?: ContentCategory | null
  source?: PostSource
  scheduled_for?: string | null
  news_source_url?: string | null
  news_title?: string | null
  template_id?: string | null
  metadata?: Record<string, unknown>
  created_by?: string
}

export interface InstagramPostUpdate {
  caption?: string | null
  hashtags?: string[]
  image_url?: string | null
  image_prompt?: string | null
  image_storage_path?: string | null
  media_type?: MediaType
  status?: PostStatus
  category?: ContentCategory | null
  source?: PostSource
  scheduled_for?: string | null
  published_at?: string | null
  ig_media_id?: string | null
  ig_container_id?: string | null
  ig_permalink?: string | null
  error_message?: string | null
  retry_count?: number
  metadata?: Record<string, unknown>
}

// Content Template
export interface ContentTemplate {
  id: string
  name: string
  category: ContentCategory
  caption_prompt: string
  image_prompt_template: string | null
  hashtag_pool: string[]
  is_active: boolean
  usage_count: number
  last_used_at: string | null
  created_at: string
  updated_at: string
}

export interface ContentTemplateInsert {
  name: string
  category: ContentCategory
  caption_prompt: string
  image_prompt_template?: string | null
  hashtag_pool?: string[]
  is_active?: boolean
}

export interface ContentTemplateUpdate {
  name?: string
  category?: ContentCategory
  caption_prompt?: string
  image_prompt_template?: string | null
  hashtag_pool?: string[]
  is_active?: boolean
}

// Content Calendar
export interface ContentCalendar {
  id: string
  date: string
  category: ContentCategory
  post_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ContentCalendarInsert {
  date: string
  category: ContentCategory
  post_id?: string | null
  notes?: string | null
}

// Instagram Analytics
export interface InstagramAnalytics {
  id: string
  post_id: string
  impressions: number
  reach: number
  likes: number
  comments: number
  saves: number
  shares: number
  engagement_rate: number
  profile_visits: number
  website_clicks: number
  fetched_at: string
  created_at: string
}

// Instagram Activity Log
export interface InstagramActivityLog {
  id: string
  action: string
  post_id: string | null
  details: string | null
  metadata: Record<string, unknown>
  status: ActivityLogStatus
  created_at: string
}

export interface InstagramActivityLogInsert {
  action: string
  post_id?: string | null
  details?: string | null
  metadata?: Record<string, unknown>
  status?: ActivityLogStatus
}

// API response types
export interface GenerateContentRequest {
  category?: ContentCategory
  template_id?: string
  custom_prompt?: string
  news_url?: string
  news_title?: string
  news_description?: string
}

export interface GenerateContentResponse {
  post: InstagramPost
  message: string
}

export interface PostWithAnalytics extends InstagramPost {
  analytics?: InstagramAnalytics | null
}
