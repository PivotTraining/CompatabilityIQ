// CompatibleIQ™ — Supabase Database Types
// Re-exports from auto-generated types (npx supabase gen types typescript)

export type { Database, Json } from './database.types'
export { Constants } from './database.types'

import type { Database } from './database.types'

// ═══════════════════════════════════════════
// Convenience Aliases — Table Rows
// ═══════════════════════════════════════════

type Tables = Database['public']['Tables']

export type Profile = Tables['profiles']['Row']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileUpdate = Tables['profiles']['Update']

export type AssessmentResponse = Tables['assessment_responses']['Row']
export type AssessmentResponseInsert = Tables['assessment_responses']['Insert']

export type DimensionScore = Tables['dimension_scores']['Row']
export type DimensionScoreInsert = Tables['dimension_scores']['Insert']

export type Match = Tables['matches']['Row']
export type MatchInsert = Tables['matches']['Insert']

export type ResonanceReport = Tables['resonance_reports']['Row']
export type ResonanceReportInsert = Tables['resonance_reports']['Insert']

export type Message = Tables['messages']['Row']
export type MessageInsert = Tables['messages']['Insert']

export type Report = Tables['reports']['Row']
export type ReportInsert = Tables['reports']['Insert']

export type Block = Tables['blocks']['Row']
export type BlockInsert = Tables['blocks']['Insert']

export type Payment = Tables['payments']['Row']
export type PaymentInsert = Tables['payments']['Insert']

export type Notification = Tables['notifications']['Row']
export type NotificationInsert = Tables['notifications']['Insert']

export type NotificationPreference = Tables['notification_preferences']['Row']

// ═══════════════════════════════════════════
// Convenience Aliases — Enums
// ═══════════════════════════════════════════

type Enums = Database['public']['Enums']

export type GenderIdentity = Enums['gender_identity']
export type InterestedIn = Enums['interested_in_type']
export type SexualOrientation = Enums['sexual_orientation_type']
export type RelationshipGoal = Enums['relationship_goal_type']
export type SubscriptionTier = Enums['subscription_tier_type']
export type MatchStatus = Enums['match_status_type']
export type ContentType = Enums['content_type']
export type ReportReason = Enums['report_reason_type']
export type ReportStatus = Enums['report_status_type']
export type PaymentProductType = Enums['payment_product_type']
export type PaymentStatus = Enums['payment_status_type']
export type NotificationType = Enums['notification_type']

export type DimensionId = 'values' | 'attachment' | 'communication' | 'emotional_intelligence' | 'lifestyle' | 'love_languages'
