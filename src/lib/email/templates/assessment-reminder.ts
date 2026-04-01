// CompatibleIQ -- Assessment Reminder Email Template

import {
  baseLayout,
  ctaButton,
  CIQ_PURPLE,
  CIQ_GREEN,
  CIQ_DARK,
  CIQ_GRAY_TEXT,
  CIQ_BODY_TEXT,
} from './shared'

export interface AssessmentReminderTemplateData {
  firstName: string
  completedModules: number
  totalModules: number
}

export function assessmentReminderTemplate(data: AssessmentReminderTemplateData): string {
  const modulesRemaining = data.totalModules - data.completedModules
  const progressPercent = Math.round((data.completedModules / data.totalModules) * 100)

  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      You are Almost There!
    </h2>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, you have completed ${data.completedModules} of ${data.totalModules} assessment modules.
      Just ${modulesRemaining} more to go before we can find your most compatible matches.
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
