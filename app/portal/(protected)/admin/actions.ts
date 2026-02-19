// app/portal/admin/actions.ts — Standardized Admin Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Member Management
export async function updateMemberStatus(id: string, status: string, role?: string, club_post?: string) {
    const supabase = await createServerSupabaseClient()

    const updates: any = { status }
    if (role) updates.role = role
    if (club_post !== undefined) updates.club_post = club_post

    const { error } = await (supabase
        .from('members' as any) as any)
        .update(updates)
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

export async function deleteMember(id: string) {
    const supabase = await createServerSupabaseClient()

    const { error } = await (supabase
        .from('members' as any) as any)
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

// Event Management
export async function toggleEventStatus(id: string, is_published: boolean) {
    const supabase = await createServerSupabaseClient()
    const { error } = await (supabase
        .from('events' as any) as any)
        .update({ is_published })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

// CTF Management
export async function updateChallengeStatus(id: string, is_active: boolean) {
    const supabase = await createServerSupabaseClient()
    const { error } = await (supabase
        .from('ctf_challenges' as any) as any)
        .update({ is_active })
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    return { success: true }
}

// Post Management
export async function deletePost(id: string) {
    const supabase = await createServerSupabaseClient()
    const { error } = await (supabase
        .from('posts' as any) as any)
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    revalidatePath('/portal/feed')
    return { success: true }
}

// Resource Management
export async function deleteResource(id: string) {
    const supabase = await createServerSupabaseClient()
    const { error } = await (supabase
        .from('documents' as any) as any)
        .delete()
        .eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/portal/admin')
    revalidatePath('/portal/resources')
    return { success: true }
}
