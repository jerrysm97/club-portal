// app/portal/messages/actions.ts — Direct Messaging Actions (Simplified Model)
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(receiverId: string, content: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized uplink' }
    if (!content.trim()) return { error: 'Empty transmission payload' }

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    // Insert message using direct sender/receiver model
    const { error } = await (supabase.from('messages' as any) as any).insert({
        sender_id: (member as any).id,
        receiver_id: receiverId,
        content: content.trim()
    })

    if (error) return { error: error.message }

    revalidatePath(`/portal/messages/${receiverId}`)
    revalidatePath('/portal/messages')
    return { success: true }
}

export async function markAsRead(senderId: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return

    await (supabase
        .from('messages' as any) as any)
        .update({ is_read: true })
        .eq('sender_id', senderId)
        .eq('receiver_id', (member as any).id)
        .eq('is_read', false)
}
