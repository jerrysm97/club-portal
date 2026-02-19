// app/portal/messages/layout.tsx — IIMS Collegiate Messaging Shell
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ConversationList from '@/components/portal/ConversationList'
import type { Member } from '@/types/database'

export const revalidate = 0

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // To build a conversation list in a simplified model:
    // 1. Fetch all messages where user is sender or receiver
    // 2. Extract unique 'other' members
    // 3. Fetch these members' details and their latest message
    const { data: rawMessages } = await (supabase
        .from('messages' as any) as any)
        .select(`
      id,
      content,
      created_at,
      sender_id,
      receiver_id,
      is_read,
      sender:members!sender_id(id, full_name, avatar_url),
      receiver:members!receiver_id(id, full_name, avatar_url)
    `)
        .or(`sender_id.eq.${(member as any).id},receiver_id.eq.${(member as any).id}`)
        .order('created_at', { ascending: false })

    // Aggregate into threads
    const threadsMap = new Map()

        ; (rawMessages || []).forEach((msg: any) => {
            const otherMember = msg.sender_id === (member as any).id ? msg.receiver : msg.sender
            if (!otherMember) return

            if (!threadsMap.has(otherMember.id)) {
                threadsMap.set(otherMember.id, {
                    otherMember,
                    lastMessage: msg,
                    unreadCount: (msg.receiver_id === (member as any).id && !msg.is_read) ? 1 : 0
                })
            } else {
                if (msg.receiver_id === (member as any).id && !msg.is_read) {
                    threadsMap.get(otherMember.id).unreadCount++
                }
            }
        })

    const conversations = Array.from(threadsMap.values())

    return (
        <div className="flex bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden h-[calc(100vh-160px)] animate-fade-up">
            <div className="w-80 hidden lg:block border-r border-gray-100 bg-gray-50/50">
                <ConversationList conversations={conversations} currentMemberId={(member as any).id} />
            </div>
            <div className="flex-1 bg-white relative">
                {children}
            </div>
        </div>
    )
}
