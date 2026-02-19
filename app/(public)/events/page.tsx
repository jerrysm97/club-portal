// app/(public)/events/page.tsx — IIMS Collegiate Public Events List Page
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Clock, Box } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PublicEvent } from '@/types/database'

export const revalidate = 60

export default async function EventsPage() {
    const sb = await createServerSupabaseClient()
    // Using new table name 'events' per CONTEXT.md §17
    const { data: events } = await sb.from('events').select('*').order('starts_at', { ascending: false })

    const listOrEmpty = (events || []) as PublicEvent[]
    const upcoming = listOrEmpty.filter(e => new Date(e.event_date || e.starts_at || '') >= new Date())
    const past = listOrEmpty.filter(e => new Date(e.event_date || e.starts_at || '') < new Date())

    return (
        <div className="bg-white min-h-screen pb-24">
            {/* Header */}
            <section className="py-32 bg-[#58151C] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-up">
                    <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-8">
                        Mission <span className="text-[#FCD34D]">Log</span>
                    </h1>
                    <p className="text-[#FECACA] font-medium text-xl leading-relaxed max-w-2xl mx-auto">
                        Upcoming operations, technical workshops, and competitive security events at IIMS College.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Upcoming */}
                <div className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-10 w-1.5 rounded-full bg-[#C3161C]" />
                        <h2 className="text-3xl font-poppins font-bold text-[#111827] uppercase tracking-wider">Active Missions</h2>
                    </div>

                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 gap-8">
                            {upcoming.map(e => <EventListItem key={e.id} event={e} />)}
                        </div>
                    ) : (
                        <div className="p-20 rounded-3xl border-2 border-dashed border-gray-200 text-center bg-gray-50 shadow-inner">
                            <Box className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-poppins font-bold text-xl">No active missions scheduled for now.</p>
                            <p className="text-gray-400 mt-2">Check back soon for upcoming workshops and CTFs.</p>
                        </div>
                    )}
                </div>

                {/* Past Events */}
                <div>
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-10 w-1.5 rounded-full bg-gray-300" />
                        <h2 className="text-3xl font-poppins font-bold text-gray-400 uppercase tracking-wider">Archived Operations</h2>
                    </div>

                    {past.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {past.map(e => <EventCard key={e.id} event={e} />)}
                        </div>
                    ) : (
                        <p className="text-[#9CA3AF] font-poppins font-medium italic translate-x-3">The archive is currently empty.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function EventListItem({ event }: { event: PublicEvent }) {
    const imgUrl = event.cover_image_url || event.image_url

    return (
        <div className="group flex flex-col lg:flex-row bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden hover:border-[#C3161C]/30 hover:shadow-2xl transition-all duration-300">
            <div className="w-full lg:w-[40%] h-64 lg:h-auto relative shrink-0 overflow-hidden">
                {imgUrl ? (
                    <img src={imgUrl} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="absolute inset-0 bg-gray-50 hero-grid opacity-30" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="p-8 lg:p-12 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#58151C]/5 text-[#58151C] font-bold text-xs">
                        <Calendar className="h-4 w-4" />
                        {formatDate(event.event_date || event.starts_at || '')}
                    </div>
                    <span className="px-3 py-1.5 rounded-lg border border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest bg-gray-50">{event.type}</span>
                </div>

                <h3 className="text-3xl md:text-4xl font-poppins font-bold text-[#111827] mb-6 group-hover:text-[#C3161C] transition-colors leading-tight">
                    {event.title}
                </h3>

                <p className="text-[#6B7280] text-lg leading-relaxed mb-10 line-clamp-3 font-medium">
                    {event.short_desc || event.description}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-10 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-gray-500 font-medium text-sm">
                        <MapPin className="h-5 w-5 text-[#C3161C]" />
                        {event.location || 'IIMS College Campus'}
                    </div>
                    <Link
                        href={`/events/${event.slug || event.id}`}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#58151C] text-white font-bold hover:bg-[#C3161C] transition-all shadow-lg"
                    >
                        Access Mission Details
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

function EventCard({ event }: { event: PublicEvent }) {
    const imgUrl = event.cover_image_url || event.image_url

    return (
        <Link href={`/events/${event.slug || event.id}`} className="group block bg-gray-50 border border-transparent rounded-2xl overflow-hidden hover:bg-white hover:border-[#E5E7EB] hover:shadow-xl transition-all duration-300">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                {imgUrl ? (
                    <img src={imgUrl} alt={event.title} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                ) : (
                    <div className="absolute inset-0 hero-grid opacity-10 bg-[#58151C]/5" />
                )}
            </div>
            <div className="p-8">
                <span className="block text-[#C3161C] font-bold text-xs mb-3">{formatDate(event.event_date || event.starts_at || '')}</span>
                <h3 className="font-poppins font-bold text-[#111827] text-xl mb-3 line-clamp-1 group-hover:text-[#C3161C] transition-colors">{event.title}</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed line-clamp-2 font-medium">{event.short_desc || event.description}</p>
            </div>
        </Link>
    )
}
