// @ts-nocheck
import { getSupabaseServerClient } from '@/lib/supabase/server'

const SIGNED_URL_EXPIRY = 3600 // 1 hour in seconds

/**
 * Generate a signed URL for a photo stored in Supabase Storage.
 * Returns null if the URL cannot be generated (e.g., file deleted or invalid path).
 */
export async function getSignedPhotoUrl(path: string): Promise<string | null> {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) return null

    const { data, error } = await supabase.storage
      .from('photos')
      .createSignedUrl(path, SIGNED_URL_EXPIRY)

    if (error) {
      console.error(`Failed to generate signed URL for ${path}:`, error.message)
      return null
    }

    return data.signedUrl
  } catch (err) {
    console.error('getSignedPhotoUrl error:', err)
    return null
  }
}

/**
 * Refresh all signed URLs for a user's photos.
 * Returns an array of { path, signedUrl } objects.
 * Expired or invalid paths will have signedUrl set to null.
 */
export async function refreshPhotoUrls(
  userId: string
): Promise<{ path: string; signedUrl: string | null }[]> {
  try {
    const supabase = await getSupabaseServerClient()
    if (!supabase) return []

    // Fetch the user's photo paths from their profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('photo_urls')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Failed to fetch profile for photo refresh:', profileError?.message)
      return []
    }

    const photoPaths: string[] = profile.photo_urls ?? []

    if (photoPaths.length === 0) return []

    // Generate signed URLs in batch
    const { data: signedUrls, error: batchError } = await supabase.storage
      .from('photos')
      .createSignedUrls(photoPaths, SIGNED_URL_EXPIRY)

    if (batchError) {
      console.error('Batch signed URL generation failed:', batchError.message)
      // Fall back to individual generation
      const results = await Promise.all(
        photoPaths.map(async (path) => ({
          path,
          signedUrl: await getSignedPhotoUrl(path),
        }))
      )
      return results
    }

    // Map batch results back to paths
    return photoPaths.map((path, index) => ({
      path,
      signedUrl: signedUrls?.[index]?.signedUrl ?? null,
    }))
  } catch (err) {
    console.error('refreshPhotoUrls error:', err)
    return []
  }
}
