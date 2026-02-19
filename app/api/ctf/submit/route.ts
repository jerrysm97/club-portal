// app/api/ctf/submit/route.ts — CTF flag submission (CONTEXT §14)
// Flag is verified server-side. It is NEVER sent to the client.
import { createClient as createRawClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { ctfSubmitSchema } from '@/lib/validations'

function createAdminClient() {
    return createRawClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // ── 1. Verify session ──
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // ── 2. Validate input ──
        const body = await req.json()
        const result = ctfSubmitSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const { challenge_id, flag } = result.data
        const adminClient = createAdminClient()

        // ── 3. Fetch member row ──
        const { data: member } = await adminClient
            .from('members')
            .select('id, status')
            .eq('user_id', session.user.id)
            .single()

        if (!member || member.status !== 'approved') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // ── 4. Fetch challenge WITH flag (server-side only) ──
        // SECURITY: This query includes `flag` — it MUST stay server-side only.
        const { data: challenge, error: challengeError } = await adminClient
            .from('ctf_challenges')
            .select('id, flag, points, is_active')
            .eq('id', challenge_id)
            .single()

        if (challengeError || !challenge) {
            return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
        }

        if (!challenge.is_active) {
            return NextResponse.json({ error: 'Challenge is not active' }, { status: 400 })
        }

        // ── 5. Check for duplicate correct submission ──
        const { data: existing } = await adminClient
            .from('ctf_submissions')
            .select('id, is_correct')
            .eq('challenge_id', challenge_id)
            .eq('member_id', member.id)
            .eq('is_correct', true)
            .maybeSingle()

        if (existing) {
            return NextResponse.json({ error: 'Already solved' }, { status: 409 })
        }

        // ── 6. Verify flag (case-insensitive trim) ──
        const isCorrect = flag.trim().toLowerCase() === (challenge.flag as string).trim().toLowerCase()
        const pointsAwarded = isCorrect ? (challenge.points as number) : 0

        // ── 7. Record submission ──
        const { error: insertError } = await adminClient.from('ctf_submissions').insert({
            challenge_id,
            member_id: member.id,
            is_correct: isCorrect,
            points_awarded: pointsAwarded,
        })

        if (insertError) throw insertError

        // Note: Points are updated by DB trigger (award_ctf_points) per CONTEXT §7

        return NextResponse.json({
            correct: isCorrect,
            points_awarded: pointsAwarded,
        })
    } catch (err: unknown) {
        console.error('[ctf/submit]', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
