// components/public/Footer.tsx — Stealth Terminal Footer
import Link from 'next/link'
import { Shield, Github, Facebook, Instagram, Mail, MapPin } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-black border-t border-[#27272A] pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <Link href="/" className="flex items-center gap-2 group w-fit">
                            <Shield className="h-6 w-6 text-[#10B981]" />
                            <span className="font-mono font-bold text-lg text-[#F8FAFC]">
                                IIMS<span className="text-[#10B981]">Cyber</span>
                            </span>
                        </Link>
                        <p className="text-[#A1A1AA] text-sm leading-relaxed max-w-sm">
                            Nepal's premier student-led cybersecurity community.
                            Fostering the next generation of ethical hackers, defenders, and security researchers.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialLink href="https://github.com/iimscyberclub" icon={<Github className="h-5 w-5" />} />
                            <SocialLink href="https://facebook.com/iimscyberclub" icon={<Facebook className="h-5 w-5" />} />
                            <SocialLink href="https://instagram.com/iimscyberclub" icon={<Instagram className="h-5 w-5" />} />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-mono font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#10B981] rounded-full inline-block" />
                            Navigation
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink href="/about" label="About Us" />
                            <FooterLink href="/events" label="Events" />
                            <FooterLink href="/contact" label="Contact" />
                            <FooterLink href="/portal/login" label="Member Portal" />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-mono font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#06B6D4] rounded-full inline-block" />
                            Contact
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-[#A1A1AA] text-sm">
                                <MapPin className="h-5 w-5 text-[#10B981] shrink-0 mt-0.5" />
                                <span>
                                    IIMS College<br />
                                    Putalisadak, Kathmandu, Nepal
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-[#A1A1AA] text-sm">
                                <Mail className="h-5 w-5 text-[#10B981] shrink-0" />
                                <a href="mailto:cybersec@iimscollege.edu.np" className="hover:text-[#F8FAFC] transition-colors">
                                    cybersec@iimscollege.edu.np
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#27272A] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[#52525B] text-xs font-mono">
                        © {currentYear} IIMS Cybersecurity Club. All systems operational.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/5 border border-[#10B981]/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
                                System Online
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-sm bg-[#111113] border border-[#27272A] text-[#A1A1AA] hover:text-[#10B981] hover:border-[#10B981]/50 transition-all hover:-translate-y-1"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <li>
            <Link href={href} className="text-[#A1A1AA] text-sm hover:text-[#10B981] transition-colors flex items-center gap-2 group">
                <span className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#10B981] font-mono">
                    &gt;
                </span>
                {label}
            </Link>
        </li>
    )
}
