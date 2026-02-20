// app/portal/leaderboard/page.tsx — IIMS Collegiate Global Leaderboard
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Trophy, Medal, Star, Target, Zap, ChevronRight, Crown } from 'lucide-react'
// Import types safely
type Member = any
import Avatar from '@/components/ui/Avatar'
import Pagination from '@/components/ui/Pagination'
import { cn } from '@/lib/utils'

export const revalidate = 60

export default async function LeaderboardPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 20
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    // Get current member for highlighting
    const { data: currentMember } = await (supabase
        .from('members' as any) as any)
        .select('id, points')
        .eq('id', session.user.id)
        .single()

    // Fetch paginated members
    const { data, count } = await (supabase
        .from('members' as any) as any)
        .select('id, name, avatar_url, points, role', { count: 'exact' })
        .eq('status', 'approved')
        .order('points', { ascending: false })
        .range(from, to)

    const members = (data || []) as any[]

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FCD34D]/10 text-[#58151C] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#FCD34D]/20 shadow-sm">
                        <Trophy className="h-3.5 w-3.5" /> High Performance Log
                    </div>
                    <h1 className="text-4xl md:text-5xl font-poppins font-black text-[#111827] leading-tight text-balance">
                        Operative <span className="text-[#C3161C]">Leaderboard</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-base mt-2 max-w-xl">
                        Global proficiency rankings based on mission success, flag captures, and unit contributions.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl flex items-center gap-6 group">
                    <div className="p-4 bg-gray-50 rounded-2xl text-gray-300 group-hover:bg-[#58151C] group-hover:text-white transition-all shadow-inner">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Assets</span>
                        <span className="block text-2xl font-poppins font-black text-[#111827]">{count || 0}</span>
                    </div>
                </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rank</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operative</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hidden md:table-cell">Designation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">XP Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.map((m: any, idx: number) => {
                                const rank = from + idx + 1
                                const isMe = m.id === (currentMember as any)?.id
                                const isTop3 = rank <= 3

                                return (
                                    <tr
                                        key={m.id}
                                        className={cn(
                                            "group transition-all hover:bg-gray-50/50",
                                            isMe && "bg-amber-50/30"
                                        )}
                                    >
                                        <td className="px-8 py-6">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center font-poppins font-black text-sm transition-all",
                                                rank === 1 ? "bg-[#FCD34D] text-[#58151C] shadow-lg shadow-amber-200 scale-110" :
                                                    rank === 2 ? "bg-gray-100 text-gray-400" :
                                                        rank === 3 ? "bg-amber-50 text-amber-700" :
                                                            "text-gray-300 group-hover:text-[#111827]"
                                            )}>
                                                {rank === 1 ? <Crown className="h-5 w-5" /> : rank}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <Avatar src={m.avatar_url} name={m.name || m.email} size="sm" className="shadow-lg shadow-black/5" />
                                                <div className="min-w-0">
                                                    <p className={cn(
                                                        "font-bold text-sm truncate",
                                                        isMe ? "text-[#C3161C]" : "text-[#111827]"
                                                    )}>
                                                        {m.name || m.email} {isMe && "(You)"}
                                                    </p>
                                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest md:hidden">
                                                        {m.club_post || m.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 hidden md:table-cell">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-lg bg-gray-50">
                                                {m.club_post || m.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <span className={cn(
                                                "text-lg font-poppins font-black",
                                                isTop3 ? "text-[#58151C]" : "text-gray-400"
                                            )}>
                                                {m.points}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {members.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-black text-lg uppercase tracking-widest">Log Silent</p>
                        <p className="text-gray-300 mt-2 font-medium">No approved operatives found in current sector.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {count && count > pageSize && (
                <div className="py-12 border-t border-gray-50">
                    <Pagination
                        page={currentPage}
                        totalPages={Math.ceil(count / pageSize)}
                        baseUrl="/portal/leaderboard"
                    />
                </div>
            )}

            <footer className="text-center pt-10">
                <p className="text-[10px] text-gray-200 font-black uppercase tracking-[0.4em]">
                    Frequency Terminated
                </p>
            </footer>
        </div>
    )
}
