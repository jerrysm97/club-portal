// components/public/PublicFooter.tsx
import Link from 'next/link'

export default function PublicFooter() {
    return (
        <footer className="bg-[#0F172A] text-white">
            <div className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">
                            IIMS <span className="text-gradient">Cyber</span>
                        </h3>
                        <p className="text-[#94A3B8] leading-relaxed max-w-sm">
                            The premier cybersecurity club at IIMS College, Kathmandu.
                            Building the next generation of security professionals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B] mb-5">Navigate</h4>
                        <div className="space-y-3">
                            {[
                                { label: 'About', href: '/about' },
                                { label: 'Events', href: '/events' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Member Portal', href: '/portal/login' },
                            ].map((l) => (
                                <Link key={l.href} href={l.href} className="block text-sm text-[#94A3B8] hover:text-white hover:translate-x-1 transition-all duration-200">
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B] mb-5">Connect</h4>
                        <div className="space-y-3">
                            <a href="https://instagram.com/iimscyberclub" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors group">
                                <span className="group-hover:scale-110 transition-transform">📷</span> Instagram
                            </a>
                            <a href="https://facebook.com/iimscyberclub" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors group">
                                <span className="group-hover:scale-110 transition-transform">👤</span> Facebook
                            </a>
                            <a href="https://github.com/iimscyberclub" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-white transition-colors group">
                                <span className="group-hover:scale-110 transition-transform">💻</span> GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-[#1E293B] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[#475569]">
                        © {new Date().getFullYear()} IIMS Cybersecurity Club. All rights reserved.
                    </p>
                    <p className="text-xs text-[#475569]">
                        Made with 💜 by the Cyber team
                    </p>
                </div>
            </div>
        </footer>
    )
}
