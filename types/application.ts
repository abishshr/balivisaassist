import type { Database } from './supabase'

export type Application = Database['public']['Tables']['applications']['Row']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']

export type ApplicationStatus =
  | 'new'
  | 'documents_pending'
  | 'documents_received'
  | 'under_review'
  | 'submitted_to_immigration'
  | 'approved'
  | 'completed'
  | 'cancelled'

export type ApplicationPriority = 'low' | 'normal' | 'high' | 'urgent'

export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentInsert = Database['public']['Tables']['documents']['Insert']
export type DocumentUpdate = Database['public']['Tables']['documents']['Update']

export type DocumentType =
  | 'passport'
  | 'passport_photo'
  | 'flight_ticket'
  | 'accommodation_proof'
  | 'sponsorship_letter'
  | 'proof_of_payment'
  | 'other'

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

export type PaymentMethod = 'qris' | 'cash' | 'bank_transfer'
export type PaymentStatus = 'pending' | 'received' | 'verified' | 'refunded'

export type ActivityLog = Database['public']['Tables']['activity_logs']['Row']
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert']

export interface ApplicationWithCustomer extends Application {
  customer: {
    id: string
    first_name: string
    last_name: string
    email: string | null
    whatsapp_number: string
    nationality: string
  }
}
