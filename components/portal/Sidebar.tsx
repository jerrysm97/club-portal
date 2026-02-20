// components/portal/Sidebar.tsx — IIMS IT Club White Sidebar (v4.0)
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
// Import types safely
type Member = any
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
    Trophy,
    GraduationCap
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
        <aside className="hidden md:flex flex-col w-64 min-h-screen bg-white border-r border-[#E0E0E0] fixed left-0 top-0 bottom-0 z-50 shadow-sm">
            {/* Brand Header */}
            <div className="h-16 flex items-center px-5 border-b border-[#E0E0E0]">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-[#1A237E] flex items-center justify-center shadow-sm">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-[#212121] text-sm block leading-tight">IIMS IT Club</span>
                        <span className="text-[#9E9E9E] text-[10px] block leading-tight">Member Portal</span>
                    </div>
                </div>
            </div>

            {/* Identity Summary */}
            <div className="px-4 py-4 border-b border-[#E0E0E0]">
                <Link href="/portal/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F5F5] transition-colors group">
                    <Avatar
                        src={member.avatar_url}
                        name={member.name}
                        size="sm"
                        className="ring-2 ring-[#E0E0E0] group-hover:ring-[#1A237E]/30 transition-all flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="text-[#212121] text-sm font-semibold truncate">{member.name}</p>
                        <p className="text-[#9E9E9E] text-[10px] font-medium uppercase tracking-wider truncate">
                            {member.club_post || member.role}
                        </p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Main Navigation">
                <p className="text-[#9E9E9E] text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Navigation</p>

                {navItems.map(({ href, icon: Icon, label }) => {
                    const active = pathname === href || pathname.startsWith(href + '/')
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                                active
                                    ? 'bg-[#E53935]/8 text-[#E53935] font-medium'
                                    : 'text-[#757575] hover:text-[#212121] hover:bg-[#F5F5F5]'
                            )}
                        >
                            <Icon className="h-4 w-4 flex-shrink-0" />
                            <span className="flex-1">{label}</span>
                        </Link>
                    )
                })}

                {/* Notifications */}
                <Link
                    href="/portal/notifications"
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                        pathname.startsWith('/portal/notifications')
                            ? 'bg-[#E53935]/8 text-[#E53935] font-medium'
                            : 'text-[#757575] hover:text-[#212121] hover:bg-[#F5F5F5]'
                    )}
                >
                    <Bell className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1">Notifications</span>
                    {unreadNotifications > 0 && (
                        <span className="bg-[#E53935] text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                            {unreadNotifications > 99 ? '99+' : unreadNotifications}
                        </span>
                    )}
                </Link>

                {/* Admin Section */}
                {isAdmin && (
                    <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                        <p className="text-[#9E9E9E] text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Administration</p>
                        <Link
                            href="/portal/admin"
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                                pathname.startsWith('/portal/admin')
                                    ? 'bg-[#1A237E] text-white font-medium'
                                    : 'text-[#1A237E] hover:bg-[#1A237E]/8'
                            )}
                        >
                            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                            <span className="font-semibold">Admin Panel</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Footer / Sign Out */}
            <div className="p-3 border-t border-[#E0E0E0]">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9E9E9E] hover:bg-[#FFEBEE] hover:text-[#B71C1C] transition-all"
                >
                    <LogOut className="h-4 w-4 flex-shrink-0" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}
