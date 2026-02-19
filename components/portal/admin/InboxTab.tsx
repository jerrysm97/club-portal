'use client'

import { Mail, Trash2, CheckCircle } from 'lucide-react'
import { deleteMessage, toggleMessageRead } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { ContactMessage } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function InboxTab({ messages }: { messages: ContactMessage[] }) {

    async function handleDelete(id: string) {
        if (!confirm('Delete message?')) return
        const res = await deleteMessage(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Message deleted')
    }

    async function handleToggle(id: string, current: boolean) {
        await toggleMessageRead(id, !current)
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Public_Inbox</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">External communication requests.</p>
            </div>

            <div className="space-y-3">
                {messages.map(msg => (
                    <div key={msg.id} className={`p-4 border rounded-sm flex flex-col gap-3 ${msg.is_read ? 'bg-[#09090B] border-[#27272A] opacity-70' : 'bg-[#111113] border-[#10B981]/30'}`}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#A1A1AA]" />
                                <h3 className="text-[#F8FAFC] font-mono font-bold text-sm">{msg.name}</h3>
                                <span className="text-[#52525B] text-xs font-mono">&lt;{msg.email}&gt;</span>
                            </div>
                            <span className="text-[#52525B] text-xs font-mono">{formatDate(msg.created_at)}</span>
                        </div>

                        <div className="pl-6">
                            <h4 className="text-[#10B981] text-xs font-mono mb-1">{msg.subject}</h4>
                            <p className="text-[#A1A1AA] text-sm whitespace-pre-wrap">{msg.message}</p>
                        </div>

                        <div className="pl-6 flex gap-3 pt-2">
                            <button
                                onClick={() => handleToggle(msg.id, msg.is_read)}
                                className="text-xs font-mono text-[#10B981] hover:underline"
                            >
                                {msg.is_read ? 'Mark_Unread' : 'Mark_Read'}
                            </button>
                            <button
                                onClick={() => handleDelete(msg.id)}
                                className="text-xs font-mono text-[#F43F5E] hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
