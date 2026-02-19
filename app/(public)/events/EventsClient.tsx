// app/(public)/events/EventsClient.tsx
// Client component for event filter tabs and rendering.

'use client'

import { useState } from 'react'
import type { PublicEvent } from '@/types/database'

const typeColors: Record<string, string> = {
    CTF: 'bg-[#FF3B3B]/20 text-[#FF3B3B]',
    Workshop: 'bg-[#00B4FF]/20 text-[#00B4FF]',
    Seminar: 'bg-[#00FF9C]/20 text-[#00FF9C]',
    Competition: 'bg-orange-500/20 text-orange-400',
    Other: 'bg-white/10 text-[#8892A4]',
}

type FilterTab = 'all' | 'upcoming' | 'past'

export default function EventsClient({ events }: { events: PublicEvent[] }) {
    const [activeTab, setActiveTab] = useState<FilterTab>('all')

    const filtered = activeTab === 'all' ? events : events.filter((e) => e.status === activeTab)

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'past', label: 'Past' },
    ]

    return (
        <section className="py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Type legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
                    {Object.entries(typeColors).map(([type, classes]) => (
                        <div key={type} className="flex items-center gap-1.5">
                            <span className={`w-3 h-3 rounded-full ${classes.split(' ')[0]}`} />
                            <span className="text-[#8892A4] text-xs font-[var(--font-mono)]">{type}</span>
                        </div>
                    ))}
                </div>

                {/* Filter tabs */}
                <div className="flex items-center justify-center gap-2 mb-12">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-6 py-2.5 text-sm font-[var(--font-mono)] rounded-lg transition-all duration-300 ${activeTab === tab.key
                                    ? 'bg-[#00B4FF] text-[#0D0D0D] font-bold shadow-[0_0_15px_rgba(0,180,255,0.3)]'
                                    : 'text-[#8892A4] hover:text-[#00B4FF] hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Events grid */}
                {filtered.length === 0 ? (
                    <div className="glass rounded-2xl p-12 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#00FF9C]/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#00FF9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-3">No events found</h3>
                        <p className="font-[var(--font-exo2)] text-[#8892A4]">Check back soon or try a different filter.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((event) => (
                            <div key={event.id} className={`glass rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(0,180,255,0.2)] transition-all duration-300 ${event.status === 'past' ? 'opacity-70' : ''}`}>
                                <div className="h-40 bg-gradient-to-br from-[#0A1F44] to-[#00B4FF]/20 relative">
                                    {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />}
                                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${typeColors[event.type] || typeColors.Other}`}>
                                        {event.type}
                                    </span>
                                    {event.status === 'past' && (
                                        <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-[#8892A4]">Past</span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <p className="font-[var(--font-mono)] text-[#00B4FF] text-xs mb-2">
                                        {new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <h3 className="font-[var(--font-orbitron)] font-bold text-white text-base mb-2 group-hover:text-[#00B4FF] transition-colors">{event.title}</h3>
                                    {event.location && (
                                        <div className="flex items-center gap-1.5 text-[#8892A4] text-xs mb-2">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                    )}
                                    {event.description && (
                                        <p className="font-[var(--font-exo2)] text-[#8892A4] text-sm">
                                            {event.description.length > 100 ? event.description.slice(0, 100) + '...' : event.description}
                                        </p>
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
