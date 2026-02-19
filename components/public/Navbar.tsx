// components/public/Navbar.tsx — IIMS College Modern Navigation
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, GraduationCap, ArrowRight, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname() || '/'

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => setIsOpen(false), [pathname])

    return (
        <nav className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
            scrolled || isOpen
                ? 'bg-[#1A1A2E] shadow-xl py-2'
                : 'bg-[#1A1A2E]/90 backdrop-blur-md py-4'
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="h-11 w-11 rounded-xl bg-[#D32F2F] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                        <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-poppins font-bold text-lg leading-none tracking-tight text-white">
                            IIMS<span className="text-[#F4C542]"> College</span>
                        </span>
                        <span className="text-[10px] text-white/50 font-medium tracking-widest uppercase mt-0.5">
                            Excellence in Education
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                                pathname === link.href
                                    ? 'text-[#F4C542] bg-white/5'
                                    : 'text-white/80 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-all"
                    >
                        <MapPin className="h-4 w-4" />
                        Visit
                    </Link>
                    <Link
                        href="/portal/signup"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D32F2F] text-white text-sm font-bold hover:bg-[#B71C1C] transition-all shadow-md shadow-red-900/20 active:scale-95"
                    >
                        Apply Now
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#1A1A2E] border-t border-white/10 p-6 flex flex-col gap-2 animate-fade-up shadow-2xl">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-base font-medium py-3 px-4 rounded-lg transition-all',
                                pathname === link.href
                                    ? 'text-[#F4C542] bg-white/5'
                                    : 'text-white/80 hover:text-white hover:bg-white/5'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                        <Link
                            href="/contact"
                            className="flex items-center justify-center gap-2 font-semibold text-white border border-white/20 py-3.5 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <MapPin className="h-5 w-5" />
                            Visit Campus
                        </Link>
                        <Link
                            href="/portal/signup"
                            className="flex items-center justify-center gap-2 font-bold text-white bg-[#D32F2F] py-3.5 rounded-xl hover:bg-[#B71C1C] transition-colors shadow-lg"
                        >
                            Apply Now
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
