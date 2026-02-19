// app/portal/signup/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!fullName || !email || !password) return
        if (password.length < 6) {
            setErrorMsg('Password must be at least 6 characters.')
            return
        }
        setStatus('loading')
        setErrorMsg('')
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { full_name: fullName },
                    emailRedirectTo: `${window.location.origin}/api/auth/callback`,
                },
            })
            if (error) throw error
            setStatus('success')
        } catch (err: unknown) {
            setStatus('error')
            setErrorMsg(err instanceof Error ? err.message : 'Failed to create account.')
        }
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] flex items-center justify-center px-4">
                <div className="w-full max-w-[420px] text-center">
                    <div className="bg-white rounded-2xl p-10 border border-[#E2E8F0] shadow-lg shadow-indigo-500/[0.04]">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                            <span className="text-3xl">✉️</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-[#0F172A] mb-2">Check Your Email</h2>
                        <p className="text-sm text-[#64748B] mb-1">
                            We&apos;ve sent a confirmation link to:
                        </p>
                        <p className="text-sm font-bold text-[#6366F1] mb-5">{email}</p>
                        <p className="text-xs text-[#94A3B8] leading-relaxed">
                            After confirming, your account will be reviewed by an admin before you can access the portal.
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link href="/portal/login" className="text-sm text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors">
                            ← Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] flex items-center justify-center px-4">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block text-2xl font-bold mb-4">
                        IIMS <span className="text-gradient">Cyber</span>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Create an account</h1>
                    <p className="text-sm text-[#64748B]">Sign up to join the cybersecurity club</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-lg shadow-indigo-500/[0.04]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="input-premium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium"
                            />
                        </div>

                        {errorMsg && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                                <span className="text-red-500 text-sm">⚠️ {errorMsg}</span>
                            </div>
                        )}

                        <button type="submit" disabled={status === 'loading'} className="btn-primary">
                            {status === 'loading' ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Creating account...
                                </span>
                            ) : 'Sign Up'}
                        </button>
                    </form>
                </div>

                {/* Links */}
                <div className="mt-8 space-y-3 text-center">
                    <p className="text-sm text-[#64748B]">
                        Already have an account?{' '}
                        <Link href="/portal/login" className="text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors">
                            Sign in
                        </Link>
                    </p>
                    <Link href="/" className="inline-block text-xs text-[#94A3B8] hover:text-[#64748B] transition-colors">
                        ← Back to website
                    </Link>
                </div>
            </div>
        </div>
    )
}
