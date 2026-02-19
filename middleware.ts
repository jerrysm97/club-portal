// middleware.ts — Route protection per CONTEXT §10.2
// Protects all /portal/* routes except login, signup, and pending.
// Uses service role to check member status server-side.

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes inside /portal that don't require auth
const PUBLIC_PORTAL_PATHS = ['/portal/login', '/portal/signup', '/portal/pending', '/portal/register']

export async function middleware(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl

    // Only run on portal routes
    if (!pathname.startsWith('/portal')) {
        return NextResponse.next()
    }

    // Allow public portal paths through
    if (PUBLIC_PORTAL_PATHS.some(p => pathname.startsWith(p))) {
        return NextResponse.next()
    }

    // ── Step 1: Build response object (needed for cookie forwarding) ──
    let response = NextResponse.next({
        request: { headers: request.headers },
    })

    // ── Step 2: Check session with anon client ──
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    response = NextResponse.next({ request: { headers: request.headers } })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.redirect(new URL('/portal/login', request.url))
    }

    // ── Step 3: Check member status with admin client (bypasses RLS) ──
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
            .select('role, status')
            .eq('user_id', session.user.id)
            .single()

        if (error || !member) {
            // No member row — redirect to pending
            return NextResponse.redirect(new URL('/portal/pending', request.url))
        }

        // ── Step 4: Handle member status ──
        if (member.status === 'pending') {
            return NextResponse.redirect(new URL('/portal/pending', request.url))
        }

        if (member.status === 'rejected' || member.status === 'banned') {
            // Must sign out server-side to clear the session cookie before redirecting
            const signOutResponse = NextResponse.redirect(
                new URL('/portal/login?error=access_denied', request.url)
            )
            // Clear the Supabase auth cookies
            request.cookies.getAll().forEach(cookie => {
                if (cookie.name.startsWith('sb-')) {
                    signOutResponse.cookies.set(cookie.name, '', { maxAge: 0, path: '/' })
                }
            })
            return signOutResponse
        }

        // ── Step 5: Admin-only route guard ──
        if (pathname.startsWith('/portal/admin')) {
            if (!['admin', 'superadmin'].includes(member.role)) {
                return NextResponse.redirect(new URL('/portal/dashboard', request.url))
            }
        }

        return response
    } catch (err) {
        console.error('[middleware] DB error:', err)
        return NextResponse.redirect(new URL('/portal/login?error=server_error', request.url))
    }
}

export const config = {
    matcher: ['/portal/:path*'],
}
