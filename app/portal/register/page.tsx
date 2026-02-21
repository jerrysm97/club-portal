// app/portal/register/page.tsx — Registration page (no auth required)
import RegisterForm from './RegisterForm'
import Link from 'next/link'
import { BRAND } from '@/lib/brand'

export const metadata = { title: `Register | ${BRAND.clubShort}` }

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#F8F9FA] flex py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full mx-auto animate-fade-up">
                <div className="bg-white rounded-sm shadow-sm shadow-black/5 border border-[#E0E0E0] overflow-hidden">
                    <div className="bg-[#111111] px-8 py-10 md:px-10 text-white relative overflow-hidden">
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">Join {BRAND.clubShort}</h1>
                            <p className="text-[#FAFAFA] text-sm md:text-base opacity-90">
                                Create your account and provide academic details to apply for membership.
                            </p>
                        </div>
                    </div>
                    <div className="p-8 md:p-10">
                        <RegisterForm />
                    </div>
                </div>
                {/* Footer */}
                <p className="mt-8 text-center text-xs text-[#9E9E9E] font-medium">
                    {BRAND.clubShort} • Membership Portal v4.0
                </p>
            </div>
        </div>
    )
}
