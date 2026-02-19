// app/api/admin/settings/route.ts
// Admin settings API — PATCH to update site_settings row (id='global').

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function assertAdmin() {
    const cookieStore = cookies()
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

export async function PATCH(req: NextRequest) {
    if (!await assertAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const fields = await req.json()
    const { error } = await supabaseAdmin
        .from('site_settings')
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq('id', 'global')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
}
