// app/portal/signup/page.tsx — IIMS Collegiate Member Induction Application
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Eye, EyeOff, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    })
    const [showPw, setShowPw] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError(null)

        if (formData.password !== formData.confirm_password) {
            setError('Security keys do not match')
            return
        }
        if (formData.password.length < 8) {
            setError('Security key must be at least 8 characters')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json() as { error?: unknown }

            if (!res.ok) {
                const errMsg = typeof data.error === 'string'
                    ? data.error
                    : 'Induction protocols failed. Please try again.'
                throw new Error(errMsg)
            }

            router.push('/portal/pending')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Induction transmission failure')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-full h-1 bg-[#C3161C]" />
            <div className="absolute inset-0 hero-grid opacity-5 pointer-events-none" />

            <div className="w-full max-w-xl relative animate-fade-up">
                {/* Branding */}
                <div className="flex items-center justify-between mb-8">
                    <Link href="/portal/login" className="flex items-center gap-2 text-[#58151C] hover:text-[#C3161C] font-bold text-sm transition-all group">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Abort & Return
                    </Link>
                    <div className="px-4 py-1.5 rounded-xl bg-[#58151C]/5 text-[#58151C] font-black text-[10px] uppercase tracking-widest border border-[#58151C]/10">
                        Phase 1: Induction
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 rounded-2xl bg-[#58151C] text-white shadow-lg">
                            <UserPlus className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-poppins font-bold text-[#111827]">Apply for Membership</h1>
                            <p className="text-gray-400 font-medium text-sm">Join the IIMS Cybersecurity Task Force</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Full Identity Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ramesh Sharma"
                                required
                            />
                            <Input
                                label="Academic Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="operator@iimscollege.edu.np"
                                required
                                autoComplete="email"
                            />
                        </div>



                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <Input
                                    label="Security Key"
                                    name="password"
                                    type={showPw ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-[42px] text-gray-400 hover:text-[#58151C] transition-colors"
                                >
                                    {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            <Input
                                label="Confirm Key"
                                name="confirm_password"
                                type={showPw ? 'text' : 'password'}
                                value={formData.confirm_password}
                                onChange={handleChange}
                                placeholder="Re-enter security key"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            className="w-full h-14 rounded-2xl text-base shadow-lg shadow-red-100 mt-6"
                            rightIcon={<ArrowRight className="h-5 w-5" />}
                        >
                            {loading ? 'Transmitting Induction Data…' : 'Submit Induction Application'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-10">
                    IIMS Cybersecurity Club • Membership Management System v2.0
                </p>
            </div>
        </div>
    )
}
