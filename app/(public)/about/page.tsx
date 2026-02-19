// app/(public)/about/page.tsx — Stealth Terminal About Page
import { createClient } from '@supabase/supabase-js'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import { Terminal, Target, Shield, Cpu } from 'lucide-react'
import type { SiteSettings, TeamMember } from '@/types/database'

export const revalidate = 60

export default async function AboutPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const [settingsRes, teamRes] = await Promise.all([
        sb.from('site_settings').select('*').eq('id', 'global').single(),
        sb.from('team_members').select('*').order('sort_order'),
    ])

    const settings = settingsRes.data as SiteSettings | null
    const team = (teamRes.data || []) as TeamMember[]

    return (
        <div className="bg-black min-h-screen">
            {/* Header */}
            <section className="py-20 border-b border-[#27272A] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-20" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-mono font-bold text-[#F8FAFC] mb-6">
                        About <span className="text-[#10B981]">IIMS Cyber</span>
                    </h1>
                    <p className="text-[#A1A1AA] font-mono text-lg leading-relaxed">
                        We are a collective of student researchers, developers, and security enthusiasts dedicated to mastering the art of information security.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 border-b border-[#27272A]">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-8 rounded-sm bg-[#09090B] border border-[#27272A] hover:border-[#10B981]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-sm bg-[#10B981]/10 text-[#10B981]"><Target className="h-6 w-6" /></div>
                            <h2 className="text-2xl font-mono font-bold text-[#F8FAFC]">Our Mission</h2>
                        </div>
                        <p className="text-[#A1A1AA] font-mono leading-relaxed">
                            To cultivate a culture of security awareness and technical excellence. We aim to bridge the gap between theoretical knowledge and practical application through hands-on workshops, CTFs, and collaborative projects.
                        </p>
                    </div>

                    <div className="p-8 rounded-sm bg-[#09090B] border border-[#27272A] hover:border-[#06B6D4]/50 transition-colors">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-sm bg-[#06B6D4]/10 text-[#06B6D4]"><Shield className="h-6 w-6" /></div>
                            <h2 className="text-2xl font-mono font-bold text-[#F8FAFC]">Our Vision</h2>
                        </div>
                        <p className="text-[#A1A1AA] font-mono leading-relaxed">
                            To be the leading student cybersecurity community in Nepal, producing world-class professionals capable of defending critical infrastructure and advancing the field of information security.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 border-b border-[#27272A] bg-[#09090B]">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-mono font-bold text-[#F8FAFC] mb-12 text-center">Core <span className="text-[#10B981]">Values</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ValueCard title="Integrity" desc="We operate with the highest ethical standards. Responsibility is paramount." icon={<Shield className="h-5 w-5" />} />
                        <ValueCard title="Curiosity" desc="We never stop questioning how things work. Deconstruction is the first step to understanding." icon={<Terminal className="h-5 w-5" />} />
                        <ValueCard title="Innovation" desc="We push boundaries and explore new frontiers in technology and security." icon={<Cpu className="h-5 w-5" />} />
                    </div>
                </div>
            </section>

            <TeamSection team={team} />
            <StatsSection settings={settings} />
        </div>
    )
}

function ValueCard({ title, desc, icon }: { title: string; desc: string; icon: React.ReactNode }) {
    return (
        <div className="text-center group">
            <div className="mx-auto w-12 h-12 rounded-sm bg-[#111113] border border-[#27272A] flex items-center justify-center text-[#10B981] mb-6 group-hover:scale-110 group-hover:border-[#10B981] transition-all">
                {icon}
            </div>
            <h3 className="text-xl font-mono font-bold text-[#F8FAFC] mb-3">{title}</h3>
            <p className="text-[#A1A1AA] text-sm leading-relaxed">{desc}</p>
        </div>
    )
}
