// app/api/admin/upload/route.ts
// General file upload to Supabase Storage — returns public URL

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

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('bucket') as string) || 'events'

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage
        .from(bucket)
        .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(filename)

    return NextResponse.json({ url: urlData.publicUrl })
}
