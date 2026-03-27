import Link from 'next/link'
import { Brain, Heart, Shield, TrendingUp, Lock, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>
            CompatibleIQ
          </span>
        </div>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors"
            style={{ background: 'var(--ciq-purple)' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
          style={{ background: 'var(--bg-secondary)', color: 'var(--ciq-purple)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Applied Compatibility Science
        </div>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          The scientific version of{' '}
          <span style={{ color: 'var(--ciq-purple)' }}>finding your person</span>
        </h1>
        <p
          className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          8 psychological constructs. 6 financial intelligence domains. 5 behavioral screening clusters.
          One score that actually predicts compatibility.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-white transition-all hover:opacity-90"
          style={{ background: 'var(--ciq-purple)' }}
        >
          Begin Your Assessment
        </Link>
        <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
          Free assessment. Science-first matching. No swiping.
        </p>
      </section>

      {/* Three Layers */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
          Three layers of compatibility intelligence
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: 'Core Quotients',
              subtitle: '8 Psychological Domains',
              description: 'Values, attachment, emotional intelligence, conflict style, neurobiology, love languages, growth mindset, and cognitive style.',
              color: 'var(--ciq-purple)',
            },
            {
              icon: TrendingUp,
              title: 'Financial Intelligence',
              subtitle: '6 Financial Domains',
              description: 'Financial mindset, spending behavior, planning quotient, investment intelligence, communication, and debt framework.',
              color: 'var(--ciq-green)',
            },
            {
              icon: Shield,
              title: 'Depth Profile',
              subtitle: '5 Behavioral Clusters',
              description: 'Accountability, empathy history, emotional stability, relational safety, and dependency patterns — screened silently.',
              color: 'var(--ciq-coral)',
            },
          ].map((layer) => (
            <div
              key={layer.title}
              className="rounded-2xl p-6 border transition-all hover:shadow-lg"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: `${layer.color}15`, color: layer.color }}
              >
                <layer.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {layer.title}
              </h3>
              <p className="text-sm font-medium mb-3" style={{ color: layer.color }}>
                {layer.subtitle}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {layer.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-12" style={{ color: 'var(--text-primary)' }}>
          Earn your matches
        </h2>
        <div className="space-y-6">
          {[
            { icon: Lock, step: '01', title: 'Complete the assessment', description: 'Six modules. ~49 minutes across multiple sessions. Each module unlocks more compatible profiles.' },
            { icon: Heart, step: '02', title: 'Discover real matches', description: 'No swiping. No appearance-based algorithms. Profiles ranked by your Compatibility Index Score.' },
            { icon: Shield, step: '03', title: 'Connect with confidence', description: 'Mutual interest required. No unsolicited messages. Safety screening built into the science.' },
          ].map((item) => (
            <div
              key={item.step}
              className="flex gap-5 rounded-2xl p-6 border"
              style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
            >
              <div
                className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)' }}
              >
                <item.icon className="w-5 h-5" style={{ color: 'var(--ciq-purple)' }} />
              </div>
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--ciq-purple)' }}>
                  STEP {item.step}
                </p>
                <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div
          className="rounded-2xl p-10 border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
            Ready for compatibility, not coincidence?
          </h2>
          <p className="text-base mb-8 max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Your assessment is free. Your matches are science-first. The only cost is honesty.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: 'var(--ciq-purple)' }}
          >
            Start Your Assessment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Pivot Training & Development. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            CompatibleIQ is not a clinical diagnostic tool.
          </p>
        </div>
      </footer>
    </div>
  )
}
