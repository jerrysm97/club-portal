'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const postSchema = z.object({
    content: z.string().min(1, 'Payload cannot be empty').max(2000, 'Payload exceeds buffer size'),
    type: z.enum(['post', 'resource', 'announcement', 'question']),
    title: z.string().optional()
})

export async function createPost(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const content = formData.get('content') as string
    const type = formData.get('type') as string || 'post'
    const title = formData.get('title') as string || null

    const validated = postSchema.safeParse({ content, type, title })

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.content?.[0] || 'Invalid input' }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized uplink' }

    const { error } = await supabase.from('posts').insert({
        author_id: session.user.id,
        content: validated.data.content,
        title: validated.data.title,
        type: validated.data.type,
        is_public: false // Internal only by default
    })

    if (error) return { error: error.message }

    revalidatePath('/portal/feed')
    revalidatePath('/portal/dashboard')
    return { success: true }
}

export async function toggleReaction(postId: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    // Check if already reacted
    const { data: existing } = await supabase
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('member_id', session.user.id)
        .single()

    if (existing) {
        await supabase.from('post_reactions').delete().eq('id', existing.id)
    } else {
        await supabase.from('post_reactions').insert({
            post_id: postId,
            member_id: session.user.id
        })
    }

    revalidatePath('/portal/feed')
}

export async function addComment(postId: string, content: string) {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    if (!content.trim()) return { error: 'Empty comment' }

    await supabase.from('post_comments').insert({
        post_id: postId,
        author_id: session.user.id,
        content: content.trim()
    })

    revalidatePath('/portal/feed')
    return { success: true }
}
