// components/public/EventGrid.tsx — Client island for event filtering
'use client'
import { useState } from 'react'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

interface EventItem {
    id: string
    title: string
    short_desc: string | null
    type: string
    event_date: string
    location: string | null
    image_url?: string | null
    cover_image_url?: string | null
}

const FILTERS = [
    { value: 'all', label: 'All' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'ctf', label: 'CTF' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'competition', label: 'Hackathon' },
]

const TYPE_BADGES: Record<string, string> = {
    workshop: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    ctf: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
    seminar: 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/30',
    competition: 'text-[#C0392B] bg-[#8B1A1A]/20 border-[#8B1A1A]/40',
    meetup: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/40',
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function EventGrid({ events }: { events: EventItem[] }) {
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all'
        ? events
        : events.filter(e => e.type === filter)

    return (
        <>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mb-10">
                {FILTERS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`font-mono text-xs px-4 py-2 rounded-md border transition-all ${filter === value
                            ? 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/30'
                            : 'text-[#8888AA] bg-transparent border-[#2D2D44] hover:text-[#F0F0FF] hover:bg-[#12121A]'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Event cards */}
            {filtered.length === 0 ? (
                <div className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-12 text-center">
                    <p className="font-mono text-[#00FF87] text-sm">
                        No upcoming events. Check back soon.
                        <span className="animate-blink">|</span>
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event) => {
                        const badgeClass = TYPE_BADGES[event.type] || TYPE_BADGES.seminar
                        return (
                            <div
                                key={event.id}
                                className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg overflow-hidden hover:bg-[#12121A] hover:border-[#00FF87]/30 transition-all duration-200 group"
                            >
                                {event.image_url ? (
                                    <img src={event.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="h-36 bg-[#0D1B2A] flex items-center justify-center border-b border-[#1E1E2E]">
                                        <Calendar className="h-10 w-10 text-[#2D2D44]" />
                                    </div>
                                )}

                                <div className="p-5">
                                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${badgeClass} inline-block mb-3`}>
                                        {event.type}
                                    </span>
                                    <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-2 group-hover:text-[#00FF87] transition-colors">
                                        {event.title}
                                    </h3>
                                    {event.short_desc && (
                                        <p className="text-[#8888AA] text-xs font-sans leading-relaxed mb-4 line-clamp-2">
                                            {event.short_desc}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-[#8888AA] text-xs font-mono">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(event.event_date)}
                                        </span>
                                        {event.location && (
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3 w-3" />
                                                {event.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </>
    )
}
