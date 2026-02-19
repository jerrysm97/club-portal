// app/portal/login/page.tsx
// Portal login — Cyber Blue Matrix themed, glassmorphism card, grid background.

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function PortalLoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Check for error query params from middleware redirects
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'server_error') {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again in a moment.' })
        } else if (error === 'access_denied') {
            setMessage({ type: 'error', text: 'Your membership application was not approved. Contact cybersec@iimscollege.edu.np' })
        }
    }, [searchParams])

    async function handlePasswordLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            router.push('/portal/dashboard')
            router.refresh()
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Login failed' })
        } finally {
            setLoading(false)
        }
    }

    async function handleMagicLink() {
        if (!email) {
            setMessage({ type: 'error', text: 'Enter your email first.' })
            return
        }
        setLoading(true)
        setMessage(null)
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
            })
            if (error) throw error
            setMessage({ type: 'success', text: `✉️ Check your inbox! Magic link sent to ${email}` })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to send magic link' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#0D0D0D] bg-grid flex items-center justify-center px-4">
            {/* Neon glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#00B4FF] rounded-full blur-3xl opacity-10" />

            <div className="relative w-full max-w-md">
                {/* Glassmorphism card */}
                <div className="glass rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 border-2 border-[#00B4FF] rounded-xl flex items-center justify-center mx-auto mb-4 bg-[#00B4FF]/10">
                            <svg className="w-6 h-6 text-[#00B4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="font-[var(--font-mono)] text-[#00FF9C] text-xs tracking-wider mb-2">// MEMBER ACCESS</p>
                        <h1 className="font-[var(--font-orbitron)] font-bold text-2xl text-white">Member Portal</h1>
                        <p className="text-[#8892A4] text-sm mt-1 font-[var(--font-exo2)]">Sign in with your IIMS email</p>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-[var(--font-exo2)] ${message.type === 'success'
                                ? 'bg-[#00FF9C]/10 border border-[#00FF9C]/30 text-[#00FF9C]'
                                : 'bg-[#FF3B3B]/10 border border-[#FF3B3B]/30 text-[#FF3B3B]'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-[var(--font-mono)] text-[#8892A4] mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_rgba(0,180,255,0.2)] transition-all"
                                placeholder="you@iimscollege.edu.np"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-[var(--font-mono)] text-[#8892A4] mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_rgba(0,180,255,0.2)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm font-bold bg-[#00B4FF] text-[#0D0D0D] rounded-lg hover:bg-[#00FF9C] transition-all duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 border-t border-white/10" />
                        <span className="text-xs font-[var(--font-mono)] text-[#8892A4]">or</span>
                        <div className="flex-1 border-t border-white/10" />
                    </div>

                    {/* Magic link */}
                    <button
                        onClick={handleMagicLink}
                        disabled={loading}
                        className="w-full py-3 text-sm font-[var(--font-mono)] text-[#00B4FF] border border-[#00B4FF]/30 rounded-lg hover:bg-[#00B4FF]/10 transition-all duration-300 disabled:opacity-50"
                    >
                        Send Magic Link Instead
                    </button>
                </div>

                {/* Back link */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-[#8892A4] hover:text-[#00B4FF] text-sm font-[var(--font-mono)] transition-colors">
                        ← Back to Club Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
