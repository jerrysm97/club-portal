// app/(public)/about/page.tsx
import { createClient } from '@supabase/supabase-js'
import type { TeamMember } from '@/types/database'

export const revalidate = 60

export default async function AboutPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    const [settingsRes, teamRes] = await Promise.all([
        sb.from('site_settings').select('about_text').eq('id', 'global').single(),
        sb.from('team_members').select('*').order('sort_order'),
    ])

    const aboutText = settingsRes.data?.about_text || ''
    const team: TeamMember[] = teamRes.data || []

    return (
        <>
            {/* Hero banner */}
            <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E1B4B] text-white py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
                <div className="relative max-w-6xl mx-auto">
                    <p className="text-sm text-[#C7D2FE]/50 mb-2 font-medium">Home / About</p>
                    <h1 className="text-4xl md:text-6xl font-extrabold">About Us</h1>
                </div>
            </div>

            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Our Story</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">How It All Started</h2>
                    <p className="text-lg text-[#64748B] leading-relaxed">
                        {aboutText || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity.'}
                    </p>
                </div>
            </section>

            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-14">
                        <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Core Principles</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">Our Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            { title: 'Learn by Doing', desc: 'Hands-on labs, CTFs, and real-world projects over pure theory.', icon: '🧪', gradient: 'from-amber-500/10 to-orange-500/10' },
                            { title: 'Community First', desc: 'Knowledge sharing, mentorship, and lifting each other up.', icon: '🤝', gradient: 'from-blue-500/10 to-cyan-500/10' },
                            { title: 'Responsible Disclosure', desc: 'Ethical practices in all security research and engagements.', icon: '🛡️', gradient: 'from-emerald-500/10 to-green-500/10' },
                        ].map((v) => (
                            <div key={v.title} className={`bg-gradient-to-br ${v.gradient} rounded-2xl p-7 border border-[#E2E8F0] hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}>
                                <div className="text-3xl mb-4">{v.icon}</div>
                                <h3 className="font-bold text-[#0F172A] text-lg mb-2">{v.title}</h3>
                                <p className="text-sm text-[#64748B] leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {team.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-14">
                            <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Leadership</span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A]">Our Team</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {team.map((m) => (
                                <div key={m.id} className="group bg-[#F8FAFC] rounded-2xl p-6 text-center border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                    {m.image_url ? (
                                        <img src={m.image_url} alt={m.name} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover ring-2 ring-[#E2E8F0] group-hover:ring-[#6366F1]/30 transition-all" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center text-[#6366F1] text-2xl font-bold ring-2 ring-[#E2E8F0] group-hover:ring-[#6366F1]/30 transition-all">
                                            {m.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3 className="font-bold text-[#0F172A] text-sm">{m.name}</h3>
                                    <p className="text-xs text-[#6366F1] font-medium mt-1">{m.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
