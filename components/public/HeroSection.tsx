// components/public/HeroSection.tsx — IIMS College Modern Hero
import Link from 'next/link'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Dark Background with Overlay */}
            <div className="absolute inset-0 bg-[#1A1A2E]" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c476?w=1920&q=80')] bg-cover bg-center opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E]/60 via-[#1A1A2E]/40 to-[#1A1A2E]" />

            {/* Subtle grid */}
            <div className="absolute inset-0 hero-grid opacity-[0.05] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 mb-8 animate-fade-up backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F4C542] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4C542]"></span>
                    </span>
                    <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">
                        Admissions Open 2026
                    </span>
                </div>

                {/* Headline */}
                <h1 className="font-poppins font-bold text-5xl md:text-7xl lg:text-8xl mb-8 tracking-tight text-white animate-fade-up leading-[1.05]">
                    Shape Your Future<br className="hidden md:block" />
                    <span className="text-[#F4C542]">
                        at IIMS College
                    </span>
                </h1>

                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up font-medium">
                    Discover world-class programs in management, technology, and innovation.
                    Join a community of ambitious learners and industry leaders.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
                    <Link
                        href="/portal/signup"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#D32F2F] text-white font-bold text-base hover:bg-[#B71C1C] transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-red-900/30"
                    >
                        Apply Now
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/about"
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-base hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                    >
                        <Play className="h-4 w-4" />
                        Explore Programs
                    </Link>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-3xl mx-auto animate-fade-up">
                    <MiniStat value="20+" label="Years" />
                    <MiniStat value="5000+" label="Alumni" />
                    <MiniStat value="50+" label="Faculty" />
                    <MiniStat value="15+" label="Programs" />
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronDown className="h-6 w-6 text-white/30" />
                </div>
            </div>
        </section>
    )
}

function MiniStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="font-poppins font-bold text-3xl md:text-4xl text-white mb-1">
                {value}
            </div>
            <div className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                {label}
            </div>
        </div>
    )
}
