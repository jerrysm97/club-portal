// app/portal/login/page.tsx — IIMS Collegiate Member Login
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { loginSchema } from '@/lib/validations'
import { ShieldCheck, Eye, EyeOff, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        const result = loginSchema.safeParse({ email, password })
        if (!result.success) {
            setError(result.error.issues[0].message)
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: result.data.email,
                password: result.data.password,
            })
            if (authError) throw authError

            router.push('/portal/dashboard')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Invalid transmission credentials')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#58151C]" />
            <div className="absolute inset-0 hero-grid opacity-5 pointer-events-none" />

            <div className="w-full max-w-md relative animate-fade-up">
                {/* Branding */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white shadow-2xl border border-gray-100 mb-6 group hover:scale-105 transition-transform">
                        <ShieldCheck className="h-10 w-10 text-[#C3161C]" />
                    </div>
                    <h1 className="text-3xl font-poppins font-bold text-[#111827]">Member Portal</h1>
                    <p className="text-gray-400 font-medium mt-2">IIMS Cybersecurity Club Operations</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100">
                    <h2 className="text-xl font-bold text-[#111827] mb-8">Secure Access Login</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Operator Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="operator@iimscollege.edu.np"
                            required
                            autoComplete="email"
                        />

                        <div className="relative">
                            <Input
                                label="Security Key (Password)"
                                type={showPw ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-4 top-[42px] text-gray-400 hover:text-[#58151C] transition-colors"
                                aria-label={showPw ? 'Hide security key' : 'Show security key'}
                            >
                                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full h-14 rounded-2xl text-base shadow-lg shadow-red-100 mt-4"
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            Initialize Session
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Not yet an operative?{' '}
                            <Link href="/portal/signup" className="text-[#C3161C] font-bold hover:underline transition-all">
                                Apply for Induction
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-8">
                    Authorized Personnel Only • Secure Gateway v2.0
                </p>
            </div>
        </div>
    )
}
