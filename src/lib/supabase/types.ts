// CompatibleIQ™ — Supabase Database Types
// Auto-aligned with 001_initial_schema.sql

// ═══════════════════════════════════════════
// Enum Types
// ═══════════════════════════════════════════

export type GenderIdentity = 'woman' | 'man' | 'nonbinary' | 'self_describe'
export type InterestedIn = 'women' | 'men' | 'everyone' | 'self_describe'
export type SexualOrientation = 'straight' | 'gay' | 'lesbian' | 'bisexual' | 'pansexual' | 'queer' | 'asexual' | 'demisexual' | 'other'
export type RelationshipGoal = 'long_term' | 'marriage' | 'fun' | 'not_sure'
export type SubscriptionTier = 'free' | 'pro' | 'founding_member'
export type MatchStatus = 'pending' | 'active' | 'unmatched' | 'blocked'
export type ContentType = 'text' | 'emoji'
export type ReportReason = 'harassment' | 'inappropriate' | 'fake_profile' | 'spam' | 'other'
export type ReportStatus = 'pending' | 'reviewed' | 'action_taken' | 'dismissed'
export type PaymentProductType = 'resonance_report' | 'ciq_pro' | 'founding_member'
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded'
export type NotificationType = 'new_resonance' | 'new_message' | 'report_available' | 'assessment_reminder' | 'weekly_digest'

export type DimensionId = 'values' | 'attachment' | 'communication' | 'emotional_intelligence' | 'lifestyle' | 'love_languages'

// ═══════════════════════════════════════════
// Database Type Definition
// ═══════════════════════════════════════════

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          location_city: string | null
          location_state: string | null
          gender_identity: GenderIdentity | null
          interested_in: InterestedIn | null
          sexual_orientation: SexualOrientation | null
          relationship_goal: RelationshipGoal | null
          bio: string
          photo_urls: string[]
          date_of_birth: string | null
          assessment_completed: boolean
          assessment_completed_at: string | null
          subscription_tier: SubscriptionTier
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string
          location_city?: string | null
          location_state?: string | null
          gender_identity?: GenderIdentity | null
          interested_in?: InterestedIn | null
          sexual_orientation?: SexualOrientation | null
          relationship_goal?: RelationshipGoal | null
          bio?: string
          photo_urls?: string[]
          date_of_birth?: string | null
          assessment_completed?: boolean
          assessment_completed_at?: string | null
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: never
          first_name?: string
          location_city?: string | null
          location_state?: string | null
          gender_identity?: GenderIdentity | null
          interested_in?: InterestedIn | null
          sexual_orientation?: SexualOrientation | null
          relationship_goal?: RelationshipGoal | null
          bio?: string
          photo_urls?: string[]
          date_of_birth?: string | null
          assessment_completed?: boolean
          assessment_completed_at?: string | null
          subscription_tier?: SubscriptionTier
          stripe_customer_id?: string | null
          updated_at?: string
        }
      }

      assessment_responses: {
        Row: {
          id: string
          user_id: string
          dimension_id: DimensionId
          answers: Record<string, unknown>
          scores: Record<string, unknown> | null
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dimension_id: DimensionId
          answers: Record<string, unknown>
          scores?: Record<string, unknown> | null
          completed_at?: string
        }
        Update: {
          answers?: Record<string, unknown>
          scores?: Record<string, unknown> | null
          completed_at?: string
        }
      }

      dimension_scores: {
        Row: {
          id: string
          user_id: string
          dimension_id: string
          sub_scale_scores: Record<string, number>
          overall_score: number
          computed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          dimension_id: string
          sub_scale_scores: Record<string, number>
          overall_score: number
          computed_at?: string
        }
        Update: {
          sub_scale_scores?: Record<string, number>
          overall_score?: number
          computed_at?: string
        }
      }

      matches: {
        Row: {
          id: string
          user_a_id: string
          user_b_id: string
          cis_score: number | null
          dimension_scores: Record<string, unknown>
          status: MatchStatus
          matched_at: string
        }
        Insert: {
          id?: string
          user_a_id: string
          user_b_id: string
          cis_score?: number | null
          dimension_scores?: Record<string, unknown>
          status?: MatchStatus
          matched_at?: string
        }
        Update: {
          cis_score?: number | null
          dimension_scores?: Record<string, unknown>
          status?: MatchStatus
        }
      }

      resonance_reports: {
        Row: {
          id: string
          match_id: string
          purchased_by: string
          stripe_payment_intent_id: string | null
          report_data: Record<string, unknown>
          generated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          purchased_by: string
          stripe_payment_intent_id?: string | null
          report_data: Record<string, unknown>
          generated_at?: string
        }
        Update: {
          report_data?: Record<string, unknown>
          stripe_payment_intent_id?: string | null
        }
      }

      messages: {
        Row: {
          id: string
          match_id: string
          sender_id: string
          content: string
          content_type: ContentType
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          sender_id: string
          content: string
          content_type?: ContentType
          read_at?: string | null
          created_at?: string
        }
        Update: {
          read_at?: string | null
        }
      }

      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string
          reason: ReportReason
          details: string | null
          status: ReportStatus
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          reported_user_id: string
          reason: ReportReason
          details?: string | null
          status?: ReportStatus
          created_at?: string
        }
        Update: {
          status?: ReportStatus
          details?: string | null
        }
      }

      blocks: {
        Row: {
          id: string
          blocker_id: string
          blocked_id: string
          created_at: string
        }
        Insert: {
          id?: string
          blocker_id: string
          blocked_id: string
          created_at?: string
        }
        Update: never
      }

      payments: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          product_type: PaymentProductType
          amount_cents: number
          currency: string
          status: PaymentStatus
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          product_type: PaymentProductType
          amount_cents: number
          currency?: string
          status?: PaymentStatus
          created_at?: string
        }
        Update: {
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          status?: PaymentStatus
        }
      }

      notifications: {
        Row: {
          id: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          data: Record<string, unknown>
          read: boolean
          push_sent: boolean
          email_sent: boolean
          sms_sent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: NotificationType
          title: string
          body: string
          data?: Record<string, unknown>
          read?: boolean
          push_sent?: boolean
          email_sent?: boolean
          sms_sent?: boolean
          created_at?: string
        }
        Update: {
          read?: boolean
          push_sent?: boolean
          email_sent?: boolean
          sms_sent?: boolean
        }
      }

      notification_preferences: {
        Row: {
          user_id: string
          push_enabled: boolean
          email_enabled: boolean
          sms_enabled: boolean
          quiet_hours_start: string
          quiet_hours_end: string
        }
        Insert: {
          user_id: string
          push_enabled?: boolean
          email_enabled?: boolean
          sms_enabled?: boolean
          quiet_hours_start?: string
          quiet_hours_end?: string
        }
        Update: {
          push_enabled?: boolean
          email_enabled?: boolean
          sms_enabled?: boolean
          quiet_hours_start?: string
          quiet_hours_end?: string
        }
      }
    }

    Functions: {
      get_user_resonances: {
        Args: { user_uuid: string }
        Returns: {
          match_id: string
          cis_score: number | null
          dimension_scores: Record<string, unknown>
          status: MatchStatus
          matched_at: string
          other_user_id: string
          first_name: string
          bio: string
          photo_urls: string[]
          location_city: string | null
          location_state: string | null
          gender_identity: GenderIdentity | null
          date_of_birth: string | null
        }[]
      }
      check_compatibility: {
        Args: { user_a_uuid: string; user_b_uuid: string }
        Returns: {
          user_id: string
          dimension_id: string
          sub_scale_scores: Record<string, number>
          overall_score: number
        }[]
      }
    }

    Enums: {
      gender_identity: GenderIdentity
      interested_in_type: InterestedIn
      sexual_orientation_type: SexualOrientation
      relationship_goal_type: RelationshipGoal
      subscription_tier_type: SubscriptionTier
      match_status_type: MatchStatus
      content_type: ContentType
      report_reason_type: ReportReason
      report_status_type: ReportStatus
      payment_product_type: PaymentProductType
      payment_status_type: PaymentStatus
      notification_type: NotificationType
    }
  }
}

// ═══════════════════════════════════════════
// Convenience Type Aliases
// ═══════════════════════════════════════════

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Shorthand row types
export type Profile = Tables<'profiles'>
export type AssessmentResponse = Tables<'assessment_responses'>
export type DimensionScore = Tables<'dimension_scores'>
export type Match = Tables<'matches'>
export type ResonanceReport = Tables<'resonance_reports'>
export type Message = Tables<'messages'>
export type Report = Tables<'reports'>
export type Block = Tables<'blocks'>
export type Payment = Tables<'payments'>
export type Notification = Tables<'notifications'>
export type NotificationPreference = Tables<'notification_preferences'>
