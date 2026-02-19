// app/portal/ctf/page.tsx — Stealth Terminal CTF Arena
import { createClient } from '@/utils/supabase/server'
import CTFClient from '@/components/portal/CTFClient'
import type { CTFChallenge, Member } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function CTFPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Fetch challenges
    const { data: challenges } = await supabase
        .from('ctf_challenges')
        .select('*')
        .eq('is_active', true)

    // Fetch user solves
    const { data: userSolves } = await supabase
        .from('ctf_solves')
        .select('challenge_id')
        .eq('member_id', session.user.id)

    const solvedIds = new Set(userSolves?.map(s => s.challenge_id))

    const formattedChallenges = (challenges || []).map((c: any) => ({
        ...c,
        solved: solvedIds.has(c.id)
    }))

    // Fetch leaderboard (Top 10)
    const { data: leaderboard } = await supabase
        .from('members')
        .select('id, full_name, points, avatar_url')
        .order('points', { ascending: false })
        .limit(10)

    // Get current user rank
    // In a real app with many users, we'd use a more efficient query (e.g., recursive CTE or window function)
    // For small scale, fetching all points or using a count > user.points is fine.
    // Let's do a quick count query for rank.
    const { data: currentUser } = await supabase
        .from('members')
        .select('points')
        .eq('id', session.user.id)
        .single()

    const userPoints = currentUser?.points || 0

    const { count: rankCount } = await supabase
        .from('members')
        .select('id', { count: 'exact', head: true })
        .gt('points', userPoints)

    const userRank = (rankCount || 0) + 1

    return (
        <div className="min-h-screen">
            <CTFClient
                challenges={formattedChallenges as (CTFChallenge & { solved: boolean })[]}
                leaderboard={(leaderboard || []) as Pick<Member, 'id' | 'full_name' | 'points' | 'avatar_url'>[]}
                userPoints={userPoints}
                userRank={userRank}
            />
        </div>
    )
}
