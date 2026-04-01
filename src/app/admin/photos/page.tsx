import { getSupabaseServiceClient } from '@/lib/supabase/server'
import { ImageIcon } from 'lucide-react'
import PhotoModerationGrid from './PhotoModerationGrid'

const SIGNED_URL_EXPIRY = 3600 // 1 hour

interface PhotoRow {
  id: string
  user_id: string
  storage_path: string
  moderation_status: string
  created_at: string
}

interface ProfileRow {
  first_name: string
}

async function getPendingPhotos() {
  const supabase = await getSupabaseServiceClient()
  if (!supabase) return []

  // Fetch all photos with pending moderation status, joined with profile for first name
  const { data: photos, error } = await supabase
    .from('photos')
    .select('id, user_id, storage_path, moderation_status, created_at')
    .eq('moderation_status', 'pending')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch pending photos:', error.message)
    return []
  }

  if (!photos || photos.length === 0) return []

  const typedPhotos = photos as unknown as PhotoRow[]

  // Gather unique user IDs to fetch names
  const userIds = [...new Set(typedPhotos.map((p) => p.user_id))]

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name')
    .in('id', userIds)

  if (profileError) {
    console.error('Failed to fetch profiles:', profileError.message)
  }

  const profileMap = new Map<string, string>()
  for (const profile of (profiles ?? []) as unknown as (ProfileRow & { id: string })[]) {
    profileMap.set(profile.id, profile.first_name)
  }

  // Generate signed URLs for all photo storage paths
  const storagePaths = typedPhotos.map((p) => p.storage_path)
  const { data: signedUrls, error: urlError } = await supabase.storage
    .from('photos')
    .createSignedUrls(storagePaths, SIGNED_URL_EXPIRY)

  if (urlError) {
    console.error('Failed to generate signed URLs:', urlError.message)
  }

  const urlMap = new Map<string, string>()
  if (signedUrls) {
    storagePaths.forEach((path, index) => {
      const signed = signedUrls[index]?.signedUrl
      if (signed) {
        urlMap.set(path, signed)
      }
    })
  }

  return typedPhotos.map((photo) => ({
    id: photo.id,
    firstName: profileMap.get(photo.user_id) ?? 'Unknown',
    uploadedAt: photo.created_at,
    signedUrl: urlMap.get(photo.storage_path) ?? null,
  }))
}

export default async function AdminPhotosPage() {
  const pendingPhotos = await getPendingPhotos()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ImageIcon className="w-6 h-6" style={{ color: '#7B68B5' }} />
          <h1 className="text-2xl font-bold text-gray-900">Photo Moderation</h1>
        </div>
        <p className="text-sm text-gray-500">
          Review and approve or reject user-uploaded photos.
        </p>
      </div>

      <PhotoModerationGrid initialPhotos={pendingPhotos} />
    </div>
  )
}
