'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import AdminSidebar, { AdminTab } from '@/components/portal/admin/AdminSidebar'
import OverviewTab from '@/components/portal/admin/OverviewTab'
import MembersTab from '@/components/portal/admin/MembersTab'
import FeedTab from '@/components/portal/admin/FeedTab'
import ResourcesTab from '@/components/portal/admin/ResourcesTab'
import EventsTab from '@/components/portal/admin/EventsTab'
import CTFTab from '@/components/portal/admin/CTFTab'
import NotificationsTab from '@/components/portal/admin/NotificationsTab'
import InboxTab from '@/components/portal/admin/InboxTab'
import SettingsTab from '@/components/portal/admin/SettingsTab'
import AuditTab from '@/components/portal/admin/AuditTab'
import TeamTab from '@/components/portal/admin/TeamTab'

// Types
import type { Member, Post, PublicEvent, CTFChallenge, Document, SiteSettings, ContactMessage, AuditLog, TeamMember } from '@/types/database'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<{
        members: Member[]
        posts: Post[]
        events: PublicEvent[]
        challenges: CTFChallenge[]
        resources: Document[]
        settings: SiteSettings | null
        inbox: ContactMessage[]
        audit: AuditLog[]
        team: TeamMember[]
    }>({
        members: [], posts: [], events: [], challenges: [], resources: [], settings: null, inbox: [], audit: [], team: []
    })

    const supabase = createClient()
    const router = useRouter()

    const loadData = useCallback(async () => {
        setLoading(true)

        // Parallel data fetching
        const [m, p, e, c, r, s, i, a, t] = await Promise.all([
            supabase.from('members').select('*').order('created_at', { ascending: false }),
            supabase.from('posts').select('*, author:members(*)').order('created_at', { ascending: false }),
            supabase.from('public_events').select('*').order('event_date', { ascending: false }),
            supabase.from('ctf_challenges').select('*').order('points', { ascending: true }),
            supabase.from('documents').select('*, uploader:members(*)').order('created_at', { ascending: false }),
            supabase.from('site_settings').select('*').eq('id', 'global').single(),
            supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
            supabase.from('audit_logs').select('*, admin:members(*)').order('created_at', { ascending: false }).limit(100),
            supabase.from('team_members').select('*').order('sort_order')
        ])

        setData({
            members: m.data || [],
            posts: p.data || [],
            events: e.data || [],
            challenges: c.data || [],
            resources: r.data || [],
            settings: s.data,
            inbox: i.data || [],
            audit: a.data || [],
            team: t.data || []
        })
        setLoading(false)
    }, [supabase])

    useEffect(() => {
        loadData()
    }, [loadData])

    // Calculate generic stats for Overview
    const stats = {
        members: data.members.length,
        pendingMembers: data.members.filter(m => m.status === 'pending').length,
        posts: data.posts.filter(p => !p.type || p.type === 'announcement').length,
        events: data.events.length,
        solves: data.challenges.reduce((acc, curr) => acc + (curr.solves_count || 0), 0),
        messages: data.inbox.filter(m => !m.is_read).length
    }

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-[#09090B]">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#10B981] border-t-transparent" />
                    <p className="text-[#10B981] font-mono text-xs animate-pulse">ESTABLISHING_UPLINK...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#09090B] overflow-hidden">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 overflow-y-auto p-8">
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'members' && <MembersTab members={data.members} />}
                {activeTab === 'feed' && <FeedTab posts={data.posts} />}
                {activeTab === 'resources' && <ResourcesTab resources={data.resources} />}
                {activeTab === 'events' && <EventsTab events={data.events} />}
                {activeTab === 'ctf' && <CTFTab challenges={data.challenges} />}
                {activeTab === 'notifications' && <NotificationsTab />}
                {activeTab === 'inbox' && <InboxTab messages={data.inbox} />}
                {activeTab === 'settings' && data.settings && <SettingsTab settings={data.settings} />}
                {activeTab === 'audit' && <AuditTab logs={data.audit} />}
                {activeTab === 'team' && <TeamTab team={data.team} />}

                {/* Placeholders for minor tabs */}
                {activeTab === 'messages' && (
                    <div className="p-12 border border-dashed border-[#27272A] text-center text-[#52525B] font-mono">
                        Encrypted comms monitoring is restricted. (Privacy Protocol Active)
                    </div>
                )}
                {activeTab === 'gallery' && (
                    <div className="p-12 border border-dashed border-[#27272A] text-center text-[#52525B] font-mono">
                        Gallery module offline. Use Supabase Storage directly.
                    </div>
                )}
            </main>
        </div>
    )
}
