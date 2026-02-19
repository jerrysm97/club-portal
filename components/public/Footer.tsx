// components/public/Footer.tsx — IIMS College Modern Footer
import Link from 'next/link'
import { GraduationCap, Github, Facebook, Instagram, Mail, MapPin, Phone, ExternalLink } from 'lucide-react'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-[#1A1A2E] text-white pt-20 pb-8 overflow-hidden relative">
            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 hero-grid opacity-[0.06] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="h-11 w-11 rounded-xl bg-[#D32F2F] flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                                <GraduationCap className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-poppins font-bold text-xl leading-none">
                                    IIMS<span className="text-[#F4C542]"> College</span>
                                </span>
                                <span className="text-xs text-white/40 font-medium tracking-wider uppercase mt-1">
                                    Since 2005
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Empowering students with world-class education in management, information technology, and beyond.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <SocialLink href="https://github.com/iimscollege" icon={<Github className="h-4 w-4" />} label="GitHub" />
                            <SocialLink href="https://facebook.com/iimscollege" icon={<Facebook className="h-4 w-4" />} label="Facebook" />
                            <SocialLink href="https://instagram.com/iimscollege" icon={<Instagram className="h-4 w-4" />} label="Instagram" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-poppins font-bold text-white text-sm uppercase tracking-wider mb-6 relative inline-block">
                            Quick Links
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#D32F2F] rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink href="/about" label="About Us" />
                            <FooterLink href="/events" label="Events & News" />
                            <FooterLink href="/portal/login" label="Student Portal" />
                            <FooterLink href="/portal/signup" label="Apply Now" />
                        </ul>
                    </div>

                    {/* Programs */}
                    <div>
                        <h3 className="font-poppins font-bold text-white text-sm uppercase tracking-wider mb-6 relative inline-block">
                            Programs
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#D32F2F] rounded-full" />
                        </h3>
                        <ul className="space-y-3">
                            <FooterLink href="#" label="BBA / BIM" />
                            <FooterLink href="#" label="BIT / CSIT" />
                            <FooterLink href="#" label="MBA" />
                            <FooterLink href="#" label="Cybersecurity" />
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-poppins font-bold text-white text-sm uppercase tracking-wider mb-6 relative inline-block">
                            Contact
                            <span className="absolute -bottom-2 left-0 w-8 h-0.5 bg-[#D32F2F] rounded-full" />
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-white/50 text-sm">
                                <MapPin className="h-4 w-4 text-[#F4C542] mt-0.5 flex-shrink-0" />
                                <span>
                                    IIMS College Campus,<br />
                                    Putalisadak, Kathmandu
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-white/50 text-sm">
                                <Mail className="h-4 w-4 text-[#F4C542] flex-shrink-0" />
                                <a href="mailto:info@iimscollege.edu.np" className="hover:text-white transition-colors">
                                    info@iimscollege.edu.np
                                </a>
                            </li>
                            <li className="flex items-center gap-3 text-white/50 text-sm">
                                <Phone className="h-4 w-4 text-[#F4C542] flex-shrink-0" />
                                <a href="tel:+97714169100" className="hover:text-white transition-colors">
                                    +977-1-4169100
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
                    <p>
                        © {currentYear} IIMS College. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/contact" className="hover:text-white transition-colors">Sitemap</Link>
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
            className="p-2.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-[#D32F2F] transition-all hover:-translate-y-0.5"
        >
            {icon}
        </a>
    )
}

function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <li>
            <Link href={href} className="text-white/50 hover:text-white transition-all flex items-center gap-2 group text-sm">
                <span className="h-1 w-1 rounded-full bg-[#D32F2F] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="group-hover:translate-x-1 transition-transform">{label}</span>
            </Link>
        </li>
    )
}
