// components/public/EventsSection.tsx
import Link from 'next/link'
import type { PublicEvent } from '@/types/database'

interface Props { events: PublicEvent[] }

const typeBadge: Record<string, string> = {
    ctf: 'bg-red-50 text-red-600 border-red-100',
    workshop: 'bg-blue-50 text-blue-600 border-blue-100',
    competition: 'bg-amber-50 text-amber-600 border-amber-100',
    seminar: 'bg-purple-50 text-purple-600 border-purple-100',
}

export default function EventsSection({ events }: Props) {
    const upcoming = events
        .filter((e) => new Date(e.event_date) >= new Date())
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 3)

    return (
        <section id="events" className="py-28 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-end justify-between mb-14">
                    <div>
                        <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Events</span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0F172A]">Upcoming Events</h2>
                    </div>
                    <Link href="/events" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors group">
                        View all
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                {upcoming.length === 0 ? (
                    <div className="bg-[#F8FAFC] rounded-2xl p-16 text-center border border-[#E2E8F0]">
                        <div className="text-4xl mb-4">📅</div>
                        <p className="text-[#64748B] font-medium mb-1">No upcoming events at the moment.</p>
                        <p className="text-sm text-[#94A3B8]">Follow us on social media for updates.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-5">
                        {upcoming.map((e) => (
                            <div key={e.id} className="group bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                                {e.image_url && (
                                    <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover" />
                                )}
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${typeBadge[e.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                                            {e.type.charAt(0).toUpperCase() + e.type.slice(1)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-[#6366F1] transition-colors">{e.title}</h3>
                                    <p className="text-sm text-[#64748B] line-clamp-2 mb-5">{e.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                                        <span className="flex items-center gap-1.5">
                                            📅 {new Date(e.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </span>
                                        {e.location && (
                                            <span className="flex items-center gap-1.5">
                                                📍 {e.location}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10 md:hidden">
                    <Link href="/events" className="text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
                        View all events →
                    </Link>
                </div>
            </div>
        </section>
    )
}
