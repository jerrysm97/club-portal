'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleRsvp(eventId: string, status: 'going' | 'maybe' | 'not_going') {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }

    // Check existing RSVP
    const { data: existing } = await supabase
        .from('event_rsvps')
        .select('id')
        .eq('event_id', eventId)
        .eq('member_id', session.user.id)
        .single()

    if (existing) {
        if (status === 'not_going') {
            await supabase.from('event_rsvps').delete().eq('id', existing.id)
        } else {
            await supabase.from('event_rsvps').update({ status }).eq('id', existing.id)
        }
    } else {
        if (status !== 'not_going') {
            await supabase.from('event_rsvps').insert({
                event_id: eventId,
                member_id: session.user.id,
                status
            })
        }
    }

    revalidatePath('/portal/events')
    revalidatePath(`/portal/events/${eventId}`)
    return { success: true }
}
