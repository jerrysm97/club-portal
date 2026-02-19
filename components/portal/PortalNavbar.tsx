// components/portal/PortalNavbar.tsx
// Portal topbar — Stealth Terminal theme.

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PortalNavbar() {
    const router = useRouter()

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <header className="h-14 bg-[#09090B] border-b border-[#27272A] flex items-center justify-between px-4 lg:px-6">
            {/* Left: Branding */}
            <div className="flex items-center gap-2">
                <span className="text-[#10B981] font-[var(--font-mono)] font-bold text-sm">{'>'}_</span>
                <span className="text-[#F8FAFC] font-[var(--font-mono)] font-bold text-sm">IIMS_CYBER</span>
                <span className="text-[#A1A1AA] font-[var(--font-mono)] text-xs hidden sm:inline">// Portal</span>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="text-[#A1A1AA] hover:text-[#10B981] text-sm font-[var(--font-mono)] transition-colors hidden sm:block"
                >
                    ← Public Website
                </Link>
                <button
                    onClick={handleSignOut}
                    className="text-[#A1A1AA] hover:text-[#EF4444] text-sm font-[var(--font-mono)] transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}
