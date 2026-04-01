// CompatibleIQ -- Report Ready Email Template

import {
  baseLayout,
  ctaButton,
  CIQ_PURPLE,
  CIQ_DARK,
  CIQ_BODY_TEXT,
} from './shared'

export interface ReportReadyTemplateData {
  firstName: string
  reportType: string
}

export function reportReadyTemplate(data: ReportReadyTemplateData): string {
  const reportLabel = data.reportType === 'resonance'
    ? 'Resonance Report'
    : data.reportType === 'self-discovery'
      ? 'Self-Discovery Report'
      : 'Compatibility Report'

  return baseLayout(`
    <h2 style="margin:0 0 16px;font-size:22px;color:${CIQ_DARK};font-weight:700;">
      Your ${reportLabel} is Ready
    </h2>
    <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${CIQ_BODY_TEXT};">
      Hey ${data.firstName}, your <strong>${reportLabel}</strong> has been generated and is ready to view.
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
    ${ctaButton('View Report', 'https://compatibleiq.com/app/reports', CIQ_PURPLE)}
  `)
}
