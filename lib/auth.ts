// lib/auth.ts — Auth helpers for IIMS IT Club Portal
// assertRole() is the FIRST call in every admin API route.
import 'server-only'
import { createServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'
import { createServerClient as createSSRClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

type Role = 'member' | 'admin' | 'superadmin'
type MemberRow = Database['public']['Tables']['members']['Row']

/** Get the current session from the request cookies */
export async function getSession() {
    const cookieStore = await cookies()
    const supabase = createSSRClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (name) => cookieStore.get(name)?.value,
                set: () => { },
                remove: () => { },
            },
        }
    )
    const { data: { user } } = await supabase.auth.getUser()
    const session = user ? { user } : null
    return session
}

/**
 * Get the current member from the database.
 * Uses user_id FK (auth.users.id) — NEVER id (members.id).
 */
export async function getMember(userId: string): Promise<MemberRow | null> {
    const supabase = createServerClient()
    const { data, error } = await supabase
        .from('members')
        .select('id, user_id, full_name, email, role, status, club_post, avatar_url, points, program')
        .eq('user_id', userId) // ✅ user_id FK — NEVER .eq('id', userId)
        .single()

    if (error || !data) return null
    return data as unknown as MemberRow
}

/**
 * assertRole — MUST be the first call in every admin API route.
 * Throws on failure — caller handles with try/catch → 403.
 *
 * @example
 * export async function POST(req: NextRequest) {
 *   const member = await assertRole('admin')   // ← First line, always
 *   ...
 * }
 */
export async function assertRole(minRole: Role): Promise<Pick<MemberRow, 'id' | 'role' | 'status'>> {
    const session = await getSession()
    if (!session) throw new Error('UNAUTHENTICATED')

    const supabase = createServerClient()
    const { data: member, error } = await supabase
        .from('members')
        .select('id, role, status')
        .eq('user_id', session.user.id) // ✅ user_id FK — NEVER .eq('id', ...)
        .single()

    if (error || !member) throw new Error('MEMBER_NOT_FOUND')
    if (member.status !== 'approved') throw new Error('NOT_APPROVED')

    const hierarchy: Record<Role, number> = { member: 0, admin: 1, superadmin: 2 }
    const memberRole = member.role as Role
    if (hierarchy[memberRole] < hierarchy[minRole]) {
        throw new Error('INSUFFICIENT_ROLE')
    }

    return member as Pick<MemberRow, 'id' | 'role' | 'status'>
}

/** Standard error response handler for assertRole failures */
export function handleAuthError(err: unknown): Response {
    const message = err instanceof Error ? err.message : 'UNKNOWN_ERROR'
    const statusMap: Record<string, number> = {
        UNAUTHENTICATED: 401,
        MEMBER_NOT_FOUND: 401,
        NOT_APPROVED: 403,
        INSUFFICIENT_ROLE: 403,
    }
    return Response.json(
        { error: message },
        { status: statusMap[message] ?? 500 }
    )
}
