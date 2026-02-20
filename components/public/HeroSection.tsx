// components/public/HeroSection.tsx — IIMS IT Club Hero (v4.0)
import Link from 'next/link'
import { ArrowRight, ChevronDown, Code2, Users, Shield, Trophy } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A237E] via-[#1A237E] to-[#0D1757]">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: '40px 40px'
            }} />

            {/* Gradient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#E53935]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 text-center">
                {/* Club badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 mb-8 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53935] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E53935]"></span>
                    </span>
                    <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                        IIMS College Official Club
                    </span>
                </div>

                {/* Headline */}
                <h1 className="font-bold text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tight text-white leading-[1.05]">
                    IIMS IT Club
                </h1>
                <p className="text-[#E53935] font-bold text-2xl md:text-3xl mb-6 tracking-wide">
                    Code. Build. Innovate.
                </p>
                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                    The official IT Club of IIMS College, Kathmandu — empowering BCS, BBUS, BIHM, and MBA students through technology, collaboration, and real-world challenges.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                    <Link
                        href="/portal/login"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#E53935] text-white font-bold text-base hover:bg-[#C62828] transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-red-900/30 active:scale-95"
                    >
                        Join the Club
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/about"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                    >
                        Learn More
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                    <HeroStat icon={<Users className="h-5 w-5" />} value="120+" label="Members" />
                    <HeroStat icon={<Code2 className="h-5 w-5" />} value="30+" label="Events Hosted" />
                    <HeroStat icon={<Shield className="h-5 w-5" />} value="50+" label="CTF Solves" />
                    <HeroStat icon={<Trophy className="h-5 w-5" />} value="5+" label="Years Active" />
                </div>

                {/* Scroll indicator */}
                <div className="mt-16 flex justify-center animate-bounce">
                    <ChevronDown className="h-6 w-6 text-white/30" />
                </div>
            </div>
        </section>
    )
}

function HeroStat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
    return (
        <div className="bg-white/8 border border-white/10 rounded-2xl p-5 text-center backdrop-blur-sm">
            <div className="flex justify-center mb-2 text-[#E53935]">{icon}</div>
            <div className="font-bold text-3xl text-white mb-1">{value}</div>
            <div className="text-white/50 text-xs font-semibold uppercase tracking-widest">{label}</div>
        </div>
    )
}
