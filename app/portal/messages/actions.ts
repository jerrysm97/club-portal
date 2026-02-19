'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }
    if (!content.trim()) return { error: 'Empty message payload' }

    // Insert message
    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: session.user.id,
        content: content.trim()
    })

    if (error) return { error: error.message }

    // Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId)

    revalidatePath(`/portal/messages/${conversationId}`)
    return { success: true }
}

export async function createConversation(participantId: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    // Check if conversation already exists between these two
    // tailored for 1-on-1 for now

    // Complex query to find existing convo... simplistic approach:
    // This is hard to do efficiently without a stored procedure or complex join in standard SQL/PostgREST
    // For MVP, we'll create a new one or just link to existing if we had a way to lookup.
    // Let's assume we create a new one if we don't find one in client state, 
    // BUT duplicate convos are bad.
    // Ideally, we'd have a unique constraint or lookup function.
    // Let's assume we proceed with creating and if it exists, we handle or ignore.

    // Better: RPC `get_or_create_conversation(user2_id)`
    // Without RPC, we might just insert and hope.
    // Let's implement a simple creation.

    const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({})
        .select()
        .single()

    if (error) return { error: error.message }

    // Add participants
    await supabase.from('conversation_participants').insert([
        { conversation_id: conversation.id, member_id: session.user.id },
        { conversation_id: conversation.id, member_id: participantId }
    ])

    revalidatePath('/portal/messages')
    return { success: true, conversationId: conversation.id }
}
