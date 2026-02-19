// components/public/PublicNavbar.tsx
// Stealth Terminal navbar — fixed top, matte dark, emerald accents, no blur.

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
]

export default function PublicNavbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-[#10B981] font-[var(--font-mono)] font-bold text-sm">{'>'}_</span>
                        <span className="text-[#F8FAFC] font-[var(--font-mono)] font-bold text-sm">
                            IIMS_CYBER
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-2 text-sm font-[var(--font-mono)] transition-colors duration-200 ${isActive
                                            ? 'text-[#10B981]'
                                            : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}
                        <Link
                            href="/portal/login"
                            className="ml-4 px-5 py-2 text-sm font-bold font-[var(--font-mono)] border border-[#10B981] text-[#10B981] rounded-sm hover:bg-[#10B981]/10 transition-colors duration-200"
                        >
                            Portal →
                        </Link>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-black border-t border-[#27272A]">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-3 text-sm font-[var(--font-mono)] transition-colors ${pathname === link.href
                                        ? 'text-[#10B981]'
                                        : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/portal/login"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 text-sm font-bold font-[var(--font-mono)] text-black bg-[#10B981] text-center rounded-sm mt-2"
                        >
                            Portal →
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
