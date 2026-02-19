// components/public/DomainsSection.tsx — Stealth Terminal Domains
import { Globe, Lock, Code, Database, Search, Cpu } from 'lucide-react'

const DOMAINS = [
    { id: 'web', title: 'Web Security', icon: Globe, desc: 'Analyzing vulnerabilities in web applications. XSS, SQLi, and more.' },
    { id: 'crypto', title: 'Cryptography', icon: Lock, desc: 'Breaking codes and understanding secure communication protocols.' },
    { id: 'pwn', title: 'Binary Exploitation', icon: Code, desc: 'Low-level memory corruption, buffer overflows, and shellcode.' },
    { id: 'forensics', title: 'Digital Forensics', icon: Search, desc: 'Recovering data and investigating digital crime scenes.' },
    { id: 'reversing', title: 'Reverse Engineering', icon: Cpu, desc: 'Deconstructing software to understand internal architecture.' },
    { id: 'network', title: 'Network Defense', icon: Database, desc: 'Securing infrastructure and analyzing traffic patterns.' },
]

export default function DomainsSection() {
    return (
        <section className="py-24 bg-[#09090B] border-b border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-4">
                        Security <span className="text-[#10B981]">Domains</span>
                    </h2>
                    <p className="text-[#A1A1AA] max-w-2xl mx-auto font-mono text-sm leading-relaxed">
                        Our curriculum covers the full spectrum of cybersecurity disciplines, from offensive operations to defensive strategies.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DOMAINS.map((domain) => (
                        <div
                            key={domain.id}
                            className="group p-6 rounded-sm bg-black border border-[#27272A] hover:border-[#10B981]/50 transition-all duration-300 hover:bg-[#10B981]/5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 rounded-sm bg-[#111113] border border-[#27272A] text-[#10B981] group-hover:scale-110 transition-transform">
                                    <domain.icon className="h-6 w-6" />
                                </div>
                                <span className="font-mono text-xs text-[#52525B] group-hover:text-[#10B981] transition-colors">
                                    0{DOMAINS.indexOf(domain) + 1}
                                </span>
                            </div>
                            <h3 className="font-mono font-bold text-lg text-[#F8FAFC] mb-2 group-hover:text-[#10B981] transition-colors">
                                {domain.title}
                            </h3>
                            <p className="text-[#A1A1AA] text-sm leading-relaxed">
                                {domain.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
