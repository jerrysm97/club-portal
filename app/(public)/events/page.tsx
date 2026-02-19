// app/(public)/events/page.tsx — Events Page: DB only, no mock data
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import EventGrid from '@/components/public/EventGrid'

export const metadata: Metadata = {
    title: 'Events — ICEHC',
    description: 'Upcoming workshops, CTF competitions, seminars, and hackathons by ICEHC at IIMS College.',
}

export const revalidate = 60

export default async function EventsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: dbEvents } = await supabase
        .from('events')
        .select('id, title, short_desc, type, starts_at, location, cover_image_url')
        .eq('is_published', true)
        .order('starts_at', { ascending: true })

    const events = dbEvents ?? []

    return (
        <div className="bg-black min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <p className="font-mono text-[#00FF87] text-sm mb-2">// upcoming_events.log</p>
                <h1 className="font-mono font-bold text-[#F0F0FF] text-3xl md:text-4xl mb-4">
                    Events
                    <span className="block h-1 w-16 bg-[#00FF87] mt-3 rounded-full" />
                </h1>
                <p className="text-[#8888AA] text-sm font-sans mb-12">
                    Workshops, CTF competitions, seminars, and hackathons.
                </p>

                <EventGrid events={events} />
            </div>
        </div>
    )
}
