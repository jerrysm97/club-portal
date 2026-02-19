// components/Sidebar.tsx
// Stealth Terminal sidebar — matte dark, emerald active state with left border.

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkRole = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { data: member } = await supabase
                    .from('members').select('role').eq('id', session.user.id).single()
                if (member?.role === 'admin') setIsAdmin(true)
            }
        }
        checkRole()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    const navLinks = [
        {
            name: 'Feed',
            href: '/portal/dashboard',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
        },
        {
            name: 'Documents',
            href: '/portal/dashboard/documents',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
        },
        {
            name: 'Profile',
            href: '/portal/dashboard/profile',
            icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        },
    ]

    const SidebarContent = () => (
        <aside className="flex flex-col h-full bg-[#09090B] border-r border-[#27272A] w-56">
            {/* Label */}
            <div className="p-4 border-b border-[#27272A]">
                <p className="font-[var(--font-mono)] text-[#10B981] text-xs">// Dashboard</p>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-[var(--font-mono)] rounded-sm transition-colors duration-200 ${isActive
                                    ? 'border-l-2 border-[#10B981] text-[#10B981] pl-[10px] bg-[#10B981]/5'
                                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-white/5'
                                }`}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    )
                })}

                {isAdmin && (
                    <>
                        <div className="border-t border-[#27272A] my-2" />
                        <Link
                            href="/portal/admin"
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 text-sm font-[var(--font-mono)] rounded-sm transition-colors duration-200 ${pathname === '/portal/admin'
                                    ? 'border-l-2 border-[#10B981] text-[#10B981] pl-[10px] bg-[#10B981]/5'
                                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-white/5'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Admin
                        </Link>
                    </>
                )}
            </nav>

            {/* Sign out */}
            <div className="p-3 border-t border-[#27272A]">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-[var(--font-mono)] text-[#A1A1AA] hover:text-[#EF4444] hover:bg-[#EF4444]/5 rounded-sm transition-colors duration-200"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                </button>
            </div>
        </aside>
    )

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-[3.75rem] left-4 z-40 md:hidden bg-[#09090B] border border-[#27272A] p-2 rounded-sm"
                aria-label="Open menu"
            >
                <svg className="w-5 h-5 text-[#A1A1AA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/70 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile drawer */}
            <div className={`fixed top-14 left-0 bottom-0 z-50 md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex">
                <SidebarContent />
            </div>
        </>
    )
}
