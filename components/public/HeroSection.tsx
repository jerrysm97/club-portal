// components/public/HeroSection.tsx — IIMS Collegiate Public Hero
import Link from 'next/link'
import { Terminal, ChevronRight, Activity, Users, Trophy, Code } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function HeroSection() {
    return (
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-white">
            {/* Background Decor */}
            <div className="absolute inset-0 hero-grid opacity-[0.03] pointer-events-none" />
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C3161C]/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FCD34D]/10 rounded-full blur-[120px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
                <div className="flex flex-col items-center text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF2F2] border border-[#FEE2E2] mb-8 animate-fade-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C3161C] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C3161C]"></span>
                        </span>
                        <span className="text-xs font-bold text-[#C3161C] tracking-wide uppercase">
                            Collegiate Chapter Active
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-poppins font-bold text-5xl md:text-8xl mb-8 tracking-tight text-[#111827] animate-fade-up">
                        Mastering the art of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58151C] to-[#C3161C]">
                            Digital Defense
                        </span>
                    </h1>

                    <p className="text-[#4B5563] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up font-medium">
                        Join Nepal's premier student-led cybersecurity community.
                        We research, build, and defend the digital frontier at IIMS College.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-up w-full sm:w-auto">
                        <Link
                            href="/portal/signup"
                            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-[#C3161C] text-white font-bold hover:bg-[#A31217] transition-all hover:scale-[1.02] flex items-center justify-center gap-3 shadow-xl shadow-red-200"
                        >
                            <Terminal className="h-5 w-5" />
                            Apply to Join
                        </Link>
                        <Link
                            href="/about"
                            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-white border-2 border-[#E5E7EB] text-[#374151] font-bold hover:border-[#58151C] hover:text-[#111827] transition-all flex items-center justify-center gap-2 group"
                        >
                            Learn Our Mission
                            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-24 w-full max-w-4xl animate-fade-up">
                        <Stat icon={<Users className="h-5 w-5" />} label="Active Members" value="150+" color="text-[#C3161C]" />
                        <Stat icon={<Trophy className="h-5 w-5" />} label="CTF Challenges" value="45+" color="text-[#D97706]" />
                        <Stat icon={<Activity className="h-5 w-5" />} label="Workshops" value="12+" color="text-[#059669]" />
                        <Stat icon={<Code className="h-5 w-5" />} label="Repositories" value="20+" color="text-[#2563EB]" />
                    </div>
                </div>
            </div>
        </section>
    )
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode, label: string; value: string; color: string }) {
    return (
        <div className="flex flex-col items-center group cursor-default">
            <div className={cn("p-2 rounded-lg bg-gray-50 mb-3 group-hover:scale-110 transition-transform", color)}>
                {icon}
            </div>
            <div className="font-poppins font-bold text-3xl text-[#111827] mb-1">
                {value}
            </div>
            <div className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                {label}
            </div>
        </div>
    )
}
