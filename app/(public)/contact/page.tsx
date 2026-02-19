// app/(public)/contact/page.tsx — IIMS Collegiate Public Contact Page
import ContactSection from '@/components/public/ContactSection'
import { Mail, ShieldCheck } from 'lucide-react'

export const revalidate = 60

export default async function ContactPage() {
    // Stats and settings moved to component-level defaults or simple manual injection
    // site_settings table is being simplified, using defaults for now
    const settings = {
        contact_email: 'cybersec@iimscollege.edu.np',
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="py-32 bg-[#58151C] relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 hero-grid opacity-10 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-up">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-8 mx-auto">
                        <ShieldCheck className="h-5 w-5 text-[#FCD34D]" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest">Secure Communication Channel</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-poppins font-bold text-white mb-8">
                        Establish <span className="text-[#FCD34D]">Uplink</span>
                    </h1>
                    <p className="text-[#FECACA] font-medium text-xl leading-relaxed max-w-2xl mx-auto">
                        Initiate a secure transmission with our lead operators.
                        All communications are handled with strict technical integrity.
                    </p>
                </div>
            </section>

            <ContactSection contactEmail={settings.contact_email} />
        </div>
    )
}
