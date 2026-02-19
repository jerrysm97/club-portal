// components/public/Footer.tsx — IIMS Collegiate Public Footer
import Link from 'next/link'
import { ShieldCheck, Github, Facebook, Instagram, Mail, MapPin, ExternalLink } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#58151C] text-white pt-20 pb-10 overflow-hidden relative">
            {/* Decorative Grid */}
            <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="h-10 w-10 rounded-xl bg-[#C3161C] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-poppins font-bold text-xl leading-none">
                                    IIMS<span className="text-[#FCD34D]">Cyber</span>
                                </span>
                                <span className="text-xs text-[#FECACA] font-medium tracking-widest uppercase opacity-80 mt-1">
                                    Nepal's Premier Security Community
                                </span>
                            </div>
                        </Link>
                        <p className="text-[#FECACA] text-base leading-relaxed max-w-sm font-light">
                            Fostering technical excellence and ethical security practices within the IIMS Collegiate community.
                            Join us in securing the digital frontier.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <SocialLink href="https://github.com/iimscyberclub" icon={<Github className="h-5 w-5" />} label="GitHub" />
                            <SocialLink href="https://facebook.com/iimscyberclub" icon={<Facebook className="h-5 w-5" />} label="Facebook" />
                            <SocialLink href="https://instagram.com/iimscyberclub" icon={<Instagram className="h-5 w-5" />} label="Instagram" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-poppins font-bold text-white mb-8 relative inline-block text-lg">
                            Resources
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FCD34D] rounded-full" />
                        </h3>
                        <ul className="space-y-4">
                            <FooterLink href="/about" label="About Us" />
                            <FooterLink href="/events" label="Upcoming Events" />
                            <FooterLink href="/contact" label="Contact & Map" />
                            <FooterLink href="/portal/login" label="Member Access" />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-poppins font-bold text-white mb-8 relative inline-block text-lg">
                            Contact Us
                            <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#FCD34D] rounded-full" />
                        </h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-[#FECACA]">
                                <div className="mt-1 p-2 rounded-lg bg-[#431015]">
                                    <MapPin className="h-5 w-5 text-[#FCD34D]" />
                                </div>
                                <span className="text-sm line-clamp-2">
                                    IIMS College Campus,<br />
                                    Putalisadak, Kathmandu
                                </span>
                            </li>
                            <li className="flex items-center gap-4 text-[#FECACA]">
                                <div className="p-2 rounded-lg bg-[#431015]">
                                    <Mail className="h-5 w-5 text-[#FCD34D]" />
                                </div>
                                <a href="mailto:cybersec@iimscollege.edu.np" className="text-sm hover:text-white transition-colors">
                                    cybersec@iimscollege.edu.np
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-[#431015] flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#FECACA]">
                    <p className="font-medium">
                        © {currentYear} IIMS Cybersecurity Club. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30">
                            <span className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981]">Site Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="p-3 rounded-xl bg-[#431015] text-[#FECACA] hover:text-white hover:bg-[#C3161C] transition-all hover:-translate-y-1 shadow-md"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <li>
            <Link href={href} className="text-[#FECACA] hover:text-white transition-all flex items-center gap-2 group">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FCD34D] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:translate-x-1 transition-transform">{label}</span>
            </Link>
        </li>
    )
}
