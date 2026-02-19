// app/dashboard/layout.tsx
// This layout wraps ALL pages inside /dashboard/*.
// It shows the Sidebar on the left and the page content on the right.
// This is a server component — it just provides structure.

import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Sidebar — fixed on desktop, hamburger on mobile */}
            <Sidebar />

            {/* Main content area — takes up remaining space */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto">
                {/* Add top padding on mobile so content doesn't hide behind hamburger button */}
                <div className="md:hidden h-12" />
                {children}
            </main>
        </div>
    )
}
