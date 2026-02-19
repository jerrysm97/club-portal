// app/(public)/events/page.tsx
// Events page — Server Component that fetches ALL events from Supabase.
// Client component handles tab filtering (All/Upcoming/Past).

import { supabaseServer } from '@/lib/supabase-server'
import type { PublicEvent } from '@/types/database'
import EventsClient from './EventsClient'
import Link from 'next/link'

export default async function EventsPage() {
    // Fetch all events (both upcoming and past)
    const { data: events } = await supabaseServer
        .from('public_events')
        .select('*')
        .order('event_date', { ascending: false })

    return (
        <div className="bg-[#0D0D0D]">
            {/* Hero banner */}
            <section className="relative py-28 px-4 bg-grid">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/80 to-[#0D0D0D]" />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="font-[var(--font-orbitron)] font-black text-4xl md:text-5xl text-white mb-4">
                        Events & Activities
                    </h1>
                    <p className="font-[var(--font-mono)] text-[#8892A4] text-sm">
                        <Link href="/" className="hover:text-[#00B4FF] transition-colors">Home</Link>
                        {' / '}
                        <span className="text-[#00B4FF]">Events</span>
                    </p>
                </div>
            </section>

            {/* Events content — client component for tab state */}
            <EventsClient events={(events as PublicEvent[]) || []} />
        </div>
    )
}
