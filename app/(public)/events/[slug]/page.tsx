// app/(public)/events/[slug]/page.tsx — Stealth Terminal Event Detail
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import type { PublicEvent } from '@/types/database'

export const revalidate = 60

// Force dynamic rendering since we might look up by ID or slug
export const dynamic = 'force-dynamic'

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
    const { slug } = params
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // improved lookup: try slug first, then ID
    let event: PublicEvent | null = null

    // Try finding by slug
    const { data: bySlug } = await sb.from('public_events').select('*').eq('slug', slug).single()
    if (bySlug) {
        event = bySlug
    } else {
        // Try finding by ID (if slug looks like UUID)
        const { data: byId } = await sb.from('public_events').select('*').eq('id', slug).single()
        event = byId
    }

    if (!event) return notFound()

    const isWorkshop = event.type.toLowerCase().includes('workshop')
    const typeColor = isWorkshop ? 'text-[#10B981] border-[#10B981]/30 bg-[#10B981]/10' : 'text-[#06B6D4] border-[#06B6D4]/30 bg-[#06B6D4]/10'
    const imgUrl = event.cover_image_url || event.image_url

    return (
        <div className="bg-black min-h-screen">
            {/* Hero / Header */}
            <div className="relative h-[40vh] md:h-[50vh] overflow-hidden border-b border-[#27272A]">
                {imgUrl ? (
                    <img src={imgUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="absolute inset-0 hero-grid opacity-30 bg-[#111113]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto">
                    <Link href="/events" className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#F8FAFC] mb-6 transition-colors font-mono text-sm group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Back_to_Mission_Log
                    </Link>

                    <div className={`inline-block px-3 py-1 mb-4 rounded-full border text-xs font-mono font-bold uppercase tracking-wider ${typeColor}`}>
                        {event.type}
                    </div>

                    <h1 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-4 shadow-black drop-shadow-lg">
                        {event.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="prose prose-invert prose-p:font-mono prose-headings:font-mono max-w-none">
                        <MarkdownRenderer content={event.description || ''} />
                    </div>
                </div>

                {/* Sidebar / Info Panel */}
                <div className="space-y-8">
                    <div className="p-6 rounded-sm bg-[#09090B] border border-[#27272A] space-y-6 sticky top-24">
                        <h3 className="font-mono font-bold text-[#F8FAFC] border-b border-[#27272A] pb-3 mb-3">
                            Mission_Parameters
                        </h3>

                        <div className="space-y-4">
                            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Date" value={formatDate(event.event_date)} />
                            <InfoRow icon={<Clock className="h-4 w-4" />} label="Time" value={new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={event.location || 'Online'} />
                            {event.max_attendees && (
                                <InfoRow icon={<Users className="h-4 w-4" />} label="Capacity" value={`${event.max_attendees} Operatives`} />
                            )}
                        </div>

                        <div className="pt-6 border-t border-[#27272A]">
                            {new Date(event.event_date) > new Date() ? (
                                event.meeting_link ? (
                                    <a
                                        href={event.meeting_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center py-3 bg-[#10B981] text-black font-mono font-bold rounded-sm hover:bg-[#059669] transition-all hover:scale-105"
                                    >
                                        Join_Mission <ExternalLink className="ml-2 h-4 w-4 inline" />
                                    </a>
                                ) : (
                                    <Link
                                        href="/portal/login"
                                        className="block w-full text-center py-3 bg-[#F8FAFC] text-black font-mono font-bold rounded-sm hover:bg-[#E2E8F0] transition-colors"
                                    >
                                        Register_Now
                                    </Link>
                                )
                            ) : (
                                <button disabled className="w-full py-3 bg-[#27272A] text-[#71717A] font-mono font-bold rounded-sm cursor-not-allowed">
                                    Mission_Concluded
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-0.5 text-[#10B981]">{icon}</div>
            <div>
                <span className="block text-xs font-mono text-[#52525B] uppercase tracking-wide">{label}</span>
                <span className="block text-sm font-mono text-[#F8FAFC]">{value}</span>
            </div>
        </div>
    )
}
