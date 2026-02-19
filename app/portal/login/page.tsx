// app/portal/login/page.tsx — Email + Password login (premium minimal)
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
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
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#111827]">Welcome back</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Sign in to your member portal</p>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="you@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                            />
                        </div>

                        {errorMsg && (
                            <p className="text-sm text-red-500">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-3 rounded-lg bg-[#6366F1] text-white font-semibold hover:bg-[#4F46E5] transition-colors disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-sm text-[#6B7280]">
                    Don&apos;t have an account?{' '}
                    <Link href="/portal/signup" className="text-[#6366F1] font-medium hover:underline">
                        Sign up
                    </Link>
                </p>

                <div className="text-center mt-3">
                    <Link href="/" className="text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
                        ← Back to website
                    </Link>
                </div>
            </div>
        </div>
    )
}
