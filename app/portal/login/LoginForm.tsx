// app/portal/login/LoginForm.tsx — IIMS Stealth Terminal Login (Magic Link)
'use client'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Shield, ArrowRight, Mail, AlertTriangle, Loader2 } from 'lucide-react'

export default function LoginForm() {
    const searchParams = useSearchParams()
    const reason = searchParams.get('reason')
    const [email, setEmail] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)

    const reasonMessages: Record<string, string> = {
        rejected: 'Your application has been reviewed and was not approved at this time.',
        banned: 'Your account has been suspended. Contact cybersec@iimscollege.edu.np for details.',
        access_denied: 'Access denied. Please contact a club administrator.',
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const trimmed = email.trim().toLowerCase()
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setError('Enter a valid email address.')
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error: authError } = await supabase.auth.signInWithOtp({
                email: trimmed,
                options: {
                    emailRedirectTo: `${window.location.origin}/portal/dashboard`,
                },
            })
            if (authError) throw authError
            setSent(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send magic link. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0,255,135,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,135,0.1) 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="w-full max-w-md relative">
                {/* Brand header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-lg bg-[#0A0A0F] border border-[#2D2D44] flex items-center justify-center">
                        <Shield className="h-6 w-6 text-[#00FF87]" />
                    </div>
                    <div>
                        <h2 className="font-mono font-bold text-[#F0F0FF] text-sm tracking-tight">IIMS CYBERSEC</h2>
                        <span className="font-mono text-[10px] text-[#8888AA] tracking-widest">MEMBER PORTAL</span>
                    </div>
                </div>

                {/* Reason banner */}
                {reason && reasonMessages[reason] && (
                    <div className="mb-6 p-4 rounded-md bg-[#0A0A0F] border-l-4 border-[#FF3333] flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-[#FF3333] flex-shrink-0 mt-0.5" />
                        <p className="text-[#F0F0FF] text-sm font-sans">{reasonMessages[reason]}</p>
                    </div>
                )}

                {/* Main card */}
                <div className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-8">
                    {sent ? (
                        /* ── Success state ── */
                        <div className="text-center py-4">
                            <div className="h-14 w-14 rounded-full bg-[#00FF87]/10 border border-[#00FF87]/30 flex items-center justify-center mx-auto mb-6">
                                <Mail className="h-7 w-7 text-[#00FF87]" />
                            </div>
                            <h1 className="font-mono font-bold text-[#F0F0FF] text-lg mb-3">
                                Check Your Email
                            </h1>
                            <p className="text-[#8888AA] text-sm font-sans leading-relaxed mb-2">
                                A secure login link has been sent to
                            </p>
                            <p className="text-[#00D4FF] font-mono text-sm font-bold mb-6">
                                {email}
                            </p>
                            <p className="text-[#8888AA] text-xs font-sans">
                                Click the link in your email to access the portal. The link expires in 1 hour.
                            </p>
                            <button
                                onClick={() => { setSent(false); setEmail('') }}
                                className="mt-6 text-[#8888AA] font-mono text-xs hover:text-[#F0F0FF] transition-colors"
                            >
                                ← Use a different email
                            </button>
                        </div>
                    ) : (
                        /* ── Login form ── */
                        <>
                            <h1 className="font-mono font-bold text-[#F0F0FF] text-lg mb-2">
                                Secure Access
                            </h1>
                            <p className="text-[#8888AA] text-sm font-sans mb-8">
                                Enter your email to receive a magic login link.
                            </p>

                            {error && (
                                <div className="mb-6 p-3 rounded-md bg-[#FF3333]/10 border border-[#FF3333]/30 text-[#FF3333] text-sm font-mono">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="email" className="block text-[#8888AA] font-mono text-xs font-bold uppercase tracking-widest mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="operator@iimscollege.edu.np"
                                        required
                                        autoComplete="email"
                                        autoFocus
                                        className="bg-[#0A0A0F] border border-[#2D2D44] text-[#F0F0FF] rounded-md px-3 py-2.5 focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87]/20 placeholder:text-[#8888AA]/50 w-full font-mono text-sm transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#00FF87] text-black font-mono font-bold px-5 py-2.5 rounded-md hover:bg-[#00e87a] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            SENDING...
                                        </>
                                    ) : (
                                        <>
                                            Send Magic Link
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center space-y-3">
                    <p className="text-[#8888AA] text-xs font-sans">
                        Part of{' '}
                        <a
                            href="https://iimscollege.edu.np/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#00D4FF] hover:underline font-mono"
                        >
                            IIMS College
                        </a>
                        , Kathmandu
                    </p>
                    <p className="text-[10px] text-[#8888AA]/50 font-mono tracking-widest">
                        AUTHORIZED PERSONNEL ONLY • SECURE GATEWAY v3.0
                    </p>
                </div>
            </div>
        </div>
    )
}
