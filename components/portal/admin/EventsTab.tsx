// components/portal/admin/EventsTab.tsx — IIMS Collegiate Mission Management
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
                <button className="bg-[#58151C] text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-red-900/10 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-[#C3161C]">
                    <Plus className="h-5 w-5" /> Initiate New Mission
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {events.map(event => (
                    <div key={event.id} className="bg-white p-10 rounded-[4rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col xl:flex-row gap-10">
                        {/* Event Preview */}
                        <div className="w-full xl:w-72 h-48 rounded-[3rem] bg-gray-50 overflow-hidden relative border border-gray-100 shrink-0">
                            {event.cover_image_url ? (
                                <img src={event.cover_image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Calendar className="h-12 w-12 text-gray-200" />
                                </div>
                            )}
                            <div className="absolute top-4 left-4">
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border backdrop-blur-md",
                                    event.is_published ? "bg-emerald-500/80 text-white border-emerald-400" : "bg-gray-900/80 text-gray-400 border-gray-700"
                                )}>
                                    {event.is_published ? 'Operational' : 'Draft Intel'}
                                </span>
                            </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">
                                    <span className="text-[#C3161C]">{event.type}</span>
                                    <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                    <span>{formatDate(event.starts_at)}</span>
                                </div>
                                <h3 className="text-2xl font-poppins font-black text-[#111827] group-hover:text-[#C3161C] transition-colors leading-tight">
                                    {event.title}
                                </h3>
                                <div className="flex items-center gap-4 text-gray-400 font-medium text-sm">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 opacity-50" />
                                        {event.location || 'Remote Feed'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 opacity-50" />
                                        {event.max_attendees ? `${event.max_attendees} slots` : 'Unrestricted'}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-500 font-medium text-base line-clamp-2">{event.description}</p>
                        </div>

                        {/* Event Actions */}
                        <div className="flex xl:flex-col gap-3 shrink-0">
                            <button
                                onClick={() => handleToggleStatus(event.id, event.is_published)}
                                disabled={!!isLoading}
                                className={cn(
                                    "flex-1 xl:w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all border shadow-sm",
                                    event.is_published
                                        ? "bg-gray-900 text-white border-gray-800 hover:bg-black"
                                        : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 hover:text-white"
                                )}
                                title={event.is_published ? "Archive Mission" : "Deploy Mission"}
                            >
                                {event.is_published ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                            </button>
                            <button className="flex-1 xl:w-16 h-16 bg-white border border-gray-100 text-[#58151C] hover:bg-[#58151C] hover:text-white rounded-[2rem] flex items-center justify-center transition-all shadow-sm">
                                <Edit2 className="h-6 w-6" />
                            </button>
                            <a
                                href={`/portal/events/${event.id}`}
                                target="_blank"
                                className="flex-1 xl:w-16 h-16 bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 rounded-[2rem] flex items-center justify-center transition-all shadow-sm"
                            >
                                <ExternalLink className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
