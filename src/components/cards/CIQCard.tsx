'use client'

import { useRef, useState, useCallback } from 'react'
import { Share2, Download, Check } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────

interface CIQCardProps {
  firstName: string
  topTraits: string[]
  attachmentStyleLabel: string
  primaryConnectionStyle: string
  eqScore: number // 0-100
  className?: string
}

// ─── Attachment Style Colors ─────────────────────────────

const ATTACHMENT_COLORS: Record<string, string> = {
  Secure: '#4CAF8A',
  'Earned Secure': '#4CAF8A',
  'Anxious-Preoccupied': '#E8735A',
  'Dismissive-Avoidant': '#5B8DB8',
  'Fearful-Avoidant': '#D4A017',
}

// ─── Component ──────────────────────────────────────────

export default function CIQCard({
  firstName,
  topTraits,
  attachmentStyleLabel,
  primaryConnectionStyle,
  eqScore,
  className = '',
}: CIQCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  const attachmentColor = ATTACHMENT_COLORS[attachmentStyleLabel] || '#7B68B5'

  // Export as image using html2canvas
  const exportAsImage = useCallback(async () => {
    if (!cardRef.current) return
    setExporting(true)

    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL('image/png')

      // Download
      const link = document.createElement('a')
      link.download = `${firstName}-CIQ-Card.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export card:', err)
    } finally {
      setExporting(false)
    }
  }, [firstName])

  // Share via native share API or copy to clipboard
  const handleShare = useCallback(async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
      })

      // Try native share first
      if (navigator.share && navigator.canShare) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/png')
        )
        if (blob) {
          const file = new File([blob], `${firstName}-CIQ-Card.png`, { type: 'image/png' })
          const shareData = { files: [file], title: `${firstName}'s CIQ Card` }
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData)
            return
          }
        }
      }

      // Fallback: copy image to clipboard
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/png')
      )
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ])
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.error('Failed to share card:', err)
    }
  }, [firstName])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Card Preview — Instagram Story aspect ratio (9:16) */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl mx-auto w-full max-w-[320px]"
        style={{
          aspectRatio: '9/16',
          background: 'linear-gradient(135deg, #7B68B5 0%, #5A4A99 40%, #483D7A 100%)',
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-10"
          style={{ background: 'white' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'white' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full px-7 py-8">
          {/* Top section */}
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2">
              Compatibility Profile
            </p>
            <h2 className="text-white text-3xl font-bold mb-8">
              {firstName}
            </h2>

            {/* Top 3 Traits */}
            <div className="space-y-2.5 mb-8">
              {topTraits.map((trait, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: i === 0 ? '#4CAF8A' : i === 1 ? '#E8735A' : '#5B8DB8',
                    }}
                  />
                  <span className="text-white text-sm font-medium">{trait}</span>
                </div>
              ))}
            </div>

            {/* Attachment Style Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: attachmentColor }}
              />
              <span className="text-white text-xs font-semibold">
                {attachmentStyleLabel} Attachment
              </span>
            </div>
          </div>

          {/* Middle section */}
          <div className="space-y-6">
            {/* How You Connect */}
            <div>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-1">
                How You Connect
              </p>
              <p className="text-white text-base font-semibold">{primaryConnectionStyle}</p>
            </div>

            {/* EQ Score Ring */}
            <div>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-wider mb-2">
                Emotional Intelligence
              </p>
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 56 56" className="w-full h-full">
                    {/* Background ring */}
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="4"
                    />
                    {/* Score ring */}
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      fill="none"
                      stroke="#4CAF8A"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(eqScore / 100) * 150.8} 150.8`}
                      transform="rotate(-90 28 28)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{eqScore}</span>
                  </div>
                </div>
                <span className="text-white/60 text-xs">
                  {eqScore >= 80 ? 'Exceptional' : eqScore >= 60 ? 'Strong' : eqScore >= 40 ? 'Developing' : 'Growth Area'}
                </span>
              </div>
            </div>
          </div>

          {/* Bottom watermark */}
          <div className="mt-auto pt-4">
            <div className="flex items-center gap-1.5 opacity-40">
              <div className="w-4 h-4 rounded-sm flex items-center justify-center bg-white/30">
                <span className="text-white text-[8px] font-bold">C</span>
              </div>
              <span className="text-white text-[10px] font-semibold tracking-wide">
                CompatibleIQ
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={exportAsImage}
          disabled={exporting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50"
          style={{
            background: 'var(--ciq-purple)',
            color: 'white',
          }}
        >
          <Download className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Save Image'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all hover:opacity-90"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
            background: 'var(--bg-card)',
          }}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" style={{ color: 'var(--ciq-green)' }} />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              Share
            </>
          )}
        </button>
      </div>
    </div>
  )
}
