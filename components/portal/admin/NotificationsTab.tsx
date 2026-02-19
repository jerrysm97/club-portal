'use client'

import { useState } from 'react'
import { Send, Bell } from 'lucide-react'
import { broadcastNotification } from '@/app/portal/admin/actions'
import { toast } from 'sonner'

export default function NotificationsTab() {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')

    async function handleBroadcast(e: React.FormEvent) {
        e.preventDefault()
        if (!confirm('Broadcast to ALL members?')) return

        const res = await broadcastNotification(title, body, 'announcement', '/portal/dashboard')
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Broadcast signal transmitted')
            setTitle('')
            setBody('')
        }
    }

    return (
        <div className="space-y-6 animate-fade-up max-w-2xl">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Broadcast_Center</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Send high-priority alerts to all operatives.</p>
            </div>

            <form onSubmit={handleBroadcast} className="p-6 bg-[#111113] border border-[#27272A] rounded-sm space-y-4">
                <div className="flex items-center gap-3 mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-sm">
                    <Bell className="h-5 w-5 text-[#EF4444]" />
                    <p className="text-xs text-[#EF4444] font-mono">
                        WARNING: This will trigger notifications for ALL registered members. Use with caution.
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-[#A1A1AA] uppercase">Alert Title</label>
                    <input
                        className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm focus:border-[#EF4444] outline-none"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-mono text-[#A1A1AA] uppercase">Message Content</label>
                    <textarea
                        rows={4}
                        className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm focus:border-[#EF4444] outline-none"
                        value={body}
                        onChange={e => setBody(e.target.value)}
                        required
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-[#EF4444] text-white font-mono text-xs font-bold rounded-sm hover:bg-[#DC2626] transition-colors"
                    >
                        <Send className="h-4 w-4" /> TRANSMIT_BROADCAST
                    </button>
                </div>
            </form>
        </div>
    )
}
