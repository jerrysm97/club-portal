// components/portal/admin/EventsTab.tsx — IIMS IT Club Mission Management (v4.0)
'use client'

import { useState } from 'react'
import { Calendar, MapPin, Eye, EyeOff, Trash2, Edit2, Plus, Users, ExternalLink } from 'lucide-react'
import { toggleEventStatus } from '@/app/portal/(protected)/admin/actions'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function EventsTab({ events, refresh }: { events: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        setIsLoading(id)
        const res = await toggleEventStatus(id, !currentStatus)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Mission ${!currentStatus ? 'deployed' : 'archived'}`)
            refresh()
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex justify-end">
                <button className="bg-[#1A237E] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-md shadow-[#1A237E]/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-[#283593]">
                    <Plus className="h-5 w-5" /> Initiate New Event
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-[#E0E0E0] shadow-sm hover:shadow-xl transition-all group flex flex-col xl:flex-row gap-8 md:gap-10">
                        {/* Event Preview */}
                        <div className="w-full xl:w-72 h-48 rounded-[2rem] bg-[#F8F9FA] overflow-hidden relative border border-[#E0E0E0] shrink-0">
                            {event.image_url ? (
                                <img src={event.image_url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Calendar className="h-12 w-12 text-[#E0E0E0]" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={cn(
                                    "px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md shadow-sm",
                                    event.status === 'upcoming' ? "bg-[#4CAF50]/90 text-white border-[#81C784]" : "bg-[#212121]/80 text-[#EEEEEE] border-[#424242]"
                                )}>
                                    {event.status === 'upcoming' ? 'Operational' : 'Draft Intel'}
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-5">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">
                                    <span className="text-[#E53935]">{event.type}</span>
                                    <span className="w-1 h-1 bg-[#E0E0E0] rounded-full" />
                                    <span>{formatDate(event.event_date)}</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-[#212121] group-hover:text-[#1A237E] transition-colors leading-tight">
                                    {event.title}
                                </h3>
                                <div className="flex items-center gap-5 text-[#757575] font-medium text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 opacity-70" />
                                        {event.location || 'Remote Feed'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 opacity-70" />
                                        {event.max_attendees ? `${event.max_attendees} slots` : 'Unrestricted'}
                                    </div>
                                </div>
                            </div>
                            <p className="text-[#9E9E9E] font-medium text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                        </div>

                        {/* Event Actions */}
                        <div className="flex xl:flex-col gap-3 shrink-0">
                            <button
                                onClick={() => handleToggleStatus(event.id, event.status === 'upcoming')}
                                disabled={!!isLoading}
                                className={cn(
                                    "flex-1 xl:w-14 h-14 rounded-xl flex items-center justify-center transition-all border shadow-sm",
                                    event.status === 'upcoming'
                                        ? "bg-[#212121] text-white border-[#424242] hover:bg-black"
                                        : "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9] hover:bg-[#4CAF50] hover:text-white"
                                )}
                                title={event.status === 'upcoming' ? "Archive Event" : "Deploy Event"}
                            >
                                {event.status === 'upcoming' ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                            <button className="flex-1 xl:w-14 h-14 bg-white border border-[#E0E0E0] text-[#1A237E] hover:bg-[#E8EAF6] hover:border-[#C5CAE9] rounded-xl flex items-center justify-center transition-all shadow-sm">
                                <Edit2 className="h-5 w-5" />
                            </button>
                            <a
                                href={`/portal/events/${event.id}`}
                                target="_blank"
                                className="flex-1 xl:w-14 h-14 bg-white border border-[#E0E0E0] text-[#BDBDBD] hover:text-[#212121] hover:bg-[#F8F9FA] rounded-xl flex items-center justify-center transition-all shadow-sm"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
