// app/(public)/about/page.tsx — ICEHC About Page: Hero + Objectives + Team Grid + Sustainability
import Link from 'next/link'
import { Terminal, ShieldCheck, Award, FlaskConical, BookOpen, FileText, GraduationCap, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About ICEHC — IIMS Cybersecurity & Ethical Hacking Club',
    description: 'Learn about the founding team, mission, and objectives of ICEHC at IIMS College, Kathmandu.',
}

const OBJECTIVES = [
    {
        title: 'Practical Skill Development',
        desc: 'Hands-on training in Kali Linux, Burp Suite, Wireshark; Penetration Testing and Network Defence methodologies.',
        icon: Terminal,
    },
    {
        title: 'Ethical Hacking Awareness',
        desc: 'Promoting "White Hat" hacking principles; educating on digital hygiene, phishing defence, and scam prevention (aligning with the "Scan the Scammers" initiative).',
        icon: ShieldCheck,
    },
    {
        title: 'Career Readiness',
        desc: 'Preparing members for CEH, CompTIA Security+ certifications and cybersecurity careers through CTF competitions and expert guest sessions.',
        icon: Award,
    },
    {
        title: 'Innovation & Research',
        desc: 'Encouraging students to build and test their own security tools and write research papers on emerging vulnerabilities.',
        icon: FlaskConical,
    },
]

const ALL_MEMBERS = [
    { name: 'Sujal Mainali', role: 'President', program: 'BCS 2026 Jan Intake', initials: 'SM', tier: 'gold' as const },
    { name: 'Deepika Kumari Yadav', role: 'Vice President', program: 'BCS 2026 Jan Intake', initials: 'DY', tier: 'cyan' as const },
    { name: 'Raskin Shrestha', role: 'Secretary', program: 'BSC 2026 Jan Intake', initials: 'RS', tier: 'green' as const },
    { name: 'Barsha Shrestha', role: 'Joint Secretary', program: 'BSC 2026 Jan Intake', initials: 'BS', tier: 'green' as const },
    { name: 'Namika Prajapati', role: 'Treasurer', program: 'BCS 2026 Jan Intake', initials: 'NP', tier: 'green' as const },
    { name: 'Sabina Neupane', role: 'Event Coordinator', program: 'BCS 2026 Jan Intake', initials: 'SN', tier: 'green' as const },
    { name: 'Samrachana Lama', role: 'Marketing Lead', program: 'BCS 2026 Jan Intake', initials: 'SL', tier: 'green' as const },
    { name: 'Radha Rawat', role: 'IT Head', program: 'BSC 2026 Jan Intake', initials: 'RR', tier: 'cyan' as const },
    { name: 'Karuna Bishkarma', role: 'Executive Head', program: 'BCS 2026 Jan Intake', initials: 'KB', tier: 'cyan' as const },
]

const SUSTAINABILITY = [
    { title: 'Knowledge Transfer', desc: 'Mentorship Pipeline — 2nd and 3rd-year students train 1st-year members in specific tools.', icon: BookOpen },
    { title: 'Documentation', desc: 'Club Wiki on GitHub/Notion documenting every workshop, session, and resource.', icon: FileText },
    { title: 'Faculty Integration', desc: 'Club activities integrated with the IIMS academic calendar for maximum participation.', icon: GraduationCap },
]

const BADGE_STYLES = {
    gold: {
        badge: 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/40',
        border: 'border-[#D4AF37]/40',
        avatar: 'bg-[#D4AF37]/10 text-[#D4AF37]',
    },
    cyan: {
        badge: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30',
        border: 'border-[#2D2D44]',
        avatar: 'bg-[#0D1B2A] text-[#00D4FF]',
    },
    green: {
        badge: 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/30',
        border: 'border-[#2D2D44]',
        avatar: 'bg-[#0D1B2A] text-[#00FF87]',
    },
}

export default function AboutPage() {
    return (
        <div className="bg-black min-h-screen pt-24">
            {/* ═══ Section A — Page Hero ═══ */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <p className="font-mono text-[#00FF87] text-sm mb-2">// about_icehc.md</p>
                <h1 className="font-mono font-bold text-[#F0F0FF] text-3xl md:text-4xl mb-4">
                    About ICEHC
                    <span className="block h-1 w-16 bg-[#00FF87] mt-3 rounded-full" />
                </h1>
                <p className="text-[#8888AA] font-mono text-sm mb-6">
                    IIMS Cybersecurity & Ethical Hacking Club — Est. 2025
                </p>
                <p className="text-[#8888AA] text-base font-sans leading-relaxed max-w-3xl">
                    To establish IIMS College as a premier hub for cybersecurity excellence in Nepal.
                    We envision a community where students bridge the gap between theoretical computer
                    science and real-world defense strategies, fostering a culture of ethical
                    responsibility, digital safety, and proactive threat mitigation.
                </p>
            </section>

            {/* ═══ Section B — Full Objectives ═══ */}
            <section className="bg-black py-16 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// objectives --verbose</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        Our Objectives
                    </h2>

                    <div className="space-y-8">
                        {OBJECTIVES.map(({ title, desc, icon: Icon }, i) => (
                            <div
                                key={title}
                                className={`flex flex-col md:flex-row items-start gap-6 ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''
                                    }`}
                            >
                                <div className="flex-shrink-0">
                                    <div className="h-20 w-20 rounded-xl bg-[#00FF87]/10 flex items-center justify-center">
                                        <Icon className="h-10 w-10 text-[#00FF87]" />
                                    </div>
                                </div>
                                <div className="flex-1 bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6">
                                    <h3 className="font-mono font-bold text-[#F0F0FF] text-base mb-3">{title}</h3>
                                    <p className="text-[#8888AA] text-sm font-sans leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Section C — All 9 Founding Members ═══ */}
            <section className="bg-black py-16 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// core_team --list-all</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        Founding Members
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ALL_MEMBERS.map(({ name, role, program, initials, tier }) => {
                            const style = BADGE_STYLES[tier]
                            return (
                                <div
                                    key={name}
                                    className={`bg-[#0A0A0F] border rounded-lg p-6 text-center hover:bg-[#12121A] transition-all duration-200 ${style.border}`}
                                >
                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg ${style.avatar}`}>
                                        {initials}
                                    </div>
                                    <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-1">{name}</h3>
                                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full border inline-block mb-2 ${style.badge}`}>
                                        {role}
                                    </span>
                                    <p className="text-[#8888AA] text-xs font-sans">{program}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* ═══ Section D — Sustainability & Links ═══ */}
            <section className="bg-black py-16 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// sustainability.conf</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        Sustainability Plan
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {SUSTAINABILITY.map(({ title, desc, icon: Icon }) => (
                            <div
                                key={title}
                                className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6 hover:bg-[#12121A] hover:border-[#00FF87]/30 transition-all duration-200"
                            >
                                <div className="h-10 w-10 rounded-md bg-[#00FF87]/10 flex items-center justify-center mb-4">
                                    <Icon className="h-5 w-5 text-[#00FF87]" />
                                </div>
                                <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-2">{title}</h3>
                                <p className="text-[#8888AA] text-sm font-sans leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* External Links */}
                    <div className="bg-[#0D1B2A] border border-[#2D2D44] rounded-lg p-6">
                        <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-4">IIMS Resources</h3>
                        <div className="flex flex-wrap gap-4">
                            {[
                                { href: 'https://iimscollege.edu.np/capture-the-flag/', label: 'IIMS CTF Page' },
                                { href: 'https://iimscollege.edu.np/it-club/', label: 'IIMS IT Club' },
                                { href: 'https://iimscollege.edu.np/', label: 'IIMS College' },
                            ].map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 border border-[#2D2D44] text-[#00D4FF] font-mono text-sm px-4 py-2 rounded-md hover:bg-[#12121A] hover:border-[#00D4FF]/30 transition-all"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
