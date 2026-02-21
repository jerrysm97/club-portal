import Link from 'next/link'

export const revalidate = 60

const MISSION_CARDS = [
    { title: 'Practical Skills', desc: 'Hands-on experience with modern security tools and defensive practices.' },
    { title: 'Ethical Awareness', desc: 'Fostering a culture of responsibility and lawful technology use.' },
    { title: 'Career Readiness', desc: 'Preparing students for the demands of the global cybersecurity industry.' },
    { title: 'Innovation & Research', desc: 'Exploring emerging threats and proactive mitigation strategies.' },
]

export default function HomePage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-24 border-b border-[#F5F5F5]">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#111111] mb-6 tracking-tight leading-tight max-w-4xl mx-auto">
                        IIMS Cybersecurity & Ethical Hacking Club
                    </h1>
                    <p className="text-[#4A4A4A] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                        Bridging theory and real-world defense at IIMS College, Nepal. We equip students with the technical acumen to secure the digital frontier.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/join"
                            prefetch={false}
                            className="w-full sm:w-auto px-8 py-3 bg-[#C8102E] text-white font-bold text-sm tracking-wide rounded-sm hover:bg-[#A30D25] transition-colors"
                        >
                            Join the Club
                        </Link>
                        <Link
                            href="/about"
                            prefetch={false}
                            className="w-full sm:w-auto px-8 py-3 bg-white text-[#111111] border border-[#111111] font-bold text-sm tracking-wide rounded-sm hover:bg-[#F5F5F5] transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="border-b border-[#F5F5F5] bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-[#E5E5E5]">
                        <div className="pt-4 md:pt-0">
                            <span className="block text-3xl font-bold text-[#111111] mb-1 tracking-tight">9</span>
                            <span className="text-[#4A4A4A] text-sm font-medium tracking-wide">Founding Members</span>
                        </div>
                        <div className="pt-4 md:pt-0">
                            <span className="block text-3xl font-bold text-[#111111] mb-1 tracking-tight">6</span>
                            <span className="text-[#4A4A4A] text-sm font-medium tracking-wide">Planned Events</span>
                        </div>
                        <div className="pt-4 md:pt-0">
                            <span className="block text-3xl font-bold text-[#111111] mb-1 tracking-tight">2025</span>
                            <span className="text-[#4A4A4A] text-sm font-medium tracking-wide">Established</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Split-Section */}
            <section className="py-24 border-b border-[#F5F5F5]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-[#111111] mb-6 tracking-tight">
                                Our Vision
                            </h2>
                            <p className="text-[#4A4A4A] text-base leading-relaxed mb-6">
                                At ICEHC, we believe that true cybersecurity starts with an ethical foundation. Our vision is to cultivate a proactive mindset among emerging technologists, equipping them to identify vulnerabilities before they are exploited.
                            </p>
                            <p className="text-[#4A4A4A] text-base leading-relaxed">
                                We focus on hands-on threat intelligence, digital safety, and responsible disclosure, moving beyond theoretical classroom concepts to actionable, real-world defense mechanisms.
                            </p>
                        </div>

                        {/* Visual Anchor (No Images) */}
                        <div className="relative aspect-square md:aspect-video lg:aspect-square bg-[#FAFAFA] border border-[#E5E5E5] p-8 flex items-end justify-end overflow-hidden">
                            {/* Geometric decorative elements */}
                            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-[#111111] translate-x-12 -translate-y-12"></div>
                            <div className="absolute bottom-12 left-12 w-32 h-32 border-[12px] border-[#C8102E]"></div>
                            <div className="absolute top-1/2 left-0 w-full h-px bg-[#E5E5E5]"></div>
                            <div className="absolute top-0 left-1/2 w-px h-full bg-[#E5E5E5]"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Grid */}
            <section className="py-24 bg-[#FAFAFA]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-[#111111] mb-4 tracking-tight">Core Pillars</h2>
                        <div className="w-16 h-1 bg-[#C8102E]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MISSION_CARDS.map((card, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-8 border border-[#E5E5E5] group hover:border-[#111111] transition-colors"
                            >
                                <div className="text-[#4A4A4A] font-mono text-sm mb-4 opacity-50 block">{(idx + 1).toString().padStart(2, '0')}</div>
                                <h3 className="text-xl font-bold text-[#111111] mb-3">{card.title}</h3>
                                <p className="text-[#4A4A4A] leading-relaxed text-sm">
                                    {card.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
