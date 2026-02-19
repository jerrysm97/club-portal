// components/public/HeroSection.tsx — Stealth Terminal Hero
import Link from 'next/link'
import { Terminal, Shield, ChevronRight } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#27272A]">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-black hero-grid" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Terminal Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 mb-8 animate-fade-up">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                    </span>
                    <span className="font-mono text-xs font-bold text-[#10B981] tracking-wide">
                        SYSTEM_ONLINE_V2.0
                    </span>
                </div>

                {/* Headline */}
                <h1 className="font-mono font-bold text-4xl md:text-7xl mb-6 tracking-tight text-[#F8FAFC] animate-fade-up animate-fade-up-delay-1">
                    Securing the <span className="text-[#10B981]">Future</span><br />
                    One Byte at a Time<span className="animate-pulse text-[#10B981]">_</span>
                </h1>

                <p className="font-mono text-[#A1A1AA] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animate-fade-up-delay-2">
                    Nepal's premier student-led cybersecurity community.
                    We research, build, and defend the digital frontier.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animate-fade-up-delay-3">
                    <Link
                        href="/portal/signup"
                        className="w-full sm:w-auto px-8 py-3 rounded-sm bg-[#10B981] text-black font-mono font-bold hover:bg-[#059669] transition-all hover:scale-105 flex items-center justify-center gap-2 group"
                    >
                        <Terminal className="h-5 w-5" />
                        Initialize_Access
                    </Link>
                    <Link
                        href="/about"
                        className="w-full sm:w-auto px-8 py-3 rounded-sm bg-[#111113] border border-[#27272A] text-[#F8FAFC] font-mono hover:border-[#10B981] transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group"
                    >
                        <Shield className="h-5 w-5 text-[#A1A1AA] group-hover:text-[#10B981] transition-colors" />
                        Learn More
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-8 border-t border-[#27272A]/50 animate-fade-up animate-fade-up-delay-3">
                    <Stat label="Active Members" value="150+" />
                    <Stat label="CTF Challenges" value="45+" />
                    <Stat label="Workshops" value="12+" />
                    <Stat label="GitHub Stars" value="850+" />
                </div>
            </div>
        </section>
    )
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="text-center group cursor-default">
            <div className="font-mono font-bold text-3xl text-[#F8FAFC] group-hover:text-[#10B981] transition-colors mb-1">
                {value}
            </div>
            <div className="text-xs font-mono text-[#52525B] uppercase tracking-wider">
                {label}
            </div>
        </div>
    )
}
