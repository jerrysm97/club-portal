// app/page.tsx
// This is your landing page — the first thing visitors see.
// It shows a clean welcome screen with a button to go to the login page.

import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="max-w-lg w-full text-center space-y-8">

        {/* Logo / Club icon */}
        <div className="mx-auto w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Welcome text */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Club Member Portal
          </h1>
          <p className="text-lg text-slate-600">
            A private space for members to connect, share documents, and stay updated.
          </p>
        </div>

        {/* CTA button — takes user to the login page */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all"
          >
            Sign In to Portal
          </Link>
          <p className="text-sm text-slate-400">
            Invite-only membership. Contact an admin to request access.
          </p>
        </div>
      </div>
    </div>
  )
}
