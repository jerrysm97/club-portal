// app/api/admin/posts/route.ts
// Admin posts API — POST, PATCH, DELETE.

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
    const session = await assertAdmin()
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { title, content, is_public, pinned } = await req.json()
    const { error } = await supabaseAdmin.from('posts').insert({ title, content, is_public, pinned, author_id: session.user.id })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id, ...fields } = await req.json()
    const { error } = await supabaseAdmin.from('posts').update(fields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await req.json()
    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
