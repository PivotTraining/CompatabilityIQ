-- Add cultural_background column to profiles for demographic question routing
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_background TEXT;
