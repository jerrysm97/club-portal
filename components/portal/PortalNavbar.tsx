// components/portal/PortalNavbar.tsx — Stealth Terminal Mobile Navbar
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Terminal, LogOut, LayoutDashboard, MessageSquare, Calendar, FileText, Trophy, User, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import type { Member } from '@/types/database'

export default function PortalNavbar({ member }: { member: Member }) {
    const [isOpen, setIsOpen] = useState(false)
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
        { href: '/portal/profile', label: 'My_Profile', icon: User },
    ]

    return (
        <nav className="md:hidden sticky top-0 z-40 bg-black border-b border-[#27272A]">
            <div className="flex items-center justify-between px-4 h-16">
                <Link href="/portal/dashboard" className="flex items-center gap-2 text-[#10B981]">
                    <Terminal className="h-5 w-5" />
                    <span className="font-mono font-bold tracking-wider">IIMS_CYBER</span>
                </Link>
                <button onClick={() => setIsOpen(!isOpen)} className="text-[#A1A1AA] hover:text-[#F8FAFC]">
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="fixed inset-0 top-16 bg-black z-30 flex flex-col p-4 animate-fade-up">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#27272A]">
                        <Avatar src={member.avatar_url} name={member.full_name} />
                        <div>
                            <h3 className="text-[#F8FAFC] font-mono font-bold">{member.full_name}</h3>
                            <p className="text-[#52525B] font-mono text-xs">{member.points} PTS</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex-1 space-y-1 overflow-y-auto">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-3 rounded-sm font-mono text-sm transition-all",
                                        isActive
                                            ? "bg-[#10B981]/10 text-[#10B981] border-l-2 border-[#10B981]"
                                            : "text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#27272A]/50 border-l-2 border-transparent"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}

                        {(member.role === 'admin' || member.role === 'superadmin') && (
                            <Link
                                href="/portal/admin"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-3 py-3 rounded-sm font-mono text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-all border-l-2 border-transparent hover:border-[#EF4444]"
                            >
                                <ShieldAlert className="h-4 w-4" />
                                <span>Admin_Console</span>
                            </Link>
                        )}
                    </div>

                    {/* Logout */}
                    <div className="pt-6 border-t border-[#27272A]">
                        <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-sm font-mono text-sm text-[#EF4444] hover:bg-[#EF4444]/10 transition-all"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Disconnect</span>
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}
