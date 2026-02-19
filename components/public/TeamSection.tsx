// components/public/TeamSection.tsx — Premium minimal
import type { TeamMember } from '@/types/database'

interface Props { team: TeamMember[] }

export default function TeamSection({ team }: Props) {
    return (
        <section id="team" className="py-24 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">Our Team</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-12">Meet the Team</h2>

                {team.length === 0 ? (
                    <div className="bg-white rounded-xl p-12 text-center border border-[#E5E7EB]">
                        <p className="text-[#6B7280]">Team members will appear here once added by an admin.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {team.map((m) => (
                            <div key={m.id} className="bg-white rounded-xl p-6 text-center border border-[#E5E7EB] hover:shadow-md transition-shadow">
                                {m.avatar_url ? (
                                    <img src={m.avatar_url} alt={m.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] text-xl font-bold">
                                        {m.name.charAt(0)}
                                    </div>
                                )}
                                <h3 className="font-semibold text-[#111827]">{m.name}</h3>
                                <p className="text-sm text-[#6366F1] mt-0.5">{m.position}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
