// app/portal/events/page.tsx — IIMS Collegiate Mission Log
import { createServerSupabaseClient } from '@/lib/supabase/server'
import EventCard from '@/components/portal/EventCard'
import type { Event, Member } from '@/types/database'
import { redirect } from 'next/navigation'
import { Calendar, Search, Filter, Loader2 } from 'lucide-react'

export const revalidate = 0

export default async function PortalEventsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Fetch events from new 'events' table
    const { data: events, error } = await (supabase
        .from('events' as any) as any)
        .select('*')
        .gte('starts_at', new Date().toISOString())
        .eq('is_published', true)
        .order('starts_at', { ascending: true })

    // Fetch RSVPs for current member
    const { data: userRsvps } = await (supabase
        .from('event_rsvps' as any) as any)
        .select('event_id, status')
        .eq('member_id', (member as any).id)

    const rsvpMap = new Map((userRsvps as any[])?.map(r => [r.event_id, r.status]))

    const formattedEvents = (events || []).map((e: any) => ({
        ...e,
        user_rsvp: rsvpMap.get(e.id)
    })) as unknown as (Event & { user_rsvp?: string })[]

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#58151C]/10">
                        <Calendar className="h-3.5 w-3.5" /> Registry
                    </div>
                    <h1 className="text-4xl font-poppins font-black text-[#111827] leading-tight">
                        Mission <span className="text-[#C3161C]">Registry</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-base mt-2 max-w-xl">
                        Central coordination for upcoming operations, training cycles, and sector-wide competitions.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search missions..."
                            className="bg-white border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-medium focus:ring-4 focus:ring-[#58151C]/5 transition-all outline-none"
                        />
                    </div>
                    <button className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#58151C] transition-all">
                        <Filter className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Grid of Events */}
            <div className="grid grid-cols-1 gap-8">
                {formattedEvents.length > 0 ? (
                    formattedEvents.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                ) : (
                    <div className="py-32 rounded-[3.5rem] border-2 border-dashed border-gray-100 bg-white shadow-inner text-center animate-fade-up">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Sector Inactive</p>
                        <p className="text-gray-300 mt-2 font-medium">No missions are currently scheduled for your deployment.</p>
                    </div>
                )}
            </div>

            <footer className="text-center pt-10 pb-20">
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
                    End of Active Log
                </p>
            </footer>
        </div>
    )
}
