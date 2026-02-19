// app/portal/feed/page.tsx — Stealth Terminal Feed
import { createClient } from '@/utils/supabase/server'
import PostComposer from '@/components/portal/PostComposer'
import FeedPost from '@/components/portal/FeedPost'
import type { Post } from '@/types/database'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function FeedPage() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) redirect('/portal/login')

    // Get current member info for posting permissions
    const { data: member } = await supabase
        .from('members')
        .select('role')
        .eq('id', session.user.id)
        .single()

    // Fetch posts with author info and counts
    // Note: Supabase doesn't support complex joins and counts easily in one go without a view/function or multiple queries.
    // For simplicity in this demo, we'll fetch posts and author, and maybe separate calls for counts or use a specialized query if we had one.
    // Actually, let's just fetch posts + author for now.
    // To get reactions/counts properly, we might need a custom RPC or view, but let's try standard relations.
    // `count` on foreign tables is supported.

    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
        *,
        author:members(id, full_name, avatar_url),
        post_reactions(count),
        post_comments(count)
    `)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

    // We also need to know if *this* user liked each post.
    // Efficient way: fetch all user's likes for these posts.
    const { data: userLikes } = await supabase
        .from('post_reactions')
        .select('post_id')
        .eq('member_id', session.user.id)

    const likedPostIds = new Set(userLikes?.map(l => l.post_id))

    const formattedPosts: Post[] = (posts || []).map((p: any) => ({
        ...p,
        reaction_count: p.post_reactions?.[0]?.count || 0,
        comment_count: p.post_comments?.[0]?.count || 0,
        user_has_reacted: likedPostIds.has(p.id)
    }))

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-mono font-bold text-[#F8FAFC] mb-2">Intel_Feed</h1>
                <p className="text-[#A1A1AA] font-mono text-sm max-w-xl">
                    Secure communication channel for all operatives.
                    Share insights, resources, and mission updates.
                </p>
            </div>

            <PostComposer userRole={member?.role || 'member'} />

            <div className="space-y-4">
                {formattedPosts.length > 0 ? (
                    formattedPosts.map(post => (
                        <FeedPost key={post.id} post={post} currentUserId={session.user.id} />
                    ))
                ) : (
                    <div className="text-center py-20 border border-dashed border-[#27272A] rounded-sm">
                        <p className="text-[#52525B] font-mono italic">No transmissions found. Be the first to establish contact.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
