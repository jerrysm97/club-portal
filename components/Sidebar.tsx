// components/Sidebar.tsx — Premium minimal sidebar
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'

const navItems = [
    { label: 'Feed', href: '/portal/dashboard', icon: '📰' },
    { label: 'Documents', href: '/portal/dashboard/documents', icon: '📁' },
    { label: 'Profile', href: '/portal/dashboard/profile', icon: '👤' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        async function checkAdmin() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) return
            const { data } = await supabase.from('members').select('role').eq('id', session.user.id).single()
            if (data?.role === 'admin') setIsAdmin(true)
        }
        checkAdmin()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/portal/login')
    }

    const allItems = isAdmin ? [...navItems, { label: 'Admin', href: '/portal/admin', icon: '⚙️' }] : navItems

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Brand */}
            <div className="p-5 border-b border-[#E5E7EB]">
                <Link href="/portal/dashboard" className="text-lg font-semibold text-[#111827]">
                    IIMS <span className="text-[#6366F1]">Portal</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 space-y-1">
                {allItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/portal/dashboard' && pathname.startsWith(item.href))
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[#EEF2FF] text-[#6366F1]'
                                    : 'text-[#6B7280] hover:bg-[#F9FAFB] hover:text-[#111827]'
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom */}
            <div className="p-3 border-t border-[#E5E7EB]">
                <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:bg-[#F9FAFB] hover:text-[#6B7280] transition-colors">
                    <span>🌐</span> Back to website
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#9CA3AF] hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden fixed top-3 left-3 z-50 p-2 bg-white rounded-lg border border-[#E5E7EB] shadow-sm"
            >
                <svg className="w-5 h-5 text-[#6B7280]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Mobile backdrop */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            )}

            {/* Mobile sidebar */}
            <aside className={`md:hidden fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-[#E5E7EB] transform transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-3 right-3">
                    <button onClick={() => setMobileOpen(false)} className="p-1 text-[#9CA3AF] hover:text-[#6B7280]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {sidebarContent}
            </aside>

            {/* Desktop sidebar */}
            <aside className="hidden md:block w-64 h-screen bg-white border-r border-[#E5E7EB] fixed left-0 top-0">
                {sidebarContent}
            </aside>
        </>
    )
}
