// app/portal/ctf/actions.ts — IIMS Collegiate CTF Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitFlag(challengeId: string, flag: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized uplink' }

    // Get current member
    const { data: member } = await supabase
        .from('members')
        .select('id, points')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    // Fetch challenge to check flag
    const { data: challenge } = await (supabase
        .from('ctf_challenges' as any) as any)
        .select('id, points, flag')
        .eq('id', challengeId)
        .single()

    if (!challenge) return { error: 'Challenge invalid or redacted' }

    if ((challenge as any).flag !== flag.trim()) {
        return { error: 'Access Denied: Invalid Flag Sequence' }
    }

    // Check if already solved (using new ctf_submissions table)
    const { data: existingSolve } = await (supabase
        .from('ctf_submissions' as any) as any)
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('member_id', (member as any).id)
        .maybeSingle()

    if (existingSolve) {
        return { error: 'Challenge already pwned by your operative unit' }
    }

    // Record solve in ctf_submissions
    const { error } = await (supabase.from('ctf_submissions' as any) as any).insert({
        challenge_id: challengeId,
        member_id: (member as any).id,
        solved_at: new Date().toISOString()
    })

    if (error) return { error: 'Database write failed during capture' }

    // Update user points - Using a direct update since we have the data
    const newPoints = ((member as any).points || 0) + ((challenge as any).points || 0)
    await (supabase
        .from('members' as any) as any)
        .update({ points: newPoints })
        .eq('id', (member as any).id)

    revalidatePath('/portal/ctf')
    revalidatePath('/portal/dashboard')
    return { success: true, points: challenge.points }
}
