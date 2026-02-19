// app/portal/events/page.tsx — Stealth Terminal Events Log
import { createClient } from '@/utils/supabase/server'
import EventCard from '@/components/portal/EventCard'
import type { PublicEvent } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function PortalEventsPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Fetch upcoming events
    // We need to know if the user has RSVP'd.
    // We'll fetch events first, then RSVPs for this user.

    const { data: events, error } = await supabase
        .from('public_events')
        .select('*')
        .gte('event_date', new Date().toISOString()) // Only upcoming? Or all? Let's show upcoming first.
        .order('event_date', { ascending: true })

    const { data: userRsvps } = await supabase
        .from('event_rsvps')
        .select('event_id, status')
        .eq('member_id', session.user.id)

    const rsvpMap = new Map(userRsvps?.map(r => [r.event_id, r.status]))

    const formattedEvents = (events || []).map((e: any) => ({
        ...e,
        user_rsvp: rsvpMap.get(e.id)
    }))

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-mono font-bold text-[#F8FAFC] mb-2">Mission_Log</h1>
                <p className="text-[#A1A1AA] font-mono text-sm max-w-xl">
                    Schedule of upcoming operations, training exercises, and CTF competitions.
                    Confirm your attendance to secure clearance.
                </p>
            </div>

            <div className="space-y-4">
                {formattedEvents.length > 0 ? (
                    formattedEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-[#27272A] rounded-sm">
                        <p className="text-[#52525B] font-mono italic">No active missions scheduled. Stand by for orders.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
