// components/public/Footer.tsx — IIMS IT Club Official Footer (v4.0)
import Link from 'next/link'
import { GraduationCap, Mail, ExternalLink } from 'lucide-react'

const QUICK_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/portal/login', label: 'Member Portal' },
]

const EXTERNAL_LINKS = [
    { href: 'https://iimscollege.edu.np/it-club/', label: 'IIMS IT Club Page' },
    { href: 'https://iimscollege.edu.np/capture-the-flag/', label: 'CTF Program' },
    { href: 'https://iimscollege.edu.np/iims-hackathon/', label: 'IIMS Hackathon' },
    { href: 'https://iimscollege.edu.np/', label: 'IIMS College' },
]

export default function Footer() {
    return (
        <footer className="bg-[#1A237E] text-white">
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Col 1 — Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="h-10 w-10 rounded-lg bg-white/15 flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <span className="font-bold text-white text-base block leading-tight">IIMS IT Club</span>
                                <span className="text-white/50 text-xs block">Kathmandu, Nepal</span>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-4">
                            Code. Build. Innovate. — The official IT Club of IIMS College, empowering the next generation of tech leaders.
                        </p>
                        <a
                            href="mailto:itclub@iimscollege.edu.np"
                            className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
                        >
                            <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                            itclub@iimscollege.edu.np
                        </a>
                    </div>

                    {/* Col 2 — Quick Links */}
                    <div>
                        <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4 opacity-60">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {QUICK_LINKS.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className="text-white/60 text-sm hover:text-white transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3 — IIMS Links */}
                    <div>
                        <h3 className="font-semibold text-white text-sm uppercase tracking-widest mb-4 opacity-60">
                            IIMS Programs
                        </h3>
                        <div className="space-y-2.5">
                            {EXTERNAL_LINKS.map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-white/60 text-sm hover:text-white transition-colors"
                                >
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                    {label}
                                </a>
                            ))}
                        </div>
                        <div className="mt-5 pt-5 border-t border-white/10">
                            <p className="text-white/40 text-xs leading-relaxed">
                                BCS Hons · BBUS Hons · BIHM Hons · MBA<br />
                                In partnership with Taylor&apos;s University, Malaysia
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-white/40 text-xs text-center md:text-left">
                        © 2026 IIMS IT Club. An official club of{' '}
                        <a
                            href="https://iimscollege.edu.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/60 hover:text-white transition-colors underline underline-offset-2"
                        >
                            IIMS College, Kathmandu, Nepal
                        </a>
                        .
                    </p>
                    <p className="text-white/30 text-xs text-center md:text-right">
                        Taylor&apos;s University Affiliated
                    </p>
                </div>
            </div>
        </footer>
    )
}
