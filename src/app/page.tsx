import Link from 'next/link'
import Image from 'next/image'
import { Brain, Heart, Shield, TrendingUp, Lock, Sparkles, ArrowRight, Check, Clock, MessageCircle, Flame, DollarSign, Zap, RefreshCw, Eye, BarChart3, SmilePlus } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
            <span className="text-white font-bold text-sm tracking-tight">C</span>
          </div>
          <span className="font-semibold text-xl tracking-tight text-gray-900">CompatibleIQ</span>
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
                Know before<br />you <span style={{ color: 'var(--ciq-purple)' }}>fall.</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-500 leading-relaxed mb-4 max-w-lg">
                What your ex took 3 years to show you, we&apos;ll reveal in 30 minutes.
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
            { value: '30 min', label: 'Free Assessment' },
            { value: '5', label: 'Free Dimensions' },
            { value: '15', label: 'Total Dimensions' },
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">30 minutes to clarity. The rest is up to you.</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">Start with 5 free assessments that build your compatibility profile. Then go deeper with 10 premium dimensions that sharpen your matches from &quot;probably&quot; to &quot;definitely.&quot;</p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Your Match Clarity</p>
              <p className="text-xs text-gray-400">The more you complete, the sharper your matches</p>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full" style={{ width: '33%', background: 'linear-gradient(90deg, #7B68B5, #9B8DD0)' }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold" style={{ color: 'var(--ciq-purple)' }}>5 Free Assessments</span>
              <span className="text-gray-400">+ 10 Premium Dimensions</span>
              <span className="text-gray-400">Full Compatibility Profile</span>
            </div>
          </div>

          {/* Free Tier */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                <Check className="w-3 h-3" />
                FREE
              </span>
              <p className="text-sm font-medium text-gray-500">~30 minutes total &bull; 5 assessments &bull; ~6 min each</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Heart, title: 'Values & Priorities', desc: "What actually matters to you in a partner — beyond the surface." },
                { icon: Lock, title: 'Attachment Style', desc: "How you connect, pull close, or push away — and why it matters." },
                { icon: MessageCircle, title: 'Communication & Conflict', desc: "How you fight matters more than how you flirt." },
                { icon: Sparkles, title: 'Love Languages', desc: "The difference between feeling loved and just being in a relationship." },
                { icon: TrendingUp, title: 'Lifestyle & Ambition', desc: 'Because "work-life balance" means something different to everyone.' },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50" style={{ color: 'var(--ciq-purple)' }}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-400">~6 min</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Nudge */}
          <div className="rounded-2xl p-6 border mb-8 text-center" style={{ background: 'rgba(237,233,246,0.5)', borderColor: 'rgba(123,104,181,0.1)' }}>
            <p className="text-sm text-gray-600">
              <span className="font-semibold" style={{ color: 'var(--ciq-purple)' }}>After your free assessments</span>, you&apos;ll see preliminary match indicators — enough to know there&apos;s real potential out there.
              Unlock premium dimensions to go from <em>&quot;this person might work&quot;</em> to <em>&quot;this person gets me.&quot;</em>
            </p>
          </div>

          {/* Premium Tier */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--ciq-purple-light)', color: 'var(--ciq-purple)' }}>
                <Sparkles className="w-3 h-3" />
                PREMIUM
              </span>
              <p className="text-sm font-medium text-gray-500">~7 minutes each &bull; Unlock individually or as bundles</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon: Flame, title: 'Sexual Compatibility', desc: "Expectations, drives, and intimacy languages — the stuff people avoid until it's too late.", color: 'var(--ciq-coral)', bg: 'rgb(255 237 213)', popular: true },
                { icon: DollarSign, title: 'Financial Intelligence', desc: "Money breaks up more couples than infidelity. Know where you align first.", color: 'var(--ciq-green)', bg: 'rgb(236 253 245)', popular: true },
                { icon: Brain, title: 'Emotional Intelligence', desc: "Can they read a room? Can you? This one's a mirror.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: Shield, title: 'Trust & Accountability', desc: 'Do they own their stuff? This dimension filters out the "it\'s never my fault" crowd.', color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: SmilePlus, title: 'Empathy & Safety', desc: "Relational safety isn't a nice-to-have. It's the baseline.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: RefreshCw, title: 'Growth Mindset', desc: "Are they evolving or stuck? Growth is the difference between year 1 and year 10.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: Zap, title: 'Neurobiology', desc: "Your nervous system has a type. Know yours.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: Brain, title: 'Cognitive Style', desc: "Head vs. heart. Planning vs. vibing. How you two think changes everything.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: Eye, title: 'Dependency Patterns', desc: "Independent or codependent? There's a sweet spot — and most people miss it.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
                { icon: BarChart3, title: 'Long-Term Vision', desc: "Kids? Cities? Retirement age? The big-picture stuff that blindsides couples at year 3.", color: 'var(--ciq-purple)', bg: 'rgb(243 232 255)', popular: false },
              ].map((item) => (
                <div key={item.title} className={`rounded-2xl p-5 bg-white shadow-sm relative ${item.popular ? 'border border-[#7B68B5]/20' : 'border border-gray-100'}`}>
                  {item.popular && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(232,115,90,0.1)', color: 'var(--ciq-coral)' }}>POPULAR</div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: item.bg, color: item.color }}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-gray-400">~7 min</span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3 tracking-wide uppercase" style={{ color: 'var(--ciq-purple)' }}>Pricing</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Go deeper. Match sharper.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Your 5 free assessments give you a foundation. Premium dimensions turn a hunch into a match you can trust.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Single */}
            <div className="rounded-2xl p-7 bg-white border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Single Dimension</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">$2.99</span>
                <span className="text-sm text-gray-400">each</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">Pick any premium dimension. ~7 minutes per assessment.</p>
              <ul className="space-y-3 mb-8">
                {['Unlock any single dimension', 'Improves match accuracy immediately', 'Pay only for what you want'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#7B68B5] hover:text-[#7B68B5] transition-all">
                Add a Dimension
              </button>
            </div>
            {/* Essentials */}
            <div className="rounded-2xl p-7 bg-white border-2 shadow-sm relative" style={{ borderColor: 'var(--ciq-purple)', boxShadow: '0 0 40px rgba(123,104,181,0.15)' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold" style={{ background: 'var(--ciq-purple)' }}>BEST VALUE</div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--ciq-purple)' }}>Essentials Bundle</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$4.99</span>
              </div>
              <p className="text-xs text-gray-400 mb-2"><s>$5.98</s> — Save 17%</p>
              <p className="text-sm text-gray-500 mb-6">Sexual Compatibility + Financial Intelligence. The two dimensions that break the most relationships.</p>
              <ul className="space-y-3 mb-8">
                {['Sexual Compatibility assessment', 'Financial Intelligence assessment', 'Major boost to match confidence'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all" style={{ background: 'var(--ciq-purple)' }}>
                Unlock Essentials
              </button>
            </div>
            {/* Full Profile */}
            <div className="rounded-2xl p-7 bg-white border border-gray-200 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Full Profile</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">$14.99</span>
              </div>
              <p className="text-xs text-gray-400 mb-2"><s>$29.90</s> — Save 50%</p>
              <p className="text-sm text-gray-500 mb-6">All 10 premium dimensions. The complete compatibility picture — no blind spots.</p>
              <ul className="space-y-3 mb-8">
                {['All 10 premium assessments', 'Highest match accuracy possible', 'Priority match queue', 'Detailed compatibility breakdowns'].map((text) => (
                  <li key={text} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--ciq-green)' }} />
                    {text}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#7B68B5] hover:text-[#7B68B5] transition-all">
                Unlock Everything
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
                  'Financial and sexual compatibility scored before the first date',
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
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--ciq-purple)' }}>
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Pivot Training & Development</span>
          </div>
          <p className="text-xs text-gray-400">CompatibleIQ is not a clinical diagnostic tool.</p>
        </div>
      </footer>
    </div>
  )
}
