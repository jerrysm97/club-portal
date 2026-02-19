// components/public/AboutSection.tsx — Premium minimal
interface Props { aboutText?: string }

export default function AboutSection({ aboutText }: Props) {
    const text = aboutText || 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity.'

    const pillars = [
        { icon: '🛡️', title: 'Ethical Hacking', desc: 'Hands-on penetration testing and vulnerability research' },
        { icon: '🔵', title: 'Blue Team', desc: 'Defense, monitoring, and incident response' },
        { icon: '🔬', title: 'Research', desc: 'Academic papers, threat intel, and emerging tech' },
        { icon: '🏁', title: 'CTF', desc: 'Capture the Flag competitions and challenges' },
    ]

    return (
        <section id="about" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">About Us</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Who We Are</h2>
                <p className="text-lg text-[#6B7280] max-w-3xl leading-relaxed mb-14">{text}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {pillars.map((p) => (
                        <div key={p.title} className="bg-[#FAFAFA] rounded-xl p-6 text-center hover:shadow-md transition-shadow border border-[#F3F4F6]">
                            <div className="text-3xl mb-3">{p.icon}</div>
                            <h3 className="font-semibold text-[#111827] mb-1">{p.title}</h3>
                            <p className="text-xs text-[#6B7280]">{p.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
