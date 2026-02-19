// components/portal/Sidebar.tsx — Stealth Terminal Sidebar
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Calendar,
    MessageSquare,
    Trophy,
    User,
    Settings,
    LogOut,
    Terminal,
    ShieldAlert,
    Bell,
    Mail
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { Member } from '@/types/database'

export default function Sidebar({ member, unreadNotifications = 0 }: { member: Member, unreadNotifications?: number }) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/portal/login')
    }

    const NAV_ITEMS = [
        { href: '/portal/dashboard', label: 'Command_Center', icon: LayoutDashboard },
        { href: '/portal/feed', label: 'Intel_Feed', icon: MessageSquare },
        { href: '/portal/events', label: 'Mission_Log', icon: Calendar },
        { href: '/portal/resources', label: 'Archives', icon: FileText },
        { href: '/portal/ctf', label: 'CTF_Arena', icon: Trophy },
        { href: '/portal/notifications', label: 'System_Logs', icon: Bell, badge: unreadNotifications },
        // { href: '/portal/messages', label: 'Encrypted_Comms', icon: Mail }, // Phase 5 part 2
    ]

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-black border-r border-[#27272A] flex flex-col z-30 hidden md:flex">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-[#27272A]">
                <div className="flex items-center gap-2 text-[#10B981]">
                    <Terminal className="h-5 w-5" />
                    <span className="font-mono font-bold tracking-wider">IIMS_CYBER</span>
                </div>
            </div>

            {/* User Profile Summary */}
            <div className="p-6 border-b border-[#27272A]">
                <div className="flex items-center gap-3 mb-3">
                    <Avatar src={member.avatar_url} name={member.full_name} className="w-10 h-10 border border-[#27272A]" />
                    <div className="overflow-hidden">
                        <h3 className="text-[#F8FAFC] font-mono text-sm font-bold truncate">{member.full_name}</h3>
                        <p className="text-[#52525B] font-mono text-xs truncate">@{member.student_id || 'operative'}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#A1A1AA]">Rank_Points</span>
                    <span className="text-[#10B981] font-bold">{member.points} PTS</span>
                </div>
                <div className="w-full h-1 bg-[#27272A] mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] w-3/4 animate-pulse" />
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname.startsWith(item.href)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-sm font-mono text-sm transition-all group",
                                isActive
                                    ? "bg-[#10B981]/10 text-[#10B981] border-l-2 border-[#10B981]"
                                    : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#27272A]/50 border-l-2 border-transparent"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-4 w-4", isActive ? "text-[#10B981]" : "text-[#52525B] group-hover:text-[#F8FAFC]")} />
                                <span>{item.label}</span>
                            </div>
                            {item.badge ? (
                                <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                    {item.badge}
                                </span>
                            ) : null}
                        </Link>
                    )
                })}

                {/* Admin Link */}
                {(member.role === 'admin' || member.role === 'superadmin') && (
                    <div className="pt-4 mt-4 border-t border-[#27272A]">
                        <p className="px-3 text-[10px] font-mono text-[#52525B] uppercase tracking-wider mb-2">Administrative</p>
                        <Link
                            href="/portal/admin"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-sm transition-all group",
                                pathname.startsWith('/portal/admin')
                                    ? "bg-[#EF4444]/10 text-[#EF4444] border-l-2 border-[#EF4444]"
                                    : "text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#EF4444]/5 border-l-2 border-transparent"
                            )}
                        >
                            <ShieldAlert className="h-4 w-4" />
                            <span>Admin_Console</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-[#27272A] space-y-1">
                <Link
                    href="/portal/profile"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-sm transition-all group",
                        pathname === '/portal/profile'
                            ? "text-[#F8FAFC] bg-[#27272A]"
                            : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#27272A]/50"
                    )}
                >
                    <User className="h-4 w-4" />
                    <span>My_Profile</span>
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-sm font-mono text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-left"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Disconnect</span>
                </button>
            </div>
        </aside>
    )
}
