// app/portal/(protected)/members/page.tsx — IIMS IT Club Member Directory
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Search, ShieldCheck, MessageSquare, MapPin, Calendar } from 'lucide-react'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'
import { getSession, getMember } from '@/lib/auth'



export default async function MembersDirectoryPage() {
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const supabase = createServerClient()

    const { data: members, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, club_post, role, bio, skills, points, joined_at')
        .eq('status', 'approved')
        .order('points', { ascending: false })

    if (error) console.error("MEMBERS QUERY ERROR:", error)

    const allMembers = (members || []) as any[]

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-16 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FAFAFA] text-[#111111] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#E5E5E5] shadow-sm">
                        <Users className="h-3.5 w-3.5" /> Member Directory
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#212121] leading-tight">
                        Club <span className="text-[#E53935]">Members</span>
                    </h1>
                    <p className="text-[#757575] font-medium text-sm mt-3 max-w-xl leading-relaxed">
                        Browse approved ICEHC members. Click on a member to view their profile, skills, and send them a message.
                    </p>
                </div>

                <div className="bg-white rounded-sm p-6 border border-[#E0E0E0] shadow-sm flex items-center gap-5">
                    <div className="p-3 bg-[#FAFAFA] text-[#111111] rounded-sm shadow-inner">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest leading-none mb-1">Active Members</span>
                        <span className="block text-2xl font-bold text-[#212121]">{allMembers.length}</span>
                    </div>
                </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMembers.map((m: any) => {
                    const isMe = m.id === member.id
                    const level = Math.floor((m.points || 0) / 100) + 1

                    return (
                        <Link
                            key={m.id}
                            href={isMe ? '/portal/profile' : `/portal/members/${m.id}`}
                            className="group bg-white rounded-sm border border-[#E0E0E0] shadow-sm hover:shadow-sm hover:border-[#111111]/20 transition-all overflow-hidden"
                        >
                            {/* Card Header */}
                            <div className="bg-[#111111] p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E53935]/10 rounded-full blur-2xl -translate-y-16 translate-x-16" />
                                <div className="relative z-10 flex items-center gap-4">
                                    <Avatar
                                        src={m.avatar_url}
                                        name={m.full_name || 'Member'}
                                        className="w-14 h-14 rounded-sm border-2 border-white/20 shadow-sm group-hover:scale-105 transition-transform"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-white font-bold text-sm truncate flex items-center gap-2">
                                            {m.full_name || 'Anonymous'}
                                            {isMe && (
                                                <span className="text-[8px] bg-white/20 px-2 py-0.5 rounded-full">You</span>
                                            )}
                                            {['admin', 'superadmin'].includes(m.role) && (
                                                <ShieldCheck className="h-3.5 w-3.5 text-[#E53935] shrink-0" />
                                            )}
                                        </h3>
                                        <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-1">
                                            {m.club_post || 'General Member'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 space-y-4">
                                {/* Bio Preview */}
                                <p className="text-[#757575] text-xs font-medium line-clamp-2 leading-relaxed min-h-[2.5rem]">
                                    {m.bio || 'No biography set.'}
                                </p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1.5">
                                    {m.skills && m.skills.length > 0 ? (
                                        m.skills.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="px-2.5 py-1 rounded-md bg-[#F8F9FA] text-[#757575] border border-[#E0E0E0] text-[9px] font-bold uppercase tracking-wider">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-[9px] font-bold text-[#9E9E9E] uppercase tracking-widest">No skills listed</span>
                                    )}
                                    {m.skills && m.skills.length > 3 && (
                                        <span className="px-2.5 py-1 rounded-md bg-[#FAFAFA] text-[#111111] text-[9px] font-bold">
                                            +{m.skills.length - 3}
                                        </span>
                                    )}
                                </div>

                                {/* Footer Stats */}
                                <div className="flex items-center justify-between pt-3 border-t border-[#F5F5F5]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-[#111111]">{m.points || 0} pts</span>
                                        <span className="text-[9px] text-[#9E9E9E] font-bold uppercase">Level {level}</span>
                                    </div>
                                    {!isMe && (
                                        <span className="text-[9px] font-bold text-[#E53935] uppercase tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MessageSquare className="h-3 w-3" /> Message
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    )
                })}
            </div>

            {allMembers.length === 0 && (
                <div className="bg-white rounded-sm border border-[#E0E0E0] p-16 text-center">
                    <div className="h-16 w-16 bg-[#F8F9FA] rounded-sm flex items-center justify-center mx-auto mb-5 border border-[#E0E0E0]">
                        <Users className="h-8 w-8 text-[#9E9E9E]" />
                    </div>
                    <p className="text-[#424242] font-bold text-lg mb-1">No Members Yet</p>
                    <p className="text-[#9E9E9E] font-medium text-sm">Be the first to join ICEHC!</p>
                </div>
            )}
        </div>
    )
}
