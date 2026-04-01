// @ts-nocheck
'use client'

interface LogoProps {
  className?: string
  showTagline?: boolean
}

export default function Logo({ className = 'h-10 w-auto', showTagline = true }: LogoProps) {
  return (
    <svg
      viewBox="0 0 400 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CompatibleIQ"
    >
      <defs>
        <linearGradient id="connGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B68B5" />
          <stop offset="100%" stopColor="#4CAF8A" />
        </linearGradient>
      </defs>
      {/* Interlocking circles */}
      <g transform="translate(55, 75)">
        <circle cx="-12" cy="0" r="28" stroke="#7B68B5" strokeWidth="4" fill="none" />
        <circle cx="12" cy="0" r="28" stroke="#4CAF8A" strokeWidth="4" fill="none" />
        <circle cx="0" cy="-20" r="3" fill="#E8735A" />
        <circle cx="0" cy="20" r="3" fill="#E8735A" />
        <path d="M -12 -28 Q 0 0 12 -28" stroke="url(#connGrad)" strokeWidth="2" fill="none" opacity="0.5" />
        <path d="M -12 28 Q 0 0 12 28" stroke="url(#connGrad)" strokeWidth="2" fill="none" opacity="0.5" />
      </g>
      {/* Wordmark — uses currentColor so it inherits text color from parent */}
      <text
        x="110"
        y="68"
        fontFamily="'DM Sans', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontSize="28"
        fontWeight="600"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Compatible
        <tspan fill="#7B68B5" fontWeight="700">IQ</tspan>
      </text>
      {/* Tagline */}
      {showTagline && (
        <text
          x="110"
          y="92"
          fontFamily="'DM Sans', 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="11"
          fill="currentColor"
          opacity="0.5"
          letterSpacing="2"
          fontWeight="400"
        >
          SCIENCE-DRIVEN COMPATIBILITY
        </text>
      )}
    </svg>
  )
}
