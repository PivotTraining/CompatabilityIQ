// @ts-nocheck
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Brain,
  Heart,
  Users,
  Shield,
  Lock,
  EyeOff,
  CheckCircle,
} from 'lucide-react'

const RESEARCH_CARDS = [
  {
    icon: Heart,
    name: 'Gottman Method',
    description:
      'Four decades of research predicting relationship success from communication and conflict patterns.',
    badge: 'Peer-Reviewed',
  },
  {
    icon: Users,
    name: 'Attachment Theory',
    researcher: 'Bowlby & Ainsworth',
    description:
      'How early bonding experiences shape adult attachment styles and relationship security.',
    badge: 'Research-Backed',
  },
  {
    icon: Brain,
    name: 'Big Five Personality Model',
    description:
      'The most widely validated personality framework in psychology, measuring five core trait dimensions.',
    badge: 'Peer-Reviewed',
  },
  {
    icon: BookOpen,
    name: "Sternberg's Triangular Theory",
    description:
      'A model of love built on three components: intimacy, passion, and commitment.',
    badge: 'Research-Backed',
  },
] as const

const STATS = [
  { value: 2400, label: 'Assessments completed', suffix: '+' },
  { value: 6, label: 'Science-backed dimensions', suffix: '' },
  { value: 122, label: 'Assessment questions', suffix: '' },
] as const

const TRUST_SIGNALS = [
  { icon: Lock, label: '256-bit encryption' },
  { icon: Shield, label: 'GDPR compliant' },
  { icon: EyeOff, label: 'No data selling' },
  { icon: CheckCircle, label: 'Photo verified profiles' },
] as const

function useCountUp(target: number, duration: number = 1500): {
  value: number
  ref: React.RefObject<HTMLDivElement | null>
} {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement | null>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * target))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [target, duration])

  return { value, ref }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function StatsBar() {
  const counters = STATS.map((stat) => ({
    ...stat,
    counter: useCountUp(stat.value),
  }))

  return (
    <div
      ref={counters[0].counter.ref}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 py-8 px-4 rounded-2xl border border-white/5 bg-white/[0.02]"
      data-animate="fade-up"
    >
      {counters.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-0">
          <div className="text-center px-6 sm:px-10">
            <p
              className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #9B8DD0, #C25B8A)',
              }}
            >
              {formatNumber(stat.counter.value)}
              {stat.suffix}
            </p>
            <p className="text-xs text-gray-500 font-medium mt-1">
              {stat.label}
            </p>
          </div>
          {i < counters.length - 1 && (
            <div className="hidden sm:block w-px h-10 bg-white/10" />
          )}
        </div>
      ))}
    </div>
  )
}

function TrustStrip() {
  return (
    <div
      className="flex overflow-x-auto sm:overflow-visible sm:justify-center gap-6 sm:gap-8 py-6 px-2 no-scrollbar"
      data-animate="fade-up"
      data-delay="200"
    >
      {TRUST_SIGNALS.map((signal) => (
        <div
          key={signal.label}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-white/5">
            <signal.icon
              className="w-4 h-4 text-purple-400"
              strokeWidth={1.5}
            />
          </div>
          <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">
            {signal.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SocialProof() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, transparent 0%, rgba(123,104,181,0.03) 30%, rgba(123,104,181,0.03) 70%, transparent 100%)',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-14" data-animate="fade-up">
          <p
            className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)',
            }}
          >
            Credibility
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">
            Built on decades of relationship science
          </h2>
          <p className="text-gray-300 font-medium max-w-2xl mx-auto text-base sm:text-lg">
            Every dimension is grounded in peer-reviewed research from the
            scientists who defined modern relationship psychology.
          </p>
        </div>

        {/* Research citation cards — 2x2 grid */}
        <div
          className="grid sm:grid-cols-2 gap-5 mb-12"
          data-animate="fade-up"
          data-delay="100"
        >
          {RESEARCH_CARDS.map((card) => (
            <div
              key={card.name}
              className="rounded-2xl p-6 lg:p-7 bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform bg-purple-500/10">
                    <card.icon
                      className="w-5 h-5 text-purple-400"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {card.name}
                    </h4>
                    {'researcher' in card && card.researcher && (
                      <p className="text-xs text-purple-400 font-medium">
                        {card.researcher}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-purple-500/20 flex-shrink-0"
                  style={{
                    background: 'rgba(123,104,181,0.1)',
                    color: '#9B8DD0',
                  }}
                >
                  <BookOpen className="w-3 h-3" />
                  {card.badge}
                </span>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Live stats bar */}
        <StatsBar />

        {/* Trust signals strip */}
        <TrustStrip />
      </div>
    </section>
  )
}
