// app/portal/feed/actions.ts — IIMS Collegiate Feed Actions
'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const postSchema = z.object({
    content: z.string().min(1, 'Transmission cannot be empty').max(2000, 'Transmission exceeds buffer size'),
    type: z.enum(['post', 'resource', 'announcement', 'question']),
    title: z.string().optional()
})

export async function createPost(prevState: any, formData: FormData) {
    const supabase = await createServerSupabaseClient()

    const content = formData.get('content') as string
    const type = formData.get('type') as string || 'post'
    const title = formData.get('title') as string || null

    const validated = postSchema.safeParse({ content, type, title })

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors.content?.[0] || 'Invalid input signature' }
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized uplink' }

    // Check if member exists and get their ID
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Operative identity not found' }

    const { error } = await (supabase.from('posts' as any) as any).insert({
        author_id: (member as any).id, // using member.id as author_id per new schema
        content: validated.data.content,
        title: validated.data.title,
        type: validated.data.type,
        is_public: false
    })

    if (error) return { error: error.message }

    revalidatePath('/portal/feed')
    revalidatePath('/portal/dashboard')
    return { success: true }
}

export async function toggleReaction(postId: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Member not found' }

    const { data: existing } = await (supabase
        .from('post_reactions' as any) as any)
        .select('id')
        .eq('post_id', postId)
        .eq('member_id', (member as any).id)
        .maybeSingle()

    if (existing) {
        await (supabase.from('post_reactions' as any) as any).delete().eq('id', (existing as any).id)
    } else {
        await (supabase.from('post_reactions' as any) as any).insert({
            post_id: postId,
            member_id: (member as any).id
        })
    }

    revalidatePath('/portal/feed')
}

export async function addComment(postId: string, content: string) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return { error: 'Unauthorized' }

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('user_id', session.user.id)
        .single()

    if (!member) return { error: 'Member not found' }

    if (!content.trim()) return { error: 'Empty transmission' }

    await (supabase.from('comments' as any) as any).insert({
        post_id: postId,
        author_id: (member as any).id,
        content: content.trim()
    })

    revalidatePath('/portal/feed')
    return { success: true }
}
