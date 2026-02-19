'use client'

import { useState } from 'react'
import { Bell, Check, Info, AlertCircle, MessageSquare, Trophy, Calendar } from 'lucide-react'
import type { Notification } from '@/types/database'
import { markNotificationRead, markAllNotificationsRead } from '@/app/portal/notifications/actions'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import Link from 'next/link'

export default function NotificationsList({ initialNotifications }: { initialNotifications: Notification[] }) {
    const [notifications, setNotifications] = useState(initialNotifications)

    async function handleMarkRead(id: string) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        await markNotificationRead(id)
    }

    async function handleMarkAllRead() {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        await markAllNotificationsRead()
        toast.success('All logs marked as read')
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_message': return <MessageSquare className="h-4 w-4 text-[#8B5CF6]" />
            case 'ctf_new_challenge': return <Trophy className="h-4 w-4 text-[#EAB308]" />
            case 'event_reminder': return <Calendar className="h-4 w-4 text-[#10B981]" />
            case 'announcement': return <AlertCircle className="h-4 w-4 text-[#EF4444]" />
            default: return <Info className="h-4 w-4 text-[#A1A1AA]" />
        }
    }

    return (
        <div className="animate-fade-up">
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-mono text-[#10B981] hover:underline uppercase flex items-center gap-1"
                >
                    <Check className="h-3 w-3" /> Mark_All_Read
                </button>
            </div>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            className={cn(
                                "p-4 border rounded-sm flex gap-4 transition-all hover:bg-[#27272A]/20",
                                notification.is_read
                                    ? "bg-[#09090B] border-[#27272A] opacity-70"
                                    : "bg-[#111113] border-[#10B981]/30 shadow-[0_0_10px_-4px_rgba(16,185,129,0.1)]"
                            )}
                            onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className={cn(
                                    "font-mono text-sm mb-1",
                                    notification.is_read ? "text-[#A1A1AA]" : "text-[#F8FAFC] font-bold"
                                )}>
                                    {notification.title}
                                </h4>
                                <p className="text-[#52525B] font-mono text-xs mb-2">{notification.body}</p>

                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] text-[#27272A] bg-[#52525B] px-1 rounded-sm font-mono">
                                        {formatDate(notification.created_at)}
                                    </span>
                                    {notification.link && (
                                        <Link href={notification.link} className="text-[10px] uppercase font-mono text-[#10B981] hover:underline">
                                            View_Details
                                        </Link>
                                    )}
                                </div>
                            </div>
                            {!notification.is_read && (
                                <div className="w-2 h-2 rounded-full bg-[#10B981] mt-2" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-[#27272A] text-[#52525B] font-mono italic">
                        All systems nominal. No new logs.
                    </div>
                )}
            </div>
        </div>
    )
}
