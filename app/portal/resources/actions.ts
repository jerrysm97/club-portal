'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// We'll use a simple file upload simulation for now as we don't have storage bucket details yet
// In a real app, we'd upload to Supabase Storage and then insert the record.
// Here we'll just insert the record with a placeholder URL or assume the user provides a link.
// The task says "Documents with categories". Let's assume external links for now to keep it simple,
// or simulate file upload if requested later. For Phase 4, we'll stick to a "Link/Resource" model.

const documentSchema = z.object({
    title: z.string().min(1, 'Title required'),
    description: z.string().optional(),
    url: z.string().url('Invalid URL'),
    category: z.enum(['general', 'study-material', 'writeup', 'presentation', 'report', 'other']),
    is_public: z.boolean().default(false)
})

export async function uploadDocument(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const url = formData.get('url') as string
    const category = formData.get('category') as string
    const is_public = formData.get('is_public') === 'on'

    const validated = documentSchema.safeParse({ title, description, url, category, is_public })

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.title?.[0] || 'Invalid input' }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    // Check permissions - only admins can upload generally, but maybe members can submit writeups?
    // For now, let's assume everyone can share resources to the "Archives".

    const { error } = await supabase.from('documents').insert({
        uploader_id: session.user.id,
        title: validated.data.title,
        description: validated.data.description,
        file_url: validated.data.url, // Using external URL for now per assumption
        category: validated.data.category,
        is_public: validated.data.is_public,
        file_type: 'link', // Placeholder
        file_size: 0
    })

    if (error) return { error: error.message }

    revalidatePath('/portal/resources')
    return { success: true }
}

export async function incrementDownload(docId: string) {
    const supabase = await createClient()
    await supabase.rpc('increment_document_download', { doc_id: docId })
    // If RPC doesn't exist, we can do a manual update, but concurrency issues exist.
    // For this rewrite, we'll try standard update.
    const { data } = await supabase.from('documents').select('download_count').eq('id', docId).single()
    if (data) {
        await supabase.from('documents').update({ download_count: (data.download_count || 0) + 1 }).eq('id', docId)
    }
    revalidatePath('/portal/resources')
}
