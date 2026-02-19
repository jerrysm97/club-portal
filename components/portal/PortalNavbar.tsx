// components/portal/PortalNavbar.tsx
// Cyber Blue Matrix themed top bar inside the portal.

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
        <header className="h-14 bg-[#0A1F44] border-b border-[#00B4FF]/20 flex items-center justify-between px-4 lg:px-6">
            {/* Left: Club branding */}
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#00B4FF] rounded-lg flex items-center justify-center bg-[#00B4FF]/10">
                    <svg className="w-4 h-4 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white font-[var(--font-orbitron)] font-bold text-sm">IIMS Cybersecurity Club</span>
                    <span className="text-xs font-[var(--font-mono)] text-[#00FF9C] hidden sm:inline">// Portal</span>
                </div>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="text-[#8892A4] hover:text-[#00B4FF] text-sm font-[var(--font-mono)] transition-colors hidden sm:inline-flex items-center gap-1"
                >
                    ← Public Website
                </Link>
                <button
                    onClick={handleSignOut}
                    className="text-[#8892A4] hover:text-[#FF3B3B] text-sm font-[var(--font-mono)] transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}
