// app/portal/events/actions.ts — IIMS Collegiate Event Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleRsvp(eventId: string, status: 'going' | 'maybe' | 'not_going') {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized uplink' }

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Member identity not found' }

    // Check existing RSVP
    const { data: existing } = await (supabase
        .from('event_rsvps' as any) as any)
        .select('id')
        .eq('event_id', eventId)
        .eq('member_id', (member as any).id)
        .maybeSingle()

    if (existing) {
        if (status === 'not_going') {
            await (supabase.from('event_rsvps' as any) as any).delete().eq('id', (existing as any).id)
        } else {
            await (supabase.from('event_rsvps' as any) as any).update({ status }).eq('id', (existing as any).id)
        }
    } else {
        if (status !== 'not_going') {
            await (supabase.from('event_rsvps' as any) as any).insert({
                event_id: eventId,
                member_id: (member as any).id,
                status
            })
        }
    }

    revalidatePath('/portal/events')
    revalidatePath(`/portal/events/${eventId}`)
    return { success: true }
}
