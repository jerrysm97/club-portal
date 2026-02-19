// components/public/TeamSection.tsx
// Dynamic team section — receives team_members from DB.

import type { TeamMember } from '@/types/database'

export default function TeamSection({ team }: { team: TeamMember[] }) {
    return (
        <section className="py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 04_TEAM</p>
                <h2 className="font-[var(--font-mono)] font-bold text-3xl md:text-4xl text-[#F8FAFC] mb-12">
                    Meet the Team
                </h2>

                {team.length === 0 ? (
                    <div className="bg-[#09090B] border border-[#27272A] rounded-md p-12 text-center max-w-lg mx-auto">
                        <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3">{'>'} TEAM_DATA_LOADING</p>
                        <p className="text-[#A1A1AA] text-sm">Admin can add team members from the Admin Panel.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {team.map((member) => (
                            <div key={member.id} className="bg-[#09090B] border border-[#27272A] rounded-md p-6 text-center hover:border-[#10B981] transition-colors duration-200">
                                {/* Avatar */}
                                <div className="w-14 h-14 mx-auto rounded-sm bg-[#10B981] flex items-center justify-center mb-4">
                                    {member.image_url ? (
                                        <img src={member.image_url} alt={member.name} className="w-full h-full object-cover rounded-sm" />
                                    ) : (
                                        <span className="font-[var(--font-mono)] font-bold text-black text-lg">
                                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                        </span>
                                    )}
                                </div>
                                <h4 className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-sm mb-1">{member.name}</h4>
                                <p className="font-[var(--font-mono)] text-[#10B981] text-xs">{member.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
