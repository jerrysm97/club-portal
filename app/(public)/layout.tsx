// app/(public)/layout.tsx
// Public layout — wraps navbar + footer around all public pages.

import PublicNavbar from '@/components/public/PublicNavbar'
import PublicFooter from '@/components/public/PublicFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black min-h-screen">
            <PublicNavbar />
            <main className="pt-14">{children}</main>
            <PublicFooter />
        </div>
    )
}
