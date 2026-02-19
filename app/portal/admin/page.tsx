'use client'
// app/portal/admin/page.tsx
// 8-Tab Admin Panel — Stealth Terminal theme.
// Tabs: Dashboard | Members | Posts | Events | Gallery | Team | Settings | Inbox

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Member, Post, PublicEvent, GalleryImage, TeamMember, SiteSettings, ContactMessage } from '@/types/database'

type Tab = 'dashboard' | 'members' | 'posts' | 'events' | 'gallery' | 'team' | 'settings' | 'inbox'

// ─── Helper UI Pieces ────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-4 uppercase">{'>'} {label}</p>
            {children}
        </div>
    )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-[#09090B] border border-[#27272A] rounded-md p-5 ${className}`}>{children}</div>
    )
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
    return (
        <div>
            {label && <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-1">{label}</label>}
            <input
                {...props}
                className="w-full px-3 py-2 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors"
            />
        </div>
    )
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
    return (
        <div>
            {label && <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-1">{label}</label>}
            <textarea
                {...props}
                className="w-full px-3 py-2 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors resize-none"
            />
        </div>
    )
}

function Btn({ variant = 'primary', className = '', children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'ghost' | 'secondary' }) {
    const base = 'px-4 py-2 text-sm font-[var(--font-mono)] rounded-sm transition-all disabled:opacity-50'
    const variants = {
        primary: 'bg-[#10B981] text-black hover:opacity-90',
        danger: 'border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10',
        ghost: 'border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] hover:border-[#A1A1AA]',
        secondary: 'border border-[#10B981] text-[#10B981] hover:bg-[#10B981]/10',
    }
    return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

function Badge({ children, type }: { children: React.ReactNode; type: 'green' | 'yellow' | 'red' | 'cyan' | 'gray' }) {
    const colors = {
        green: 'bg-[#10B981]/10 text-[#10B981]',
        yellow: 'bg-yellow-500/10 text-yellow-400',
        red: 'bg-[#EF4444]/10 text-[#EF4444]',
        cyan: 'bg-[#06B6D4]/10 text-[#06B6D4]',
        gray: 'bg-[#27272A] text-[#A1A1AA]',
    }
    return <span className={`px-2 py-0.5 text-xs font-[var(--font-mono)] rounded-sm ${colors[type]}`}>{children}</span>
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function DashboardTab({ pendingCount, unreadCount }: { pendingCount: number; unreadCount: number }) {
    return (
        <Section label="OVERVIEW">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Pending Members', value: pendingCount, type: 'yellow' as const },
                    { label: 'Unread Messages', value: unreadCount, type: 'red' as const },
                ].map((item, i) => (
                    <Card key={i}>
                        <p className="font-[var(--font-mono)] text-[#A1A1AA] text-xs mb-1">{item.label}</p>
                        <p className={`font-[var(--font-mono)] font-bold text-2xl ${item.type === 'yellow' ? 'text-yellow-400' : 'text-[#EF4444]'}`}>
                            {item.value}
                        </p>
                    </Card>
                ))}
            </div>
            <div className="mt-6 grid md:grid-cols-2 gap-4">
                {[
                    { title: 'Quick Actions', items: ['Approve pending members → Members tab', 'Read new messages → Inbox tab', 'Edit club stats → Settings tab', 'Add team members → Team tab'] },
                    { title: 'Content Management', items: ['Post announcements → Posts tab', 'Add events → Events tab', 'Upload gallery photos → Gallery tab'] },
                ].map((block, bi) => (
                    <Card key={bi}>
                        <p className="font-[var(--font-mono)] text-[#F8FAFC] text-xs font-bold mb-3">{block.title}</p>
                        <ul className="space-y-1">
                            {block.items.map((item, i) => (
                                <li key={i} className="text-[#A1A1AA] text-xs flex gap-2">
                                    <span className="text-[#10B981]">{'>'}</span>{item}
                                </li>
                            ))}
                        </ul>
                    </Card>
                ))}
            </div>
        </Section>
    )
}

// ─── Members Tab ──────────────────────────────────────────────────────────────

function MembersTab({ members, onRefresh }: { members: Member[]; onRefresh: () => void }) {
    const supabaseAdmin = supabase // operations happen via RLS bypass server-side approach; using client here for simplicity

    async function updateStatus(id: string, status: 'approved' | 'rejected') {
        await fetch('/api/admin/members', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
        onRefresh()
    }
    async function removeMember(id: string) {
        if (!confirm('Remove this member permanently?')) return
        await fetch('/api/admin/members', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        onRefresh()
    }

    const pending = members.filter(m => m.status === 'pending')
    const approved = members.filter(m => m.status === 'approved')

    return (
        <div className="space-y-8">
            <Section label={`PENDING_APPROVAL (${pending.length})`}>
                {pending.length === 0 ? (
                    <Card><p className="text-[#A1A1AA] text-sm font-[var(--font-mono)]">{'>'} NO_PENDING_MEMBERS</p></Card>
                ) : (
                    <div className="space-y-2">
                        {pending.map(m => (
                            <Card key={m.id} className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-[var(--font-mono)] text-[#F8FAFC] text-sm">{m.name || 'No Name'}</p>
                                    <p className="text-[#A1A1AA] text-xs">{m.email}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Btn variant="primary" onClick={() => updateStatus(m.id, 'approved')}>Approve</Btn>
                                    <Btn variant="danger" onClick={() => updateStatus(m.id, 'rejected')}>Reject</Btn>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </Section>
            <Section label={`ALL_MEMBERS (${approved.length})`}>
                <div className="space-y-2">
                    {approved.map(m => (
                        <Card key={m.id} className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-sm bg-[#10B981] flex items-center justify-center text-black font-[var(--font-mono)] font-bold text-xs">
                                    {(m.name || m.email).slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-[var(--font-mono)] text-[#F8FAFC] text-sm">{m.name || 'No Name'}</p>
                                    <p className="text-[#A1A1AA] text-xs">{m.email}</p>
                                </div>
                                <Badge type={m.role === 'admin' ? 'cyan' : 'green'}>{m.role}</Badge>
                            </div>
                            <Btn variant="danger" onClick={() => removeMember(m.id)}>Remove</Btn>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ─── Posts Tab ────────────────────────────────────────────────────────────────

function PostsTab({ posts, onRefresh }: { posts: Post[]; onRefresh: () => void }) {
    const [form, setForm] = useState({ title: '', content: '', is_public: false, pinned: false })
    const [editing, setEditing] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    async function save() {
        setSaving(true)
        if (editing) {
            await fetch('/api/admin/posts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) })
        } else {
            await fetch('/api/admin/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        }
        setSaving(false); setForm({ title: '', content: '', is_public: false, pinned: false }); setEditing(null); onRefresh()
    }
    function startEdit(p: Post) {
        setEditing(p.id); setForm({ title: p.title, content: p.content, is_public: p.is_public, pinned: p.pinned })
    }
    async function del(id: string) {
        if (!confirm('Delete this post?')) return
        await fetch('/api/admin/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        onRefresh()
    }
    async function toggle(id: string, field: 'pinned' | 'is_public', val: boolean) {
        await fetch('/api/admin/posts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, [field]: !val }) })
        onRefresh()
    }

    return (
        <div className="space-y-8">
            <Section label={editing ? 'EDIT_POST' : 'NEW_POST'}>
                <Card className="space-y-4">
                    <Input label="TITLE" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post title" />
                    <Textarea label="CONTENT" rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Post content..." />
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-[#A1A1AA] cursor-pointer">
                            <input type="checkbox" className="rounded-sm" checked={form.is_public} onChange={e => setForm({ ...form, is_public: e.target.checked })} />
                            <span className="font-[var(--font-mono)] text-xs">PUBLIC</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm text-[#A1A1AA] cursor-pointer">
                            <input type="checkbox" className="rounded-sm" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
                            <span className="font-[var(--font-mono)] text-xs">PINNED</span>
                        </label>
                    </div>
                    <div className="flex gap-3">
                        <Btn variant="primary" onClick={save} disabled={saving || !form.title || !form.content}>{saving ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}</Btn>
                        {editing && <Btn variant="ghost" onClick={() => { setEditing(null); setForm({ title: '', content: '', is_public: false, pinned: false }) }}>Cancel</Btn>}
                    </div>
                </Card>
            </Section>
            <Section label="ALL_POSTS">
                <div className="space-y-2">
                    {posts.map(p => (
                        <Card key={p.id} className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-[var(--font-mono)] text-[#F8FAFC] text-sm truncate">{p.title}</p>
                                    {p.pinned && <Badge type="yellow">PINNED</Badge>}
                                    <Badge type={p.is_public ? 'green' : 'gray'}>{p.is_public ? 'PUBLIC' : 'MEMBERS'}</Badge>
                                </div>
                                <p className="text-[#A1A1AA] text-xs">{p.content.slice(0, 80)}...</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <Btn variant="ghost" onClick={() => toggle(p.id, 'pinned', p.pinned)}>{p.pinned ? 'Unpin' : 'Pin'}</Btn>
                                <Btn variant="ghost" onClick={() => toggle(p.id, 'is_public', p.is_public)}>{p.is_public ? 'Hide' : 'Publish'}</Btn>
                                <Btn variant="secondary" onClick={() => startEdit(p)}>Edit</Btn>
                                <Btn variant="danger" onClick={() => del(p.id)}>Del</Btn>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ─── Events Tab ───────────────────────────────────────────────────────────────

function EventsTab({ events, onRefresh }: { events: PublicEvent[]; onRefresh: () => void }) {
    const [form, setForm] = useState({ title: '', event_date: '', location: '', description: '', type: 'Workshop' as PublicEvent['type'], status: 'upcoming' as PublicEvent['status'] })
    const [editing, setEditing] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    async function save() {
        setSaving(true)
        if (editing) {
            await fetch('/api/admin/events', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) })
        } else {
            await fetch('/api/admin/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        }
        setSaving(false); setEditing(null); onRefresh()
        setForm({ title: '', event_date: '', location: '', description: '', type: 'Workshop', status: 'upcoming' })
    }
    function startEdit(e: PublicEvent) {
        setEditing(e.id); setForm({ title: e.title, event_date: e.event_date.slice(0, 10), location: e.location || '', description: e.description || '', type: e.type, status: e.status })
    }
    async function del(id: string) {
        if (!confirm('Delete event?')) return
        await fetch('/api/admin/events', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        onRefresh()
    }

    return (
        <div className="space-y-8">
            <Section label={editing ? 'EDIT_EVENT' : 'NEW_EVENT'}>
                <Card className="grid md:grid-cols-2 gap-4">
                    <Input label="TITLE" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event name" />
                    <Input label="DATE" type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} />
                    <Input label="LOCATION" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="IIMS College, Kathmandu" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-1">TYPE</label>
                            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as PublicEvent['type'] })} className="w-full px-3 py-2 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]">
                                {['Workshop', 'CTF', 'Seminar', 'Competition', 'Other'].map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-1">STATUS</label>
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as PublicEvent['status'] })} className="w-full px-3 py-2 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981]">
                                <option value="upcoming">Upcoming</option>
                                <option value="past">Past</option>
                            </select>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <Textarea label="DESCRIPTION" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Event description" />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                        <Btn variant="primary" onClick={save} disabled={saving || !form.title || !form.event_date}>{saving ? 'Saving...' : editing ? 'Update Event' : 'Add Event'}</Btn>
                        {editing && <Btn variant="ghost" onClick={() => { setEditing(null); setForm({ title: '', event_date: '', location: '', description: '', type: 'Workshop', status: 'upcoming' }) }}>Cancel</Btn>}
                    </div>
                </Card>
            </Section>
            <Section label="ALL_EVENTS">
                <div className="space-y-2">
                    {events.map(ev => (
                        <Card key={ev.id} className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-[var(--font-mono)] text-[#F8FAFC] text-sm">{ev.title}</p>
                                    <Badge type={ev.status === 'upcoming' ? 'green' : 'gray'}>{ev.status}</Badge>
                                    <Badge type="cyan">{ev.type}</Badge>
                                </div>
                                <p className="text-[#A1A1AA] text-xs">{new Date(ev.event_date).toLocaleDateString()} · {ev.location}</p>
                            </div>
                            <div className="flex gap-2">
                                <Btn variant="secondary" onClick={() => startEdit(ev)}>Edit</Btn>
                                <Btn variant="danger" onClick={() => del(ev.id)}>Del</Btn>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────

function GalleryTab({ gallery, onRefresh }: { gallery: GalleryImage[]; onRefresh: () => void }) {
    const [uploading, setUploading] = useState(false)
    const [editingCaption, setEditingCaption] = useState<string | null>(null)
    const [caption, setCaption] = useState('')

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return
        setUploading(true)
        const ext = file.name.split('.').pop()
        const path = `gallery/${Date.now()}.${ext}`
        const { data, error } = await supabase.storage.from('gallery').upload(path, file, { upsert: true })
        if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)
            await fetch('/api/admin/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image_url: publicUrl, caption: '', sort_order: gallery.length }) })
            onRefresh()
        }
        setUploading(false)
    }
    async function saveCaption(id: string) {
        await fetch('/api/admin/gallery', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, caption }) })
        setEditingCaption(null); onRefresh()
    }
    async function del(id: string, image_url: string) {
        if (!confirm('Delete this image?')) return
        await fetch('/api/admin/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, image_url }) })
        onRefresh()
    }

    return (
        <div className="space-y-8">
            <Section label="UPLOAD_IMAGE">
                <Card>
                    <label className={`flex items-center justify-center w-full h-32 border-2 border-dashed border-[#27272A] rounded-sm cursor-pointer hover:border-[#10B981] transition-colors ${uploading ? 'opacity-50' : ''}`}>
                        <div className="text-center">
                            <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-1">{uploading ? '> UPLOADING...' : '> CLICK_TO_UPLOAD'}</p>
                            <p className="text-[#A1A1AA] text-xs">JPG / PNG / WebP</p>
                        </div>
                        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                    </label>
                </Card>
            </Section>
            <Section label={`GALLERY (${gallery.length})`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map(img => (
                        <div key={img.id} className="bg-[#09090B] border border-[#27272A] rounded-md overflow-hidden">
                            <img src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-36 object-cover" />
                            <div className="p-3 space-y-2">
                                {editingCaption === img.id ? (
                                    <div className="flex gap-2">
                                        <input value={caption} onChange={e => setCaption(e.target.value)} className="flex-1 px-2 py-1 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-xs focus:outline-none focus:border-[#10B981]" />
                                        <Btn variant="primary" onClick={() => saveCaption(img.id)}>✓</Btn>
                                    </div>
                                ) : (
                                    <p className="text-[#A1A1AA] text-xs cursor-pointer hover:text-[#F8FAFC]" onClick={() => { setEditingCaption(img.id); setCaption(img.caption || '') }}>
                                        {img.caption || '+ caption'}
                                    </p>
                                )}
                                <Btn variant="danger" onClick={() => del(img.id, img.image_url)} className="w-full text-xs">Delete</Btn>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────

function TeamTab({ team, onRefresh }: { team: TeamMember[]; onRefresh: () => void }) {
    const [form, setForm] = useState({ name: '', role: '', image_url: '' })
    const [editing, setEditing] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; if (!file) return
        setUploading(true)
        const path = `avatars/${Date.now()}.${file.name.split('.').pop()}`
        const { data, error } = await supabase.storage.from('team-avatars').upload(path, file, { upsert: true })
        if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from('team-avatars').getPublicUrl(path)
            setForm(f => ({ ...f, image_url: publicUrl }))
        }
        setUploading(false)
    }
    async function save() {
        setSaving(true)
        if (editing) {
            await fetch('/api/admin/team', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editing, ...form }) })
        } else {
            await fetch('/api/admin/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, sort_order: team.length }) })
        }
        setSaving(false); setEditing(null); setForm({ name: '', role: '', image_url: '' }); onRefresh()
    }
    async function del(id: string) {
        if (!confirm('Remove team member?')) return
        await fetch('/api/admin/team', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        onRefresh()
    }

    return (
        <div className="space-y-8">
            <Section label={editing ? 'EDIT_MEMBER' : 'ADD_MEMBER'}>
                <Card className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input label="NAME" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                        <Input label="ROLE" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="President, Treasurer..." />
                    </div>
                    <div>
                        <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-1">AVATAR</label>
                        <div className="flex items-center gap-4">
                            {form.image_url && <img src={form.image_url} alt="Preview" className="w-10 h-10 rounded-sm object-cover" />}
                            <label className="px-4 py-2 border border-[#27272A] rounded-sm text-[#A1A1AA] text-sm cursor-pointer hover:border-[#10B981] transition-colors">
                                {uploading ? 'Uploading...' : 'Upload Avatar'}
                                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
                            </label>
                            {form.image_url && <button className="text-[#EF4444] text-xs" onClick={() => setForm({ ...form, image_url: '' })}>Remove</button>}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Btn variant="primary" onClick={save} disabled={saving || !form.name || !form.role}>{saving ? 'Saving...' : editing ? 'Update' : 'Add Member'}</Btn>
                        {editing && <Btn variant="ghost" onClick={() => { setEditing(null); setForm({ name: '', role: '', image_url: '' }) }}>Cancel</Btn>}
                    </div>
                </Card>
            </Section>
            <Section label={`TEAM (${team.length})`}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {team.map(m => (
                        <Card key={m.id} className="text-center">
                            <div className="w-12 h-12 mx-auto rounded-sm bg-[#10B981] flex items-center justify-center mb-3">
                                {m.image_url ? <img src={m.image_url} alt={m.name} className="w-full h-full object-cover rounded-sm" /> : <span className="font-[var(--font-mono)] font-bold text-black">{m.name.slice(0, 2).toUpperCase()}</span>}
                            </div>
                            <p className="font-[var(--font-mono)] text-[#F8FAFC] text-xs font-bold mb-1">{m.name}</p>
                            <p className="text-[#10B981] text-xs mb-3">{m.role}</p>
                            <div className="flex gap-2 justify-center">
                                <Btn variant="ghost" className="text-xs px-2 py-1" onClick={() => { setEditing(m.id); setForm({ name: m.name, role: m.role, image_url: m.image_url || '' }) }}>Edit</Btn>
                                <Btn variant="danger" className="text-xs px-2 py-1" onClick={() => del(m.id)}>Del</Btn>
                            </div>
                        </Card>
                    ))}
                </div>
            </Section>
        </div>
    )
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ settings, onRefresh }: { settings: SiteSettings | null; onRefresh: () => void }) {
    const [form, setForm] = useState({
        about_text: settings?.about_text || '',
        stat_members: settings?.stat_members || '50+',
        stat_events: settings?.stat_events || '15+',
        stat_competitions: settings?.stat_competitions || '5+',
        stat_partners: settings?.stat_partners || '3+',
        contact_email: settings?.contact_email || '',
        instagram_url: settings?.instagram_url || '',
        facebook_url: settings?.facebook_url || '',
        github_url: settings?.github_url || '',
    })
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    async function save() {
        setSaving(true)
        await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
        setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 3000); onRefresh()
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <Section label="ABOUT_TEXT">
                <Card>
                    <Textarea label="ABOUT" rows={5} value={form.about_text} onChange={e => setForm({ ...form, about_text: e.target.value })} placeholder="Club about text (shown on homepage and about page)" />
                </Card>
            </Section>
            <Section label="STATS">
                <Card className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {([['stat_members', 'MEMBERS'], ['stat_events', 'EVENTS'], ['stat_competitions', 'COMPETITIONS'], ['stat_partners', 'PARTNERS']] as const).map(([key, lbl]) => (
                        <Input key={key} label={lbl} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder="50+" />
                    ))}
                </Card>
            </Section>
            <Section label="CONTACT_INFO">
                <Card className="space-y-4">
                    <Input label="EMAIL" type="email" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} placeholder="cybersec@iimscollege.edu.np" />
                    <Input label="INSTAGRAM_URL" value={form.instagram_url} onChange={e => setForm({ ...form, instagram_url: e.target.value })} placeholder="https://instagram.com/..." />
                    <Input label="FACEBOOK_URL" value={form.facebook_url} onChange={e => setForm({ ...form, facebook_url: e.target.value })} placeholder="https://facebook.com/..." />
                    <Input label="GITHUB_URL" value={form.github_url} onChange={e => setForm({ ...form, github_url: e.target.value })} placeholder="https://github.com/..." />
                </Card>
            </Section>
            <div className="flex items-center gap-4">
                <Btn variant="primary" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Btn>
                {saved && <p className="font-[var(--font-mono)] text-[#10B981] text-sm">{'>'} SETTINGS_SAVED</p>}
            </div>
        </div>
    )
}

// ─── Inbox Tab ────────────────────────────────────────────────────────────────

function InboxTab({ messages, onRefresh }: { messages: ContactMessage[]; onRefresh: () => void }) {
    const [expanded, setExpanded] = useState<string | null>(null)

    async function markRead(id: string, is_read: boolean) {
        await fetch('/api/admin/inbox', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_read: !is_read }) })
        onRefresh()
    }
    async function del(id: string) {
        if (!confirm('Delete message?')) return
        await fetch('/api/admin/inbox', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
        onRefresh()
    }

    return (
        <Section label={`INBOX (${messages.filter(m => !m.is_read).length} unread)`}>
            {messages.length === 0 ? (
                <Card><p className="font-[var(--font-mono)] text-[#A1A1AA] text-sm">{'>'} INBOX_EMPTY</p></Card>
            ) : (
                <div className="space-y-2">
                    {messages.map(msg => (
                        <div key={msg.id} className={`bg-[#09090B] border rounded-md overflow-hidden transition-colors ${msg.is_read ? 'border-[#27272A]' : 'border-[#10B981]/30'}`}>
                            <div className="flex items-center justify-between gap-4 p-4 cursor-pointer" onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}>
                                <div className="flex items-center gap-3">
                                    {!msg.is_read && <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />}
                                    <div>
                                        <p className="font-[var(--font-mono)] text-[#F8FAFC] text-sm">{msg.name} <span className="text-[#A1A1AA] text-xs">— {msg.email}</span></p>
                                        <p className="text-[#A1A1AA] text-xs">{msg.subject}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className="text-[#A1A1AA] text-xs">{new Date(msg.created_at).toLocaleDateString()}</span>
                                    <span className="text-[#A1A1AA]">{expanded === msg.id ? '▲' : '▼'}</span>
                                </div>
                            </div>
                            {expanded === msg.id && (
                                <div className="px-4 pb-4 border-t border-[#27272A] pt-3 space-y-3">
                                    <p className="text-[#A1A1AA] text-sm whitespace-pre-wrap">{msg.message}</p>
                                    <div className="flex gap-2">
                                        <Btn variant="ghost" onClick={() => markRead(msg.id, msg.is_read)}>{msg.is_read ? 'Mark Unread' : 'Mark Read'}</Btn>
                                        <a href={`mailto:${msg.email}?subject=Re: ${msg.subject}`} className="px-4 py-2 text-sm font-[var(--font-mono)] border border-[#06B6D4] text-[#06B6D4] rounded-sm hover:bg-[#06B6D4]/10 transition-colors">Reply</a>
                                        <Btn variant="danger" onClick={() => del(msg.id)}>Delete</Btn>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Section>
    )
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<Tab>('dashboard')
    const [loading, setLoading] = useState(true)

    // Data state
    const [members, setMembers] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [events, setEvents] = useState<PublicEvent[]>([])
    const [gallery, setGallery] = useState<GalleryImage[]>([])
    const [team, setTeam] = useState<TeamMember[]>([])
    const [settings, setSettings] = useState<SiteSettings | null>(null)
    const [messages, setMessages] = useState<ContactMessage[]>([])

    const fetchAll = useCallback(async () => {
        const [membersRes, postsRes, eventsRes, galleryRes, teamRes, settingsRes, messagesRes] = await Promise.all([
            supabase.from('members').select('*').order('created_at', { ascending: false }),
            supabase.from('posts').select('*').order('created_at', { ascending: false }),
            supabase.from('public_events').select('*').order('event_date', { ascending: false }),
            supabase.from('public_gallery').select('*').order('sort_order', { ascending: true }),
            supabase.from('team_members').select('*').order('sort_order', { ascending: true }),
            supabase.from('site_settings').select('*').eq('id', 'global').single(),
            supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        ])
        setMembers((membersRes.data as Member[]) || [])
        setPosts((postsRes.data as Post[]) || [])
        setEvents((eventsRes.data as PublicEvent[]) || [])
        setGallery((galleryRes.data as GalleryImage[]) || [])
        setTeam((teamRes.data as TeamMember[]) || [])
        setSettings(settingsRes.data as SiteSettings | null)
        setMessages((messagesRes.data as ContactMessage[]) || [])
        setLoading(false)
    }, [])

    useEffect(() => {
        // Check admin
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) { router.push('/portal/login'); return }
            supabase.from('members').select('role').eq('id', session.user.id).single().then(({ data }) => {
                if (data?.role !== 'admin') { router.push('/portal/dashboard'); return }
                fetchAll()
            })
        })
    }, [fetchAll, router])

    const pendingCount = members.filter(m => m.status === 'pending').length
    const unreadCount = messages.filter(m => !m.is_read).length

    const tabs: { key: Tab; label: string; count?: number }[] = [
        { key: 'dashboard', label: 'Dashboard' },
        { key: 'members', label: 'Members', count: pendingCount },
        { key: 'posts', label: 'Posts' },
        { key: 'events', label: 'Events' },
        { key: 'gallery', label: 'Gallery' },
        { key: 'team', label: 'Team' },
        { key: 'settings', label: 'Settings' },
        { key: 'inbox', label: 'Inbox', count: unreadCount },
    ]

    if (loading) {
        return (
            <div className="flex items-center gap-3 p-8">
                <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                <p className="font-[var(--font-mono)] text-[#A1A1AA] text-sm">Loading admin data...</p>
            </div>
        )
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-1">// admin_panel</p>
                <h1 className="font-[var(--font-mono)] font-bold text-3xl text-[#F8FAFC]">Control Center</h1>
            </div>

            {/* Tab bar */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-[#27272A] pb-3">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-[var(--font-mono)] rounded-sm transition-all duration-200 flex items-center gap-2 ${activeTab === tab.key
                                ? 'bg-[#10B981] text-black font-bold'
                                : 'border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] hover:border-[#A1A1AA]'
                            }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className="px-1.5 py-0.5 bg-[#EF4444] text-white text-xs rounded-sm">{tab.count}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div>
                {activeTab === 'dashboard' && <DashboardTab pendingCount={pendingCount} unreadCount={unreadCount} />}
                {activeTab === 'members' && <MembersTab members={members} onRefresh={fetchAll} />}
                {activeTab === 'posts' && <PostsTab posts={posts} onRefresh={fetchAll} />}
                {activeTab === 'events' && <EventsTab events={events} onRefresh={fetchAll} />}
                {activeTab === 'gallery' && <GalleryTab gallery={gallery} onRefresh={fetchAll} />}
                {activeTab === 'team' && <TeamTab team={team} onRefresh={fetchAll} />}
                {activeTab === 'settings' && <SettingsTab settings={settings} onRefresh={fetchAll} />}
                {activeTab === 'inbox' && <InboxTab messages={messages} onRefresh={fetchAll} />}
            </div>
        </div>
    )
}
