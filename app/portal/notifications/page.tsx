// app/portal/notifications/page.tsx — Stealth Terminal System Logs
import { createClient } from '@/utils/supabase/server'
import NotificationsList from '@/components/portal/NotificationsList'
import type { Notification } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-mono font-bold text-[#F8FAFC] mb-2">System_Logs</h1>
                <p className="text-[#A1A1AA] font-mono text-sm max-w-xl">
                    Recent alerts, mission updates, and system messages.
                </p>
            </div>

            <NotificationsList initialNotifications={(notifications || []) as Notification[]} />
        </div>
    )
}
