// app/portal/ctf/page.tsx — IIMS Collegiate CTF Arena
import { createServerSupabaseClient } from '@/lib/supabase/server'
import CTFClient from '@/components/portal/CTFClient'
// Import types safely
type CTFChallenge = any
type Member = any
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function CTFPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Get current member info
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id, points')
        .eq('id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Fetch challenges (explicitly NOT selecting 'flag')
    const { data: challenges } = await (supabase
        .from('ctf_challenges' as any) as any)
        .select('id, title, description, category, difficulty, points, is_active, hint, created_at')
    const activeChallenges = (challenges || []).filter((c: any) => c.is_active)

    // Fetch user solves from new 'ctf_submissions' table
    const { data: userSubmissions } = await (supabase
        .from('ctf_submissions' as any) as any)
        .select('challenge_id')
        .eq('member_id', (member as any).id)

    const solvedIds = new Set(userSubmissions?.map((s: any) => s.challenge_id))

    const formattedChallenges = activeChallenges.map((c: any) => ({
        ...c,
        solved: solvedIds.has(c.id)
    }))

    // Fetch leaderboard (Top 10)
    const { data: leaderboard } = await (supabase
        .from('members' as any) as any)
        .select('id, name, points, avatar_url')
        .order('points', { ascending: false })
        .limit(10)

    // Get current user rank via optimized count
    const { count: rankCount } = await (supabase
        .from('members' as any) as any)
        .select('id', { count: 'exact', head: true })
        .gt('points', (member as any).points || 0)

    const userRank = (rankCount || 0) + 1

    return (
        <div className="min-h-screen">
            <CTFClient
                challenges={formattedChallenges as any}
                leaderboard={(leaderboard || []) as any}
                userPoints={(member as any).points || 0}
                userRank={userRank}
            />
        </div>
    )
}
