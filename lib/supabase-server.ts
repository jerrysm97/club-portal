// lib/supabase-server.ts
// Server-side Supabase client for Server Components.
// Uses the service role key to bypass RLS for server-side data fetching.
// This client should ONLY be used in Server Components (no 'use client').

import { createClient } from '@supabase/supabase-js'

export const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
