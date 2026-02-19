// app/portal/pending/page.tsx
// Shown to users whose membership is still under review.
// Includes a link back to the public club website and a logout button.

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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                {/* Hourglass icon */}
                <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">⏳</span>
                </div>

                <h1 className="text-2xl font-bold text-white mb-3">
                    Membership Under Review
                </h1>
                <p className="text-slate-400 leading-relaxed mb-8">
                    Your application has been received. Our admin team will review it and get back to you soon. You&apos;ll be notified once your account is approved.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/"
                        className="px-6 py-3 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        ← Back to Club Website
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="px-6 py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
