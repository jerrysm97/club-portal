// components/portal/PostComposer.tsx — IIMS IT Club Feed Composer (v4.0)
'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/portal/(protected)/feed/actions'
import { useFormStatus } from 'react-dom'
import { Send, Loader2, AlertTriangle, Terminal, Megaphone, FileText, Layout, PenLine, X } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-[#111111] text-white font-semibold text-sm px-5 py-2.5 rounded-sm hover:bg-[#C8102E] active:bg-[#111111] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#111111]/20"
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
    const [imageUrl, setImageUrl] = useState('')
    const [showImageInput, setShowImageInput] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('bucket', 'public-gallery')

        try {
            const res = await fetch('/api/portal/upload', {
                method: 'POST',
                body: uploadData
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to upload photo')

            setImageUrl(data.url)
            toast.success('Photo uploaded')
        } catch (err: any) {
            toast.error(err.message)
            setImageUrl('')
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    async function action(formData: FormData) {
        let content = formData.get('content') as string
        if (imageUrl) {
            content = content + `\n\n[IMAGE: ${imageUrl}]`
            formData.set('content', content)
        }

        const res = await createPost(null, formData)
        if (res?.error) {
            setError(res.error)
            toast.error(res.error)
        } else {
            setError(null)
            setImageUrl('')
            setShowImageInput(false)
            toast.success('Post shared with the club')
            formRef.current?.reset()
        }
    }

    const isHighPerms = ['admin', 'superadmin'].includes(userRole)

    return (
        <div className="bg-white rounded-sm p-6 md:p-8 border border-[#E0E0E0] shadow-sm shadow-black/5 mb-8 group animate-fade-up">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-sm bg-[#FAFAFA] text-[#111111]">
                    <PenLine className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#9E9E9E]">Share an update, {memberName}</span>
            </div>

            <form ref={formRef} action={action} className="space-y-5">
                <textarea
                    name="content"
                    placeholder="Share resources, ask questions, or announce events..."
                    className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm p-5 text-[#212121] text-sm focus:bg-white focus:border-[#111111]/50 focus:ring-4 focus:ring-[#111111]/10 outline-none transition-all min-h-[120px] resize-none placeholder:text-[#9E9E9E]"
                    required
                />

                {showImageInput && (
                    <div className="bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm p-4 animate-fade-in relative">
                        {isUploading ? (
                            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#757575] py-4">
                                <Loader2 className="h-4 w-4 animate-spin" /> Uploading photo...
                            </div>
                        ) : imageUrl ? (
                            <div className="relative group">
                                <img src={imageUrl} alt="Uploaded" className="h-24 w-auto rounded border border-[#E0E0E0] object-cover" />
                                <button type="button" onClick={() => setImageUrl('')} className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-sm hover:bg-white shadow">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="block w-full text-sm text-[#757575] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[#111111] file:text-white hover:file:bg-[#C8102E] transition-all cursor-pointer"
                                />
                                <button type="button" onClick={() => setShowImageInput(false)} className="text-[#9E9E9E] hover:text-[#212121]">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-sm bg-[#FFEBEE] border border-[#E53935]/20 text-[#C62828] text-xs font-semibold flex items-center gap-2 animate-slide-in">
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
                                    className="w-full appearance-none bg-[#F5F5F5] border border-[#E0E0E0] text-[#424242] text-xs font-bold uppercase tracking-wide rounded-sm px-4 py-2.5 pr-10 hover:bg-[#E0E0E0]/50 focus:ring-2 focus:ring-[#111111]/20 outline-none cursor-pointer transition-all"
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
                        <button
                            type="button"
                            onClick={() => setShowImageInput(!showImageInput)}
                            className="flex items-center gap-2 px-3 py-2 text-[#9E9E9E] hover:text-[#212121] hover:bg-[#F5F5F5] rounded-sm transition-all text-xs font-medium"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Add Photo
                        </button>
                    </div>

                    <div className="w-full sm:w-auto flex justify-end">
                        <SubmitButton />
                    </div>
                </div>
            </form>
        </div>
    )
}
