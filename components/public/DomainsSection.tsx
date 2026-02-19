// components/public/DomainsSection.tsx
const domains = [
    { title: 'Red Team', desc: 'Offensive security, penetration testing, vulnerability research', icon: '⚔️', gradient: 'from-red-500 to-orange-500' },
    { title: 'Blue Team', desc: 'Threat detection, incident response, SIEM, SOC operations', icon: '🛡️', gradient: 'from-blue-500 to-cyan-500' },
    { title: 'Cloud & DevSecOps', desc: 'Securing pipelines, AWS/Azure security, container hardening', icon: '☁️', gradient: 'from-sky-500 to-blue-500' },
    { title: 'Digital Forensics', desc: 'Memory analysis, disk forensics, malware reverse engineering', icon: '🔍', gradient: 'from-purple-500 to-violet-500' },
    { title: 'AI & Security', desc: 'Adversarial ML, AI-powered threat detection, LLM security', icon: '🤖', gradient: 'from-fuchsia-500 to-pink-500' },
    { title: 'Cryptography', desc: 'Applied crypto, zero-knowledge proofs, blockchain security', icon: '🔐', gradient: 'from-emerald-500 to-teal-500' },
]

export default function DomainsSection() {
    return (
        <section id="domains" className="py-28 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Our Domains</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">What We Do</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {domains.map((d) => (
                        <div
                            key={d.title}
                            className="group bg-white rounded-2xl p-7 border border-[#E2E8F0] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${d.gradient} text-white text-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                {d.icon}
                            </div>
                            <h3 className="text-lg font-bold text-[#0F172A] mb-2">{d.title}</h3>
                            <p className="text-sm text-[#64748B] leading-relaxed">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
