// CompatibleIQ -- Match Notification Email Template

import {
  baseLayout,
  ctaButton,
  CIQ_DARK,
  CIQ_GREEN,
  CIQ_PURPLE,
  CIQ_CORAL,
  CIQ_LIGHT_BG,
  CIQ_GRAY_TEXT,
  CIQ_BODY_TEXT,
} from './shared'

export interface MatchNotificationTemplateData {
  firstName: string
  matchName: string
  cisScore: number
}

export function matchNotificationTemplate(data: MatchNotificationTemplateData): string {
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
