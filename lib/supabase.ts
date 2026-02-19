// lib/supabase.ts
// Two Supabase clients:
// 1. A browser client for use in React components (client-side)
// 2. A server client factory for use in middleware and API routes (server-side)

import { createBrowserClient } from '@supabase/ssr'

// Browser client — use this in any 'use client' component
export const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
