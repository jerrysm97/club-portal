// components/portal/PortalNavbar.tsx — IIMS IT Club Mobile Topbar (v4.0)
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, ShieldCheck, LogOut, LayoutDashboard, MessageSquare, Calendar, FileText, Terminal, User, Bell, Rss, GraduationCap, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase'
import Avatar from '@/components/ui/Avatar'
import { BRAND } from '@/lib/brand'
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

export default function PortalNavbar({ member, unreadMessages = 0 }: { member: Member, unreadMessages?: number }) {
    const pathname = usePathname()

    const isAdmin = member.role === 'admin' || member.role === 'superadmin'

    // Minimal top layout: Brand + Profile
    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="md:hidden sticky top-0 z-[60] bg-white border-b border-[#E0E0E0] shadow-sm">
                <div className="flex items-center justify-between px-5 h-14">
                    <Link href="/portal/dashboard" className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-sm bg-[#111111] flex items-center justify-center shadow-inner">
                            <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="font-bold text-[#212121] text-sm tracking-tight">{BRAND.clubShort}</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link href="/portal/notifications" className={cn(
                            "p-2 rounded-full transition-colors relative",
                            pathname.includes('/notifications') ? "bg-[#FAFAFA] text-[#111111]" : "text-[#757575] hover:bg-[#F5F5F5]"
                        )}>
                            <Bell className="h-5 w-5" />
                        </Link>
                        <Link href="/portal/profile">
                            <Avatar src={member.avatar_url} name={member.name} size="sm" className="ring-2 ring-[#E0E0E0]" />
                        </Link>
                    </div>
                </div>

                {/* Secondary Horizontal Scroll Menu */}
                <div className="flex overflow-x-auto hide-scrollbar px-4 py-2 gap-2 border-t border-[#F5F5F5] bg-[#F8F9FA]">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/')
                        // Exclude bottom nav items from top scroll (Dashboard, Feed, Messages, Resources)
                        if (['/portal/dashboard', '/portal/feed', '/portal/messages', '/portal/resources'].includes(href)) return null

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                                    active
                                        ? 'bg-[#111111] text-white shadow-sm shadow-[#111111]/20'
                                        : 'bg-white text-[#757575] border border-[#E0E0E0]'
                                )}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                {label}
                            </Link>
                        )
                    })}
                    {isAdmin && (
                        <Link href="/portal/admin" className="whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FFEBEE] text-[#D32F2F] border border-[#FFCDD2] shadow-sm">
                            <ShieldCheck className="h-3.5 w-3.5" /> Admin
                        </Link>
                    )}
                </div>
            </nav>

            {/* Sticky Bottom Action Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-white border-t border-[#E0E0E0] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-around h-16 px-2">
                    {[
                        { href: '/portal/dashboard', label: 'Home', icon: LayoutDashboard },
                        { href: '/portal/feed', label: 'Feed', icon: Rss },
                        { href: '/portal/messages', label: 'Chat', icon: MessageSquare },
                        { href: '/portal/resources', label: 'Docs', icon: FileText }
                    ].map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/')
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'flex flex-col items-center justify-center w-16 h-full gap-1 transition-all',
                                    active ? 'text-[#111111]' : 'text-[#9E9E9E] hover:text-[#757575]'
                                )}
                            >
                                <div className={cn("p-1.5 rounded-sm transition-all relative", active ? 'bg-[#FAFAFA]' : '')}>
                                    <Icon className={cn("h-5 w-5", active && "fill-[#111111]/10")} />
                                    {href === '/portal/messages' && unreadMessages > 0 && (
                                        <span className="absolute top-1 right-1 h-2 w-2 bg-[#E53935] rounded-full ring-2 ring-white"></span>
                                    )}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
