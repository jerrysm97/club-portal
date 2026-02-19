// components/public/AboutSection.tsx
// Dynamic about section — receives about_text from site_settings.

export default function AboutSection({ aboutText }: { aboutText: string }) {
    return (
        <section id="about" className="py-24 px-4 bg-black">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 01_ABOUT_US</p>
                <h2 className="font-[var(--font-mono)] font-bold text-3xl md:text-4xl text-[#F8FAFC] mb-8">
                    Who We Are
                </h2>
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <p className="font-[var(--font-inter)] text-[#A1A1AA] leading-relaxed mb-6">
                            {aboutText}
                        </p>
                        <p className="font-[var(--font-inter)] text-[#A1A1AA] leading-relaxed">
                            From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity. Our members gain practical skills that prepare them for careers in penetration testing, incident response, and security engineering.
                        </p>
                    </div>
                    {/* Domain quick icons */}
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: '🛡️', title: 'Ethical Hacking' },
                            { icon: '🔒', title: 'Blue Team' },
                            { icon: '🔬', title: 'Research' },
                            { icon: '🏆', title: 'CTF' },
                        ].map((d, i) => (
                            <div key={i} className="bg-[#09090B] border border-[#27272A] rounded-md p-4 text-center hover:border-[#10B981] transition-colors duration-200">
                                <span className="text-2xl block mb-2">{d.icon}</span>
                                <p className="font-[var(--font-mono)] text-[#F8FAFC] text-xs font-bold">{d.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
