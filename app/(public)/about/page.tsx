// app/(public)/about/page.tsx — Premium minimal about page
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
            <div className="bg-gradient-to-br from-[#111827] to-[#1E1B4B] text-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#C7D2FE]/60 mb-1">Home / About</p>
                    <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
                </div>
            </div>

            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#111827] mb-4">Our Story</h2>
                    <p className="text-[#6B7280] leading-relaxed text-lg">
                        {aboutText || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity.'}
                    </p>
                </div>
            </section>

            <section className="py-20 bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#111827] mb-4">Our Values</h2>
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        {[
                            { title: 'Learn by Doing', desc: 'Hands-on labs, CTFs, and real-world projects over pure theory.', icon: '🧪' },
                            { title: 'Community First', desc: 'Knowledge sharing, mentorship, and lifting each other up.', icon: '🤝' },
                            { title: 'Responsible Disclosure', desc: 'Ethical practices in all security research and engagements.', icon: '🛡️' },
                        ].map((v) => (
                            <div key={v.title} className="bg-white rounded-xl p-6 border border-[#E5E7EB]">
                                <div className="text-2xl mb-3">{v.icon}</div>
                                <h3 className="font-semibold text-[#111827] mb-2">{v.title}</h3>
                                <p className="text-sm text-[#6B7280]">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {team.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-2xl font-bold text-[#111827] mb-8">Leadership Team</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {team.map((m) => (
                                <div key={m.id} className="text-center">
                                    {m.avatar_url ? (
                                        <img src={m.avatar_url} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-full mx-auto mb-3 bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] text-xl font-bold">
                                            {m.name.charAt(0)}
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-[#111827] text-sm">{m.name}</h3>
                                    <p className="text-xs text-[#6366F1]">{m.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
