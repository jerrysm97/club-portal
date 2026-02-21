// components/public/Footer.tsx — IIMS IT Club Official Footer (v4.0)
import Link from 'next/link'

const QUICK_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/team', label: 'Team' },
    { href: '/events', label: 'Events' },
    { href: '/join', label: 'Join' },
]

export default function Footer() {
    return (
        <footer className="bg-[#111111] text-[#F5F5F5] py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-b border-[#4A4A4A] pb-12">
                    {/* Brand Info */}
                    <div>
                        <h2 className="text-xl font-bold mb-4 tracking-tight">IIMS Cybersecurity & Ethical Hacking Club</h2>
                        <p className="text-[#F5F5F5]/70 text-sm max-w-sm mb-6 leading-relaxed">
                            Bridging theory and real-world defense. An official student initiative dedicated to digital safety and proactive threat mitigation.
                        </p>
                        <p className="text-[#F5F5F5]/50 text-xs">
                            Est. 2025 • IIMS College
                        </p>
                    </div>

                    {/* Navigation */}
                    <div className="md:text-right">
                        <h3 className="font-semibold mb-6 tracking-wide uppercase text-sm text-[#F5F5F5]/80">Quick Navigation</h3>
                        <ul className="space-y-3">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-[#F5F5F5]/60 hover:text-white transition-colors text-sm"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/portal/login"
                                    className="text-[#C8102E] font-medium hover:text-[#C8102E]/80 transition-colors text-sm"
                                >
                                    Member Portal
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#F5F5F5]/40">
                    <p>© {new Date().getFullYear()} IIMS Cybersecurity & Ethical Hacking Club.</p>
                    <p>
                        A club under{' '}
                        <a
                            href="https://iimscollege.edu.np"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F5F5F5]/60 hover:text-white underline underline-offset-2"
                        >
                            IIMS College, Kathmandu, Nepal
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}
