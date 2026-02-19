// components/public/EventsSection.tsx — IIMS Collegiate Public Events
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PublicEvent } from '@/types/database'

export default function EventsSection({ events }: { events: PublicEvent[] }) {
    const upcomingEvents = events
        .filter(e => new Date(e.event_date || e.starts_at || '') >= new Date())
        .slice(0, 3)

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-poppins text-sm font-bold tracking-wider uppercase mb-4">
                            <Calendar className="h-4 w-4" />
                            <span>Events & Missions</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827]">
                            Current <span className="text-[#C3161C]">Mission Log</span>
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[#E5E7EB] font-bold text-[#374151] hover:border-[#58151C] hover:text-[#58151C] transition-all"
                    >
                        View Full Schedule
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {upcomingEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {upcomingEvents.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-3xl border-2 border-dashed border-[#E5E7EB] p-20 text-center bg-gray-50">
                        <Calendar className="h-12 w-12 text-[#9CA3AF] mx-auto mb-4" />
                        <p className="font-poppins font-bold text-[#4B5563] text-xl">No upcoming missions detected.</p>
                        <p className="text-[#9CA3AF] mt-2 text-sm">Check back later or follow our socials for updates.</p>
                    </div>
                )}
            </div>
        </section>
    )
}

function EventCard({ event }: { event: PublicEvent }) {
    const isWorkshop = event.type.toLowerCase().includes('workshop')
    const typeStyles = isWorkshop
        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
        : 'bg-blue-50 text-blue-700 border-blue-100'

    return (
        <div className="group flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#C3161C]/30 hover:shadow-2xl transition-all duration-300">
            {/* Visual Header */}
            <div className="h-52 relative overflow-hidden bg-gray-100">
                {event.cover_image_url || event.image_url ? (
                    <img
                        src={event.cover_image_url || event.image_url || ''}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 hero-grid opacity-10 bg-[#58151C]/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Type Badge */}
                <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-widest shadow-sm ${typeStyles}`}>
                    {event.type}
                </div>
            </div>

            <div className="flex-1 p-8 flex flex-col">
                <h3 className="font-poppins font-bold text-2xl text-[#111827] mb-4 line-clamp-2 group-hover:text-[#C3161C] transition-colors leading-tight">
                    {event.title}
                </h3>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-[#4B5563] text-sm">
                        <Clock className="h-4 w-4 text-[#C3161C]" />
                        <span className="font-medium">{formatDate(event.event_date || event.starts_at || '')}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#4B5563] text-sm">
                        <MapPin className="h-4 w-4 text-[#C3161C]" />
                        <span className="truncate font-medium">{event.location || 'IIMS College Campus'}</span>
                    </div>
                </div>

                <p className="text-[#6B7280] text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {event.description || event.short_desc}
                </p>

                <Link
                    href={`/events/${event.slug || event.id}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#58151C] hover:text-[#C3161C] transition-colors group/link"
                >
                    View Event Details
                    <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    )
}
