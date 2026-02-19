// components/public/Navbar.tsx — Stealth Terminal Navbar
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Terminal, Shield } from 'lucide-react'
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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => setIsOpen(false), [pathname])

    return (
        <nav className={cn(
            'fixed top-0 left-0 right-0 z-40 transition-all duration-300 border-b',
            scrolled ? 'bg-black/80 backdrop-blur-md border-[#27272A] py-3' : 'bg-transparent border-transparent py-5'
        )}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <Shield className="h-8 w-8 text-[#10B981] group-hover:text-[#06B6D4] transition-colors duration-300" />
                        <Terminal className="h-4 w-4 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-mono font-bold text-lg leading-none tracking-tight text-[#F8FAFC]">
                            IIMS<span className="text-[#10B981]">Cyber</span>
                        </span>
                        <span className="text-[10px] text-[#A1A1AA] font-mono tracking-widest uppercase">
                            Securing the Future
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
                                'font-mono text-sm transition-colors hover:text-[#10B981]',
                                pathname === link.href ? 'text-[#10B981] font-bold' : 'text-[#A1A1AA]'
                            )}
                        >
                            <span className="text-[#10B981] opacity-50 mr-1">//</span>
                            {link.label}
                        </Link>
                    ))}

                    <Link
                        href="/portal/login"
                        className="group relative px-5 py-2 overflow-hidden rounded-sm bg-[#111113] border border-[#27272A] hover:border-[#10B981] transition-colors"
                    >
                        <div className="absolute inset-0 w-0 bg-[#10B981]/10 transition-all duration-[250ms] ease-out group-hover:w-full" />
                        <span className="relative font-mono text-sm font-bold text-[#F8FAFC] group-hover:text-[#10B981]">
                            Member_Portal
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-[#F8FAFC]"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-[#27272A] p-6 flex flex-col gap-4 animate-fade-up">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                'font-mono text-base py-2 border-l-2 pl-4 transition-colors',
                                pathname === link.href
                                    ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/5'
                                    : 'border-transparent text-[#A1A1AA] hover:text-[#F8FAFC]'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="h-px bg-[#27272A] my-2" />
                    <Link
                        href="/portal/login"
                        className="flex items-center justify-center font-mono font-bold text-black bg-[#10B981] py-3 rounded-sm hover:opacity-90 transition-opacity"
                    >
                        Member_Portal
                    </Link>
                </div>
            )}
        </nav>
    )
}
