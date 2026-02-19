// components/public/StatsSection.tsx — Stealth Terminal Stats
import { Users, Calendar, Trophy, Globe } from 'lucide-react'
import type { SiteSettings } from '@/types/database'

export default function StatsSection({ settings }: { settings?: SiteSettings | null }) {
    return (
        <section className="py-24 bg-[#09090B] border-b border-[#27272A] relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 hero-grid opacity-20" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                    <StatCard
                        icon={<Users className="h-6 w-6" />}
                        value={settings?.stat_members || '150+'}
                        label="Active_Agents"
                    />
                    <StatCard
                        icon={<Calendar className="h-6 w-6" />}
                        value={settings?.stat_events || '25+'}
                        label="Missions_Executed"
                    />
                    <StatCard
                        icon={<Trophy className="h-6 w-6" />}
                        value={settings?.stat_competitions || '10+'}
                        label="CTF_Victories"
                    />
                    <StatCard
                        icon={<Globe className="h-6 w-6" />}
                        value={settings?.stat_partners || '5+'}
                        label="Strategic_Alliances"
                    />
                </div>
            </div>
        </section>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="mb-4 p-4 rounded-full bg-[#111113] border border-[#27272A] text-[#10B981] group-hover:scale-110 group-hover:border-[#10B981] transition-all duration-300">
                {icon}
            </div>
            <div className="font-mono font-bold text-4xl text-[#F8FAFC] mb-2">
                {value}
            </div>
            <div className="text-xs font-mono text-[#52525B] uppercase tracking-wider">
                {label}
            </div>
        </div>
    )
}
