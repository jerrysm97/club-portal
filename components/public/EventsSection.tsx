// components/public/EventsSection.tsx
// Data-driven events — Stealth Terminal. Terminal-style empty state.

import type { PublicEvent } from '@/types/database'

const typeBadge: Record<string, string> = {
    CTF: 'bg-[#EF4444]/10 text-[#EF4444]',
    Workshop: 'bg-[#06B6D4]/10 text-[#06B6D4]',
    Seminar: 'bg-[#10B981]/10 text-[#10B981]',
    Competition: 'bg-[#06B6D4]/10 text-[#06B6D4]',
    Other: 'bg-[#27272A] text-[#A1A1AA]',
}

export default function EventsSection({ events }: { events: PublicEvent[] }) {
    return (
        <section className="py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 03_EVENTS</p>
                <h2 className="font-[var(--font-mono)] font-bold text-3xl md:text-4xl text-[#F8FAFC] mb-12">
                    Upcoming Events
                </h2>

                {events.length === 0 ? (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-md p-12 text-center max-w-lg mx-auto">
                        <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3">{'>'} NO_UPCOMING_EVENTS_FOUND</p>
                        <p className="text-[#A1A1AA] text-sm mb-6">The team is preparing something. Follow our socials.</p>
                        <div className="flex items-center justify-center gap-4">
                            <a href="https://instagram.com/iimscyberclub" target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#10B981] text-sm font-[var(--font-mono)] transition-colors">Instagram →</a>
                            <a href="https://facebook.com/iimscyberclub" target="_blank" rel="noopener noreferrer" className="text-[#A1A1AA] hover:text-[#10B981] text-sm font-[var(--font-mono)] transition-colors">Facebook →</a>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map((event) => (
                            <div key={event.id} className="bg-[#09090B] border border-[#27272A] rounded-md overflow-hidden hover:border-[#10B981] transition-colors duration-200">
                                <div className="h-40 bg-[#09090B] relative">
                                    {event.image_url ? (
                                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center border-b border-[#27272A]">
                                            <p className="font-[var(--font-mono)] text-[#27272A] text-xs">{'>'} EVENT_IMAGE</p>
                                        </div>
                                    )}
                                    <span className={`absolute top-3 left-3 text-xs font-bold font-[var(--font-mono)] px-2 py-1 rounded-sm ${typeBadge[event.type] || typeBadge.Other}`}>
                                        {event.type}
                                    </span>
                                </div>
                                <div className="p-5">
                                    <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-2">
                                        {new Date(event.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <h3 className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-sm mb-2">{event.title}</h3>
                                    {event.location && (
                                        <p className="text-[#A1A1AA] text-xs mb-2">{event.location}</p>
                                    )}
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
