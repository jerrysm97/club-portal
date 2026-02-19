// app/portal/dashboard/layout.tsx — Dashboard layout (premium minimal)
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <Sidebar />
            <main className="md:ml-64 p-6 md:p-8">
                {children}
            </main>
        </div>
    )
}
