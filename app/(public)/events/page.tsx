// app/(public)/events/page.tsx
// Events page: filterable event cards with tabs (All, Upcoming, Past)
// TODO: Replace hardcoded events array with Supabase fetch in Phase 4

'use client'

import { useState } from 'react'

type EventStatus = 'upcoming' | 'past'

interface ClubEvent {
    date: string
    title: string
    description: string
    location: string
    status: EventStatus
}

// Hardcoded events data — replace with Supabase fetch later
const allEvents: ClubEvent[] = [
    {
        date: '15 Mar',
        title: 'Capture The Flag Competition',
        description: 'Test your hacking skills in our annual CTF challenge. Teams of 3-4 compete across web exploitation, cryptography, and digital forensics.',
        location: 'IIMS Lab 301',
        status: 'upcoming',
    },
    {
        date: '28 Mar',
        title: 'Cybersecurity Career Panel',
        description: 'Industry professionals share insights on building a career in penetration testing, security operations, and incident response.',
        location: 'IIMS Auditorium',
        status: 'upcoming',
    },
    {
        date: '10 Apr',
        title: 'Ethical Hacking Workshop',
        description: 'Hands-on workshop covering Nmap scanning, Burp Suite, vulnerability assessment, and basic exploitation with Metasploit.',
        location: 'IIMS Lab 204',
        status: 'upcoming',
    },
    {
        date: '5 Jan',
        title: 'New Year Orientation',
        description: 'Welcome session for new members — introduction to club activities, team structure, and Q&A with the exec board.',
        location: 'IIMS Hall B',
        status: 'past',
    },
    {
        date: '18 Nov',
        title: 'Bug Bounty Bootcamp',
        description: 'Two-day intensive bootcamp on web application security, OWASP Top 10, and finding real vulnerabilities on bug bounty platforms.',
        location: 'IIMS Lab 301',
        status: 'past',
    },
    {
        date: '2 Oct',
        title: 'Cyber Awareness Week',
        description: 'Week-long campus campaign with posters, talks, and interactive sessions on password security, phishing, and social engineering.',
        location: 'IIMS Campus',
        status: 'past',
    },
]

type FilterTab = 'all' | 'upcoming' | 'past'

export default function EventsPage() {
    const [activeTab, setActiveTab] = useState<FilterTab>('all')

    // Filter events based on active tab
    const filteredEvents =
        activeTab === 'all'
            ? allEvents
            : allEvents.filter((e) => e.status === activeTab)

    const tabs: { key: FilterTab; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'upcoming', label: 'Upcoming' },
        { key: 'past', label: 'Past' },
    ]

    return (
        <div className="bg-slate-950">

            {/* Hero Banner */}
            <section className="relative py-28 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events & Activities</h1>
                    <p className="text-lg text-slate-400">
                        Workshops, competitions, and networking — where learning meets action.
                    </p>
                </div>
            </section>

            {/* Filter Tabs + Events Grid */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">

                    {/* Filter tabs */}
                    <div className="flex items-center justify-center gap-2 mb-12">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.key
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Events grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-indigo-500/50 transition-all duration-300 group"
                            >
                                {/* Top row: date badge + status badge */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="inline-flex items-center px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-sm font-semibold rounded-lg">
                                        {event.date}
                                    </div>
                                    <span
                                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${event.status === 'upcoming'
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-600/30 text-slate-400'
                                            }`}
                                    >
                                        {event.status === 'upcoming' ? 'Upcoming' : 'Past'}
                                    </span>
                                </div>

                                {/* Event title */}
                                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                    {event.title}
                                </h3>

                                {/* Description */}
                                <p className="text-slate-400 text-sm leading-relaxed mb-5">
                                    {event.description}
                                </p>

                                {/* Location */}
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>

                                {/* Register button for upcoming events */}
                                {event.status === 'upcoming' && (
                                    <button className="mt-5 w-full py-2.5 text-sm font-medium text-indigo-400 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/10 transition-colors">
                                        Register Interest
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Empty state */}
                    {filteredEvents.length === 0 && (
                        <div className="text-center py-16">
                            <p className="text-slate-500">No events found in this category.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
