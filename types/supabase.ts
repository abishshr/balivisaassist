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
          type: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'other'
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
          type: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'other'
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
          type?: 'passport' | 'passport_photo' | 'flight_ticket' | 'accommodation_proof' | 'sponsorship_letter' | 'proof_of_payment' | 'other'
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
