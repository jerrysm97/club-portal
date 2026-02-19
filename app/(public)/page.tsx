// app/(public)/page.tsx
// Homepage — Server Component. Fetches all dynamic data and passes to sections.

import { supabaseServer } from '@/lib/supabase-server'
import type { PublicEvent, GalleryImage, TeamMember, SiteSettings } from '@/types/database'

import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import DomainsSection from '@/components/public/DomainsSection'
import EventsSection from '@/components/public/EventsSection'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import GallerySection from '@/components/public/GallerySection'
import ContactSection from '@/components/public/ContactSection'

export default async function HomePage() {
    // Fetch all data in parallel
    const [eventsRes, galleryRes, teamRes, settingsRes] = await Promise.all([
        supabaseServer.from('public_events').select('*').eq('status', 'upcoming').order('event_date', { ascending: true }),
        supabaseServer.from('public_gallery').select('*').order('sort_order', { ascending: true }),
        supabaseServer.from('team_members').select('*').order('sort_order', { ascending: true }),
        supabaseServer.from('site_settings').select('*').eq('id', 'global').single(),
    ])

    const events = (eventsRes.data as PublicEvent[]) || []
    const gallery = (galleryRes.data as GalleryImage[]) || []
    const team = (teamRes.data as TeamMember[]) || []
    const settings = settingsRes.data as SiteSettings | null

    return (
        <div className="bg-black">
            <HeroSection />
            <AboutSection aboutText={settings?.about_text || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu.'} />
            <DomainsSection />
            <EventsSection events={events} />
            <TeamSection team={team} />
            <StatsSection
                statMembers={settings?.stat_members || '50+'}
                statEvents={settings?.stat_events || '15+'}
                statCompetitions={settings?.stat_competitions || '5+'}
                statPartners={settings?.stat_partners || '3+'}
            />
            <GallerySection gallery={gallery} />
            <ContactSection contactEmail={settings?.contact_email || 'cybersec@iimscollege.edu.np'} />
        </div>
    )
}
