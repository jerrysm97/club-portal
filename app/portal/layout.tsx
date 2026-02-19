// app/portal/layout.tsx — IIMS Collegiate Portal Shell
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/portal/Sidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'
import type { Member } from '@/types/database'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabaseClient()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) redirect('/portal/login')

    const { data: memberData } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

    const member = memberData as unknown as Member | null

    if (!member || member.status === 'pending') redirect('/portal/pending')
    if (member.status === 'rejected' || member.status === 'banned') {
        // If they have a session but are banned/rejected, we should sign them out
        // But middleware handles this more broadly. In layout we just redirect.
        redirect('/portal/login?error=access_denied')
    }

    const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', member.id)
        .eq('is_read', false)

    return (
        <div className="flex min-h-screen bg-[#F9FAFB]">
            {/* Desktop Sidebar */}
            <Sidebar member={member} unreadNotifications={unreadNotifications ?? 0} />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen relative overflow-hidden">
                {/* Background Decor (Subtle) */}
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-gradient-to-bl from-[#58151C]/5 to-transparent pointer-events-none" />

                {/* Mobile Navbar */}
                <PortalNavbar member={member} />

                {/* Main Content Area */}
                <main className="flex-1 p-6 md:p-10 relative z-10">
                    <div className="max-w-6xl mx-auto animate-fade-up">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
