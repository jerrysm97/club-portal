// app/portal/login/page.tsx
// Portal login — Stealth Terminal theme. Magic link only (no passwords).

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const searchParams = useSearchParams()

    // Handle URL error params from middleware/callback
    useEffect(() => {
        const err = searchParams.get('error')
        if (err === 'access_denied') setErrorMsg('Your membership application was not approved. Contact cybersec@iimscollege.edu.np')
        else if (err === 'server_error') setErrorMsg('Something went wrong on our end. Please try again in a moment.')
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return
        setStatus('loading')
        setErrorMsg('')
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` },
            })
            if (error) throw error
            setStatus('sent')
        } catch {
            setStatus('error')
            setErrorMsg('Failed to send login link. Please check your email and try again.')
        }
    }

    return (
        <div className="min-h-screen bg-black bg-grid flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <p className="font-[var(--font-mono)] text-[#10B981] text-xs mb-1">{'>'} MEMBER_ACCESS</p>
                    <h1 className="font-[var(--font-mono)] font-bold text-2xl text-[#F8FAFC]">Member Portal</h1>
                    <p className="text-[#A1A1AA] text-sm mt-2">Enter your IIMS email to receive a secure login link</p>
                </div>

                {/* Card */}
                <div className="bg-[#09090B] border border-[#27272A] rounded-md p-8">
                    {status === 'sent' ? (
                        <div className="text-center space-y-3">
                            <p className="font-[var(--font-mono)] text-[#10B981] text-sm">{'>'} MAGIC_LINK_SENT</p>
                            <p className="text-[#F8FAFC] text-sm">Check your inbox at:</p>
                            <p className="font-[var(--font-mono)] text-[#06B6D4] text-sm">{email}</p>
                            <p className="text-[#A1A1AA] text-xs mt-4">Click the link in the email to sign in.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block font-[var(--font-mono)] text-[#10B981] text-xs mb-2">EMAIL</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="you@domain.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-black border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors"
                                />
                            </div>
                            {errorMsg && (
                                <p className="text-[#EF4444] text-xs font-[var(--font-mono)]">{'>'} ERROR: {errorMsg}</p>
                            )}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="w-full py-3 text-sm font-bold bg-[#10B981] text-black rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {status === 'loading' ? 'Sending...' : 'Send Login Link →'}
                            </button>
                        </form>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link href="/" className="font-[var(--font-mono)] text-[#A1A1AA] text-sm hover:text-[#10B981] transition-colors">
                        ← Back to Club Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
