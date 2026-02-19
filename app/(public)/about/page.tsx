// app/(public)/about/page.tsx
// About page — Stealth Terminal themed.

import { supabaseServer } from '@/lib/supabase-server'
import type { SiteSettings, TeamMember } from '@/types/database'
import TeamSection from '@/components/public/TeamSection'

export default async function AboutPage() {
    const [settingsRes, teamRes] = await Promise.all([
        supabaseServer.from('site_settings').select('*').eq('id', 'global').single(),
        supabaseServer.from('team_members').select('*').order('sort_order', { ascending: true }),
    ])

    const settings = settingsRes.data as SiteSettings | null
    const team = (teamRes.data as TeamMember[]) || []
    const aboutText = settings?.about_text || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu.'

    return (
        <div className="bg-black">
            {/* Hero */}
            <section className="py-20 px-4 bg-black bg-grid border-b border-[#27272A]">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#A1A1AA] text-xs mb-2">Home / About</p>
                    <h1 className="font-[var(--font-mono)] font-bold text-4xl md:text-5xl text-[#F8FAFC]">About Us</h1>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 px-4 bg-black">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 01_OUR_STORY</p>
                    <div className="max-w-3xl">
                        <p className="text-[#A1A1AA] leading-relaxed mb-6">{aboutText}</p>
                        <p className="text-[#A1A1AA] leading-relaxed">
                            Founded in 2024 at IIMS College, the IIMS Cybersecurity Club was established with a singular mission: to build Nepal&apos;s next generation of cybersecurity professionals. What began as a small group of passionate students has grown into a thriving community of ethical hackers, defenders, and researchers.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 bg-[#09090B]">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 02_VALUES</p>
                    <h2 className="font-[var(--font-mono)] font-bold text-3xl text-[#F8FAFC] mb-12">What We Stand For</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { title: 'Mission', text: 'To cultivate cybersecurity talent through practical, hands-on education and real-world security challenges.' },
                            { title: 'Vision', text: 'A Nepal where every digital system is secured by locally trained, world-class cybersecurity professionals.' },
                            { title: 'Values', text: 'Integrity. Curiosity. Collaboration. Ethical practice above all.' },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#09090B] border border-[#27272A] rounded-md p-6 hover:border-[#10B981] transition-colors duration-200">
                                <h3 className="font-[var(--font-mono)] font-bold text-[#10B981] text-sm mb-3">{item.title}</h3>
                                <p className="text-[#A1A1AA] text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <TeamSection team={team} />

            {/* College */}
            <section className="py-16 px-4 bg-[#09090B] border-t border-[#27272A]">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-2">Officially Recognized By</p>
                    <p className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-lg mb-3">IIMS College</p>
                    <a href="https://iimscollege.edu.np/" target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:text-[#10B981] text-sm font-[var(--font-mono)] transition-colors">
                        iimscollege.edu.np →
                    </a>
                </div>
            </section>
        </div>
    )
}
