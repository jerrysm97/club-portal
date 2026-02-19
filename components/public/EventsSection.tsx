// components/public/EventsSection.tsx
// Data-driven events section — receives events from parent page.tsx.
// Handles empty state gracefully with elegant fallback.

import type { PublicEvent } from '@/types/database'

// Color mapping for event type badges
const typeColors: Record<string, string> = {
    CTF: 'bg-[#FF3B3B]/20 text-[#FF3B3B]',
    Workshop: 'bg-[#00B4FF]/20 text-[#00B4FF]',
    Seminar: 'bg-[#00FF9C]/20 text-[#00FF9C]',
    Competition: 'bg-orange-500/20 text-orange-400',
    Other: 'bg-white/10 text-[#8892A4]',
}

export default function EventsSection({ events }: { events: PublicEvent[] }) {
    return (
        <section className="py-24 px-4 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 03 — Events</p>
                <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-12">
                    Upcoming Events
                </h2>

                {events.length === 0 ? (
                    /* Elegant empty state */
                    <div className="glass rounded-2xl p-12 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-[#00FF9C]/10 flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#00FF9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-3">
                            The team is cooking up something exciting...
                        </h3>
                        <p className="font-[var(--font-exo2)] text-[#8892A4] mb-6">
                            Check back soon or follow our socials for announcements.
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <a href="https://instagram.com/iimscyberclub" target="_blank" rel="noopener noreferrer" className="text-[#8892A4] hover:text-[#00B4FF] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="https://facebook.com/iimscyberclub" target="_blank" rel="noopener noreferrer" className="text-[#8892A4] hover:text-[#00B4FF] transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                        </div>
                    </div>
                ) : (
                    /* Event cards grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <div key={event.id} className="glass rounded-xl overflow-hidden group hover:shadow-[0_0_20px_rgba(0,180,255,0.2)] transition-all duration-300">
                                {/* Image or gradient fallback */}
                                <div className="h-40 bg-gradient-to-br from-[#0A1F44] to-[#00B4FF]/20 relative">
                                    {event.image_url && (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    )}
                                    {/* Type badge */}
                                    <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full ${typeColors[event.type] || typeColors.Other}`}>
                                        {event.type}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <p className="font-[var(--font-mono)] text-[#00B4FF] text-xs mb-2">
                                        {new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <h3 className="font-[var(--font-orbitron)] font-bold text-white text-base mb-2 group-hover:text-[#00B4FF] transition-colors">
                                        {event.title}
                                    </h3>
                                    {event.location && (
                                        <div className="flex items-center gap-1.5 text-[#8892A4] text-xs mb-2">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            </svg>
                                            {event.location}
                                        </div>
                                    )}
                                    {event.description && (
                                        <p className="font-[var(--font-exo2)] text-[#8892A4] text-sm leading-relaxed">
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
