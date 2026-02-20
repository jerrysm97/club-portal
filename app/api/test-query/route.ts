import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = createServerClient()
    const { data, error } = await supabase
        .from('members')
        .select('id, full_name, avatar_url, club_post, role, bio, skills, points, created_at')
        .eq('status', 'approved')
        .order('points', { ascending: false })
    return NextResponse.json({ members: data, error })
}
