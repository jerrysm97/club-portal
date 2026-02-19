// app/portal/pending/page.tsx — Pending approval (premium minimal)
'use client'

import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function PendingPage() {
    const router = useRouter()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/portal/login')
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="w-full max-w-md text-center">
                <div className="bg-white rounded-xl p-10 border border-[#E5E7EB] shadow-sm">
                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-amber-50 flex items-center justify-center">
                        <span className="text-2xl">⏳</span>
                    </div>
                    <h1 className="text-xl font-bold text-[#111827] mb-2">Pending Approval</h1>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                        Your membership application is being reviewed. An admin will approve your access shortly. You&apos;ll be able to log in once approved.
                    </p>
                    <button onClick={handleLogout} className="mt-6 text-sm text-[#6366F1] font-medium hover:underline">
                        Sign Out
                    </button>
                </div>
                <div className="mt-6">
                    <Link href="/" className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                        ← Back to website
                    </Link>
                </div>
            </div>
        </div>
    )
}
