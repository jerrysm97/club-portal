// app/portal/dashboard/layout.tsx
// Layout for all portal dashboard pages.
// Shows the PortalNavbar at top and Sidebar on the left.

import PortalNavbar from '@/components/portal/PortalNavbar'
import Sidebar from '@/components/Sidebar'

export default function PortalDashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Portal top bar */}
            <PortalNavbar />
            <div className="flex">
                {/* Sidebar navigation */}
                <Sidebar />
                {/* Main content area */}
                <main className="flex-1 p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
