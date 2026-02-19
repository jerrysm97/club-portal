// app/portal/pending/page.tsx — Standalone pending screen (OUTSIDE protected layout)
// No portal layout wraps this page — prevents infinite redirect loop.
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Clock, Shield, Mail, CheckCircle2 } from 'lucide-react'
import SignOutButton from './SignOutButton'

export default async function PendingPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()

    let email: string | null = null
    if (session) {
        const { data: member } = await supabase
            .from('members')
            .select('email')
            .eq('user_id', session.user.id)
            .single()
        const memberEmail = (member as { email: string } | null)?.email
        email = memberEmail ?? session.user.email ?? null
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
                {/* Terminal header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-12 w-12 rounded-lg bg-[#0A0A0F] border border-[#2D2D44] flex items-center justify-center">
                        <Shield className="h-6 w-6 text-[#F59E0B]" />
                    </div>
                    <div>
                        <h2 className="font-mono font-bold text-[#F0F0FF] text-sm tracking-tight">IIMS CYBERSEC</h2>
                        <span className="font-mono text-[10px] text-[#8888AA] tracking-widest">CLEARANCE PORTAL</span>
                    </div>
                </div>

                {/* Main card */}
                <div className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-8">
                    {/* Status badge */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30 font-mono text-xs px-2 py-0.5 rounded-full flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                            PENDING REVIEW
                        </span>
                    </div>

                    <h1 className="font-mono font-bold text-[#F0F0FF] text-xl mb-3">
                        Application Under Review
                    </h1>
                    <p className="text-[#8888AA] text-sm leading-relaxed mb-8 font-sans">
                        Your membership request has been received. A club administrator will review and approve your account shortly.
                    </p>

                    {/* Status steps */}
                    <div className="space-y-3 mb-8">
                        <StatusStep status="complete" label="Account created successfully" />
                        <StatusStep status="pending" label="Awaiting administrator review" />
                        <StatusStep status="locked" label="Access to portal modules" />
                    </div>

                    {/* Email notification */}
                    <div className="bg-black border border-[#1E1E2E] rounded-md p-4 mb-8">
                        <div className="flex items-center gap-2 text-[#00D4FF] font-mono font-bold text-xs mb-2">
                            <Mail className="h-3.5 w-3.5" />
                            EMAIL NOTIFICATION
                        </div>
                        <p className="text-[#8888AA] text-xs font-sans">
                            {email
                                ? <>A welcome email will be sent to <span className="text-[#F0F0FF] font-mono">{email}</span> once approved.</>
                                : 'You will receive an email once your application is approved.'
                            }
                        </p>
                    </div>

                    {/* Sign out */}
                    <SignOutButton />
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-[10px] text-[#8888AA] font-mono tracking-widest">
                    NEED HELP?{' '}
                    <a href="mailto:cybersec@iimscollege.edu.np" className="text-[#00D4FF] hover:underline">
                        CONTACT OPS
                    </a>
                </p>
            </div>
        </div>
    )
}

function StatusStep({ status, label }: { status: 'complete' | 'pending' | 'locked'; label: string }) {
    return (
        <div className={`flex items-center gap-3 p-3 rounded-md border font-mono text-sm transition-all ${status === 'complete'
            ? 'text-[#00FF87] bg-[#00FF87]/5 border-[#00FF87]/20'
            : status === 'pending'
                ? 'text-[#F59E0B] bg-[#F59E0B]/5 border-[#F59E0B]/20'
                : 'text-[#8888AA]/40 bg-transparent border-[#1E1E2E] opacity-50'
            }`}>
            {status === 'complete' ? (
                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
            ) : status === 'pending' ? (
                <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin flex-shrink-0" />
            ) : (
                <div className="h-4 w-4 rounded-full border-2 border-current flex-shrink-0" />
            )}
            <span className="text-xs">{label}</span>
        </div>
    )
}
