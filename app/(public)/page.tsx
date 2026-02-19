// app/(public)/page.tsx — Homepage: all sections, dynamic data
import { createClient } from '@supabase/supabase-js'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import DomainsSection from '@/components/public/DomainsSection'
import EventsSection from '@/components/public/EventsSection'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import GallerySection from '@/components/public/GallerySection'
import ContactSection from '@/components/public/ContactSection'

export const revalidate = 60

export default async function HomePage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const [settingsRes, teamRes, eventsRes, galleryRes] = await Promise.all([
        sb.from('site_settings').select('*').eq('id', 'global').single(),
        sb.from('team_members').select('*').order('sort_order'),
        sb.from('public_events').select('*').order('event_date', { ascending: false }),
        sb.from('public_gallery').select('*').order('sort_order'),
    ])

    const settings = settingsRes.data
    const team = teamRes.data || []
    const events = eventsRes.data || []
    const gallery = galleryRes.data || []

    return (
        <>
            <HeroSection />
            <AboutSection aboutText={settings?.about_text} />
            <DomainsSection />
            <EventsSection events={events} />
            <TeamSection team={team} />
            <StatsSection settings={settings} />
            <GallerySection images={gallery} />
            <ContactSection contactEmail={settings?.contact_email} />
        </>
    )
}
