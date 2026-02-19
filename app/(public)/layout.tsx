// app/(public)/layout.tsx — Public layout
import PublicNavbar from '@/components/public/PublicNavbar'
import PublicFooter from '@/components/public/PublicFooter'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <PublicNavbar />
            <main className="pt-16">{children}</main>
            <PublicFooter />
        </div>
    )
}
