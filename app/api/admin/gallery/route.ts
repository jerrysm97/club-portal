// app/api/admin/gallery/route.ts — Admin Gallery API (v4.0 Spec-Compliant)
import { NextRequest, NextResponse } from 'next/server'
import { assertRole } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { z } from 'zod'

const createGallerySchema = z.object({
    url: z.string().url(),
    caption: z.string().max(300).optional(),
    event_id: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = createGallerySchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const supabase = createServerClient()
    const { error } = await (supabase.from('gallery_images' as any) as any).insert({
        ...parsed.data,
        uploader_id: admin.id,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await (supabase.from('audit_logs' as any) as any).insert({
        actor_id: admin.id,
        action: 'upload_gallery',
        details: { caption: parsed.data.caption }
    })

    return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const parsed = z.object({
        id: z.string().uuid(),
        caption: z.string().max(300).optional(),
    }).safeParse(body)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { id, ...fields } = parsed.data
    const supabase = createServerClient()
    const { error } = await (supabase.from('gallery_images' as any) as any).update(fields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    const admin = await assertRole('admin')
    const body = await req.json()
    const { id } = z.object({ id: z.string().uuid() }).parse(body)

    const supabase = createServerClient()

    // Fetch image URL before deleting to clean up storage
    const { data: image } = await (supabase
        .from('gallery_images' as any) as any)
        .select('url')
        .eq('id', id)
        .single()

    if (image?.url?.includes('/storage/v1/object/public/public-gallery/')) {
        const path = image.url.split('/storage/v1/object/public/public-gallery/')[1]
        if (path) await supabase.storage.from('public-gallery').remove([path])
    }

    const { error } = await (supabase.from('gallery_images' as any) as any).delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await (supabase.from('audit_logs' as any) as any).insert({
        actor_id: admin.id,
        action: 'delete_gallery',
        target_id: id,
    })

    return NextResponse.json({ success: true })
}
