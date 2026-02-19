// app/(public)/events/EventsClient.tsx
// Client component — filter tabs for All / Upcoming / Past events.

'use client'

import { useState } from 'react'
import type { PublicEvent } from '@/types/database'

const typeBadge: Record<string, string> = {
    CTF: 'bg-[#EF4444]/10 text-[#EF4444]',
    Workshop: 'bg-[#06B6D4]/10 text-[#06B6D4]',
    Seminar: 'bg-[#10B981]/10 text-[#10B981]',
    Competition: 'bg-[#06B6D4]/10 text-[#06B6D4]',
    Other: 'bg-[#27272A] text-[#A1A1AA]',
}

type Filter = 'all' | 'upcoming' | 'past'

export default function EventsClient({ events }: { events: PublicEvent[] }) {
    const [filter, setFilter] = useState<Filter>('all')

    const filtered = filter === 'all' ? events : events.filter(e => e.status === filter)

    const tabs: { key: Filter; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'past', label: 'Past' },
    ]

    return (
        <section className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Type legend */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <span className="bg-[#EF4444]/10 text-[#EF4444] px-2 py-1 rounded-sm text-xs font-[var(--font-mono)]">CTF</span>
                    <span className="bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-1 rounded-sm text-xs font-[var(--font-mono)]">Workshop/Competition</span>
                    <span className="bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded-sm text-xs font-[var(--font-mono)]">Seminar</span>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 mb-8 border-b border-[#27272A]">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setFilter(tab.key)}
                            className={`px-4 py-3 text-sm font-[var(--font-mono)] transition-colors duration-200 border-b-2 -mb-px ${filter === tab.key
                                    ? 'border-[#10B981] text-[#10B981]'
                                    : 'border-transparent text-[#A1A1AA] hover:text-[#F8FAFC]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Events grid */}
                {filtered.length === 0 ? (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-md p-12 text-center max-w-lg mx-auto">
                        <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3">{'>'} NO_EVENTS_FOUND</p>
                        <p className="text-[#A1A1AA] text-sm">No {filter !== 'all' ? filter : ''} events to display.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((event) => (
                            <div
                                key={event.id}
                                className={`bg-[#09090B] border border-[#27272A] rounded-md overflow-hidden hover:border-[#10B981] transition-colors duration-200 ${event.status === 'past' ? 'opacity-60' : ''
                                    }`}
                            >
                                <div className="h-40 bg-[#09090B] relative">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-b border-[#27272A]">
                                            <p className="font-[var(--font-mono)] text-[#27272A] text-xs">{'>'} EVENT_IMAGE</p>
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`text-xs font-bold font-[var(--font-mono)] px-2 py-1 rounded-sm ${typeBadge[event.type] || typeBadge.Other}`}>
                                            {event.type}
                                        </span>
                                        {event.status === 'past' && (
                                            <span className="bg-[#27272A] text-[#A1A1AA] px-2 py-1 rounded-sm text-xs font-[var(--font-mono)]">Past</span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-2">
                                        {new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <h3 className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-sm mb-2">{event.title}</h3>
                                    {event.location && <p className="text-[#A1A1AA] text-xs mb-2">{event.location}</p>}
                                    {event.description && (
                                        <p className="text-[#A1A1AA] text-sm">{event.description.length > 100 ? event.description.slice(0, 100) + '...' : event.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
