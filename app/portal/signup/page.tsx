// app/portal/signup/page.tsx — Email + Password signup (premium minimal)
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
            <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="bg-white rounded-xl p-10 border border-[#E5E7EB] shadow-sm">
                        <div className="text-4xl mb-4">✉️</div>
                        <h2 className="text-xl font-bold text-[#111827] mb-2">Check Your Email</h2>
                        <p className="text-sm text-[#6B7280] mb-1">
                            We&apos;ve sent a confirmation link to:
                        </p>
                        <p className="text-sm font-semibold text-[#6366F1] mb-4">{email}</p>
                        <p className="text-xs text-[#9CA3AF]">
                            After confirming, your account will be reviewed by an admin before you can access the portal.
                        </p>
                    </div>
                    <div className="mt-6">
                        <Link href="/portal/login" className="text-sm text-[#6366F1] font-medium hover:underline">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#111827]">Create an account</h1>
                    <p className="text-sm text-[#6B7280] mt-1">Sign up to join the cybersecurity club</p>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all"
                            />
                        </div>
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
                                placeholder="At least 6 characters"
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
                            {status === 'loading' ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-sm text-[#6B7280]">
                    Already have an account?{' '}
                    <Link href="/portal/login" className="text-[#6366F1] font-medium hover:underline">
                        Sign in
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
