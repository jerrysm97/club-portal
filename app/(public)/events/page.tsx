// app/(public)/events/page.tsx — Events listing page
import { createClient } from '@supabase/supabase-js'
import EventsClient from './EventsClient'

export const revalidate = 60

export default async function EventsPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await sb.from('public_events').select('*').order('event_date', { ascending: false })

    return (
        <>
            <div className="bg-gradient-to-br from-[#111827] to-[#1E1B4B] text-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#C7D2FE]/60 mb-1">Home / Events</p>
                    <h1 className="text-4xl md:text-5xl font-bold">Events</h1>
                </div>
            </div>
            <EventsClient events={data || []} />
        </>
    )
}
