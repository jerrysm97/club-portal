// app/portal/pending/SignOutButton.tsx — Client island for sign-out action
'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut } from 'lucide-react'

export default function SignOutButton() {
    const router = useRouter()

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 border border-[#2D2D44] text-[#8888AA] font-mono text-sm px-5 py-2.5 rounded-md hover:bg-[#12121A] hover:text-[#F0F0FF] hover:border-[#00FF87]/50 transition-all active:scale-95"
        >
            <LogOut className="h-4 w-4" />
            Sign Out
        </button>
    )
}
