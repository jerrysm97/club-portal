'use client'

import { useState } from 'react'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { formatDate } from '@/lib/utils'
import { MessageSquare, Heart, Share2, MoreHorizontal, AlertTriangle, FileText } from 'lucide-react'
import { toggleReaction } from '@/app/portal/feed/actions'
import type { Post } from '@/types/database'
import { useOptimistic } from 'react'

interface FeedPostProps {
    post: Post
    currentUserId: string
}

export default function FeedPost({ post, currentUserId }: FeedPostProps) {
    const [liked, setLiked] = useState(post.user_has_reacted)
    const [likesCount, setLikesCount] = useState(post.reaction_count || 0)

    // Optimistic UI could be improved here, but simple state handling for "toggle" feel is good enough for now
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
        <div className={`
        relative p-6 rounded-sm border mb-4 animate-fade-up transition-all
        ${isAnnouncement ? 'bg-[#111113] border-[#EAB308]/30 shadow-[0_0_15px_-3px_rgba(234,179,8,0.1)]' : 'bg-[#09090B] border-[#27272A] hover:border-[#3F3F46]'}
    `}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <Avatar
                        src={post.author?.avatar_url}
                        name={post.author?.full_name || 'Generic Operative'}
                        className="w-10 h-10 border border-[#27272A]"
                    />
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-[#F8FAFC] font-mono font-bold text-sm">{post.author?.full_name}</span>
                            {isAnnouncement && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-[#EAB308]/10 text-[#EAB308] text-[10px] uppercase font-mono border border-[#EAB308]/20 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" /> Priority
                                </span>
                            )}
                            {isResource && (
                                <span className="px-1.5 py-0.5 rounded-sm bg-[#8B5CF6]/10 text-[#8B5CF6] text-[10px] uppercase font-mono border border-[#8B5CF6]/20 flex items-center gap-1">
                                    <FileText className="h-3 w-3" /> Resource
                                </span>
                            )}
                        </div>
                        <span className="text-[#52525B] font-mono text-xs">{formatDate(post.created_at)}</span>
                    </div>
                </div>

                <button className="text-[#52525B] hover:text-[#F8FAFC]">
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            {/* Content */}
            <div className="mb-4">
                {post.title && <h3 className="text-[#F8FAFC] font-bold font-mono text-lg mb-2">{post.title}</h3>}
                <div className="text-[#A1A1AA] font-mono text-sm whitespace-pre-wrap leading-relaxed">
                    {post.content}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-[#27272A]/50">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-xs font-mono font-bold transition-colors ${liked ? 'text-[#F43F5E]' : 'text-[#52525B] hover:text-[#F43F5E]'}`}
                >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    <span>{likesCount}</span>
                </button>

                <button className="flex items-center gap-2 text-xs font-mono font-bold text-[#52525B] hover:text-[#10B981] transition-colors">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comment_count || 0}</span>
                </button>

                <button className="flex items-center gap-2 text-xs font-mono font-bold text-[#52525B] hover:text-[#F8FAFC] transition-colors ml-auto">
                    <Share2 className="h-4 w-4" />
                    <span>SHARE</span>
                </button>
            </div>
        </div>
    )
}
