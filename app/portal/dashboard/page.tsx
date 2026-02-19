// app/portal/dashboard/page.tsx — IIMS Collegiate Member Dashboard
import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ShieldCheck, Calendar, FileText, ArrowRight, Megaphone, Terminal, Star, Zap, Trophy, MessageSquare, ChevronRight, Box as BoxIcon } from 'lucide-react'
import type { Member, Event as DBEvent, Post } from '@/types/database'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'

export const revalidate = 60

export default async function DashboardPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) redirect('/portal/login')

    // Parallel data fetching
    const [memberRes, eventsRes, announcementsRes, rankRes] = await Promise.all([
        supabase.from('members').select('*').eq('user_id', session.user.id).single(),
        supabase
            .from('events')
            .select('id, title, type, starts_at, location')
            .gte('starts_at', new Date().toISOString())
            .eq('is_published', true)
            .order('starts_at')
            .limit(4),
        supabase
            .from('posts')
            .select('id, title, content, created_at, type')
            .eq('type', 'announcement')
            .order('created_at', { ascending: false })
            .limit(3),
        supabase
            .from('members')
            .select('id', { count: 'exact', head: true })
            .gt('points', 0) // placeholder, will refine below
    ])

    const member = memberRes.data as unknown as Member | null
    if (!member) redirect('/portal/login')
    const events = (eventsRes.data ?? []) as any[]
    const announcements = (announcementsRes.data ?? []) as any[]

    // Refined rank query
    const { count: rankCount } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', member.points || 0)

    const userRank = (rankCount || 0) + 1

    const isHighPerms = ['bod', 'admin', 'superadmin'].includes(member.role)

    return (
        <div className="space-y-10">
            {/* Welcome Banner */}
            <section className="relative rounded-[2.5rem] bg-[#58151C] overflow-hidden p-10 md:p-12 shadow-2xl shadow-red-100/50">
                <div className="absolute inset-0 hero-grid opacity-20 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent blur-3xl rounded-full translate-x-32 -translate-y-32" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
                            <Avatar src={member.avatar_url} name={member.full_name} size="lg" className="ring-2 ring-white/10" />
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-[#FECACA] font-bold text-[10px] uppercase tracking-widest mb-4">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Active Session Established
                            </div>
                            <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white leading-tight">
                                Welcome back, <span className="text-[#FCD34D]">{member.full_name.split(' ')[0]}</span>
                            </h1>
                            <p className="text-[#FECACA] font-medium mt-2 flex items-center gap-2">
                                {member.club_post || 'General Member'} <span className="h-1 w-1 rounded-full bg-white/30" /> {member.role.toUpperCase()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 bg-black/20 backdrop-blur-xl px-10 py-6 rounded-[2rem] border border-white/10 shadow-2xl">
                        <div className="text-center">
                            <span className="block text-[10px] text-[#FECACA] font-black uppercase tracking-[0.2em] mb-1">XP Points</span>
                            <span className="block text-3xl font-poppins font-bold text-[#FCD34D]">{member.points}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center">
                            <span className="block text-[10px] text-[#FECACA] font-black uppercase tracking-[0.2em] mb-1">Rank</span>
                            <span className="block text-xl font-poppins font-bold text-white">
                                #{userRank}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Announcements & Feed News */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-poppins font-bold text-[#111827] flex items-center gap-3">
                            <Megaphone className="h-6 w-6 text-[#C3161C]" />
                            Sector Updates
                        </h2>
                        <Link href="/portal/feed" className="text-sm font-bold text-[#C3161C] hover:underline flex items-center gap-1 group">
                            Full Archive <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {announcements.length > 0 ? (
                            announcements.map((post, idx) => (
                                <div
                                    key={post.id}
                                    className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#58151C]/10 transition-all group"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                            High Priority
                                        </span>
                                        <span className="text-gray-400 text-xs font-bold font-mono">
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                    {post.title && (
                                        <h3 className="text-xl font-poppins font-bold text-[#111827] mb-3 group-hover:text-[#C3161C] transition-colors">{post.title}</h3>
                                    )}
                                    <p className="text-gray-500 text-base leading-relaxed line-clamp-2 mb-6 font-medium">{post.content}</p>
                                    <Link href={`/portal/feed/${post.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#58151C] group-hover:gap-3 transition-all">
                                        Read Intel Briefing <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="bg-gray-50 p-12 rounded-[2rem] border-2 border-dashed border-gray-200 text-center">
                                <Box className="h-10 w-10 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold">No active announcements detected.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Intel */}
                <div className="space-y-10">
                    {/* Quick Command */}
                    {isHighPerms && (
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#58151C]/5 rounded-bl-[4rem] group-hover:bg-[#58151C]/10 transition-colors" />
                            <h2 className="text-lg font-poppins font-bold text-[#111827] mb-6 flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-[#C3161C]" />
                                Command Center
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                <Button size="sm" className="rounded-xl font-bold justify-start px-5 h-11" leftIcon={<Star className="h-4 w-4" />}>
                                    Create Announcement
                                </Button>
                                <Button variant="outline" size="sm" className="rounded-xl font-bold border-2 justify-start px-5 h-11" leftIcon={<Calendar className="h-4 w-4" />}>
                                    Schedule Mission
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Missions */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-poppins font-bold text-[#111827] flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Next Missions
                            </h2>
                            <Link href="/portal/events" className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                                All Registry
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {events.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/portal/events/${event.id}`}
                                    className="block bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
                                >
                                    <span className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1.5">
                                        {formatDate(event.starts_at || '')}
                                    </span>
                                    <h4 className="font-bold text-[#111827] text-sm group-hover:text-[#C3161C] transition-colors line-clamp-1">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="px-2 py-0.5 rounded-lg bg-gray-50 text-gray-400 text-[9px] font-black uppercase border border-gray-100">
                                            {event.type}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Quick Modals / Tools */}
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/portal/ctf" className="flex flex-col items-center justify-center p-6 rounded-[1.5rem] bg-emerald-50 border border-emerald-100 group hover:bg-emerald-600 transition-all shadow-sm">
                            <Trophy className="h-6 w-6 text-emerald-600 mb-2 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest group-hover:text-white">Arena</span>
                        </Link>
                        <Link href="/portal/messages" className="flex flex-col items-center justify-center p-6 rounded-[1.5rem] bg-indigo-50 border border-indigo-100 group hover:bg-indigo-600 transition-all shadow-sm">
                            <MessageSquare className="h-6 w-6 text-indigo-600 mb-2 group-hover:text-white transition-colors" />
                            <span className="text-[10px] font-black text-indigo-800 uppercase tracking-widest group-hover:text-white">Comm</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Box({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5" />
            <path d="M12 22V12" />
        </svg>
    )
}
