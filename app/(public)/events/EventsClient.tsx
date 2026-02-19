// app/(public)/events/EventsClient.tsx
'use client'

import { useState } from 'react'
import type { PublicEvent } from '@/types/database'

interface Props { events: PublicEvent[] }

const types = ['All', 'CTF', 'Workshop', 'Competition', 'Seminar']
const tabs = ['All', 'Upcoming', 'Past'] as const

const typeBadge: Record<string, string> = {
    ctf: 'bg-red-50 text-red-600 border-red-100',
    workshop: 'bg-blue-50 text-blue-600 border-blue-100',
    competition: 'bg-amber-50 text-amber-600 border-amber-100',
    seminar: 'bg-purple-50 text-purple-600 border-purple-100',
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
        <section className="py-16 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Type filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {types.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${typeFilter === t
                                ? 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white shadow-md shadow-indigo-500/20'
                                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#6366F1]/30 hover:text-[#6366F1]'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Time tabs */}
                <div className="flex gap-6 border-b border-[#E2E8F0] mb-10">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`pb-3 text-sm font-semibold transition-all border-b-2 ${tab === t
                                ? 'text-[#6366F1] border-[#6366F1]'
                                : 'text-[#94A3B8] border-transparent hover:text-[#0F172A]'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-[#E2E8F0] shadow-sm">
                        <div className="text-4xl mb-4">🔍</div>
                        <p className="text-[#64748B] font-medium">No events found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map((e) => {
                            const isPast = new Date(e.event_date) < now
                            return (
                                <div key={e.id} className={`group bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isPast ? 'opacity-50' : ''}`}>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeBadge[e.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                                {e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                                            </span>
                                            {isPast && <span className="text-xs text-[#94A3B8] font-medium bg-gray-50 px-2 py-0.5 rounded-full">Past</span>}
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#6366F1] transition-colors">{e.title}</h3>
                                        <p className="text-sm text-[#64748B] line-clamp-2 mb-5">{e.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                                            <span className="flex items-center gap-1.5">
                                                📅 {new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                            {e.location && (
                                                <span className="flex items-center gap-1.5">📍 {e.location}</span>
                                            )}
                                        </div>
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
