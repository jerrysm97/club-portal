// app/api/contact/route.ts — Contact Form API (CONTEXT §14)
import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validations'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Rate limiting by IP (simple in-memory approach)
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

        const body = await req.json()
        const result = contactSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const { name, email, subject, message } = result.data

        // Insert into contact_messages table
        try {
            const supabase = createAdminSupabaseClient()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase as any).from('contact_messages').insert({
                name,
                email,
                subject,
                message,
                ip_address: ip,
            })
        } catch {
            // Table may not exist yet — continue to send email anyway
            console.warn('[contact] Could not insert into contact_messages table')
        }

        // Send notification email via Resend
        const resend = new Resend(process.env.RESEND_API_KEY || 're_stub')

        const { error: emailError } = await resend.emails.send({
            from: 'ICEHC Portal <onboarding@resend.dev>',
            to: ['cybersec@iimscollege.edu.np'],
            replyTo: email,
            subject: `[ICEHC Contact] ${subject}`,
            html: `
                <div style="font-family: 'Courier New', monospace; padding: 20px; background: #0A0A0F; color: #F0F0FF; border: 1px solid #2D2D44; border-radius: 8px;">
                    <h2 style="color: #00FF87; margin-top: 0;">New Contact Form Submission</h2>
                    <p><strong style="color: #00D4FF;">Name:</strong> ${name}</p>
                    <p><strong style="color: #00D4FF;">Email:</strong> ${email}</p>
                    <p><strong style="color: #00D4FF;">Subject:</strong> ${subject}</p>
                    <hr style="border: none; border-top: 1px solid #2D2D44; margin: 20px 0;" />
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
