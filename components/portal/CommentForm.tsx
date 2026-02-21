// components/portal/CommentForm.tsx — IIMS IT Club Discussion Engine (v4.0)
'use client'

import { useState } from 'react'
import { addComment } from '@/app/portal/(protected)/feed/actions'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Avatar from '@/components/ui/Avatar'

interface CommentFormProps {
    postId: string
    userAvatar?: string
    userName?: string
}

export default function CommentForm({ postId, userAvatar, userName }: CommentFormProps) {
    const [content, setContent] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!content.trim() || isSubmitting) return

        setIsSubmitting(true)
        try {
            const res = await addComment(postId, content)
            if (res?.error) {
                toast.error(res.error)
            } else {
                setContent('')
                toast.success('Your voice has been heard')
            }
        } catch (err) {
            toast.error('Failed to broadcast comment')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex gap-4 p-4 rounded-sm bg-[#F8F9FA] border border-[#E0E0E0] shadow-sm mb-8 animate-fade-in">
            <Avatar src={userAvatar} name={userName || 'Me'} size="sm" className="hidden sm:block" />
            <div className="flex-1 relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Join the discussion... (Press Enter to post)"
                    disabled={isSubmitting}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSubmit(e)
                        }
                    }}
                    className="w-full bg-white border border-[#E0E0E0] rounded-sm py-2 px-3 pr-12 text-sm font-medium focus:ring-4 focus:ring-[#111111]/5 focus:border-[#111111]/30 transition-all outline-none resize-none min-h-[40px] text-[#212121] placeholder:text-[#9E9E9E]"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#111111] hover:text-[#C8102E] disabled:opacity-30 disabled:hover:text-[#111111] transition-all"
                >
                    {isSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </button>
            </div>
        </form>
    )
}
