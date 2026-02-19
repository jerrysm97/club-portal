// components/public/TeamSection.tsx
import type { TeamMember } from '@/types/database'

interface Props { team: TeamMember[] }

export default function TeamSection({ team }: Props) {
    return (
        <section id="team" className="py-28 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Our Team</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">Meet the Team</h2>
                </div>

                {team.length === 0 ? (
                    <div className="bg-white rounded-2xl p-16 text-center border border-[#E2E8F0] shadow-sm">
                        <div className="text-4xl mb-4">👥</div>
                        <p className="text-[#64748B] font-medium">Team members will appear here once added by an admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {team.map((m) => (
                            <div key={m.id} className="group bg-white rounded-2xl p-6 text-center border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {m.image_url ? (
                                    <img src={m.image_url} alt={m.name} className="w-20 h-20 rounded-2xl mx-auto mb-4 object-cover ring-2 ring-[#E2E8F0] group-hover:ring-[#6366F1]/30 transition-all" />
                                ) : (
                                    <div className="w-20 h-20 rounded-2xl mx-auto mb-4 bg-gradient-to-br from-[#EEF2FF] to-[#E0E7FF] flex items-center justify-center text-[#6366F1] text-2xl font-bold ring-2 ring-[#E2E8F0] group-hover:ring-[#6366F1]/30 transition-all">
                                        {m.name.charAt(0)}
                                    </div>
                                )}
                                <h3 className="font-bold text-[#0F172A] text-sm">{m.name}</h3>
                                <p className="text-xs text-[#6366F1] font-medium mt-1">{m.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
