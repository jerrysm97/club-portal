// app/portal/login/LoginForm.tsx — IIMS IT Club Magic Link Login
'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Shield, ArrowRight, Mail, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const reason = searchParams.get('reason')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

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

        setLoading(true)
        try {
            const res = await fetch('/api/auth/magic-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: trimmedEmail }),
            })

            const data = await res.json()
            if (!res.ok) {
                throw new Error(data.error || 'Failed to send login link.')
            }

            setSuccess(true)
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
                        <span className="text-xs text-[#757575] font-medium tracking-wide uppercase">Member Portal Gateway</span>
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
                    {success ? (
                        <div className="text-center py-6 animate-fade-up">
                            <div className="mx-auto w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-6 w-6 text-[#2E7D32]" />
                            </div>
                            <h3 className="text-lg font-bold text-[#212121] mb-2">Check your email</h3>
                            <p className="text-[#757575] text-sm mb-6">
                                We sent a magic link to <span className="font-semibold text-[#212121]">{email}</span>. Click the link to securely sign in.
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-sm font-semibold text-[#1A237E] hover:underline"
                            >
                                Use a different email
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="font-bold text-[#212121] text-2xl mb-2">
                                    Secure Sign In
                                </h1>
                                <p className="text-[#757575] text-sm">
                                    Enter your IIMS email address to receive a magic login link. No password required.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 rounded-xl bg-[#FFEBEE] border border-[#E53935]/20 text-[#C62828] text-sm font-medium animate-slide-in">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
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
                                            placeholder="operator@iimscollege.edu.np"
                                            required
                                            autoComplete="email"
                                            autoFocus
                                            className="block w-full pl-10 pr-3 py-3 border border-[#E0E0E0] rounded-xl focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] placeholder-[#9E9E9E] text-sm transition-all"
                                        />
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
                                            Requesting Link...
                                        </>
                                    ) : (
                                        <>
                                            Send Magic Link
                                            <ArrowRight className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
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
