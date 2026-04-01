'use client'

import { useState, useEffect, useCallback } from 'react'

interface CountData {
  count: number
  limit: number
}

const REFRESH_INTERVAL_MS = 30_000
const URGENCY_THRESHOLD = 500

export default function FoundingCounter() {
  const [data, setData] = useState<CountData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCount = useCallback(async () => {
    try {
      const response = await fetch('/api/founding-members/count')

      if (!response.ok) {
        return
      }

      const result: CountData = await response.json()
      setData(result)
    } catch {
      // Silently fail on network errors — counter is non-critical UI
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCount()

    const interval = setInterval(fetchCount, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchCount])

  if (isLoading || !data) {
    return (
      <div className="mt-4 space-y-2 animate-pulse">
        <div className="h-2 rounded-full bg-white/5 w-full" />
        <div className="h-4 rounded bg-white/5 w-3/4 mx-auto" />
      </div>
    )
  }

  const { count, limit } = data
  const percentage = Math.min((count / limit) * 100, 100)
  const spotsRemaining = Math.max(limit - count, 0)
  const showUrgency = count > URGENCY_THRESHOLD

  return (
    <div className="mt-4">
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        role="progressbar"
        aria-valuenow={count}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label={`${count} of ${limit.toLocaleString()} founding member spots claimed`}
      >
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, #7B68B5 0%, #9B8DD0 60%, #C25B8A 100%)',
          }}
        />
      </div>

      <p className="text-xs text-gray-400 font-medium mt-2 text-center">
        <span className="text-white font-semibold">{count.toLocaleString()}</span> of{' '}
        <span className="text-white font-semibold">{limit.toLocaleString()}</span> spots claimed
      </p>

      {showUrgency && spotsRemaining > 0 && (
        <p className="text-xs font-semibold mt-1 text-center bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(135deg, #E8735A, #C25B8A)' }}>
          Spots filling fast!
        </p>
      )}

      {spotsRemaining === 0 && (
        <p className="text-xs font-semibold mt-1 text-center text-red-400">
          All founding member spots have been claimed
        </p>
      )}
    </div>
  )
}
