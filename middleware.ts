// middleware.ts
// Runs BEFORE every page load for matched routes.
// Checks login status and member status, then redirects accordingly.
// IMPORTANT: Uses the service role key to bypass RLS for status checks.

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    let res = NextResponse.next()

    // Create a Supabase client with the user's cookies (for session checking)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        req.cookies.set(name, value)
                    })
                    res = NextResponse.next({ request: req })
                    cookiesToSet.forEach(({ name, value, options }) => {
                        res.cookies.set(name, value, options)
                    })
                },
            },
        }
    )

    // Check if the user has a valid session
    const {
        data: { session },
    } = await supabase.auth.getSession()

    const url = req.nextUrl.clone()

    // 1. NOT logged in → redirect protected pages to /login
    if (!session && (
        url.pathname.startsWith('/dashboard') ||
        url.pathname.startsWith('/admin') ||
        url.pathname.startsWith('/pending')
    )) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 2. Logged in → check member status
    if (session) {
        // Use a separate admin client that BYPASSES RLS to read the member record
        // This is necessary because pending users can't read their own record via RLS
        const adminClient = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                cookies: {
                    getAll() { return [] },
                    setAll() { },
                },
            }
        )

        const { data: member } = await adminClient
            .from('members')
            .select('status, role')
            .eq('id', session.user.id)
            .single()

        // If no member record exists, create one with "pending" status
        if (!member) {
            await adminClient.from('members').insert({
                id: session.user.id,
                email: session.user.email,
                status: 'pending',
                role: 'member',
            })

            if (url.pathname !== '/pending') {
                url.pathname = '/pending'
                return NextResponse.redirect(url)
            }
        }

        // Pending → only allow /pending page
        if (member?.status === 'pending' && url.pathname !== '/pending') {
            url.pathname = '/pending'
            return NextResponse.redirect(url)
        }

        // Rejected → sign out and redirect to login
        if (member?.status === 'rejected') {
            await supabase.auth.signOut()
            url.pathname = '/login'
            url.searchParams.set('error', 'Access denied')
            return NextResponse.redirect(url)
        }

        // Approved but still on login/pending → redirect to dashboard
        if (member?.status === 'approved' && (url.pathname === '/login' || url.pathname === '/pending')) {
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }
    }

    return res
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/pending',
        '/login',
    ],
}
