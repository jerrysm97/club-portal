// app/api/admin/gallery/route.ts
// Admin gallery API — POST, PATCH (caption), DELETE (also removes from storage).

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function assertAdmin() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null
    const { data } = await supabaseAdmin.from('members').select('role').eq('id', session.user.id).single()
    return data?.role === 'admin' ? session : null
}

export async function POST(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { image_url, caption, sort_order } = await req.json()
    const { error } = await supabaseAdmin.from('public_gallery').insert({ image_url, caption, sort_order })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id, caption } = await req.json()
    const { error } = await supabaseAdmin.from('public_gallery').update({ caption }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id, image_url } = await req.json()

    // Remove from storage bucket if URL is from our Supabase storage
    if (image_url?.includes('/storage/v1/object/public/gallery/')) {
        const path = image_url.split('/storage/v1/object/public/gallery/')[1]
        await supabaseAdmin.storage.from('gallery').remove([path])
    }

    const { error } = await supabaseAdmin.from('public_gallery').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
