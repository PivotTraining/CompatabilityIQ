// CompatibleIQ -- Shared Email Layout & Helpers

export const CIQ_PURPLE = '#7B68B5'
export const CIQ_GREEN = '#4CAF8A'
export const CIQ_CORAL = '#E8735A'
export const CIQ_DARK = '#1a1a2e'
export const CIQ_LIGHT_BG = '#f8f7fc'
export const CIQ_GRAY_TEXT = '#6b7280'
export const CIQ_BODY_TEXT = '#374151'

export function baseLayout(content: string): string {
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

export function ctaButton(text: string, url: string, color: string = CIQ_PURPLE): string {
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
