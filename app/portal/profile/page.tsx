// app/portal/profile/page.tsx — Stealth Terminal Profile
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { User, Mail, Github, Linkedin, Calendar, Edit2, Key, Shield } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Member } from '@/types/database'
import Link from 'next/link'

export const revalidate = 0

export default async function ProfilePage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
            {/* Header Card */}
            <div className="relative p-8 rounded-sm bg-[#09090B] border border-[#27272A] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10B981]/5 to-transparent" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar Area */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-sm overflow-hidden border-2 border-[#27272A] group-hover:border-[#10B981] transition-colors bg-[#111113]">
                            {member.avatar_url ? (
                                <Image src={member.avatar_url} alt={member.full_name} width={128} height={128} className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#27272A]">
                                    <User className="h-12 w-12" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-3 -right-3 p-2 bg-[#09090B] border border-[#27272A] rounded-full">
                            <div className={`w-3 h-3 rounded-full ${member.status === 'approved' ? 'bg-[#10B981]' : 'bg-[#EAB308]'}`} />
                        </div>
                    </div>

                    {/* Info Area */}
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-mono font-bold text-[#F8FAFC]">{member.full_name}</h1>
                            <p className="text-[#10B981] font-mono text-sm">@{member.student_id || 'operative'}</p>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-3">
                            {member.role === 'admin' && (
                                <span className="px-2 py-1 rounded-sm bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-mono uppercase font-bold flex items-center gap-1">
                                    <Shield className="h-3 w-3" /> Admin_Access
                                </span>
                            )}
                            <span className="px-2 py-1 rounded-sm bg-[#27272A] text-[#A1A1AA] text-xs font-mono uppercase flex items-center gap-1">
                                <Calendar className="h-3 w-3" /> Joined {formatDate(member.joined_at)}
                            </span>
                        </div>

                        <div className="pt-2">
                            <Link href="/portal/settings" className="inline-flex items-center gap-2 px-4 py-2 rounded-sm bg-[#F8FAFC] text-black font-mono text-sm font-bold hover:bg-[#E2E8F0] transition-colors">
                                <Edit2 className="h-4 w-4" />
                                Edit_Profile
                            </Link>
                        </div>
                    </div>

                    {/* Stats Area */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                        <div className="p-4 rounded-sm bg-[#111113] border border-[#27272A] text-center">
                            <span className="block text-xs text-[#52525B] font-mono uppercase">Total_Points</span>
                            <span className="block text-2xl font-mono font-bold text-[#10B981]">{member.points}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bio & Skills */}
                <div className="space-y-8">
                    <div className="p-6 rounded-sm bg-[#09090B] border border-[#27272A]">
                        <h3 className="text-[#F8FAFC] font-mono font-bold mb-4 border-b border-[#27272A] pb-2">Bio_Data</h3>
                        <p className="text-[#A1A1AA] font-mono text-sm leading-relaxed whitespace-pre-wrap">
                            {member.bio || 'No bio data available.'}
                        </p>
                    </div>

                    <div className="p-6 rounded-sm bg-[#09090B] border border-[#27272A]">
                        <h3 className="text-[#F8FAFC] font-mono font-bold mb-4 border-b border-[#27272A] pb-2">Skillset_Matrix</h3>
                        <div className="flex flex-wrap gap-2">
                            {member.skills && member.skills.length > 0 ? (
                                member.skills.map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 rounded-sm bg-[#27272A]/50 text-[#10B981] border border-[#10B981]/20 text-xs font-mono">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[#52525B] text-xs font-mono italic">No skills calibrated.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact & Socials */}
                <div className="p-6 rounded-sm bg-[#09090B] border border-[#27272A] h-fit">
                    <h3 className="text-[#F8FAFC] font-mono font-bold mb-6 border-b border-[#27272A] pb-2">Comms_Channels</h3>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-sm bg-[#27272A] text-[#A1A1AA]"><Mail className="h-4 w-4" /></div>
                            <div>
                                <span className="block text-[10px] text-[#52525B] uppercase font-mono">Email</span>
                                <span className="block text-sm text-[#F8FAFC] font-mono">{member.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-sm bg-[#27272A] text-[#A1A1AA]"><Github className="h-4 w-4" /></div>
                            <div>
                                <span className="block text-[10px] text-[#52525B] uppercase font-mono">GitHub</span>
                                <a href={member.github_url || '#'} target="_blank" className={`block text-sm font-mono ${member.github_url ? 'text-[#10B981] hover:underline' : 'text-[#52525B] italic'}`}>
                                    {member.github_url || 'Not Linked'}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-sm bg-[#27272A] text-[#A1A1AA]"><Linkedin className="h-4 w-4" /></div>
                            <div>
                                <span className="block text-[10px] text-[#52525B] uppercase font-mono">LinkedIn</span>
                                <a href={member.linkedin_url || '#'} target="_blank" className={`block text-sm font-mono ${member.linkedin_url ? 'text-[#10B981] hover:underline' : 'text-[#52525B] italic'}`}>
                                    {member.linkedin_url || 'Not Linked'}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-sm bg-[#27272A] text-[#A1A1AA]"><Key className="h-4 w-4" /></div>
                            <div>
                                <span className="block text-[10px] text-[#52525B] uppercase font-mono">User_ID</span>
                                <span className="block text-xs text-[#52525B] font-mono truncate max-w-[200px]">{member.id}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
