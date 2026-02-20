// components/portal/ChatWindow.tsx — IIMS Collegiate Chat Interface
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2, MoreVertical, ShieldCheck, ChevronDown, CheckCheck } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { sendMessage } from '@/app/portal/(protected)/messages/actions'
// Import types safely
type Message = any
type Member = any
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'

interface ChatWindowProps {
    initialMessages: Message[]
    currentUser: any // Member-like
    otherUser: any // Member-like
}

export default function ChatWindow({ initialMessages, currentUser, otherUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [input, setInput] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    const supabase = createClient()

    useEffect(() => {
        // Subscribe to direct messages between me and otherUser
        const channel = supabase
            .channel(`member-chat:${currentUser.id}-${otherUser.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_id=eq.${currentUser.id}`
            }, (payload) => {
                const newMsg = payload.new as Message
                // Only add if it's from our specific otherUser
                if (newMsg.sender_id === otherUser.id) {
                    setMessages(prev => [...prev, newMsg])
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [currentUser.id, otherUser.id])

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
            receiver_id: otherUser.id,
            created_at: new Date().toISOString(),
            is_read: false,
            is_deleted: false,
        } as any

        setMessages(prev => [...prev, optimisticMsg])

        const res = await sendMessage(otherUser.id, content)
        setSending(false)

        if (res?.error) {
            // Ideally revert, for now just show error
            console.error('Transmission failed:', res.error)
        }
    }

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Dynamic Header */}
            <header className="h-20 flex items-center justify-between px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/portal/messages" className="lg:hidden p-2 -ml-2 text-gray-400">
                        <ChevronDown className="h-5 w-5 rotate-90" />
                    </Link>
                    <div className="relative">
                        <Avatar src={otherUser.avatar_url} name={otherUser.name} size="md" className="ring-2 ring-gray-50 shadow-sm" />
                        <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                        <h3 className="text-[#111827] font-poppins font-bold text-sm leading-none flex items-center gap-2">
                            {otherUser.name}
                            {otherUser.role === 'admin' && <ShieldCheck className="h-3.5 w-3.5 text-[#C3161C]" />}
                        </h3>
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-1 block">
                            Active Frequency
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl text-gray-400 hover:text-[#58151C] hover:bg-gray-50 transition-all">
                        <MoreVertical className="h-5 w-5" />
                    </button>
                </div>
            </header>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[url('/grid-subtle.svg')] bg-[length:40px_40px]" ref={scrollRef}>
                <div className="py-10 text-center">
                    <span className="px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        Uplink established · End-to-end Encrypted
                    </span>
                </div>

                {messages.map((msg, idx) => {
                    const isMe = msg.sender_id === currentUser.id
                    const showAvatar = !isMe && (idx === 0 || messages[idx - 1].sender_id !== msg.sender_id)

                    return (
                        <div key={msg.id} className={cn("flex group animate-fade-up", isMe ? 'justify-end' : 'justify-start')}>
                            <div className={cn("flex gap-3 max-w-[85%] sm:max-w-[70%]", isMe && 'flex-row-reverse')}>
                                {!isMe && (
                                    <div className="w-8 flex-shrink-0 flex items-end">
                                        {showAvatar && <Avatar src={otherUser.avatar_url} name={otherUser.name} size="xs" className="ring-2 ring-white shadow-sm" />}
                                    </div>
                                )}

                                <div className={cn("space-y-1", isMe ? 'items-end' : 'items-start')}>
                                    <div className={cn(
                                        "px-5 py-3 rounded-[1.5rem] font-medium text-sm leading-relaxed shadow-sm",
                                        isMe
                                            ? 'bg-[#58151C] text-white rounded-tr-none'
                                            : 'bg-gray-50 text-[#111827] border border-gray-100 rounded-tl-none'
                                    )}>
                                        {msg.content}
                                    </div>
                                    <div className={cn("flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter px-1", isMe && "flex-row-reverse")}>
                                        {formatDate(msg.created_at)}
                                        {isMe && (
                                            <CheckCheck className={cn("h-3 w-3", msg.is_read ? "text-blue-500" : "text-gray-300")} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Bar */}
            <footer className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
                <form onSubmit={handleSend} className="max-w-4xl mx-auto flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Type your transmission..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            className="w-full bg-gray-50 border-transparent rounded-[1.5rem] px-6 py-4 text-[#111827] font-medium text-sm focus:bg-white focus:ring-4 focus:ring-[#58151C]/5 transition-all outline-none pr-12"
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!input.trim() || sending}
                        className="h-14 w-14 rounded-2xl bg-[#C3161C] text-white flex items-center justify-center shadow-lg shadow-red-100 hover:bg-[#A31217] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex-shrink-0"
                    >
                        {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                    </button>
                </form>
            </footer>
        </div>
    )
}
