// app/api/admin/members/approve/route.ts — Admin: approve/reject/ban members (CONTEXT §13.2)
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createClient as createRawClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { approveSchema } from '@/lib/validations'
import { sendWelcomeEmail, sendRejectionEmail } from '@/lib/email/templates'
// Import types safely
type MemberRole = any
type MemberStatus = any
type Member = any

type CallerRow = { role: string; status: string } | null
type TargetRow = { role: string; status: string; email: string; name: string } | null

// Untyped admin client — bypasses Supabase Database generic for flexible updates
function createAdminClient() {
    return createRawClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
    try {
        // ── 1. Verify session ──
        const supabase = await createServerSupabaseClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // ── 2. Verify caller is an approved admin or superadmin ──
        const { data: callerRaw } = await supabase
            .from('members')
            .select('role, status')
            .eq('id', session.user.id)
            .single()
        const caller = callerRaw as CallerRow

        if (!caller || !['admin', 'superadmin'].includes(caller.role) || caller.status !== 'approved') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        // ── 3. Validate input ──
        const body = await req.json()
        const result = approveSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const { member_id, status, role, club_post } = result.data
        const adminClient = createAdminClient()

        // ── 4. Fetch the target member ──
        const { data: targetRaw, error: fetchError } = await adminClient
            .from('members')
            .select('role, status, email, name')
            .eq('id', member_id)
            .single()
        const target = targetRaw as TargetRow

        if (fetchError || !target) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 })
        }

        // ── 5. Superadmin protection (CONTEXT §13.3) ──
        if (target.role === 'superadmin' && caller.role !== 'superadmin') {
            return NextResponse.json({ error: 'Cannot modify a superadmin' }, { status: 403 })
        }

        // ── 6. Build update payload ──
        const update: { status: string; role?: string } = { status }
        if (role) update.role = role

        // ── 7. Execute update ──
        const { error: updateError } = await adminClient
            .from('members')
            .update(update as Partial<Member>)
            .eq('id', member_id)

        if (updateError) throw updateError


        // ── 8. Send email notification ──
        try {
            if (status === 'approved') {
                await sendWelcomeEmail(target.email, target.name)
            } else if (status === 'rejected') {
                await sendRejectionEmail(target.email, target.name)
            }
        } catch (emailErr) {
            // Non-fatal — log but don't fail the request
            console.error('[approve] email send failed:', emailErr)
        }

        return NextResponse.json({ success: true })
    } catch (err: unknown) {
        console.error('[admin/members/approve]', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
