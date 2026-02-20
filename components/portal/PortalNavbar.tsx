// components/portal/PortalNavbar.tsx — IIMS IT Club Mobile Topbar (v4.0)
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShieldCheck, LogOut, LayoutDashboard, MessageSquare, Calendar, FileText, Terminal, User, Bell, Rss, GraduationCap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
// Import types safely
type Member = any

const NAV_ITEMS = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/feed', label: 'Feed', icon: Rss },
    { href: '/portal/events', label: 'Events', icon: Calendar },
    { href: '/portal/ctf', label: 'CTF Arena', icon: Terminal },
    { href: '/portal/resources', label: 'Documents', icon: FileText },
    { href: '/portal/messages', label: 'Messages', icon: MessageSquare },
    { href: '/portal/notifications', label: 'Notifications', icon: Bell },
    { href: '/portal/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/portal/profile', label: 'Profile', icon: User },
]

export default function PortalNavbar({ member }: { member: Member }) {
    const [isOpen, setIsOpen] = useState(false)
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
        <nav className="md:hidden sticky top-0 z-[60] bg-white border-b border-[#E0E0E0] shadow-sm">
            <div className="flex items-center justify-between px-5 h-14">
                <Link href="/portal/dashboard" className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-[#1A237E] flex items-center justify-center">
                        <GraduationCap className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-[#212121] text-sm">IT Club</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-[#757575] hover:text-[#212121] p-2 rounded-lg hover:bg-[#F5F5F5] transition-all active:scale-95"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-14 bg-white z-[70] flex flex-col overflow-y-auto">
                    {/* Identity */}
                    <div className="flex items-center gap-3 p-5 border-b border-[#E0E0E0] bg-[#F8F9FA]">
                        <Avatar src={member.avatar_url} name={member.name} size="md" className="ring-2 ring-[#E0E0E0]" />
                        <div className="min-w-0">
                            <p className="font-semibold text-[#212121] truncate">{member.name}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-[#9E9E9E] truncate">
                                {member.club_post || member.role} • {member.points ?? 0} pts
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 p-4 space-y-0.5">
                        <p className="text-[#9E9E9E] text-[10px] font-semibold uppercase tracking-widest px-3 py-2">Navigation</p>

                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href || pathname.startsWith(href + '/')
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all',
                                        active
                                            ? 'bg-[#E53935]/8 text-[#E53935] font-medium'
                                            : 'text-[#757575] hover:bg-[#F5F5F5] hover:text-[#212121]'
                                    )}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    <span>{label}</span>
                                </Link>
                            )
                        })}

                        {isAdmin && (
                            <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                                <p className="text-[#9E9E9E] text-[10px] font-semibold uppercase tracking-widest px-3 pb-2">Administration</p>
                                <Link
                                    href="/portal/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm transition-all font-semibold',
                                        pathname.startsWith('/portal/admin')
                                            ? 'bg-[#1A237E] text-white'
                                            : 'text-[#1A237E] hover:bg-[#1A237E]/8'
                                    )}
                                >
                                    <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                                    <span>Admin Panel</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sign Out */}
                    <div className="p-4 border-t border-[#E0E0E0]">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm text-[#9E9E9E] bg-[#F5F5F5] hover:bg-[#FFEBEE] hover:text-[#B71C1C] transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
