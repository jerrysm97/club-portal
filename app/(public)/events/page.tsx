// app/(public)/events/page.tsx — Events Page: DB + static fallback, filter tabs
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import EventGrid from '@/components/public/EventGrid'

export const metadata: Metadata = {
    title: 'Events — ICEHC',
    description: 'Upcoming workshops, CTF competitions, seminars, and hackathons by ICEHC at IIMS College.',
}

export const revalidate = 60

// Static fallback events from the proposal
const STATIC_EVENTS = [
    {
        id: 'static-1',
        title: 'Introduction to the Red Team',
        short_desc: 'Kickoff workshop: installing Virtual Machines (Kali Linux) and explaining the ethics of hacking.',
        type: 'workshop' as const,
        starts_at: '2025-07-15T10:00:00',
        location: 'IIMS College Lab',
        cover_image_url: null,
    },
    {
        id: 'static-2',
        title: '"Scan the Scammers" Seminar',
        short_desc: 'Awareness session dissecting common financial frauds and educational scams; teaching students to identify and report them.',
        type: 'seminar' as const,
        starts_at: '2025-08-15T14:00:00',
        location: 'IIMS Auditorium',
        cover_image_url: null,
    },
    {
        id: 'static-3',
        title: 'Internal CTF (Capture The Flag)',
        short_desc: 'Beginner-level competition where students solve security puzzles (decryption, web exploitation) for points.',
        type: 'ctf' as const,
        starts_at: '2025-09-15T09:00:00',
        location: 'IIMS Computer Lab',
        cover_image_url: null,
    },
    {
        id: 'static-4',
        title: 'Guest Lecture Series',
        short_desc: 'Inviting a cybersecurity professional to discuss the current job market and threat landscape in Nepal.',
        type: 'seminar' as const,
        starts_at: '2025-10-15T15:00:00',
        location: 'IIMS Seminar Hall',
        cover_image_url: null,
    },
    {
        id: 'static-5',
        title: 'Secure Coding Bootcamp',
        short_desc: 'Collaborating with the Coding Club to teach developers how to patch vulnerabilities (SQL Injection, XSS).',
        type: 'workshop' as const,
        starts_at: '2025-11-15T10:00:00',
        location: 'IIMS College Lab',
        cover_image_url: null,
    },
    {
        id: 'static-6',
        title: 'Hackathon / Cyber Day',
        short_desc: 'College-wide event showcasing projects, tools, and a final "Red vs. Blue" team simulation.',
        type: 'competition' as const,
        starts_at: '2025-12-15T09:00:00',
        location: 'IIMS Campus',
        cover_image_url: null,
    },
]

export default async function EventsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: dbEvents } = await supabase
        .from('events')
        .select('id, title, short_desc, type, starts_at, location, cover_image_url')
        .eq('is_published', true)
        .order('starts_at', { ascending: true })

    const events = dbEvents && dbEvents.length > 0 ? dbEvents : STATIC_EVENTS

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
