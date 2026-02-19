// lib/email/templates.ts — IIMS Collegiate branded emails via Resend (CONTEXT §16)
import { Resend } from 'resend'

// Lazy initialization function to avoid build-time errors
function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 're_stub')
}

const FROM = 'IIMS Cybersecurity Club <cybersec@iimscollege.edu.np>'

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const resend = getResend()
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'Welcome to IIMS Cybersecurity Club!',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#58151C;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-family:Poppins,sans-serif;font-size:22px">IIMS Cybersecurity Club</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#111827;font-family:Poppins,sans-serif">Welcome, ${name}!</h2>
          <p style="color:#6B7280;line-height:1.6">Your membership application has been approved. You now have full access to the IIMS Cyber Portal.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/login"
             style="display:inline-block;background:#C3161C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
            Access Portal
          </a>
          <p style="color:#9CA3AF;font-size:13px;margin-top:24px">If you have any questions, contact us at cybersec@iimscollege.edu.np</p>
        </div>
        <div style="background:#F9FAFB;padding:16px;text-align:center">
          <p style="color:#9CA3AF;font-size:12px;margin:0">IIMS College, Dillibazar, Kathmandu, Nepal</p>
        </div>
      </div>
    `,
  })
}

export async function sendRejectionEmail(to: string, name: string): Promise<void> {
  const resend = getResend()
  await resend.emails.send({
    from: FROM,
    to,
    subject: 'IIMS Cybersecurity Club — Application Update',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#58151C;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-family:Poppins,sans-serif;font-size:22px">IIMS Cybersecurity Club</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#111827;font-family:Poppins,sans-serif">Dear ${name},</h2>
          <p style="color:#6B7280;line-height:1.6">Thank you for your interest in joining the IIMS Cybersecurity Club. After careful review, we are unable to approve your application at this time.</p>
          <p style="color:#6B7280;line-height:1.6">For more information, please contact us at <a href="mailto:cybersec@iimscollege.edu.np" style="color:#C3161C">cybersec@iimscollege.edu.np</a>.</p>
        </div>
        <div style="background:#F9FAFB;padding:16px;text-align:center">
          <p style="color:#9CA3AF;font-size:12px;margin:0">IIMS College, Dillibazar, Kathmandu, Nepal</p>
        </div>
      </div>
    `,
  })
}
