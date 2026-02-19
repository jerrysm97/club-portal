// components/portal/PortalNavbar.tsx — IIMS Collegiate Mobile Portal Navbar
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShieldCheck, LogOut, LayoutDashboard, MessageSquare, Calendar, FileText, Terminal, User, Bell, Rss, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/ui/Avatar'
import type { Member } from '@/types/database'

const NAV_ITEMS = [
    { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/portal/feed', label: 'Feed', icon: Rss },
    { href: '/portal/events', label: 'Events', icon: Calendar },
    { href: '/portal/ctf', label: 'CTF Arena', icon: Terminal },
    { href: '/portal/resources', label: 'Documents', icon: FileText },
    { href: '/portal/messages', label: 'Messages', icon: MessageSquare },
    { href: '/portal/notifications', label: 'Alerts', icon: Bell },
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
        <nav className="md:hidden sticky top-0 z-[60] bg-[#58151C] shadow-lg">
            <div className="flex items-center justify-between px-6 h-16">
                <Link href="/portal/dashboard" className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-lg transform rotate-[-3deg]">
                        <ShieldCheck className="h-4.5 w-4.5 text-[#58151C]" />
                    </div>
                    <span className="font-poppins font-black text-white text-sm tracking-tight">IIMS CYBER</span>
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white bg-white/10 p-2 rounded-xl active:scale-95 transition-all"
                    aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-white z-[70] flex flex-col overflow-y-auto animate-fade-up">
                    {/* Identity Summary */}
                    <div className="flex items-center gap-4 p-6 border-b border-gray-100 bg-gray-50">
                        <Avatar src={member.avatar_url} name={member.full_name} size="md" className="ring-2 ring-white shadow-md" />
                        <div className="min-w-0">
                            <p className="font-poppins font-bold text-[#111827] truncate">{member.full_name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 truncate">
                                {member.club_post || member.role} • {member.points} PTS
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 p-4 space-y-1">
                        <div className="px-4 py-2 mt-4 mb-2">
                            <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">Core Operations</span>
                        </div>

                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href || pathname.startsWith(href + '/')
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all transition-colors',
                                        active
                                            ? 'bg-[#58151C] text-white shadow-xl shadow-red-100 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#58151C]'
                                    )}
                                >
                                    <Icon className={cn("h-5 w-5", active ? "text-white" : "text-gray-400")} />
                                    <span className="flex-1">{label}</span>
                                    {active && <ChevronRight className="h-4 w-4 opacity-50" />}
                                </Link>
                            )
                        })}

                        {isAdmin && (
                            <div className="mt-6 border-t border-gray-100 pt-4">
                                <div className="px-4 pb-4">
                                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-[0.2em]">Administration</span>
                                </div>
                                <Link
                                    href="/portal/admin"
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        'flex items-center gap-4 px-5 py-4 rounded-2xl text-sm transition-all font-bold',
                                        pathname.startsWith('/portal/admin')
                                            ? 'bg-[#FCD34D] text-[#58151C] shadow-lg shadow-amber-100'
                                            : 'text-[#58151C] bg-[#FCD34D]/10 hover:bg-[#FCD34D]/20'
                                    )}
                                >
                                    <ShieldCheck className="h-5 w-5" />
                                    <span className="flex-1">Base Command Panel</span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-6 border-t border-gray-100 mt-auto">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center justify-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-[#C3161C] transition-all"
                        >
                            <LogOut className="h-5 w-5" />
                            <span>Terminate Session</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
