// components/portal/NotificationsList.tsx — IIMS Collegiate Alerts
'use client'

import { useState } from 'react'
import { Bell, Check, Info, AlertCircle, MessageSquare, Trophy, Calendar, ShieldCheck, ChevronRight } from 'lucide-react'
import type { Notification } from '@/types/database'
import { markNotificationRead, markAllNotificationsRead } from '@/app/portal/(protected)/notifications/actions'
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
        toast.success('All mission logs updated to read status')
    }

    const getIcon = (type: string) => {
        switch (type) {
            case 'new_message': return <MessageSquare className="h-5 w-5 text-indigo-600" />
            case 'ctf_new_challenge': return <Trophy className="h-5 w-5 text-amber-600" />
            case 'event_reminder': return <Calendar className="h-5 w-5 text-emerald-600" />
            case 'announcement': return <AlertCircle className="h-5 w-5 text-red-600" />
            default: return <Info className="h-5 w-5 text-gray-400" />
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="flex justify-end">
                <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C3161C] hover:text-[#58151C] transition-colors flex items-center gap-2"
                >
                    <Check className="h-4 w-4" /> Finalize All Logs
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                            className={cn(
                                "group relative p-6 rounded-[2rem] border transition-all cursor-pointer flex gap-6 items-center",
                                notification.is_read
                                    ? "bg-white border-gray-100 opacity-60"
                                    : "bg-white border-gray-100 shadow-xl shadow-red-100/20 hover:border-[#58151C]/10"
                            )}
                        >
                            <div className={cn(
                                "p-4 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-110",
                                notification.is_read ? "bg-gray-50" : "bg-gray-50 shadow-inner"
                            )}>
                                {getIcon(notification.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                    <h4 className={cn(
                                        "text-sm font-poppins font-bold truncate",
                                        notification.is_read ? "text-gray-400" : "text-[#111827]"
                                    )}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                                        {formatDate(notification.created_at)}
                                    </span>
                                </div>
                                <p className="text-gray-500 font-medium text-xs line-clamp-1">{notification.body}</p>

                                {/* Simplified Link Handling */}
                                {notification.link && (
                                    <Link
                                        href={notification.link}
                                        className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#C3161C] border-b border-transparent hover:border-[#C3161C] transition-all"
                                    >
                                        View Intel <ChevronRight className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>

                            {!notification.is_read && (
                                <div className="h-3 w-3 rounded-full bg-[#C3161C] border-2 border-white shadow-lg shadow-red-200" />
                            )}
                        </div>
                    ))
                ) : (
                    <div className="py-24 rounded-[3rem] border-2 border-dashed border-gray-100 bg-white text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Bell className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-black text-lg uppercase tracking-[0.2em]">Sector Nominal</p>
                        <p className="text-gray-300 mt-2 font-medium">No active alerts detected in your sector.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
