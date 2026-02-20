// app/portal/pending/page.tsx — Awaiting approval screen (IIMS v4.0)
import { createServerClient } from '@/lib/supabase-server'
import { Shield, Mail, CheckCircle2, Clock } from 'lucide-react'
import SignOutButton from './SignOutButton'
import { redirect } from 'next/navigation'

export default async function PendingPage() {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/portal/login')
    }

    const { data: member } = await supabase
        .from('members')
        .select('email, student_id')
        .eq('user_id', user.id)
        .single()

    // If profile is incomplete (no student ID), force them to complete registration
    if (member && !member.student_id) {
        redirect('/portal/register')
    }

    const email = member?.email || user.email || null

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative">
            <div className="w-full max-w-md relative animate-fade-up">
                {/* Brand header */}
                <div className="flex items-center gap-3 mb-8 justify-center">
                    <div className="h-12 w-12 rounded-xl bg-[#1A237E] flex items-center justify-center shadow-md">
                        <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[#1A237E] text-base tracking-tight">IIMS IT Club</h2>
                        <span className="text-[10px] text-[#757575] font-semibold tracking-widest uppercase">Member Portal</span>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-white border border-[#E0E0E0] shadow-xl shadow-black/5 rounded-2xl p-8">
                    {/* Status badge */}
                    <div className="flex items-center justify-center mb-6">
                        <span className="text-[#F57F17] bg-[#FFF8E1] border border-[#F57F17]/20 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F57F17] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F57F17]"></span>
                            </span>
                            PENDING REVIEW
                        </span>
                    </div>

                    <h1 className="font-bold text-[#212121] text-xl text-center mb-3">
                        Application Under Review
                    </h1>
                    <p className="text-[#757575] text-sm text-center leading-relaxed mb-8">
                        Your membership request has been received. A club administrator will review and approve your account shortly.
                    </p>

                    {/* Status steps */}
                    <div className="space-y-3 mb-8">
                        <StatusStep status="complete" label="Account secured" />
                        <StatusStep status="complete" label="Profile completed" />
                        <StatusStep status="pending" label="Awaiting administrator review" />
                        <StatusStep status="locked" label="Access to portal modules" />
                    </div>

                    {/* Email notification block */}
                    <div className="bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl p-4 mb-8">
                        <div className="flex items-center gap-2 text-[#1A237E] font-semibold text-xs mb-2 uppercase tracking-wide">
                            <Mail className="h-4 w-4" />
                            Email Notification
                        </div>
                        <p className="text-[#424242] text-sm">
                            {email
                                ? <>We will notify <span className="font-semibold">{email}</span> once your application is approved.</>
                                : 'You will receive an email once your application is approved.'
                            }
                        </p>
                    </div>

                    <SignOutButton />
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-[#9E9E9E] font-medium">
                    Need Help?{' '}
                    <a href="mailto:itclub@iimscollege.edu.np" className="text-[#1A237E] hover:underline font-semibold">
                        Contact Administration
                    </a>
                </p>
            </div>
        </div>
    )
}

function StatusStep({ status, label }: { status: 'complete' | 'pending' | 'locked'; label: string }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${status === 'complete'
                ? 'text-[#2E7D32] bg-[#E8F5E9] border-[#2E7D32]/20 font-medium'
                : status === 'pending'
                    ? 'text-[#F57F17] bg-[#FFF8E1] border-[#F57F17]/20 font-medium'
                    : 'text-[#9E9E9E] bg-white border-[#E0E0E0]'
            }`}>
            {status === 'complete' ? (
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : status === 'pending' ? (
                <Clock className="h-5 w-5 flex-shrink-0 text-[#F57F17]" />
            ) : (
                <div className="h-5 w-5 rounded-full border-2 border-current flex-shrink-0 opacity-50" />
            )}
            <span>{label}</span>
        </div>
    )
}
