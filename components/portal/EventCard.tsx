// components/portal/EventCard.tsx — IIMS Collegiate Event Item
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Users, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
// Import types safely
type Event = any
import { toggleRsvp } from '@/app/portal/(protected)/events/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
            toast.success(`Mission status updated: ${status.replace('_', ' ').toUpperCase()}`)
        }
    }

    return (
        <div className="group bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-2xl hover:border-[#58151C]/10 transition-all animate-fade-up flex flex-col md:flex-row gap-8">
            {/* Visual Indicator / Date */}
            <div className="flex-shrink-0 w-full md:w-32 h-32 rounded-2xl bg-gray-50 flex flex-col items-center justify-center text-center border border-gray-100 group-hover:bg-[#58151C] group-hover:text-white transition-all">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 group-hover:opacity-60 mb-1">
                    {new Date(eventDate).toLocaleString('default', { month: 'short' })}
                </span>
                <span className="text-3xl font-poppins font-black leading-none">
                    {new Date(eventDate).getDate()}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-2 text-[#C3161C] group-hover:text-white transition-colors">
                    {new Date(eventDate).getFullYear()}
                </span>
            </div>

            {/* Main Intel */}
            <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        isCTF
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    )}>
                        {event.type}
                    </span>
                    {rsvpStatus && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest">
                            <ShieldCheck className="h-3 w-3" /> Clearance: {rsvpStatus === 'going' ? 'Confirmed' : 'Interested'}
                        </span>
                    )}
                </div>

                <Link href={`/portal/events/${event.id}`} className="block">
                    <h3 className="text-2xl font-poppins font-bold text-[#111827] group-hover:text-[#C3161C] transition-colors leading-tight">
                        {event.title}
                    </h3>
                </Link>

                <div className="flex flex-wrap gap-5 text-xs font-bold text-gray-400">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {event.location || 'College Base'}
                    </div>
                </div>

                <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-2 max-w-2xl">
                    {event.short_desc || (event.description?.substring(0, 150) + '...')}
                </p>
            </div>

            {/* Control Panel */}
            <div className="flex flex-col gap-3 min-w-[180px] justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-50 md:pl-8">
                <button
                    onClick={() => handleRsvp('going')}
                    className={cn(
                        "w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm",
                        rsvpStatus === 'going'
                            ? "bg-[#C3161C] text-white shadow-red-100"
                            : "bg-white text-[#C3161C] border-2 border-[#C3161C] hover:bg-red-50"
                    )}
                >
                    {rsvpStatus === 'going' ? 'Mission Accepted' : 'Join Mission'}
                </button>

                <button
                    onClick={() => handleRsvp(rsvpStatus === 'maybe' ? 'not_going' : 'maybe')}
                    className={cn(
                        "w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        rsvpStatus === 'maybe'
                            ? "bg-amber-50 text-amber-700 border-2 border-amber-200"
                            : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    )}
                >
                    {rsvpStatus === 'maybe' ? 'Tentative' : 'Interested'}
                </button>

                <Link
                    href={`/portal/events/${event.id}`}
                    className="flex items-center justify-center gap-2 text-gray-300 font-black text-[10px] uppercase tracking-[0.2em] mt-2 hover:text-[#58151C] transition-colors group/link"
                >
                    Detailed Intel <ChevronRight className="h-3.5 w-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
