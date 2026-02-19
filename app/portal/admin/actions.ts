'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ─── Helpers ───
async function checkAdmin() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized', supabase: null }

    const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (!member || (member.role !== 'admin' && member.role !== 'superadmin')) {
        return { error: 'Forbidden: Admin clearance required', supabase: null }
    }

    return { error: null, supabase, user: session.user }
}

async function logAudit(action: string, targetId: string | null = null, meta: any = null) {
    const { supabase, user } = await checkAdmin()
    if (!supabase || !user) return

    await supabase.from('audit_logs').insert({
        admin_id: user.id,
        action,
        target_id: targetId,
        meta,
        ip_address: '0.0.0.0' // Placeholder, real IP needs headers
    })
}

// ─── Members ───
export async function updateMemberStatus(memberId: string, status: string, role?: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    const updateData: any = { status }
    if (role) updateData.role = role
    if (status === 'approved') updateData.approved_at = new Date().toISOString()

    const { error: updateError } = await supabase!.from('members').update(updateData).eq('id', memberId)
    if (updateError) return { error: updateError.message }

    await logAudit(`member_update_${status}`, memberId, { role })
    revalidatePath('/portal/admin')
    return { success: true }
}

export async function deleteMember(memberId: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    // Note: This might fail if cascades aren't set up, but let's assume they are or soft delete
    const { error: delError } = await supabase!.from('members').delete().eq('id', memberId)
    if (delError) return { error: delError.message }

    await logAudit('member_delete', memberId)
    revalidatePath('/portal/admin')
    return { success: true }
}

// ─── Posts ───
export async function deletePost(postId: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('posts').delete().eq('id', postId)
    await logAudit('post_delete', postId)
    revalidatePath('/portal/admin')
    revalidatePath('/portal/feed')
    return { success: true }
}

export async function togglePinPost(postId: string, isPinned: boolean) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('posts').update({ is_pinned: isPinned }).eq('id', postId)
    revalidatePath('/portal/admin')
    revalidatePath('/portal/feed')
    return { success: true }
}

// ─── Events ───
export async function upsertEvent(data: any) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    const payload = {
        title: data.title,
        description: data.description,
        event_date: data.event_date,
        location: data.location,
        type: data.type,
        cover_image_url: data.image_url,
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, ''),
        created_by: data.created_by // Usually admin ID
    }

    if (data.id) {
        await supabase!.from('public_events').update(payload).eq('id', data.id)
        await logAudit('event_update', data.id)
    } else {
        const { data: newEvent } = await supabase!.from('public_events').insert(payload).select().single()
        await logAudit('event_create', newEvent?.id)
    }

    revalidatePath('/portal/admin')
    revalidatePath('/portal/events')
    return { success: true }
}

export async function deleteEvent(eventId: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('public_events').delete().eq('id', eventId)
    await logAudit('event_delete', eventId)
    revalidatePath('/portal/admin')
    revalidatePath('/portal/events')
    return { success: true }
}

// ─── CTF ───
export async function upsertChallenge(data: any) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    const payload = {
        title: data.title,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        points: parseInt(data.points),
        flag: data.flag, // Private field
        flag_format: data.flag_format || 'flag{...}',
        is_active: data.is_active
    }

    if (data.id) {
        await supabase!.from('ctf_challenges').update(payload).eq('id', data.id)
        await logAudit('ctf_update', data.id)
    } else {
        const { data: newChal } = await supabase!.from('ctf_challenges').insert(payload).select().single()
        await logAudit('ctf_create', newChal?.id)
    }

    revalidatePath('/portal/admin')
    revalidatePath('/portal/ctf')
    return { success: true }
}

export async function deleteChallenge(id: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('ctf_challenges').delete().eq('id', id)
    await logAudit('ctf_delete', id)
    revalidatePath('/portal/admin')
    revalidatePath('/portal/ctf')
    return { success: true }
}

// ─── Resources ───
export async function deleteResource(id: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('documents').delete().eq('id', id)
    await logAudit('resource_delete', id)
    revalidatePath('/portal/admin')
    revalidatePath('/portal/resources')
    return { success: true }
}

// ─── Notifications ───
export async function broadcastNotification(title: string, body: string, type: string, link?: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    // Fetch all members
    const { data: members } = await supabase!.from('members').select('id')
    if (!members) return { error: 'No members found' }

    const notifications = members.map(m => ({
        recipient_id: m.id,
        sender_id: null, // System
        title,
        body,
        type,
        link,
        is_read: false
    }))

    const { error: batchError } = await supabase!.from('notifications').insert(notifications)
    if (batchError) return { error: batchError.message }

    await logAudit('notification_broadcast', null, { title, count: members.length })
    revalidatePath('/portal/admin')
    return { success: true }
}

// ─── Settings ───
export async function updateSettings(settings: any) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    // Upsert global settings
    await supabase!.from('site_settings').upsert({
        id: 'global',
        ...settings,
        updated_at: new Date().toISOString()
    })

    await logAudit('settings_update')
    revalidatePath('/portal/admin')
    return { success: true }
}

// ─── Inbox ───
export async function deleteMessage(id: string) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('contact_messages').delete().eq('id', id)
    revalidatePath('/portal/admin')
    return { success: true }
}

export async function toggleMessageRead(id: string, isRead: boolean) {
    const { supabase, error } = await checkAdmin()
    if (error) return { error }

    await supabase!.from('contact_messages').update({ is_read: isRead }).eq('id', id)
    revalidatePath('/portal/admin')
    return { success: true }
}
