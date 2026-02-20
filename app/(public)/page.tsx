// app/(public)/page.tsx — IIMS IT Club Homepage (v4.0)
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
    Code2, Shield, Brain, Globe, Users, Calendar, Trophy, Target,
    ArrowRight, CheckCircle2, ChevronRight, GraduationCap, Star
} from 'lucide-react'
import HeroSection from '@/components/public/HeroSection'
import EventsSection from '@/components/public/EventsSection'
import TeamSection from '@/components/public/TeamSection'
import StatsSection from '@/components/public/StatsSection'

export const revalidate = 60

const FOCUS_AREAS = [
    {
        icon: Code2,
        title: 'Web Development',
        desc: 'Full-stack web development with modern frameworks — React, Next.js, Node.js, and more.',
        color: 'text-[#1A237E]',
        bg: 'bg-[#1A237E]/8',
    },
    {
        icon: Shield,
        title: 'Cybersecurity & CTF',
        desc: 'Ethical hacking, penetration testing, and Capture The Flag competitions aligned with IIMS CTF program.',
        color: 'text-[#E53935]',
        bg: 'bg-[#E53935]/8',
    },
    {
        icon: Brain,
        title: 'AI & Machine Learning',
        desc: 'Practical AI/ML projects, NLP, and data science workshops tailored for IIMS students.',
        color: 'text-[#2E7D32]',
        bg: 'bg-[#2E7D32]/8',
    },
    {
        icon: Globe,
        title: 'Open Source & DevOps',
        desc: 'Contributing to open source, cloud platforms, CI/CD pipelines, and infrastructure as code.',
        color: 'text-[#0277BD]',
        bg: 'bg-[#0277BD]/8',
    },
]

const BENEFITS = [
    'Access to exclusive workshop and CTF resources',
    'Network with industry professionals and IIMS alumni',
    'Build real projects for your portfolio',
    'Participate in IIMS Hackathon and CTF competitions',
    'Mentorship from senior students and faculty',
    'Certificate of participation for all events',
]

export default async function HomePage() {
    const supabase = await createServerSupabaseClient()

    const [eventsResult, teamResult] = await Promise.all([
        (async () => {
            try {
                const { data } = await supabase
                    .from('public_events')
                    .select('id, title, type, event_date, location, cover_image_url, is_published')
                    .eq('is_published', true)
                    .order('event_date', { ascending: true })
                    .limit(4)
                return data ?? []
            } catch {
                return []
            }
        })(),
        (async () => {
            try {
                const { data } = await supabase
                    .from('members')
                    .select('id, full_name, club_post, avatar_url, role')
                    .eq('status', 'approved')
                    .in('role', ['admin', 'superadmin'])
                    .order('joined_at', { ascending: true })
                    .limit(8)
                return (data ?? []).map((m: any) => ({ ...m, image_url: m.avatar_url }))
            } catch {
                return []
            }
        })(),
    ])

    return (
        <>
            {/* Hero */}
            <HeroSection />

            {/* Stats Bar */}
            <StatsSection />

            {/* Focus Areas */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-4 block">
                            What We Do
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-4">
                            Four Focus <span className="text-[#1A237E]">Areas</span>
                        </h2>
                        <p className="text-[#757575] max-w-xl mx-auto text-lg leading-relaxed">
                            From cybersecurity to AI, we cover the full spectrum of modern technology — something for every IIMS student.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FOCUS_AREAS.map((area) => {
                            const Icon = area.icon
                            return (
                                <div
                                    key={area.title}
                                    className="bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm hover:shadow-md hover:border-[#1A237E]/20 transition-all duration-200 group"
                                >
                                    <div className={`h-12 w-12 rounded-xl ${area.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`h-6 w-6 ${area.color}`} />
                                    </div>
                                    <h3 className="font-bold text-[#212121] mb-2">{area.title}</h3>
                                    <p className="text-[#757575] text-sm leading-relaxed">{area.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Events */}
            <EventsSection events={eventsResult as any[]} />

            {/* Why Join */}
            <section className="py-24 bg-[#F8F9FA]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#E53935] text-xs font-semibold uppercase tracking-widest mb-4 block">
                                Why Join Us
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-[#212121] mb-6">
                                Built for Every <span className="text-[#1A237E]">IIMS Student</span>
                            </h2>
                            <p className="text-[#757575] text-lg leading-relaxed mb-8">
                                Whether you are studying BCS, BBUS, BIHM, or MBA — the IT Club is your launchpad for hands-on technology experience beyond the classroom.
                            </p>
                            <ul className="space-y-3 mb-10">
                                {BENEFITS.map((b) => (
                                    <li key={b} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-[#2E7D32] mt-0.5 flex-shrink-0" />
                                        <span className="text-[#424242] text-sm">{b}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/portal/login"
                                className="inline-flex items-center gap-2 bg-[#E53935] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#C62828] transition-all text-sm active:scale-95"
                            >
                                Join the Club
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>

                        {/* IIMS Affiliation Card */}
                        <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 shadow-sm">
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E0E0E0]">
                                <div className="h-12 w-12 rounded-xl bg-[#1A237E] flex items-center justify-center">
                                    <GraduationCap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#212121]">IIMS College</p>
                                    <a
                                        href="https://iimscollege.edu.np/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[#0277BD] text-xs hover:underline"
                                    >
                                        iimscollege.edu.np
                                    </a>
                                </div>
                            </div>

                            <p className="text-[#757575] text-sm leading-relaxed mb-6">
                                IIMS College is one of Nepal&apos;s leading international institutions, partnered with Taylor&apos;s University, Malaysia. The IIMS IT Club is an official club of the college.
                            </p>

                            <div className="space-y-3 mb-6">
                                {[
                                    { label: 'BCS Hons', desc: 'Bachelor of Computer Science' },
                                    { label: 'BBUS Hons', desc: 'Bachelor of Business' },
                                    { label: 'BIHM Hons', desc: 'International Hospitality Management' },
                                    { label: 'MBA', desc: 'Master of Business Administration' },
                                ].map((p) => (
                                    <div key={p.label} className="flex items-center gap-3">
                                        <span className="bg-[#1A237E]/10 text-[#1A237E] text-xs font-bold px-2 py-0.5 rounded-full">{p.label}</span>
                                        <span className="text-[#757575] text-xs">{p.desc}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <a
                                    href="https://iimscollege.edu.np/it-club/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#1A237E] border border-[#1A237E]/30 rounded-lg px-3 py-2 hover:bg-[#1A237E]/8 transition-colors"
                                >
                                    IT Club Page
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </a>
                                <a
                                    href="https://iimscollege.edu.np/capture-the-flag/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#E53935] border border-[#E53935]/30 rounded-lg px-3 py-2 hover:bg-[#E53935]/8 transition-colors"
                                >
                                    CTF Program
                                    <ChevronRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <TeamSection team={teamResult as any[]} />

            {/* Final CTA */}
            <section className="py-20 bg-[#1A237E]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 mb-8">
                        <Star className="h-4 w-4 text-[#F9A825]" />
                        <span className="text-white/80 text-xs font-semibold uppercase tracking-wide">Open to All IIMS Students</span>
                    </div>
                    <h2 className="font-bold text-4xl md:text-5xl text-white mb-6">
                        Ready to <span className="text-[#E53935]">Build</span> Something?
                    </h2>
                    <p className="text-white/60 text-lg mb-10 leading-relaxed">
                        Join the IIMS IT Club and be part of a community that codes, competes, and creates. Membership is open to all IIMS College students.
                    </p>
                    <Link
                        href="/portal/login"
                        className="inline-flex items-center gap-2 bg-[#E53935] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#C62828] transition-all text-base hover:scale-[1.02] active:scale-95 shadow-xl shadow-red-900/30"
                    >
                        Apply for Membership
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>
        </>
    )
}
