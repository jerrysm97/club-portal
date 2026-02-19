// app/api/auth/register/route.ts — Self-registration (CONTEXT §14)
// Uses untyped raw Supabase admin client to avoid Database generic type constraints on .insert()
import { createClient as createRawClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { registerSchema } from '@/lib/validations'

function createAdminClient() {
    return createRawClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body = await req.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
        }

        const { full_name, email, password, student_id, club_post } = result.data
        const adminClient = createAdminClient()

        // Step 1: Create the Supabase Auth user
        // email_confirm: true skips email verification — admin approval is the gate
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (authError) {
            if (authError.message.toLowerCase().includes('already registered')) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
            }
            throw authError
        }

        // Step 2: Insert the member row
        const { error: memberError } = await adminClient.from('members').insert({
            user_id: authData.user.id,
            full_name,
            email,
            student_id: student_id ?? null,
            club_post: club_post ?? 'General Member',
            role: 'member',
            status: 'pending',
            skills: [],
            points: 0,
        })

        if (memberError) {
            // Rollback: delete auth user to prevent orphaned accounts
            await adminClient.auth.admin.deleteUser(authData.user.id)
            console.error('[register] member insert failed, rolled back auth user:', memberError)
            throw memberError
        }

        return NextResponse.json({ success: true }, { status: 201 })
    } catch (err: unknown) {
        console.error('[register]', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
