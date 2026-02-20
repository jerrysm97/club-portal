// components/portal/admin/EventsTab.tsx — IIMS IT Club Mission Management (v4.0)
'use client'

import { useState } from 'react'
import { Calendar, MapPin, Eye, EyeOff, Trash2, Edit2, Plus, Users, ExternalLink, X } from 'lucide-react'
import { toggleEventStatus } from '@/app/portal/(protected)/admin/actions'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const emptyForm = {
    title: '',
    slug: '',
    description: '',
    short_desc: '',
    event_date: '',
    end_date: '',
    location: '',
    meeting_link: '',
    type: 'workshop' as string,
    max_attendees: '',
    is_published: false,
}

export default function EventsTab({ events, refresh }: { events: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [submitting, setSubmitting] = useState(false)

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

    async function handleCreateEvent(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        try {
            const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            const body: any = {
                title: form.title,
                slug,
                description: form.description,
                event_date: new Date(form.event_date).toISOString(),
                type: form.type,
                is_published: form.is_published,
            }
            if (form.short_desc) body.short_desc = form.short_desc
            if (form.end_date) body.end_date = new Date(form.end_date).toISOString()
            if (form.location) body.location = form.location
            if (form.meeting_link) body.meeting_link = form.meeting_link
            if (form.max_attendees) body.max_attendees = parseInt(form.max_attendees)

            const res = await fetch('/api/admin/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error?.formErrors?.[0] || data.error || 'Failed to create event')
            }
            toast.success('Event created successfully!')
            setForm(emptyForm)
            setShowForm(false)
            refresh()
        } catch (err: any) {
            toast.error(err.message || 'Failed to create event')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#1A237E] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-md shadow-[#1A237E]/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-[#283593]"
                >
                    {showForm ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {showForm ? 'Cancel' : 'Initiate New Event'}
                </button>
            </div>

            {/* Event Creation Form */}
            {showForm && (
                <form onSubmit={handleCreateEvent} className="bg-white p-8 rounded-[2rem] border border-[#E0E0E0] shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-[#1A237E] uppercase tracking-wider">New Event Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Title *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="Introduction to the Red Team"
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E] focus:ring-1 focus:ring-[#1A237E]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Type *</label>
                            <select
                                value={form.type}
                                onChange={e => setForm({ ...form, type: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                            >
                                <option value="workshop">Workshop</option>
                                <option value="ctf">CTF</option>
                                <option value="hackathon">Hackathon</option>
                                <option value="seminar">Seminar</option>
                                <option value="meetup">Meetup</option>
                                <option value="competition">Competition</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Event Date *</label>
                            <input
                                type="datetime-local"
                                value={form.event_date}
                                onChange={e => setForm({ ...form, event_date: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">End Date</label>
                            <input
                                type="datetime-local"
                                value={form.end_date}
                                onChange={e => setForm({ ...form, end_date: e.target.value })}
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Location</label>
                            <input
                                type="text"
                                value={form.location}
                                onChange={e => setForm({ ...form, location: e.target.value })}
                                placeholder="IIMS College Computer Lab, Kathmandu"
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Max Attendees</label>
                            <input
                                type="number"
                                value={form.max_attendees}
                                onChange={e => setForm({ ...form, max_attendees: e.target.value })}
                                placeholder="50"
                                className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Short Description</label>
                        <input
                            type="text"
                            value={form.short_desc}
                            onChange={e => setForm({ ...form, short_desc: e.target.value })}
                            placeholder="Brief one-line description"
                            className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E]"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-[#757575] uppercase tracking-widest">Description *</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                            placeholder="Full event description (supports Markdown)"
                            rows={4}
                            className="w-full px-4 py-3 border border-[#E0E0E0] rounded-xl bg-[#F8F9FA] text-[#212121] focus:outline-none focus:border-[#1A237E] resize-none"
                            required
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_published"
                            checked={form.is_published}
                            onChange={e => setForm({ ...form, is_published: e.target.checked })}
                            className="w-4 h-4 accent-[#E53935]"
                        />
                        <label htmlFor="is_published" className="text-sm font-medium text-[#424242]">Publish immediately</label>
                    </div>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#E53935] text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-[#C62828] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Creating...' : 'Create Event'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 gap-8">
                {events.length === 0 && !showForm && (
                    <div className="text-center py-20 text-[#9E9E9E]">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                        <p className="font-bold text-sm">No events yet. Click "Initiate New Event" to create one.</p>
                    </div>
                )}
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
