// components/public/DomainsSection.tsx
// 5 domain cards with glassmorphism and neon hover glow.

const domains = [
    {
        title: 'Red Team',
        description: 'Offensive security, penetration testing, vulnerability research',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Blue Team',
        description: 'Threat detection, incident response, SIEM, SOC operations',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
    {
        title: 'Cloud & DevSecOps',
        description: 'Securing pipelines, AWS/Azure security, container hardening',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
        ),
    },
    {
        title: 'Digital Forensics',
        description: 'Memory analysis, disk forensics, malware reverse engineering',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        ),
    },
    {
        title: 'AI & Security',
        description: 'Adversarial ML, AI-powered threat detection, LLM security',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
]

export default function DomainsSection() {
    return (
        <section className="py-24 px-4 bg-[#0A1F44]/50">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 02 — Our Domains</p>
                <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-12">
                    What We Do
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {domains.map((domain, i) => (
                        <div
                            key={i}
                            className="glass rounded-xl p-6 hover:border-[#00FF9C] hover:shadow-[0_0_20px_rgba(0,255,156,0.2)] transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-lg bg-[#00B4FF]/10 flex items-center justify-center text-[#00B4FF] mb-4 group-hover:text-[#00FF9C] transition-colors">
                                {domain.icon}
                            </div>
                            <h3 className="font-[var(--font-orbitron)] font-bold text-white text-lg mb-2">
                                {domain.title}
                            </h3>
                            <p className="font-[var(--font-exo2)] text-[#8892A4] text-sm leading-relaxed">
                                {domain.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
