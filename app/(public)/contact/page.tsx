// app/(public)/contact/page.tsx — Stealth Terminal Contact Page
import { createClient } from '@supabase/supabase-js'
import ContactSection from '@/components/public/ContactSection'
import type { SiteSettings } from '@/types/database'

export const revalidate = 60

export default async function ContactPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data: settings } = await sb.from('site_settings').select('*').eq('id', 'global').single()

    return (
        <div className="bg-black min-h-screen">
            {/* Header */}
            <section className="py-20 border-b border-[#27272A] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-20" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-mono font-bold text-[#F8FAFC] mb-6">
                        Secure <span className="text-[#10B981]">Uplink</span>
                    </h1>
                    <p className="text-[#A1A1AA] font-mono text-lg leading-relaxed">
                        Initiate communication with our operators. Channel is encrypted.
                    </p>
                </div>
            </section>

            <ContactSection contactEmail={settings?.contact_email} />
        </div>
    )
}
