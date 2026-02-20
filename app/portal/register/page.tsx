// app/portal/register/page.tsx — Profile completion page
import { createServerClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import RegisterForm from './RegisterForm'

export const metadata = { title: 'Complete Profile | IIMS IT Club' }

export default async function RegisterPage() {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/portal/login')
    }

    const { data: member } = await supabase
        .from('members')
        .select('full_name, student_id')
        .eq('user_id', user.id)
        .single()

    // If profile is already complete (has student_id), send them away
    // Note: middleware.ts handles pending redirect if they have a student_id but status is pending
    if (member?.student_id) {
        redirect('/portal/dashboard')
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full mx-auto animate-fade-up">
                <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E0E0E0] overflow-hidden">
                    <div className="bg-[#1A237E] px-8 py-10 md:px-10 text-white relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Profile</h1>
                            <p className="text-[#E8EAF6] text-sm md:text-base opacity-90">
                                Welcome to the IIMS IT Club. Please provide your academic details to process your membership application.
                            </p>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <RegisterForm initialName={member?.full_name && member.full_name !== 'New Member' ? member.full_name : ''} />
                    </div>
                </div>
                {/* Footer */}
                <p className="mt-8 text-center text-xs text-[#9E9E9E] font-medium">
                    IIMS IT Club • Membership Portal v4.0
                </p>
            </div>
        </div>
    )
}
