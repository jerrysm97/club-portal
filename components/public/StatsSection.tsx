// components/public/StatsSection.tsx — IIMS IT Club Light Stats (v4.0)
import { Users, Calendar, Shield, Code2 } from 'lucide-react'

export default function StatsSection() {
    return (
        <section className="py-16 bg-[#F8F9FA] border-y border-[#E0E0E0]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={<Users className="h-6 w-6 text-[#E53935]" />}
                        value="120+"
                        label="Active Members"
                    />
                    <StatCard
                        icon={<Calendar className="h-6 w-6 text-[#E53935]" />}
                        value="30+"
                        label="Events Hosted"
                    />
                    <StatCard
                        icon={<Shield className="h-6 w-6 text-[#E53935]" />}
                        value="50+"
                        label="CTF Solves"
                    />
                    <StatCard
                        icon={<Code2 className="h-6 w-6 text-[#E53935]" />}
                        value="5+"
                        label="Years Active"
                    />
                </div>
            </div>
        </section>
    )
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-[#1A237E]/20 transition-all duration-200 group">
            <div className="flex justify-center mb-3">
                {icon}
            </div>
            <div className="font-bold text-4xl text-[#1A237E] mb-1 group-hover:text-[#E53935] transition-colors">
                {value}
            </div>
            <div className="text-[#757575] text-xs font-semibold uppercase tracking-widest">
                {label}
            </div>
        </div>
    )
}
