'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markNotificationRead(notificationId: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', session.user.id)

    revalidatePath('/portal')
    return { success: true }
}

export async function markAllNotificationsRead() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) return { error: 'Unauthorized' }

    await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', session.user.id)
        .eq('is_read', false)

    revalidatePath('/portal')
    return { success: true }
}
