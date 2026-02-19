// components/public/DomainsSection.tsx — Premium minimal
const domains = [
    { title: 'Red Team', desc: 'Offensive security, penetration testing, vulnerability research', icon: '⚔️' },
    { title: 'Blue Team', desc: 'Threat detection, incident response, SIEM, SOC operations', icon: '🛡️' },
    { title: 'Cloud & DevSecOps', desc: 'Securing pipelines, AWS/Azure security, container hardening', icon: '☁️' },
    { title: 'Digital Forensics', desc: 'Memory analysis, disk forensics, malware reverse engineering', icon: '🔍' },
    { title: 'AI & Security', desc: 'Adversarial ML, AI-powered threat detection, LLM security', icon: '🤖' },
]

export default function DomainsSection() {
    return (
        <section id="domains" className="py-24 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">Our Domains</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-12">What We Do</h2>

                <div className="grid md:grid-cols-3 gap-6">
                    {domains.map((d) => (
                        <div
                            key={d.title}
                            className="bg-white rounded-xl p-6 border border-[#E5E7EB] hover:border-[#6366F1]/30 hover:shadow-lg transition-all duration-300"
                        >
                            <div className="text-2xl mb-4">{d.icon}</div>
                            <h3 className="text-lg font-semibold text-[#111827] mb-2">{d.title}</h3>
                            <p className="text-sm text-[#6B7280] leading-relaxed">{d.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
