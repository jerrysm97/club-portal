'use client'

import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { useParams } from 'next/navigation'
import { cn, formatDate } from '@/lib/utils'
import type { Conversation, Member } from '@/types/database'
import { MessageSquare, Plus } from 'lucide-react'

interface ConversationListProps {
    conversations: (Conversation & {
        participants: Pick<Member, 'id' | 'full_name' | 'avatar_url'>[],
        otherParticipant?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
    })[]
}

export default function ConversationList({ conversations }: ConversationListProps) {
    const params = useParams()
    const activeId = params.id as string

    return (
        <div className="w-full h-full border-r border-[#27272A] bg-[#09090B] flex flex-col">
            <div className="p-4 border-b border-[#27272A] flex justify-between items-center">
                <h2 className="text-[#F8FAFC] font-mono font-bold text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#10B981]" />
                    Encrypted_Comms
                </h2>
                <button className="text-[#A1A1AA] hover:text-[#F8FAFC]">
                    <Plus className="h-4 w-4" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                    conversations.map(convo => {
                        const otherUser = convo.otherParticipant || { full_name: 'Unknown', avatar_url: null }
                        const isActive = activeId === convo.id

                        return (
                            <Link
                                key={convo.id}
                                href={`/portal/messages/${convo.id}`}
                                className={cn(
                                    "block p-4 border-b border-[#27272A] hover:bg-[#27272A]/30 transition-colors",
                                    isActive && "bg-[#27272A]/50 border-l-2 border-l-[#10B981]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar src={otherUser.avatar_url} name={otherUser.full_name} className="w-10 h-10 border border-[#27272A]" />
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="text-[#F8FAFC] font-mono text-xs font-bold truncate">{otherUser.full_name}</h4>
                                            {convo.last_message && (
                                                <span className="text-[10px] text-[#52525B] font-mono">
                                                    {formatDate(convo.last_message.created_at)}
                                                </span>
                                            )}
                                        </div>
                                        <p className={cn(
                                            "font-mono text-xs truncate",
                                            convo.unread_count && convo.unread_count > 0 ? "text-[#F8FAFC] font-bold" : "text-[#A1A1AA]"
                                        )}>
                                            {convo.last_message?.content || 'New connection established'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="p-8 text-center text-[#52525B] font-mono italic text-xs">
                        No active frequencies.
                    </div>
                )}
            </div>
        </div>
    )
}
