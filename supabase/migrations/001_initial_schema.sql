-- ╔══════════════════════════════════════════════════════════════════════╗
-- ║  CompatibleIQ™ — Initial Database Schema                          ║
-- ║  Pivot Training & Development                                     ║
-- ║  Migration 001: Complete schema with RLS, indexes, and functions   ║
-- ╚══════════════════════════════════════════════════════════════════════╝

-- ═══════════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for future text search on bios


-- ═══════════════════════════════════════════
-- ENUM TYPES
-- ═══════════════════════════════════════════

CREATE TYPE gender_identity AS ENUM ('woman', 'man', 'nonbinary', 'self_describe');
CREATE TYPE interested_in_type AS ENUM ('women', 'men', 'everyone', 'self_describe');
CREATE TYPE sexual_orientation_type AS ENUM (
  'straight', 'gay', 'lesbian', 'bisexual', 'pansexual', 'queer', 'asexual', 'demisexual', 'other'
);
CREATE TYPE relationship_goal_type AS ENUM ('long_term', 'marriage', 'fun', 'not_sure');
CREATE TYPE subscription_tier_type AS ENUM ('free', 'pro', 'founding_member');
CREATE TYPE match_status_type AS ENUM ('pending', 'active', 'unmatched', 'blocked');
CREATE TYPE content_type AS ENUM ('text', 'emoji');
CREATE TYPE report_reason_type AS ENUM ('harassment', 'inappropriate', 'fake_profile', 'spam', 'other');
CREATE TYPE report_status_type AS ENUM ('pending', 'reviewed', 'action_taken', 'dismissed');
CREATE TYPE payment_product_type AS ENUM ('resonance_report', 'ciq_pro', 'founding_member');
CREATE TYPE payment_status_type AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE notification_type AS ENUM (
  'new_resonance', 'new_message', 'report_available', 'assessment_reminder', 'weekly_digest'
);


-- ═══════════════════════════════════════════
-- UTILITY: updated_at trigger function
-- ═══════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: profiles
-- Core user profile, linked 1:1 with auth.users
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE profiles (
  id                     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name             TEXT NOT NULL DEFAULT '',
  location_city          TEXT,
  location_state         TEXT,
  gender_identity        gender_identity,
  interested_in          interested_in_type,
  sexual_orientation     sexual_orientation_type,
  relationship_goal      relationship_goal_type,
  bio                    TEXT DEFAULT '' CHECK (char_length(bio) <= 500),
  photo_urls             TEXT[] DEFAULT '{}' CHECK (array_length(photo_urls, 1) IS NULL OR array_length(photo_urls, 1) <= 6),
  date_of_birth          DATE,
  assessment_completed   BOOLEAN NOT NULL DEFAULT false,
  assessment_completed_at TIMESTAMPTZ,
  subscription_tier      subscription_tier_type NOT NULL DEFAULT 'free',
  stripe_customer_id     TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can always read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can see other profiles that have completed assessment (for discovery)
CREATE POLICY "profiles_select_others" ON profiles
  FOR SELECT USING (
    id != auth.uid()
    AND assessment_completed = true
  );

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: assessment_responses
-- Raw assessment answers per dimension (6 dimensions total)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE assessment_responses (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dimension_id  TEXT NOT NULL CHECK (dimension_id IN (
    'values', 'attachment', 'communication',
    'emotional_intelligence', 'lifestyle', 'love_languages'
  )),
  answers       JSONB NOT NULL DEFAULT '{}',
  scores        JSONB DEFAULT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, dimension_id)
);

ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_responses_select_own" ON assessment_responses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "assessment_responses_insert_own" ON assessment_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "assessment_responses_update_own" ON assessment_responses
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_assessment_responses_user ON assessment_responses(user_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: dimension_scores
-- Computed sub-scale and overall scores per dimension per user
-- Written by the CIS scoring engine (Edge Functions, service_role)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE dimension_scores (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  dimension_id      TEXT NOT NULL,
  sub_scale_scores  JSONB NOT NULL DEFAULT '{}',
  overall_score     DOUBLE PRECISION NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  computed_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, dimension_id)
);

ALTER TABLE dimension_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dimension_scores_select_own" ON dimension_scores
  FOR SELECT USING (auth.uid() = user_id);

-- No INSERT/UPDATE policies for authenticated users; service_role writes these

CREATE INDEX idx_dimension_scores_user ON dimension_scores(user_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: matches (Resonances)
-- Stores pairwise compatibility between users
-- user_a_id < user_b_id enforced to avoid duplicates
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE matches (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cis_score         DOUBLE PRECISION CHECK (cis_score IS NULL OR (cis_score >= 0 AND cis_score <= 100)),
  dimension_scores  JSONB DEFAULT '{}',
  status            match_status_type NOT NULL DEFAULT 'pending',
  matched_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_a_id, user_b_id),
  CHECK (user_a_id < user_b_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_select_own" ON matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE POLICY "matches_update_own" ON matches
  FOR UPDATE USING (auth.uid() = user_a_id OR auth.uid() = user_b_id)
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE INDEX idx_matches_user_a ON matches(user_a_id);
CREATE INDEX idx_matches_user_b ON matches(user_b_id);
CREATE INDEX idx_matches_cis_score ON matches(cis_score DESC);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: resonance_reports
-- Purchasable deep-dive compatibility reports
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE resonance_reports (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id                 UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  purchased_by             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  report_data              JSONB NOT NULL DEFAULT '{}',
  generated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE resonance_reports ENABLE ROW LEVEL SECURITY;

-- The purchaser can always see the report
CREATE POLICY "resonance_reports_select_purchaser" ON resonance_reports
  FOR SELECT USING (auth.uid() = purchased_by);

-- The other participant in the match can also see the report
CREATE POLICY "resonance_reports_select_match_participant" ON resonance_reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = resonance_reports.match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
    )
  );

CREATE INDEX idx_resonance_reports_match ON resonance_reports(match_id);
CREATE INDEX idx_resonance_reports_purchaser ON resonance_reports(purchased_by);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: messages
-- Real-time chat between matched users
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE messages (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id      UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content       TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  content_type  content_type NOT NULL DEFAULT 'text',
  read_at       TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can read messages in matches they belong to
CREATE POLICY "messages_select_own_matches" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = messages.match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
    )
  );

-- Users can send messages in matches they belong to
CREATE POLICY "messages_insert_own_matches" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
        AND m.status = 'active'
    )
  );

-- Users can mark messages as read (only messages they received)
CREATE POLICY "messages_update_read" ON messages
  FOR UPDATE USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = messages.match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
    )
  )
  WITH CHECK (read_at IS NOT NULL);

CREATE INDEX idx_messages_match_created ON messages(match_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: reports (user safety reports)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE reports (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id       UUID NOT NULL REFERENCES profiles(id),
  reported_user_id  UUID NOT NULL REFERENCES profiles(id),
  reason            report_reason_type NOT NULL,
  details           TEXT CHECK (details IS NULL OR char_length(details) <= 1000),
  status            report_status_type NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (reporter_id != reported_user_id)
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can create reports
CREATE POLICY "reports_insert_own" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users can view their own submitted reports
CREATE POLICY "reports_select_own" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- No public UPDATE/DELETE — admin only via service_role


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: blocks
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE blocks (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocks_insert_own" ON blocks
  FOR INSERT WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "blocks_select_own" ON blocks
  FOR SELECT USING (auth.uid() = blocker_id);

CREATE POLICY "blocks_delete_own" ON blocks
  FOR DELETE USING (auth.uid() = blocker_id);

CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: payments
-- All Stripe transactions (one-time and subscription)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE payments (
  id                       UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id   TEXT,
  product_type             payment_product_type NOT NULL,
  amount_cents             INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency                 TEXT NOT NULL DEFAULT 'usd',
  status                   payment_status_type NOT NULL DEFAULT 'pending',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "payments_select_own" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- No client INSERT/UPDATE — Stripe webhooks via service_role only

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe_pi ON payments(stripe_payment_intent_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: notifications
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE notifications (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        notification_type NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB DEFAULT '{}',
  read        BOOLEAN NOT NULL DEFAULT false,
  push_sent   BOOLEAN NOT NULL DEFAULT false,
  email_sent  BOOLEAN NOT NULL DEFAULT false,
  sms_sent    BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, read, created_at DESC);


-- ═══════════════════════════════════════════════════════════════════════
-- TABLE: notification_preferences
-- Per-user notification settings (1:1 with profiles)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE notification_preferences (
  user_id           UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  push_enabled      BOOLEAN NOT NULL DEFAULT true,
  email_enabled     BOOLEAN NOT NULL DEFAULT true,
  sms_enabled       BOOLEAN NOT NULL DEFAULT false,
  quiet_hours_start TIME NOT NULL DEFAULT '22:00',
  quiet_hours_end   TIME NOT NULL DEFAULT '08:00'
);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_preferences_select_own" ON notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notification_preferences_insert_own" ON notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notification_preferences_update_own" ON notification_preferences
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════════════════════════════════

-- Auto-create profile + notification_preferences on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  INSERT INTO notification_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- When a block is created, set the match status to 'blocked'
CREATE OR REPLACE FUNCTION handle_block()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE matches SET status = 'blocked'
  WHERE (
    (user_a_id = LEAST(NEW.blocker_id, NEW.blocked_id) AND user_b_id = GREATEST(NEW.blocker_id, NEW.blocked_id))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_block_created
  AFTER INSERT ON blocks
  FOR EACH ROW EXECUTE FUNCTION handle_block();

-- Mark profile as assessment_completed when all 6 dimensions are done
CREATE OR REPLACE FUNCTION check_assessment_completion()
RETURNS TRIGGER AS $$
DECLARE
  dimension_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT dimension_id) INTO dimension_count
  FROM assessment_responses
  WHERE user_id = NEW.user_id;

  IF dimension_count >= 6 THEN
    UPDATE profiles
    SET assessment_completed = true,
        assessment_completed_at = now()
    WHERE id = NEW.user_id
      AND assessment_completed = false;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_assessment_response_upsert
  AFTER INSERT OR UPDATE ON assessment_responses
  FOR EACH ROW EXECUTE FUNCTION check_assessment_completion();


-- ═══════════════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════

-- get_user_resonances: Returns all active matches for a user with
-- the other person's profile data joined in.
CREATE OR REPLACE FUNCTION get_user_resonances(user_uuid UUID)
RETURNS TABLE (
  match_id         UUID,
  cis_score        DOUBLE PRECISION,
  dimension_scores JSONB,
  status           match_status_type,
  matched_at       TIMESTAMPTZ,
  other_user_id    UUID,
  first_name       TEXT,
  bio              TEXT,
  photo_urls       TEXT[],
  location_city    TEXT,
  location_state   TEXT,
  gender_identity  gender_identity,
  date_of_birth    DATE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    m.id           AS match_id,
    m.cis_score,
    m.dimension_scores,
    m.status,
    m.matched_at,
    p.id           AS other_user_id,
    p.first_name,
    p.bio,
    p.photo_urls,
    p.location_city,
    p.location_state,
    p.gender_identity,
    p.date_of_birth
  FROM matches m
  JOIN profiles p ON p.id = CASE
    WHEN m.user_a_id = user_uuid THEN m.user_b_id
    ELSE m.user_a_id
  END
  WHERE (m.user_a_id = user_uuid OR m.user_b_id = user_uuid)
    AND m.status = 'active'
  ORDER BY m.cis_score DESC NULLS LAST;
$$;


-- check_compatibility: Returns dimension scores for both users.
-- Used by the CIS scoring algorithm in Edge Functions.
CREATE OR REPLACE FUNCTION check_compatibility(user_a_uuid UUID, user_b_uuid UUID)
RETURNS TABLE (
  user_id          UUID,
  dimension_id     TEXT,
  sub_scale_scores JSONB,
  overall_score    DOUBLE PRECISION
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    ds.user_id,
    ds.dimension_id,
    ds.sub_scale_scores,
    ds.overall_score
  FROM dimension_scores ds
  WHERE ds.user_id IN (user_a_uuid, user_b_uuid)
  ORDER BY ds.user_id, ds.dimension_id;
$$;


-- ═══════════════════════════════════════════════════════════════════════
-- REALTIME
-- Enable realtime for messages and notifications
-- ═══════════════════════════════════════════════════════════════════════

-- Note: Run these in the Supabase Dashboard if publication doesn't exist yet:
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
-- ALTER PUBLICATION supabase_realtime ADD TABLE matches;
