// components/portal/EventCard.tsx — IIMS IT Club Event Card (v4.0)
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Users, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { toggleRsvp } from '@/app/portal/(protected)/events/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Event = any

interface EventCardProps {
    event: Event & { user_rsvp?: string }
}

export default function EventCard({ event }: EventCardProps) {
    const [rsvpStatus, setRsvpStatus] = useState(event.user_rsvp || null)
    const isCTF = (event.type || '').toLowerCase().includes('ctf')
    const eventDate = event.event_date

    async function handleRsvp(status: 'going' | 'maybe' | 'not_going') {
        const oldStatus = rsvpStatus
        const newStatus = status === 'not_going' ? null : status
        setRsvpStatus(newStatus)

        const res = await toggleRsvp(event.id, status)
        if (res?.error) {
            toast.error(res.error)
            setRsvpStatus(oldStatus)
        } else {
            toast.success(`RSVP updated: ${status.replace('_', ' ').toUpperCase()}`)
        }
    }

    return (
        <div className="group bg-white rounded-sm border border-[#E0E0E0] p-6 md:p-8 shadow-sm hover:shadow-sm hover:border-[#111111]/20 transition-all animate-fade-up flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Visual Indicator / Date */}
            <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-sm bg-[#F8F9FA] flex flex-col items-center justify-center text-center border border-[#E0E0E0] group-hover:bg-[#111111] group-hover:text-white transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E9E9E] group-hover:text-white/70 mb-1">
                    {new Date(eventDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-3xl font-bold leading-none text-[#212121] group-hover:text-white">
                    {new Date(eventDate).getDate()}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest mt-2 text-[#E53935] group-hover:text-white/90 transition-colors">
                    {new Date(eventDate).getFullYear()}
                </span>
            </div>

            {/* Main Details */}
            <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                        "px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border",
                        isCTF
                            ? "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]"
                            : "bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]"
                    )}>
                        {event.type}
                    </span>
                    {rsvpStatus && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FFF8E1] border border-[#FFECB3] text-[#F57F17] text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck className="h-3 w-3" /> RSVP: {rsvpStatus === 'going' ? 'Confirmed' : 'Interested'}
                        </span>
                    )}
                </div>

                <Link href={`/portal/events/${event.id}`} className="block">
                    <h3 className="text-2xl font-bold text-[#212121] group-hover:text-[#111111] transition-colors leading-tight">
                        {event.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap gap-5 text-xs font-semibold text-[#757575]">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-[#9E9E9E]" />
                        {new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-[#9E9E9E]" />
                        {event.location || 'IIMS College Campus'}
                    </div>
                </div>

                <p className="text-[#757575] font-medium text-sm leading-relaxed line-clamp-2 max-w-2xl">
                    {event.short_desc || (event.description?.substring(0, 150) + '...')}
                </p>
            </div>

            {/* Control Panel */}
            <div className="flex flex-col gap-3 min-w-[180px] justify-center pt-5 md:pt-0 border-t md:border-t-0 md:border-l border-[#E0E0E0] md:pl-8">
                <button
                    onClick={() => handleRsvp('going')}
                    className={cn(
                        "w-full h-12 rounded-sm text-xs font-bold uppercase tracking-widest transition-all shadow-sm focus:ring-4 focus:ring-[#111111]/20",
                        rsvpStatus === 'going'
                            ? "bg-[#111111] text-white shadow-[#111111]/30"
                            : "bg-white text-[#111111] border-2 border-[#111111] hover:bg-[#FAFAFA]"
                    )}
                >
                    {rsvpStatus === 'going' ? 'Registered' : 'Register Now'}
                </button>

                <button
                    onClick={() => handleRsvp(rsvpStatus === 'maybe' ? 'not_going' : 'maybe')}
                    className={cn(
                        "w-full h-12 rounded-sm text-xs font-bold uppercase tracking-widest transition-all focus:ring-4 focus:ring-[#E0E0E0]",
                        rsvpStatus === 'maybe'
                            ? "bg-[#FFF8E1] text-[#F57F17] border-2 border-[#FFE082]"
                            : "bg-[#F5F5F5] text-[#757575] hover:bg-[#EEEEEE] hover:text-[#424242]"
                    )}
                >
                    {rsvpStatus === 'maybe' ? 'Tentative' : 'Interested'}
                </button>

                <Link
                    href={`/portal/events/${event.id}`}
                    className="flex items-center justify-center gap-2 text-[#9E9E9E] font-bold text-[10px] uppercase tracking-widest mt-2 hover:text-[#111111] transition-colors group/link"
                >
                    Event Details <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
