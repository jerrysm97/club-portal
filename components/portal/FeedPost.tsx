// components/portal/FeedPost.tsx — IIMS Collegiate Feed Item
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { formatDate, cn } from '@/lib/utils'
import { MessageSquare, Heart, Share2, MoreHorizontal, Megaphone, FileText, ShieldCheck, ChevronRight } from 'lucide-react'
import { toggleReaction } from '@/app/portal/feed/actions'
import type { Post } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

interface FeedPostProps {
    post: Post
    currentMemberId: string // Ensure this is member.id
}

export default function FeedPost({ post, currentMemberId }: FeedPostProps) {
    const [liked, setLiked] = useState(post.user_has_reacted)
    const [likesCount, setLikesCount] = useState(post.reaction_count || 0)
    const [commentsCount, setCommentsCount] = useState(post.comment_count || 0)

    // Real-time subscription for counts & reactions
    useEffect(() => {
        const supabase = createClient()

        // Subscribe to reactions table for this post
        const reactionChannel = supabase.channel(`post-reactions-${post.id}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'post_reactions',
                filter: `post_id=eq.${post.id}`
            }, async () => {
                // Refresh counts on change — simpler than manual diffing for this scale
                const { count } = await supabase
                    .from('post_reactions')
                    .select('*', { count: 'exact', head: true })
                    .eq('post_id', post.id)

                setLikesCount(count || 0)
            })
            .subscribe()

        // Subscribe to comments table for this post
        const commentChannel = supabase.channel(`post-comments-${post.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'post_comments',
                filter: `post_id=eq.${post.id}`
            }, async () => {
                const { count } = await supabase
                    .from('post_comments')
                    .select('*', { count: 'exact', head: true })
                    .eq('post_id', post.id)
                setCommentsCount(count || 0)
            })
            .subscribe()

        return () => {
            reactionChannel.unsubscribe()
            commentChannel.unsubscribe()
        }
    }, [post.id])

    async function handleLike() {
        const newLiked = !liked
        const newCount = newLiked ? likesCount + 1 : likesCount - 1

        setLiked(newLiked)
        setLikesCount(newCount)

        await toggleReaction(post.id)
    }

    const isAnnouncement = post.type === 'announcement'
    const isResource = post.type === 'resource'

    return (
        <div className={cn(
            "relative p-8 rounded-[2rem] border transition-all animate-fade-up group hover:shadow-2xl",
            isAnnouncement
                ? "bg-[#58151C]/5 border-[#58151C]/10 shadow-lg"
                : "bg-white border-gray-100 shadow-sm hover:border-[#58151C]/10"
        )}>
            {/* Visual Indicator for Priority */}
            {isAnnouncement && (
                <div className="absolute -top-3 left-10 px-4 py-1 rounded-full bg-[#C3161C] text-white text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2">
                    <Megaphone className="h-3 w-3" /> Priority Broadcast
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <Avatar
                        src={(post.author as any)?.avatar_url}
                        name={(post.author as any)?.full_name || 'Operative'}
                        size="md"
                        className="ring-2 ring-white shadow-md group-hover:scale-105 transition-transform"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#111827] font-poppins font-bold text-sm">
                                {(post.author as any)?.full_name}
                            </span>
                            {(post.author as any)?.role === 'admin' && (
                                <ShieldCheck className="h-3.5 w-3.5 text-[#C3161C]" />
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                {formatDate(post.created_at)}
                            </span>
                            {isResource && (
                                <>
                                    <span className="h-1 w-1 rounded-full bg-gray-200" />
                                    <span className="flex items-center gap-1 text-blue-600 text-[10px] font-black uppercase tracking-widest">
                                        <FileText className="h-3 w-3" /> Intel Resource
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <button className="p-2 rounded-xl text-gray-300 hover:text-[#58151C] hover:bg-gray-50 transition-all">
                    <MoreHorizontal className="h-5 w-5" />
                </button>
            </div>

            {/* Content */}
            <div className="mb-8">
                {post.title && (
                    <h3 className="text-xl font-poppins font-bold text-[#111827] mb-3 group-hover:text-[#C3161C] transition-colors">
                        {post.title}
                    </h3>
                )}
                <div className="text-gray-600 font-medium text-base leading-relaxed whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-50">
                <button
                    onClick={handleLike}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                        liked
                            ? "text-[#C3161C] bg-[#C3161C]/5 shadow-inner"
                            : "text-gray-400 hover:text-[#C3161C] hover:bg-red-50"
                    )}
                >
                    <Heart className={cn("h-4.5 w-4.5 transition-transform", liked ? "fill-current scale-110" : "group-hover:scale-110")} />
                    <span>{likesCount}</span>
                </button>

                <Link
                    href={`/portal/feed/${post.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                    <MessageSquare className="h-4.5 w-4.5" />
                    <span>{commentsCount}</span>
                </Link>

                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#58151C] hover:bg-gray-50 transition-all ml-auto">
                    <Share2 className="h-4.5 w-4.5" />
                    <span className="hidden sm:inline">BroadCast</span>
                </button>

                <Link
                    href={`/portal/feed/${post.id}`}
                    className="p-2 rounded-full bg-gray-50 text-gray-300 hover:text-[#58151C] hover:bg-[#58151C]/5 transition-all"
                >
                    <ChevronRight className="h-5 w-5" />
                </Link>
            </div>
        </div>
    )
}
