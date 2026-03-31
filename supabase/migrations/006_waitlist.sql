-- Waitlist table for pre-launch email capture
-- Uses DO block to handle case where table/type already exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'waitlist'
  ) THEN
    CREATE TABLE waitlist (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      first_name TEXT,
      source TEXT DEFAULT 'homepage',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "No public access" ON waitlist
      FOR ALL
      USING (false);
  END IF;
END $$;
