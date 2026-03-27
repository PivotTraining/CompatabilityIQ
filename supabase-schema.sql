-- ╔══════════════════════════════════════════════════════════════╗
-- ║  CompatibleIQ™ — Database Schema                           ║
-- ║  Pivot Training & Development                              ║
-- ║  Full RLS security on every table                          ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ═══ EXTENSIONS ═══
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ═══════════════════════════════════════════
-- TABLE: profiles
-- ═══════════════════════════════════════════
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male','female','non_binary','other')),
  orientation TEXT CHECK (orientation IN ('straight','gay','lesbian','bisexual','pansexual','asexual','other')),
  bio TEXT DEFAULT '' CHECK (char_length(bio) <= 500),
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  location_city TEXT,
  location_state TEXT,
  assessment_progress INTEGER DEFAULT 0 CHECK (assessment_progress BETWEEN 0 AND 6),
  cis_score NUMERIC(5,2),
  cis_tier TEXT CHECK (cis_tier IS NULL OR cis_tier IN ('rare','synergistic','compatible','misaligned')),
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_verified BOOLEAN DEFAULT false NOT NULL,
  last_active_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  search_min_age INTEGER DEFAULT 18 CHECK (search_min_age >= 18),
  search_max_age INTEGER DEFAULT 99 CHECK (search_max_age <= 99),
  search_max_distance INTEGER DEFAULT 50 CHECK (search_max_distance BETWEEN 1 AND 200),
  search_genders TEXT[] DEFAULT '{}'
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_select_others" ON profiles
  FOR SELECT USING (
    is_active = true
    AND assessment_progress >= 1
    AND id != auth.uid()
  );

CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ═══════════════════════════════════════════
-- TABLE: photos
-- ═══════════════════════════════════════════
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position BETWEEN 0 AND 5),
  is_primary BOOLEAN DEFAULT false NOT NULL,
  is_approved BOOLEAN DEFAULT true NOT NULL,
  moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, position)
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "photos_own" ON photos
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "photos_view_approved" ON photos
  FOR SELECT USING (is_approved = true);

CREATE INDEX idx_photos_user ON photos(user_id);


-- ═══════════════════════════════════════════
-- TABLE: assessment_responses (ENCRYPTED)
-- Raw answers — NO client SELECT access
-- ═══════════════════════════════════════════
CREATE TABLE assessment_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module INTEGER NOT NULL CHECK (module BETWEEN 1 AND 6),
  encrypted_responses BYTEA NOT NULL,
  response_hash TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  ip_address INET,
  UNIQUE(user_id, module)
);

ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;

-- Users can submit their own responses (INSERT only)
CREATE POLICY "assessment_insert_own" ON assessment_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can re-take (UPDATE own only)
CREATE POLICY "assessment_update_own" ON assessment_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- NO SELECT policy for authenticated users → raw data unreachable from client
-- Edge Functions use service_role key to read

CREATE INDEX idx_assessment_user_module ON assessment_responses(user_id, module);


-- ═══════════════════════════════════════════
-- TABLE: computed_scores
-- Server-computed quotient scores
-- ═══════════════════════════════════════════
CREATE TABLE computed_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Core Quotients (Layer 1) — normalized 0.0 to 1.0
  vq NUMERIC(5,4), aq NUMERIC(5,4), eq NUMERIC(5,4), cq NUMERIC(5,4),
  nq NUMERIC(5,4), lq_give NUMERIC(5,4), lq_receive NUMERIC(5,4),
  gq NUMERIC(5,4), csq NUMERIC(5,4),
  -- Financial Domains (Layer 2)
  fmi NUMERIC(5,4), fsb NUMERIC(5,4), fpl NUMERIC(5,4),
  fiq NUMERIC(5,4), fcm NUMERIC(5,4), cdf NUMERIC(5,4),
  -- Blended scores
  core_score NUMERIC(5,2),
  fin_score NUMERIC(5,2),
  fin_net NUMERIC(5,2),
  blended NUMERIC(5,2),
  bonus NUMERIC(5,2) DEFAULT 0,
  raw_cis NUMERIC(5,2),
  final_cis NUMERIC(5,2),
  cis_tier TEXT,
  -- Metadata
  computed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  engine_version TEXT DEFAULT '1.0' NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE computed_scores ENABLE ROW LEVEL SECURITY;

-- Users can see their OWN scores only
CREATE POLICY "scores_select_own" ON computed_scores
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role writes scores (Edge Functions)
-- No INSERT/UPDATE policies for authenticated users


-- ═══════════════════════════════════════════
-- TABLE: shadow_profiles (ISOLATED)
-- ZERO client-facing RLS policies
-- ═══════════════════════════════════════════
CREATE TABLE shadow_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  acc_risk NUMERIC(5,4) DEFAULT 0,
  emp_risk NUMERIC(5,4) DEFAULT 0,
  stb_risk NUMERIC(5,4) DEFAULT 0,
  saf_risk NUMERIC(5,4) DEFAULT 0,
  dep_risk NUMERIC(5,4) DEFAULT 0,
  total_penalty NUMERIC(5,2) DEFAULT 0,
  saf_hard_cap BOOLEAN DEFAULT false NOT NULL,
  -- Financial shadow flags
  fsf1_risk NUMERIC(5,4) DEFAULT 0,
  fsf2_risk NUMERIC(5,4) DEFAULT 0,
  fsf3_risk NUMERIC(5,4) DEFAULT 0,
  fsf4_risk NUMERIC(5,4) DEFAULT 0,
  fsf5_risk NUMERIC(5,4) DEFAULT 0,
  fin_shadow_penalty NUMERIC(5,2) DEFAULT 0,
  computed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE shadow_profiles ENABLE ROW LEVEL SECURITY;

-- ⚠️ NO POLICIES FOR AUTHENTICATED USERS
-- Shadow data is INVISIBLE to all client-side queries
-- Only service_role (Edge Functions) can read/write


-- ═══════════════════════════════════════════
-- TABLE: interactions
-- ═══════════════════════════════════════════
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('connect','dismiss')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, target_id),
  CHECK (user_id != target_id)
);

ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "interactions_own" ON interactions
  FOR ALL USING (auth.uid() = user_id);

-- Allow reading interactions targeting you (for mutual match check)
CREATE POLICY "interactions_targeting_me" ON interactions
  FOR SELECT USING (auth.uid() = target_id AND action = 'connect');

CREATE INDEX idx_interactions_user ON interactions(user_id);
CREATE INDEX idx_interactions_target ON interactions(target_id);


-- ═══════════════════════════════════════════
-- TABLE: matches
-- ═══════════════════════════════════════════
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  match_cis NUMERIC(5,2),
  match_tier TEXT CHECK (match_tier IS NULL OR match_tier IN ('rare','synergistic','compatible','misaligned')),
  top_domains TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  UNIQUE(user_a_id, user_b_id),
  CHECK (user_a_id < user_b_id)
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "matches_own" ON matches
  FOR SELECT USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

CREATE INDEX idx_matches_user_a ON matches(user_a_id) WHERE is_active = true;
CREATE INDEX idx_matches_user_b ON matches(user_b_id) WHERE is_active = true;


-- ═══════════════════════════════════════════
-- TABLE: messages
-- ═══════════════════════════════════════════
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_read_own_matches" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = messages.match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
        AND m.is_active = true
    )
  );

CREATE POLICY "messages_send_own_matches" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
        AND m.is_active = true
    )
  );

-- Allow marking messages as read
CREATE POLICY "messages_mark_read" ON messages
  FOR UPDATE USING (
    sender_id != auth.uid()
    AND EXISTS (
      SELECT 1 FROM matches m
      WHERE m.id = messages.match_id
        AND (m.user_a_id = auth.uid() OR m.user_b_id = auth.uid())
    )
  )
  WITH CHECK (is_read = true);

CREATE INDEX idx_messages_match ON messages(match_id, created_at DESC);
CREATE INDEX idx_messages_sender ON messages(sender_id);


-- ═══════════════════════════════════════════
-- TABLE: blocks
-- ═══════════════════════════════════════════
CREATE TABLE blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blocker_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "blocks_own" ON blocks
  FOR ALL USING (auth.uid() = blocker_id);

-- Let users see if they've been blocked (for filtering)
CREATE POLICY "blocks_check_blocked" ON blocks
  FOR SELECT USING (auth.uid() = blocked_id);

CREATE INDEX idx_blocks_blocker ON blocks(blocker_id);
CREATE INDEX idx_blocks_blocked ON blocks(blocked_id);


-- ═══════════════════════════════════════════
-- TABLE: reports
-- ═══════════════════════════════════════════
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES profiles(id),
  reported_id UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL CHECK (reason IN ('inappropriate','harassment','fake_profile','spam','other')),
  details TEXT CHECK (details IS NULL OR char_length(details) <= 1000),
  match_id UUID REFERENCES matches(id),
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending','reviewed','action_taken','dismissed')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CHECK (reporter_id != reported_id)
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_create_own" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Users cannot read reports (admin only via service role)


-- ═══════════════════════════════════════════
-- TABLE: audit_log (SERVICE ROLE ONLY)
-- ═══════════════════════════════════════════
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
-- NO policies — service role only

CREATE INDEX idx_audit_user ON audit_log(user_id);
CREATE INDEX idx_audit_action ON audit_log(action);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);


-- ═══════════════════════════════════════════
-- TABLE: purchases (future monetization)
-- ═══════════════════════════════════════════
CREATE TABLE purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  product_type TEXT NOT NULL CHECK (product_type IN ('boost','peek','rewind','radius','report','subscription')),
  stripe_payment_id TEXT,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  currency TEXT DEFAULT 'usd' NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending','completed','refunded','failed')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "purchases_own" ON purchases
  FOR SELECT USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════
-- TABLE: subscriptions (future monetization)
-- ═══════════════════════════════════════════
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT DEFAULT 'plus' NOT NULL,
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active','canceled','past_due','trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_own" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════
-- TRIGGERS
-- ═══════════════════════════════════════════

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Mutual match detection
CREATE OR REPLACE FUNCTION check_mutual_match()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'connect' THEN
    IF EXISTS (
      SELECT 1 FROM interactions
      WHERE user_id = NEW.target_id
        AND target_id = NEW.user_id
        AND action = 'connect'
    ) THEN
      INSERT INTO matches (user_a_id, user_b_id)
      VALUES (
        LEAST(NEW.user_id, NEW.target_id),
        GREATEST(NEW.user_id, NEW.target_id)
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_interaction_created
  AFTER INSERT ON interactions
  FOR EACH ROW EXECUTE FUNCTION check_mutual_match();

-- Block deactivates match
CREATE OR REPLACE FUNCTION handle_block()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE matches SET is_active = false
  WHERE (
    (user_a_id = NEW.blocker_id AND user_b_id = NEW.blocked_id)
    OR (user_a_id = NEW.blocked_id AND user_b_id = NEW.blocker_id)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_block_created
  AFTER INSERT ON blocks
  FOR EACH ROW EXECUTE FUNCTION handle_block();

-- Audit logging helper
CREATE OR REPLACE FUNCTION log_audit(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_log (user_id, action, resource_type, resource_id, metadata)
  VALUES (p_user_id, p_action, p_resource_type, p_resource_id, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ═══════════════════════════════════════════
-- ENABLE REALTIME (for messages)
-- ═══════════════════════════════════════════
-- Run in Supabase Dashboard:
-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;
