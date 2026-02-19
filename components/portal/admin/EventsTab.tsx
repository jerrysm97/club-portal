'use client'

import { useState } from 'react'
import { Plus, Trash2, Calendar, MapPin, Edit2 } from 'lucide-react'
import { upsertEvent, deleteEvent } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { PublicEvent } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function EventsTab({ events }: { events: PublicEvent[] }) {
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<Partial<PublicEvent>>({})

    function startEdit(event?: PublicEvent) {
        setForm(event || { title: '', description: '', event_date: '', location: '', type: 'Workshop' })
        setIsEditing(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await upsertEvent(form)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Mission parameters updated')
            setIsEditing(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Abort mission? This will delete the event.')) return
        const res = await deleteEvent(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Mission aborted')
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Mission_Log_Control</h2>
                    <p className="text-[#A1A1AA] font-mono text-sm">Create and manage club operations.</p>
                </div>
                <button
                    onClick={() => startEdit()}
                    className="flex items-center gap-2 px-3 py-2 bg-[#10B981] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#34D399] transition-colors"
                >
                    <Plus className="h-4 w-4" /> NEW_MISSION
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="p-6 bg-[#111113] border border-[#27272A] rounded-sm space-y-4 mb-8">
                    <h3 className="text-[#F8FAFC] font-mono font-bold">{form.id ? 'Edit Mission' : 'New Mission'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Mission Title"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.title || ''}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                        <select
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.type || 'Workshop'}
                            onChange={e => setForm({ ...form, type: e.target.value as any })}
                        >
                            <option value="Workshop">Workshop</option>
                            <option value="CTF">CTF</option>
                            <option value="Speaker">Speaker</option>
                            <option value="Social">Social</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="datetime-local"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.event_date ? new Date(form.event_date).toISOString().slice(0, 16) : ''}
                            onChange={e => setForm({ ...form, event_date: new Date(e.target.value).toISOString() })}
                            required
                        />
                        <input
                            placeholder="Location / Uplink"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.location || ''}
                            onChange={e => setForm({ ...form, location: e.target.value })}
                            required
                        />
                    </div>
                    <textarea
                        placeholder="Mission Briefing..."
                        rows={4}
                        className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                        value={form.description || ''}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 text-[#A1A1AA] hover:text-[#F8FAFC] font-mono text-sm">CANCEL</button>
                        <button type="submit" className="px-3 py-2 bg-[#10B981] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#34D399]">SAVE_MISSION</button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {events.map((event) => (
                    <div key={event.id} className="p-4 bg-[#111113] border border-[#27272A] rounded-sm flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="text-center bg-[#27272A] p-2 rounded-sm w-12">
                                <span className="block text-xs font-bold text-[#F8FAFC]">{new Date(event.event_date).getDate()}</span>
                                <span className="block text-[10px] text-[#A1A1AA] uppercase">{new Date(event.event_date).toLocaleString('default', { month: 'short' })}</span>
                            </div>
                            <div>
                                <h3 className="text-[#F8FAFC] font-mono font-bold text-sm">{event.title}</h3>
                                <div className="text-xs text-[#52525B] font-mono flex items-center gap-3">
                                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</span>
                                    <span className="uppercase border border-[#27272A] px-1 rounded-sm">{event.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => startEdit(event)} className="p-2 text-[#A1A1AA] hover:text-[#F8FAFC]">
                                <Edit2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="p-2 text-[#A1A1AA] hover:text-[#F43F5E]">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
