// app/pending/page.tsx
// This page is shown to users whose membership is still "pending" admin approval.
// They cannot access the dashboard until an admin changes their status to "approved".

'use client'

export default function PendingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
            <div className="max-w-md w-full text-center space-y-6 bg-white p-10 rounded-2xl shadow-sm border border-slate-100">

                {/* Clock icon to indicate waiting */}
                <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Main message */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Membership Pending</h1>
                    <p className="text-slate-600">
                        Thanks for joining! Your account has been created, but an admin needs to approve your membership before you can access the portal.
                    </p>
                </div>

                {/* Friendly info box */}
                <div className="p-4 bg-slate-50 rounded-xl">
                    <p className="text-sm text-slate-500 italic">
                        Once approved, you&apos;ll be able to see the dashboard, documents, and join the conversation.
                    </p>
                </div>

                {/* Back to login link */}
                <button
                    onClick={() => window.location.href = '/login'}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors cursor-pointer"
                >
                    ← Back to Login
                </button>
            </div>
        </div>
    )
}
