// components/public/EventGrid.tsx — Client island for event filtering
'use client'
import { useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'

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
    workshop: 'text-[#E53935] bg-[#E53935]/10 border-[#E53935]/30',
    ctf: 'text-[#1A237E] bg-[#1A237E]/10 border-[#1A237E]/30',
    seminar: 'text-[#2E7D32] bg-[#2E7D32]/10 border-[#2E7D32]/30',
    competition: 'text-[#E53935] bg-[#E53935]/10 border-[#E53935]/30',
    meetup: 'text-[#1A237E] bg-[#1A237E]/10 border-[#1A237E]/30',
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
                        className={`text-xs px-4 py-2 rounded-md border transition-all font-semibold ${filter === value
                            ? 'text-[#E53935] bg-[#E53935]/10 border-[#E53935]/30'
                            : 'text-[#616161] bg-white border-[#E0E0E0] hover:text-[#212121] hover:bg-[#F8F9FA]'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Event cards */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-[#E0E0E0] rounded-lg p-12 text-center">
                    <p className="text-[#616161] text-sm">
                        No upcoming events. Check back soon.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event) => {
                        const badgeClass = TYPE_BADGES[event.type] || TYPE_BADGES.seminar
                        return (
                            <div
                                key={event.id}
                                className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden hover:shadow-md hover:border-[#1A237E]/20 transition-all duration-200 group"
                            >
                                {event.image_url || event.cover_image_url ? (
                                    <div className="h-48 relative overflow-hidden">
                                        <img src={(event.image_url || event.cover_image_url) || ''} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        <div className="absolute bottom-2 left-2 bg-[#E53935] text-white px-3 py-1 rounded-tr-lg">
                                            <div className="text-xs font-bold uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</div>
                                            <div className="text-xl font-bold leading-none">{new Date(event.event_date).getDate()}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-48 bg-[#F5F5F5] flex items-center justify-center border-b border-[#E0E0E0]">
                                        <Calendar className="h-10 w-10 text-[#BDBDBD]" />
                                    </div>
                                )}

                                <div className="p-5">
                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${badgeClass} inline-block mb-3 font-semibold`}>
                                        {event.type}
                                    </span>
                                    <h3 className="font-bold text-[#212121] text-sm mb-2 group-hover:text-[#1A237E] transition-colors">
                                        {event.title}
                                    </h3>
                                    {event.short_desc && (
                                        <p className="text-[#757575] text-xs leading-relaxed mb-4 line-clamp-2">
                                            {event.short_desc}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 text-[#757575] text-xs">
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
