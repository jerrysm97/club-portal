// app/api/admin/members/route.ts — Admin Members API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole, assertSuperadminOrPresident, assertSuperadminOrPresidentOrAdmin } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const updateMemberSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'approved', 'rejected', 'banned']).optional(),
    role: z.enum(['member', 'bod', 'admin', 'superadmin']).optional(),
    club_post: z.string().nullable().optional(),
    reject_reason: z.string().max(500).optional(),
    ban_reason: z.string().max(500).optional(),
})

export async function GET() {
    const admin = await assertSuperadminOrPresidentOrAdmin()
    const supabase = createServerClient()

    const [members, posts, events, challenges, resources, auditLogs] = await Promise.all([
        supabase.from('members').select('*').order('joined_at', { ascending: false }),
        supabase.from('posts').select('*, author:members(full_name, avatar_url)').order('created_at', { ascending: false }),
        supabase.from('public_events').select('*').order('event_date', { ascending: false }),
        supabase.from('ctf_challenges').select('id, title, category, difficulty, points, is_active, hint, created_at, solves_count').order('points', { ascending: true }),
        supabase.from('documents').select('*, uploader:members(full_name)').order('created_at', { ascending: false }),
        admin.role === 'superadmin' ? supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100) : Promise.resolve({ data: [] }),
    ])

    return NextResponse.json({
        currentUser: admin,
        members: members.data || [],
        posts: posts.data || [],
        events: events.data || [],
        challenges: challenges.data || [],
        resources: resources.data || [],
        auditLogs: auditLogs.data || [],
    })
}

export async function PATCH(req: NextRequest) {
    const admin = await assertSuperadminOrPresidentOrAdmin()
    const body = await req.json()
    const parsed = updateMemberSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...fields } = parsed.data

    if (fields.role !== undefined || fields.club_post !== undefined) {
        if (admin.role !== 'superadmin' && admin.club_post !== 'President') {
            return NextResponse.json({ error: 'Only Superadmin or President can assign roles and posts.' }, { status: 403 })
        }

        // Strict limits for President
        if (admin.role !== 'superadmin') {
            if (fields.role === 'admin' || fields.role === 'superadmin') {
                return NextResponse.json({ error: 'President cannot assign admin or superadmin roles.' }, { status: 403 })
            }
            if (fields.club_post && fields.club_post.toLowerCase() === 'president') {
                return NextResponse.json({ error: 'President cannot re-assign the President post.' }, { status: 403 })
            }
        }
    }

    const supabase = createServerClient()

    // Add approved_at and approved_by if approving
    const updateData: Record<string, unknown> = { ...fields }
    if (fields.status === 'approved') {
        updateData.approved_at = new Date().toISOString()
        updateData.approved_by = admin.id
    }

    const { error } = await supabase.from('members').update(updateData).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Audit log
    const actionName = (fields.role || fields.club_post) ? 'member_designation_update' : `member_${fields.status || 'update'}`
    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: actionName,
        target_id: id,
        details: parsed.data
    })

    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    const admin = await assertSuperadminOrPresidentOrAdmin()
    const body = await req.json()
    const { id } = z.object({ id: z.string().uuid() }).parse(body)

    const supabase = createServerClient()
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        actor_id: admin.id,
        action: 'member_delete',
        target_id: id,
    })

    return NextResponse.json({ success: true })
}
