// components/public/TeamSection.tsx — Stealth Terminal Team
import Avatar from '@/components/ui/Avatar'
import type { TeamMember } from '@/types/database'

export default function TeamSection({ team }: { team: TeamMember[] }) {
    if (team.length === 0) return null

    return (
        <section className="py-24 bg-[#09090B] border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#27272A] border border-[#3F3F46] text-[#A1A1AA] text-xs font-mono mb-4">
                        <span>v2.0_CORE_TEAM</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-4">
                        Meet the <span className="text-[#10B981]">Operators</span>
                    </h2>
                    <p className="text-[#A1A1AA] max-w-2xl mx-auto font-mono text-sm leading-relaxed">
                        The minds behind the infrastructure.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {team.map((member) => (
                        <div key={member.id} className="group text-center">
                            <div className="relative inline-block mb-4">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#10B981] to-[#06B6D4] blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
                                <Avatar
                                    src={member.image_url}
                                    name={member.name}
                                    size="lg"
                                    className="w-24 h-24 md:w-32 md:h-32 mx-auto border-2 border-[#27272A] group-hover:border-[#10B981] transition-colors duration-300"
                                />
                            </div>
                            <h3 className="font-mono font-bold text-lg text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                                {member.name}
                            </h3>
                            <p className="text-[#10B981] text-xs font-mono tracking-wide uppercase mt-1">
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
