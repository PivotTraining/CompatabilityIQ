'use client'

import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════
// Types
// ═══════════════════════════════════════════

interface Preferences {
  push_enabled: boolean
  email_enabled: boolean
  sms_enabled: boolean
  quiet_hours_start: string
  quiet_hours_end: string
}

const DEFAULT_PREFS: Preferences = {
  push_enabled: true,
  email_enabled: true,
  sms_enabled: false,
  quiet_hours_start: '22:00',
  quiet_hours_end: '08:00',
}

// ═══════════════════════════════════════════
// Brand colors
// ═══════════════════════════════════════════

const CIQ_PURPLE = '#7B68B5'
const CIQ_GREEN = '#4CAF8A'

// ═══════════════════════════════════════════
// Toggle Switch Component
// ═══════════════════════════════════════════

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (val: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontSize: '15px', fontWeight: '500', color: '#f3f4f6' }}>
          {label}
        </p>
        {description && (
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6b7280' }}>
            {description}
          </p>
        )}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        style={{
          position: 'relative',
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: checked ? CIQ_PURPLE : '#374151',
          transition: 'background-color 0.2s',
          flexShrink: 0,
          marginLeft: '16px',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: '2px',
            left: checked ? '22px' : '2px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
          }}
        />
      </button>
    </div>
  )
}

// ═══════════════════════════════════════════
// Main Page Component
// ═══════════════════════════════════════════

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Fetch current preferences
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/notifications/preferences')
        if (res.ok) {
          const data = await res.json()
          if (data.preferences) {
            setPrefs(data.preferences)
          }
        }
      } catch (err) {
        console.error('[NotificationPreferences] load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Save handler
  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })

      if (res.ok) {
        setToast('Preferences saved successfully')
        setTimeout(() => setToast(null), 3000)
      } else {
        setToast('Failed to save preferences')
        setTimeout(() => setToast(null), 3000)
      }
    } catch {
      setToast('Failed to save preferences')
      setTimeout(() => setToast(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  // Update helper
  function updatePref<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
        Loading preferences...
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '24px 16px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '24px', fontWeight: '700', color: '#f3f4f6' }}>
        Notification Preferences
      </h1>
      <p style={{ margin: '0 0 32px', fontSize: '15px', color: '#6b7280' }}>
        Control how and when CompatibleIQ reaches out to you.
      </p>

      {/* ── Channels ──────────────────────── */}
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
          Channels
        </h2>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '12px',
            padding: '4px 20px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Toggle
            label="Push Notifications"
            description="In-app and browser push notifications"
            checked={prefs.push_enabled}
            onChange={(val) => updatePref('push_enabled', val)}
          />
          <Toggle
            label="Email Notifications"
            description="Emails for matches, reports, and digests"
            checked={prefs.email_enabled}
            onChange={(val) => updatePref('email_enabled', val)}
          />
          <Toggle
            label="SMS Notifications"
            description="Text messages for time-sensitive alerts"
            checked={prefs.sms_enabled}
            onChange={(val) => updatePref('sms_enabled', val)}
          />
        </div>
      </section>

      {/* ── Quiet Hours ───────────────────── */}
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
          Quiet Hours
        </h2>
        <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#6b7280' }}>
          Push and SMS notifications will be silenced during quiet hours. Emails are unaffected.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '6px',
              }}
            >
              Start
            </label>
            <input
              type="time"
              value={prefs.quiet_hours_start}
              onChange={(e) => updatePref('quiet_hours_start', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#d1d5db',
                marginBottom: '6px',
              }}
            >
              End
            </label>
            <input
              type="time"
              value={prefs.quiet_hours_end}
              onChange={(e) => updatePref('quiet_hours_end', e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#f3f4f6',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Save Button ───────────────────── */}
      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: CIQ_PURPLE,
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.6 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {saving ? 'Saving...' : 'Save Preferences'}
      </button>

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
            backgroundColor: toast.includes('success') ? CIQ_GREEN : '#ef4444',
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
