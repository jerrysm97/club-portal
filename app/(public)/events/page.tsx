// app/(public)/events/page.tsx
// Events page — fetches ALL events, renders with client-side filter tabs.

import { supabaseServer } from '@/lib/supabase-server'
import type { PublicEvent } from '@/types/database'
import EventsClient from './EventsClient'

export default async function EventsPage() {
    const { data } = await supabaseServer
        .from('public_events')
        .select('*')
        .order('event_date', { ascending: false })

    const events = (data as PublicEvent[]) || []

    return (
        <div className="bg-black min-h-screen">
            {/* Hero */}
            <section className="py-20 px-4 bg-black bg-grid border-b border-[#27272A]">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#A1A1AA] text-xs mb-2">Home / Events</p>
                    <h1 className="font-[var(--font-mono)] font-bold text-4xl md:text-5xl text-[#F8FAFC]">Events</h1>
                </div>
            </section>

            {/* Events with filter */}
            <EventsClient events={events} />
        </div>
    )
}
