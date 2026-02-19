// components/public/AboutSection.tsx
// About section with 2x2 icon grid and glassmorphism cards.

export default function AboutSection() {
    const domains = [
        { icon: '🛡️', title: 'Ethical Hacking' },
        { icon: '🔒', title: 'Defense & Blue Team' },
        { icon: '🔬', title: 'Security Research' },
        { icon: '🏆', title: 'CTF Competitions' },
    ]

    return (
        <section id="about" className="py-24 px-4 bg-[#0D0D0D]">
            <div className="max-w-7xl mx-auto">
                {/* Section label */}
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 01 — About Us</p>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Text content */}
                    <div>
                        <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-6">
                            Who We Are
                        </h2>
                        <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed mb-4">
                            IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. We train the next generation of security professionals through hands-on workshops, CTF competitions, and real-world security research.
                        </p>
                        <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed mb-8">
                            From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity. Our members gain practical skills that prepare them for careers in penetration testing, incident response, and security engineering.
                        </p>

                        {/* 2x2 icon grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {domains.map((d, i) => (
                                <div key={i} className="glass rounded-xl p-4 text-center hover:shadow-[0_0_20px_rgba(0,180,255,0.3)] transition-all duration-300">
                                    <span className="text-2xl mb-2 block">{d.icon}</span>
                                    <p className="font-[var(--font-orbitron)] text-white text-xs font-bold">{d.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image placeholder */}
                    <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden glass">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00B4FF]/20 to-[#00FF9C]/10 flex items-center justify-center">
                            <div className="text-center">
                                <svg className="w-12 h-12 text-[#00B4FF]/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="font-[var(--font-mono)] text-[#8892A4] text-xs">// Add about-mission.jpg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
