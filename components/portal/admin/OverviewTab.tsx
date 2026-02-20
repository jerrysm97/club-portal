// components/portal/admin/OverviewTab.tsx — IIMS IT Club Mission Intelligence (v4.0)
'use client'

import { Users, MessageSquare, Calendar, Trophy, FileText, Zap, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function OverviewTab({ data }: { data: any }) {
    const stats = [
        { label: 'Total Members', value: data.members.length, icon: Users, color: 'text-[#1976D2]', bg: 'bg-[#E3F2FD]' },
        { label: 'Feed Posts', value: data.posts.length, icon: MessageSquare, color: 'text-[#5E35B1]', bg: 'bg-[#EDE7F6]' },
        { label: 'Missions Logged', value: data.events.length, icon: Calendar, color: 'text-[#43A047]', bg: 'bg-[#E8F5E9]' },
        { label: 'Arena Challenges', value: data.challenges.length, icon: Trophy, color: 'text-[#F57C00]', bg: 'bg-[#FFF3E0]' },
        { label: 'Archive Documents', value: data.resources.length, icon: FileText, color: 'text-[#1A237E]', bg: 'bg-[#E8EAF6]' },
        { label: 'Pending Approvals', value: data.members.filter((m: any) => m.status === 'pending').length, icon: ShieldCheck, color: 'text-[#D32F2F]', bg: 'bg-[#FFEBEE]' },
    ]

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-8 rounded-[2rem] border border-[#E0E0E0] shadow-sm hover:shadow-xl hover:border-[#1A237E]/20 transition-all group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={cn("p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <Zap className="h-5 w-5 text-[#EEEEEE] group-hover:text-[#FDD835] transition-colors" />
                        </div>
                        <span className="block text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest mb-1.5">{stat.label}</span>
                        <span className="block text-4xl font-bold text-[#212121]">{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="bg-[#1A237E] rounded-[3rem] p-10 md:p-12 text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32 group-hover:bg-[#E53935]/10 transition-colors duration-1000" />
                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h3 className="text-3xl font-bold mb-4">Command Oversight Active</h3>
                        <p className="text-[#C5CAE9] font-medium leading-relaxed">
                            Terminal monitoring and operative management protocols are currently in effect.
                            All administrative actions are logged and audited via the IIMS IT Club Security Protocol.
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-4 bg-[#0D1757]/40 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-md min-w-[200px]">
                        <ShieldCheck className="h-10 w-10 text-[#E53935]" />
                        <div className="text-center">
                            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1 text-[#9FA8DA]">Security Level</span>
                            <span className="block text-2xl font-bold text-white">OR-7 ALPHA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
