// components/portal/admin/OverviewTab.tsx — IIMS Collegiate Mission Intelligence
'use client'

import { Users, MessageSquare, Calendar, Trophy, FileText, Zap, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OverviewTab({ data }: { data: any }) {
    const stats = [
        { label: 'Total Operatives', value: data.members.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Transmissions', value: data.posts.length, icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Missions Logged', value: data.events.length, icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Arena Challenges', value: data.challenges.length, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Asset Fragments', value: data.resources.length, icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Pending Approvals', value: data.members.filter((m: any) => m.status === 'pending').length, icon: ShieldCheck, color: 'text-[#C3161C]', bg: 'bg-red-50' },
    ]

    return (
        <div className="space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <Zap className="h-5 w-5 text-gray-100 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{stat.label}</span>
                        <span className="block text-4xl font-poppins font-black text-[#111827]">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-[#58151C] rounded-[4rem] p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-xl">
                        <h3 className="text-3xl font-poppins font-black mb-4">Command Oversight Active</h3>
                        <p className="text-[#FECACA] font-medium opacity-80 leading-relaxed">
                            Terminal monitoring and operative management protocols are currently in effect.
                            All administrative actions are logged and audited via the IIMS Collegiate Security Protocol.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 bg-black/20 p-8 rounded-[3rem] border border-white/10 backdrop-blur-md min-w-[240px]">
                        <ShieldCheck className="h-10 w-10 text-[#FCD34D]" />
                        <div className="text-center">
                            <span className="block text-[10px] font-black uppercase tracking-[0.2em] mb-1">Security Level</span>
                            <span className="block text-2xl font-poppins font-black text-white">OR-7 ALPHA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
