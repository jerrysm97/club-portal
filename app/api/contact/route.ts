// app/api/contact/route.ts
// API route to handle contact form submissions.
// For now, just validates and returns success (no email sending without Resend key).
// TODO: Add Resend integration when RESEND_API_KEY is set.

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, subject, message } = body

        // Validate all required fields
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            )
        }

        // TODO: Uncomment and configure when Resend API key is available
        // const resend = new Resend(process.env.RESEND_API_KEY)
        // await resend.emails.send({
        //   from: 'Club Portal <noreply@yourdomain.com>',
        //   to: 'cyberclub@iimscollege.edu.np',
        //   subject: `New Contact Form: ${subject}`,
        //   html: `
        //     <h2>New Contact Form Submission</h2>
        //     <p><strong>Name:</strong> ${name}</p>
        //     <p><strong>Email:</strong> ${email}</p>
        //     <p><strong>Subject:</strong> ${subject}</p>
        //     <p><strong>Message:</strong></p>
        //     <p>${message}</p>
        //   `
        // })

        // For now, just log and return success
        console.log('Contact form submission:', { name, email, subject, message })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'Failed to process message' },
            { status: 500 }
        )
    }
}
