// app/portal/dashboard/page.tsx — Stealth Terminal Command Center
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Terminal, Shield, AlertTriangle, Activity, Calendar, FileText, ArrowUpRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Member, PublicEvent, Post } from '@/types/database'

export const revalidate = 60

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Parallel data fetching
    const [memberRes, eventsRes, announcementsRes] = await Promise.all([
        supabase.from('members').select('*').eq('id', session?.user?.id!).single(),
        supabase.from('public_events').select('*').gte('event_date', new Date().toISOString()).order('event_date').limit(3),
        supabase.from('posts').select('*, author:members(full_name, avatar_url)').eq('type', 'announcement').order('created_at', { ascending: false }).limit(3)
    ])

    const member = memberRes.data as Member
    const events = (eventsRes.data || []) as PublicEvent[]
    const announcements = (announcementsRes.data || []) as Post[]

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Welcome Banner */}
            <div className="relative p-8 rounded-sm bg-[#09090B] border border-[#27272A] overflow-hidden">
                <div className="absolute inset-0 hero-grid opacity-10" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-[#10B981] mb-2 font-mono text-xs uppercase tracking-wider">
                            <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                            System_Online
                        </div>
                        <h1 className="text-2xl md:text-3xl font-mono font-bold text-[#F8FAFC]">
                            Welcome back, <span className="text-[#10B981]">{member.full_name.split(' ')[0]}</span>
                        </h1>
                        <p className="text-[#A1A1AA] font-mono text-sm mt-1">
                            Clearance Level: <span className="text-[#F8FAFC] uppercase">{member.role}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-6 bg-black/50 p-4 rounded-sm border border-[#27272A]">
                        <div className="text-center">
                            <span className="block text-xs font-mono text-[#52525B] uppercase">Rank_PTS</span>
                            <span className="block text-xl font-mono font-bold text-[#10B981]">{member.points}</span>
                        </div>
                        <div className="w-px h-8 bg-[#27272A]" />
                        <div className="text-center">
                            <span className="block text-xs font-mono text-[#52525B] uppercase">ID_Ref</span>
                            <span className="block text-xl font-mono font-bold text-[#F8FAFC]">#{member.student_id || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Feed / Announcements */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-2 font-mono font-bold text-[#F8FAFC]">
                            <AlertTriangle className="h-4 w-4 text-[#EAB308]" />
                            Priority_Intel
                        </h2>
                        <Link href="/portal/feed" className="text-xs font-mono text-[#10B981] hover:underline">View_All_Comms &gt;</Link>
                    </div>

                    <div className="space-y-4">
                        {announcements.length > 0 ? (
                            announcements.map(post => (
                                <div key={post.id} className="p-5 rounded-sm bg-[#111113] border border-[#27272A] hover:border-[#27272A]/80 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="px-2 py-0.5 rounded-full bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/20 text-[10px] font-mono uppercase">Announcement</span>
                                        <span className="text-[#52525B] text-xs font-mono">{formatDate(post.created_at)}</span>
                                    </div>
                                    <h3 className="text-lg font-mono font-bold text-[#F8FAFC] mb-2">{post.title}</h3>
                                    <p className="text-[#A1A1AA] text-sm line-clamp-2">{post.content}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center border border-dashed border-[#27272A] rounded-sm text-[#52525B] font-mono italic">
                                No active priority communications.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    {/* Upcoming Missions */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="flex items-center gap-2 font-mono font-bold text-[#F8FAFC]">
                                <Calendar className="h-4 w-4 text-[#06B6D4]" />
                                Upcoming_Missions
                            </h2>
                            <Link href="/portal/events" className="text-xs font-mono text-[#06B6D4] hover:underline">View_Log &gt;</Link>
                        </div>

                        <div className="space-y-3">
                            {events.length > 0 ? (
                                events.map(event => (
                                    <Link key={event.id} href={`/portal/events/${event.id}`} className="block p-4 rounded-sm bg-[#111113] border border-[#27272A] hover:border-[#06B6D4]/50 transition-colors group">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-[#06B6D4] font-mono text-xs">{formatDate(event.event_date)}</span>
                                            <ArrowUpRight className="h-3 w-3 text-[#52525B] group-hover:text-[#06B6D4] transition-colors" />
                                        </div>
                                        <h4 className="font-mono font-bold text-[#F8FAFC] text-sm truncate">{event.title}</h4>
                                        <div className="flex items-center gap-1 mt-2 text-[#52525B] text-xs font-mono">
                                            <div className={`w-1.5 h-1.5 rounded-full ${event.type.toLowerCase().includes('ctf') ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`} />
                                            {event.type}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="p-4 text-center border border-dashed border-[#27272A] rounded-sm text-[#52525B] font-mono text-xs">
                                    No upcoming missions.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h2 className="flex items-center gap-2 font-mono font-bold text-[#F8FAFC] mb-4">
                            <Terminal className="h-4 w-4 text-[#10B981]" />
                            Quick_Access
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/portal/ctf" className="p-3 rounded-sm bg-[#27272A]/30 border border-[#27272A] hover:bg-[#27272A]/50 hover:text-[#10B981] transition-colors text-center">
                                <Shield className="h-5 w-5 mx-auto mb-2 text-[#A1A1AA]" />
                                <span className="block text-xs font-mono font-bold">CTF_Arena</span>
                            </Link>
                            <Link href="/portal/resources" className="p-3 rounded-sm bg-[#27272A]/30 border border-[#27272A] hover:bg-[#27272A]/50 hover:text-[#10B981] transition-colors text-center">
                                <FileText className="h-5 w-5 mx-auto mb-2 text-[#A1A1AA]" />
                                <span className="block text-xs font-mono font-bold">Archives</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
