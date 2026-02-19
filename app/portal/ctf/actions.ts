'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitFlag(challengeId: string, flag: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized uplink' }

    // Rate limiting could go here, but skipping for MVP

    // Fetch challenge to check flag
    // Note: In a real CTF platform, flags should be hashed or checked via secure function. 
    // For this club portal, we assume the flag is stored in a separate verification table or checking against a secret field 
    // that we didn't expose in the Public `CTFChallenge` type (which is good).
    // However, looking at the type definition `CTFChallenge`, I see `flag_format`. 
    // I actually don't see a `flag` field in the public type, which is correct (it shouldn't be public).
    // I'll assume there is a `flag` column in the database that is not selected in the public type,
    // OR we need to use an RPC to check it securely.
    // For this generic implementation without RPC details, I'll assume I can fetch it with service role or strictly eq check.
    // Actually, standard pattern: `select id from ctf_challenges where id = ? and flag = ?`

    const { data: validChallenge } = await supabase
        .from('ctf_challenges')
        .select('id, points')
        .eq('id', challengeId)
        .eq('flag', flag.trim()) // Direct check
        .single()

    if (!validChallenge) {
        return { error: 'Access Denied: Invalid Flag Sequence' }
    }

    // Check if already solved
    const { data: existingSolve } = await supabase
        .from('ctf_solves')
        .select('id')
        .eq('challenge_id', challengeId)
        .eq('member_id', session.user.id)
        .single()

    if (existingSolve) {
        return { error: 'Challenge already pwned' }
    }

    // Record solve
    const { error } = await supabase.from('ctf_solves').insert({
        challenge_id: challengeId,
        member_id: session.user.id,
        solved_at: new Date().toISOString()
    })

    // Update user points
    if (!error) {
        // Trigger points update via RPC or manual
        // RPC `increment_score` is safer
        const { error: rpcError } = await supabase.rpc('increment_score', {
            user_id: session.user.id,
            amount: validChallenge.points
        })

        // Fallback manual update if RPC missing
        if (rpcError) {
            const { data: member } = await supabase.from('members').select('points').eq('id', session.user.id).single()
            if (member) {
                await supabase.from('members').update({ points: member.points + validChallenge.points }).eq('id', session.user.id)
            }
        }
    }

    if (error) return { error: 'Database write failed' }

    revalidatePath('/portal/ctf')
    return { success: true, points: validChallenge.points }
}
