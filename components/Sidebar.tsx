// components/Sidebar.tsx
// Cyber Blue Matrix themed sidebar — deep navy with electric blue active states.
// Fixed on desktop, slide-out on mobile.

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
                    .from('members')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()
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
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            name: 'Documents',
            href: '/portal/dashboard/documents',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Profile',
            href: '/portal/dashboard/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ]

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-18 left-4 z-50 md:hidden bg-[#0A1F44] p-2 rounded-lg border border-[#00B4FF]/30"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-14 left-0 h-[calc(100vh-3.5rem)] w-60 bg-[#0A1F44] border-r border-[#00B4FF]/20 z-50
                flex flex-col transition-transform duration-300 ease-in-out
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:static md:z-auto
            `}>
                {/* Logo area */}
                <div className="p-5 border-b border-[#00B4FF]/20">
                    <h2 className="font-[var(--font-orbitron)] font-bold text-white text-sm">Dashboard</h2>
                    <p className="font-[var(--font-mono)] text-[#00FF9C] text-xs mt-1">// Member Portal</p>
                </div>

                {/* Nav links */}
                <nav className="flex-1 p-3 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                                    ${isActive
                                        ? 'bg-[#00B4FF]/15 text-[#00B4FF] border-l-2 border-[#00B4FF]'
                                        : 'text-[#8892A4] hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        )
                    })}

                    {/* Admin link */}
                    {isAdmin && (
                        <>
                            <div className="my-3 border-t border-[#00B4FF]/20" />
                            <Link
                                href="/portal/admin"
                                onClick={() => setMobileOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300
                                    ${pathname === '/portal/admin'
                                        ? 'bg-[#00FF9C]/15 text-[#00FF9C] border-l-2 border-[#00FF9C]'
                                        : 'text-[#00FF9C]/70 hover:bg-white/5 hover:text-[#00FF9C]'
                                    }
                                `}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Admin Panel
                            </Link>
                        </>
                    )}
                </nav>

                {/* Sign out */}
                <div className="p-3 border-t border-[#00B4FF]/20">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-[#8892A4] hover:bg-[#FF3B3B]/10 hover:text-[#FF3B3B] transition-all duration-300 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    )
}
