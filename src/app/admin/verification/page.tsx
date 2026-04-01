'use client'

import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { CheckCircle, XCircle, Clock, User, BadgeCheck } from 'lucide-react'
import Image from 'next/image'

interface VerificationRequest {
  id: string
  first_name: string
  photo_urls: string[] | null
  verification_selfie_url: string | null
  verification_status: string
  created_at: string
}

export default function AdminVerificationPage() {
  const supabase = getSupabaseBrowserClient()
  const [requests, setRequests] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [signedUrls, setSignedUrls] = useState<Record<string, { selfie: string; photos: string[] }>>({})

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    if (!supabase) return
    setLoading(true)

    const { data } = await supabase
      .from('profiles')
      .select('id, first_name, photo_urls, verification_selfie_url, verification_status, created_at')
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: true })

    const rows = (data ?? []) as unknown as VerificationRequest[]
    setRequests(rows)

    // Generate signed URLs for all selfies and profile photos
    const urlMap: Record<string, { selfie: string; photos: string[] }> = {}
    for (const req of rows) {
      const selfieUrl = req.verification_selfie_url
        ? await getSignedUrl(req.verification_selfie_url)
        : ''
      const photoUrls: string[] = []
      for (const path of req.photo_urls ?? []) {
        const url = await getSignedUrl(path)
        if (url) photoUrls.push(url)
      }
      urlMap[req.id] = { selfie: selfieUrl, photos: photoUrls }
    }
    setSignedUrls(urlMap)
    setLoading(false)
  }

  const getSignedUrl = async (path: string): Promise<string> => {
    if (!supabase) return ''
    const { data } = await supabase.storage.from('photos').createSignedUrl(path, 3600)
    return data?.signedUrl ?? ''
  }

  const handleAction = async (userId: string, action: 'verified' | 'rejected') => {
    if (!supabase) return
    setActing(userId)

    await supabase
      .from('profiles')
      .update({ verification_status: action } as never)
      .eq('id', userId)

    setRequests((prev) => prev.filter((r) => r.id !== userId))
    setActing(null)
  }

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Photo Verification</h1>
        <p className="text-sm text-gray-500 mb-8">Review pending verification selfies</p>
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BadgeCheck className="w-6 h-6" style={{ color: '#7B68B5' }} />
          <h1 className="text-2xl font-bold text-gray-900">Photo Verification</h1>
        </div>
        <p className="text-sm text-gray-500">
          Review pending verification selfies. Compare the selfie to their profile photos to confirm identity.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 inline-flex items-center gap-2">
        <Clock className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-gray-700">
          {requests.length} pending review{requests.length !== 1 ? 's' : ''}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
          <h2 className="text-lg font-semibold text-gray-900 mb-1">All caught up</h2>
          <p className="text-sm text-gray-500">No pending verification requests.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => {
            const urls = signedUrls[req.id]
            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{req.first_name}</h3>
                      <p className="text-xs text-gray-400">
                        Submitted {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Photo comparison */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Selfie */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Verification Selfie
                      </p>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 relative border border-gray-200">
                        {urls?.selfie ? (
                          <Image
                            src={urls.selfie}
                            alt="Verification selfie"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-300">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile photos */}
                    <div>
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Profile Photos
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {(urls?.photos ?? []).length > 0 ? (
                          urls.photos.map((url, i) => (
                            <div
                              key={i}
                              className="aspect-square rounded-lg overflow-hidden bg-gray-50 relative border border-gray-200"
                            >
                              <Image
                                src={url}
                                alt={`Profile photo ${i + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 aspect-square rounded-lg bg-gray-50 flex items-center justify-center border border-gray-200">
                            <p className="text-xs text-gray-400">No profile photos</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction(req.id, 'verified')}
                      disabled={acting === req.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#22C55E' }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.id, 'rejected')}
                      disabled={acting === req.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                      style={{ background: '#EF4444' }}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
