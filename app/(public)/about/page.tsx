// app/(public)/about/page.tsx
// About page: Club story, mission & values, team section, college association

import Link from 'next/link'

// Team members data — replace names/roles with real info later
const teamMembers = [
    { name: 'Sujal Mainali', role: 'President', initials: 'SM', color: 'from-indigo-600 to-purple-600' },
    { name: 'Aayush Sharma', role: 'Vice President', initials: 'AS', color: 'from-blue-600 to-cyan-600' },
    { name: 'Priya Thapa', role: 'Secretary', initials: 'PT', color: 'from-violet-600 to-pink-600' },
    { name: 'Rohan KC', role: 'Treasurer', initials: 'RK', color: 'from-emerald-600 to-teal-600' },
    { name: 'Nisha Rai', role: 'Tech Lead', initials: 'NR', color: 'from-orange-600 to-red-600' },
    { name: 'Bikash Poudel', role: 'Design Lead', initials: 'BP', color: 'from-pink-600 to-rose-600' },
]

// Mission, Vision, Values cards
const values = [
    {
        title: 'Our Mission',
        description: 'To cultivate a community of security-minded students who can identify, analyze, and defend against modern cyber threats.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
    },
    {
        title: 'Our Vision',
        description: 'To become Nepal\'s most active and impactful student cybersecurity community, producing industry-ready professionals.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        ),
    },
    {
        title: 'Core Values',
        description: 'Ethics first, continuous learning, collaboration over competition, and making cybersecurity accessible to everyone.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
    },
]

export default function AboutPage() {
    return (
        <div className="bg-slate-950">

            {/* Hero Banner */}
            <section className="relative py-28 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        About IIMS Cyber Club
                    </h1>
                    <p className="text-lg text-slate-400">
                        Protecting the digital future, one student at a time.
                    </p>
                </div>
            </section>

            {/* Club Story */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">Our Story</p>
                        <h2 className="text-3xl font-bold text-white mb-6">How It All Started</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            The IIMS Cyber Security Club was founded by a group of passionate students at IIMS College who recognized a critical gap — while the world was rapidly digitalizing, cybersecurity education remained largely theoretical and disconnected from real-world practice.
                        </p>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            What started as informal weekend study groups quickly grew into an organized community of learners, hackers, and future security professionals. Today, the club hosts monthly workshops, participates in national CTF competitions, and maintains partnerships with industry professionals.
                        </p>
                        <p className="text-slate-400 leading-relaxed">
                            Our members have gone on to earn certifications like CompTIA Security+, CEH, and OSCP, and work at leading security firms across Nepal and beyond.
                        </p>
                    </div>
                    <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-800 to-cyan-900 shadow-2xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-white/30 text-sm">Add /public/3.jpg</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-24 px-4 bg-slate-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">What Drives Us</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Mission & Values</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((item, index) => (
                            <div key={index} className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400 mx-auto mb-5">
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <p className="text-indigo-400 uppercase text-sm font-semibold tracking-wider mb-3">The People</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Team</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center group">
                                {/* Avatar with initials */}
                                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                    <span className="text-xl font-bold text-white">{member.initials}</span>
                                </div>
                                <h4 className="text-white font-semibold text-sm">{member.name}</h4>
                                <p className="text-indigo-400 text-xs mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* College Association */}
            <section className="py-16 px-4 bg-slate-800 border-y border-slate-700">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-slate-400 text-sm mb-2">Officially recognized by</p>
                    <h3 className="text-2xl font-bold text-white mb-4">IIMS College</h3>
                    <a
                        href="https://iimscollege.edu.np/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Visit College Website →
                    </a>
                </div>
            </section>
        </div>
    )
}
