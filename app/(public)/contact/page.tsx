// app/(public)/contact/page.tsx
// Contact page — reuses ContactSection component.

import ContactSection from '@/components/public/ContactSection'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="bg-[#0D0D0D]">
            {/* Hero banner */}
            <section className="relative py-28 px-4 bg-grid">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/80 to-[#0D0D0D]" />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="font-[var(--font-orbitron)] font-black text-4xl md:text-5xl text-white mb-4">
                        Contact Us
                    </h1>
                    <p className="font-[var(--font-mono)] text-[#8892A4] text-sm">
                        <Link href="/" className="hover:text-[#00B4FF] transition-colors">Home</Link>
                        {' / '}
                        <span className="text-[#00B4FF]">Contact</span>
                    </p>
                </div>
            </section>

            {/* Contact section (reused component) */}
            <ContactSection />
        </div>
    )
}
