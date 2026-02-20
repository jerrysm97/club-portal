// app/portal/resources/actions.ts — IIMS Collegiate Resource Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadDocument(prevState: any, formData: FormData) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null

    if (!session) return { error: 'Unauthorized uplink' }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string

    if (!title || !url) return { error: 'All primary fields required' }

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id, role')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    const { error } = await (supabase.from('documents' as any) as any).insert({
        uploader_id: (member as any).id,
        title,
        description,
        file_url: url,
        category,
        is_public: true
    })

    if (error) return { error: 'Archive write failed' }

    revalidatePath('/portal/resources')
    return { success: true }
}

export async function deleteDocument(id: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    if (!session) return { error: 'Unauthorized' }

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('role')
        .eq('user_id', session.user.id)
        .single()

    if (!['bod', 'admin', 'superadmin'].includes((member as any)?.role || '')) {
        return { error: 'Insufficient clearance' }
    }

    const { error } = await (supabase.from('documents' as any) as any).delete().eq('id', id)
    if (error) return { error: 'Redaction failed' }

    revalidatePath('/portal/resources')
    return { success: true }
}
