// app/portal/admin/page.tsx — 8-tab admin panel (premium minimal)
'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Member, Post, PublicEvent, GalleryImage, TeamMember, SiteSettings, ContactMessage } from '@/types/database'

// ─── Helpers ────────────────────────────────
function Section({ children }: { children: React.ReactNode }) {
    return <div className="space-y-4">{children}</div>
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`bg-white rounded-xl p-6 border border-[#E5E7EB] shadow-sm ${className}`}>{children}</div>
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
            <input {...props} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all" />
        </div>
    )
}

function Textarea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <div>
            <label className="block text-sm font-medium text-[#374151] mb-1.5">{label}</label>
            <textarea {...props} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all resize-none" />
        </div>
    )
}

function Btn({ children, variant = 'primary', ...props }: { children: React.ReactNode; variant?: 'primary' | 'outline' | 'danger' | 'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const base = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50'
    const styles = {
        primary: 'bg-[#6366F1] text-white hover:bg-[#4F46E5]',
        outline: 'border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB]',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        ghost: 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F9FAFB]',
    }
    return <button {...props} className={`${base} ${styles[variant]}`}>{children}</button>
}

function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: 'indigo' | 'green' | 'red' | 'amber' | 'gray' }) {
    const styles = {
        indigo: 'bg-indigo-50 text-indigo-600',
        green: 'bg-green-50 text-green-600',
        red: 'bg-red-50 text-red-600',
        amber: 'bg-amber-50 text-amber-600',
        gray: 'bg-gray-100 text-gray-600',
    }
    return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${styles[color]}`}>{children}</span>
}

// ─── Image Upload ────────────────────────────
function ImageUpload({ onUploaded, onRemoved, bucket = 'events' }: { onUploaded: (url: string) => void; onRemoved: () => void; bucket?: string }) {
    const [preview, setPreview] = useState('')
    const [uploading, setUploading] = useState(false)

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setPreview(URL.createObjectURL(file))
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('bucket', bucket)
            const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
            const data = await res.json()
            if (res.ok && data.url) { onUploaded(data.url) }
            else { alert(data.error || 'Upload failed'); setPreview('') }
        } catch { alert('Upload failed'); setPreview('') }
        finally { setUploading(false) }
    }

    return (
        <div>
            <label className="flex items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-[#E5E7EB] hover:border-[#6366F1]/40 transition-colors cursor-pointer bg-[#F9FAFB] relative overflow-hidden">
                {preview ? (
                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                    <div className="text-center">
                        <span className="text-2xl block mb-1">📷</span>
                        <span className="text-xs text-[#9CA3AF]">Click to upload photo</span>
                    </div>
                )}
                {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
            </label>
            {preview && !uploading && (
                <button onClick={() => { setPreview(''); onRemoved() }} className="text-xs text-red-500 hover:text-red-600 mt-1">Remove photo</button>
            )}
        </div>
    )
}

// ─── Tabs ────────────────────────────────────
const TABS = ['Dashboard', 'Members', 'Posts', 'Events', 'Gallery', 'Team', 'Settings', 'Inbox'] as const
type Tab = typeof TABS[number]

export default function AdminPage() {
    const [tab, setTab] = useState<Tab>('Dashboard')
    const [members, setMembers] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [events, setEvents] = useState<PublicEvent[]>([])
    const [gallery, setGallery] = useState<GalleryImage[]>([])
    const [team, setTeam] = useState<TeamMember[]>([])
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [inbox, setInbox] = useState<ContactMessage[]>([])
    const [loading, setLoading] = useState(true)

    const loadAll = useCallback(async () => {
        setLoading(true)
        const [m, p, e, g, t, s, i] = await Promise.all([
            supabase.from('members').select('*').order('created_at', { ascending: false }),
            supabase.from('posts').select('*').order('created_at', { ascending: false }),
            supabase.from('public_events').select('*').order('event_date', { ascending: false }),
            supabase.from('public_gallery').select('*').order('sort_order'),
            supabase.from('team_members').select('*').order('sort_order'),
            supabase.from('site_settings').select('*').eq('id', 'global').single(),
            supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        ])
        setMembers(m.data || [])
        setPosts(p.data || [])
        setEvents(e.data || [])
        setGallery(g.data || [])
        setTeam(t.data || [])
        setSettings(s.data)
        setInbox(i.data || [])
        setLoading(false)
    }, [])

    useEffect(() => { loadAll() }, [loadAll])

    async function api(path: string, method: string, body?: Record<string, unknown>) {
        const res = await fetch(`/api/admin/${path}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
        if (!res.ok) { const d = await res.json(); alert(d.error || 'Error'); return false }
        return true
    }

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold text-[#111827] mb-6">Admin Panel</h1>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 mb-8 bg-[#F3F4F6] rounded-lg p-1">
                {TABS.map((t) => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'bg-white text-[#111827] shadow-sm' : 'text-[#6B7280] hover:text-[#111827]'}`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* ─── Dashboard ─── */}
            {tab === 'Dashboard' && (
                <Section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card><p className="text-sm text-[#6B7280]">Pending Members</p><p className="text-2xl font-bold text-[#111827]">{members.filter(m => m.status === 'pending').length}</p></Card>
                        <Card><p className="text-sm text-[#6B7280]">Total Members</p><p className="text-2xl font-bold text-[#111827]">{members.length}</p></Card>
                        <Card><p className="text-sm text-[#6B7280]">Published Posts</p><p className="text-2xl font-bold text-[#111827]">{posts.filter(p => p.is_public).length}</p></Card>
                        <Card><p className="text-sm text-[#6B7280]">Unread Messages</p><p className="text-2xl font-bold text-[#111827]">{inbox.filter(m => !m.is_read).length}</p></Card>
                    </div>
                </Section>
            )}

            {/* ─── Members ─── */}
            {tab === 'Members' && (
                <Section>
                    {members.map((m) => (
                        <Card key={m.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-[#111827]">{m.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge color={m.status === 'approved' ? 'green' : m.status === 'pending' ? 'amber' : 'red'}>{m.status}</Badge>
                                    <Badge color={m.role === 'admin' ? 'indigo' : 'gray'}>{m.role}</Badge>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {m.status === 'pending' && (
                                    <>
                                        <Btn variant="primary" onClick={async () => { if (await api('members', 'PATCH', { id: m.id, status: 'approved' })) loadAll() }}>Approve</Btn>
                                        <Btn variant="danger" onClick={async () => { if (await api('members', 'PATCH', { id: m.id, status: 'rejected' })) loadAll() }}>Reject</Btn>
                                    </>
                                )}
                                <Btn variant="ghost" onClick={async () => { if (confirm('Remove?') && await api('members', 'DELETE', { id: m.id })) loadAll() }}>Remove</Btn>
                            </div>
                        </Card>
                    ))}
                    {members.length === 0 && <Card className="text-center"><p className="text-[#6B7280] py-4">No members yet.</p></Card>}
                </Section>
            )}

            {/* ─── Posts ─── */}
            {tab === 'Posts' && <PostsTab posts={posts} api={api} reload={loadAll} />}

            {/* ─── Events ─── */}
            {tab === 'Events' && <EventsTab events={events} api={api} reload={loadAll} />}

            {/* ─── Gallery ─── */}
            {tab === 'Gallery' && (
                <Section>
                    <GalleryForm api={api} reload={loadAll} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {gallery.map((img) => (
                            <Card key={img.id} className="p-3">
                                <img src={img.image_url} alt={img.caption || ''} className="w-full h-32 object-cover rounded-lg mb-2" />
                                <p className="text-xs text-[#6B7280] truncate mb-2">{img.caption || 'No caption'}</p>
                                <Btn variant="danger" onClick={async () => { if (await api('gallery', 'DELETE', { id: img.id, image_url: img.image_url })) loadAll() }}>Delete</Btn>
                            </Card>
                        ))}
                    </div>
                </Section>
            )}

            {/* ─── Team ─── */}
            {tab === 'Team' && <TeamTab team={team} api={api} reload={loadAll} />}

            {/* ─── Settings ─── */}
            {tab === 'Settings' && settings && <SettingsTab settings={settings} api={api} reload={loadAll} />}

            {/* ─── Inbox ─── */}
            {tab === 'Inbox' && (
                <Section>
                    {inbox.map((msg) => (
                        <Card key={msg.id}>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-[#111827]">{msg.name}</p>
                                        {!msg.is_read && <Badge color="indigo">New</Badge>}
                                    </div>
                                    <p className="text-sm text-[#6B7280]">{msg.email} · {msg.subject}</p>
                                    <p className="text-sm text-[#374151] mt-2 whitespace-pre-wrap">{msg.message}</p>
                                    <p className="text-xs text-[#9CA3AF] mt-2">{new Date(msg.created_at).toLocaleString()}</p>
                                </div>
                                <div className="flex gap-2 shrink-0 ml-4">
                                    <Btn variant="ghost" onClick={async () => { if (await api('inbox', 'PATCH', { id: msg.id, is_read: !msg.is_read })) loadAll() }}>
                                        {msg.is_read ? 'Unread' : 'Read'}
                                    </Btn>
                                    <Btn variant="danger" onClick={async () => { if (confirm('Delete?') && await api('inbox', 'DELETE', { id: msg.id })) loadAll() }}>Delete</Btn>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {inbox.length === 0 && <Card className="text-center"><p className="text-[#6B7280] py-4">No messages.</p></Card>}
                </Section>
            )}
        </div>
    )
}

// ─── Sub-components ──────────────────────────

function PostsTab({ posts, api, reload }: { posts: Post[]; api: (path: string, method: string, body?: Record<string, unknown>) => Promise<boolean>; reload: () => void }) {
    const [form, setForm] = useState({ title: '', content: '', is_public: true, pinned: false })
    const [creating, setCreating] = useState(false)

    return (
        <Section>
            {!creating ? (
                <Btn onClick={() => setCreating(true)}>+ New Post</Btn>
            ) : (
                <Card>
                    <div className="space-y-3">
                        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <Textarea label="Content" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-[#374151]">
                                <input type="checkbox" checked={form.is_public} onChange={(e) => setForm({ ...form, is_public: e.target.checked })} className="rounded border-gray-300" /> Public
                            </label>
                            <label className="flex items-center gap-2 text-sm text-[#374151]">
                                <input type="checkbox" checked={form.pinned} onChange={(e) => setForm({ ...form, pinned: e.target.checked })} className="rounded border-gray-300" /> Pinned
                            </label>
                        </div>
                        <div className="flex gap-2">
                            <Btn onClick={async () => { if (await api('posts', 'POST', form)) { setCreating(false); setForm({ title: '', content: '', is_public: true, pinned: false }); reload() } }}>Create</Btn>
                            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
                        </div>
                    </div>
                </Card>
            )}
            {posts.map((p) => (
                <Card key={p.id} className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-medium text-[#111827]">{p.title}</h3>
                            {p.pinned && <Badge color="amber">Pinned</Badge>}
                            <Badge color={p.is_public ? 'green' : 'gray'}>{p.is_public ? 'Public' : 'Draft'}</Badge>
                        </div>
                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-2">{p.content}</p>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                        <Btn variant="ghost" onClick={async () => { if (await api('posts', 'PATCH', { id: p.id, pinned: !p.pinned })) reload() }}>{p.pinned ? 'Unpin' : 'Pin'}</Btn>
                        <Btn variant="ghost" onClick={async () => { if (await api('posts', 'PATCH', { id: p.id, is_public: !p.is_public })) reload() }}>{p.is_public ? 'Hide' : 'Publish'}</Btn>
                        <Btn variant="danger" onClick={async () => { if (confirm('Delete?') && await api('posts', 'DELETE', { id: p.id })) reload() }}>Delete</Btn>
                    </div>
                </Card>
            ))}
        </Section>
    )
}

function EventsTab({ events, api, reload }: { events: PublicEvent[]; api: (path: string, method: string, body?: Record<string, unknown>) => Promise<boolean>; reload: () => void }) {
    const [form, setForm] = useState({ title: '', description: '', event_date: '', location: '', type: 'Workshop', image_url: '' })
    const [creating, setCreating] = useState(false)

    return (
        <Section>
            {!creating ? (
                <Btn onClick={() => setCreating(true)}>+ New Event</Btn>
            ) : (
                <Card>
                    <div className="space-y-3">
                        <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <Textarea label="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Date" type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Type</label>
                            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] bg-white">
                                <option value="CTF">CTF</option><option value="Workshop">Workshop</option><option value="Competition">Competition</option><option value="Seminar">Seminar</option><option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Event Photo (optional)</label>
                            <ImageUpload
                                onUploaded={(url) => setForm(f => ({ ...f, image_url: url }))}
                                onRemoved={() => setForm(f => ({ ...f, image_url: '' }))}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Btn onClick={async () => { if (await api('events', 'POST', form)) { setCreating(false); setForm({ title: '', description: '', event_date: '', location: '', type: 'Workshop', image_url: '' }); reload() } }}>Create</Btn>
                            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
                        </div>
                    </div>
                </Card>
            )}
            {events.map((ev) => (
                <Card key={ev.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        {ev.image_url && (
                            <img src={ev.image_url} alt={ev.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                        )}
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-[#111827]">{ev.title}</h3>
                                <Badge color="indigo">{ev.type}</Badge>
                            </div>
                            <p className="text-sm text-[#6B7280] mt-1">{new Date(ev.event_date).toLocaleDateString()} {ev.location && `· ${ev.location}`}</p>
                        </div>
                    </div>
                    <Btn variant="danger" onClick={async () => { if (confirm('Delete?') && await api('events', 'DELETE', { id: ev.id })) reload() }}>Delete</Btn>
                </Card>
            ))}
        </Section>
    )
}

function GalleryForm({ api, reload }: { api: (path: string, method: string, body?: Record<string, unknown>) => Promise<boolean>; reload: () => void }) {
    const [url, setUrl] = useState('')
    const [caption, setCaption] = useState('')
    return (
        <Card>
            <div className="flex gap-3 items-end">
                <div className="flex-1"><Input label="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></div>
                <div className="flex-1"><Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
                <Btn onClick={async () => { if (url && await api('gallery', 'POST', { image_url: url, caption, sort_order: 0 })) { setUrl(''); setCaption(''); reload() } }}>Add</Btn>
            </div>
        </Card>
    )
}

function TeamTab({ team, api, reload }: { team: TeamMember[]; api: (path: string, method: string, body?: Record<string, unknown>) => Promise<boolean>; reload: () => void }) {
    const [form, setForm] = useState({ name: '', role: '', image_url: '', sort_order: 0 })
    const [creating, setCreating] = useState(false)

    return (
        <Section>
            {!creating ? (
                <Btn onClick={() => setCreating(true)}>+ Add Member</Btn>
            ) : (
                <Card>
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            <Input label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                        </div>
                        <Input label="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
                        <div className="flex gap-2">
                            <Btn onClick={async () => { if (form.name && await api('team', 'POST', form)) { setCreating(false); setForm({ name: '', role: '', image_url: '', sort_order: 0 }); reload() } }}>Add</Btn>
                            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
                        </div>
                    </div>
                </Card>
            )}
            {team.map((m) => (
                <Card key={m.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {m.image_url ? (
                            <img src={m.image_url} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#6366F1] font-bold">{m.name.charAt(0)}</div>
                        )}
                        <div>
                            <p className="font-medium text-[#111827]">{m.name}</p>
                            <p className="text-sm text-[#6366F1]">{m.role}</p>
                        </div>
                    </div>
                    <Btn variant="danger" onClick={async () => { if (confirm('Delete?') && await api('team', 'DELETE', { id: m.id })) reload() }}>Delete</Btn>
                </Card>
            ))}
        </Section>
    )
}

function SettingsTab({ settings, api, reload }: { settings: SiteSettings; api: (path: string, method: string, body?: Record<string, unknown>) => Promise<boolean>; reload: () => void }) {
    const [form, setForm] = useState({
        about_text: settings.about_text || '',
        contact_email: settings.contact_email || '',
        stat_members: settings.stat_members || '0',
        stat_events: settings.stat_events || '0',
        stat_competitions: settings.stat_competitions || '0',
        stat_partners: settings.stat_partners || '0',
        instagram_url: settings.instagram_url || '',
        facebook_url: settings.facebook_url || '',
        github_url: settings.github_url || '',
    })

    return (
        <Section>
            <Card>
                <div className="space-y-4">
                    <Textarea label="About Text" rows={4} value={form.about_text} onChange={(e) => setForm({ ...form, about_text: e.target.value })} />
                    <Input label="Contact Email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Input label="Members #" type="number" value={form.stat_members} onChange={(e) => setForm({ ...form, stat_members: e.target.value })} />
                        <Input label="Events #" type="number" value={form.stat_events} onChange={(e) => setForm({ ...form, stat_events: e.target.value })} />
                        <Input label="Competitions #" type="number" value={form.stat_competitions} onChange={(e) => setForm({ ...form, stat_competitions: e.target.value })} />
                        <Input label="Partners #" type="number" value={form.stat_partners} onChange={(e) => setForm({ ...form, stat_partners: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <Input label="Instagram" value={form.instagram_url} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} />
                        <Input label="Facebook" value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} />
                        <Input label="GitHub" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
                    </div>
                    <Btn onClick={async () => { if (await api('settings', 'PATCH', form)) reload() }}>Save Settings</Btn>
                </div>
            </Card>
        </Section>
    )
}
