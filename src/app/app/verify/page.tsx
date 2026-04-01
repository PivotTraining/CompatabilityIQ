'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Camera, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type { VerificationStatus } from '@/lib/supabase/types'

const POSE_INSTRUCTIONS = [
  { id: 'peace', text: 'Make a peace sign next to your face', emoji: 'V' },
  { id: 'two_fingers', text: 'Hold up 2 fingers next to your face', emoji: '2' },
  { id: 'point_chin', text: 'Point to your chin with one finger', emoji: '>' },
  { id: 'thumbs_up', text: 'Give a thumbs up next to your face', emoji: '+' },
  { id: 'wave', text: 'Wave at the camera with an open hand', emoji: '~' },
]

export default function VerifyPage() {
  const { user } = useAuth()
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [status, setStatus] = useState<VerificationStatus>('unverified')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [pose] = useState(() =>
    POSE_INSTRUCTIONS[Math.floor(Math.random() * POSE_INSTRUCTIONS.length)]
  )

  useEffect(() => {
    if (!user || !supabase) return
    supabase
      .from('profiles')
      .select('verification_status')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        const row = data as { verification_status?: VerificationStatus } | null
        if (row?.verification_status) {
          setStatus(row.verification_status)
        }
        setLoading(false)
      })
  }, [user, supabase])

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelfieFile(file)
    setSelfiePreview(URL.createObjectURL(file))
  }

  const handleRetake = () => {
    if (selfiePreview) URL.revokeObjectURL(selfiePreview)
    setSelfieFile(null)
    setSelfiePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async () => {
    if (!user || !supabase || !selfieFile) return
    setSubmitting(true)

    const ext = selfieFile.name.split('.').pop() ?? 'jpg'
    const path = `${user.id}/verification-selfie.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('photos')
      .upload(path, selfieFile, { upsert: true })

    if (uploadError) {
      setSubmitting(false)
      return
    }

    await supabase
      .from('profiles')
      .update({
        verification_selfie_url: path,
        verification_status: 'pending',
      } as never)
      .eq('id', user.id)

    setSubmitting(false)
    setSubmitted(true)
    setStatus('pending')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div
          className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'var(--ciq-purple)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  // Already verified
  if (status === 'verified') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#DBEAFE', color: '#3B82F6' }}
        >
          <CheckCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          You are verified
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your profile displays a blue verification badge to other users.
        </p>
        <Link
          href="/app/profile"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Back to Profile
        </Link>
      </div>
    )
  }

  // Submitted / pending
  if (submitted || status === 'pending') {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: '#FEF3C7', color: '#F59E0B' }}
        >
          <CheckCircle className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Submitted for review
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Your selfie is being reviewed. You will receive a verification badge once approved.
          This usually takes less than 24 hours.
        </p>
        <Link
          href="/app/profile"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Back to Profile
        </Link>
      </div>
    )
  }

  // Verification flow (unverified or rejected)
  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl transition-all hover:opacity-70"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Verify Your Identity
        </h1>
      </div>

      {status === 'rejected' && (
        <div
          className="p-3 rounded-xl mb-5 text-sm"
          style={{ background: '#FEE2E2', color: '#DC2626' }}
        >
          Your previous submission was rejected. Please try again with a clear selfie that matches the pose below.
        </div>
      )}

      {/* Pose instruction */}
      <div
        className="p-5 rounded-2xl border text-center mb-5"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold"
          style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
        >
          {pose.emoji}
        </div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
          Strike the pose
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {pose.text}
        </p>
        <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          Make sure your face is clearly visible and well-lit
        </p>
      </div>

      {/* Selfie preview or capture */}
      {selfiePreview ? (
        <div className="mb-5">
          <div
            className="w-full aspect-[3/4] rounded-2xl overflow-hidden relative border"
            style={{ borderColor: 'var(--border)' }}
          >
            <Image
              src={selfiePreview}
              alt="Selfie preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleRetake}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
                background: 'transparent',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--ciq-purple)' }}
            >
              {submitting ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all hover:opacity-80"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
            }}
          >
            <Camera className="w-10 h-10" />
            <span className="text-sm font-medium">Tap to take a selfie</span>
            <span className="text-xs">or choose from gallery</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="user"
            onChange={handleCapture}
            className="hidden"
          />
        </div>
      )}

      {/* Info */}
      <div
        className="p-4 rounded-2xl border"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Why verify?
        </h4>
        <ul className="space-y-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <li>- A blue badge shows others you are who you say you are</li>
          <li>- Verified profiles get more connections</li>
          <li>- Helps build trust in the community</li>
          <li>- Your selfie is only used for verification and never shared</li>
        </ul>
      </div>
    </div>
  )
}
