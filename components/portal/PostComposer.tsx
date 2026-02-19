'use client'

import { useState } from 'react'
import { createPost } from '@/app/portal/feed/actions'
import { useFormStatus } from 'react-dom'
import { Send, Loader2, AlertTriangle, Terminal } from 'lucide-react'
import { toast } from 'sonner'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 bg-[#F8FAFC] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#E2E8F0] transition-colors disabled:opacity-50 flex items-center gap-2"
        >
            {pending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            {pending ? 'TRANSMITTING...' : 'TRANSMIT_PAYLOAD'}
        </button>
    )
}

export default function PostComposer({ userRole }: { userRole: string }) {
    const [error, setError] = useState<string | null>(null)

    async function action(formData: FormData) {
        const res = await createPost(null, formData)
        if (res?.error) {
            setError(res.error)
            toast.error(res.error)
        } else {
            setError(null)
            toast.success('Payload transmitted successfully')
            // Reset form manually since we don't have a ref handy, strictly speaking actionable/useFormState pattern handles this but simple reset:
            const form = document.querySelector('form') as HTMLFormElement
            if (form) form.reset()
        }
    }

    return (
        <div className="bg-[#09090B] border border-[#27272A] rounded-sm p-4 mb-6 animate-fade-up">
            <div className="flex items-center gap-2 mb-3 text-[#10B981] text-xs font-mono">
                <Terminal className="h-3 w-3" />
                <span>NEW_TRANSMISSION</span>
            </div>

            <form action={action} className="space-y-4">
                <textarea
                    name="content"
                    placeholder="Enter payload data..."
                    className="w-full bg-[#111113] border border-[#27272A] rounded-sm p-3 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] focus:outline-none transition-colors min-h-[100px] resize-y placeholder:text-[#3F3F46]"
                    required
                />

                {error && (
                    <div className="p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-xs font-mono flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3" />
                        {error}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                        {/* Only admins can change type for now, default hidden input for 'post' */}
                        {(userRole === 'admin' || userRole === 'superadmin') ? (
                            <select name="type" className="bg-[#111113] border border-[#27272A] text-[#A1A1AA] text-xs font-mono rounded-sm px-2 py-1 focus:border-[#10B981] outline-none">
                                <option value="post">General_Post</option>
                                <option value="announcement">Priority_Announcement</option>
                                <option value="resource">Resource_Link</option>
                            </select>
                        ) : (
                            <input type="hidden" name="type" value="post" />
                        )}
                    </div>
                    <SubmitButton />
                </div>
            </form>
        </div>
    )
}
