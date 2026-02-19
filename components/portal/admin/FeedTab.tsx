// components/portal/admin/FeedTab.tsx — IIMS Collegiate Transmission Ops
'use client'

import { useState } from 'react'
import { Trash2, Megaphone, Calendar, User, ExternalLink, Link2, Pin, Trash } from 'lucide-react'
import { deletePost } from '@/app/portal/admin/actions'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

export default function FeedTab({ posts, refresh }: { posts: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Purge Transmission? This action is absolute.')) return
        setIsLoading(id)
        const res = await deletePost(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Transmission purged from uplink')
            refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 gap-6">
                {posts.map(post => (
                    <div key={post.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#58151C]/10 transition-all group flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                        post.type === 'announcement' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-gray-50 text-gray-500 border-gray-200"
                                    )}>
                                        {post.type || 'Standard'} Directive
                                    </span>
                                    {post.is_pinned && <Pin className="h-3.5 w-3.5 text-[#C3161C]" />}
                                </div>
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                    {formatDate(post.created_at)}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-poppins font-black text-[#111827] group-hover:text-[#C3161C] transition-colors">
                                    {post.title || 'Untitled Transmission'}
                                </h3>
                                <p className="text-gray-500 font-medium text-sm line-clamp-2 leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            <div className="flex items-center gap-4 pt-4">
                                <Avatar src={post.author?.avatar_url} name={post.author?.full_name} size="xs" />
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Relayed by <span className="text-[#58151C]">{post.author?.full_name || 'System'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <button
                                onClick={() => handleDelete(post.id)}
                                disabled={!!isLoading}
                                className="flex-1 md:w-12 h-12 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-gray-100 shadow-sm"
                                title="Abort Transmission"
                            >
                                <Trash className="h-5 w-5" />
                            </button>
                            <a
                                href={`/portal/feed/${post.id}`}
                                target="_blank"
                                className="flex-1 md:w-12 h-12 bg-gray-50 hover:bg-[#58151C] text-gray-400 hover:text-white rounded-2xl flex items-center justify-center transition-all border border-gray-100 shadow-sm"
                                title="View Frequency"
                            >
                                <ExternalLink className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                ))}

                {posts.length === 0 && (
                    <div className="py-24 text-center bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                        <Megaphone className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-black text-lg uppercase tracking-widest">Uplink Silent</p>
                    </div>
                )}
            </div>
        </div>
    )
}
