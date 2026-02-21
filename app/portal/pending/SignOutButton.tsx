// app/portal/pending/SignOutButton.tsx — Client component
'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function SignOutButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleSignOut() {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 border border-[#E0E0E0] text-[#757575] font-semibold text-sm px-5 py-3 rounded-sm hover:bg-[#F5F5F5] hover:text-[#212121] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <LogOut className="h-4 w-4" />
            )}
            Sign Out
        </button>
    )
}
