// components/public/PublicNavbar.tsx — Premium minimal navbar
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Events', href: '/events' },
    { label: 'Contact', href: '/contact' },
]

export default function PublicNavbar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB]">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-semibold text-[#111827] tracking-tight">
                    IIMS <span className="text-[#6366F1]">Cyber</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-8">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`text-sm font-medium transition-colors ${pathname === l.href
                                    ? 'text-[#6366F1]'
                                    : 'text-[#6B7280] hover:text-[#111827]'
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/portal/login"
                        className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#6366F1] text-white hover:bg-[#4F46E5] transition-colors"
                    >
                        Portal
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-[#6B7280]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {open ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            {open && (
                <div className="md:hidden bg-white border-t border-[#E5E7EB] px-6 py-4 space-y-3">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`block text-sm font-medium ${pathname === l.href ? 'text-[#6366F1]' : 'text-[#6B7280]'
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/portal/login"
                        onClick={() => setOpen(false)}
                        className="block text-sm font-semibold text-[#6366F1]"
                    >
                        Portal →
                    </Link>
                </div>
            )}
        </nav>
    )
}
