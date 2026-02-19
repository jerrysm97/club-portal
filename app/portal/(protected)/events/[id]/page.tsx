// app/portal/events/[id]/page.tsx — Detailed Mission Intel
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Event } from '@/types/database'

export const revalidate = 60

export default async function PortalEventDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Fetch event details from the new 'events' table
    const { data: eventData } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .maybeSingle()

    if (!eventData) return notFound()
    const event = eventData as unknown as Event

    // Fetch attendees count
    const { count: attendeeCount } = await supabase
        .from('event_rsvps')
        .select('id', { count: 'exact' })
        .eq('event_id', params.id)
        .eq('status', 'going')

    const eventDate = event.starts_at || (event as any).event_date

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
            {/* Navigation */}
            <Link href="/portal/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#58151C] font-bold text-xs uppercase tracking-widest transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Log
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-600 font-black text-[10px] uppercase tracking-widest mb-4 border border-red-100">
                            Operation Order: {event.type}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-poppins font-black text-[#111827] leading-tight">
                            {event.title}
                        </h1>
                    </div>

                    {event.cover_image_url && (
                        <div className="relative rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-red-100/30 aspect-video group">
                            <img
                                src={event.cover_image_url}
                                alt={event.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>
                    )}

                    <div className="bg-white rounded-[2rem] p-10 border border-gray-100 shadow-sm prose prose-slate prose-lg max-w-none prose-headings:font-poppins prose-headings:font-black prose-headings:text-[#111827] prose-p:text-gray-500 prose-p:font-medium prose-strong:text-[#111827] prose-a:text-[#C3161C]">
                        <MarkdownRenderer content={event.description || ''} />
                    </div>
                </div>

                {/* Intelligence Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#58151C] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] group-hover:scale-110 transition-transform" />

                        <h3 className="font-poppins font-black text-xl mb-10 flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-[#FCD34D]" />
                            Mission Intel
                        </h3>

                        <div className="space-y-8">
                            <IntelRow icon={<Calendar className="h-5 w-5" />} label="Execution Date" value={formatDate(eventDate)} />
                            <IntelRow
                                icon={<Clock className="h-5 w-5" />}
                                label="Clearance Window"
                                value={`${new Date(eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`}
                            />
                            <IntelRow icon={<MapPin className="h-5 w-5" />} label="Deployment Area" value={event.location || 'College Campus'} />
                            <IntelRow icon={<Users className="h-5 w-5" />} label="Team Composition" value={`${attendeeCount || 0} Ready Operatives`} />
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10">
                            {event.meeting_link && (
                                <a
                                    href={event.meeting_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#C3161C] text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-[#A31217] transition-all hover:scale-[1.02] shadow-xl shadow-black/20"
                                >
                                    Establish Uplink <ExternalLink className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100 flex items-center justify-between group cursor-pointer hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-white text-[#58151C] shadow-sm group-hover:bg-[#58151C] group-hover:text-white transition-all">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <span className="block text-gray-400 text-[10px] font-black uppercase tracking-widest">Roster</span>
                                <span className="block text-sm font-bold text-[#111827]">Browse Attendees</span>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function IntelRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 text-[#FECACA]">
                {icon}
            </div>
            <div>
                <span className="block text-[8px] font-black text-[#FECACA]/60 uppercase tracking-[0.2em] mb-1">{label}</span>
                <span className="block text-sm font-bold text-white tracking-wide">{value}</span>
            </div>
        </div>
    )
}
