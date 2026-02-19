// app/portal/pending/page.tsx — Stealth Terminal Pending Screen
'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Timer, AlertTriangle, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function PendingPage() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-8 bg-[#09090B] border border-[#27272A] relative overflow-hidden animate-fade-up text-center">
                {/* Decorative Grid */}
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />

                <div className="relative z-10 items-center flex flex-col">
                    <div className="p-4 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/20 mb-6 animate-pulse">
                        <Timer className="h-10 w-10 text-[#EAB308]" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-mono font-bold text-[#F8FAFC] mb-4">
                        Access Pending
                    </h1>

                    <div className="bg-[#111113] border-l-2 border-[#EAB308] p-4 text-left w-full mb-8">
                        <p className="font-mono text-sm text-[#A1A1AA] leading-relaxed">
                            <span className="text-[#EAB308] font-bold">STATUS:</span> Awaiting administrative approval.<br /><br />
                            Your credentials have been logged in the system. An admin must verify your identity before access level 1 is granted to the Command Center.
                        </p>
                    </div>

                    <p className="text-[#52525B] font-mono text-xs mb-8">
                        Please check your email for status updates or contact the club lead if this persists.
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-6 py-2 rounded-sm bg-[#27272A] text-[#F8FAFC] font-mono font-bold hover:bg-[#3F3F46] transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            Disconnect
                        </button>
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-6 py-2 rounded-sm border border-[#27272A] text-[#A1A1AA] font-mono font-bold hover:text-[#F8FAFC] hover:border-[#F8FAFC] transition-colors"
                        >
                            Return_Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
