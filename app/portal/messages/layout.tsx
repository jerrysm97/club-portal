// app/portal/messages/layout.tsx
import { createClient } from '@/utils/supabase/server'
import ConversationList from '@/components/portal/ConversationList'
import type { Conversation, Member } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Fetch conversations
    // Since we don't have a simple join for participants in Supabase PostgREST (needs M2M View),
    // we'll fetch conversations first, then participants. 
    // OR use a view. Let's assume we can fetch basic view or construct it.

    // Actually, standard way is: select *, participants:conversation_participants(...)
    // But that gives nested array.

    const { data: convosData } = await supabase
        .from('conversations')
        .select(`
        *,
        participants:conversation_participants(
            member:members(id, full_name, avatar_url)
        )
    `)
        .order('updated_at', { ascending: false })

    // Transform data
    const conversations = (convosData || []).map((c: any) => {
        // Find 'other' participant
        const participants = c.participants.map((p: any) => p.member)
        const otherUser = participants.find((p: any) => p.id !== session.user.id) || participants[0]

        return {
            ...c,
            participants,
            otherParticipant: otherUser
        }
    })

    return (
        <div className="flex h-[calc(100vh-100px)] border border-[#27272A] rounded-sm overflow-hidden animate-fade-up">
            <div className="w-80 hidden md:block border-r border-[#27272A]">
                <ConversationList conversations={conversations} />
            </div>
            <div className="flex-1 bg-[#09090B]">
                {children}
            </div>
        </div>
    )
}
