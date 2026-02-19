// components/public/EventsSection.tsx — Premium minimal
import Link from 'next/link'
import type { PublicEvent } from '@/types/database'

interface Props { events: PublicEvent[] }

export default function EventsSection({ events }: Props) {
    const upcoming = events
        .filter((e) => new Date(e.event_date) >= new Date())
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 3)

    const typeBadgeColor: Record<string, string> = {
        ctf: 'bg-red-50 text-red-600',
        workshop: 'bg-blue-50 text-blue-600',
        competition: 'bg-amber-50 text-amber-600',
        seminar: 'bg-purple-50 text-purple-600',
    }

    return (
        <section id="events" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">Events</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-12">Upcoming Events</h2>

                {upcoming.length === 0 ? (
                    <div className="bg-[#FAFAFA] rounded-xl p-12 text-center border border-[#E5E7EB]">
                        <p className="text-[#6B7280] mb-2">No upcoming events at the moment.</p>
                        <p className="text-sm text-[#9CA3AF]">Follow us on social media for updates.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {upcoming.map((e) => (
                            <div key={e.id} className="bg-[#FAFAFA] rounded-xl p-6 border border-[#E5E7EB] hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeBadgeColor[e.type] || 'bg-gray-100 text-gray-600'}`}>
                                        {e.type}
                                    </span>
                                </div>
                                <h3 className="font-semibold text-[#111827] mb-2">{e.title}</h3>
                                <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">{e.description}</p>
                                <div className="text-xs text-[#9CA3AF]">
                                    {new Date(e.event_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    {e.location && ` · ${e.location}`}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-10">
                    <Link href="/events" className="text-sm font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
                        View all events →
                    </Link>
                </div>
            </div>
        </section>
    )
}
