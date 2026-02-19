// app/portal/events/[id]/page.tsx — Single Event Detail
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import MarkdownRenderer from '@/components/ui/MarkdownRenderer'
import { Calendar, MapPin, Clock, Users, ArrowLeft, ExternalLink } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function PortalEventDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data: event } = await supabase
        .from('public_events')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!event) return <div>Mission invalid or redacted.</div>

    // Fetch attendees count (optional, but nice)
    const { count: attendeeCount } = await supabase
        .from('event_rsvps')
        .select('id', { count: 'exact' })
        .eq('event_id', params.id)
        .eq('status', 'going')

    return (
        <div className="max-w-4xl mx-auto py-8 animate-fade-up">
            <Link href="/portal/events" className="inline-flex items-center gap-2 text-[#52525B] hover:text-[#F8FAFC] font-mono text-xs mb-6 uppercase">
                <ArrowLeft className="h-3 w-3" /> Return_To_Log
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    <div>
                        <span className="text-[#10B981] font-mono text-xs uppercase mb-2 block tracking-widest">Operation_Details</span>
                        <h1 className="text-3xl md:text-4xl font-mono font-bold text-[#F8FAFC] mb-4">{event.title}</h1>
                    </div>

                    {event.cover_image_url && (
                        <div className="w-full aspect-video bg-[#111113] border border-[#27272A] rounded-sm overflow-hidden relative group">
                            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        </div>
                    )}

                    <div className="prose prose-invert prose-p:font-mono prose-headings:font-mono max-w-none">
                        <MarkdownRenderer content={event.description} />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="p-6 bg-[#09090B] border border-[#27272A] rounded-sm space-y-6">
                        <h3 className="font-mono font-bold text-[#F8FAFC] flex items-center gap-2 border-b border-[#27272A] pb-2">
                            Mission_Parameters
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 text-[#52525B] text-xs font-mono uppercase mb-1">
                                    <Calendar className="h-3 w-3" /> Execution_Date
                                </div>
                                <p className="text-[#F8FAFC] font-mono text-sm">{formatDate(event.event_date)}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[#52525B] text-xs font-mono uppercase mb-1">
                                    <Clock className="h-3 w-3" /> Time_Window
                                </div>
                                <p className="text-[#F8FAFC] font-mono text-sm">
                                    {new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[#52525B] text-xs font-mono uppercase mb-1">
                                    <MapPin className="h-3 w-3" /> Coordinates
                                </div>
                                <p className="text-[#F8FAFC] font-mono text-sm">{event.location || 'Remote Uplink'}</p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-[#52525B] text-xs font-mono uppercase mb-1">
                                    <Users className="h-3 w-3" /> Operatives
                                </div>
                                <p className="text-[#F8FAFC] font-mono text-sm">{attendeeCount || 0} confirm_going</p>
                            </div>
                        </div>

                        {event.meeting_link && (
                            <a
                                href={event.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#10B981] text-black font-mono font-bold text-sm rounded-sm hover:bg-[#059669] transition-colors"
                            >
                                ESTABLISH__UPLINK <ExternalLink className="h-3 w-3" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
