// CompatibleIQ -- Welcome Email Template

import {
  baseLayout,
  ctaButton,
  CIQ_PURPLE,
  CIQ_GREEN,
  CIQ_CORAL,
  CIQ_DARK,
  CIQ_GRAY_TEXT,
  CIQ_BODY_TEXT,
} from './shared'

export interface WelcomeTemplateData {
  firstName: string
}

export function welcomeTemplate(data: WelcomeTemplateData): string {
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
