// app/api/auth/register/route.ts — Profile completion for new members (CONTEXT §14)
// FIX #5: Triggers create the member row. This route only UPDATES it with profile info.
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { registerSchema } from '@/lib/validations'
import { registerLimiter } from '@/lib/ratelimit'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const session = await getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })
        }

        // 1. Rate limiting
        const { success, limit, remaining, reset } = await registerLimiter.limit(session.user.id)
        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString()
                    }
                }
            )
        }

        const body = await req.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 })
        }

        const { full_name, student_id, program, intake, bio, skills } = result.data
        const supabaseAdmin = createServerClient()

        // 2. ONLY UPDATE the existing members row using user_id FK
        // The DB trigger trg_auth_user_created has already created this row.
        // club_post is deliberately NOT set here; defaults to 'General Member' via DB.
        const { error } = await supabaseAdmin
            .from('members')
            .update({
                full_name,
                student_id: student_id || null,
                program: program || null,
                intake: intake || null,
                bio: bio || null,
                skills,
                // Status remains 'pending'
            })
            .eq('user_id', session.user.id)

        if (error) {
            console.error('[register] update failed:', error)
            return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('[register] Unexpected error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
