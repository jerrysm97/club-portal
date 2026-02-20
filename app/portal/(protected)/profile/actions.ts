// app/portal/profile/actions.ts — Member Profile Operations (v4.0)
'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const profileSchema = z.object({
    full_name: z.string().min(2, "Name must be at least 2 characters").max(60).optional(),
    bio: z.string().max(500, "Bio cannot exceed 500 characters").optional().or(z.literal('')),
    github_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal('')),
    skills: z.string().optional() // Comma separated list of skills
})

export async function updateProfile(formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized access' }

    const rawData = {
        full_name: formData.get('full_name')?.toString() || '',
        bio: formData.get('bio')?.toString() || '',
        github_url: formData.get('github_url')?.toString() || '',
        linkedin_url: formData.get('linkedin_url')?.toString() || '',
        skills: formData.get('skills')?.toString() || ''
    }

    try {
        const validated = profileSchema.parse(rawData)

        const skillsArray = validated.skills
            ? validated.skills.split(',').map(s => s.trim()).filter(Boolean)
            : []

        const updatePayload: any = {
            full_name: validated.full_name || null,
            bio: validated.bio || null,
            github_url: validated.github_url || null,
            linkedin_url: validated.linkedin_url || null,
            skills: skillsArray.length > 0 ? skillsArray : null,
        }

        const supabase = createServerClient()

        const { error } = await supabase
            .from('members')
            .update(updatePayload)
            .eq('id', session.user.id)

        if (error) {
            console.error('Profile update error:', error)
            return { error: 'Failed to synchronize profile data.' }
        }

        revalidatePath('/portal/profile')
        return { success: true }

    } catch (e) {
        if (e instanceof z.ZodError) {
            return { error: e.issues[0].message }
        }
        return { error: 'Invalid payload submitted' }
    }
}

export async function uploadAvatar(formData: FormData) {
    const session = await getSession()
    if (!session) return { error: 'Unauthorized access' }

    const file = formData.get('file') as File
    if (!file || file.size === 0) return { error: 'No image file provided' }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) return { error: 'Avatar must be less than 2MB' }

    // Validate type
    if (!file.type.startsWith('image/')) return { error: 'Only image files are allowed' }

    const supabase = createServerClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
    const filePath = `${session.user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('team-avatars')
        .upload(filePath, file, { upsert: true })

    if (uploadError) {
        console.error('Avatar upload failed:', uploadError)
        return { error: 'Failed to upload profile image to storage' }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
        .from('team-avatars')
        .getPublicUrl(filePath)

    // Update member record
    const { error: updateError } = await supabase
        .from('members')
        .update({ avatar_url: publicUrl })
        .eq('id', session.user.id)

    if (updateError) {
        return { error: 'Avatar uploaded but profile link failed' }
    }

    revalidatePath('/portal/profile')
    return { success: true, url: publicUrl }
}
