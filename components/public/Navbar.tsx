// components/public/Navbar.tsx — IIMS IT Club Official Navbar (v4.0)
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, GraduationCap } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            scrolled ? 'bg-[#1A237E] shadow-lg' : 'bg-[#1A237E]'
        )}>
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://iimscollege.edu.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                        aria-label="IIMS College Website"
                    >
                        <div className="h-9 w-9 rounded-lg bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                    </a>
                    <div className="border-l border-white/20 pl-3">
                        <Link href="/" className="group">
                            <span className="font-semibold text-white text-base block leading-tight group-hover:text-white/90 transition-colors">
                                IT Club
                            </span>
                            <span className="text-white/50 text-[11px] block leading-tight">
                                IIMS College, Kathmandu
                            </span>
                        </Link>
                    </div>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'text-sm px-4 py-2 rounded-lg transition-all font-medium',
                                    active
                                        ? 'text-white bg-white/15'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <Link
                        href="/portal/login"
                        className="ml-3 bg-[#E53935] text-white font-semibold text-sm px-5 py-2 rounded-lg hover:bg-[#C62828] active:scale-95 transition-all duration-150 shadow-md"
                    >
                        Member Login
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#0D1757] border-t border-white/10 px-6 py-4 space-y-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={cn(
                                    'block text-sm px-4 py-3 rounded-lg transition-all font-medium',
                                    active
                                        ? 'text-white bg-white/15'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                )}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <Link
                        href="/portal/login"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-[#E53935] text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-[#C62828] transition-all mt-3"
                    >
                        Member Login
                    </Link>
                </div>
            )}
        </header>
    )
}
