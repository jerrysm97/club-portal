// app/(public)/events/page.tsx — Stealth Terminal Events List
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { PublicEvent } from '@/types/database'

export const revalidate = 60

export default async function EventsPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: events } = await sb.from('public_events').select('*').order('event_date', { ascending: false })

    const listOrEmpty = (events || []) as PublicEvent[]
    const upcoming = listOrEmpty.filter(e => new Date(e.event_date) >= new Date())
    const past = listOrEmpty.filter(e => new Date(e.event_date) < new Date())

    return (
        <div className="bg-black min-h-screen pb-24">
            {/* Header */}
            <section className="py-20 border-b border-[#27272A] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-20" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-mono font-bold text-[#F8FAFC] mb-6">
                        Mission <span className="text-[#10B981]">Log</span>
                    </h1>
                    <p className="text-[#A1A1AA] font-mono text-lg leading-relaxed">
                        Upcoming operations, workshops, and capture-the-flag competitions.
                    </p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Upcoming */}
                <div className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        <h2 className="text-xl font-mono font-bold text-[#F8FAFC] uppercase tracking-wider">Upcoming_Missions</h2>
                    </div>

                    {upcoming.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6">
                            {upcoming.map(e => <EventListItem key={e.id} event={e} />)}
                        </div>
                    ) : (
                        <div className="p-12 border border-dashed border-[#27272A] rounded-sm text-center bg-[#09090B]">
                            <p className="text-[#52525B] font-mono">No active missions scheduled.</p>
                        </div>
                    )}
                </div>

                {/* Past */}
                <div>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-[#52525B]" />
                        <h2 className="text-xl font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">Mission_Archive</h2>
                    </div>

                    {past.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80 hover:opacity-100 transition-opacity">
                            {past.map(e => <EventCard key={e.id} event={e} />)}
                        </div>
                    ) : (
                        <p className="text-[#52525B] font-mono italic">Archive is empty.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function EventListItem({ event }: { event: PublicEvent }) {
    // Determine if we need to use a fallback image or the actual one
    const imgUrl = event.cover_image_url || event.image_url

    return (
        <div className="group flex flex-col md:flex-row bg-[#09090B] border border-[#27272A] rounded-sm overflow-hidden hover:border-[#10B981]/50 transition-all">
            <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0">
                {imgUrl ? (
                    <img src={imgUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 bg-[#111113] hero-grid opacity-30" />
                )}
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-[#10B981] font-mono text-sm font-bold">{formatDate(event.event_date)}</span>
                    <span className="px-2 py-0.5 rounded-full border border-[#27272A] text-[10px] text-[#A1A1AA] font-mono uppercase bg-black">{event.type}</span>
                </div>
                <h3 className="text-2xl font-mono font-bold text-[#F8FAFC] mb-3 group-hover:text-[#10B981] transition-colors">{event.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6 line-clamp-2">{event.short_desc || event.description}</p>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-[#52525B] text-xs font-mono">
                        <MapPin className="h-3 w-3" />
                        {event.location || 'Online'}
                    </div>
                    <Link href={`/events/${event.slug || event.id}`} className="flex items-center gap-2 text-[#F8FAFC] font-mono text-sm font-bold hover:text-[#10B981] transition-colors">
                        Details
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
        <Link href={`/events/${event.slug || event.id}`} className="group block bg-[#09090B] border border-[#27272A] rounded-sm overflow-hidden hover:border-[#52525B] transition-colors">
            <div className="h-40 bg-[#111113] relative overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                {imgUrl ? (
                    <img src={imgUrl} alt={event.title} className="w-full h-full object-cover" />
                ) : null}
            </div>
            <div className="p-5">
                <span className="block text-[#10B981] font-mono text-xs font-bold mb-2">{formatDate(event.event_date)}</span>
                <h3 className="font-mono font-bold text-[#F8FAFC] text-lg mb-2 line-clamp-1">{event.title}</h3>
                <p className="text-[#52525B] text-xs line-clamp-2">{event.short_desc || event.description}</p>
            </div>
        </Link>
    )
}
