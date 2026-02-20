// app/portal/notifications/page.tsx — IIMS Collegiate System Alerts
import { createServerSupabaseClient } from '@/lib/supabase/server'
import NotificationsList from '@/components/portal/NotificationsList'
// Import types safely
type Notification = any
type Member = any
import { redirect } from 'next/navigation'
import { ShieldCheck, Megaphone } from 'lucide-react'

export const revalidate = 0

export default async function NotificationsPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Get current member
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id')
        .eq('id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Fetch notifications using the new member_id field
    const { data: notifications } = await (supabase
        .from('notifications' as any) as any)
        .select('*')
        .eq('member_id', (member as any).id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#10B981]/5 text-[#10B981] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#10B981]/10">
                        <ShieldCheck className="h-3.5 w-3.5" /> High-Clearance Inbox
                    </div>
                    <h1 className="text-4xl md:text-5xl font-poppins font-black text-[#111827] leading-tight">
                        System <span className="text-[#C3161C]">Directives</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-base mt-2 max-w-xl">
                        Automated mission alerts, unit transmissions, and urgent sector updates logged in real-time.
                    </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl flex items-center gap-4 border border-gray-100">
                    <Megaphone className="h-6 w-6 text-[#58151C] opacity-30" />
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Live Feed Active
                    </div>
                </div>
            </div>

            <NotificationsList initialNotifications={(notifications || []) as unknown as Notification[]} />

            <footer className="text-center pt-10">
                <p className="text-[10px] text-gray-200 font-black uppercase tracking-[0.4em]">
                    End of Active Notifications Log
                </p>
            </footer>
        </div>
    )
}
