// components/portal/admin/AdminSidebar.tsx — IIMS Collegiate Maroon Admin Nav
'use client'

import {
    Users,
    MessageSquare,
    FileText,
    Calendar,
    Trophy,
    LayoutDashboard,
    ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminTab = 'overview' | 'members' | 'posts' | 'events' | 'ctf' | 'documents'

interface AdminSidebarProps {
    activeTab: AdminTab
    onTabChange: (tab: AdminTab) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const tabs = [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
        { id: 'members', label: 'Operatives', icon: Users },
        { id: 'posts', label: 'Transmissions', icon: MessageSquare },
        { id: 'events', label: 'Mission Log', icon: Calendar },
        { id: 'ctf', label: 'Arena Ops', icon: Trophy },
        { id: 'documents', label: 'Intell Base', icon: FileText },
    ]

    return (
        <aside className="w-72 bg-[#58151C] h-[calc(100vh-64px)] overflow-y-auto hidden lg:flex flex-col border-r border-white/5 shadow-2xl z-40">
            <div className="p-8">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 mb-8">
                    <ShieldAlert className="h-5 w-5 text-[#FCD34D]" />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Elevated Access</span>
                </div>

                <nav className="space-y-1">
                    {tabs.map((tab) => {
                        const active = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id as AdminTab)}
                                className={cn(
                                    "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all group relative",
                                    active
                                        ? "bg-white text-[#58151C] font-bold shadow-xl translate-x-1"
                                        : "text-[#FECACA] hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <tab.icon className={cn("h-5 w-5 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                                <span className="flex-1 text-left">{tab.label}</span>
                                {active && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#C3161C] rounded-r-full" />
                                )}
                            </button>
                        )
                    })}
                </nav>
            </div>

            <div className="mt-auto p-8 border-t border-white/5 bg-black/10">
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.4em] leading-relaxed">
                    IIMS Collegiate Command <br /> Protocols v2.0.4
                </p>
            </div>
        </aside>
    )
}
