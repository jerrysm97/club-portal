// app/portal/feed/page.tsx — IIMS Collegiate Community Feed
import { createServerSupabaseClient } from '@/lib/supabase/server'
import PostComposer from '@/components/portal/PostComposer'
import FeedPost from '@/components/portal/FeedPost'
import type { Post, Member } from '@/types/database'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Rss, Loader2 } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'

export const revalidate = 0

export default async function FeedPage({
    searchParams
}: {
    searchParams: { page?: string, compose?: string }
}) {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 10
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    // Get current member info
    const { data: member } = await (supabase
        .from('members' as any) as any)
        .select('id, role, full_name')
        .eq('user_id', session.user.id)
        .single()

    if (!member) redirect('/portal/login')

    // Fetch posts with author info and counts using .range() for pagination
    const { data: posts, count, error } = await (supabase
        .from('posts' as any) as any)
        .select(`
      *,
      author:members(id, full_name, avatar_url, role),
      post_reactions(count),
      post_comments(count)
    `, { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Feed fetch error:', error)
    }

    // Fetch current user's reactions for these posts
    const postIds = (posts as any || []).map((p: any) => p.id)
    const { data: userLikes } = postIds.length > 0
        ? await (supabase
            .from('post_reactions' as any) as any)
            .select('post_id')
            .eq('member_id', (member as any).id)
            .in('post_id', postIds)
        : { data: [] }

    const likedPostIds = new Set((userLikes as any[])?.map(l => l.post_id))

    const formattedPosts = (posts || []).map((p: any) => ({
        ...p,
        reaction_count: p.post_reactions?.[0]?.count || 0,
        comment_count: p.post_comments?.[0]?.count || 0,
        user_has_reacted: likedPostIds.has(p.id)
    })) as unknown as Post[]

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C3161C]/5 text-[#C3161C] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#C3161C]/10">
                        <Rss className="h-3.5 w-3.5" /> Operations Feed
                    </div>
                    <h1 className="text-4xl font-poppins font-black text-[#111827] leading-tight">
                        Community <span className="text-[#C3161C]">Intel</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-base mt-2 max-w-xl">
                        Secure broadcast channel for club operatives. Sharing insights, mission logs, and sector resources.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile compose link could go here if needed */}
                </div>
            </div>

            <PostComposer
                userRole={(member as any).role}
                memberName={(member as any).full_name.split(' ')[0]}
            />

            <div className="space-y-6">
                {formattedPosts.length > 0 ? (
                    <>
                        {formattedPosts.map(post => (
                            <FeedPost
                                key={post.id}
                                post={post}
                                currentMemberId={(member as any).id}
                            />
                        ))}

                        <div className="py-10">
                            <Pagination
                                page={currentPage}
                                totalPages={Math.ceil((count || 0) / pageSize)}
                                baseUrl="/portal/feed"
                            />
                        </div>
                    </>
                ) : (
                    <div className="py-32 rounded-[3rem] border-2 border-dashed border-gray-100 bg-white shadow-inner text-center animate-fade-up">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Loader2 className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-xl">Sector Silent.</p>
                        <p className="text-gray-300 mt-2 font-medium">Be the first to establish a transmission baseline.</p>
                    </div>
                )}
            </div>

            <footer className="text-center pb-20">
                <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.3em]">
                    End of Current Data Stream
                </p>
            </footer>
        </div>
    )
}
