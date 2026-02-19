// components/public/AboutSection.tsx
interface Props { aboutText?: string }

export default function AboutSection({ aboutText }: Props) {
    const text = aboutText || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity.'

    const pillars = [
        { icon: '🛡️', title: 'Ethical Hacking', desc: 'Hands-on penetration testing and vulnerability research', color: 'from-red-500/10 to-orange-500/10' },
        { icon: '🔵', title: 'Blue Team', desc: 'Defense, monitoring, and incident response', color: 'from-blue-500/10 to-cyan-500/10' },
        { icon: '🔬', title: 'Research', desc: 'Academic papers, threat intel, and emerging tech', color: 'from-purple-500/10 to-pink-500/10' },
        { icon: '🏁', title: 'CTF', desc: 'Capture the Flag competitions and challenges', color: 'from-amber-500/10 to-yellow-500/10' },
    ]

    return (
        <section id="about" className="py-28 bg-white relative">
            <div className="max-w-6xl mx-auto px-6">
                <div className="max-w-3xl">
                    <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">About Us</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A] leading-tight mb-6">
                        Who We Are
                    </h2>
                    <p className="text-lg text-[#64748B] leading-relaxed">{text}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-16">
                    {pillars.map((p, i) => (
                        <div
                            key={p.title}
                            className="group relative bg-gradient-to-br p-[1px] rounded-2xl hover:-translate-y-1 transition-all duration-300"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            <div className={`bg-gradient-to-br ${p.color} rounded-2xl p-6 h-full border border-[#E2E8F0] group-hover:border-[#6366F1]/20 transition-colors`}>
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{p.icon}</div>
                                <h3 className="font-bold text-[#0F172A] mb-1.5">{p.title}</h3>
                                <p className="text-sm text-[#64748B] leading-relaxed">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
