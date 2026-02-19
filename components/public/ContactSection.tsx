// components/public/ContactSection.tsx
// Contact section with form + info. Form POSTs to /api/contact.

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactSection() {
    const [formData, setFormData] = useState({
        name: '', email: '', subject: 'General Inquiry', message: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMsg('Please fill in all required fields.')
            setStatus('error')
            return
        }
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (!res.ok) throw new Error()
            setStatus('success')
        } catch {
            setErrorMsg('Something went wrong. Please try again.')
            setStatus('error')
        }
    }

    return (
        <section className="py-24 px-4 bg-[#0A1F44]/50">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3">// 07 — Get In Touch</p>
                <h2 className="font-[var(--font-orbitron)] font-bold text-3xl md:text-4xl text-white mb-12">
                    Contact Us
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Join info */}
                    <div>
                        <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-4">
                            Join the Club
                        </h3>
                        <p className="font-[var(--font-exo2)] text-[#8892A4] leading-relaxed mb-6">
                            Interested in cybersecurity? Join IIMS Cybersecurity Club to gain hands-on experience, compete in CTFs, and connect with like-minded students.
                        </p>
                        <Link
                            href="/portal/login"
                            className="inline-block px-6 py-3 text-sm font-bold bg-[#00B4FF] text-[#0D0D0D] rounded-xl hover:bg-[#00FF9C] transition-all duration-300 mb-10"
                        >
                            Apply for Membership →
                        </Link>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3 text-[#8892A4]">
                                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#00B4FF]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                cybersec@iimscollege.edu.np
                            </div>
                            <div className="flex items-center gap-3 text-[#8892A4]">
                                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#00B4FF]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    </svg>
                                </div>
                                IIMS College, Kumaripati, Kathmandu
                            </div>
                            <div className="flex items-center gap-3 text-[#8892A4]">
                                <div className="w-8 h-8 glass rounded-lg flex items-center justify-center text-[#00B4FF]">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                    </svg>
                                </div>
                                <a href="https://iimscollege.edu.np/" target="_blank" rel="noopener noreferrer" className="text-[#00B4FF] hover:text-[#00FF9C] transition-colors">
                                    iimscollege.edu.np →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact form */}
                    <div>
                        {status === 'success' ? (
                            <div className="glass rounded-2xl p-10 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#00FF9C]/20 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-[#00FF9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="font-[var(--font-orbitron)] font-bold text-white text-xl mb-2">Message Sent!</h3>
                                <p className="font-[var(--font-exo2)] text-[#8892A4]">We&apos;ll get back to you within 48 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_rgba(0,180,255,0.2)] transition-all" />
                                <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_rgba(0,180,255,0.2)] transition-all" />
                                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-[#00B4FF] transition-all">
                                    <option className="bg-[#0D0D0D]">General Inquiry</option>
                                    <option className="bg-[#0D0D0D]">Join the Club</option>
                                    <option className="bg-[#0D0D0D]">Event Query</option>
                                    <option className="bg-[#0D0D0D]">Partnership</option>
                                    <option className="bg-[#0D0D0D]">Other</option>
                                </select>
                                <textarea required rows={4} placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder:text-[#8892A4] focus:outline-none focus:border-[#00B4FF] focus:shadow-[0_0_10px_rgba(0,180,255,0.2)] transition-all resize-none" />
                                {status === 'error' && <p className="text-[#FF3B3B] text-sm">{errorMsg}</p>}
                                <button type="submit" disabled={status === 'loading'} className="w-full py-3.5 text-sm font-bold bg-[#00B4FF] text-[#0D0D0D] rounded-lg hover:bg-[#00FF9C] transition-all duration-300 disabled:opacity-50">
                                    {status === 'loading' ? 'Sending...' : 'Send Message →'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
