// components/public/AboutSection.tsx — IIMS Collegiate Public About
import Link from 'next/link'
import { ShieldCheck, Target, Award, ArrowRight } from 'lucide-react'

export default function AboutSection({ aboutText }: { aboutText?: string | null }) {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                {/* Content */}
                <div className="space-y-8 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-poppins text-sm font-bold tracking-wider uppercase">
                        <Target className="h-4 w-4" />
                        <span>Our Identity</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827] leading-tight">
                        Forging the <span className="text-[#C3161C]">Digital Guardians</span> of Tomorrow's World
                    </h2>

                    <div className="space-y-6 text-[#4B5563] text-lg leading-relaxed">
                        {aboutText ? (
                            <p>{aboutText}</p>
                        ) : (
                            <>
                                <p>
                                    The IIMS Cybersecurity Club is a dedicated task force of aspiring security professionals, ethical hackers, and digital defenders at IIMS College.
                                </p>
                                <p>
                                    We bridge the gap between academic theory and industry reality. Through rigorous training, CTF competitions, and collaborative research, we prepare our members to lead in the evolving landscape of cyber threats.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <FeatureBadge icon={<ShieldCheck className="h-4 w-4" />} label="Ethical Hacking" />
                        <FeatureBadge icon={<Award className="h-4 w-4" />} label="Security Research" />
                        <FeatureBadge icon={<Award className="h-4 w-4" />} label="Network Defense" />
                    </div>

                    <div className="pt-6">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 text-[#C3161C] font-bold hover:gap-3 transition-all"
                        >
                            Learn More About Our Mission
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>

                {/* Visual/Image Area */}
                <div className="relative animate-fade-up">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-[#58151C]/10 to-[#C3161C]/10 blur-3xl rounded-[2rem]" />
                    <div className="relative bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl shadow-2xl overflow-hidden aspect-square flex flex-col">
                        {/* Collegiate Window Decor */}
                        <div className="bg-white border-b border-[#E5E7EB] p-4 flex items-center justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                            </div>
                            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
                                Security_Terminal_v2.0
                            </span>
                        </div>

                        <div className="flex-1 p-8 font-mono text-sm overflow-hidden flex flex-col justify-center">
                            <div className="space-y-4">
                                <p className="flex items-center gap-2">
                                    <span className="text-[#C3161C]">➜</span>
                                    <span className="text-[#111827] font-bold">~</span>
                                    <span className="text-[#6B7280]">./init_core_protocol.sh</span>
                                </p>
                                <div className="pl-6 space-y-2 text-[#4B5563]">
                                    <p className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                                        Learning modules initialized
                                    </p>
                                    <p className="flex items-center gap-3">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                                        CTF environments active
                                    </p>
                                    <p className="flex items-center gap-3 text-[#C3161C] font-bold">
                                        <span className="h-1.5 w-1.5 rounded-full bg-[#C3161C] animate-pulse" />
                                        Security Gateway Established
                                    </p>
                                </div>
                                <div className="h-px bg-[#E5E7EB] w-full my-6" />
                                <div className="bg-[#58151C] text-white p-4 rounded-xl shadow-lg transform rotate-[-2deg]">
                                    <p className="text-xs opacity-80 uppercase tracking-widest mb-1">Status Report</p>
                                    <p className="font-bold text-lg">System: Operational</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeatureBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-[#374151] text-xs font-bold shadow-sm transition-all hover:border-[#58151C]/20">
            <div className="text-[#C3161C]">{icon}</div>
            <span>{label}</span>
        </div>
    )
}
