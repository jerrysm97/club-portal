// app/api/documents/upload/route.ts
// Document upload API — handles file upload to storage + DB insert using service role key (bypasses RLS)

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function getSession() {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: { get: (name) => cookieStore.get(name)?.value } }
    )
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    return session
}

export async function POST(req: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check member status — must be approved
    const { data: member } = await supabaseAdmin
        .from('members')
        .select('status')
        .eq('user_id', session.user.id)
        .single()

    if (!member || member.status !== 'approved') {
        return NextResponse.json({ error: 'Only approved members can upload documents' }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string | null

    if (!file || !title) {
        return NextResponse.json({ error: 'File and title are required' }, { status: 400 })
    }

    // Determine file type
    const ext = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const fileType = ext === 'docx' ? 'docx' : ext === 'doc' ? 'doc' : 'pdf'

    // Create unique filename
    const fileName = `${session.user.id}/${Date.now()}.${ext}`

    // Upload to storage
    const buffer = Buffer.from(await file.arrayBuffer())
    const { error: uploadError } = await supabaseAdmin.storage
        .from('documents')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: false,
        })

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
        .from('documents')
        .getPublicUrl(fileName)

    // Insert into database (service role bypasses RLS)
    const { error: insertError } = await supabaseAdmin
        .from('documents')
        .insert({
            title,
            file_url: urlData.publicUrl,
            file_type: fileType,
            uploaded_by: session.user.id,
        })

    if (insertError) {
        // Clean up uploaded file if DB insert fails
        await supabaseAdmin.storage.from('documents').remove([fileName])
        return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
