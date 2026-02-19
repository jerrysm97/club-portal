// components/public/Footer.tsx — ICEHC Dark Terminal Footer
import Link from 'next/link'
import { Shield, Mail, ExternalLink } from 'lucide-react'

const QUICK_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/portal/login', label: 'Member Portal' },
]

const EXTERNAL_LINKS = [
    { href: 'https://iimscollege.edu.np/capture-the-flag/', label: 'IIMS CTF Page' },
    { href: 'https://iimscollege.edu.np/it-club/', label: 'IIMS IT Club' },
    { href: 'https://iimscollege.edu.np/', label: 'IIMS College' },
]

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0F] border-t border-[#1E1E2E]">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Col 1 — Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-md bg-black border border-[#2D2D44] flex items-center justify-center">
                                <Shield className="h-4 w-4 text-[#00FF87]" />
                            </div>
                            <span className="font-mono font-bold text-[#F0F0FF] text-sm">ICEHC</span>
                        </div>
                        <p className="font-mono text-xs text-[#00FF87] mb-3">
                            Hack the future. Secure the present.
                        </p>
                        <p className="text-[#8888AA] text-sm font-sans">
                            A club under{' '}
                            <a
                                href="https://iimscollege.edu.np/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#00D4FF] hover:underline"
                            >
                                IIMS College
                            </a>
                            , Kathmandu
                        </p>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h3 className="font-mono font-bold text-[#F0F0FF] text-xs uppercase tracking-widest mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            {QUICK_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-[#8888AA] text-sm font-sans hover:text-[#00D4FF] transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — Contact & External */}
                    <div>
                        <h3 className="font-mono font-bold text-[#F0F0FF] text-xs uppercase tracking-widest mb-4">
                            Contact
                        </h3>
                        <a
                            href="mailto:cybersec@iimscollege.edu.np"
                            className="flex items-center gap-2 text-[#8888AA] text-sm font-sans hover:text-[#00D4FF] transition-colors mb-4"
                        >
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            cybersec@iimscollege.edu.np
                        </a>
                        <div className="space-y-2">
                            {EXTERNAL_LINKS.map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[#8888AA] text-sm font-sans hover:text-[#00D4FF] transition-colors"
                                >
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-[#1E1E2E] flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[#8888AA] text-xs font-sans text-center md:text-left">
                        © 2025 IIMS Cybersecurity & Ethical Hacking Club. All rights reserved.
                    </p>
                    <p className="text-[#8888AA]/50 text-xs font-mono text-center md:text-right">
                        In collaboration with Taylor&apos;s University & GDS
                    </p>
                </div>
            </div>
        </footer>
    )
}
