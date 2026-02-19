'use client'

import { Users, FileText, Calendar, Trophy, MessageSquare, Eye } from 'lucide-react'

interface OverviewTabProps {
    stats: {
        members: number
        pendingMembers: number
        posts: number
        events: number
        solves: number
        messages: number
    }
}

export default function OverviewTab({ stats }: OverviewTabProps) {
    const cards = [
        { label: 'Total Members', value: stats.members, icon: Users, color: 'text-[#8B5CF6]' },
        { label: 'Pending Review', value: stats.pendingMembers, icon: Eye, color: 'text-[#EAB308]' },
        { label: 'Published Posts', value: stats.posts, icon: MessageSquare, color: 'text-[#3B82F6]' },
        { label: 'Missions Active', value: stats.events, icon: Calendar, color: 'text-[#10B981]' },
        { label: 'CTF Solves', value: stats.solves, icon: Trophy, color: 'text-[#F43F5E]' },
        { label: 'Inbox Msgs', value: stats.messages, icon: FileText, color: 'text-[#A1A1AA]' },
    ]

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">System_Overview</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Real-time status of club operations.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div key={card.label} className="p-6 bg-[#111113] border border-[#27272A] rounded-sm relative overflow-hidden group hover:border-[#3F3F46] transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <card.icon className={`h-16 w-16 ${card.color}`} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-[#A1A1AA] font-mono text-xs uppercase">{card.label}</h3>
                            <div className="text-3xl font-mono font-bold text-[#F8FAFC] mt-1">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 bg-[#10B981]/5 border border-[#10B981]/20 rounded-sm">
                <h3 className="text-[#10B981] font-mono font-bold text-sm mb-2">System Status: OPERATIONAL</h3>
                <p className="text-[#A1A1AA] font-mono text-xs">
                    All subsystems are nominal. Database connectivity stable. Authentication services active.
                </p>
            </div>
        </div>
    )
}
