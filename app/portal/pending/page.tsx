// app/portal/pending/page.tsx
// Membership pending page — Stealth Terminal theme.

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PendingPage() {
    const router = useRouter()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-black bg-grid flex items-center justify-center px-4">
            <div className="w-full max-w-sm text-center">
                <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-4">{'>'} APPLICATION_STATUS</p>
                <div className="bg-[#09090B] border border-[#27272A] rounded-md p-8 mb-6">
                    <p className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-lg mb-2">Under Review</p>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed">
                        Your membership application is being reviewed by an admin. You&apos;ll be notified once approved.
                    </p>
                </div>
                <div className="flex flex-col gap-3">
                    <Link href="/" className="font-[var(--font-mono)] text-[#A1A1AA] text-sm hover:text-[#F8FAFC] transition-colors">
                        ← Back to Club Website
                    </Link>
                    <button onClick={handleSignOut} className="font-[var(--font-mono)] text-[#EF4444] text-sm hover:opacity-80 transition-opacity">
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
