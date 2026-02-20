// lib/supabase-server.ts — Server-only client (SERVICE ROLE KEY — bypasses RLS)
// ⚠️ NEVER use this client in 'use client' components or expose to the browser.
// Use ONLY in API routes, Server Components, and server actions.
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createServerClient() {
    return createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!, // ← service role, NEVER anon key
        { auth: { persistSession: false, autoRefreshToken: false } }
    )
}
