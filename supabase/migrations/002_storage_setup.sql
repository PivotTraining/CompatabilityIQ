-- CompatibleIQ: Photo Storage Setup
-- Creates the 'photos' bucket and RLS policies for user photo uploads

-- ═══════════════════════════════════════════
-- 1. Create the photos bucket (private)
-- ═══════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'photos',
  'photos',
  false,
  10485760,  -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic'];


-- ═══════════════════════════════════════════
-- 2. RLS Policies for storage.objects
-- ═══════════════════════════════════════════

-- Policy: Users can upload photos to their own folder
CREATE POLICY "Users can upload to own folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update (overwrite) their own photos
CREATE POLICY "Users can update own photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view photos of non-blocked users
-- (Users they haven't blocked AND users who haven't blocked them)
CREATE POLICY "Users can view photos of non-blocked users"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'photos'
    AND NOT EXISTS (
      SELECT 1 FROM public.blocks
      WHERE (
        (blocker_id = auth.uid() AND blocked_id = (storage.foldername(name))[1]::uuid)
        OR
        (blocker_id = (storage.foldername(name))[1]::uuid AND blocked_id = auth.uid())
      )
    )
  );
