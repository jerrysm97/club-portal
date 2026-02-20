// app/(public)/about/page.tsx — IIMS IT Club About Page (v4.0)
import Link from 'next/link'
import { Code2, Shield, Brain, Globe, BookOpen, FileText, GraduationCap, ExternalLink, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About — IIMS IT Club',
    description: 'Learn about the mission, focus areas, and founding team of the IIMS IT Club at IIMS College, Kathmandu.',
}

const FOCUS_AREAS = [
    {
        title: 'Web & Software Development',
        desc: 'Hands-on training with industry-standard frameworks — React, Next.js, Node.js, and databases. We build real projects from scratch.',
        icon: Code2,
        color: 'text-[#1A237E]',
        bg: 'bg-[#1A237E]/8',
    },
    {
        title: 'Cybersecurity & CTF',
        desc: 'Ethical hacking, penetration testing, and Capture The Flag competitions aligned with the IIMS College CTF program.',
        icon: Shield,
        color: 'text-[#E53935]',
        bg: 'bg-[#E53935]/8',
    },
    {
        title: 'AI & Machine Learning',
        desc: 'Applied AI/ML: building neural networks, NLP models, and data science projects tailored for business and technical programs.',
        icon: Brain,
        color: 'text-[#2E7D32]',
        bg: 'bg-[#2E7D32]/8',
    },
    {
        title: 'Open Source & DevOps',
        desc: 'Contributing to open source projects, cloud infrastructure, Docker, CI/CD pipelines, and Infrastructure as Code.',
        icon: Globe,
        color: 'text-[#0277BD]',
        bg: 'bg-[#0277BD]/8',
    },
]

const ALL_MEMBERS = [
    { name: 'Sujal Mainali', role: 'President', program: 'BCS 2026 Jan Intake', initials: 'SM', highlight: true },
    { name: 'Deepika Kumari Yadav', role: 'Vice President', program: 'BCS 2026 Jan Intake', initials: 'DY', highlight: false },
    { name: 'Raskin Shrestha', role: 'Secretary', program: 'BSC 2026 Jan Intake', initials: 'RS', highlight: false },
    { name: 'Barsha Shrestha', role: 'Joint Secretary', program: 'BSC 2026 Jan Intake', initials: 'BS', highlight: false },
    { name: 'Namika Prajapati', role: 'Treasurer', program: 'BCS 2026 Jan Intake', initials: 'NP', highlight: false },
    { name: 'Sabina Neupane', role: 'Event Coordinator', program: 'BCS 2026 Jan Intake', initials: 'SN', highlight: false },
    { name: 'Samrachana Lama', role: 'Marketing Lead', program: 'BCS 2026 Jan Intake', initials: 'SL', highlight: false },
    { name: 'Radha Rawat', role: 'IT Head', program: 'BSC 2026 Jan Intake', initials: 'RR', highlight: false },
    { name: 'Karuna Bishkarma', role: 'Executive Head', program: 'BCS 2026 Jan Intake', initials: 'KB', highlight: false },
]

const SUSTAINABILITY = [
    { title: 'Knowledge Transfer', desc: 'Mentorship pipeline — 2nd and 3rd-year students train 1st-year members in specific tools and workflows.', icon: BookOpen },
    { title: 'Documentation', desc: 'Club wiki documenting every workshop, session, resource, and CTF writeup for future members.', icon: FileText },
    { title: 'Faculty Integration', desc: 'Club activities integrated with the IIMS academic calendar for maximum student participation.', icon: GraduationCap },
]

export default function AboutPage() {
    return (
        <div className="bg-[#F8F9FA] min-h-screen pt-24">
            {/* Page Hero */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-3 block">
                    IIMS IT Club
                </span>
                <h1 className="font-bold text-[#212121] text-3xl md:text-4xl mb-4">
                    About the Club
                </h1>
                <p className="text-[#757575] text-base mb-6 font-medium">
                    Established 2025 · IIMS College, Kathmandu, Nepal
                </p>
                <p className="text-[#424242] text-lg leading-relaxed max-w-3xl">
                    The IIMS IT Club is the official technology club of IIMS College, Kathmandu. Our mission is to empower students across all programs — BCS, BBUS, BIHM, and MBA — with practical technology skills, real-world project experience, and a collaborative community that bridges the gap between academia and industry.
                </p>
            </section>

            {/* Focus Areas */}
            <section className="bg-white py-16 border-y border-[#E0E0E0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-3 block">
                            What We Focus On
                        </span>
                        <h2 className="font-bold text-[#212121] text-2xl md:text-3xl">
                            Four Core <span className="text-[#1A237E]">Focus Areas</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FOCUS_AREAS.map((area) => {
                            const Icon = area.icon
                            return (
                                <div key={area.title} className="bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#1A237E]/20 transition-all group">
                                    <div className={`h-12 w-12 rounded-xl ${area.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-6 w-6 ${area.color}`} />
                                    </div>
                                    <h3 className="font-bold text-[#212121] mb-2 text-sm">{area.title}</h3>
                                    <p className="text-[#757575] text-sm leading-relaxed">{area.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Founding Members */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-3 block">
                            Our People
                        </span>
                        <h2 className="font-bold text-[#212121] text-2xl md:text-3xl">
                            Founding <span className="text-[#1A237E]">Members</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {ALL_MEMBERS.map(({ name, role, program, initials, highlight }) => (
                            <div
                                key={name}
                                className={`bg-white border rounded-xl p-5 text-center hover:shadow-md transition-all ${highlight ? 'border-[#1A237E]/30 ring-1 ring-[#1A237E]/20' : 'border-[#E0E0E0]'}`}
                            >
                                <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-base ${highlight ? 'bg-[#1A237E] text-white' : 'bg-[#F0F4FF] text-[#1A237E]'}`}>
                                    {initials}
                                </div>
                                <h3 className="font-semibold text-[#212121] text-sm mb-1">{name}</h3>
                                <span className={`text-xs px-2 py-0.5 rounded-full inline-block mb-1 font-medium ${highlight ? 'bg-[#1A237E]/10 text-[#1A237E]' : 'bg-[#E8EAF6] text-[#1A237E]'}`}>
                                    {role}
                                </span>
                                <p className="text-[#9E9E9E] text-xs">{program}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sustainability */}
            <section className="bg-white py-16 border-t border-[#E0E0E0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-10">
                        <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-3 block">
                            Long-Term Vision
                        </span>
                        <h2 className="font-bold text-[#212121] text-2xl md:text-3xl">
                            Sustainability <span className="text-[#1A237E]">Plan</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {SUSTAINABILITY.map(({ title, desc, icon: Icon }) => (
                            <div key={title} className="bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl p-6">
                                <div className="h-10 w-10 rounded-lg bg-[#1A237E]/10 flex items-center justify-center mb-4">
                                    <Icon className="h-5 w-5 text-[#1A237E]" />
                                </div>
                                <h3 className="font-bold text-[#212121] text-sm mb-2">{title}</h3>
                                <p className="text-[#757575] text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* External Links */}
                    <div className="bg-[#F0F4FF] border border-[#C5CAE9] rounded-xl p-6">
                        <h3 className="font-bold text-[#1A237E] text-sm mb-4">IIMS Resources</h3>
                        <div className="flex flex-wrap gap-3">
                            {[
                                { href: 'https://iimscollege.edu.np/it-club/', label: 'IIMS IT Club Page' },
                                { href: 'https://iimscollege.edu.np/capture-the-flag/', label: 'CTF Program' },
                                { href: 'https://iimscollege.edu.np/iims-hackathon/', label: 'IIMS Hackathon' },
                                { href: 'https://iimscollege.edu.np/', label: 'IIMS College' },
                            ].map(({ href, label }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 border border-[#9FA8DA] text-[#1A237E] text-sm px-4 py-2 rounded-lg hover:bg-[#1A237E] hover:text-white hover:border-[#1A237E] transition-all font-medium"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    {label}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 bg-[#F8F9FA] border-t border-[#E0E0E0]">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h2 className="font-bold text-[#212121] text-2xl mb-4">Interested in Joining?</h2>
                    <p className="text-[#757575] mb-8">Membership is open to all IIMS College students. Apply through the Member Portal.</p>
                    <Link
                        href="/portal/login"
                        className="inline-flex items-center gap-2 bg-[#E53935] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#C62828] transition-all text-sm"
                    >
                        Apply for Membership
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    )
}
