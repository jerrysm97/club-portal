// components/portal/PostComposer.tsx — IIMS IT Club Feed Composer (v4.0)
'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/portal/(protected)/feed/actions'
import { useFormStatus } from 'react-dom'
import { Send, Loader2, AlertTriangle, Terminal, Megaphone, FileText, Layout, PenLine } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#1A237E] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#283593] active:bg-[#1A237E] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1A237E]/20"
        >
            {pending ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                </>
            ) : (
                <>
                    Share Post
                    <Send className="h-4 w-4" />
                </>
            )}
        </button>
    )
}

export default function PostComposer({ userRole, memberName }: { userRole: string, memberName: string }) {
    const [error, setError] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    async function action(formData: FormData) {
        const res = await createPost(null, formData)
        if (res?.error) {
            setError(res.error)
            toast.error(res.error)
        } else {
            setError(null)
            toast.success('Post shared with the club')
            formRef.current?.reset()
        }
    }

    const isHighPerms = ['admin', 'superadmin'].includes(userRole)

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#E0E0E0] shadow-xl shadow-black/5 mb-8 group animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-[#E8EAF6] text-[#1A237E]">
                    <PenLine className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9E9E9E]">Share an update, {memberName}</span>
            </div>

            <form ref={formRef} action={action} className="space-y-5">
                <textarea
                    name="content"
                    placeholder="Share resources, ask questions, or announce events..."
                    className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-2xl p-5 text-[#212121] text-sm focus:bg-white focus:border-[#1A237E]/50 focus:ring-4 focus:ring-[#1A237E]/10 outline-none transition-all min-h-[120px] resize-none placeholder:text-[#9E9E9E]"
                    required
                />

                {error && (
                    <div className="p-3 rounded-xl bg-[#FFEBEE] border border-[#E53935]/20 text-[#C62828] text-xs font-semibold flex items-center gap-2 animate-slide-in">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 mt-2 border-t border-[#F5F5F5]">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isHighPerms ? (
                            <div className="relative w-full sm:w-auto">
                                <select
                                    name="type"
                                    className="w-full appearance-none bg-[#F5F5F5] border border-[#E0E0E0] text-[#424242] text-xs font-bold uppercase tracking-wide rounded-xl px-4 py-2.5 pr-10 hover:bg-[#E0E0E0]/50 focus:ring-2 focus:ring-[#1A237E]/20 outline-none cursor-pointer transition-all"
                                >
                                    <option value="post">General Post</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="resource">Resource</option>
                                    <option value="question">Question</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#9E9E9E]">
                                    <Layout className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <input type="hidden" name="type" value="post" />
                        )}
                        <div className="hidden sm:flex items-center gap-2 px-3 text-[#E0E0E0]">
                            <span className="text-xs font-medium text-[#9E9E9E]">Club Feed</span>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto flex justify-end">
                        <SubmitButton />
                    </div>
                </div>
            </form>
        </div>
    )
}
