// app/(public)/layout.tsx — IIMS IT Club Public Layout (v4.0)
import IIMSAffiliationStrip from '@/components/public/IIMSAffiliationStrip'
import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <IIMSAffiliationStrip />
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    )
}
