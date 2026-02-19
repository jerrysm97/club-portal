// components/public/HeroSection.tsx — Premium minimal hero
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#111827] via-[#1E1B4B] to-[#312E81] overflow-hidden">
            {/* Soft radial glow */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6366F1]/10 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                    <span className="text-sm text-[#C7D2FE] font-medium">IIMS College · Est. 2024</span>
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                    Securing the<br />
                    <span className="bg-gradient-to-r from-[#818CF8] to-[#6366F1] bg-clip-text text-transparent">Digital Future</span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-[#C7D2FE]/80 max-w-2xl mx-auto leading-relaxed">
                    Nepal&apos;s next generation of ethical hackers, defenders, and security researchers.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link
                        href="/about"
                        className="px-8 py-3.5 rounded-lg bg-[#6366F1] text-white font-semibold hover:bg-[#4F46E5] transition-colors shadow-lg shadow-[#6366F1]/25"
                    >
                        Explore Club Life
                    </Link>
                    <Link
                        href="/portal/login"
                        className="px-8 py-3.5 rounded-lg border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors"
                    >
                        Member Portal
                    </Link>
                </div>
            </div>
        </section>
    )
}
