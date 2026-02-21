// components/public/EventGrid.tsx — Client island for event filtering
'use client'
import { useState } from 'react'

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

export default function EventGrid({ events }: { events: EventItem[] }) {
    const [filter, setFilter] = useState('all')

    const filtered = filter === 'all'
        ? events
        : events.filter(e => e.type === filter)

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 justify-center mb-12">
                {FILTERS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setFilter(value)}
                        className={`text-sm px-6 py-2 transition-colors border ${filter === value
                            ? 'bg-[#111111] text-white border-[#111111] font-bold'
                            : 'bg-white text-[#4A4A4A] border-[#E5E5E5] hover:border-[#111111] hover:text-[#111111] font-medium'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Event cards */}
            {filtered.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-[#E5E5E5] bg-[#FAFAFA]">
                    <p className="text-[#4A4A4A] font-medium">
                        No upcoming events match this filter. Check back soon.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((event) => {
                        const eventDate = new Date(event.event_date)
                        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase()
                        const day = eventDate.getDate().toString().padStart(2, '0')

                        return (
                            <div
                                key={event.id}
                                className="bg-white border border-[#E5E5E5] hover:border-[#111111] transition-colors group flex flex-col h-full"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="text-xs font-bold px-3 py-1 border border-[#E5E5E5] text-[#4A4A4A] uppercase tracking-wider group-hover:bg-[#111111] group-hover:text-white group-hover:border-[#111111] transition-colors">
                                            {event.type}
                                        </span>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-[#C8102E] tracking-widest">{month}</div>
                                            <div className="text-2xl font-bold text-[#111111] leading-none">{day}</div>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-xl text-[#111111] mb-3 leading-tight group-hover:text-[#C8102E] transition-colors">
                                        {event.title}
                                    </h3>

                                    {event.short_desc && (
                                        <p className="text-[#4A4A4A] text-sm leading-relaxed mb-6 flex-1">
                                            {event.short_desc}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-4 border-t border-[#E5E5E5]">
                                        <span className="text-xs font-medium text-[#4A4A4A] tracking-wide uppercase">
                                            {event.location || 'Location TBA'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
