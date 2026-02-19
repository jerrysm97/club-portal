// app/api/contact/route.ts — Contact Form (CONTEXT §14)
import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { Resend } from 'resend'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const result = contactSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const { name, email, subject, message } = result.data

        // Initialize Resend inside the handler to avoid build-time errors when API key is missing
        const resend = new Resend(process.env.RESEND_API_KEY || 're_stub')

        // Send email via Resend
        const { error: emailError } = await resend.emails.send({
            from: 'IIMS Cyber Portal <onboarding@resend.dev>',
            to: ['cybersec@iimscollege.edu.np'],
            replyTo: email,
            subject: `[Contact Form] ${subject}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #58151C; margin-top: 0;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        })

        if (emailError) {
            console.error('[contact] Resend error:', emailError)
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        console.error('[contact] Server error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
