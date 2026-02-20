// components/public/StatsSection.tsx — IIMS College Dark Stats Counter
import { Users, Calendar, Building2, Trophy } from 'lucide-react'
// Import types safely
type SiteSettings = any

export default function StatsSection({ settings }: { settings?: SiteSettings | null }) {
    return (
        <section className="py-20 bg-[#1A1A2E] relative overflow-hidden">
            {/* Subtle decorations */}
            <div className="absolute inset-0 hero-grid opacity-[0.04] pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#F4C542]/10 rounded-full blur-[150px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <StatCard
                        icon={<Users className="h-7 w-7" />}
                        value="5000+"
                        label="Alumni Worldwide"
                    />
                    <StatCard
                        icon={<Calendar className="h-7 w-7" />}
                        value="20+"
                        label="Years of Excellence"
                    />
                    <StatCard
                        icon={<Building2 className="h-7 w-7" />}
                        value="100+"
                        label="Partner Companies"
                    />
                    <StatCard
                        icon={<Trophy className="h-7 w-7" />}
                        value="A+"
                        label="QAA Rating"
                    />
                </div>
            </div>
        </section>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="flex flex-col items-center group text-center py-4">
            <div className="mb-5 p-4 rounded-2xl bg-white/5 text-[#F4C542] border border-white/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white/10">
                {icon}
            </div>
            <div className="font-poppins font-bold text-4xl md:text-5xl text-white mb-2 group-hover:text-[#F4C542] transition-colors">
                {value}
            </div>
            <div className="text-white/40 text-xs font-semibold uppercase tracking-[0.2em]">
                {label}
            </div>
        </div>
    )
}
