import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Team — ICEHC',
    description: 'Meet the core committee and general members of the IIMS Cybersecurity & Ethical Hacking Club.',
}

export const revalidate = 60

export default async function TeamPage() {
    const supabase = await createServerSupabaseClient()

    // Fetch members with public profiles
    const { data: membersResult } = await supabase
        .from('members')
        .select('id, full_name, club_post, role, is_public_profile, display_order, joined_at')
        .eq('status', 'approved')
        .eq('is_public_profile', true)
        .order('display_order', { ascending: true })
        .order('joined_at', { ascending: true })

    const allMembers: any[] = membersResult || []

    // Separate Core Committee (Officers) from General Roster
    const coreCommittee = allMembers.filter((m: any) => m.role === 'officer' || m.club_post !== null)
    const generalRoster = allMembers.filter((m: any) => m.role !== 'officer' && m.club_post === null)

    return (
        <div className="bg-white min-h-screen pt-24 pb-20">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-6 mb-16">
                <div className="border-l-4 border-[#C8102E] pl-6 py-2 content-start">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#111111] mb-4 tracking-tight">Our Team</h1>
                    <p className="text-[#4A4A4A] text-lg leading-relaxed max-w-2xl">
                        The individuals driving the ICEHC mission forward.
                    </p>
                </div>
            </div>

            {/* Core Committee */}
            <section className="mb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#111111] mb-8 pb-4 border-b border-[#E5E5E5]">Core Committee</h2>

                    {coreCommittee.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {coreCommittee.map((member) => (
                                <div key={member.id} className="bg-white border-t-4 border-[#C8102E] border-x border-b border-[#E5E5E5] p-6">
                                    <h3 className="text-lg font-bold text-[#111111] mb-1">{member.full_name}</h3>
                                    <p className="text-[#4A4A4A] text-sm font-medium mb-4">{member.club_post || 'Committee Member'}</p>
                                    <div className="text-xs text-[#4A4A4A] opacity-60">
                                        Member since {new Date(member.joined_at).getFullYear()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-[#E5E5E5]">
                            <p className="text-[#4A4A4A]">Committee information is currently being updated.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* General Roster */}
            <section className="bg-[#FAFAFA] border-y border-[#E5E5E5] py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-2xl font-bold text-[#111111] mb-8 pb-4 border-b border-[#E5E5E5]">General Roster</h2>

                    {generalRoster.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b-2 border-[#111111] text-[#111111]">
                                        <th className="py-4 px-4 font-bold tracking-wide">Name</th>
                                        <th className="py-4 px-4 font-bold tracking-wide hidden md:table-cell">Role</th>
                                        <th className="py-4 px-4 font-bold tracking-wide text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E5E5E5]">
                                    {generalRoster.map((member) => (
                                        <tr key={member.id} className="hover:bg-white transition-colors">
                                            <td className="py-4 px-4 font-medium text-[#111111]">{member.full_name}</td>
                                            <td className="py-4 px-4 text-[#4A4A4A] hidden md:table-cell">Member</td>
                                            <td className="py-4 px-4 text-[#4A4A4A] text-right">{new Date(member.joined_at).getFullYear()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-[#E5E5E5] bg-white">
                            <p className="text-[#4A4A4A]">Roster is currently being updated.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
