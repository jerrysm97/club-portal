// app/(public)/layout.tsx
// Layout for all PUBLIC website pages (/, /about, /events, /contact).
// Wraps children with the PublicNavbar at top and PublicFooter at bottom.
// The pt-16 accounts for the fixed navbar height (h-16 = 4rem).

import PublicNavbar from '@/components/public/PublicNavbar'
import PublicFooter from '@/components/public/PublicFooter'

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <PublicNavbar />
            {/* Main content area — padded top to clear the fixed navbar */}
            <main className="pt-16 min-h-screen bg-slate-950">
                {children}
            </main>
            <PublicFooter />
        </>
    )
}
