// app/(public)/contact/page.tsx — Contact page
import { createClient } from '@supabase/supabase-js'
import ContactSection from '@/components/public/ContactSection'

export const revalidate = 60

export default async function ContactPage() {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await sb.from('site_settings').select('contact_email').eq('id', 'global').single()

    return (
        <>
            <div className="bg-gradient-to-br from-[#111827] to-[#1E1B4B] text-white py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <p className="text-sm text-[#C7D2FE]/60 mb-1">Home / Contact</p>
                    <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
                </div>
            </div>
            <ContactSection contactEmail={data?.contact_email} />
        </>
    )
}
