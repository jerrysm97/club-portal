// app/portal/login/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#6366F1] border-t-transparent rounded-full animate-spin" /></div>}>
            <LoginContent />
        </Suspense>
    )
}

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        const err = searchParams.get('error')
        if (err === 'access_denied') setErrorMsg('Your membership was not approved. Contact cybersec@iimscollege.edu.np')
        else if (err === 'server_error') setErrorMsg('Something went wrong. Please try again.')
    }, [searchParams])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email || !password) return
        setStatus('loading')
        setErrorMsg('')
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error
            router.push('/portal/dashboard')
        } catch (err: unknown) {
            setStatus('error')
            setErrorMsg(err instanceof Error ? err.message : 'Invalid email or password.')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#F8FAFC] flex items-center justify-center px-4">
            <div className="w-full max-w-[420px]">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block text-2xl font-bold mb-4">
                        IIMS <span className="text-gradient">Cyber</span>
                    </Link>
                    <h1 className="text-2xl font-extrabold text-[#0F172A] mb-1">Welcome back</h1>
                    <p className="text-sm text-[#64748B]">Sign in to your member portal</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-lg shadow-indigo-500/[0.04]">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                placeholder="••••••••"
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
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Links */}
                <div className="mt-8 space-y-3 text-center">
                    <p className="text-sm text-[#64748B]">
                        Don&apos;t have an account?{' '}
                        <Link href="/portal/signup" className="text-[#6366F1] font-semibold hover:text-[#4F46E5] transition-colors">
                            Sign up
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
