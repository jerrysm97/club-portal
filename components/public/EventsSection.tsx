// components/public/EventsSection.tsx — Stealth Terminal Events
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PublicEvent } from '@/types/database'

export default function EventsSection({ events }: { events: PublicEvent[] }) {
    const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).slice(0, 3)

    return (
        <section className="py-24 bg-black border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-4">
                            Mission <span className="text-[#10B981]">Log</span>
                        </h2>
                        <p className="text-[#A1A1AA] max-w-xl font-mono text-sm leading-relaxed">
                            Upcoming workshops, CTFs, and meetups. Join us to level up.
                        </p>
                    </div>
                    <Link href="/events" className="flex items-center gap-2 text-[#F8FAFC] font-mono hover:text-[#10B981] transition-colors group">
                        View_All_Events
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="border border-dashed border-[#27272A] rounded-sm p-12 text-center bg-[#09090B]">
                        <p className="font-mono text-[#52525B]">No upcoming missions detected.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

function EventCard({ event }: { event: PublicEvent }) {
    const isWorkshop = event.type.toLowerCase().includes('workshop')
    const typeColor = isWorkshop ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' : 'text-[#06B6D4] border-[#06B6D4]/30 bg-[#06B6D4]/10'

    return (
        <div className="group flex flex-col h-full bg-[#09090B] border border-[#27272A] rounded-sm overflow-hidden hover:border-[#10B981]/50 transition-all duration-300">
            {/* Date Badge */}
            <div className="absolute top-4 right-4 z-10 font-mono text-xs font-bold bg-black/80 backdrop-blur border border-[#27272A] px-3 py-1.5 rounded-full text-[#F8FAFC]">
                {formatDate(event.event_date)}
            </div>

            {/* Image (or fallback pattern) */}
            <div className="h-48 bg-[#111113] relative overflow-hidden">
                {event.cover_image_url || event.image_url ? (
                    <img
                        src={event.cover_image_url || event.image_url || ''}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 hero-grid opacity-20" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] to-transparent" />
            </div>

            <div className="flex-1 p-6 flex flex-col">
                <div className={`w-fit mb-4 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border rounded-sm ${typeColor}`}>
                    {event.type}
                </div>

                <h3 className="font-mono font-bold text-xl text-[#F8FAFC] mb-2 line-clamp-2 group-hover:text-[#10B981] transition-colors">
                    {event.title}
                </h3>

                <div className="flex items-center gap-2 text-[#A1A1AA] text-sm mb-4">
                    <MapPin className="h-4 w-4 shrink-0 text-[#52525B]" />
                    <span className="truncate">{event.location || 'TBA'}</span>
                </div>

                <p className="text-[#71717A] text-sm line-clamp-3 mb-6 flex-1 text-ellipsis">
                    {event.description || event.short_desc}
                </p>

                <Link
                    href={`/events/${event.slug || event.id}`}
                    className="inline-flex items-center gap-2 text-sm font-mono font-bold text-[#F8FAFC] hover:text-[#10B981] transition-colors"
                >
                    Details_
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}
