-- CompatibleIQ -- Self-Discovery Mode Migration
-- Adds mode column to profiles and creates self_discovery_reports table

-- Add mode column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mode TEXT NOT NULL DEFAULT 'dating' CHECK (mode IN ('dating', 'self_discovery'));

-- Create self_discovery_reports table
CREATE TABLE IF NOT EXISTS self_discovery_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  report_data JSONB NOT NULL DEFAULT '{}',
  stripe_payment_intent_id TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unique_user_report UNIQUE (user_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_self_discovery_reports_user_id ON self_discovery_reports(user_id);

-- Index for mode-based queries (e.g. excluding self_discovery users from match pool)
CREATE INDEX IF NOT EXISTS idx_profiles_mode ON profiles(mode);

-- RLS policies for self_discovery_reports
ALTER TABLE self_discovery_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own self-discovery reports"
  ON self_discovery_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self-discovery reports"
  ON self_discovery_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self-discovery reports"
  ON self_discovery_reports FOR UPDATE
  USING (auth.uid() = user_id);
