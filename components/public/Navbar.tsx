// components/public/Navbar.tsx — ICEHC Dark Terminal Navbar
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield } from 'lucide-react'

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
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'backdrop-blur-md bg-black/80 border-b border-[#1E1E2E]'
                    : 'bg-transparent'
                }`}
        >
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo / Brand */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://iimscollege.edu.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 group"
                    >
                        <div className="h-8 w-8 rounded-md bg-[#0A0A0F] border border-[#2D2D44] flex items-center justify-center group-hover:border-[#00FF87]/30 transition-colors">
                            <Shield className="h-4 w-4 text-[#00FF87]" />
                        </div>
                        <span className="font-mono font-bold text-[#F0F0FF] text-sm tracking-tight hidden sm:inline">
                            IIMS
                        </span>
                    </a>
                    <span className="text-[#2D2D44] font-mono hidden sm:inline">×</span>
                    <Link href="/" className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#F0F0FF] text-sm tracking-tight">
                            ICEHC
                        </span>
                        <span className="text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/30 font-mono text-[10px] px-1.5 py-0.5 rounded-full hidden sm:inline">
                            v1.0
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`font-mono text-sm px-4 py-2 rounded-md transition-all ${active
                                        ? 'text-[#00FF87] bg-[#00FF87]/10'
                                        : 'text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[#12121A]'
                                    }`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <Link
                        href="/portal/login"
                        className="ml-3 bg-[#00FF87] text-black font-mono font-bold text-sm px-5 py-2 rounded-md hover:bg-[#00e87a] active:scale-95 transition-all duration-150"
                    >
                        Member Portal →
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-[#F0F0FF] p-2 rounded-md hover:bg-[#12121A] transition-colors"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#0A0A0F] border-t border-[#1E1E2E] px-6 py-4 space-y-1 animate-fade-up">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setMenuOpen(false)}
                                className={`block font-mono text-sm px-4 py-3 rounded-md transition-all ${active
                                        ? 'text-[#00FF87] bg-[#00FF87]/10'
                                        : 'text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[#12121A]'
                                    }`}
                            >
                                {label}
                            </Link>
                        )
                    })}
                    <Link
                        href="/portal/login"
                        onClick={() => setMenuOpen(false)}
                        className="block text-center bg-[#00FF87] text-black font-mono font-bold text-sm px-5 py-2.5 rounded-md hover:bg-[#00e87a] transition-all mt-3"
                    >
                        Member Portal →
                    </Link>
                </div>
            )}
        </header>
    )
}
