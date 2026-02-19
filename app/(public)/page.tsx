// app/(public)/page.tsx
// Homepage for the public club website.
// Sections: Hero → About Preview → Photo Gallery → Events Preview → College → Portal CTA
// Uses gradient placeholders for images until real photos are added to /public.

import Link from 'next/link'
import Image from 'next/image'

// Placeholder events data — replace with Supabase fetch later
const upcomingEvents = [
    {
        date: '15 Mar',
        title: 'Capture The Flag Competition',
        description: 'Test your hacking skills in our annual CTF challenge. Teams of 3-4 compete across web, crypto, and forensics categories.',
        location: 'IIMS Lab 301',
    },
    {
        date: '28 Mar',
        title: 'Cybersecurity Career Panel',
        description: 'Industry professionals share insights on building a career in cybersecurity, penetration testing, and SOC operations.',
        location: 'IIMS Auditorium',
    },
    {
        date: '10 Apr',
        title: 'Ethical Hacking Workshop',
        description: 'Hands-on workshop covering network scanning, vulnerability assessment, and basic exploitation techniques.',
        location: 'IIMS Lab 204',
    },
]

// Gallery image data — uses /public/1.jpg through 5.jpg if they exist
// If images don't exist, gradient placeholders are shown instead
const galleryImages = [
    { src: '/1.jpg', alt: 'Club members at a hackathon event', fallback: 'from-indigo-800 to-purple-900' },
    { src: '/2.jpg', alt: 'Cybersecurity workshop in progress', fallback: 'from-blue-800 to-cyan-900' },
    { src: '/3.jpg', alt: 'Team presentation at tech conference', fallback: 'from-violet-800 to-indigo-900' },
    { src: '/4.jpg', alt: 'Networking session with industry experts', fallback: 'from-slate-700 to-slate-900' },
    { src: '/5.jpg', alt: 'Annual club celebration', fallback: 'from-indigo-900 to-slate-900' },
]

export default function HomePage() {
    return (
        <div className="bg-slate-950">

            {/* ==================== HERO SECTION ==================== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
                {/* Glow effect behind text */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                    {/* College label */}
                    <p className="text-indigo-400 uppercase text-sm font-semibold tracking-[0.2em] mb-4">
                        IIMS College
                    </p>
                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        IIMS Cyber
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400"> Security </span>
                        Club
                    </h1>
                    {/* Tagline */}
                    <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Empowering the next generation of cybersecurity professionals through hands-on learning, competitions, and industry connections.
                    </p>
                    {/* CTA buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/portal/login"
                            className="px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-600/25"
                        >
                            Enter Member Portal
                        </Link>
                        <a
                            href="#about"
                            className="px-8 py-3.5 text-base font-semibold text-white border border-slate-600 rounded-xl hover:bg-slate-800 transition-all"
                        >
                            Learn More ↓
                        </a>
                    </div>
                </div>

                {/* Bouncing scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* ==================== ABOUT PREVIEW ==================== */}
            <section id="about" className="py-24 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    {/* Text content */}
                    <div>
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">About Us</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Building Tomorrow&apos;s Cyber Defenders
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            Founded at IIMS College, the Cyber Security Club brings together passionate students who are eager to learn about digital security, ethical hacking, and the ever-evolving landscape of cyber threats.
                        </p>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Through workshops, CTF competitions, guest lectures, and hands-on labs, we provide a collaborative environment where theory meets practice.
                        </p>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            Learn More About Us
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                    {/* Image / placeholder */}
                    <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-800 to-purple-900 shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <p className="text-white/40 text-sm">Add /public/1.jpg</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PHOTO GALLERY ==================== */}
            <section className="py-24 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">Gallery</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Club Life</h2>
                    </div>
                    {/* Responsive image grid: 1 col → 2 col → 3 col */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {galleryImages.map((img, index) => (
                            <div
                                key={index}
                                className="relative h-64 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
                            >
                                {/* Gradient placeholder — replace with Image component when photos exist */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${img.fallback} transition-transform duration-500 group-hover:scale-105`}>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white/30 text-sm">{img.alt}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== EVENTS PREVIEW ==================== */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">What&apos;s Coming</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Upcoming Events</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {upcomingEvents.map((event, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-indigo-500 transition-all duration-300 group"
                            >
                                {/* Date badge */}
                                <div className="inline-flex items-center px-3 py-1.5 bg-indigo-600/20 text-indigo-400 text-sm font-semibold rounded-lg mb-4">
                                    {event.date}
                                </div>
                                {/* Event title */}
                                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-indigo-300 transition-colors">
                                    {event.title}
                                </h3>
                                {/* Description */}
                                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                    {event.description}
                                </p>
                                {/* Location */}
                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-10">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            View All Events
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ==================== COLLEGE AFFILIATION ==================== */}
            <section className="py-24 px-4 bg-slate-800">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">Our Institution</p>
                        <h2 className="text-3xl font-bold text-white mb-4">IIMS College</h2>
                        <p className="text-slate-400 leading-relaxed mb-2">
                            Officially recognized by IIMS College — one of Nepal&apos;s leading institutions for technology and management education.
                        </p>
                        <p className="text-slate-500 text-sm mb-6">
                            Kumaripati, Lalitpur · Kathmandu, Nepal
                        </p>
                        <a
                            href="https://iimscollege.edu.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors"
                        >
                            Visit College Website
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                    {/* College logo placeholder */}
                    <div className="flex items-center justify-center">
                        <div className="w-48 h-48 bg-slate-700 rounded-2xl flex items-center justify-center border border-slate-600">
                            <div className="text-center">
                                <span className="text-4xl font-bold text-white/30">IIMS</span>
                                <p className="text-white/20 text-xs mt-1">Add college-logo.png</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== PORTAL CTA ==================== */}
            <section className="py-20 px-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Already a member?
                    </h2>
                    <p className="text-indigo-200 text-lg mb-8">
                        Access your portal to view posts, documents, and connect with fellow members.
                    </p>
                    <Link
                        href="/portal/login"
                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-indigo-900 bg-white rounded-xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl"
                    >
                        Member Login →
                    </Link>
                    <p className="text-indigo-300/60 text-sm mt-5">
                        Not a member yet? <Link href="/contact" className="text-indigo-200 hover:text-white underline">Contact us</Link> to join.
                    </p>
                </div>
            </section>
        </div>
    )
}
