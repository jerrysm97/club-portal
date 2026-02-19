// app/api/contact/route.ts
// Contact form API — saves to contact_messages table AND sends via Resend.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role to bypass RLS for inserting contact messages
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
    try {
        const { name, email, subject, message } = await req.json()

        // Server-side validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
        }

        // Save to contact_messages table
        const { error: dbError } = await supabaseAdmin.from('contact_messages').insert({
            name,
            email,
            subject,
            message,
        })

        if (dbError) throw dbError

        // Send email via Resend (optional — only fires if RESEND_API_KEY is set)
        if (process.env.RESEND_API_KEY) {
            await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'IIMS Cyber Club <onboarding@resend.dev>',
                    to: ['cybersec@iimscollege.edu.np'],
                    subject: `New Contact: ${subject} — IIMS Cybersecurity Club`,
                    text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
                }),
            })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('Contact route error:', err)
        return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
    }
}
