import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | CompatibleIQ',
  description: 'Terms of Service for CompatibleIQ, a psychometric compatibility platform by Pivot Training & Development.',
}

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--ciq-purple)' }}>Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: March 2026</p>

        <div className="space-y-10 text-gray-700 leading-relaxed">
          {/* 1 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to Terms</h2>
            <p>
              By creating an account or using CompatibleIQ (the &quot;Platform&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). CompatibleIQ is operated by <strong>Pivot Training &amp; Development</strong> (&quot;Company,&quot; &quot;we,&quot; &quot;us&quot;). If you do not agree to these Terms, do not use the Platform.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
            <p>You must be at least 18 years old to use CompatibleIQ. By using the Platform you represent and warrant that you are at least 18 years of age and have the legal capacity to enter into these Terms.</p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Account Registration</h2>
            <p className="mb-3">When you register, you agree to provide accurate, current, and complete information, including your first name, location (city and state), gender identity, and relationship preferences. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
            <p>We reserve the right to suspend or terminate any account that contains false or misleading profile information.</p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Psychometric Assessments</h2>
            <p className="mb-3">CompatibleIQ offers six psychometric assessments covering values, attachment style, communication, emotional intelligence, lifestyle, and love languages. These assessments are provided free of charge and are required before you can be matched with other users.</p>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 my-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Important Disclaimer</p>
              <p className="text-sm text-gray-600">
                CompatibleIQ is <strong>not</strong> a clinical, diagnostic, or therapeutic tool. Our assessments are designed for compatibility matching purposes only and are not a substitute for professional psychological, psychiatric, or medical advice. Do not rely on assessment results for mental health decisions.
              </p>
            </div>
            <p>Assessment results are used to generate compatibility scores between users. You acknowledge that compatibility scores are probabilistic estimates and do not guarantee relationship success.</p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Compatibility Scores &amp; Matching</h2>
            <p className="mb-3">Once you complete all six assessments, you will be matched with other users based on a proprietary Compatibility Intelligence Score (CIS). Matching, viewing match names, and basic compatibility scores are free.</p>
            <p>We do not guarantee the accuracy of compatibility predictions, nor do we guarantee that any match will result in a successful relationship. Compatibility scores are tools for exploration, not promises.</p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Paid Features &amp; Billing</h2>
            <p className="mb-3">CompatibleIQ offers optional paid features:</p>
            <ul className="list-disc list-inside space-y-1 mb-3 text-sm">
              <li><strong>Resonance Reports</strong> &mdash; $4.99 per match (one-time purchase)</li>
              <li><strong>CIQ Pro subscription</strong> &mdash; $14.99/month (recurring)</li>
            </ul>
            <p className="mb-3">Payments are processed through Stripe. By purchasing, you authorize us to charge the payment method on file. Subscriptions renew automatically until cancelled. You may cancel your CIQ Pro subscription at any time from your account settings; cancellation takes effect at the end of the current billing cycle.</p>
            <p>Resonance Reports are non-refundable once delivered. Subscription refunds are handled on a case-by-case basis at our sole discretion.</p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Messaging &amp; Communication</h2>
            <p className="mb-3">CompatibleIQ provides in-app messaging between matched users. Messages are text and emoji only &mdash; photo sharing is not supported. To protect user safety, our system automatically redacts personally identifiable information (PII) from messages, including phone numbers, email addresses, URLs, and social media handles.</p>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
              <li>Send harassing, threatening, or abusive messages</li>
              <li>Attempt to circumvent PII redaction filters</li>
              <li>Use messaging for commercial solicitation or spam</li>
              <li>Impersonate another person</li>
            </ul>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Personal Safety Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 my-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">Meeting in Person</p>
              <p className="text-sm text-gray-600">
                CompatibleIQ is <strong>not responsible</strong> for any interactions, meetings, or exchanges of personal information that occur outside the Platform. If you choose to meet someone in person, exercise caution: meet in a public place, tell a friend or family member your plans, and do not share your home address, financial information, or other sensitive details until you have established trust.
              </p>
            </div>
            <p>Your location is displayed as city and state only &mdash; we never share exact coordinates or street-level addresses. However, you are solely responsible for the information you choose to share with other users both on and off the Platform.</p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. User Conduct</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use the Platform for any unlawful purpose</li>
              <li>Create multiple accounts or use another person&apos;s account</li>
              <li>Scrape, harvest, or collect information about other users</li>
              <li>Upload viruses or malicious code</li>
              <li>Interfere with the Platform&apos;s operation or security</li>
              <li>Attempt to reverse-engineer our compatibility algorithms or scoring systems</li>
            </ul>
            <p className="mt-3">We reserve the right to suspend or terminate your account for violation of these Terms, with or without notice.</p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Intellectual Property</h2>
            <p>All content, algorithms, scoring models, assessment instruments, branding, and software on the Platform are the property of Pivot Training &amp; Development and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the Platform without our written consent.</p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Limitation of Liability</h2>
            <p className="mb-3">To the maximum extent permitted by law, CompatibleIQ and Pivot Training &amp; Development shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Interactions or meetings with other users</li>
              <li>Reliance on compatibility scores or assessment results</li>
              <li>Unauthorized access to your account</li>
              <li>Service interruptions or data loss</li>
            </ul>
            <p className="mt-3">Our total liability for any claims arising from these Terms or your use of the Platform is limited to the amount you paid to us in the 12 months preceding the claim.</p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Pivot Training &amp; Development, its officers, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys&apos; fees) arising from your use of the Platform, your violation of these Terms, or your violation of any third-party rights.</p>
          </section>

          {/* 13 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Termination</h2>
            <p>You may delete your account at any time from your account settings. Upon deletion, your profile, assessment data, messages, and compatibility scores will be permanently removed in accordance with our <Link href="/privacy" className="underline font-medium" style={{ color: 'var(--ciq-purple)' }}>Privacy Policy</Link>. We may also terminate or suspend your account at our discretion for violation of these Terms.</p>
          </section>

          {/* 14 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Dispute Resolution</h2>
            <p>Any disputes arising from these Terms or your use of the Platform shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. You agree to waive your right to a jury trial and to participate in class action lawsuits.</p>
          </section>

          {/* 15 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. If we make material changes, we will notify you via email or an in-app notification at least 30 days before the changes take effect. Your continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.</p>
          </section>

          {/* 16 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Delaware, without regard to conflict-of-law principles.</p>
          </section>

          {/* 17 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">17. Contact</h2>
            <p>If you have questions about these Terms, contact us at:</p>
            <p className="mt-2 text-sm">
              <strong>Pivot Training &amp; Development</strong><br />
              Email: legal@compatibleiq.com
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
