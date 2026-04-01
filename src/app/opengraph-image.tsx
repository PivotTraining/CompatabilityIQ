import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'CompatibleIQ — Science-Based Compatibility Assessment'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1528 50%, #0a0a0a 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,104,181,0.15) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '-60px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76,175,138,0.12) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Connection lines SVG */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0.08 }}
        >
          <circle cx="200" cy="150" r="4" fill="#7B68B5" />
          <circle cx="400" cy="100" r="3" fill="#7B68B5" />
          <circle cx="800" cy="180" r="5" fill="#4CAF8A" />
          <circle cx="1000" cy="120" r="3" fill="#7B68B5" />
          <circle cx="300" cy="480" r="4" fill="#4CAF8A" />
          <circle cx="900" cy="500" r="3" fill="#7B68B5" />
          <circle cx="600" cy="80" r="3" fill="#4CAF8A" />
          <line x1="200" y1="150" x2="400" y2="100" stroke="#7B68B5" strokeWidth="0.5" />
          <line x1="400" y1="100" x2="600" y2="80" stroke="#7B68B5" strokeWidth="0.5" />
          <line x1="600" y1="80" x2="800" y2="180" stroke="#4CAF8A" strokeWidth="0.5" />
          <line x1="800" y1="180" x2="1000" y2="120" stroke="#7B68B5" strokeWidth="0.5" />
          <line x1="300" y1="480" x2="900" y2="500" stroke="#4CAF8A" strokeWidth="0.5" />
        </svg>

        {/* Heart + Brain icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            gap: '16px',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8735A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
          <div
            style={{
              width: '2px',
              height: '32px',
              background: 'rgba(123,104,181,0.4)',
              display: 'flex',
            }}
          />
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#7B68B5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
            <path d="M9 21h6" />
            <path d="M10 21v1a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-1" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-2px',
            lineHeight: 1,
            marginBottom: '16px',
            display: 'flex',
          }}
        >
          Compatible
          <span style={{ color: '#7B68B5' }}>IQ</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.6)',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          The last dating app you'll need.
        </div>

        {/* Dimension pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '800px',
          }}
        >
          {['Values', 'Attachment', 'Communication', 'EQ', 'Lifestyle', 'Love Style'].map(
            (dim) => (
              <div
                key={dim}
                style={{
                  padding: '8px 20px',
                  borderRadius: '20px',
                  background: 'rgba(123,104,181,0.15)',
                  border: '1px solid rgba(123,104,181,0.3)',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '16px',
                  fontWeight: 500,
                  display: 'flex',
                }}
              >
                {dim}
              </div>
            ),
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '28px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.3)',
            display: 'flex',
          }}
        >
          compatibleiq.com
        </div>
      </div>
    ),
    { ...size },
  )
}
