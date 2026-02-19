// components/portal/PortalNavbar.tsx
// Top navigation bar inside the member portal.
// Shows club name, member info, and a "Back to Website" link.

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
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6">
            {/* Left: Club branding */}
            <div className="flex items-center gap-3">
                <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">IC</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">IIMS Cyber Club</span>
                    <span className="text-xs text-slate-500 hidden sm:inline">· Member Portal</span>
                </div>
            </div>

            {/* Right: Links */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    className="text-slate-400 hover:text-white text-sm transition-colors hidden sm:inline-flex items-center gap-1"
                >
                    ← Public Website
                </Link>
                <button
                    onClick={handleSignOut}
                    className="text-slate-400 hover:text-red-400 text-sm transition-colors"
                >
                    Logout
                </button>
            </div>
        </header>
    )
}
