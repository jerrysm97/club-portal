// components/public/Navbar.tsx — IIMS IT Club Official Navbar (v4.0)
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/join', label: 'Join' }
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
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-[#F5F5F5]',
            scrolled ? 'shadow-sm' : ''
        )}>
            <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Brand */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="group" aria-label="Home page">
                        <span className="font-bold text-[#111111] text-xl tracking-tight block leading-tight">
                            ICEHC
                        </span>
                        <span className="text-[#4A4A4A] text-xs font-medium tracking-wide block leading-tight mt-0.5">
                            IIMS College
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map(({ href, label }) => {
                        const active = pathname === href || (href !== '/' && pathname?.startsWith(href))

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    'text-sm transition-all font-semibold py-2 relative group',
                                    active ? 'text-[#C8102E]' : 'text-[#4A4A4A] hover:text-[#111111]'
                                )}
                            >
                                {label}
                                {active && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C8102E] translate-y-2 rounded-sm" />
                                )}
                                {!active && (
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#111111] translate-y-2 rounded-sm transition-all duration-300 group-hover:w-full opacity-50" />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-[#111111] p-2 hover:bg-[#F5F5F5] transition-colors rounded"
                    aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                >
                    {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </nav>

            {/* Mobile Nav Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-white border-b border-[#F5F5F5]">
                    <div className="flex flex-col px-6 py-4 space-y-2">
                        {NAV_LINKS.map(({ href, label }) => {
                            const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className={cn(
                                        'text-base py-3 px-4 font-semibold border-l-4 transition-all',
                                        active
                                            ? 'text-[#C8102E] border-[#C8102E] bg-[#F5F5F5]'
                                            : 'text-[#4A4A4A] border-transparent hover:text-[#111111] hover:bg-[#F5F5F5]'
                                    )}
                                >
                                    {label}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </header>
    )
}
