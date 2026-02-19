// components/public/HeroSection.tsx
// Hero with circuit grid background, neon orbs, and Orbitron typography.

import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
            {/* Circuit grid background */}
            <div className="absolute inset-0 bg-grid" />

            {/* Floating neon orbs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#00B4FF] rounded-full blur-3xl opacity-10" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#00FF9C] rounded-full blur-3xl opacity-10" />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Label */}
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm tracking-[0.25em] mb-6">
          // IIMS COLLEGE · EST. 2024
                </p>

                {/* Main heading */}
                <h1 className="font-[var(--font-orbitron)] font-black text-5xl md:text-7xl text-white mb-4 leading-tight">
                    Securing the
                    <br />
                    <span className="text-[#00B4FF]">Digital Future</span>
                </h1>

                {/* Sub-heading */}
                <p className="font-[var(--font-orbitron)] font-bold text-[#00B4FF] text-xl md:text-2xl mb-6">
                    IIMS Cybersecurity Club
                </p>

                {/* Body text */}
                <p className="font-[var(--font-exo2)] text-[#8892A4] text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    Nepal&apos;s next generation of ethical hackers, defenders, and security researchers.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#about"
                        className="px-8 py-3.5 text-base font-bold bg-[#00B4FF] text-[#0D0D0D] rounded-xl hover:bg-[#00FF9C] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,180,255,0.4)]"
                    >
                        Explore Club Life ↓
                    </a>
                    <Link
                        href="/portal/login"
                        className="px-8 py-3.5 text-base font-bold border border-[#00B4FF] text-[#00B4FF] rounded-xl hover:bg-[#00B4FF] hover:text-[#0D0D0D] transition-all duration-300"
                    >
                        Member Portal →
                    </Link>
                </div>
            </div>

            {/* Bouncing scroll arrow */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
                <svg className="w-6 h-6 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    )
}
