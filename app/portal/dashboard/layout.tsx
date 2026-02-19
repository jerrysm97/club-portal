// app/portal/dashboard/layout.tsx
// Portal dashboard layout — Cyber Blue themed.

import PortalNavbar from '@/components/portal/PortalNavbar'
import Sidebar from '@/components/Sidebar'

export default function PortalDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#0D0D0D]">
            <PortalNavbar />
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
