import Link from 'next/link'
import Image from 'next/image'
import { Brain, Heart, TrendingUp, Lock, Sparkles, ArrowRight, Check, Clock, MessageCircle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="CompatibleIQ" width={320} height={80} className="h-20 w-auto" priority />
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl text-white hover:opacity-90 transition-all shadow-sm"
            style={{ background: 'var(--ciq-purple)' }}
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #F8F6FF 0%, #FFFFFF 40%, #F0FDF9 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
                style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}
              >
                <Clock className="w-3.5 h-3.5" />
                30 minutes. That&apos;s it.
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 text-gray-900">
                Date with<br /><span style={{ color: 'var(--ciq-purple)' }}>proof.</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-4 max-w-lg">
                15 science-backed dimensions. One compatibility score. Zero wasted time.
              </p>
              <p className="text-base text-gray-400 leading-relaxed mb-10 max-w-lg">
                No swiping. No small talk. Just 15 science-backed dimensions that predict whether someone&apos;s actually right for you — starting with 5 free assessments you can knock out over lunch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold rounded-2xl text-white hover:shadow-lg transition-all"
                  style={{ background: 'var(--ciq-purple)' }}
                >
                  Start Free — Takes 30 Min
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-2xl text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  See how it works
                </a>
              </div>
              <p className="mt-6 text-sm text-gray-400">Free forever for 5 core assessments. No credit card needed.</p>
            </div>

            {/* Photo Collage */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-3">
                  <Image src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop&crop=faces" alt="Happy couple" width={400} height={500} className="w-full h-64 object-cover rounded-2xl shadow-sm" />
                  <Image src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=400&h=300&fit=crop&crop=faces" alt="Couple together" width={400} height={300} className="w-full h-44 object-cover rounded-2xl shadow-sm" />
                </div>
                <div className="space-y-3 pt-8">
                  <Image src="https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=400&h=300&fit=crop&crop=faces" alt="Diverse couple" width={400} height={300} className="w-full h-44 object-cover rounded-2xl shadow-sm" />
                  <Image src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=500&fit=crop&crop=faces" alt="Couple on a date" width={400} height={500} className="w-full h-64 object-cover rounded-2xl shadow-sm" />
                </div>
              </div>
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md rounded-2xl px-5 py-3 shadow-lg border border-gray-100">
                <p className="text-xs font-medium text-gray-400 mb-0.5">Avg. Compatibility Score</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--ciq-purple)' }}>
                  84.3<span className="text-sm font-medium text-gray-400">/100</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-wrap justify-center gap-x-12 gap-y-4 text-center">
          {[
            { value: '30 min', label: 'Total Assessment Time' },
            { value: '5', label: 'Free Assessments' },
            { value: '100%', label: 'Free to Match' },
            { value: '0', label: 'Swipes Required', highlight: true },
          ].map((stat) => (
            <div key={stat.label}>
              <p className={`text-2xl font-bold ${stat.highlight ? '' : 'text-gray-900'}`} style={stat.highlight ? { color: 'var(--ciq-purple)' } : undefined}>
                {stat.value}
              </p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Intake Pre-Questions */}
      <section id="intake" className="max-w-3xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--ciq-purple)' }}>Before We Start</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Let&apos;s get the basics out of the way</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Takes 60 seconds. We use this to personalize your assessment and make sure your matches actually make sense for you.</p>
        </div>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 lg:p-10 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What should we call you?</label>
            <input type="text" placeholder="First name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Where are you based?</label>
            <input type="text" placeholder="City, State" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I identify as</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all bg-white">
                <option value="">Select</option>
                <option>Woman</option>
                <option>Man</option>
                <option>Non-binary</option>
                <option>Prefer to self-describe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I&apos;m interested in</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all bg-white">
                <option value="">Select</option>
                <option>Women</option>
                <option>Men</option>
                <option>Everyone</option>
                <option>Prefer to self-describe</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sexual orientation <span className="text-gray-400 font-normal">(optional)</span></label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-500 focus:outline-none focus:border-[#7B68B5] focus:ring-2 focus:ring-[#7B68B5]/20 transition-all bg-white">
              <option value="">Prefer not to say</option>
              <option>Straight</option>
              <option>Gay</option>
              <option>Lesbian</option>
              <option>Bisexual</option>
              <option>Pansexual</option>
              <option>Asexual</option>
              <option>Queer</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">What are you looking for?</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { title: 'Long-term relationship', sub: 'Ready for the real thing' },
                { title: 'Marriage-minded', sub: 'Looking for a partner, not a placeholder' },
                { title: 'Something fun', sub: 'Open to where it goes' },
                { title: 'Not sure yet', sub: "Figuring it out — that's okay" },
              ].map((goal) => (
                <label key={goal.title} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-[#7B68B5]/40 hover:bg-[#EDE9F6]/30 transition-all">
                  <input type="radio" name="goal" className="accent-[#7B68B5] w-4 h-4" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{goal.title}</p>
                    <p className="text-xs text-gray-400">{goal.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <button className="w-full py-4 rounded-2xl text-white font-semibold hover:opacity-90 transition-all text-base" style={{ background: 'var(--ciq-purple)' }}>
            Start My Assessment →
          </button>
          <p className="text-center text-xs text-gray-400">Your info stays private. We never share it with matches without your permission.</p>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--ciq-purple)' }}>How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">5 assessments. 30 minutes. Real matches.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Every assessment is free. Complete all five and start getting matched with people who are actually compatible — scored across the dimensions that predict real relationships.</p>
          </div>

          {/* 5 Core Assessments */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                <Check className="w-3 h-3" />
                100% FREE
              </span>
              <p className="text-sm font-medium text-gray-500">~30 minutes total &bull; 5 assessments &bull; ~6 min each</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Heart, title: 'Values & Priorities', desc: "What actually matters to you in a partner — beyond the surface.", num: '01' },
                { icon: Lock, title: 'Attachment Style', desc: "How you connect, pull close, or push away — and why it matters.", num: '02' },
                { icon: MessageCircle, title: 'Communication & Conflict', desc: "How you fight matters more than how you flirt.", num: '03' },
                { icon: Brain, title: 'Emotional Intelligence', desc: "Can they read a room? Can you? This one's a mirror.", num: '04' },
                { icon: TrendingUp, title: 'Lifestyle & Ambition', desc: 'Because "work-life balance" means something different to everyone.', num: '05' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-purple-50 group-hover:scale-110 transition-transform" style={{ color: 'var(--ciq-purple)' }}>
                      <item.icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="text-xs font-bold text-gray-200">{item.num}</span>
                  </div>
                  <h4 className="text-base font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-gray-300">
                    <Clock className="w-3 h-3" />
                    ~6 min
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What Happens After */}
          <div className="rounded-2xl p-8 bg-white border border-gray-100 shadow-sm">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}>
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Complete 5 assessments</h4>
                <p className="text-sm text-gray-400">Free. ~30 minutes. Do them over lunch.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}>
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Get your Resonances</h4>
                <p className="text-sm text-gray-400">See how many people you&apos;re compatible with. Names, scores, and the ability to message — free.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}>
                  <ArrowRight className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Go deeper with Reports</h4>
                <p className="text-sm text-gray-400">Unlock the full compatibility breakdown for any match — where you align, where you&apos;ll clash, and how to navigate it.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing — Resonance Reports + CIQ Pro */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--ciq-purple)' }}>Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Matching is free. Insight is premium.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">You&apos;ll see your matches, their names, and your compatibility score — all free. The Resonance Report tells you <em>why</em> you match and what to watch for.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Resonance Report */}
            <div className="rounded-2xl p-7 bg-white border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Resonance Report</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$4.99</span>
                <span className="text-sm text-gray-400">per match</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">The full compatibility deep dive for one match. Know exactly where you align and where to watch out.</p>
              <ul className="space-y-3 mb-8">
                {['Dimension-by-dimension breakdown', 'Your strengths as a pair', 'Friction points & how to navigate them', 'Personalized conversation starters'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#7B68B5] hover:text-[#7B68B5] transition-all">
                Unlock a Report
              </button>
            </div>
            {/* CIQ Pro */}
            <div className="rounded-2xl p-7 bg-white border-2 shadow-sm relative" style={{ borderColor: 'var(--ciq-purple)', boxShadow: '0 0 40px rgba(123,104,181,0.15)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold" style={{ background: 'var(--ciq-purple)' }}>MOST POPULAR</div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--ciq-purple)' }}>CIQ Pro</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$14.99</span>
                <span className="text-sm text-gray-400">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">3 reports and you&apos;ve already paid for this</p>
              <p className="text-sm text-gray-500 mb-6">Unlimited reports, priority matching, and features that serious daters actually want.</p>
              <ul className="space-y-3 mb-8">
                {['Unlimited Resonance Reports', 'Priority Match Queue', 'Re-take any assessment', 'Compatibility Trends across matches', 'Read Receipts in messaging', 'Who Viewed Your Profile'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: 'var(--ciq-purple)' }}>
                Go Pro
              </button>
            </div>
            {/* Founding Member */}
            <div className="rounded-2xl p-7 bg-white border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl text-[10px] font-bold text-white" style={{ background: 'var(--ciq-coral)' }}>LIMITED</div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Founding Member</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$9.99</span>
                <span className="text-sm text-gray-400">/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Locked in forever &bull; <span style={{ color: 'var(--ciq-coral)' }}>First 1,000 only</span></p>
              <p className="text-sm text-gray-500 mb-6">Everything in CIQ Pro at the early adopter price. This rate never goes up — ever.</p>
              <ul className="space-y-3 mb-8">
                {['Everything in CIQ Pro', '$9.99/mo locked for life', 'Early adopter pricing', 'Help shape the product'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 text-white hover:opacity-90 transition-all" style={{ background: 'var(--ciq-coral)', borderColor: 'var(--ciq-coral)' }}>
                Claim Founding Rate
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-3">
              <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=faces" alt="Confident man" width={400} height={500} className="w-full h-72 object-cover rounded-2xl shadow-sm" />
              <Image src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop&crop=faces" alt="Confident woman" width={400} height={500} className="w-full h-72 object-cover rounded-2xl shadow-sm mt-8" />
              <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop&crop=faces" alt="Woman smiling" width={400} height={500} className="w-full h-72 object-cover rounded-2xl shadow-sm -mt-4" />
              <Image src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=faces" alt="Man portrait" width={400} height={500} className="w-full h-72 object-cover rounded-2xl shadow-sm mt-4" />
            </div>
            <div>
              <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--ciq-purple)' }}>Built for people who are done wasting time</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Chemistry fades.<br />Compatibility compounds.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-6">
                You&apos;ve built a career, raised kids, rebuilt yourself after something hard. You don&apos;t need another app that ranks people by jawlines. You need one that respects your time and actually works.
              </p>
              <div className="space-y-4">
                {[
                  'Validated psychometric instruments — not a BuzzFeed quiz',
                  'Assessments are free. Matching is free. Messaging is free.',
                  'Designed for professionals, parents, and people rebuilding — not 22-year-olds swiping at brunch',
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--ciq-purple-light)' }}>
                      <Check className="w-3.5 h-3.5" style={{ color: 'var(--ciq-purple)' }} />
                    </div>
                    <p className="text-gray-600 text-sm">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 lg:px-12 py-16">
        <div
          className="rounded-3xl p-12 lg:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #7B68B5 0%, #9B8DD0 100%)' }}
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-white">
            30 minutes now.<br />Zero bad dates later.
          </h2>
          <p className="text-lg mb-10 max-w-lg mx-auto text-white/80">
            Your free assessment is waiting. Five dimensions, no credit card, and the kind of clarity you wish you had three relationships ago.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold rounded-2xl bg-white hover:shadow-xl transition-all"
            style={{ color: 'var(--ciq-purple)' }}
          >
            Start Free Assessment
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-10 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="CompatibleIQ" width={150} height={38} className="h-9 w-auto opacity-60" />
            <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Pivot Training & Development</span>
          </div>
          <p className="text-xs text-gray-400">CompatibleIQ is not a clinical diagnostic tool.</p>
        </div>
      </footer>
    </div>
  )
}
