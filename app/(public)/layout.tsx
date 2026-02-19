// app/(public)/layout.tsx
// Public website layout — wraps all public pages with Navbar + Footer.
// Uses pt-16 to clear the fixed 64px navbar.

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
            <main className="pt-16 bg-[#0D0D0D]">{children}</main>
            <PublicFooter />
        </>
    )
}
