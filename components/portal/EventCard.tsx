'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ArrowRight, Activity, Users } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PublicEvent } from '@/types/database'
import { toggleRsvp } from '@/app/portal/events/actions'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface EventCardProps {
    event: PublicEvent & { user_rsvp?: string }
}

export default function EventCard({ event }: EventCardProps) {
    const [rsvpStatus, setRsvpStatus] = useState(event.user_rsvp || null)
    const isCTF = event.type.toLowerCase().includes('ctf')

    async function handleRsvp(status: 'going' | 'maybe' | 'not_going') {
        // Optimistic update
        const oldStatus = rsvpStatus
        setRsvpStatus(status === 'not_going' ? null : status)

        const res = await toggleRsvp(event.id, status)
        if (res?.error) {
            toast.error(res.error)
            setRsvpStatus(oldStatus) // Revert
        } else {
            toast.success(`RSVP updated: ${status.replace('_', ' ').toUpperCase()}`)
        }
    }

    return (
        <div className="group relative p-6 bg-[#09090B] border border-[#27272A] rounded-sm hover:border-[#10B981]/50 transition-all flex flex-col md:flex-row gap-6 animate-fade-up">
            {/* Date Box */}
            <div className="flex-shrink-0 w-full md:w-24 h-24 bg-[#111113] border border-[#27272A] rounded-sm flex flex-col items-center justify-center text-center">
                <span className="text-[#10B981] font-mono text-xs uppercase">{formatDate(event.event_date).split(',')[0]}</span>
                <span className="text-[#F8FAFC] font-mono text-2xl font-bold">{new Date(event.event_date).getDate()}</span>
                <span className="text-[#52525B] font-mono text-xs uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "px-2 py-0.5 rounded-sm text-[10px] font-mono uppercase border",
                        isCTF
                            ? "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20"
                            : "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20"
                    )}>
                        {event.type}
                    </span>
                    {rsvpStatus && (
                        <span className="text-[#F8FAFC] text-[10px] font-mono flex items-center gap-1">
                            <Activity className="h-3 w-3 text-[#EAB308]" />
                            RSVP: {rsvpStatus === 'going' ? 'ACCEPTED' : 'TENTATIVE'}
                        </span>
                    )}
                </div>

                <Link href={`/portal/events/${event.id}`} className="block group-hover:underline decoration-[#10B981]">
                    <h3 className="text-xl text-[#F8FAFC] font-mono font-bold">{event.title}</h3>
                </Link>

                <div className="flex flex-wrap gap-4 text-xs font-mono text-[#A1A1AA]">
                    <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location || 'TBA'}
                    </span>
                    {event.max_attendees && (
                        <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Limit: {event.max_attendees}
                        </span>
                    )}
                </div>

                <p className="text-[#52525B] font-mono text-sm line-clamp-2 pt-2">
                    {event.short_desc || event.description}
                </p>
            </div>

            {/* Action Area */}
            <div className="flex flex-col gap-2 min-w-[140px]">
                <button
                    onClick={() => handleRsvp('going')}
                    className={cn(
                        "w-full px-4 py-2 rounded-sm font-mono text-xs font-bold transition-colors border",
                        rsvpStatus === 'going'
                            ? "bg-[#10B981] text-black border-[#10B981]"
                            : "bg-transparent text-[#10B981] border-[#10B981] hover:bg-[#10B981]/10"
                    )}
                >
                    {rsvpStatus === 'going' ? 'MISSION_ACCEPTED' : 'ACCEPT_MISSION'}
                </button>

                <button
                    onClick={() => handleRsvp(rsvpStatus === 'maybe' ? 'not_going' : 'maybe')}
                    className={cn(
                        "w-full px-4 py-2 rounded-sm font-mono text-xs font-bold transition-colors border",
                        rsvpStatus === 'maybe'
                            ? "bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/20"
                            : "bg-transparent text-[#52525B] border-[#27272A] hover:text-[#F8FAFC] hover:border-[#F8FAFC]"
                    )}
                >
                    {rsvpStatus === 'maybe' ? 'TENTATIVE' : 'INTERESTED'}
                </button>

                <Link
                    href={`/portal/events/${event.id}`}
                    className="mt-auto flex items-center justify-center gap-1 text-[#52525B] hover:text-[#F8FAFC] font-mono text-[10px] uppercase"
                >
                    Details <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    )
}
