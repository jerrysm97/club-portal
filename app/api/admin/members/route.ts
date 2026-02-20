// app/api/admin/members/route.ts — Admin Members API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const updateMemberSchema = z.object({
    id: z.string().uuid(),
    status: z.enum(['pending', 'approved', 'rejected', 'banned']).optional(),
    role: z.enum(['member', 'admin', 'superadmin']).optional(),
    reject_reason: z.string().max(500).optional(),
    ban_reason: z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = updateMemberSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...fields } = parsed.data
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
    await supabase.from('audit_logs').insert({
        admin_id: admin.id,
        action: `member_${fields.status || 'update'}`,
        target_id: id,
        meta: parsed.data
    })

    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const { id } = z.object({ id: z.string().uuid() }).parse(body)

    const supabase = createServerClient()
    const { error } = await supabase.from('members').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await supabase.from('audit_logs').insert({
        admin_id: admin.id,
        action: 'member_delete',
        target_id: id,
    })

    return NextResponse.json({ success: true })
}
