// components/public/HeroSection.tsx
// Hero with terminal grid background and blinking cursor — CSS only.

'use client'

import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center bg-black bg-grid">
            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
                {/* Terminal label */}
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm tracking-widest mb-6 uppercase">
                    {'>'} IIMS College · Est. 2024
                </p>

                {/* Headline with blinking cursor */}
                <h1 className="font-[var(--font-mono)] font-bold text-4xl md:text-6xl lg:text-7xl text-[#F8FAFC] mb-4 leading-tight">
                    Securing the
                    <br />
                    Digital Future
                    <span className="text-[#10B981] cursor-blink ml-1">█</span>
                </h1>

                {/* Sub-heading */}
                <p className="font-[var(--font-mono)] font-bold text-[#10B981] text-lg md:text-xl mb-4">
                    IIMS Cybersecurity Club
                </p>

                {/* Body */}
                <p className="font-[var(--font-inter)] text-[#A1A1AA] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
                    Nepal&apos;s next generation of ethical hackers, defenders, and security researchers.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#about"
                        className="px-6 py-3 text-sm font-bold bg-[#10B981] text-black rounded-sm hover:opacity-90 transition-opacity"
                    >
                        Explore Club Life ↓
                    </a>
                    <Link
                        href="/portal/login"
                        className="px-6 py-3 text-sm font-bold border border-[#10B981] text-[#10B981] rounded-sm hover:bg-[#10B981]/10 transition-colors"
                    >
                        Member Portal →
                    </Link>
                </div>
            </div>
        </section>
    )
}
