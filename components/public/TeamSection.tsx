// components/public/TeamSection.tsx
// Team grid with real member data and gradient avatars.

const team = [
    { name: 'Vision KC', role: 'President', initials: 'VK' },
    { name: 'Hari', role: 'Vice President', initials: 'H' },
    { name: 'Hari', role: 'Treasurer', initials: 'H' },
    { name: 'Hari', role: 'Secretary', initials: 'H' },
    { name: 'Hari', role: 'Joint Secretary', initials: 'H' },
    { name: 'Hari', role: 'Marketing Lead', initials: 'H' },
    { name: 'Sujal Mainali', role: 'Technical Head', initials: 'SM' },
    { name: 'Hari', role: 'Logistics', initials: 'H' },
]

export default function TeamSection() {
    return (
        <section className="py-24 px-4 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 04 — The Team</p>
                <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-12">
                    Meet the Team
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {team.map((member, i) => (
                        <div
                            key={i}
                            className="glass rounded-xl p-6 text-center group hover:shadow-[0_0_20px_rgba(0,180,255,0.3)] hover:-translate-y-1 transition-all duration-300"
                        >
                            {/* Avatar with gradient */}
                            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#00B4FF] to-[#00FF9C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                <span className="font-[var(--font-orbitron)] font-bold text-[#0D0D0D] text-lg">
                                    {member.initials}
                                </span>
                            </div>
                            <h4 className="font-[var(--font-orbitron)] font-bold text-white text-sm mb-1">
                                {member.name}
                            </h4>
                            <p className="font-[var(--font-mono)] text-[#00FF9C] text-xs">
                                {member.role}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
