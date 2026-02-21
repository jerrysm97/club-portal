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
    const category = formData.get('category') as string
    const file = formData.get('file') as File | null

    if (!title || !file) return { error: 'Title and File are required' }

    // 10MB limit enforcement
    if (file.size > 10 * 1024 * 1024) {
        return { error: 'File size exceeds 10MB limit' }
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const allowedExts = ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg', 'webp']
    if (!allowedExts.includes(ext)) {
        return { error: 'Invalid format. Allowed: PDF, Word, Images' }
    }

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id, role')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    // Upload to Storage
    const fileName = `resources/${session.user.id}/${Date.now()}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabase.storage
        .from('portal_documents')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (uploadError) return { error: 'Storage archive failed: ' + uploadError.message }

    const { data: urlData } = supabase.storage
        .from('portal_documents')
        .getPublicUrl(fileName)

    const { error } = await (supabase.from('documents' as any) as any).insert({
        uploader_id: (member as any).id,
        title,
        description,
        file_url: urlData.publicUrl,
        category,
        is_public: true
    })

    if (error) return { error: 'Archive Database write failed' }

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
        .select('id, role')
        .eq('user_id', session.user.id)
        .single()

    // Enforce Ownership/Access Control
    const { data: doc } = await (supabase
        .from('documents' as any) as any)
        .select('uploader_id, file_url')
        .eq('id', id)
        .single()

    if (!doc) return { error: 'Document not found' }

    // Superadmins/Admins can delete anything. Authors can delete their own.
    const isAuthor = doc.uploader_id === (member as any).id
    const isPrivileged = ['admin', 'superadmin', 'president'].includes((member as any).role)

    if (!isAuthor && !isPrivileged) {
        return { error: 'Insufficient clearance to redact other members\' documents' }
    }

    // Attempt to purge from Storage Bucket
    const fileUrlStr = doc.file_url || ''
    const match = fileUrlStr.match(/portal_documents\/(.+)$/)
    if (match && match[1]) {
        await supabase.storage.from('portal_documents').remove([match[1]])
    }

    // Delete Database Record
    const { error } = await (supabase.from('documents' as any) as any).delete().eq('id', id)
    if (error) return { error: 'Database Redaction failed' }

    revalidatePath('/portal/resources')
    return { success: true }
}
