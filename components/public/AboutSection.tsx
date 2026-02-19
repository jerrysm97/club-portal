// components/public/AboutSection.tsx — Stealth Terminal About
import Link from 'next/link'
import { Terminal, Cpu, Globe, Shield } from 'lucide-react'

export default function AboutSection({ aboutText }: { aboutText?: string | null }) {
    return (
        <section className="py-24 bg-black border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 text-[#10B981] font-mono text-sm tracking-wider uppercase">
                        <Terminal className="h-4 w-4" />
                        <span>Who_We_Are</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC]">
                        Forging the <span className="text-[#06B6D4]">Guardians</span> of<br />
                        Tomorrow's Digital World
                    </h2>

                    <div className="prose prose-invert prose-p:text-[#A1A1AA] prose-p:font-mono prose-p:leading-relaxed">
                        {aboutText ? (
                            <p>{aboutText}</p>
                        ) : (
                            <>
                                <p>
                                    IIMS Cybersecurity Club is not just a student organization; it is a dedicated task force of aspiring security professionals, ethical hackers, and digital defenders.
                                </p>
                                <p>
                                    Founded at IIMS College, we bridge the gap between academic theory and real-world application. Through rigorous training, CTF competitions, and collaborative research, we prepare our members to tackle the evolving landscape of cyber threats.
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <FeatureBadge icon={<Shield className="h-4 w-4" />} label="Ethical Hacking" />
                        <FeatureBadge icon={<Cpu className="h-4 w-4" />} label="Reverse Engineering" />
                        <FeatureBadge icon={<Globe className="h-4 w-4" />} label="Network Defense" />
                    </div>

                    <div className="pt-4">
                        <Link href="/about" className="text-[#10B981] font-mono hover:underline decoration-[#10B981] underline-offset-4 pointer-events-auto">
                            Read_Full_Manifesto &gt;
                        </Link>
                    </div>
                </div>

                {/* Visual/Image Area */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#10B981] to-[#06B6D4] opacity-20 blur-2xl rounded-lg" />
                    <div className="relative bg-[#09090B] border border-[#27272A] rounded-lg p-1 overflow-hidden">
                        {/* Terminal Window Graphic */}
                        <div className="bg-[#111113] border-b border-[#27272A] p-3 flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
                            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        </div>
                        <div className="p-6 font-mono text-xs md:text-sm text-[#A1A1AA] space-y-2">
                            <p><span className="text-[#10B981]">user@iims-cyber</span>:<span className="text-[#06B6D4]">~</span>$ ./init_protocol.sh</p>
                            <p className="text-[#F8FAFC]">&gt; Initializing learning modules...</p>
                            <p className="text-[#F8FAFC]">&gt; Loading CTF environments... [DONE]</p>
                            <p className="text-[#F8FAFC]">&gt; Establishing secure connection...</p>
                            <p className="text-[#10B981]">Access Granted. Welcome to the future.</p>
                            <div className="h-4 w-2 bg-[#10B981] animate-pulse mt-2" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function FeatureBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#E4E4E7] text-xs font-mono">
            {icon}
            <span>{label}</span>
        </div>
    )
}
