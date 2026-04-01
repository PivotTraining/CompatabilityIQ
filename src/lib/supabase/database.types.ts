export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      assessment_responses: {
        Row: {
          answers: Json
          completed_at: string
          dimension_id: string
          id: string
          scores: Json | null
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string
          dimension_id: string
          id?: string
          scores?: Json | null
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          dimension_id?: string
          id?: string
          scores?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessment_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_blocked_id_fkey"
            columns: ["blocked_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_blocker_id_fkey"
            columns: ["blocker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dimension_scores: {
        Row: {
          computed_at: string
          dimension_id: string
          id: string
          overall_score: number
          sub_scale_scores: Json
          user_id: string
        }
        Insert: {
          computed_at?: string
          dimension_id: string
          id?: string
          overall_score?: number
          sub_scale_scores?: Json
          user_id: string
        }
        Update: {
          computed_at?: string
          dimension_id?: string
          id?: string
          overall_score?: number
          sub_scale_scores?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dimension_scores_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          cis_score: number | null
          dimension_scores: Json | null
          id: string
          matched_at: string
          status: Database["public"]["Enums"]["match_status_type"]
          user_a_id: string
          user_b_id: string
        }
        Insert: {
          cis_score?: number | null
          dimension_scores?: Json | null
          id?: string
          matched_at?: string
          status?: Database["public"]["Enums"]["match_status_type"]
          user_a_id: string
          user_b_id: string
        }
        Update: {
          cis_score?: number | null
          dimension_scores?: Json | null
          id?: string
          matched_at?: string
          status?: Database["public"]["Enums"]["match_status_type"]
          user_a_id?: string
          user_b_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_user_a_id_fkey"
            columns: ["user_a_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_user_b_id_fkey"
            columns: ["user_b_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          id: string
          match_id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          match_id: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          match_id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          email_enabled: boolean
          push_enabled: boolean
          quiet_hours_end: string
          quiet_hours_start: string
          sms_enabled: boolean
          user_id: string
        }
        Insert: {
          email_enabled?: boolean
          push_enabled?: boolean
          quiet_hours_end?: string
          quiet_hours_start?: string
          sms_enabled?: boolean
          user_id: string
        }
        Update: {
          email_enabled?: boolean
          push_enabled?: boolean
          quiet_hours_end?: string
          quiet_hours_start?: string
          sms_enabled?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          data: Json | null
          email_sent: boolean
          id: string
          push_sent: boolean
          read: boolean
          sms_sent: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          data?: Json | null
          email_sent?: boolean
          id?: string
          push_sent?: boolean
          read?: boolean
          sms_sent?: boolean
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          data?: Json | null
          email_sent?: boolean
          id?: string
          push_sent?: boolean
          read?: boolean
          sms_sent?: boolean
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          id: string
          product_type: Database["public"]["Enums"]["payment_product_type"]
          status: Database["public"]["Enums"]["payment_status_type"]
          stripe_payment_intent_id: string | null
          stripe_subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          id?: string
          product_type: Database["public"]["Enums"]["payment_product_type"]
          status?: Database["public"]["Enums"]["payment_status_type"]
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          id?: string
          product_type?: Database["public"]["Enums"]["payment_product_type"]
          status?: Database["public"]["Enums"]["payment_status_type"]
          stripe_payment_intent_id?: string | null
          stripe_subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assessment_completed: boolean
          assessment_completed_at: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string
          gender_identity: Database["public"]["Enums"]["gender_identity"] | null
          id: string
          interested_in:
            | Database["public"]["Enums"]["interested_in_type"]
            | null
          location_city: string | null
          location_state: string | null
          mode: string
          photo_urls: string[] | null
          relationship_goal:
            | Database["public"]["Enums"]["relationship_goal_type"]
            | null
          sexual_orientation:
            | Database["public"]["Enums"]["sexual_orientation_type"]
            | null
          stripe_customer_id: string | null
          subscription_tier: Database["public"]["Enums"]["subscription_tier_type"]
          updated_at: string
          verification_selfie_url: string | null
          verification_status: "unverified" | "pending" | "verified" | "rejected"
        }
        Insert: {
          assessment_completed?: boolean
          assessment_completed_at?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          id: string
          interested_in?:
            | Database["public"]["Enums"]["interested_in_type"]
            | null
          location_city?: string | null
          location_state?: string | null
          mode?: string
          photo_urls?: string[] | null
          relationship_goal?:
            | Database["public"]["Enums"]["relationship_goal_type"]
            | null
          sexual_orientation?:
            | Database["public"]["Enums"]["sexual_orientation_type"]
            | null
          stripe_customer_id?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier_type"]
          updated_at?: string
          verification_selfie_url?: string | null
          verification_status?: "unverified" | "pending" | "verified" | "rejected"
        }
        Update: {
          assessment_completed?: boolean
          assessment_completed_at?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string
          gender_identity?:
            | Database["public"]["Enums"]["gender_identity"]
            | null
          id?: string
          interested_in?:
            | Database["public"]["Enums"]["interested_in_type"]
            | null
          location_city?: string | null
          location_state?: string | null
          mode?: string
          photo_urls?: string[] | null
          relationship_goal?:
            | Database["public"]["Enums"]["relationship_goal_type"]
            | null
          sexual_orientation?:
            | Database["public"]["Enums"]["sexual_orientation_type"]
            | null
          stripe_customer_id?: string | null
          subscription_tier?: Database["public"]["Enums"]["subscription_tier_type"]
          updated_at?: string
          verification_selfie_url?: string | null
          verification_status?: "unverified" | "pending" | "verified" | "rejected"
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: Database["public"]["Enums"]["report_reason_type"]
          reported_user_id: string
          reporter_id: string
          status: Database["public"]["Enums"]["report_status_type"]
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: Database["public"]["Enums"]["report_reason_type"]
          reported_user_id: string
          reporter_id: string
          status?: Database["public"]["Enums"]["report_status_type"]
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: Database["public"]["Enums"]["report_reason_type"]
          reported_user_id?: string
          reporter_id?: string
          status?: Database["public"]["Enums"]["report_status_type"]
        }
        Relationships: [
          {
            foreignKeyName: "reports_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      resonance_reports: {
        Row: {
          generated_at: string
          id: string
          match_id: string
          purchased_by: string
          report_data: Json
          stripe_payment_intent_id: string | null
        }
        Insert: {
          generated_at?: string
          id?: string
          match_id: string
          purchased_by: string
          report_data?: Json
          stripe_payment_intent_id?: string | null
        }
        Update: {
          generated_at?: string
          id?: string
          match_id?: string
          purchased_by?: string
          report_data?: Json
          stripe_payment_intent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resonance_reports_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resonance_reports_purchased_by_fkey"
            columns: ["purchased_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referee_id: string | null
          code: string
          status: "pending" | "signed_up" | "completed" | "rewarded"
          reward_claimed: boolean
          created_at: string
          converted_at: string | null
        }
        Insert: {
          id?: string
          referrer_id: string
          referee_id?: string | null
          code: string
          status?: "pending" | "signed_up" | "completed" | "rewarded"
          reward_claimed?: boolean
          created_at?: string
          converted_at?: string | null
        }
        Update: {
          id?: string
          referrer_id?: string
          referee_id?: string | null
          code?: string
          status?: "pending" | "signed_up" | "completed" | "rewarded"
          reward_claimed?: boolean
          created_at?: string
          converted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      self_discovery_reports: {
        Row: {
          generated_at: string
          id: string
          report_data: Json
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          generated_at?: string
          id?: string
          report_data?: Json
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          generated_at?: string
          id?: string
          report_data?: Json
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "self_discovery_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_compatibility: {
        Args: { user_a_uuid: string; user_b_uuid: string }
        Returns: {
          dimension_id: string
          overall_score: number
          sub_scale_scores: Json
          user_id: string
        }[]
      }
      get_user_resonances: {
        Args: { user_uuid: string }
        Returns: {
          bio: string
          cis_score: number
          date_of_birth: string
          dimension_scores: Json
          first_name: string
          gender_identity: Database["public"]["Enums"]["gender_identity"]
          location_city: string
          location_state: string
          match_id: string
          matched_at: string
          other_user_id: string
          photo_urls: string[]
          status: Database["public"]["Enums"]["match_status_type"]
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      content_type: "text" | "emoji"
      gender_identity: "woman" | "man" | "nonbinary" | "self_describe"
      interested_in_type: "women" | "men" | "everyone" | "self_describe"
      match_status_type: "pending" | "active" | "unmatched" | "blocked"
      notification_type:
        | "new_resonance"
        | "new_message"
        | "report_available"
        | "assessment_reminder"
        | "weekly_digest"
      payment_product_type:
        | "resonance_report"
        | "ciq_pro"
        | "founding_member"
        | "self_discovery_report"
      payment_status_type: "pending" | "succeeded" | "failed" | "refunded"
      relationship_goal_type: "long_term" | "marriage" | "fun" | "not_sure"
      report_reason_type:
        | "harassment"
        | "inappropriate"
        | "fake_profile"
        | "spam"
        | "other"
      report_status_type: "pending" | "reviewed" | "action_taken" | "dismissed"
      sexual_orientation_type:
        | "straight"
        | "gay"
        | "lesbian"
        | "bisexual"
        | "pansexual"
        | "queer"
        | "asexual"
        | "demisexual"
        | "other"
      subscription_tier_type: "free" | "pro" | "founding_member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_type: ["text", "emoji"],
      gender_identity: ["woman", "man", "nonbinary", "self_describe"],
      interested_in_type: ["women", "men", "everyone", "self_describe"],
      match_status_type: ["pending", "active", "unmatched", "blocked"],
      notification_type: [
        "new_resonance",
        "new_message",
        "report_available",
        "assessment_reminder",
        "weekly_digest",
      ],
      payment_product_type: [
        "resonance_report",
        "ciq_pro",
        "founding_member",
        "self_discovery_report",
      ],
      payment_status_type: ["pending", "succeeded", "failed", "refunded"],
      relationship_goal_type: ["long_term", "marriage", "fun", "not_sure"],
      report_reason_type: [
        "harassment",
        "inappropriate",
        "fake_profile",
        "spam",
        "other",
      ],
      report_status_type: ["pending", "reviewed", "action_taken", "dismissed"],
      sexual_orientation_type: [
        "straight",
        "gay",
        "lesbian",
        "bisexual",
        "pansexual",
        "queer",
        "asexual",
        "demisexual",
        "other",
      ],
      subscription_tier_type: ["free", "pro", "founding_member"],
    },
  },
} as const
