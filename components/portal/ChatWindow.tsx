'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, MoreVertical, Phone, Video } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { createClient } from '@/utils/supabase/client'
import { sendMessage } from '@/app/portal/messages/actions'
import type { Message, Member } from '@/types/database'
import { formatDate } from '@/lib/utils'

interface ChatWindowProps {
    conversationId: string
    initialMessages: Message[]
    currentUser: Member
    otherUser: Pick<Member, 'id' | 'full_name' | 'avatar_url'>
}

export default function ChatWindow({ conversationId, initialMessages, currentUser, otherUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()

    useEffect(() => {
        // Subscribe to new messages
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${conversationId}`
            }, (payload) => {
                const newMsg = payload.new as Message
                setMessages(prev => [...prev, newMsg])
                scrollToBottom()
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [conversationId, supabase])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    function scrollToBottom() {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || sending) return

        const content = input
        setInput('')
        setSending(true)

        // Optimistic update
        const tempId = crypto.randomUUID()
        const optimisticMsg: Message = {
            id: tempId,
            content,
            sender_id: currentUser.id,
            conversation_id: conversationId,
            created_at: new Date().toISOString(),
            is_deleted: false,
        }
        setMessages(prev => [...prev, optimisticMsg])
        scrollToBottom()

        const res = await sendMessage(conversationId, content)
        setSending(false)

        if (res?.error) {
            // Revert or show error (for now just console/alert, simple MVP)
            console.error(res.error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-[#09090B]">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#27272A] bg-[#111113]">
                <div className="flex items-center gap-3">
                    <Avatar src={otherUser.avatar_url} name={otherUser.full_name} className="w-8 h-8" />
                    <div>
                        <h3 className="text-[#F8FAFC] font-mono font-bold text-sm">{otherUser.full_name}</h3>
                        <div className="text-[#10B981] text-[10px] font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> ONLINE
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[#A1A1AA]">
                    <Phone className="h-4 w-4 hover:text-[#F8FAFC] cursor-pointer" />
                    <Video className="h-4 w-4 hover:text-[#F8FAFC] cursor-pointer" />
                    <MoreVertical className="h-4 w-4 hover:text-[#F8FAFC] cursor-pointer" />
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser.id
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                            <div className={`flex gap-2 max-w-[80%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                {!isMe && (
                                    <div className="w-8 flex-shrink-0">
                                        {showAvatar && <Avatar src={otherUser.avatar_url} name={otherUser.full_name} className="w-8 h-8" />}
                                    </div>
                                )}

                                <div>
                                    <div className={`
                                    px-4 py-2 rounded-lg font-mono text-sm leading-relaxed break-words
                                    ${isMe
                                            ? 'bg-[#10B981] text-black rounded-tr-none'
                                            : 'bg-[#27272A] text-[#F8FAFC] rounded-tl-none'}
                                `}>
                                        {msg.content}
                                    </div>
                                    <div className={`text-[10px] text-[#52525B] mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                        {formatDate(msg.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Input */}
            <div className="p-4 bg-[#111113] border-t border-[#27272A]">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="flex-1 bg-[#09090B] border border-[#27272A] rounded-sm px-4 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none placeholder:text-[#3F3F46]"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="px-4 bg-[#F8FAFC] text-black rounded-sm hover:bg-[#E2E8F0] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[50px]"
                    >
                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                </form>
            </div>
        </div>
    )
}
