// app/portal/dashboard/layout.tsx
// Portal dashboard layout — Stealth Terminal with topbar + sidebar.

import PortalNavbar from '@/components/portal/PortalNavbar'
import Sidebar from '@/components/Sidebar'

export default function PortalDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-black flex flex-col">
            <PortalNavbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
