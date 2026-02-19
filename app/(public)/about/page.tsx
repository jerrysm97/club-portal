// app/(public)/about/page.tsx
// About page — reuses TeamSection component, adds story and mission/values.

import TeamSection from '@/components/public/TeamSection'
import Link from 'next/link'

const values = [
    {
        title: 'Mission',
        text: 'To cultivate cybersecurity talent through practical, hands-on education and real-world security challenges.',
    },
    {
        title: 'Vision',
        text: "A Nepal where every digital system is secured by locally trained, world-class cybersecurity professionals.",
    },
    {
        title: 'Values',
        text: 'Integrity. Curiosity. Collaboration. Ethical practice above all.',
    },
]

export default function AboutPage() {
    return (
        <div className="bg-[#0D0D0D]">
            {/* Hero banner */}
            <section className="relative py-28 px-4 bg-grid">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/80 to-[#0D0D0D]" />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="font-[var(--font-orbitron)] font-black text-4xl md:text-5xl text-white mb-4">
                        About Us
                    </h1>
                    <p className="font-[var(--font-mono)] text-[#8892A4] text-sm">
                        <Link href="/" className="hover:text-[#00B4FF] transition-colors">Home</Link>
                        {' / '}
                        <span className="text-[#00B4FF]">About</span>
                    </p>
                </div>
            </section>

            {/* Club story */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 01 — Our Story</p>
                    <div className="grid md:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="font-[var(--font-orbitron)] font-bold text-3xl text-white mb-6">Our Story</h2>
                            <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed mb-4">
                                Founded in 2024 at IIMS College, the IIMS Cybersecurity Club was established with a singular mission: to build Nepal&apos;s next generation of cybersecurity professionals. What began as a small group of passionate students has grown into a thriving community of ethical hackers, defenders, and researchers.
                            </p>
                            <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed">
                                Our members gain hands-on experience through workshops, CTF competitions, and real-world security research. We cover the full spectrum — from red team operations to blue team defense, from cloud security to digital forensics.
                            </p>
                        </div>
                        {/* Image placeholder */}
                        <div className="h-80 glass rounded-2xl bg-gradient-to-br from-[#00B4FF]/10 to-[#00FF9C]/5 flex items-center justify-center">
                            <p className="font-[var(--font-mono)] text-[#8892A4] text-xs">// Add /public/2.jpg</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-20 px-4 bg-[#0A1F44]/30">
                <div className="max-w-7xl mx-auto">
                    <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 02 — What We Stand For</p>
                    <h2 className="font-[var(--font-orbitron)] font-bold text-3xl text-white mb-12">Mission & Values</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {values.map((v, i) => (
                            <div key={i} className="glass rounded-xl p-8 text-center hover:shadow-[0_0_20px_rgba(0,180,255,0.2)] transition-all duration-300">
                                <h3 className="font-[var(--font-orbitron)] font-bold text-[#00B4FF] text-lg mb-4">{v.title}</h3>
                                <p className="font-[var(--font-exo2)] text-[#8892A4] text-sm leading-relaxed">{v.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team section (reused component) */}
            <TeamSection />

            {/* College association */}
            <section className="py-12 px-4">
                <div className="max-w-xl mx-auto glass rounded-xl p-8 text-center border-[#00B4FF]/30">
                    <p className="font-[var(--font-mono)] text-[#8892A4] text-xs mb-2">Officially Recognized by</p>
                    <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-3">IIMS College</h3>
                    <a
                        href="https://iimscollege.edu.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00B4FF] hover:text-[#00FF9C] font-[var(--font-mono)] text-sm transition-colors"
                    >
                        iimscollege.edu.np →
                    </a>
                </div>
            </section>
        </div>
    )
}
