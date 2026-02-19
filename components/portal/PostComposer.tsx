// components/portal/PostComposer.tsx — IIMS Collegiate Feed Composer
'use client'

import { useState, useRef } from 'react'
import { createPost } from '@/app/portal/feed/actions'
import { useFormStatus } from 'react-dom'
import { Send, Loader2, AlertTriangle, Terminal, Megaphone, FileText, Layout } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            loading={pending}
            className="rounded-xl px-6 font-bold shadow-lg shadow-red-100"
            rightIcon={!pending && <Send className="h-4 w-4" />}
        >
            {pending ? 'Transmitting...' : 'Post Intel'}
        </Button>
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
            toast.success('Information broadcasted to all operatives')
            formRef.current?.reset()
        }
    }

    const isHighPerms = ['bod', 'admin', 'superadmin'].includes(userRole)

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl mb-10 group animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#58151C]/5 text-[#58151C]">
                    <Terminal className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Secure Uplink: {memberName}</span>
            </div>

            <form ref={formRef} action={action} className="space-y-6">
                <textarea
                    name="content"
                    placeholder="Share mission intel, resources or questions..."
                    className="w-full bg-gray-50 border border-transparent rounded-2xl p-5 text-[#111827] font-medium text-sm focus:bg-white focus:border-[#58151C]/20 focus:outline-none transition-all min-h-[120px] resize-none placeholder:text-gray-400"
                    required
                />

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-bold flex items-center gap-3 animate-shake">
                        <AlertTriangle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isHighPerms ? (
                            <div className="relative w-full sm:w-auto">
                                <select
                                    name="type"
                                    className="w-full appearance-none bg-gray-50 border border-transparent text-[#111827] text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2.5 pr-10 focus:bg-white focus:border-[#58151C]/20 outline-none cursor-pointer transition-all"
                                >
                                    <option value="post">General Intel</option>
                                    <option value="announcement">Priority Alert</option>
                                    <option value="resource">Resource Link</option>
                                    <option value="question">Sector Inquiry</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Layout className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <input type="hidden" name="type" value="post" />
                        )}

                        <div className="hidden sm:flex items-center gap-2 px-3 text-gray-300">
                            <Megaphone className="h-4 w-4" />
                            <FileText className="h-4 w-4" />
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
