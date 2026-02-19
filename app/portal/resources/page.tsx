// app/portal/resources/page.tsx — Stealth Terminal Resources
import { createClient } from '@/utils/supabase/server'
import ResourcesClient from '@/components/portal/ResourcesClient'
import type { Document } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function ResourcesPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('id', session.user.id)
        .single()

    const { data: docs } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="max-w-6xl mx-auto py-8">
            <ResourcesClient initialDocs={(docs || []) as Document[]} userRole={member?.role || 'member'} />
        </div>
    )
}
