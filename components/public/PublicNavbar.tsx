// components/public/PublicNavbar.tsx
// Cyber Blue Matrix themed navbar — fixed top with backdrop blur and electric blue accents.

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
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#00B4FF]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Club logo + name */}
                    <Link href="/" className="flex items-center gap-2.5">
                        {/* Cyber shield icon */}
                        <div className="w-9 h-9 border-2 border-[#00B4FF] rounded-lg flex items-center justify-center bg-[#00B4FF]/10">
                            <svg className="w-5 h-5 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-white font-[var(--font-orbitron)] font-bold text-sm tracking-wide">
                            IIMS Cybersecurity Club
                        </span>
                    </Link>

                    {/* Desktop nav links — Share Tech Mono font */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-4 py-2 text-sm font-[var(--font-mono)] tracking-wide transition-all duration-300 ${isActive
                                            ? 'text-[#00B4FF]'
                                            : 'text-[#8892A4] hover:text-[#00B4FF]'
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#00B4FF] rounded-full shadow-[0_0_8px_rgba(0,180,255,0.5)]" />
                                    )}
                                </Link>
                            )
                        })}

                        {/* Member Portal CTA */}
                        <Link
                            href="/portal/login"
                            className="ml-4 px-5 py-2 text-sm font-bold border border-[#00B4FF] text-[#00B4FF] rounded-lg hover:bg-[#00B4FF] hover:text-[#0D0D0D] transition-all duration-300"
                        >
                            Member Portal →
                        </Link>
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 text-[#8892A4] hover:text-[#00B4FF] transition-colors"
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
                <div className="md:hidden bg-[#0D0D0D] border-t border-[#00B4FF]/20">
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-[var(--font-mono)] transition-colors ${pathname === link.href
                                        ? 'text-[#00B4FF] bg-[#00B4FF]/10'
                                        : 'text-[#8892A4] hover:text-[#00B4FF] hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            href="/portal/login"
                            onClick={() => setMobileOpen(false)}
                            className="block px-4 py-3 rounded-lg text-sm font-bold text-[#0D0D0D] bg-[#00B4FF] text-center mt-2"
                        >
                            Member Portal →
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
