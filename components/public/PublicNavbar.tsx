// components/public/PublicNavbar.tsx
'use client'

import { useState, useEffect } from 'react'
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
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handle = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handle, { passive: true })
        return () => window.removeEventListener('scroll', handle)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-[#E2E8F0]' : 'bg-transparent'
            }`}>
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tight">
                    <span className={scrolled ? 'text-[#0F172A]' : 'text-white'}>IIMS</span>{' '}
                    <span className="text-gradient">Cyber</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === l.href
                                    ? 'text-[#6366F1] bg-indigo-50/80'
                                    : scrolled
                                        ? 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                                        : 'text-white/70 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/portal/login"
                        className="ml-3 text-sm font-semibold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                    >
                        Portal
                    </Link>
                </div>

                <button onClick={() => setOpen(!open)} className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-[#64748B] hover:bg-[#F1F5F9]' : 'text-white/70 hover:bg-white/10'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {open
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        }
                    </svg>
                </button>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="bg-white/95 backdrop-blur-xl border-t border-[#E2E8F0] px-6 py-4 space-y-1">
                    {links.map((l) => (
                        <Link
                            key={l.href}
                            href={l.href}
                            onClick={() => setOpen(false)}
                            className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === l.href ? 'text-[#6366F1] bg-indigo-50' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                                }`}
                        >
                            {l.label}
                        </Link>
                    ))}
                    <Link
                        href="/portal/login"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2.5 rounded-lg text-sm font-semibold text-[#6366F1] bg-indigo-50"
                    >
                        Member Portal →
                    </Link>
                </div>
            </div>
        </nav>
    )
}
