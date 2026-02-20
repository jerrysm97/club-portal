// app/portal/(protected)/dashboard/page.tsx — IIMS IT Club Dashboard (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { ShieldCheck, Calendar, ArrowRight, Megaphone, Terminal, Star, Trophy, MessageSquare, ChevronRight, GraduationCap } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import Avatar from '@/components/ui/Avatar'
import { getSession, getMember } from '@/lib/auth'

export const revalidate = 60 // Revalidate dashboard every minute

export default async function DashboardPage() {
    const session = await getSession()
    if (!session) return null // layout handles redirect

    const member = await getMember(session.user.id)
    if (!member) return null

    const supabase = createServerClient()

    // Parallel data fetch for everything else, using member.points
    const [eventsRes, announcementsRes, rankRes] = await Promise.all([
        supabase
            .from('public_events')
            .select('id, title, type, event_date, location, is_published')
            .gte('event_date', new Date().toISOString())
            .eq('is_published', true)
            .order('event_date')
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
            .gt('points', member.points || 0)
    ])

    const events = eventsRes.data ?? []
    const announcements = announcementsRes.data ?? []

    // User rank is (number of people with MORE points) + 1
    const userRank = (rankRes.count || 0) + 1
    const isHighPerms = ['admin', 'superadmin'].includes(member.role)

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Welcome Banner */}
            <section className="relative rounded-3xl bg-[#1A237E] overflow-hidden p-8 md:p-12 shadow-lg shadow-[#1A237E]/20">
                {/* Decorative geometry */}
                <div className="absolute top-[-50%] right-[-10%] w-[120%] h-[200%] bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-32 -translate-y-32" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E53935]/10 rounded-full blur-3xl -translate-x-32 translate-y-32" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex p-1 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner h-20 w-20 items-center justify-center relative">
                            {member.avatar_url ? (
                                <Avatar src={member.avatar_url} name={member.full_name} size="lg" className="h-16 w-16" />
                            ) : (
                                <div className="h-16 w-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <GraduationCap className="h-8 w-8 text-[#1A237E]" />
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-white font-bold text-[10px] uppercase tracking-widest mb-3 backdrop-blur-sm border border-white/10">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Secure Session
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Welcome, <span className="text-[#FFEB3B]">{member.full_name.split(' ')[0]}</span>
                            </h1>
                            <div className="flex items-center gap-3 mt-2">
                                <p className="text-[#E8EAF6] font-medium text-sm flex items-center gap-2">
                                    {member.program && member.intake ? `${member.program} • ${member.intake}` : 'IT Club Member'}
                                </p>
                                <span className="h-1 w-1 rounded-full bg-white/30" />
                                <span className="text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white/10">
                                    {member.club_post || 'General Member'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8 bg-black/20 backdrop-blur-xl px-8 py-5 rounded-2xl border border-white/10 shadow-xl">
                        <div className="text-center">
                            <span className="block text-[10px] text-[#E8EAF6] font-bold uppercase tracking-widest mb-1.5 opacity-80">Club Points</span>
                            <span className="block text-3xl font-bold text-[#FFEB3B]">{member.points || 0}</span>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div className="text-center group">
                            <span className="block text-[10px] text-[#E8EAF6] font-bold uppercase tracking-widest mb-1.5 opacity-80">Global Rank</span>
                            <Link href="/portal/leaderboard" className="block text-2xl font-bold text-white hover:text-[#FFEB3B] transition-colors">
                                #{userRank}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Announcements Feed */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#212121] flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-[#E53935]" />
                            Official Announcements
                        </h2>
                        <Link href="/portal/feed" className="text-sm font-semibold text-[#1A237E] hover:underline flex items-center gap-1 group">
                            View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-5">
                        {announcements.length > 0 ? (
                            announcements.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/portal/feed/${post.id}`}
                                    className="block bg-white p-6 md:p-8 rounded-2xl border border-[#E0E0E0] shadow-sm hover:shadow-md hover:border-[#1A237E]/20 transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-2.5 py-1 rounded-md bg-[#FFF8E1] text-[#F57F17] text-[10px] font-bold uppercase tracking-wider border border-[#F57F17]/20">
                                            Announcement
                                        </span>
                                        <span className="text-[#9E9E9E] text-xs font-semibold">
                                            {formatDate(post.created_at)}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#212121] mb-2 group-hover:text-[#1A237E] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-[#757575] text-sm leading-relaxed line-clamp-2 mb-4">
                                        {post.content}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-[#1A237E]">
                                        Read details <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="bg-white p-10 rounded-2xl border border-dashed border-[#E0E0E0] text-center flex flex-col items-center justify-center">
                                <BoxIcon className="h-10 w-10 text-[#E0E0E0] mb-3" />
                                <p className="text-[#757575] font-medium text-sm">No recent announcements from the board.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Admin Shortcuts */}
                    {isHighPerms && (
                        <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E0E0E0] shadow-sm">
                            <h2 className="text-sm font-bold text-[#212121] mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <ShieldCheck className="h-4 w-4 text-[#E53935]" />
                                Admin Shortcuts
                            </h2>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/portal/admin?tab=broadcast" className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E0E0E0] hover:border-[#1A237E] hover:shadow-sm transition-all group">
                                    <span className="text-sm font-semibold text-[#424242] group-hover:text-[#1A237E] flex items-center gap-2">
                                        <Megaphone className="h-4 w-4" /> Broadcast
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-[#E0E0E0] group-hover:text-[#1A237E]" />
                                </Link>
                                <Link href="/portal/admin?tab=events" className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E0E0E0] hover:border-[#1A237E] hover:shadow-sm transition-all group">
                                    <span className="text-sm font-semibold text-[#424242] group-hover:text-[#1A237E] flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Manage Events
                                    </span>
                                    <ChevronRight className="h-4 w-4 text-[#E0E0E0] group-hover:text-[#1A237E]" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Upcoming Events */}
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-[#212121] flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[#1A237E]" />
                                Upcoming Events
                            </h2>
                            <Link href="/portal/events" className="text-xs font-semibold text-[#9E9E9E] hover:text-[#1A237E] transition-colors">
                                View Calendar
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {events.length > 0 ? events.map((event: any) => (
                                <Link
                                    key={event.id}
                                    href={`/portal/events/${event.id}`}
                                    className="block bg-white p-4 rounded-xl border border-[#E0E0E0] hover:border-[#1A237E]/30 hover:shadow-md transition-all group"
                                >
                                    <span className="block text-[10px] font-bold text-[#1A237E] uppercase tracking-wider mb-1">
                                        {formatDate(event.event_date || '')}
                                    </span>
                                    <h4 className="font-semibold text-[#212121] text-sm group-hover:text-[#1A237E] transition-colors line-clamp-1">
                                        {event.title}
                                    </h4>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="px-2 py-0.5 rounded-md bg-[#F5F5F5] text-[#757575] text-[10px] font-bold uppercase border border-[#E0E0E0]">
                                            {event.type}
                                        </span>
                                        <ChevronRight className="h-3 w-3 text-[#E0E0E0] group-hover:text-[#1A237E]" />
                                    </div>
                                </Link>
                            )) : (
                                <div className="p-5 text-center bg-[#F8F9FA] rounded-xl border border-dashed border-[#E0E0E0]">
                                    <p className="text-xs text-[#9E9E9E] font-medium">No upcoming events right now.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modules / Tools */}
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/portal/ctf" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-[#1A237E] hover:bg-[#1A237E]/5 transition-all group shadow-sm">
                            <Terminal className="h-6 w-6 text-[#424242] mb-2 group-hover:text-[#1A237E] transition-colors" />
                            <span className="text-[10px] font-bold text-[#757575] uppercase tracking-widest group-hover:text-[#1A237E]">CTF Arena</span>
                        </Link>
                        <Link href="/portal/messages" className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-[#E0E0E0] hover:border-[#0277BD] hover:bg-[#0277BD]/5 transition-all group shadow-sm">
                            <MessageSquare className="h-6 w-6 text-[#424242] mb-2 group-hover:text-[#0277BD] transition-colors" />
                            <span className="text-[10px] font-bold text-[#757575] uppercase tracking-widest group-hover:text-[#0277BD]">Messages</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

function BoxIcon({ className }: { className?: string }) {
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
