// app/(public)/contact/page.tsx
// Contact page — Stealth Terminal themed, reuses ContactSection component.

import { supabaseServer } from '@/lib/supabase-server'
import type { SiteSettings } from '@/types/database'
import ContactSection from '@/components/public/ContactSection'

export default async function ContactPage() {
    const { data } = await supabaseServer.from('site_settings').select('*').eq('id', 'global').single()
    const settings = data as SiteSettings | null

    return (
        <div className="bg-black min-h-screen">
            <section className="py-20 px-4 bg-black bg-grid border-b border-[#27272A]">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#A1A1AA] text-xs mb-2">Home / Contact</p>
                    <h1 className="font-[var(--font-mono)] font-bold text-4xl md:text-5xl text-[#F8FAFC]">Contact</h1>
                </div>
            </section>
            <ContactSection contactEmail={settings?.contact_email || 'cybersec@iimscollege.edu.np'} />
        </div>
    )
}
