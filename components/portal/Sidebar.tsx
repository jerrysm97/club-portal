// components/portal/Sidebar.tsx — IIMS Collegiate Maroon Sidebar
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/Avatar'
import type { Member } from '@/types/database'
import {
    LayoutDashboard,
    Rss,
    Calendar,
    Terminal,
    FileText,
    Bell,
    MessageSquare,
    User,
    ShieldCheck,
    LogOut,
    ChevronRight,
    Trophy
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    member: Member
    unreadNotifications: number
}

const navItems = [
    { href: '/portal/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/portal/feed', icon: Rss, label: 'Feed' },
    { href: '/portal/events', icon: Calendar, label: 'Events' },
    { href: '/portal/ctf', icon: Terminal, label: 'CTF Arena' },
    { href: '/portal/resources', icon: FileText, label: 'Documents' },
    { href: '/portal/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/portal/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { href: '/portal/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ member, unreadNotifications }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const isAdmin = member.role === 'admin' || member.role === 'superadmin'

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#58151C] fixed left-0 top-0 bottom-0 z-50 shadow-2xl">
            {/* Brand Header */}
            <div className="h-20 flex items-center px-8 border-b border-white/5 bg-black/10">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center shadow-lg transform rotate-[-3deg]">
                        <ShieldCheck className="h-5 w-5 text-[#58151C]" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-poppins font-black text-white text-sm tracking-tight leading-none">IIMS CYBER</span>
                        <span className="text-[#FECACA] text-[10px] font-bold tracking-[0.2em] mt-1">v2.0 PORTAL</span>
                    </div>
                </div>
            </div>

            {/* Identity Summary */}
            <div className="px-6 py-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                    <Avatar
                        src={member.avatar_url}
                        name={member.full_name}
                        size="sm"
                        className="ring-2 ring-white/10 group-hover:ring-[#C3161C]/50 transition-all"
                    />
                    <div className="min-w-0">
                        <p className="text-white text-sm font-bold truncate">{member.full_name}</p>
                        <p className="text-[#FECACA] text-[10px] font-black uppercase tracking-widest truncate opacity-60">
                            {member.club_post || member.role}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar" aria-label="Main Navigation">
                <div className="px-4 pb-4">
                    <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Core Operations</span>
                </div>

                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm transition-all relative group',
                                active
                                    ? 'bg-white text-[#58151C] font-bold shadow-xl shadow-black/20 translate-x-1'
                                    : 'text-[#FECACA] hover:bg-white/10 hover:text-white'
                            )}
                        >
                            <Icon className={cn("h-5 w-5 flex-shrink-0 transition-transform", active ? "scale-110" : "group-hover:scale-110")} />
                            <span className="flex-1">{label}</span>
                            {active && <ChevronRight className="h-4 w-4 opacity-50" />}
                        </Link>
                    )
                })}

                {/* Notifications */}
                <Link
                    href="/portal/notifications"
                    className={cn(
                        'flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm transition-all group mt-1',
                        pathname.startsWith('/portal/notifications')
                            ? 'bg-white text-[#58151C] font-bold shadow-xl shadow-black/20 translate-x-1'
                            : 'text-[#FECACA] hover:bg-white/10 hover:text-white'
                    )}
                >
                    <Bell className={cn("h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110")} />
                    <span className="flex-1">Alerts</span>
                    {unreadNotifications > 0 && (
                        <span className="bg-[#FCD34D] text-[#58151C] text-[10px] font-black rounded-lg px-2 py-0.5 shadow-lg group-hover:scale-110 transition-transform">
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                        </span>
                    )}
                </Link>

                {/* Admin Section */}
                {isAdmin && (
                    <div className="mt-8">
                        <div className="px-4 pb-4">
                            <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">Administration</span>
                        </div>
                        <Link
                            href="/portal/admin"
                            className={cn(
                                'flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm transition-all group',
                                pathname.startsWith('/portal/admin')
                                    ? 'bg-[#FCD34D] text-[#58151C] font-bold shadow-xl shadow-black/20'
                                    : 'text-[#FCD34D]/80 hover:bg-[#FCD34D] hover:text-[#58151C]'
                            )}
                        >
                            <ShieldCheck className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1 font-bold">Base Command</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-4 border-t border-white/5 bg-black/5">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-5 py-4 rounded-2xl text-sm text-[#FECACA]/60 hover:bg-red-500/10 hover:text-white transition-all group"
                >
                    <LogOut className="h-5 w-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-bold">Abort Session</span>
                </button>
            </div>
        </aside>
    )
}
