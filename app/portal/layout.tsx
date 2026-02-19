// app/portal/layout.tsx — Portal Shell Layout
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/portal/Sidebar'
import PortalNavbar from '@/components/portal/PortalNavbar'
import type { Member } from '@/types/database'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )

    // Check session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        redirect('/portal/login')
    }

    // Get member data
    const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('id', session.user.id)
        .single()

    // If no member record or pending, middleware handles it, but good to double check
    if (!member || member.status === 'pending') {
        redirect('/portal/pending')
    }

    // Fetch unread notifications count
    const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', session.user.id)
        .eq('is_read', false)

    return (
        <div className="flex min-h-screen bg-[#09090B]">
            {/* Desktop Sidebar */}
            <Sidebar member={member as Member} unreadNotifications={unreadNotifications || 0} />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
                {/* Mobile Navbar */}
                <PortalNavbar member={member as Member} />

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
