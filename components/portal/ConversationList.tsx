// components/portal/ConversationList.tsx — IIMS IT Club Comms List (v4.0)
'use client'

import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { useParams } from 'next/navigation'
import { cn, formatDate } from '@/lib/utils'
import { MessageSquare, Search, Filter } from 'lucide-react'

interface ConversationListProps {
    conversations: {
        conversation_id: string,
        otherMember: { id: string, name: string, avatar_url: string | null },
        lastMessage: { content: string, created_at: string, isMine: boolean },
        unreadCount: number
    }[],
    currentMemberId: string
}

export default function ConversationList({ conversations, currentMemberId }: ConversationListProps) {
    const params = useParams()
    const activeOtherId = params.id as string

    return (
        <div className="w-full h-full flex flex-col">
            {/* List Header */}
            <div className="p-5 md:p-6 border-b border-[#E0E0E0] bg-white">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[#212121] font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4 text-[#1A237E]" />
                        Direct Messages
                    </h2>
                    <button className="p-2 rounded-xl bg-[#F8F9FA] text-[#757575] hover:text-[#1A237E] hover:bg-[#E8EAF6] transition-colors border border-transparent hover:border-[#E8EAF6]">
                        <Filter className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E] group-focus-within:text-[#1A237E] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search members..."
                        className="w-full bg-[#F5F5F5] border border-transparent rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold focus:bg-white focus:border-[#1A237E]/30 focus:ring-4 focus:ring-[#1A237E]/10 transition-all outline-none text-[#212121] placeholder:text-[#9E9E9E]"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F8F9FA]/50">
                {conversations.length > 0 ? (
                    conversations.map(({ otherMember, lastMessage, unreadCount }) => {
                        const isActive = activeOtherId === otherMember.id

                        return (
                            <Link
                                key={otherMember.id}
                                href={`/portal/messages/${otherMember.id}`}
                                className={cn(
                                    "block p-4 md:p-5 transition-all relative group border-b border-[#E0E0E0]/50",
                                    isActive
                                        ? "bg-white shadow-sm z-10 scale-[1.01] border-l-4 border-l-[#1A237E]"
                                        : "hover:bg-white border-l-4 border-l-transparent"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative shrink-0">
                                        <Avatar
                                            src={otherMember.avatar_url}
                                            name={otherMember.name}
                                            className={cn(
                                                "w-11 h-11 md:w-12 md:h-12 ring-2 transition-all shadow-sm",
                                                isActive ? "ring-[#1A237E]/20" : "ring-white"
                                            )}
                                        />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#E53935] border-2 border-white rounded-full flex" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h4 className={cn(
                                                "text-sm font-bold truncate transition-colors",
                                                isActive ? "text-[#1A237E]" : "text-[#212121]"
                                            )}>
                                                {otherMember.name}
                                            </h4>
                                            <span className="text-[9px] font-bold text-[#9E9E9E] uppercase tracking-wider shrink-0 ml-2">
                                                {formatDate(lastMessage.created_at)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className={cn(
                                                "text-xs truncate flex-1 leading-snug",
                                                unreadCount > 0 ? "text-[#212121] font-bold" : "text-[#757575] font-medium"
                                            )}>
                                                {lastMessage.isMine && "You: "}{lastMessage.content}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="bg-[#E53935] text-white text-[9px] font-bold rounded-md px-1.5 py-0.5 shadow-sm shrink-0">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="p-10 text-center animate-fade-up flex flex-col items-center justify-center h-full">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-5 shadow-sm border border-[#E0E0E0]">
                            <MessageSquare className="h-6 w-6 text-[#9E9E9E]" />
                        </div>
                        <p className="text-[#424242] font-bold text-sm uppercase tracking-widest">Inbox Zero</p>
                        <p className="text-[#9E9E9E] text-xs font-medium mt-1">Select a member to start.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
