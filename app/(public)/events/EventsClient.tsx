// app/(public)/events/EventsClient.tsx — Premium minimal events filter
'use client'

import { useState } from 'react'
import type { PublicEvent } from '@/types/database'

interface Props { events: PublicEvent[] }

const types = ['All', 'CTF', 'Workshop', 'Competition', 'Seminar']
const tabs = ['All', 'Upcoming', 'Past'] as const

const typeBadgeColor: Record<string, string> = {
    ctf: 'bg-red-50 text-red-600',
    workshop: 'bg-blue-50 text-blue-600',
    competition: 'bg-amber-50 text-amber-600',
    seminar: 'bg-purple-50 text-purple-600',
}

export default function EventsClient({ events }: Props) {
    const [typeFilter, setTypeFilter] = useState('All')
    const [tab, setTab] = useState<typeof tabs[number]>('All')

    const now = new Date()
    const filtered = events.filter((e) => {
        if (typeFilter !== 'All' && e.type.toLowerCase() !== typeFilter.toLowerCase()) return false
        if (tab === 'Upcoming' && new Date(e.event_date) < now) return false
        if (tab === 'Past' && new Date(e.event_date) >= now) return false
        return true
    })

    return (
        <section className="py-16 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Type filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${typeFilter === t
                                    ? 'bg-[#6366F1] text-white'
                                    : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:border-[#6366F1]/30'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Time tabs */}
                <div className="flex gap-6 border-b border-[#E5E7EB] mb-8">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${tab === t
                                    ? 'text-[#6366F1] border-[#6366F1]'
                                    : 'text-[#6B7280] border-transparent hover:text-[#111827]'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-[#E5E7EB]">
                        <p className="text-[#6B7280]">No events found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((e) => {
                            const isPast = new Date(e.event_date) < now
                            return (
                                <div key={e.id} className={`bg-white rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow ${isPast ? 'opacity-60' : ''}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadgeColor[e.type] || 'bg-gray-100 text-gray-600'}`}>
                                            {e.type}
                                        </span>
                                        {isPast && <span className="text-xs text-[#9CA3AF]">Past</span>}
                                    </div>
                                    <h3 className="font-semibold text-[#111827] mb-2">{e.title}</h3>
                                    <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{e.description}</p>
                                    <div className="text-xs text-[#9CA3AF]">
                                        {new Date(e.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        {e.location && ` · ${e.location}`}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}
