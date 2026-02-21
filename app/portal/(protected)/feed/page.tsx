// app/portal/(protected)/feed/page.tsx — IIMS IT Club Feed Page (v4.0)
import { createServerClient } from '@/lib/supabase-server'
import PostComposer from '@/components/portal/PostComposer'
import FeedPost from '@/components/portal/FeedPost'
import { redirect } from 'next/navigation'
import { Rss, Loader2, Sparkles } from 'lucide-react'
import Pagination from '@/components/ui/Pagination'
import { getSession, getMember } from '@/lib/auth'



export default async function FeedPage(props: {
    searchParams: Promise<{ page?: string }>
}) {
    const searchParams = await props.searchParams
    const session = await getSession()
    if (!session) redirect('/portal/login')

    const member = await getMember(session.user.id)
    if (!member) redirect('/portal/pending')

    const currentPage = parseInt(searchParams.page || '1')
    const pageSize = 10
    const from = (currentPage - 1) * pageSize
    const to = from + pageSize - 1

    const supabase = createServerClient()

    // Fetch posts with author info and exact counts
    // Using manual count resolution due to older Supabase JS behavior
    let { data: posts, count, error } = await (supabase
        .from('posts' as any) as any)
        .select('id, author_id, title, content, type, is_pinned, created_at, updated_at', { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (error) {
        console.error('Core feed fetch error:', error)
        posts = []
    }

    const postIds = (posts || []).map((p: any) => p.id)
    let userLikes: any[] = []

    if (postIds.length > 0) {
        try {
            // Fetch User's reactions, all reactions for the posts, and all comments for the posts in parallel
            const [
                { data: likesData },
                { data: allReactions },
                { data: allComments }
            ] = await Promise.all([
                supabase.from('post_reactions').select('post_id').eq('member_id', member.id).in('post_id', postIds),
                supabase.from('post_reactions').select('post_id').in('post_id', postIds),
                supabase.from('post_comments').select('post_id').in('post_id', postIds)
            ])

            userLikes = likesData || []

            posts = (posts || []).map((p: any) => {
                const rCount = allReactions?.filter((r: any) => r.post_id === p.id).length || 0
                const cCount = allComments?.filter((c: any) => c.post_id === p.id).length || 0

                return {
                    ...p,
                    reaction_count: rCount,
                    comment_count: cCount,
                    author: {
                        ...p.author,
                        name: p.author?.full_name // Mapping full_name to name for UI
                    }
                }
            })
        } catch (e) {
            console.error('Failed to resolve posts data in memory:', e)
        }
    }

    const likedPostIds = new Set((userLikes || []).map(l => l.post_id))

    const formattedPosts = (posts || []).map((p: any) => ({
        ...p,
        user_has_reacted: likedPostIds.has(p.id)
    }))

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#FAFAFA] text-[#111111] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#111111]/10">
                        <Rss className="h-3.5 w-3.5" /> Club Feed
                    </div>
                    <h1 className="text-3xl font-bold text-[#212121] leading-tight">
                        Community <span className="text-[#E53935]">Discussions</span>
                    </h1>
                    <p className="text-[#757575] font-medium text-sm mt-2 max-w-xl">
                        Share ideas, resources, and stay up to date with the latest ICEHC announcements.
                    </p>
                </div>
            </div>

            <PostComposer
                userRole={member.role}
                memberName={(member.full_name || 'Member').split(' ')[0]}
            />

            <div className="space-y-6">
                {formattedPosts.length > 0 ? (
                    <>
                        {formattedPosts.map((post: any) => (
                            <FeedPost
                                key={post.id}
                                post={post}
                                currentMemberId={member.id}
                            />
                        ))}

                        {count && count > pageSize && (
                            <div className="pt-8">
                                <Pagination
                                    page={currentPage}
                                    totalPages={Math.ceil(count / pageSize)}
                                    baseUrl="/portal/feed"
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-24 rounded-sm border border-dashed border-[#E0E0E0] bg-white shadow-sm text-center">
                        <div className="h-16 w-16 bg-[#F8F9FA] rounded-sm flex items-center justify-center mx-auto mb-5 border border-[#E0E0E0]">
                            <Sparkles className="h-8 w-8 text-[#9E9E9E]" />
                        </div>
                        <p className="text-[#424242] font-bold text-lg mb-1">It's quiet in here.</p>
                        <p className="text-[#9E9E9E] font-medium text-sm">Be the first to share an update with the club.</p>
                    </div>
                )}
            </div>

            <footer className="text-center pt-8 border-t border-[#E0E0E0]">
                <p className="text-[10px] text-[#9E9E9E] font-bold uppercase tracking-widest">
                    End of Feed Activity
                </p>
            </footer>
        </div>
    )
}
