import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Brain,
  Heart,
  TrendingUp,
  Lock,
  Sparkles,
  ArrowRight,
  Check,
  MessageCircle,
  Shield,
  Zap,
  Users,
  BarChart3,
  ChevronDown,
  Flame,
  Eye,
  RefreshCw,
  Star,
} from 'lucide-react'
import WaitlistModal from '@/components/WaitlistModal'
import LandingAnimations from '@/components/LandingAnimations'
import SocialProof from '@/components/SocialProof'
import FoundingCounter from '@/components/pricing/FoundingCounter'
import Logo from '@/components/Logo'

export const metadata: Metadata = {
  title: 'CompatibleIQ — Serious Dating, Backed by Science',
  description:
    'The serious dating app for singles ready for a real relationship. Free 6-dimension psychometric assessment. Real compatibility scores before your first date. No swiping, no hookups — just science.',
  openGraph: {
    title: 'CompatibleIQ — Serious Dating, Backed by Science',
    description:
      'For singles who want something real. 6 science-backed dimensions. One compatibility score. The dating app that measures real compatibility.',
    url: 'https://compatibleiq.com',
  },
  alternates: {
    canonical: 'https://compatibleiq.com',
  },
}

const dimensions = [
  {
    icon: Heart,
    title: 'Values & Priorities',
    desc: 'What actually matters to you in a match — religion, family, finances, lifestyle non-negotiables.',
    color: '#E8735A',
    num: '01',
  },
  {
    icon: Lock,
    title: 'Attachment Style',
    desc: 'How you bond, seek closeness, or pull away. Rooted in Bowlby\'s attachment theory.',
    color: '#7B68B5',
    num: '02',
  },
  {
    icon: MessageCircle,
    title: 'Communication & Conflict',
    desc: 'How you fight matters more than how you flirt. Based on Gottman\'s research on lasting relationships.',
    color: '#5B8DB8',
    num: '03',
  },
  {
    icon: Brain,
    title: 'Emotional Intelligence',
    desc: 'Self-awareness, empathy, emotional regulation. Built on Mayer-Salovey\'s EI framework.',
    color: '#D4A017',
    num: '04',
  },
  {
    icon: TrendingUp,
    title: 'Lifestyle & Ambition',
    desc: 'Career drive, daily rhythms, social energy. Because "work-life balance" means something different to everyone.',
    color: '#4CAF8A',
    num: '05',
  },
  {
    icon: Flame,
    title: 'Love Expression',
    desc: 'How you give and receive love. The difference between feeling loved and just being in a relationship.',
    color: '#C25B8A',
    num: '06',
  },
]

const faqs = [
  {
    q: 'Is this just another personality quiz?',
    a: 'No. CompatibleIQ uses validated psychometric instruments grounded in decades of relationship science from researchers like Bowlby, Gottman, and Mayer-Salovey. Each dimension is measured with peer-reviewed frameworks, not pop psychology.',
  },
  {
    q: 'How long do the assessments take?',
    a: 'The full 6-dimension core assessment takes 7-10 minutes total. Each individual dimension takes about 1-2 minutes. You can complete them all at once or come back and finish later.',
  },
  {
    q: 'What do I get for free?',
    a: 'All 6 core assessments, your full compatibility profile, matching with other users, seeing your compatibility scores, and messaging your matches. The free tier is genuinely useful — not a teaser.',
  },
  {
    q: 'What is a Resonance Report?',
    a: 'A Resonance Report is a detailed compatibility breakdown for a specific match. It shows where you align, where you might clash, friction points to watch for, and personalized conversation starters. Think of it as a relationship roadmap before the first date.',
  },
  {
    q: 'Is this for hookups?',
    a: 'No. CompatibleIQ is designed for people seeking meaningful, long-term relationships. Our assessments measure the dimensions that predict lasting compatibility — not surface-level attraction. If you\'re looking for something casual, this isn\'t the app for you.',
  },
  {
    q: 'Can I use this without dating?',
    a: 'Yes. Our Self-Discovery mode lets you take the same assessments and get your full compatibility profile without entering the dating pool. Great for personal growth or relationship readiness.',
  },
  {
    q: 'How is my data protected?',
    a: 'Your assessment data is encrypted and never shared with matches without your permission. We don\'t sell data. We don\'t run ads. Your profile is only visible to people you\'re matched with.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-gray-100">
      <WaitlistModal />
      <LandingAnimations />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <Logo className="h-28 sm:h-40 w-auto text-white" />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#dimensions" className="hover:text-white transition-colors">Dimensions</a>
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#science" className="hover:text-white transition-colors">The Science</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Log in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white hover:opacity-90 transition-all shadow-lg shadow-purple-500/20"
              style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-20 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7B68B5 0%, transparent 70%)' }} />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #C25B8A 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center" data-animate="fade-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 border border-purple-500/20"
              style={{ background: 'rgba(123,104,181,0.1)', color: '#9B8DD0' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Science-backed compatibility scoring
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              The last dating app{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0 0%, #C25B8A 50%, #E8735A 100%)' }}>
                you&apos;ll need.
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-300 font-medium leading-relaxed mb-4 max-w-2xl mx-auto">
              Not another swipe-right app. CompatibleIQ is for people who want something real.
            </p>
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed mb-10 max-w-xl mx-auto">
              6 psychometric dimensions. One compatibility score. For singles ready for a real relationship — not hookups, not games.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white hover:shadow-xl hover:shadow-purple-500/25 transition-all"
                style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}
              >
                Take the Assessment — Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-2xl text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                See how it works
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                7-10 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-500" />
                No credit card
              </span>
            </div>
          </div>

          {/* Hero visual: abstract score card mockup */}
          <div className="mt-16 max-w-4xl mx-auto" data-animate="fade-up" data-delay="200">
            <div className="relative rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-8 lg:p-12 overflow-hidden">
              {/* Gradient border glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(123,104,181,0.1) 0%, transparent 50%, rgba(194,91,138,0.1) 100%)' }} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative z-10">
                {/* Left: Profile mock */}
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your CIQ Profile</p>
                    <p className="text-2xl font-bold text-white">6 Dimensions</p>
                    <p className="text-sm text-gray-500 mt-1">Measured & scored</p>
                  </div>
                </div>

                {/* Center: Score visualization */}
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-28 h-28 rounded-full border-2 border-purple-500/30 relative">
                    <div className="absolute inset-2 rounded-full" style={{ background: 'conic-gradient(#7B68B5 0deg, #C25B8A 120deg, #E8735A 240deg, #7B68B5 360deg)', opacity: 0.15 }} />
                    <div className="relative">
                      <p className="text-3xl font-bold text-white">84</p>
                      <p className="text-xs text-gray-500">CIS Score</p>
                    </div>
                  </div>
                  <p className="text-sm text-emerald-400 font-medium">Highly Compatible</p>
                </div>

                {/* Right: Match preview */}
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">Dimension Breakdown</p>
                  {[
                    { name: 'Values', score: 92, color: '#E8735A' },
                    { name: 'Attachment', score: 87, color: '#7B68B5' },
                    { name: 'Communication', score: 78, color: '#5B8DB8' },
                    { name: 'Emotional IQ', score: 89, color: '#D4A017' },
                    { name: 'Lifestyle', score: 81, color: '#4CAF8A' },
                    { name: 'Love Expression', score: 79, color: '#C25B8A' },
                  ].map((d) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-24 text-right">{d.name}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: d.color, opacity: 0.7 }} />
                      </div>
                      <span className="text-xs font-medium text-gray-400 w-8">{d.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {[
            { value: '7-10 min', label: 'To complete all 6 assessments' },
            { value: '6', label: 'Science-backed dimensions' },
            { value: '100%', label: 'Free to assess & match' },
            { value: '0', label: 'Swipes required', highlight: true },
          ].map((stat) => (
            <div key={stat.label}>
              <p className={`text-3xl font-bold ${stat.highlight ? 'bg-clip-text text-transparent' : 'text-white'}`}
                style={stat.highlight ? { backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' } : undefined}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works — 3-step flow */}
      <section id="how" className="py-24 lg:py-32 relative">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] rounded-full opacity-10 blur-3xl pointer-events-none -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse, #7B68B5 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16" data-animate="fade-up">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' }}>
              How It Works
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">Three steps to clarity</h2>
            <p className="text-gray-300 font-medium max-w-2xl mx-auto text-base sm:text-lg">No algorithms guessing what you want. No swiping through strangers. Just science, applied to finding a relationship that lasts.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8" data-animate="fade-up" data-delay="100">
            {[
              {
                step: '01',
                icon: BarChart3,
                title: 'Assess',
                desc: 'Complete 6 short psychometric assessments across the dimensions that predict real compatibility. Takes 7-10 minutes total.',
                gradient: 'from-purple-500/20 to-purple-500/5',
              },
              {
                step: '02',
                icon: Users,
                title: 'Profile',
                desc: 'Get your Compatibility Intelligence profile — a multi-dimensional map of how you connect, communicate, and love.',
                gradient: 'from-pink-500/20 to-pink-500/5',
              },
              {
                step: '03',
                icon: Zap,
                title: 'Match',
                desc: 'See your scored matches instantly. Real names, real scores, real compatibility data — before you ever say hello.',
                gradient: 'from-orange-500/20 to-orange-500/5',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative group">
                <div className={`rounded-2xl p-8 bg-gradient-to-b ${item.gradient} border border-white/5 hover:border-white/10 transition-all h-full`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
                {/* Connector arrow (hidden on last item and mobile) */}
                {i < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 lg:-right-5 w-8 h-8 items-center justify-center z-10 -translate-y-1/2">
                    <ArrowRight className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 Dimensions Showcase */}
      <section id="dimensions" className="py-24 lg:py-32 relative">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #C25B8A 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16" data-animate="fade-up">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' }}>
              The 6 Dimensions
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">What we measure — and why it matters</h2>
            <p className="text-gray-300 font-medium max-w-2xl mx-auto text-base sm:text-lg">
              Each dimension is grounded in peer-reviewed research. Together, they create the most complete picture of compatibility available outside a therapist&apos;s office.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" data-animate="fade-up" data-delay="100">
            {dimensions.map((dim) => (
              <div key={dim.title} className="rounded-2xl p-6 lg:p-7 bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform"
                    style={{ background: `${dim.color}15` }}>
                    <dim.icon className="w-5 h-5" style={{ color: dim.color }} strokeWidth={1.5} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 tracking-widest">{dim.num}</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-2">{dim.title}</h4>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">{dim.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center" data-animate="fade-up" data-delay="200">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white hover:shadow-xl hover:shadow-purple-500/25 transition-all"
              style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}
            >
              Start Your Assessment — Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* The Science */}
      <section id="science" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/[0.03] to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div data-animate="fade-up">
              <p className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' }}>
                Built on Research
              </p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight">
                This isn&apos;t a quiz.<br />It&apos;s psychometric science.
              </h2>
              <p className="text-gray-300 font-medium leading-relaxed mb-8 text-base sm:text-lg">
                Every dimension in CompatibleIQ is grounded in published research from the scientists who defined how we understand human connection.
              </p>

              <div className="space-y-6">
                {[
                  {
                    name: 'John Bowlby & Mary Ainsworth',
                    field: 'Attachment Theory',
                    desc: 'The foundational framework for understanding how early bonds shape adult relationship patterns.',
                  },
                  {
                    name: 'John Gottman',
                    field: 'Relationship Dynamics',
                    desc: 'Four decades of research on what makes relationships succeed or fail — including the "Four Horsemen" of conflict.',
                  },
                  {
                    name: 'Peter Salovey & John Mayer',
                    field: 'Emotional Intelligence',
                    desc: 'The original EI model measuring how people perceive, use, understand, and manage emotions.',
                  },
                  {
                    name: 'Affection Research',
                    field: 'Connection Styles',
                    desc: 'A framework for understanding how individuals express and experience affection differently.',
                  },
                ].map((researcher) => (
                  <div key={researcher.name} className="flex gap-4">
                    <div className="w-1 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(to bottom, #7B68B5, #C25B8A)' }} />
                    <div>
                      <p className="text-white font-semibold text-sm">{researcher.name}</p>
                      <p className="text-purple-400 text-xs font-medium mb-1">{researcher.field}</p>
                      <p className="text-gray-400 text-sm font-medium leading-relaxed">{researcher.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5" data-animate="fade-up" data-delay="150">
              {[
                {
                  icon: Shield,
                  title: 'Validated instruments',
                  desc: 'Each assessment uses psychometric scales with established reliability and validity — not arbitrary question sets.',
                },
                {
                  icon: BarChart3,
                  title: 'Multi-dimensional scoring',
                  desc: 'Your Compatibility Intelligence Score (CIS) is a weighted composite across all 6 dimensions — not a single-axis personality type.',
                },
                {
                  icon: Brain,
                  title: 'Continuous calibration',
                  desc: 'As our user base grows, we refine scoring models against real relationship outcomes — making matches more accurate over time.',
                },
                {
                  icon: Lock,
                  title: 'Not a diagnostic tool',
                  desc: 'CompatibleIQ is designed for relationship compatibility insight, not clinical diagnosis. We\'re transparent about what it is and what it isn\'t.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-6 bg-white/[0.03] border border-white/5 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 border border-white/5">
                    <item.icon className="w-5 h-5 text-purple-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Credibility */}
      <SocialProof />

      {/* Self-Discovery CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
          <div
            className="rounded-3xl p-5 sm:p-8 lg:p-12 relative overflow-hidden border border-white/5"
            data-animate="fade-up"
            style={{ background: 'linear-gradient(135deg, rgba(76,175,138,0.08) 0%, rgba(123,104,181,0.08) 100%)' }}
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4 border border-emerald-500/20"
                  style={{ background: 'rgba(76,175,138,0.1)', color: '#4CAF8A' }}>
                  <Brain className="w-3.5 h-3.5" />
                  Self-Discovery Mode
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3">Not ready to date?</h3>
                <p className="text-gray-300 font-medium leading-relaxed mb-6">
                  Take the same science-backed assessments without entering the dating pool. Discover your attachment style, communication patterns, and relationship blind spots — on your own terms.
                </p>
                <ul className="space-y-2.5 mb-8">
                  {[
                    'Personal compatibility profile',
                    'Attachment style deep dive',
                    'Dating readiness insights',
                    'Shareable CIQ personality card',
                  ].map((text) => (
                    <li key={text} className="flex items-center gap-2.5 text-sm text-gray-300 font-medium">
                      <Check className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center lg:text-right">
                <Link
                  href="/signup?mode=self_discovery"
                  className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white hover:opacity-90 transition-all"
                  style={{ background: 'linear-gradient(135deg, #4CAF8A 0%, #3D9B7A 100%)' }}
                >
                  Know Yourself — Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="mt-3 text-xs text-gray-500">Same assessments. No dating pool. Switch anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 lg:py-32 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #7B68B5 0%, transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="text-center mb-16" data-animate="fade-up">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' }}>
              Pricing
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4">Matching is free. Insight is premium.</h2>
            <p className="text-gray-300 font-medium max-w-2xl mx-auto text-base sm:text-lg">
              Assess, match, and message for free. Unlock deeper compatibility intelligence when you&apos;re ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" data-animate="fade-up" data-delay="100">
            {/* Free Tier */}
            <div className="rounded-2xl p-7 bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Free</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-sm text-gray-500">forever</span>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-6">Everything you need to find compatible matches. Seriously.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'All 6 core assessments',
                  'Full compatibility profile',
                  'See all your matches + scores',
                  'Unlimited messaging',
                  'Self-discovery mode',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-center">
                Get Started Free
              </Link>
            </div>

            {/* Resonance Report */}
            <div className="rounded-2xl p-7 bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Resonance Report</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-white">$4.99</span>
                <span className="text-sm text-gray-500">per match</span>
              </div>
              <p className="text-sm text-gray-400 font-medium mb-6">The full compatibility deep dive for one match. Know exactly where you align.</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Dimension-by-dimension breakdown',
                  'Your strengths as a pair',
                  'Friction points & how to navigate them',
                  'Personalized conversation starters',
                ].map((text) => (
                  <li key={text} className="flex items-start gap-2.5 text-sm text-gray-300 font-medium">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500" />
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3.5 rounded-xl text-sm font-semibold border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-center">
                Unlock a Report
              </Link>
            </div>

            {/* CIQ Pro */}
            <div className="rounded-2xl p-7 relative border-2 transition-all"
              style={{ background: 'rgba(123,104,181,0.05)', borderColor: 'rgba(123,104,181,0.3)', boxShadow: '0 0 60px rgba(123,104,181,0.1)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7B68B5, #C25B8A)' }}>
                BEST VALUE
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4 text-purple-400">CIQ Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$14.99</span>
                <span className="text-sm text-gray-500">/mo</span>
              </div>
              <p className="text-xs text-gray-500 mb-2">3 reports and you&apos;ve already paid for this</p>
              <p className="text-sm text-gray-400 font-medium mb-6">Unlimited reports, priority matching, and the tools serious daters actually want.</p>
              <ul className="space-y-3 mb-8">
                {[
                  { text: 'Unlimited Resonance Reports', icon: Sparkles },
                  { text: 'Priority Match Queue', icon: Zap },
                  { text: 'Re-take any assessment', icon: RefreshCw },
                  { text: 'Compatibility Trends', icon: TrendingUp },
                  { text: 'Read Receipts', icon: Eye },
                  { text: 'Who Viewed Your Profile', icon: Star },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <item.icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-400" />
                    {item.text}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="block w-full py-3.5 rounded-xl text-sm font-semibold text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all text-center"
                style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}>
                Go Pro
              </Link>
            </div>
          </div>

          {/* Founding Member callout */}
          <div className="mt-8 rounded-2xl p-6 lg:p-8 border border-white/5 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-6" data-animate="fade-up" data-delay="200">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: 'var(--ciq-coral)' }}>LIMITED</span>
                <p className="text-white font-semibold">Founding Member — $9.99/mo forever</p>
              </div>
              <p className="text-sm text-gray-400 font-medium">First 1,000 members lock in CIQ Pro at $9.99/mo. This rate never goes up. Help shape the product and get early access.</p>
              <FoundingCounter />
            </div>
            <Link href="/signup" className="px-6 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap hover:opacity-90 transition-all"
              style={{ background: 'var(--ciq-coral)' }}>
              Claim Founding Rate
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center mb-16" data-animate="fade-up">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #9B8DD0, #C25B8A)' }}>
              FAQ
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Common questions</h2>
          </div>

          <div className="space-y-4" data-animate="fade-up" data-delay="100">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                <summary className="flex items-center justify-between cursor-pointer p-6 list-none [&::-webkit-details-marker]:hidden">
                  <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-6 -mt-2">
                  <p className="text-gray-300 text-sm font-medium leading-relaxed">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-12">
          <div
            className="rounded-3xl p-6 sm:p-12 lg:p-20 text-center relative overflow-hidden"
            data-animate="fade-up"
            style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 40%, #C25B8A 100%)' }}
          >
            {/* Subtle noise overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 text-white leading-tight">
                7-10 minutes now.<br />Zero bad dates later.
              </h2>
              <p className="text-lg mb-10 max-w-lg mx-auto text-white/70">
                Your free assessment is waiting. Six dimensions, no credit card, and the kind of clarity you wish you had three relationships ago.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold rounded-2xl bg-white hover:shadow-2xl transition-all text-[#7B68B5]"
              >
                Start Free Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="mt-6 text-sm text-white/50">Free forever for 6 core assessments. No credit card needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <Logo className="h-12 w-auto opacity-60 mb-4 text-white" showTagline={false} />
              <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
                The serious dating platform that scores real compatibility across 6 science-backed dimensions. For singles who want a real relationship. Stop guessing. Start knowing.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Product</p>
              <ul className="space-y-2.5">
                <li><a href="#how" className="text-sm text-gray-500 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#dimensions" className="text-sm text-gray-500 hover:text-white transition-colors">The 6 Dimensions</a></li>
                <li><a href="#science" className="text-sm text-gray-500 hover:text-white transition-colors">The Science</a></li>
                <li><a href="#pricing" className="text-sm text-gray-500 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-sm text-gray-500 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Legal</p>
              <ul className="space-y-2.5">
                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Pivot Training & Development. All rights reserved.</p>
            <p className="text-xs text-gray-600">Not a clinical diagnostic tool.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
