// app/portal/admin/page.tsx
// 5-tab admin panel — Cyber Blue Matrix themed.
// Tabs: Members, Posts, Public Announcements, Events Manager, Gallery Manager

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Member, Post, PublicEvent, GalleryImage } from '@/types/database'

type Tab = 'members' | 'posts' | 'announcements' | 'events' | 'gallery'

export default function AdminPage() {
    const [checking, setChecking] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [activeTab, setActiveTab] = useState<Tab>('members')

    // Data states
    const [members, setMembers] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [events, setEvents] = useState<PublicEvent[]>([])
    const [gallery, setGallery] = useState<GalleryImage[]>([])

    // Event form
    const [showEventForm, setShowEventForm] = useState(false)
    const [eventForm, setEventForm] = useState({ title: '', event_date: '', location: '', description: '', type: 'Workshop', status: 'upcoming' })

    // Gallery form
    const [galleryCaption, setGalleryCaption] = useState('')
    const [galleryFile, setGalleryFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    // Admin check
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) { window.location.href = '/portal/dashboard'; return }
                const { data: member } = await supabase.from('members').select('role, status').eq('id', session.user.id).single()
                if (!member || member.role !== 'admin' || member.status !== 'approved') {
                    window.location.href = '/portal/dashboard'; return
                }
                setIsAdmin(true)
            } catch { window.location.href = '/portal/dashboard' }
            finally { setChecking(false) }
        }
        checkAdmin()
    }, [])

    // Fetch data
    const fetchMembers = useCallback(async () => {
        const { data } = await supabase.from('members').select('*').order('created_at', { ascending: false })
        if (data) setMembers(data)
    }, [])

    const fetchPosts = useCallback(async () => {
        const { data } = await supabase.from('posts').select('*, members(name, email)').order('created_at', { ascending: false })
        if (data) setPosts(data)
    }, [])

    const fetchEvents = useCallback(async () => {
        const { data } = await supabase.from('public_events').select('*').order('event_date', { ascending: false })
        if (data) setEvents(data)
    }, [])

    const fetchGallery = useCallback(async () => {
        const { data } = await supabase.from('public_gallery').select('*').order('sort_order', { ascending: true })
        if (data) setGallery(data)
    }, [])

    useEffect(() => {
        if (!isAdmin) return
        fetchMembers(); fetchPosts(); fetchEvents(); fetchGallery()
    }, [isAdmin, fetchMembers, fetchPosts, fetchEvents, fetchGallery])

    // Member actions
    async function updateMemberStatus(id: string, status: string) {
        await supabase.from('members').update({ status }).eq('id', id)
        fetchMembers()
    }

    // Post actions
    async function togglePin(id: string, pinned: boolean) {
        await supabase.from('posts').update({ pinned: !pinned }).eq('id', id)
        fetchPosts()
    }
    async function togglePublic(id: string, isPublic: boolean) {
        await supabase.from('posts').update({ is_public: !isPublic }).eq('id', id)
        fetchPosts()
    }
    async function deletePost(id: string) {
        await supabase.from('posts').delete().eq('id', id)
        fetchPosts()
    }

    // Event actions
    async function addEvent() {
        if (!eventForm.title || !eventForm.event_date) return
        await supabase.from('public_events').insert(eventForm)
        setEventForm({ title: '', event_date: '', location: '', description: '', type: 'Workshop', status: 'upcoming' })
        setShowEventForm(false)
        fetchEvents()
    }
    async function toggleEventStatus(id: string, status: string) {
        await supabase.from('public_events').update({ status: status === 'upcoming' ? 'past' : 'upcoming' }).eq('id', id)
        fetchEvents()
    }
    async function deleteEvent(id: string) {
        await supabase.from('public_events').delete().eq('id', id)
        fetchEvents()
    }

    // Gallery actions
    async function uploadGalleryImage() {
        if (!galleryFile) return
        setUploading(true)
        try {
            const ext = galleryFile.name.split('.').pop()
            const fileName = `${Date.now()}.${ext}`
            const { error: uploadError } = await supabase.storage.from('public-gallery').upload(fileName, galleryFile)
            if (uploadError) throw uploadError
            const { data: urlData } = supabase.storage.from('public-gallery').getPublicUrl(fileName)
            await supabase.from('public_gallery').insert({
                image_url: urlData.publicUrl,
                caption: galleryCaption || null,
                sort_order: gallery.length,
            })
            setGalleryCaption('')
            setGalleryFile(null)
            fetchGallery()
        } catch (err) { console.error('Upload error:', err) }
        finally { setUploading(false) }
    }
    async function deleteGalleryImage(id: string, url: string) {
        // Delete from storage
        const path = url.split('/public-gallery/')[1]
        if (path) await supabase.storage.from('public-gallery').remove([path])
        await supabase.from('public_gallery').delete().eq('id', id)
        fetchGallery()
    }

    if (checking) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#00B4FF] border-t-transparent rounded-full animate-spin" />
        </div>
    )
    if (!isAdmin) return null

    const tabs: { key: Tab; label: string }[] = [
        { key: 'members', label: 'Members' },
        { key: 'posts', label: 'Posts' },
        { key: 'announcements', label: 'Announcements' },
        { key: 'events', label: 'Events' },
        { key: 'gallery', label: 'Gallery' },
    ]

    const pendingCount = members.filter(m => m.status === 'pending').length
    const publicPosts = posts.filter(p => p.is_public)

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-1">// Admin Panel</p>
                <h1 className="font-[var(--font-orbitron)] font-bold text-2xl text-white">Control Center</h1>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 text-sm font-[var(--font-mono)] rounded-lg transition-all duration-300 ${activeTab === tab.key
                                ? 'bg-[#00B4FF] text-[#0D0D0D] font-bold shadow-[0_0_15px_rgba(0,180,255,0.3)]'
                                : 'text-[#8892A4] glass hover:text-[#00B4FF]'
                            }`}
                    >
                        {tab.label}
                        {tab.key === 'members' && pendingCount > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 bg-[#FF3B3B] text-white text-xs rounded-full">{pendingCount}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* ===== TAB 1: MEMBERS ===== */}
            {activeTab === 'members' && (
                <div className="space-y-3">
                    {members.map((m) => (
                        <div key={m.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-white font-medium text-sm">{m.name || m.email}</p>
                                <p className="text-[#8892A4] text-xs font-[var(--font-mono)]">{m.email}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${m.status === 'approved' ? 'bg-[#00FF9C]/20 text-[#00FF9C]' :
                                            m.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-[#FF3B3B]/20 text-[#FF3B3B]'
                                        }`}>{m.status}</span>
                                    <span className="text-xs text-[#8892A4]">{m.role}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {m.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateMemberStatus(m.id, 'approved')} className="px-3 py-1.5 text-xs font-bold bg-[#00FF9C] text-[#0D0D0D] rounded-lg hover:opacity-80 transition-opacity">Approve</button>
                                        <button onClick={() => updateMemberStatus(m.id, 'rejected')} className="px-3 py-1.5 text-xs font-bold bg-[#FF3B3B] text-white rounded-lg hover:opacity-80 transition-opacity">Reject</button>
                                    </>
                                )}
                                {m.status === 'approved' && (
                                    <button onClick={() => updateMemberStatus(m.id, 'rejected')} className="px-3 py-1.5 text-xs text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-lg hover:bg-[#FF3B3B]/10 transition-colors">Remove</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {members.length === 0 && <p className="text-[#8892A4] text-center py-10 font-[var(--font-exo2)]">No members yet.</p>}
                </div>
            )}

            {/* ===== TAB 2: POSTS ===== */}
            {activeTab === 'posts' && (
                <div className="space-y-3">
                    {posts.map((p) => (
                        <div key={p.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-white font-medium text-sm">{p.title}</p>
                                    {p.pinned && <span className="text-xs px-2 py-0.5 rounded-full bg-[#00B4FF]/20 text-[#00B4FF]">📌 Pinned</span>}
                                    {p.is_public && <span className="text-xs px-2 py-0.5 rounded-full bg-[#00FF9C]/20 text-[#00FF9C]">🌐 Public</span>}
                                </div>
                                <p className="text-[#8892A4] text-xs font-[var(--font-mono)]">By {p.members?.name || p.members?.email || 'Unknown'}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => togglePin(p.id, p.pinned)} className="px-3 py-1.5 text-xs text-[#00B4FF] border border-[#00B4FF]/30 rounded-lg hover:bg-[#00B4FF]/10 transition-colors">
                                    {p.pinned ? 'Unpin' : 'Pin'}
                                </button>
                                <button onClick={() => togglePublic(p.id, p.is_public)} className="px-3 py-1.5 text-xs text-[#00FF9C] border border-[#00FF9C]/30 rounded-lg hover:bg-[#00FF9C]/10 transition-colors">
                                    {p.is_public ? 'Hide' : 'Publish'}
                                </button>
                                <button onClick={() => deletePost(p.id)} className="px-3 py-1.5 text-xs text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-lg hover:bg-[#FF3B3B]/10 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && <p className="text-[#8892A4] text-center py-10 font-[var(--font-exo2)]">No posts yet.</p>}
                </div>
            )}

            {/* ===== TAB 3: PUBLIC ANNOUNCEMENTS ===== */}
            {activeTab === 'announcements' && (
                <div className="space-y-3">
                    <p className="text-[#8892A4] text-sm font-[var(--font-exo2)] mb-4">Posts marked as public appear on the club website.</p>
                    {publicPosts.map((p) => (
                        <div key={p.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <p className="text-white font-medium text-sm">{p.title}</p>
                                <p className="text-[#8892A4] text-xs font-[var(--font-mono)]">{new Date(p.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => togglePublic(p.id, true)} className="px-3 py-1.5 text-xs text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/10 transition-colors">Unpublish</button>
                                <button onClick={() => deletePost(p.id)} className="px-3 py-1.5 text-xs text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-lg hover:bg-[#FF3B3B]/10 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                    {publicPosts.length === 0 && <p className="text-[#8892A4] text-center py-10 font-[var(--font-exo2)]">No public announcements. Go to Posts tab and click &quot;Publish&quot; on any post.</p>}
                </div>
            )}

            {/* ===== TAB 4: EVENTS MANAGER ===== */}
            {activeTab === 'events' && (
                <div className="space-y-4">
                    <button onClick={() => setShowEventForm(!showEventForm)} className="px-5 py-2.5 text-sm font-bold bg-[#00B4FF] text-[#0D0D0D] rounded-lg hover:bg-[#00FF9C] transition-all duration-300">
                        {showEventForm ? 'Cancel' : '+ Add Event'}
                    </button>

                    {/* Add event form */}
                    {showEventForm && (
                        <div className="glass rounded-xl p-6 space-y-4">
                            <input type="text" placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] transition-all" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="datetime-local" value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00B4FF] transition-all" />
                                <input type="text" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] transition-all" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00B4FF] transition-all">
                                    <option value="Workshop" className="bg-[#0D0D0D]">Workshop</option>
                                    <option value="CTF" className="bg-[#0D0D0D]">CTF</option>
                                    <option value="Seminar" className="bg-[#0D0D0D]">Seminar</option>
                                    <option value="Competition" className="bg-[#0D0D0D]">Competition</option>
                                    <option value="Other" className="bg-[#0D0D0D]">Other</option>
                                </select>
                                <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00B4FF] transition-all">
                                    <option value="upcoming" className="bg-[#0D0D0D]">Upcoming</option>
                                    <option value="past" className="bg-[#0D0D0D]">Past</option>
                                </select>
                            </div>
                            <textarea rows={3} placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] transition-all resize-none" />
                            <button onClick={addEvent} className="px-5 py-2.5 text-sm font-bold bg-[#00FF9C] text-[#0D0D0D] rounded-lg hover:opacity-80 transition-opacity">Save Event</button>
                        </div>
                    )}

                    {/* Events list */}
                    {events.map((ev) => (
                        <div key={ev.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-white font-medium text-sm">{ev.title}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${ev.status === 'upcoming' ? 'bg-[#00FF9C]/20 text-[#00FF9C]' : 'bg-white/10 text-[#8892A4]'}`}>
                                        {ev.status}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${ev.type === 'CTF' ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]' :
                                            ev.type === 'Workshop' ? 'bg-[#00B4FF]/20 text-[#00B4FF]' :
                                                'bg-[#00FF9C]/20 text-[#00FF9C]'
                                        }`}>{ev.type}</span>
                                </div>
                                <p className="text-[#8892A4] text-xs font-[var(--font-mono)]">
                                    {new Date(ev.event_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    {ev.location && ` · ${ev.location}`}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => toggleEventStatus(ev.id, ev.status)} className="px-3 py-1.5 text-xs text-[#00B4FF] border border-[#00B4FF]/30 rounded-lg hover:bg-[#00B4FF]/10 transition-colors">
                                    {ev.status === 'upcoming' ? 'Mark Past' : 'Mark Upcoming'}
                                </button>
                                <button onClick={() => deleteEvent(ev.id)} className="px-3 py-1.5 text-xs text-[#FF3B3B] border border-[#FF3B3B]/30 rounded-lg hover:bg-[#FF3B3B]/10 transition-colors">Delete</button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && <p className="text-[#8892A4] text-center py-10 font-[var(--font-exo2)]">No events created yet. Click &quot;+ Add Event&quot; to create one.</p>}
                </div>
            )}

            {/* ===== TAB 5: GALLERY MANAGER ===== */}
            {activeTab === 'gallery' && (
                <div className="space-y-4">
                    {/* Upload form */}
                    <div className="glass rounded-xl p-6">
                        <h3 className="font-[var(--font-orbitron)] font-bold text-white text-sm mb-4">Upload Image</h3>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input type="file" accept="image/*" onChange={(e) => setGalleryFile(e.target.files?.[0] || null)} className="flex-1 text-sm text-[#8892A4] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#00B4FF]/20 file:text-[#00B4FF] hover:file:bg-[#00B4FF]/30 file:transition-colors file:cursor-pointer" />
                            <input type="text" placeholder="Caption (optional)" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] transition-all" />
                            <button onClick={uploadGalleryImage} disabled={!galleryFile || uploading} className="px-5 py-2 text-sm font-bold bg-[#00FF9C] text-[#0D0D0D] rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50">
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>

                    {/* Gallery grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {gallery.map((img) => (
                            <div key={img.id} className="glass rounded-xl overflow-hidden group relative">
                                <img src={img.image_url} alt={img.caption || 'Gallery'} className="w-full h-40 object-cover" />
                                <div className="p-3">
                                    <p className="text-white text-xs truncate">{img.caption || 'No caption'}</p>
                                </div>
                                <button
                                    onClick={() => deleteGalleryImage(img.id, img.image_url)}
                                    className="absolute top-2 right-2 w-7 h-7 bg-[#FF3B3B] rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                    {gallery.length === 0 && <p className="text-[#8892A4] text-center py-10 font-[var(--font-exo2)]">No gallery images yet. Upload one above!</p>}
                </div>
            )}
        </div>
    )
}
