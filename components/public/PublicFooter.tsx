// components/public/PublicFooter.tsx — Premium minimal footer
import Link from 'next/link'

export default function PublicFooter() {
    return (
        <footer className="bg-[#111827] text-white">
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">
                            IIMS <span className="text-[#818CF8]">Cyber</span>
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            The premier cybersecurity club at IIMS College, Kathmandu.
                            Building the next generation of security professionals.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Links</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'About', href: '/about' },
                                { label: 'Events', href: '/events' },
                                { label: 'Contact', href: '/contact' },
                                { label: 'Member Portal', href: '/portal/login' },
                            ].map((l) => (
                                <Link key={l.href} href={l.href} className="block text-sm text-gray-400 hover:text-white transition-colors">
                                    {l.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Connect</h4>
                        <div className="space-y-2">
                            <a href="https://instagram.com/iimscyberclub" target="_blank" rel="noreferrer" className="block text-sm text-gray-400 hover:text-white transition-colors">Instagram</a>
                            <a href="https://facebook.com/iimscyberclub" target="_blank" rel="noreferrer" className="block text-sm text-gray-400 hover:text-white transition-colors">Facebook</a>
                            <a href="https://github.com/iimscyberclub" target="_blank" rel="noreferrer" className="block text-sm text-gray-400 hover:text-white transition-colors">GitHub</a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-500">
                    © {new Date().getFullYear()} IIMS Cybersecurity Club. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
