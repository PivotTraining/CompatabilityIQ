'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ═══════════════════════════════════════════
// Brand colors
// ═══════════════════════════════════════════

const CIQ_PURPLE = '#7B68B5'

// ═══════════════════════════════════════════
// Confirmation Modal
// ═══════════════════════════════════════════

interface ConfirmModalProps {
  open: boolean
  loading: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDeleteModal({ open, loading, onConfirm, onCancel }: ConfirmModalProps) {
  const [typed, setTyped] = useState('')
  const confirmed = typed === 'DELETE MY ACCOUNT'

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '16px',
      }}
    >
      <div
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '32px 28px',
          maxWidth: '440px',
          width: '100%',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: '700', color: '#f3f4f6' }}>
          Confirm Account Deletion
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
          This action is <strong style={{ color: '#ef4444' }}>permanent and irreversible</strong>.
          All your data — profile, assessment results, matches, messages, and reports — will be
          permanently deleted.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#d1d5db' }}>
          Type <strong style={{ color: '#ef4444' }}>DELETE MY ACCOUNT</strong> to confirm:
        </p>
        <input
          type="text"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder="DELETE MY ACCOUNT"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#f3f4f6',
            fontSize: '15px',
            outline: 'none',
            boxSizing: 'border-box',
            marginBottom: '20px',
          }}
        />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: 'transparent',
              color: '#d1d5db',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!confirmed || loading}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: confirmed && !loading ? '#dc2626' : '#4b1113',
              color: confirmed && !loading ? '#ffffff' : '#6b7280',
              fontSize: '15px',
              fontWeight: '600',
              cursor: confirmed && !loading ? 'pointer' : 'not-allowed',
              opacity: confirmed && !loading ? 1 : 0.6,
              transition: 'opacity 0.15s, background-color 0.15s',
            }}
          >
            {loading ? 'Deleting...' : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════

export default function DataPrivacyPage() {
  const router = useRouter()
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  function showToast(message: string) {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  // Download data export
  async function handleExport() {
    setExporting(true)
    try {
      const res = await fetch('/api/user/export')
      if (!res.ok) {
        showToast('Failed to export data')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'compatibleiq-data-export.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('Data export downloaded successfully')
    } catch {
      showToast('Failed to export data')
    } finally {
      setExporting(false)
    }
  }

  // Delete account
  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: 'DELETE MY ACCOUNT' }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        router.push('/')
      } else {
        showToast(data.error ?? 'Account deletion encountered errors. Please contact support.')
        setModalOpen(false)
      }
    } catch {
      showToast('Failed to delete account. Please try again.')
      setModalOpen(false)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#f3f4f6' }}>
        Data & Privacy
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: '15px', color: '#6b7280' }}>
        Manage your data, export a copy, or delete your account.
      </p>

      {/* ── Export Section ────────────────── */}
      <section style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Download My Data
        </h2>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#d1d5db', lineHeight: '1.5' }}>
            Download a copy of your CompatibleIQ data, including your profile, assessment responses,
            dimension scores, matches, messages, and payment history.
          </p>
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: CIQ_PURPLE,
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting ? 0.6 : 1,
              transition: 'opacity 0.15s',
            }}
          >
            {exporting ? 'Preparing export...' : 'Download My Data'}
          </button>
        </div>
      </section>

      {/* ── Delete Section ────────────────── */}
      <section style={{ marginBottom: '32px' }}>
        <h2
          style={{
            margin: '0 0 12px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Delete Account
        </h2>
        <div
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.06)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(220, 38, 38, 0.15)',
          }}
        >
          <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '600', color: '#fca5a5' }}>
            Danger Zone
          </p>
          <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#9ca3af', lineHeight: '1.5' }}>
            Permanently delete your account and all associated data. This includes your profile,
            assessment results, matches, messages, reports, photos, and payment records. This action
            cannot be undone.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            Delete My Account
          </button>
        </div>
      </section>

      {/* ── Confirmation Modal ────────────── */}
      <ConfirmDeleteModal
        open={modalOpen}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
      />

      {/* ── Toast ─────────────────────────── */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: toast.includes('success') ? '#4CAF8A' : '#ef4444',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 100,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {toast}
        </div>
      )}
    </div>
  )
}
