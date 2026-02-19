// app/portal/pending/page.tsx — IIMS Collegiate Application Pending Screen
'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Clock, LogOut, ShieldCheck, Mail, ChevronRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PendingPage() {
    const router = useRouter()

    async function handleSignOut() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/portal/login')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#FCD34D]" />
            <div className="absolute inset-0 hero-grid opacity-5 pointer-events-none" />

            <div className="w-full max-w-md relative animate-fade-up text-center">
                {/* Branding */}
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-white shadow-2xl border border-gray-100 mb-8 group transition-transform">
                    <ShieldCheck className="h-10 w-10 text-[#58151C]" />
                </div>

                {/* Card */}
                <div className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-50 text-amber-600 mb-8 shadow-inner animate-pulse">
                        <Clock className="h-8 w-8" />
                    </div>

                    <h1 className="text-2xl font-poppins font-bold text-[#111827] mb-4">
                        Security Clearance Pending
                    </h1>
                    <p className="text-[#6B7280] font-medium leading-relaxed mb-10">
                        Your application is currently under review by our lead operators. You will be cleared for portal access shortly.
                    </p>

                    <div className="space-y-4 mb-10 text-left">
                        <StatusStep status="complete" label="Account created successfully" />
                        <StatusStep status="pending" label="Awaiting lead administrator review" />
                        <StatusStep status="locked" label="Access to portal modules" />
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-10 text-center border border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-[#58151C] font-bold text-sm mb-2">
                            <Mail className="h-4 w-4" />
                            Email Notification
                        </div>
                        <p className="text-xs text-gray-500 font-medium">
                            A welcome transmission will be sent to your inbox upon approval.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleSignOut}
                        className="w-full h-12 rounded-xl text-sm border-2 font-bold group"
                        leftIcon={<LogOut className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />}
                    >
                        Abort Session
                    </Button>
                </div>

                <p className="mt-10 text-xs text-gray-400 font-medium">
                    Need assistance? <a href="mailto:cybersec@iimscollege.edu.np" className="text-[#C3161C] font-bold hover:underline">Contact Base Ops</a>
                </p>
            </div>
        </div>
    )
}

function StatusStep({ status, label }: { status: 'complete' | 'pending' | 'locked'; label: string }) {
    const styles = {
        complete: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        pending: 'text-amber-600 bg-amber-50 border-amber-100 font-bold',
        locked: 'text-gray-400 bg-gray-50 border-gray-100 opacity-50',
    }

    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border ${styles[status]} transition-all`}>
            {status === 'complete' ? (
                <CheckCircle2 className="h-5 w-5" />
            ) : status === 'pending' ? (
                <div className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
                <div className="h-5 w-5 rounded-full border-2 border-current" />
            )}
            <span className="text-sm">{label}</span>
            {status === 'pending' && <ChevronRight className="h-4 w-4 ml-auto opacity-50" />}
        </div>
    )
}
