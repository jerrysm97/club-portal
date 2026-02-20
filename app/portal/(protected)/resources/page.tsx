// app/portal/resources/page.tsx — IIMS Collegiate Mission Archives
import { createServerSupabaseClient } from '@/lib/supabase/server'
import ResourcesClient from '@/components/portal/ResourcesClient'
// Import types safely
type Document = any
type Member = any
import { redirect } from 'next/navigation'
import Pagination from '@/components/ui/Pagination'

export const revalidate = 0

export default async function ResourcesPage({
    searchParams
}: {
    searchParams: { page?: string }
}) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 12
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('role')
        .eq('id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Fetch documents with .range() for pagination
    const { data: docs, count } = await (supabase
        .from('documents' as any) as any)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <ResourcesClient
                initialDocs={(docs || []) as Document[]}
                userRole={(member as any).role}
            />

            {count && count > pageSize && (
                <div className="py-12 border-t border-gray-50">
                    <Pagination
                        page={currentPage}
                        totalPages={Math.ceil(count / pageSize)}
                        baseUrl="/portal/resources"
                    />
                </div>
            )}

            <footer className="text-center pb-20 opacity-20">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Archive End Point</p>
            </footer>
        </div>
    )
}
