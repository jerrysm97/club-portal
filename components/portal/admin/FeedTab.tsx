'use client'

import { Trash2, Pin, Eye, EyeOff } from 'lucide-react'
import { deletePost, togglePinPost } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { Post } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function FeedTab({ posts }: { posts: Post[] }) {

    async function handlePin(post: Post) {
        const res = await togglePinPost(post.id, !post.is_pinned)
        if (res?.error) toast.error(res.error)
        else toast.success(`Post ${post.is_pinned ? 'unpinned' : 'pinned'}`)
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this post?')) return
        const res = await deletePost(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Post deleted')
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Intel_Feed_Control</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Moderate posts and manage announcements.</p>
            </div>

            <div className="space-y-3">
                {posts.map(post => (
                    <div key={post.id} className="p-4 bg-[#111113] border border-[#27272A] rounded-sm flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {post.is_pinned && (
                                    <span className="text-[10px] bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/30 px-1.5 rounded-sm font-mono uppercase">Pinned</span>
                                )}
                                <span className={`text-[10px] border px-1.5 rounded-sm font-mono uppercase ${post.type === 'announcement' ? 'border-[#F43F5E]/30 text-[#F43F5E]' : 'border-[#27272A] text-[#A1A1AA]'
                                    }`}>
                                    {post.type}
                                </span>
                                <span className="text-xs text-[#52525B] font-mono">{formatDate(post.created_at)}</span>
                            </div>
                            <h3 className="text-[#F8FAFC] font-mono font-bold text-sm mb-1">{post.title || 'Untitled Post'}</h3>
                            <p className="text-[#A1A1AA] text-sm line-clamp-2 max-w-2xl">{post.content}</p>
                            <div className="text-xs text-[#52525B] mt-2 font-mono">
                                Author: {post.author?.full_name || 'Unknown'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePin(post)}
                                className={`p-2 rounded-sm transition-colors border ${post.is_pinned
                                        ? 'bg-[#EAB308]/10 text-[#EAB308] border-[#EAB308]/30'
                                        : 'border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC]'
                                    }`}
                                title="Toggle Pin"
                            >
                                <Pin className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(post.id)}
                                className="p-2 rounded-sm border border-[#27272A] text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
