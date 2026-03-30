import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy Policy for CompatibleIQ. Learn how we collect, store, and protect your psychometric assessment data and personal information.',
  alternates: {
    canonical: 'https://compatibleiq.com/privacy',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 lg:px-12 py-5 max-w-7xl mx-auto border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo.svg" alt="CompatibleIQ" width={200} height={50} className="h-12 w-auto" priority />
        </Link>
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--ciq-purple)' }}>Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introduction</h2>
            <p>
              CompatibleIQ is operated by <strong>Pivot Training &amp; Development</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;). This Privacy Policy explains how we collect, use, share, and protect your personal information when you use the CompatibleIQ platform (the &quot;Platform&quot;), available at compatibleiq.com and hosted on Vercel.
            </p>
            <p className="mt-3">
              We take privacy seriously &mdash; especially given the sensitive nature of psychometric and relationship data. Please read this policy carefully.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.1 Account Information</h3>
            <p>When you register, we collect:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>First name</li>
              <li>Email address</li>
              <li>Password (hashed and salted &mdash; we never store plaintext passwords)</li>
              <li>Location (city and state only)</li>
              <li>Gender identity</li>
              <li>Sexual orientation (optional)</li>
              <li>Relationship preferences and goals</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.2 Psychometric Assessment Data</h3>
            <p>When you complete our six assessments, we collect your responses across the following dimensions:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Values &amp; Priorities</li>
              <li>Attachment Style</li>
              <li>Communication &amp; Conflict Resolution</li>
              <li>Emotional Intelligence</li>
              <li>Lifestyle &amp; Ambition</li>
              <li>How You Love</li>
            </ul>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 my-4">
              <p className="text-sm text-gray-600">
                Assessment response data is <strong>encrypted at rest</strong> in our database. Raw assessment answers are never visible to other users. Only derived compatibility scores and dimension summaries are used for matching.
              </p>
            </div>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.3 Compatibility &amp; Scoring Data</h3>
            <p>We generate and store compatibility scores between you and other users, including dimension-level breakdowns and an overall Compatibility Intelligence Score (CIS). We also maintain internal risk and quality scores for trust and safety purposes; these scores are <strong>never visible</strong> to you or other users.</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.4 Messages</h3>
            <p>We store messages exchanged between matched users. Messages support text and emoji only &mdash; photo sharing is not available. Our system automatically redacts personally identifiable information (phone numbers, email addresses, URLs, and social media handles) from messages before delivery.</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.5 Payment Information</h3>
            <p>Payment processing is handled by <strong>Stripe</strong>. We do not store your full credit card number, CVV, or bank account details on our servers. Stripe provides us with a tokenized reference and basic transaction metadata (amount, date, product purchased).</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">2.6 Automatically Collected Data</h3>
            <p>We may collect standard technical information such as IP address, browser type, device type, operating system, and usage patterns (pages visited, features used, session duration) through server logs and analytics.</p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Create and manage your account</li>
              <li>Score your psychometric assessments and generate compatibility matches</li>
              <li>Display your profile (first name, city/state, and compatibility score) to potential matches</li>
              <li>Facilitate in-app messaging between matched users</li>
              <li>Process payments for Resonance Reports and CIQ Pro subscriptions</li>
              <li>Maintain trust and safety (fraud detection, abuse prevention, internal risk scoring)</li>
              <li>Improve our algorithms, assessments, and user experience</li>
              <li>Send transactional emails (account verification, password resets, payment receipts)</li>
              <li>Communicate product updates and new features (you can opt out at any time)</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How We Share Your Information</h2>
            <p className="mb-3">We do not sell your personal information. We share data only in the following limited circumstances:</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">4.1 With Other Users</h3>
            <p>When matched, other users can see your first name, city/state, compatibility score, and dimension summaries. They cannot see your raw assessment responses, email address, or exact location.</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">4.2 Service Providers</h3>
            <p>We use third-party services to operate the Platform:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li><strong>Supabase</strong> &mdash; Database hosting (PostgreSQL with row-level security)</li>
              <li><strong>Vercel</strong> &mdash; Application hosting and deployment</li>
              <li><strong>Stripe</strong> &mdash; Payment processing</li>
            </ul>
            <p className="mt-2">These providers process data on our behalf and are contractually obligated to protect your information.</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">4.3 Legal Requirements</h3>
            <p>We may disclose information if required by law, subpoena, court order, or government request, or if we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others.</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">4.4 Business Transfers</h3>
            <p>If Pivot Training &amp; Development is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy.</p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Security</h2>
            <p className="mb-3">We implement industry-standard security measures to protect your data:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Assessment data is encrypted at rest</li>
              <li>All data transmitted between your device and our servers is encrypted via TLS/HTTPS</li>
              <li>Database access is controlled through Supabase row-level security (RLS) policies</li>
              <li>Passwords are hashed using bcrypt</li>
              <li>PII is automatically redacted from in-app messages</li>
              <li>Location data is limited to city/state &mdash; we never collect or store exact coordinates</li>
            </ul>
            <p className="mt-3">No system is 100% secure. While we take extensive precautions, we cannot guarantee absolute security of your data.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data Retention</h2>
            <p className="mb-3">We retain your data as follows:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Active accounts:</strong> Data is retained for as long as your account is active.</li>
              <li><strong>Deleted accounts:</strong> Upon account deletion, your profile, assessment responses, compatibility scores, and messages are permanently deleted within 30 days.</li>
              <li><strong>Payment records:</strong> Transaction records are retained for 7 years to comply with tax and financial reporting requirements.</li>
              <li><strong>Anonymized analytics:</strong> Aggregated, anonymized data (which cannot identify you) may be retained indefinitely to improve our assessments and algorithms.</li>
            </ul>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your Rights</h2>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">7.1 All Users</h3>
            <p>Regardless of your location, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li><strong>Access</strong> your personal data</li>
              <li><strong>Correct</strong> inaccurate information</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Export</strong> a copy of your data in a portable format</li>
              <li><strong>Opt out</strong> of marketing communications</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">7.2 GDPR (European Economic Area Residents)</h3>
            <p>If you are in the EEA, you also have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Restrict processing of your data</li>
              <li>Object to processing based on legitimate interests</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time (where processing is based on consent)</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-2">Our legal bases for processing are: consent (assessments), contract performance (account and matching services), and legitimate interests (safety, fraud prevention, product improvement).</p>

            <h3 className="text-base font-semibold text-gray-800 mt-5 mb-2">7.3 CCPA (California Residents)</h3>
            <p>If you are a California resident, you have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Know what personal information we collect and how it is used</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of the sale of personal information (we do not sell your data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, contact us at Hello@PivotTraining.us. We will respond within 30 days (45 days for CCPA requests).</p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Psychometric Data &mdash; Special Considerations</h2>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 my-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Not a Clinical Tool</p>
              <p className="text-sm text-gray-600">
                CompatibleIQ is a compatibility matching platform, <strong>not</strong> a clinical diagnostic or psychological assessment service. Our assessments are designed to measure relationship compatibility dimensions and should not be interpreted as clinical diagnoses or psychological evaluations.
              </p>
            </div>
            <p className="mb-3">We treat psychometric assessment data with heightened care:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Raw assessment responses are encrypted at rest and are never shared with other users</li>
              <li>Only derived scores and compatibility summaries are used for matching</li>
              <li>Assessment data is permanently deleted when you delete your account</li>
              <li>We do not share individual assessment data with advertisers or data brokers</li>
              <li>Internal risk and quality scores derived from your data are never visible to you or other users</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Personal Safety</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 my-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Your Safety Matters</p>
              <p className="text-sm text-gray-600">
                CompatibleIQ is <strong>not responsible</strong> for interactions that take place outside the Platform. We strongly encourage you to exercise caution when sharing personal information or meeting someone in person. Never share your home address, financial details, or other sensitive information with someone you have not met and established trust with.
              </p>
            </div>
            <p>We design our Platform with safety in mind &mdash; city/state-only location display, PII redaction in messages, and text-only messaging &mdash; but ultimately, you are responsible for the information you choose to share and the decisions you make when interacting with other users.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Cookies &amp; Tracking</h2>
            <p className="mb-3">We use essential cookies to keep you logged in and maintain your session. We may also use analytics cookies to understand how the Platform is used. You can manage cookie preferences through your browser settings.</p>
            <p>We do not use advertising cookies or participate in cross-site ad tracking networks.</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Children&apos;s Privacy</h2>
            <p>CompatibleIQ is not intended for anyone under 18 years of age. We do not knowingly collect personal information from minors. If you believe a minor has created an account, please contact us immediately at Hello@PivotTraining.us and we will delete the account.</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. International Data Transfers</h2>
            <p>Your data is stored on servers in the United States via Supabase and Vercel. If you access the Platform from outside the United States, your data will be transferred to and processed in the United States. By using the Platform, you consent to this transfer.</p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email or an in-app notification at least 30 days before the changes take effect. Your continued use of the Platform after changes take effect constitutes acceptance of the updated policy.</p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or want to exercise your data rights, contact us at:</p>
            <p className="mt-2 text-sm">
              <strong>Pivot Training &amp; Development</strong><br />
              Email: Hello@PivotTraining.us
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 lg:px-12 py-10 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Image src="/images/logo.svg" alt="CompatibleIQ" width={150} height={38} className="h-9 w-auto opacity-60" />
            <span className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Pivot Training &amp; Development</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
