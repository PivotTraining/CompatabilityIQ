// CompatibleIQ -- Weekly Digest Email Template

import {
  baseLayout,
  ctaButton,
  CIQ_PURPLE,
  CIQ_GREEN,
  CIQ_CORAL,
  CIQ_DARK,
  CIQ_LIGHT_BG,
  CIQ_GRAY_TEXT,
  CIQ_BODY_TEXT,
} from './shared'

export interface WeeklyDigestTemplateData {
  firstName: string
  newMatches: number
  unreadMessages: number
  profileViews: number
  assessmentProgress?: string
}

export function weeklyDigestTemplate(data: WeeklyDigestTemplateData): string {
  const assessmentLine = data.assessmentProgress
    ? `<p style="margin:16px 0 0;font-size:14px;line-height:1.6;color:${CIQ_GRAY_TEXT};text-align:center;">
        Assessment progress: ${data.assessmentProgress}
      </p>`
    : ''

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
    ${assessmentLine}
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
