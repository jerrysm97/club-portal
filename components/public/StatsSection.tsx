// components/public/StatsSection.tsx — IIMS Collegiate Public Stats
import { Users, Calendar, Trophy, Globe, Zap } from 'lucide-react'
import type { SiteSettings } from '@/types/database'

export default function StatsSection({ settings }: { settings?: SiteSettings | null }) {
    return (
        <section className="py-24 bg-white border-y border-[#F3F4F6] relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[30%] h-full bg-gradient-to-l from-[#58151C]/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-[30%] h-full bg-gradient-to-r from-[#FCD34D]/5 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-16">
                    <StatCard
                        icon={<Users className="h-6 w-6" />}
                        value={settings?.stat_members || '150+'}
                        label="Active Members"
                        accent="bg-[#58151C]"
                    />
                    <StatCard
                        icon={<Calendar className="h-6 w-6" />}
                        value={settings?.stat_events || '25+'}
                        label="Events Conducted"
                        accent="bg-[#C3161C]"
                    />
                    <StatCard
                        icon={<Trophy className="h-6 w-6" />}
                        value={settings?.stat_competitions || '10+'}
                        label="Competitions"
                        accent="bg-[#D97706]"
                    />
                    <StatCard
                        icon={<Zap className="h-6 w-6" />}
                        value={settings?.stat_partners || '5+'}
                        label="Industry Partners"
                        accent="bg-[#059669]"
                    />
                </div>
            </div>
        </section>
    )
}

function StatCard({ icon, value, label, accent }: { icon: React.ReactNode; value: string; label: string; accent: string }) {
    return (
        <div className="flex flex-col items-center group text-center">
            <div className={`mb-6 p-5 rounded-2xl ${accent} text-white shadow-xl transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110`}>
                {icon}
            </div>
            <div className="font-poppins font-bold text-4xl md:text-5xl text-[#111827] mb-2">
                {value}
            </div>
            <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">
                {label}
            </div>
        </div>
    )
}
