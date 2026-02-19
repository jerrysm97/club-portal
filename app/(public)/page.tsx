// app/(public)/page.tsx — ICEHC Homepage: Hero + Objectives + Activities + About Teaser + Team + Affiliation
import Link from 'next/link'
import { Terminal, ShieldCheck, Award, FlaskConical, ArrowRight, Users, Calendar, Target, Trophy } from 'lucide-react'
import HeroTerminal from '@/components/public/HeroTerminal'

const OBJECTIVES = [
    {
        num: '01',
        title: 'Practical Skill Development',
        desc: 'Hands-on training in Kali Linux, Burp Suite, Wireshark; Penetration Testing and Network Defence methodologies.',
        icon: Terminal,
    },
    {
        num: '02',
        title: 'Ethical Hacking Awareness',
        desc: 'Promoting "White Hat" hacking principles; educating on digital hygiene, phishing defence, and scam prevention.',
        icon: ShieldCheck,
    },
    {
        num: '03',
        title: 'Career Readiness',
        desc: 'Preparing members for CEH, CompTIA Security+ certifications and cybersecurity careers through CTF competitions.',
        icon: Award,
    },
    {
        num: '04',
        title: 'Innovation & Research',
        desc: 'Encouraging students to build and test their own security tools and write research papers on emerging vulnerabilities.',
        icon: FlaskConical,
    },
]

const ACTIVITIES = [
    { month: 'Month 1', title: 'Introduction to the Red Team', desc: 'Kickoff workshop: installing Virtual Machines (Kali Linux) and explaining the ethics of hacking.', badge: 'Workshop', badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' },
    { month: 'Month 2', title: '"Scan the Scammers" Seminar', desc: 'Awareness session dissecting common financial frauds and educational scams; teaching students to identify and report them.', badge: 'Seminar', badgeColor: 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/30' },
    { month: 'Month 3', title: 'Internal CTF', desc: 'Beginner-level competition where students solve security puzzles (decryption, web exploitation) for points.', badge: 'CTF', badgeColor: 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30' },
    { month: 'Month 4', title: 'Guest Lecture Series', desc: 'Inviting a cybersecurity professional to discuss the current job market and threat landscape in Nepal.', badge: 'Seminar', badgeColor: 'text-[#00FF87] bg-[#00FF87]/10 border-[#00FF87]/30' },
    { month: 'Month 5', title: 'Secure Coding Bootcamp', desc: 'Collaborating with the Coding Club to teach developers how to patch vulnerabilities (SQL Injection, XSS).', badge: 'Workshop', badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30' },
    { month: 'Month 6', title: 'Hackathon / Cyber Day', desc: 'College-wide event showcasing projects, tools, and a final "Red vs. Blue" team simulation.', badge: 'Hackathon', badgeColor: 'text-[#C0392B] bg-[#8B1A1A]/20 border-[#8B1A1A]/40' },
]

const TEAM_PREVIEW = [
    { name: 'Sujal Mainali', role: 'President', program: 'BCS 2026 Jan Intake', initials: 'SM', gold: true },
    { name: 'Deepika Kumari Yadav', role: 'Vice President', program: 'BCS 2026 Jan Intake', initials: 'DY', gold: false },
    { name: 'Radha Rawat', role: 'IT Head', program: 'BSC 2026 Jan Intake', initials: 'RR', gold: false },
    { name: 'Raskin Shrestha', role: 'Secretary', program: 'BSC 2026 Jan Intake', initials: 'RS', gold: false },
]

const STATS = [
    { value: '9', label: 'Founding Members', icon: Users },
    { value: '6', label: 'Events Planned', icon: Calendar },
    { value: '4', label: 'Focus Areas', icon: Target },
    { value: 'CTF', label: 'Competitions', icon: Trophy },
]

export default function HomePage() {
    return (
        <>
            {/* ═══ Section A — Hero ═══ */}
            <section className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 terminal-grid opacity-30" />

                <div className="max-w-4xl mx-auto px-6 pt-24 pb-12 relative z-10 flex-1 flex flex-col justify-center">
                    {/* College badge */}
                    <div className="mb-6">
                        <span className="text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/30 font-mono text-xs px-3 py-1 rounded-full">
                            IIMS College — Kathmandu, Nepal
                        </span>
                    </div>

                    {/* Terminal typewriter */}
                    <HeroTerminal />

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-4 mt-8">
                        <Link
                            href="/portal/login"
                            className="bg-[#00FF87] text-black font-mono font-bold px-6 py-3 rounded-md hover:bg-[#00e87a] active:scale-95 transition-all duration-150 text-sm"
                        >
                            Apply for Membership →
                        </Link>
                        <Link
                            href="#objectives"
                            className="border border-[#2D2D44] text-[#F0F0FF] font-mono px-6 py-3 rounded-md hover:bg-[#12121A] hover:border-[#00FF87]/50 transition-all text-sm"
                        >
                            Learn More ↓
                        </Link>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="bg-[#0A0A0F] border-t border-[#1E1E2E] w-full relative z-10">
                    <div className="max-w-7xl mx-auto px-6 py-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {STATS.map(({ value, label, icon: Icon }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <Icon className="h-5 w-5 text-[#00D4FF] flex-shrink-0" />
                                    <div>
                                        <span className="font-mono font-bold text-[#F0F0FF] text-lg">{value}</span>
                                        <p className="text-[#8888AA] text-xs font-sans">{label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Section B — Objectives ═══ */}
            <section id="objectives" className="bg-black py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// objectives.exe</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        What We Do
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {OBJECTIVES.map(({ num, title, desc, icon: Icon }) => (
                            <div
                                key={num}
                                className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6 hover:bg-[#12121A] hover:border-[#00FF87]/30 transition-all duration-200 group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-md bg-[#00FF87]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00FF87]/20 transition-colors">
                                        <Icon className="h-5 w-5 text-[#00FF87]" />
                                    </div>
                                    <div>
                                        <span className="text-[#8888AA] font-mono text-xs">{num}</span>
                                        <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mt-1 mb-2">{title}</h3>
                                        <p className="text-[#8888AA] text-sm font-sans leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Section C — Activities Timeline ═══ */}
            <section className="bg-black py-20 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// activities_plan.sh</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        Planned Activities
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ACTIVITIES.map(({ month, title, desc, badge, badgeColor }) => (
                            <div
                                key={month}
                                className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6 hover:bg-[#12121A] hover:border-[#00FF87]/30 transition-all duration-200"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[#8888AA] font-mono text-xs">{month}</span>
                                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${badgeColor}`}>
                                        {badge}
                                    </span>
                                </div>
                                <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-2">{title}</h3>
                                <p className="text-[#8888AA] text-sm font-sans leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 border border-[#2D2D44] text-[#F0F0FF] font-mono text-sm px-6 py-2.5 rounded-md hover:bg-[#12121A] hover:border-[#00FF87]/50 transition-all"
                        >
                            View All Events <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Section D — About Teaser ═══ */}
            <section className="bg-black py-20 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        {/* Terminal block */}
                        <div className="bg-black border border-[#2D2D44] rounded-md p-6 font-mono text-sm overflow-x-auto">
                            <p className="text-[#00D4FF] mb-3">$ cat vision.txt</p>
                            <div className="text-[#00FF87] space-y-1">
                                <p>{'>'}  Establishing IIMS College as a</p>
                                <p>{'>'}  premier hub for cybersecurity</p>
                                <p>{'>'}  excellence in Nepal.</p>
                                <p className="text-[#2D2D44]">{'>'}</p>
                                <p>{'>'}  Bridging theory and real-world</p>
                                <p>{'>'}  defense strategies since 2025.</p>
                            </div>
                            <p className="text-[#8888AA] mt-3">$ _</p>
                        </div>

                        {/* Content */}
                        <div>
                            <p className="font-mono text-[#00FF87] text-sm mb-2">// about_icehc</p>
                            <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl mb-6">
                                Who We Are
                            </h2>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3">
                                    <span className="text-[#00FF87] font-mono mt-0.5">▸</span>
                                    <p className="text-[#8888AA] text-sm font-sans">
                                        <span className="text-[#F0F0FF] font-semibold">Founded in 2025</span> by 9 dedicated students passionate about cybersecurity and ethical hacking.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#00FF87] font-mono mt-0.5">▸</span>
                                    <p className="text-[#8888AA] text-sm font-sans">
                                        <span className="text-[#F0F0FF] font-semibold">Hands-on training</span> with industry tools like Kali Linux, Burp Suite, and Wireshark in every session.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-[#00FF87] font-mono mt-0.5">▸</span>
                                    <p className="text-[#8888AA] text-sm font-sans">
                                        <span className="text-[#F0F0FF] font-semibold">Partnered with GDS</span> (Growth & Development Services) for external mentorship and resources.
                                    </p>
                                </li>
                            </ul>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 border border-[#2D2D44] text-[#F0F0FF] font-mono text-sm px-6 py-2.5 rounded-md hover:bg-[#12121A] hover:border-[#00FF87]/50 transition-all"
                            >
                                Read More About Us <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Section E — Core Team Preview ═══ */}
            <section className="bg-black py-20 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="font-mono text-[#00FF87] text-sm mb-2">// core_team --preview</p>
                    <h2 className="font-mono font-bold text-[#F0F0FF] text-2xl md:text-3xl mb-12">
                        Leadership
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TEAM_PREVIEW.map(({ name, role, program, initials, gold }) => (
                            <div
                                key={name}
                                className={`bg-[#0A0A0F] border rounded-lg p-6 text-center hover:bg-[#12121A] transition-all duration-200 ${gold ? 'border-[#D4AF37]/40' : 'border-[#2D2D44]'
                                    }`}
                            >
                                <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 font-mono font-bold text-lg ${gold
                                        ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                        : 'bg-[#0D1B2A] text-[#00FF87]'
                                    }`}>
                                    {initials}
                                </div>
                                <h3 className="font-mono font-bold text-[#F0F0FF] text-sm mb-1">{name}</h3>
                                <span className={`font-mono text-xs px-2 py-0.5 rounded-full border inline-block mb-2 ${gold
                                        ? 'text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/40'
                                        : 'text-[#00D4FF] bg-[#00D4FF]/10 border-[#00D4FF]/30'
                                    }`}>
                                    {role}
                                </span>
                                <p className="text-[#8888AA] text-xs font-sans">{program}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 text-center">
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 border border-[#2D2D44] text-[#F0F0FF] font-mono text-sm px-6 py-2.5 rounded-md hover:bg-[#12121A] hover:border-[#00FF87]/50 transition-all"
                        >
                            Meet All 9 Founding Members <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Section F — IIMS Affiliation Strip ═══ */}
            <section className="bg-[#0D1B2A] py-12 border-t border-[#1E1E2E]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-l-4 border-[#8B1A1A] pl-6">
                        <div>
                            <p className="text-[#F0F0FF] font-mono font-bold text-sm mb-1">
                                Officially Recognized Under IIMS College, Kathmandu
                            </p>
                            <p className="text-[#8888AA] text-sm font-sans">
                                In Academic Collaboration with Taylor&apos;s University
                            </p>
                        </div>
                        <a
                            href="https://iimscollege.edu.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#8B1A1A] text-white font-mono font-bold px-5 py-2.5 rounded-md hover:bg-[#C0392B] transition-all text-sm flex-shrink-0"
                        >
                            Visit IIMS College →
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
