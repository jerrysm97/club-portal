// components/public/TeamSection.tsx — IIMS Collegiate Public Team
import Avatar from '@/components/ui/Avatar'
import type { TeamMember } from '@/types/database'
import { Users, Crown } from 'lucide-react'

export default function TeamSection({ team }: { team: TeamMember[] }) {
    if (team.length === 0) return null

    return (
        <section className="py-24 bg-gray-50 border-y border-[#F3F4F6]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-20 animate-fade-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-poppins text-sm font-bold tracking-wider uppercase mb-6">
                        <Users className="h-4 w-4" />
                        <span>Collegiate Infrastructure</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827] mb-6">
                        Meet the <span className="text-[#C3161C]">Operators</span>
                    </h2>
                    <p className="text-[#6B7280] max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        The skilled student leaders driving our security infrastructure and curriculum.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
                    {team.map((member) => (
                        <div key={member.id} className="group text-center animate-fade-up">
                            <div className="relative inline-block mb-6">
                                <div className="absolute -inset-2 bg-gradient-to-tr from-[#58151C]/20 to-[#C3161C]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-110" />
                                <div className="relative">
                                    <Avatar
                                        src={member.image_url}
                                        name={member.name}
                                        size="lg"
                                        className="w-32 h-32 md:w-40 md:h-40 mx-auto ring-4 ring-white shadow-xl transition-all duration-500 group-hover:scale-[1.05] group-hover:ring-[#58151C]/10"
                                    />
                                    {member.role.toLowerCase().includes('lead') && (
                                        <div className="absolute -top-2 -right-2 bg-[#FCD34D] p-2 rounded-lg shadow-md transform rotate-12">
                                            <Crown className="h-4 w-4 text-[#58151C]" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h3 className="font-poppins font-bold text-xl text-[#111827] group-hover:text-[#C3161C] transition-colors mb-2">
                                {member.name}
                            </h3>
                            <p className="inline-block px-3 py-1 rounded-lg bg-[#F9FAFB] text-[#58151C] text-[10px] font-black tracking-[0.15em] uppercase border border-gray-100">
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
