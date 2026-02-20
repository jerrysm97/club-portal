// app/portal/(protected)/layout.tsx — Auth gate for approved members only
import { redirect } from 'next/navigation'
import Sidebar from '@/components/portal/Sidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'
import { getSession, getMember } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'

export default async function ProtectedPortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // ── Step 1: Verify authenticated ──
    const session = await getSession()
    if (!session) redirect('/portal/login')

    // ── Step 2: Fetch and verify member ──
    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    // middleware.ts handles actual routing lockouts, but this acts as an
    // extra layout-level guard guaranteeing that if status !== 'approved',
    // they shouldn't see the portal shell (except admins evaluating others).
    if (member.status === 'pending') {
        if (!['admin', 'superadmin'].includes(member.role)) {
            // Profile complete checking is done in pending/page.tsx
            redirect('/portal/pending')
        }
    }
    if (member.status === 'rejected') redirect('/portal/login?reason=rejected')
    if (member.status === 'banned') redirect('/portal/login?reason=banned')

    // ── Step 3: Fetch unread count efficiently ──
    const supabase = createServerClient()
    const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id) // using user_id per DB schema
        .eq('is_read', false)

    // ── Step 4: Render Shell ──
    return (
        <div className="flex min-h-screen bg-[#F8F9FA]">
            {/* Desktop Sidebar */}
            <Sidebar
                member={member}
                unreadNotifications={unreadNotifications ?? 0}
            />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative overflow-hidden">
                {/* Mobile Navbar */}
                <PortalNavbar member={member} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 relative z-10 transition-all duration-300">
                    <div className="max-w-6xl mx-auto mt-2 md:mt-0">
                        {children}
                    </div>
                </main>
            </div>

            {/* Background design elements across portal */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[#1A237E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10" />
            <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-[#E53935]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none -z-10" />
        </div>
    )
}
