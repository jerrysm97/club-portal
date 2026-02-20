// app/portal/login/LoginForm.tsx — IIMS IT Club Email/Password Login
'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Shield, ArrowRight, Mail, Lock, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const reason = searchParams.get('reason')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const reasonMessages: Record<string, string> = {
        rejected: 'Your membership application was not approved at this time.',
        banned: 'Your account has been suspended. Contact itclub@iimscollege.edu.np for details.',
        access_denied: 'Access denied. Please contact a club administrator.',
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const trimmedEmail = email.trim().toLowerCase()
        if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            setError('Enter a valid email address.')
            return
        }
        if (!password || password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail, password }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Login failed.')
            }

            // Redirect to dashboard on success
            router.push('/portal/dashboard')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative">
            <div className="w-full max-w-md relative animate-fade-up">
                {/* Brand header */}
                <div className="flex items-center justify-center flex-col gap-4 mb-8">
                    <div className="h-14 w-14 rounded-2xl bg-[#1A237E] flex items-center justify-center shadow-lg shadow-[#1A237E]/20">
                        <Shield className="h-7 w-7 text-white" />
                    </div>
                    <div className="text-center">
                        <h2 className="font-bold text-[#1A237E] text-xl tracking-tight">IIMS IT Club</h2>
                        <span className="text-xs text-[#757575] font-medium tracking-wide uppercase">Member Portal</span>
                    </div>
                </div>

                {/* Reason banner */}
                {reason && reasonMessages[reason] && (
                    <div className="mb-6 p-4 rounded-xl bg-[#FFF8E1] border border-[#F57F17]/30 flex items-start gap-3 shadow-sm">
                        <AlertTriangle className="h-5 w-5 text-[#F57F17] flex-shrink-0 mt-0.5" />
                        <p className="text-[#F57F17] text-sm font-medium">{reasonMessages[reason]}</p>
                    </div>
                )}

                {/* Main card */}
                <div className="bg-white rounded-2xl shadow-xl shadow-black/5 p-8 border border-[#E0E0E0]">
                    <div className="mb-8">
                        <h1 className="font-bold text-[#212121] text-2xl mb-2">
                            Sign In
                        </h1>
                        <p className="text-[#757575] text-sm">
                            Enter your email and password to access the portal.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 rounded-xl bg-[#FFEBEE] border border-[#E53935]/20 text-[#C62828] text-sm font-medium animate-slide-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-[#424242] text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-[#9E9E9E]" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@iimscollege.edu.np"
                                    required
                                    autoComplete="email"
                                    autoFocus
                                    className="block w-full pl-10 pr-3 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] placeholder-[#9E9E9E] text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-[#424242] text-sm font-semibold mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-[#9E9E9E]" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    minLength={6}
                                    className="block w-full pl-10 pr-10 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] placeholder-[#9E9E9E] text-sm transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#9E9E9E] hover:text-[#616161] transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A237E] text-white font-semibold flex items-center justify-center gap-2 py-3 rounded-xl hover:bg-[#283593] active:bg-[#1A237E] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-[#1A237E]/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register link */}
                    <div className="mt-6 pt-6 border-t border-[#E0E0E0] text-center">
                        <p className="text-[#757575] text-sm">
                            Don&apos;t have an account?{' '}
                            <Link href="/portal/register" className="text-[#1A237E] font-semibold hover:underline">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-[#757575] text-sm font-medium">
                        The Official IT Club of{' '}
                        <a
                            href="https://iimscollege.edu.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#1A237E] hover:underline font-semibold"
                        >
                            IIMS College
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
