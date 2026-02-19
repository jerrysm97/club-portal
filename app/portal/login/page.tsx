// app/portal/login/page.tsx
// Portal login page — supports email/password AND magic link.
// Uses router.push instead of window.location.href for smooth navigation.
// Checks for error query params to show friendly messages.

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

    // Check for error query params on page load (from middleware redirects)
    useEffect(() => {
        const error = searchParams.get('error')
        if (error === 'server_error') {
            setMessage({ type: 'error', text: 'Something went wrong on our end. Please try again in a moment.' })
        } else if (error === 'access_denied') {
            setMessage({ type: 'error', text: 'Your membership application was not approved.' })
        }
    }, [searchParams])

    // Sign in with email and password
    async function handlePasswordLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error

            // Use router.push instead of window.location.href
            // router.refresh() forces middleware to re-run and pick up the new session
            router.push('/portal/dashboard')
            router.refresh()
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Login failed' })
        } finally {
            setLoading(false)
        }
    }

    // Send magic link to email
    async function handleMagicLink() {
        if (!email) {
            setMessage({ type: 'error', text: 'Please enter your email first.' })
            return
        }
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
            setMessage({ type: 'success', text: `✉️ Check your email! We've sent a magic link to ${email}. Click it to sign in.` })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to send magic link' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            {/* Glow effect */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl" />

            <div className="relative w-full max-w-md">
                {/* Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold">IC</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">Member Portal</h1>
                        <p className="text-slate-400 text-sm mt-1">Sign in with your email and password</p>
                    </div>

                    {/* Status/error messages */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success'
                                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                : 'bg-red-500/10 border border-red-500/30 text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Login form */}
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="you@email.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 border-t border-slate-800" />
                        <span className="text-xs text-slate-500">or</span>
                        <div className="flex-1 border-t border-slate-800" />
                    </div>

                    {/* Magic link button */}
                    <button
                        onClick={handleMagicLink}
                        disabled={loading}
                        className="w-full py-3 text-sm font-medium text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Send Magic Link Instead
                    </button>
                </div>

                {/* Back to website link */}
                <div className="text-center mt-6">
                    <Link href="/" className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
                        ← Back to Club Website
                    </Link>
                </div>
            </div>
        </div>
    )
}
