// components/public/HeroSection.tsx
import Link from 'next/link'

export default function HeroSection() {
    return (
        <section className="relative min-h-[100vh] flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] overflow-hidden">
            {/* Ambient gradient blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#6366F1]/15 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#818CF8]/8 rounded-full blur-[180px]" />
            </div>

            {/* Subtle grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.1] fade-up">
                    <span className="w-2 h-2 rounded-full bg-[#818CF8] animate-pulse" />
                    <span className="text-sm text-[#C7D2FE] font-medium tracking-wide">IIMS College · Est. 2024</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.05] tracking-tight fade-up fade-up-delay-1">
                    Securing the<br />
                    <span className="text-gradient">Digital Future</span>
                </h1>

                <p className="mt-8 text-lg md:text-xl text-[#C7D2FE]/70 max-w-2xl mx-auto leading-relaxed fade-up fade-up-delay-2">
                    Nepal&apos;s next generation of ethical hackers, defenders, and security researchers.
                </p>

                <div className="mt-12 flex flex-wrap justify-center gap-4 fade-up fade-up-delay-3">
                    <Link
                        href="/about"
                        className="group px-8 py-4 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-semibold shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                    >
                        Explore Club Life
                        <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
                    </Link>
                    <Link
                        href="/portal/login"
                        className="px-8 py-4 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                    >
                        Member Portal
                    </Link>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent" />
        </section>
    )
}
