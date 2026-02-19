// app/auth/callback/route.ts
// This route handles the magic link redirect from Supabase.
// When a user clicks the magic link in their email, they land here.
// This code exchanges the temporary auth code for a real session cookie.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)

    // Supabase sends a "code" parameter in the URL after the user clicks the magic link
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const cookieStore = await cookies()

        // Create a Supabase server client with cookie access
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    },
                },
            }
        )

        // Exchange the temporary code for a real user session
        await supabase.auth.exchangeCodeForSession(code)
    }

    // After session is created, redirect to dashboard
    // The middleware will then check their member status and redirect accordingly
    return NextResponse.redirect(new URL('/portal/dashboard', requestUrl.origin))
}
