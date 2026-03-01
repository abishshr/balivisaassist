export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'agent'
          is_active: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'agent'
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'agent'
          is_active?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          whatsapp_number: string
          nationality: string
          date_of_birth: string | null
          passport_number: string | null
          passport_expiry: string | null
          passport_scan_path: string | null
          place_of_birth: string | null
          phone_number: string | null
          indonesia_residence_type: string | null
          indonesia_address: string | null
          indonesia_postal_code: string | null
          indonesia_province: string | null
          indonesia_city: string | null
          source: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string | null
          whatsapp_number: string
          nationality: string
          date_of_birth?: string | null
          passport_number?: string | null
          passport_expiry?: string | null
          passport_scan_path?: string | null
          place_of_birth?: string | null
          phone_number?: string | null
          indonesia_residence_type?: string | null
          indonesia_address?: string | null
          indonesia_postal_code?: string | null
          indonesia_province?: string | null
          indonesia_city?: string | null
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          whatsapp_number?: string
          nationality?: string
          date_of_birth?: string | null
          passport_number?: string | null
          passport_expiry?: string | null
          passport_scan_path?: string | null
          place_of_birth?: string | null
          phone_number?: string | null
          indonesia_residence_type?: string | null
          indonesia_address?: string | null
          indonesia_postal_code?: string | null
          indonesia_province?: string | null
          indonesia_city?: string | null
          source?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          application_number: string
          customer_id: string
          service_id: string
          service_name: string
          status: 'new' | 'documents_pending' | 'documents_received' | 'under_review' | 'submitted_to_immigration' | 'approved' | 'completed' | 'cancelled'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          quoted_price: number
          desired_start_date: string | null
          assigned_to: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          application_number?: string
          customer_id: string
          service_id: string
          service_name: string
          status?: 'new' | 'documents_pending' | 'documents_received' | 'under_review' | 'submitted_to_immigration' | 'approved' | 'completed' | 'cancelled'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          quoted_price: number
          desired_start_date?: string | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          application_number?: string
          customer_id?: string
          service_id?: string
          service_name?: string
          status?: 'new' | 'documents_pending' | 'documents_received' | 'under_review' | 'submitted_to_immigration' | 'approved' | 'completed' | 'cancelled'
          priority?: 'low' | 'normal' | 'high' | 'urgent'
          quoted_price?: number
          desired_start_date?: string | null
          assigned_to?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          application_id: string
          type: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'bank_statement' | 'invitation_letter' | 'other'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          status: 'received' | 'verified' | 'rejected'
          uploaded_by: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id: string
          type: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'bank_statement' | 'invitation_letter' | 'other'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          status?: 'received' | 'verified' | 'rejected'
          uploaded_by?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          type?: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'bank_statement' | 'invitation_letter' | 'other'
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          status?: 'received' | 'verified' | 'rejected'
          uploaded_by?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          application_id: string
          amount: number
          payment_method: 'qris' | 'cash' | 'bank_transfer' | null
          payment_status: 'pending' | 'received' | 'verified' | 'refunded'
          payment_date: string | null
          reference_number: string | null
          proof_of_payment_path: string | null
          notes: string | null
          recorded_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          amount: number
          payment_method?: 'qris' | 'cash' | 'bank_transfer' | null
          payment_status?: 'pending' | 'received' | 'verified' | 'refunded'
          payment_date?: string | null
          reference_number?: string | null
          proof_of_payment_path?: string | null
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          amount?: number
          payment_method?: 'qris' | 'cash' | 'bank_transfer' | null
          payment_status?: 'pending' | 'received' | 'verified' | 'refunded'
          payment_date?: string | null
          reference_number?: string | null
          proof_of_payment_path?: string | null
          notes?: string | null
          recorded_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          application_id: string | null
          user_id: string | null
          action: string
          description: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          user_id?: string | null
          action: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          user_id?: string | null
          action?: string
          description?: string | null
          metadata?: Json | null
          created_at?: string
        }
      }
      instagram_config: {
        Row: {
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
        Insert: {
          id?: string
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
          created_at?: string
          updated_at?: string
        }
        Update: {
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
      }
      instagram_posts: {
        Row: {
          id: string
          caption: string | null
          hashtags: string[]
          image_url: string | null
          image_prompt: string | null
          image_storage_path: string | null
          media_type: string
          status: string
          category: string | null
          source: string
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
          metadata: Json
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          caption?: string | null
          hashtags?: string[]
          image_url?: string | null
          image_prompt?: string | null
          image_storage_path?: string | null
          media_type?: string
          status?: string
          category?: string | null
          source?: string
          scheduled_for?: string | null
          news_source_url?: string | null
          news_title?: string | null
          template_id?: string | null
          metadata?: Json
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          hashtags?: string[]
          image_url?: string | null
          image_prompt?: string | null
          image_storage_path?: string | null
          media_type?: string
          status?: string
          category?: string | null
          source?: string
          scheduled_for?: string | null
          published_at?: string | null
          ig_media_id?: string | null
          ig_container_id?: string | null
          ig_permalink?: string | null
          error_message?: string | null
          retry_count?: number
          metadata?: Json
        }
      }
      content_templates: {
        Row: {
          id: string
          name: string
          category: string
          caption_prompt: string
          image_prompt_template: string | null
          hashtag_pool: string[]
          is_active: boolean
          usage_count: number
          last_used_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          category: string
          caption_prompt: string
          image_prompt_template?: string | null
          hashtag_pool?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          category?: string
          caption_prompt?: string
          image_prompt_template?: string | null
          hashtag_pool?: string[]
          is_active?: boolean
          usage_count?: number
          last_used_at?: string | null
        }
      }
      content_calendar: {
        Row: {
          id: string
          date: string
          category: string
          post_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          category: string
          post_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          date?: string
          category?: string
          post_id?: string | null
          notes?: string | null
        }
      }
      instagram_analytics: {
        Row: {
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
        Insert: {
          id?: string
          post_id: string
          impressions?: number
          reach?: number
          likes?: number
          comments?: number
          saves?: number
          shares?: number
          engagement_rate?: number
          profile_visits?: number
          website_clicks?: number
          fetched_at?: string
          created_at?: string
        }
        Update: {
          impressions?: number
          reach?: number
          likes?: number
          comments?: number
          saves?: number
          shares?: number
          engagement_rate?: number
          profile_visits?: number
          website_clicks?: number
          fetched_at?: string
        }
      }
      instagram_activity_log: {
        Row: {
          id: string
          action: string
          post_id: string | null
          details: string | null
          metadata: Json
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          action: string
          post_id?: string | null
          details?: string | null
          metadata?: Json
          status?: string
          created_at?: string
        }
        Update: {
          action?: string
          post_id?: string | null
          details?: string | null
          metadata?: Json
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
