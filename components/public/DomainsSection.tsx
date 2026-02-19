// components/public/DomainsSection.tsx — IIMS Collegiate Public Domains
import { Globe, Lock, Code, Server, Search, Cpu, ArrowRight } from 'lucide-react'

const DOMAINS = [
    { id: 'web', title: 'Web Security', icon: Globe, desc: 'Analyzing vulnerabilities in web applications. XSS, SQLi, and modern web flaws.', color: 'from-blue-500 to-blue-600' },
    { id: 'crypto', title: 'Cryptography', icon: Lock, desc: 'Breaking codes and understanding secure communication protocols.', color: 'from-purple-500 to-purple-600' },
    { id: 'pwn', title: 'Binary Exploitation', icon: Code, desc: 'Low-level memory corruption, buffer overflows, and architecture exploitation.', color: 'from-red-500 to-red-600' },
    { id: 'forensics', title: 'Digital Forensics', icon: Search, desc: 'Recovering data and investigating digital artifacts after a breach.', color: 'from-emerald-500 to-emerald-600' },
    { id: 'reversing', title: 'Reverse Engineering', icon: Cpu, desc: 'Deconstructing hardware and software to reveal hidden internal logic.', color: 'from-indigo-500 to-indigo-600' },
    { id: 'network', title: 'Network Defense', icon: Server, desc: 'Securing critical infrastructure and hardening networking protocols.', color: 'from-amber-500 to-amber-600' },
]

export default function DomainsSection() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827] mb-6">
                            Core Security <span className="text-[#C3161C]">Domains</span>
                        </h2>
                        <p className="text-[#4B5563] text-lg font-medium leading-relaxed">
                            Our curriculum covers the full spectrum of cybersecurity disciplines, from offensive operations to defensive strategies.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <div className="h-1 w-32 bg-[#FCD34D] rounded-full" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {DOMAINS.map((domain, index) => (
                        <div
                            key={domain.id}
                            className="group relative p-8 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#58151C] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col"
                        >
                            <div className="flex items-start justify-between mb-8">
                                <div className={`p-4 rounded-xl bg-gradient-to-br ${domain.color} text-white shadow-lg`}>
                                    <domain.icon className="h-6 w-6" />
                                </div>
                                <span className="font-poppins font-black text-4xl text-gray-100 group-hover:text-[#FEE2E2] transition-colors leading-none select-none">
                                    0{index + 1}
                                </span>
                            </div>

                            <h3 className="font-poppins font-bold text-xl text-[#111827] mb-3 group-hover:text-[#C3161C] transition-colors">
                                {domain.title}
                            </h3>
                            <p className="text-[#6B7280] text-sm leading-relaxed mb-8 flex-1">
                                {domain.desc}
                            </p>

                            <div className="pt-4 flex items-center gap-2 text-xs font-bold text-[#58151C] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                Explore Domain
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
