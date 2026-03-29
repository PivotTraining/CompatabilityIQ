// CompatibleIQ -- Branded Email Templates
// Inline-styled HTML templates compatible with Gmail, Outlook, and Apple Mail

// ═══════════════════════════════════════════
// Brand constants
// ═══════════════════════════════════════════

const CIQ_PURPLE = '#7B68B5'
const CIQ_GREEN = '#4CAF8A'
const CIQ_CORAL = '#E8735A'
const CIQ_DARK = '#1a1a2e'
const CIQ_LIGHT_BG = '#f8f7fc'
const CIQ_GRAY_TEXT = '#6b7280'
const CIQ_BODY_TEXT = '#374151'

// ═══════════════════════════════════════════
// Shared layout wrapper
// ═══════════════════════════════════════════

function baseLayout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CompatibleIQ</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,Helvetica,sans-serif !important;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${CIQ_LIGHT_BG};font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${CIQ_LIGHT_BG};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:${CIQ_PURPLE};border-radius:12px 12px 0 0;padding:28px 32px;text-align:center;">
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                Compatible<span style="color:${CIQ_GREEN};">IQ</span>
              </h1>
              <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;">
                Pivot Training &amp; Development
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:36px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#f3f4f6;border-radius:0 0 12px 12px;padding:24px 32px;text-align:center;">
              <p style="margin:0 0 8px;font-size:12px;color:${CIQ_GRAY_TEXT};">
                &copy; ${new Date().getFullYear()} Pivot Training &amp; Development. All rights reserved.
              </p>
              <p style="margin:0 0 8px;font-size:12px;color:${CIQ_GRAY_TEXT};">
                <a href="https://compatibleiq.com" style="color:${CIQ_PURPLE};text-decoration:none;">compatibleiq.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                <a href="{{unsubscribe_url}}" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a>
                &nbsp;&middot;&nbsp;
                <a href="https://compatibleiq.com/privacy" style="color:#9ca3af;text-decoration:underline;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ═══════════════════════════════════════════
// Helper: CTA button
// ═══════════════════════════════════════════

function ctaButton(text: string, url: string, color: string = CIQ_PURPLE): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto 0;">
      <tr>
        <td style="border-radius:8px;background-color:${color};">
          <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:16px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:8px;mso-padding-alt:0;">
            <!--[if mso]><i style="letter-spacing:32px;mso-font-width:-100%;mso-text-raise:24pt">&nbsp;</i><![endif]-->
            <span style="mso-text-raise:12pt;">${text}</span>
            <!--[if mso]><i style="letter-spacing:32px;mso-font-width:-100%">&nbsp;</i><![endif]-->
          </a>
        </td>
      </tr>
    </table>`
}

// ═══════════════════════════════════════════
// Template: Welcome
// ═══════════════════════════════════════════

export interface WelcomeEmailData {
  firstName: string
}

export function welcomeEmailTemplate(data: WelcomeEmailData): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      Welcome to CompatibleIQ, ${data.firstName}!
    </h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      We are glad you are here. CompatibleIQ uses psychometric science to find people
      you are truly compatible with -- not just people who look good on paper.
    </p>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Here is how to get started:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:36px;height:36px;border-radius:50%;background-color:${CIQ_PURPLE};color:#fff;text-align:center;line-height:36px;font-weight:700;font-size:16px;">1</td>
              <td style="padding-left:16px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:${CIQ_DARK};">Complete your profile</p>
                <p style="margin:4px 0 0;font-size:14px;color:${CIQ_GRAY_TEXT};">Add photos and a bio so others can get to know you.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:36px;height:36px;border-radius:50%;background-color:${CIQ_GREEN};color:#fff;text-align:center;line-height:36px;font-weight:700;font-size:16px;">2</td>
              <td style="padding-left:16px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:${CIQ_DARK};">Take the assessment</p>
                <p style="margin:4px 0 0;font-size:14px;color:${CIQ_GRAY_TEXT};">6 dimensions, ~20 minutes. This powers your compatibility scores.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:12px 0;">
          <table role="presentation" cellpadding="0" cellspacing="0">
            <tr>
              <td style="width:36px;height:36px;border-radius:50%;background-color:${CIQ_CORAL};color:#fff;text-align:center;line-height:36px;font-weight:700;font-size:16px;">3</td>
              <td style="padding-left:16px;">
                <p style="margin:0;font-size:15px;font-weight:600;color:${CIQ_DARK};">Discover your resonances</p>
                <p style="margin:4px 0 0;font-size:14px;color:${CIQ_GRAY_TEXT};">View your most compatible matches and start connecting.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    ${ctaButton('Get Started', 'https://compatibleiq.com/app/onboarding')}
  `)
}

// ═══════════════════════════════════════════
// Template: New Match / Resonance Found
// ═══════════════════════════════════════════

export interface MatchNotificationData {
  firstName: string
  matchName: string
  cisScore: number
}

export function matchNotificationTemplate(data: MatchNotificationData): string {
  const scoreColor = data.cisScore >= 80 ? CIQ_GREEN : data.cisScore >= 60 ? CIQ_PURPLE : CIQ_CORAL
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      New Resonance Found
    </h2>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, great news! You have a new compatibility resonance with <strong>${data.matchName}</strong>.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;text-align:center;">
      <tr>
        <td style="padding:24px 40px;border-radius:12px;background-color:${CIQ_LIGHT_BG};border:2px solid ${scoreColor};">
          <p style="margin:0;font-size:14px;color:${CIQ_GRAY_TEXT};text-transform:uppercase;letter-spacing:1px;">CIS Score</p>
          <p style="margin:8px 0 0;font-size:48px;font-weight:800;color:${scoreColor};line-height:1;">${data.cisScore}</p>
          <p style="margin:4px 0 0;font-size:12px;color:${CIQ_GRAY_TEXT};">out of 100</p>
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:${CIQ_BODY_TEXT};text-align:center;">
      View their profile and start a conversation to see if the science translates to chemistry.
    </p>
    ${ctaButton('View Resonance', 'https://compatibleiq.com/app/matches', CIQ_GREEN)}
  `)
}

// ═══════════════════════════════════════════
// Template: Report Ready
// ═══════════════════════════════════════════

export interface ReportReadyData {
  firstName: string
  matchName: string
}

export function reportReadyTemplate(data: ReportReadyData): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      Your Resonance Report is Ready
    </h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, the deep-dive Resonance Report for your match with
      <strong>${data.matchName}</strong> has been generated and is ready to view.
    </p>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Your report includes:
    </p>
    <ul style="margin:0 0 8px;padding-left:20px;font-size:15px;line-height:1.8;color:${CIQ_BODY_TEXT};">
      <li>Dimension-by-dimension compatibility breakdown</li>
      <li>Strengths and growth areas for your pairing</li>
      <li>Communication style insights</li>
      <li>Personalized conversation starters</li>
    </ul>
    ${ctaButton('View Report', 'https://compatibleiq.com/app/matches', CIQ_PURPLE)}
  `)
}

// ═══════════════════════════════════════════
// Template: Weekly Digest
// ═══════════════════════════════════════════

export interface WeeklyDigestData {
  firstName: string
  newMatches: number
  unreadMessages: number
  profileViews: number
}

export function weeklyDigestTemplate(data: WeeklyDigestData): string {
  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      Your Weekly Digest
    </h2>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, here is what happened on CompatibleIQ this week:
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 8px;">
      <tr>
        <td style="padding:16px 20px;border-radius:8px;background-color:${CIQ_LIGHT_BG};text-align:center;width:33%;">
          <p style="margin:0;font-size:32px;font-weight:800;color:${CIQ_GREEN};">${data.newMatches}</p>
          <p style="margin:4px 0 0;font-size:13px;color:${CIQ_GRAY_TEXT};">New Resonances</p>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:16px 20px;border-radius:8px;background-color:${CIQ_LIGHT_BG};text-align:center;width:33%;">
          <p style="margin:0;font-size:32px;font-weight:800;color:${CIQ_PURPLE};">${data.unreadMessages}</p>
          <p style="margin:4px 0 0;font-size:13px;color:${CIQ_GRAY_TEXT};">Unread Messages</p>
        </td>
        <td style="width:8px;"></td>
        <td style="padding:16px 20px;border-radius:8px;background-color:${CIQ_LIGHT_BG};text-align:center;width:33%;">
          <p style="margin:0;font-size:32px;font-weight:800;color:${CIQ_CORAL};">${data.profileViews}</p>
          <p style="margin:4px 0 0;font-size:13px;color:${CIQ_GRAY_TEXT};">Profile Views</p>
        </td>
      </tr>
    </table>
    ${data.unreadMessages > 0
      ? `<p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:${CIQ_BODY_TEXT};text-align:center;">
          You have unread messages waiting. Do not keep them hanging!
        </p>`
      : `<p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:${CIQ_BODY_TEXT};text-align:center;">
          You are all caught up. Check out your latest resonances!
        </p>`
    }
    ${ctaButton('Open CompatibleIQ', 'https://compatibleiq.com/app/matches')}
  `)
}

// ═══════════════════════════════════════════
// Template: Assessment Reminder
// ═══════════════════════════════════════════

export interface AssessmentReminderData {
  firstName: string
  modulesRemaining: number
  completedModules: number
}

export function assessmentReminderTemplate(data: AssessmentReminderData): string {
  const totalModules = data.completedModules + data.modulesRemaining
  const progressPercent = Math.round((data.completedModules / totalModules) * 100)

  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      You are Almost There!
    </h2>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, you have completed ${data.completedModules} of ${totalModules} assessment modules.
      Just ${data.modulesRemaining} more to go before we can find your most compatible matches.
    </p>
    <!-- Progress bar -->
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding:4px;border-radius:12px;background-color:#e5e7eb;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="${progressPercent}%">
            <tr>
              <td style="height:12px;border-radius:10px;background:linear-gradient(90deg, ${CIQ_PURPLE}, ${CIQ_GREEN});"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <p style="margin:8px 0 0;font-size:13px;color:${CIQ_GRAY_TEXT};text-align:center;">
      ${progressPercent}% complete
    </p>
    <p style="margin:24px 0 0;font-size:15px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Each module takes about 3-4 minutes. The more you complete, the more accurate your
      compatibility scores become.
    </p>
    ${ctaButton('Continue Assessment', 'https://compatibleiq.com/app/assessment', CIQ_GREEN)}
  `)
}
