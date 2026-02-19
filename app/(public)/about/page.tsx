// app/(public)/about/page.tsx — IIMS Collegiate Public About Page
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'
import { Target, ShieldCheck, Award, Zap } from 'lucide-react'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const revalidate = 60

export default async function AboutPage() {
    const sb = await createServerSupabaseClient()

    const [teamRes] = await Promise.all([
        sb.from('team_members').select('*').order('sort_order'),
    ])

    const team = teamRes.data || []

    // Defaults for stats and settings since site_settings is being simplified
    const settings = {
        about_text: null,
        stat_members: '150+',
        stat_events: '25+',
        stat_competitions: '10+',
        stat_partners: '5+',
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="py-32 bg-[#58151C] relative overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 transition-all duration-700 animate-fade-up">
                    <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-8">
                        Our <span className="text-[#FCD34D]">Mission</span>
                    </h1>
                    <p className="text-[#FECACA] font-medium text-xl leading-relaxed max-w-2xl mx-auto">
                        Empowering the next generation of cybersecurity leaders through technical excellence and ethical community building.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-[#58151C] text-white shadow-lg shadow-red-100">
                                <Target className="h-7 w-7" />
                            </div>
                            <h2 className="text-3xl font-poppins font-bold text-[#111827]">Our Mission</h2>
                        </div>
                        <p className="text-[#4B5563] text-lg leading-relaxed font-medium">
                            To cultivate a culture of security awareness and technical curiosity. We bridge the gap between classroom theory and real-world security challenges through hands-on labs, research, and competitive hacking.
                        </p>
                    </div>

                    <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 rounded-2xl bg-[#C3161C] text-white shadow-lg shadow-red-100">
                                <ShieldCheck className="h-7 w-7" />
                            </div>
                            <h2 className="text-3xl font-poppins font-bold text-[#111827]">Our Vision</h2>
                        </div>
                        <p className="text-[#4B5563] text-lg leading-relaxed font-medium">
                            To be the premier student-led security hub in Nepal, fostering a community of skilled professionals capable of defending global infrastructure and innovating in the face of emerging digital threats.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-poppins font-bold text-[#111827] mb-6">Foundational <span className="text-[#C3161C]">Values</span></h2>
                        <div className="h-1.5 w-24 bg-[#FCD34D] mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <ValueCard
                            title="Ethical Integrity"
                            desc="We hold ourselves to the highest moral standards, ensuring our skills are used exclusively for building and defending."
                            icon={<ShieldCheck className="h-6 w-6" />}
                            accent="text-emerald-600 bg-emerald-50"
                        />
                        <ValueCard
                            title="Technical Depth"
                            desc="We dive deep into how systems work, valuing fundamental understanding over superficial knowledge."
                            icon={<Zap className="h-6 w-6" />}
                            accent="text-amber-600 bg-amber-50"
                        />
                        <ValueCard
                            title="Collaborative Growth"
                            desc="Security is a team sport. We succeed by sharing knowledge and lifting each other up as a collective."
                            icon={<Award className="h-6 w-6" />}
                            accent="text-blue-600 bg-blue-50"
                        />
                    </div>
                </div>
            </section>

            <TeamSection team={team} />
            <StatsSection settings={settings as any} />
        </div>
    )
}

function ValueCard({ title, desc, icon, accent }: { title: string; desc: string; icon: React.ReactNode; accent: string }) {
    return (
        <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${accent}`}>
                {icon}
            </div>
            <h3 className="text-2xl font-poppins font-bold text-[#111827] mb-4">{title}</h3>
            <p className="text-[#6B7280] text-base leading-relaxed font-medium">{desc}</p>
        </div>
    )
}
