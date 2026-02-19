'use client'

import {
    LayoutDashboard, Users, MessageSquare, FileText, Calendar,
    Trophy, Bell, Mail, Image, Briefcase, Settings, Inbox, Activity, CheckSquare
} from 'lucide-react'
import { cn } from '@/lib/utils'

export type AdminTab =
    | 'overview' | 'members' | 'feed' | 'resources' | 'events'
    | 'ctf' | 'notifications' | 'messages' | 'gallery' | 'team'
    | 'settings' | 'inbox' | 'audit'

interface AdminSidebarProps {
    activeTab: AdminTab
    onTabChange: (tab: AdminTab) => void
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'members', label: 'Members', icon: Users },
        { id: 'feed', label: 'Feed', icon: MessageSquare },
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'events', label: 'Events', icon: Calendar },
        { id: 'ctf', label: 'CTF Arena', icon: Trophy },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'messages', label: 'Messages', icon: Mail },
        { id: 'gallery', label: 'Gallery', icon: Image },
        { id: 'team', label: 'Team', icon: Briefcase },
        { id: 'inbox', label: 'Inbox', icon: Inbox },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'audit', label: 'Audit Logs', icon: CheckSquare },
    ]

    return (
        <div className="w-64 border-r border-[#27272A] p-4 space-y-1 h-[calc(100vh-100px)] overflow-y-auto hidden lg:block">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id as AdminTab)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-sm transition-all text-left",
                        activeTab === tab.id
                            ? "bg-[#10B981]/10 text-[#10B981] border-l-2 border-[#10B981]"
                            : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#27272A]/50 border-l-2 border-transparent"
                    )}
                >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    )
}
