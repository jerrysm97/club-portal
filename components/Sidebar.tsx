// components/Sidebar.tsx
// The navigation sidebar shown on every dashboard page.
// Fixed on desktop (left side), hamburger menu on mobile.
// Shows an "Admin" link only if the current user has admin role.

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Sidebar() {
    // Track which page is active to highlight the correct nav link
    const pathname = usePathname()
    // Track if mobile menu is open or closed
    const [mobileOpen, setMobileOpen] = useState(false)
    // Track if the current user is an admin (to show/hide admin link)
    const [isAdmin, setIsAdmin] = useState(false)

    // Check if the user is an admin on load
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

    // Sign the user out and redirect to login
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    // Navigation links — shown to all approved members
    const navLinks = [
        {
            name: 'Posts',
            href: '/dashboard',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ),
        },
        {
            name: 'Documents',
            href: '/dashboard/documents',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ),
        },
        {
            name: 'Profile',
            href: '/dashboard/profile',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
    ]

    return (
        <>
            {/* ===== MOBILE: Hamburger button (top-left corner) ===== */}
            <button
                onClick={() => setMobileOpen(true)}
                className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-xl shadow-md border border-slate-200"
                aria-label="Open menu"
            >
                <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* ===== MOBILE: Dark overlay when menu is open ===== */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* ===== SIDEBAR ===== */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-[#1a1a2e] text-white z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
            >
                {/* Club name / logo area */}
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-lg font-bold tracking-tight">Club Portal</h2>
                    <p className="text-xs text-slate-400 mt-1">Member Dashboard</p>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 p-4 space-y-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                    }
                `}
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        )
                    })}

                    {/* Admin link — only visible to admins */}
                    {isAdmin && (
                        <>
                            <div className="my-3 border-t border-white/10" />
                            <Link
                                href="/admin"
                                onClick={() => setMobileOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${pathname === '/admin'
                                        ? 'bg-purple-600 text-white'
                                        : 'text-purple-300 hover:bg-white/10 hover:text-white'
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

                {/* Sign out button at the bottom */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
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
