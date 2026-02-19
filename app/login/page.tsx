// app/login/page.tsx
// Login page — supports BOTH email/password login and magic link.
// Users can sign in with their password or request a magic link via email.

'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Sign in with email and password
    const handlePasswordLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            // Successful login — redirect to dashboard (middleware will handle status checks)
            window.location.href = '/dashboard'
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Invalid email or password. Please try again.',
            })
        } finally {
            setLoading(false)
        }
    }

    // Send a magic link to the email
    const handleMagicLink = async () => {
        if (!email) {
            setMessage({ type: 'error', text: 'Enter your email first.' })
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
            setMessage({
                type: 'success',
                text: 'Check your email for the magic link!',
            })
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Something went wrong.',
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Sign in with your email and password
                    </p>
                </div>

                <form className="mt-8 space-y-5" onSubmit={handlePasswordLogin}>
                    {/* Email input */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-slate-900"
                            placeholder="Your password"
                        />
                    </div>

                    {/* Status message */}
                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Sign in button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Signing in...</span>
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-400">or</span>
                    </div>
                </div>

                {/* Magic link button */}
                <button
                    onClick={handleMagicLink}
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all cursor-pointer"
                >
                    Send Magic Link Instead
                </button>
            </div>
        </div>
    )
}
