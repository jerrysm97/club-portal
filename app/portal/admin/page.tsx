// app/portal/admin/page.tsx — IIMS Collegiate Base Command
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
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/portal/login')
                return
            }

            const { data: member } = await supabase
                .from('members' as any)
                .select('role')
                .eq('user_id', session.user.id)
                .single()

            if (!member || !['admin', 'superadmin'].includes((member as any).role)) {
                router.push('/portal/dashboard')
                return
            }

            // Parallel data fetching with updated table names
            const [m, p, e, c, r] = await Promise.all([
                supabase.from('members').select('*').order('joined_at', { ascending: false }),
                supabase.from('posts').select('*, author:members(full_name, avatar_url)').order('created_at', { ascending: false }),
                supabase.from('events').select('*').order('starts_at', { ascending: false }),
                supabase.from('ctf_challenges').select('*, solved_count:ctf_submissions(count)').order('points', { ascending: true }),
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
                <div className="h-16 w-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                    <Loader2 className="h-8 w-8 text-[#C3161C] animate-spin" />
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Synchronizing Command Center</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center p-12">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-6" />
                <h2 className="text-2xl font-poppins font-black text-gray-900 mb-2">Tactical Link Severed</h2>
                <p className="text-gray-500 max-w-sm mb-8">{error}</p>
                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#58151C] text-white rounded-2xl font-bold shadow-xl shadow-red-900/10">Re-establish Connection</button>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden -m-8">
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            <main className="flex-1 overflow-y-auto p-12 custom-scrollbar animate-fade-up">
                <header className="mb-12 flex items-center justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#58151C]/10">
                            <ShieldCheck className="h-3.5 w-3.5" /> Sector Command
                        </div>
                        <h1 className="text-4xl font-poppins font-black text-[#111827] capitalize">
                            {activeTab.replace('-', ' ')} <span className="text-[#C3161C]">Console</span>
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
