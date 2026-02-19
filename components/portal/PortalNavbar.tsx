// components/portal/PortalNavbar.tsx — Premium minimal portal topbar
'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PortalNavbar() {
    const router = useRouter()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/portal/login')
    }

    return (
        <header className="h-14 bg-white border-b border-[#E5E7EB] flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
                <Link href="/portal/dashboard" className="text-base font-semibold text-[#111827]">
                    IIMS <span className="text-[#6366F1]">Portal</span>
                </Link>
                <span className="text-[#E5E7EB]">|</span>
                <Link href="/" className="text-xs text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                    ← Website
                </Link>
            </div>
            <button
                onClick={handleLogout}
                className="text-sm text-[#6B7280] hover:text-red-500 transition-colors"
            >
                Sign Out
            </button>
        </header>
    )
}
