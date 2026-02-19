// app/portal/pending/page.tsx
// Pending approval page — Cyber Blue Matrix themed.

'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
    const router = useRouter()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] bg-grid flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⏳</span>
                </div>
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-xs tracking-wider mb-3">// PENDING REVIEW</p>
                <h1 className="font-[var(--font-orbitron)] font-bold text-2xl text-white mb-3">
                    Membership Under Review
                </h1>
                <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed mb-8">
                    Your application has been received. Our admin team will review it and notify you once approved.
                </p>
                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="px-6 py-3 text-sm font-bold border border-[#00B4FF] text-[#00B4FF] rounded-lg hover:bg-[#00B4FF] hover:text-[#0D0D0D] transition-all duration-300"
                    >
                        ← Back to Club Website
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="px-6 py-3 text-sm font-[var(--font-mono)] text-[#8892A4] hover:text-[#FF3B3B] transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
