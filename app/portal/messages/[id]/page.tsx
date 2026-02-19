// app/portal/messages/[id]/page.tsx
import { createClient } from '@/utils/supabase/server'
import ChatWindow from '@/components/portal/ChatWindow'
import type { Message, Member } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function MessageThreadPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Fetch messages
    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', params.id)
        .order('created_at', { ascending: true })

    // Fetch conversation participants to identify 'other' user
    const { data: participants } = await supabase
        .from('conversation_participants')
        .select('member:members(id, full_name, avatar_url)')
        .eq('conversation_id', params.id)

    const memberList = (participants || []).map((p: any) => p.member)
    const otherUser = memberList.find((m: any) => m.id !== session.user.id) || { full_name: 'Unknown', avatar_url: null, id: 'unknown' }
    const currentUser = memberList.find((m: any) => m.id === session.user.id) || { id: session.user.id } as Member

    return (
        <ChatWindow
            conversationId={params.id}
            initialMessages={(messages || []) as Message[]}
            currentUser={currentUser}
            otherUser={otherUser}
        />
    )
}
