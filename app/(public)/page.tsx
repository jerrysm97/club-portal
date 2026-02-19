// app/(public)/page.tsx
// Homepage orchestrator — Server Component that fetches events and gallery from Supabase
// and passes them as props to child section components.

import { supabaseServer } from '@/lib/supabase-server'
import type { PublicEvent, GalleryImage } from '@/types/database'
import HeroSection from '@/components/public/HeroSection'
import AboutSection from '@/components/public/AboutSection'
import DomainsSection from '@/components/public/DomainsSection'
import EventsSection from '@/components/public/EventsSection'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import GallerySection from '@/components/public/GallerySection'
import ContactSection from '@/components/public/ContactSection'

export default async function HomePage() {
    // Fetch upcoming events from Supabase
    const { data: events } = await supabaseServer
        .from('public_events')
        .select('*')
        .eq('status', 'upcoming')
        .order('event_date', { ascending: true })

    // Fetch gallery images sorted by sort_order
    const { data: gallery } = await supabaseServer
        .from('public_gallery')
        .select('*')
        .order('sort_order', { ascending: true })

    return (
        <div className="bg-[#0D0D0D]">
            <HeroSection />
            <AboutSection />
            <DomainsSection />
            <EventsSection events={(events as PublicEvent[]) || []} />
            <TeamSection />
            <StatsSection />
            <GallerySection gallery={(gallery as GalleryImage[]) || []} />
            <ContactSection />
        </div>
    )
}
