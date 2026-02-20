// app/portal/profile/page.tsx — IIMS Collegiate Operative Dossier
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { User, Mail, Github, Linkedin, Calendar, Edit2, ShieldCheck, Trophy, Target, Zap, ChevronRight, MapPin, Terminal } from 'lucide-react'
import { formatDate } from '@/lib/utils'
// Import types safely
type Member = any
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export const revalidate = 0

export default async function ProfilePage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data } = await supabase
        .from('members')
        .select('*')
        .eq('id', session.user.id)
        .single()

    const member = data as any
    if (!member) redirect('/portal/login')

    // Get rank again for profile display
    const { count: rankCount } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', member.points || 0)

    const userRank = (rankCount || 0) + 1

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-fade-up">
            {/* Dossier Header */}
            <section className="relative bg-[#58151C] rounded-[4rem] p-12 text-white shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl translate-y-32 -translate-x-32" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-12 text-center lg:text-left">
                    <div className="relative group/avatar">
                        <div className="p-2 bg-white/10 rounded-[2.5rem] backdrop-blur-md border border-white/20 transition-transform group-hover/avatar:scale-105">
                            <Avatar
                                src={member.avatar_url}
                                name={member.name || member.email}
                                className="w-48 h-48 rounded-[2rem] border-4 border-[#58151C] shadow-2xl"
                            />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-[#FCD34D] text-[#58151C] rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl whitespace-nowrap">
                            Level {(Math.floor((member.points || 0) / 100)) + 1} Operative
                        </div>
                    </div>

                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-[#FECACA] font-black text-[10px] uppercase tracking-[0.2em] border border-white/10">
                                <ShieldCheck className="h-3.5 w-3.5" /> ID: {member.student_id || 'CLASSIFIED'}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-poppins font-black leading-tight">
                                {member.name || member.email}
                            </h1>
                            <p className="text-[#FECACA] font-medium text-lg opacity-80 max-w-lg">
                                {member.club_post || (member.role?.toUpperCase())} — Active Command
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
                            <span className="px-4 py-2 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
                                <Calendar className="h-4 w-4" /> Activated {new Date(member.created_at).getFullYear()}
                            </span>
                            <span className="px-4 py-2 rounded-xl bg-white/10 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5">
                                <MapPin className="h-4 w-4" /> Sector VII
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 bg-black/20 p-10 rounded-[3rem] backdrop-blur-xl border border-white/10 min-w-[320px]">
                        <div className="text-center">
                            <span className="block text-[10px] font-black text-[#FECACA]/60 uppercase tracking-[0.2em] mb-3">Total Intel</span>
                            <span className="block text-4xl font-poppins font-black text-[#FCD34D]">{member.points}</span>
                            <span className="text-[10px] font-bold opacity-40 uppercase">Stored Pts</span>
                        </div>
                        <div className="w-px h-16 bg-white/10 self-center" />
                        <div className="text-center">
                            <span className="block text-[10px] font-black text-[#FECACA]/60 uppercase tracking-[0.2em] mb-3">Unit Rank</span>
                            <span className="block text-4xl font-poppins font-black text-white">#{userRank}</span>
                            <span className="text-[10px] font-bold opacity-40 uppercase">Global</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* Bio Section */}
                    <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Target className="h-32 w-32 text-[#58151C]" />
                        </div>
                        <h3 className="text-sm font-black text-[#C3161C] uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                            <Terminal className="h-4 w-4" /> Operative Briefing
                        </h3>
                        <p className="text-gray-500 font-medium text-lg leading-relaxed whitespace-pre-wrap relative z-10">
                            {member.bio || 'This operative has not submitted their tactical biography. Mission profiles are currently incomplete.'}
                        </p>
                    </div>

                    {/* Skills Matrix */}
                    <div className="bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
                        <h3 className="text-sm font-black text-[#C3161C] uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                            <Zap className="h-4 w-4" /> Expertise Matrix
                        </h3>
                        <div className="flex flex-wrap gap-4">
                            {member.skills && member.skills.length > 0 ? (
                                member.skills.map((skill: string) => (
                                    <span key={skill} className="px-6 py-3 rounded-2xl bg-gray-50 text-[#58151C] border border-gray-100 text-xs font-black uppercase tracking-widest hover:bg-[#58151C] hover:text-white transition-all transform hover:-translate-y-1">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <div className="py-10 text-center w-full bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest italic">No Expertise calibrated</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Intel */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl space-y-10">
                        <h3 className="text-xs font-black text-[#C3161C] uppercase tracking-[0.3em] mb-4">Comms Relay</h3>

                        <div className="space-y-8">
                            <ContactRow icon={<Mail className="h-5 w-5" />} label="Primary Frequency" value={member.email} />
                            <ContactRow
                                icon={<Github className="h-5 w-5" />}
                                label="Code Vault"
                                value={member.github_url ? member.github_url.split('/').pop()! : 'Not Linked'}
                                link={member.github_url}
                            />
                            <ContactRow
                                icon={<Linkedin className="h-5 w-5" />}
                                label="Professional Network"
                                value={member.linkedin_url ? member.linkedin_url.split('/').pop()! : 'Not Linked'}
                                link={member.linkedin_url}
                            />
                        </div>

                        <div className="pt-10 border-t border-gray-50">
                            <div className="bg-gray-50 rounded-2xl p-6 flex items-center justify-between group cursor-not-allowed opacity-50">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm">
                                        <Edit2 className="h-4 w-4 text-gray-300" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Settings Locked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#C3161C] rounded-[3rem] p-10 text-white shadow-2xl group cursor-pointer hover:bg-[#A31217] transition-all">
                        <div className="flex items-center justify-between mb-8">
                            <Trophy className="h-8 w-8 text-[#FCD34D]" />
                            <ChevronRight className="h-5 w-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <h4 className="font-poppins font-black text-xl mb-2">Honors & Commendations</h4>
                        <p className="text-white/60 text-xs font-medium">View all certificates and unit-wide recognition protocols.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContactRow({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: string; link?: string }) {
    const content = (
        <div className="flex items-center gap-5 transition-transform hover:translate-x-1">
            <div className="p-3 bg-gray-50 rounded-xl text-gray-400 group-hover:text-[#C3161C] transition-colors shadow-inner">
                {icon}
            </div>
            <div className="min-w-0">
                <span className="block text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{label}</span>
                <span className={cn(
                    "block text-sm font-bold truncate transition-colors",
                    link ? "text-[#58151C] group-hover:text-[#C3161C]" : "text-gray-400 italic"
                )}>
                    {value}
                </span>
            </div>
        </div>
    )

    if (link) return <a href={link} target="_blank" className="block group">{content}</a>
    return <div className="block">{content}</div>
}
