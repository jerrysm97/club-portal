// components/portal/ConversationList.tsx — IIMS Collegiate Thread List
'use client'

import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { useParams } from 'next/navigation'
import { cn, formatDate } from '@/lib/utils'
import { MessageSquare, Search, Filter } from 'lucide-react'

interface ConversationListProps {
    conversations: {
        otherMember: { id: string, name: string, avatar_url: string | null },
        lastMessage: { content: string, created_at: string },
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
            <div className="p-6 border-b border-gray-100 bg-white">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[#111827] font-poppins font-black text-sm flex items-center gap-2 uppercase tracking-widest">
                        <MessageSquare className="h-4 w-4 text-[#C3161C]" />
                        Encrypted Comms
                    </h2>
                    <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                        <Filter className="h-3.5 w-3.5" />
                    </div>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#58151C] transition-colors" />
                    <input
                        type="text"
                        placeholder="Search frequency..."
                        className="w-full bg-gray-50 border-transparent rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#58151C]/10 transition-all outline-none"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30">
                {conversations.length > 0 ? (
                    conversations.map(({ otherMember, lastMessage, unreadCount }) => {
                        const isActive = activeOtherId === otherMember.id

                        return (
                            <Link
                                key={otherMember.id}
                                href={`/portal/messages/${otherMember.id}`}
                                className={cn(
                                    "block p-5 transition-all relative group",
                                    isActive
                                        ? "bg-white shadow-lg z-10 scale-[1.02]"
                                        : "hover:bg-white/60"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C3161C]" />
                                )}

                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar
                                            src={otherMember.avatar_url}
                                            name={otherMember.name}
                                            className={cn(
                                                "w-12 h-12 ring-2 transition-all shadow-sm",
                                                isActive ? "ring-[#58151C]/10" : "ring-white"
                                            )}
                                        />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-[#C3161C] border-2 border-white rounded-full animate-ping" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className={cn(
                                                "text-sm font-bold truncate transition-colors",
                                                isActive ? "text-[#58151C]" : "text-[#111827]"
                                            )}>
                                                {otherMember.name}
                                            </h4>
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">
                                                {formatDate(lastMessage.created_at)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <p className={cn(
                                                "text-xs truncate flex-1",
                                                unreadCount > 0 ? "text-[#111827] font-bold" : "text-gray-400 font-medium"
                                            )}>
                                                {lastMessage.content}
                                            </p>
                                            {unreadCount > 0 && (
                                                <span className="bg-[#C3161C] text-white text-[8px] font-black rounded-lg px-2 py-0.5">
                                                    {unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="p-12 text-center animate-fade-up">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                            <MessageSquare className="h-6 w-6 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No Frequencies Detected</p>
                    </div>
                )}
            </div>
        </div>
    )
}
