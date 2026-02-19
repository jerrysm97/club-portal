// middleware.ts
// Route protection middleware — ONLY protects /portal/dashboard/* and /portal/admin/* routes.
// Public routes (/, /about, /events, /contact) pass through with NO checks.
// /portal/login and /portal/pending are also open (no auth needed).
// Uses service_role key to bypass RLS when checking member status.

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // =====================================================
    // STEP 1: Only protect portal dashboard and admin routes
    // Everything else passes through freely (public website, login, pending)
    // =====================================================
    const protectedPaths = ['/portal/dashboard', '/portal/admin']
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path))

    if (!isProtected) {
        return NextResponse.next()
    }

    // =====================================================
    // STEP 2: Create Supabase client to check user session
    // This client uses the anon key and reads cookies from the request
    // =====================================================
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({ request: { headers: request.headers } })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // =====================================================
    // STEP 3: Check if user has an active session
    // If no session → redirect to portal login
    // =====================================================
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.redirect(new URL('/portal/login', request.url))
    }

    // =====================================================
    // STEP 4: Check member status using service role (bypasses RLS)
    // Wrapped in try/catch — if database is unreachable, redirect safely
    // =====================================================
    try {
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

        const { data: member, error } = await adminClient
            .from('members')
            .select('status, role')
            .eq('id', session.user.id)
            .single()

        if (error) throw error

        // =====================================================
        // STEP 5: Handle different member statuses
        // =====================================================

        // No member record found — create one with pending status
        if (!member) {
            await adminClient.from('members').insert({
                id: session.user.id,
                email: session.user.email,
                status: 'pending',
                role: 'member',
            })
            return NextResponse.redirect(new URL('/portal/pending', request.url))
        }

        // Member is pending → send to pending page
        if (member.status === 'pending') {
            return NextResponse.redirect(new URL('/portal/pending', request.url))
        }

        // Member was rejected → sign out & send to login with error
        if (member.status === 'rejected') {
            return NextResponse.redirect(new URL('/portal/login?error=access_denied', request.url))
        }

        // Admin routes — only admins can access /portal/admin
        if (pathname.startsWith('/portal/admin') && member.role !== 'admin') {
            return NextResponse.redirect(new URL('/portal/dashboard', request.url))
        }

        // Member is approved → let them through!
        return response

    } catch (err) {
        // =====================================================
        // CATCH: Database unreachable or query failed
        // Redirect to login with a friendly error instead of crashing
        // =====================================================
        console.error('Middleware DB error:', err)
        return NextResponse.redirect(new URL('/portal/login?error=server_error', request.url))
    }
}

// Only run middleware on portal protected routes
export const config = {
    matcher: ['/portal/dashboard/:path*', '/portal/admin/:path*'],
}
