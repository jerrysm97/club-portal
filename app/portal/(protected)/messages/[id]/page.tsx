// app/portal/messages/[id]/page.tsx — Direct Member Chat
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ChatWindow from '@/components/portal/ChatWindow'
// Import types safely
type Message = any
type Member = any
import { redirect, notFound } from 'next/navigation'

export const revalidate = 0

export default async function MessageThreadPage({ params }: { params: { id: string } }) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Identify current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id, name, avatar_url')
        .eq('id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Identify 'other' member
    const { data: otherUser } = await (supabase
        .from('members' as any) as any)
        .select('id, name, avatar_url, role')
        .eq('id', params.id)
        .single()

    if (!otherUser) return notFound()

    // Fetch direct messages between these two
    const { data: messages } = await (async () => {
        try {
            return await (supabase
                .from('messages' as any) as any)
                .select('*')
                .or(`and(sender_id.eq.${(member as any).id},receiver_id.eq.${(otherUser as any).id}),and(sender_id.eq.${(otherUser as any).id},receiver_id.eq.${(member as any).id})`)
                .order('created_at', { ascending: true })
        } catch (e) {
            return { data: [] }
        }
    })()

    // Update as read (simplified: mark all from 'other' to 'me' as read)
    try {
        await (supabase
            .from('messages' as any) as any)
            .update({ is_read: true })
            .eq('sender_id', (otherUser as any).id)
            .eq('receiver_id', (member as any).id)
            .eq('is_read', false)
    } catch (e) {
        // Table might be missing
    }

    return (
        <ChatWindow
            initialMessages={(messages || []) as unknown as Message[]}
            currentUser={member as any}
            otherUser={otherUser as any}
        />
    )
}
