// app/portal/(protected)/layout.tsx — Auth gate for approved members only
// This layout ONLY wraps pages inside (protected)/ — login, pending, register
// are OUTSIDE this route group, preventing infinite redirect loops.
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/portal/Sidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'
import type { Member } from '@/types/database'

export default async function ProtectedPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createServerSupabaseClient()

    // ── Step 1: Verify session ──
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/portal/login')

    // ── Step 2: Fetch member and check status ──
    // Use admin client to bypass RLS and guarantee we get the member profile
    const adminSupabase = createAdminSupabaseClient()
    const { data: memberData } = await adminSupabase
        .from('members')
        .select('id, user_id, full_name, email, student_id, club_post, role, status, bio, avatar_url, skills, points, joined_at, updated_at')
        .eq('user_id', user.id)
        .single()

    const member = memberData as unknown as Member | null

    // Redirects go OUTSIDE (protected)/ — no infinite loop possible
    if (!member) redirect('/portal/pending')

    if (member.status === 'pending' && !['admin', 'superadmin'].includes(member.role)) {
        redirect('/portal/pending')
    }
    if (member.status === 'rejected') redirect('/portal/login?reason=rejected')
    if (member.status === 'banned') redirect('/portal/login?reason=banned')

    // ── Step 3: Fetch unread notification count ──
    const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('member_id', member.id)
        .eq('is_read', false)

    // ── Step 4: Render portal shell ──
    return (
        <div className="flex min-h-screen bg-black">
            {/* Desktop Sidebar */}
            <Sidebar member={member} unreadNotifications={unreadNotifications ?? 0} />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative overflow-hidden">
                {/* Mobile Navbar */}
                <PortalNavbar member={member} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 relative z-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
