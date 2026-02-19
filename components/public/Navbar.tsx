// components/public/Navbar.tsx — IIMS Collegiate Public Navbar
'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
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
                ? 'bg-[#58151C] shadow-lg py-3'
                : 'bg-transparent py-5'
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="h-10 w-10 rounded-xl bg-[#C3161C] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <ShieldCheck className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-poppins font-bold text-lg leading-none tracking-tight text-white">
                            IIMS<span className="text-[#FCD34D]">Cyber</span>
                        </span>
                        <span className="text-[10px] text-[#FECACA] font-medium tracking-widest uppercase opacity-80">
                            Collegiate Chapter
                        </span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-sm font-medium transition-colors hover:text-[#FCD34D]',
                                pathname === link.href ? 'text-[#FCD34D] font-bold' : 'text-white'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/portal/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C3161C] text-white text-sm font-bold hover:bg-[#A31217] transition-all shadow-md active:scale-95"
                    >
                        Member Portal
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-[#58151C] border-t border-[#431015] p-6 flex flex-col gap-4 animate-fade-up shadow-xl mt-[-1px]">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'text-lg font-medium py-3 border-b border-[#431015] transition-colors',
                                pathname === link.href ? 'text-[#FCD34D]' : 'text-white hover:text-[#FCD34D]'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/portal/login"
                        className="flex items-center justify-center gap-2 font-bold text-white bg-[#C3161C] py-4 rounded-xl hover:bg-[#A31217] transition-colors mt-2 shadow-lg"
                    >
                        Member Portal
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            )}
        </nav>
    )
}
