// app/portal/admin/page.tsx — IIMS IT Club Base Command (v4.0)
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Loader2, AlertTriangle } from 'lucide-react'
import AdminSidebar, { AdminTab } from '@/components/portal/admin/AdminSidebar'
import OverviewTab from '@/components/portal/admin/OverviewTab'
import MembersTab from '@/components/portal/admin/MembersTab'
import FeedTab from '@/components/portal/admin/FeedTab'
import ResourcesTab from '@/components/portal/admin/ResourcesTab'
import EventsTab from '@/components/portal/admin/EventsTab'
import CTFTab from '@/components/portal/admin/CTFTab'

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<any>({
        members: [], posts: [], events: [], challenges: [], resources: []
    })

    const supabase = createClient()
    const router = useRouter()

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Check session and admin status
            const { data: { user } } = await supabase.auth.getUser()
            const session = user ? { user } : null
            if (!session) {
                router.push('/portal/login')
                return
            }

            const { data: member } = await supabase
                .from('members')
                .select('role')
                .eq('id', session.user.id)
                .single()

            if (!member || !['admin', 'superadmin'].includes(member.role)) {
                router.push('/portal/dashboard')
                return
            }

            // Parallel data fetching
            const [m, p, e, c, r] = await Promise.all([
                supabase.from('members').select('*').order('created_at', { ascending: false }),
                supabase.from('posts').select('*, author:members(full_name, avatar_url)').order('created_at', { ascending: false }),
                supabase.from('public_events').select('*').order('event_date', { ascending: false }),
                supabase.from('ctf_challenges').select('id, title, category, difficulty, points, is_active, hint, created_at, solves_count').order('points', { ascending: true }),
                supabase.from('documents').select('*, uploader:members(full_name)').order('created_at', { ascending: false })
            ])

            setData({
                members: m.data || [],
                posts: p.data || [],
                events: e.data || [],
                challenges: c.data || [],
                resources: r.data || []
            })
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [supabase, router])

    useEffect(() => {
        loadData()
    }, [loadData])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] animate-pulse">
                <div className="h-16 w-16 bg-[#F8F9FA] rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-[#E0E0E0]">
                    <Loader2 className="h-8 w-8 text-[#1A237E] animate-spin" />
                </div>
                <p className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest">Synchronizing Command Center</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-12">
                <AlertTriangle className="h-12 w-12 text-[#E53935] mb-6" />
                <h2 className="text-2xl font-bold text-[#212121] mb-2">Tactical Link Severed</h2>
                <p className="text-[#757575] max-w-sm mb-8 font-medium">{error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#1A237E] text-white rounded-xl font-bold tracking-widest text-xs uppercase shadow-md shadow-[#1A237E]/20 hover:bg-[#283593] transition-colors">
                    Re-establish Connection
                </button>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden -m-8">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar animate-fade-up">
                <header className="mb-10 flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E53935]/10 text-[#D32F2F] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#FFCDD2]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Sector Command
                        </div>
                        <h1 className="text-4xl font-bold text-[#212121] capitalize leading-tight">
                            {activeTab.replace('-', ' ')} <span className="text-[#1A237E]">Console</span>
                        </h1>
                    </div>
                </header>

                <div className="pb-20">
                    {activeTab === 'overview' && <OverviewTab data={data} />}
                    {activeTab === 'members' && <MembersTab members={data.members} refresh={loadData} />}
                    {activeTab === 'posts' && <FeedTab posts={data.posts} refresh={loadData} />}
                    {activeTab === 'events' && <EventsTab events={data.events} refresh={loadData} />}
                    {activeTab === 'ctf' && <CTFTab challenges={data.challenges} refresh={loadData} />}
                    {activeTab === 'documents' && <ResourcesTab resources={data.resources} refresh={loadData} />}
                </div>
            </main>
        </div>
    )
}
