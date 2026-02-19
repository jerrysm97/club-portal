// app/(public)/page.tsx — Homepage: all sections, dynamic data
// Migrated to new table names per CONTEXT.md §17
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import DomainsSection from '@/components/public/DomainsSection'
import EventsSection from '@/components/public/EventsSection'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import GallerySection from '@/components/public/GallerySection'
import ContactSection from '@/components/public/ContactSection'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function HomePage() {
    const sb = await createServerSupabaseClient()

    // Note: Using new table names where possible, or aliased ones for compatibility
    // CONTEXT.md v2.0 renames public_events -> events, etc.
    const [teamRes, eventsRes, galleryRes] = await Promise.all([
        sb.from('team_members').select('*').order('sort_order'),
        sb.from('events').select('*').order('starts_at', { ascending: false }),
        sb.from('public_gallery').select('*').order('sort_order'),
    ])

    const team = teamRes.data || []
    const events = eventsRes.data || []
    const gallery = galleryRes.data || []

    // Stats are derived from existing data or site settings if applicable
    // For now, we use defaults in components if settings are missing
    const settings = {
        about_text: null,
        contact_email: 'cybersec@iimscollege.edu.np',
        stat_members: '150+',
        stat_events: '25+',
        stat_competitions: '10+',
        stat_partners: '5+',
    }

    return (
        <>
            <HeroSection />
            <AboutSection aboutText={settings.about_text} />
            <DomainsSection />
            <EventsSection events={events} />
            <TeamSection team={team} />
            <StatsSection settings={settings as any} />
            <GallerySection images={gallery} />
            <ContactSection contactEmail={settings.contact_email} />
        </>
    )
}
