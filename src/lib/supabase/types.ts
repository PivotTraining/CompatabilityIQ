export type Gender = 'male' | 'female' | 'non_binary' | 'other'
export type Orientation = 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'asexual' | 'other'
export type CISTier = 'rare' | 'synergistic' | 'compatible' | 'misaligned'
export type InteractionAction = 'connect' | 'dismiss'
export type ModerationStatus = 'pending' | 'approved' | 'rejected'
export type ReportReason = 'inappropriate' | 'harassment' | 'fake_profile' | 'spam' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          display_name: string
          date_of_birth: string
          gender: Gender
          orientation: Orientation
          bio: string
          location_lat: number | null
          location_lng: number | null
          location_city: string | null
          location_state: string | null
          assessment_progress: number
          cis_score: number | null
          cis_tier: CISTier | null
          is_active: boolean
          is_verified: boolean
          last_active_at: string
          search_min_age: number
          search_max_age: number
          search_max_distance: number
          search_genders: string[]
        }
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & {
          id: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      photos: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          position: number
          is_primary: boolean
          is_approved: boolean
          moderation_status: ModerationStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['photos']['Row'], 'id' | 'created_at' | 'is_approved' | 'moderation_status'>
        Update: Partial<Database['public']['Tables']['photos']['Row']>
      }
      interactions: {
        Row: {
          id: string
          user_id: string
          target_id: string
          action: InteractionAction
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['interactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['interactions']['Row']>
      }
      matches: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          match_cis: number | null
          match_tier: CISTier | null
          top_domains: string[]
          created_at: string
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['matches']['Row'], 'id' | 'created_at' | 'is_active' | 'match_cis' | 'match_tier' | 'top_domains'>
        Update: Partial<Database['public']['Tables']['matches']['Row']>
      }
      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'is_read'>
        Update: Partial<Database['public']['Tables']['messages']['Row']>
      }
      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blocks']['Row'], 'id' | 'created_at'>
        Update: never
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_id: string
          reason: ReportReason
          details: string | null
          match_id: string | null
          status: ReportStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at' | 'status'>
        Update: Partial<Database['public']['Tables']['reports']['Row']>
      }
      assessment_responses: {
        Row: {
          id: string
          user_id: string
          module: number
          encrypted_responses: string
          response_hash: string
          submitted_at: string
          ip_address: string | null
        }
        Insert: {
          user_id: string
          module: number
          encrypted_responses: string
          response_hash: string
          submitted_at?: string
          ip_address?: string | null
        }
        Update: Partial<Database['public']['Tables']['assessment_responses']['Row']>
      }
      audit_log: {
        Row: {
          id: number
          user_id: string | null
          action: string
          resource_type: string
          resource_id: string | null
          metadata: Record<string, unknown>
          ip_address: string | null
          created_at: string
        }
        Insert: {
          user_id?: string | null
          action: string
          resource_type: string
          resource_id?: string | null
          metadata?: Record<string, unknown>
          ip_address?: string | null
        }
        Update: never
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
