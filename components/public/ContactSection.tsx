// components/public/ContactSection.tsx
// Contact form — saves to contact_messages table via /api/contact.

'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ContactSection({ contactEmail }: { contactEmail: string }) {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!formData.name || !formData.email || !formData.message) return
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
            setStatus('error')
        }
    }

    return (
        <section className="py-24 px-4 bg-[#09090B]">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-3 uppercase">{'>'} 07_CONTACT</p>
                <h2 className="font-[var(--font-mono)] font-bold text-3xl md:text-4xl text-[#F8FAFC] mb-12">
                    Contact Us
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Left: Info */}
                    <div>
                        <h3 className="font-[var(--font-mono)] font-bold text-[#F8FAFC] text-lg mb-4">Join the Club</h3>
                        <p className="text-[#A1A1AA] leading-relaxed mb-6">
                            Interested in cybersecurity? Join IIMS Cybersecurity Club to gain hands-on experience, compete in CTFs, and connect with like-minded students.
                        </p>
                        <Link href="/portal/login" className="inline-block px-6 py-3 text-sm font-bold bg-[#10B981] text-black rounded-sm hover:opacity-90 transition-opacity mb-8">
                            Apply for Membership →
                        </Link>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3 text-[#A1A1AA]">
                                <span className="text-[#10B981] font-[var(--font-mono)]">{'>'}</span>
                                {contactEmail}
                            </div>
                            <div className="flex items-center gap-3 text-[#A1A1AA]">
                                <span className="text-[#10B981] font-[var(--font-mono)]">{'>'}</span>
                                IIMS College, Kumaripati, Kathmandu
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[#10B981] font-[var(--font-mono)]">{'>'}</span>
                                <a href="https://iimscollege.edu.np/" target="_blank" rel="noopener noreferrer" className="text-[#06B6D4] hover:text-[#10B981] transition-colors">
                                    iimscollege.edu.np →
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div>
                        {status === 'success' ? (
                            <div className="bg-[#09090B] border border-[#10B981] rounded-md p-10 text-center">
                                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-2">{'>'} MESSAGE_SENT</p>
                                <p className="text-[#A1A1AA] text-sm">We&apos;ll get back to you within 48 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" required placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors" />
                                <input type="email" required placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors" />
                                <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm focus:outline-none focus:border-[#10B981] transition-colors">
                                    <option>General Inquiry</option>
                                    <option>Join the Club</option>
                                    <option>Event Query</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                                <textarea required rows={4} placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-[#09090B] border border-[#27272A] rounded-sm text-[#F8FAFC] text-sm placeholder:text-[#A1A1AA] focus:outline-none focus:border-[#10B981] transition-colors resize-none" />
                                {status === 'error' && <p className="text-[#EF4444] text-sm font-[var(--font-mono)]">{'>'} ERROR: Something went wrong. Try again.</p>}
                                <button type="submit" disabled={status === 'loading'} className="w-full py-3 text-sm font-bold bg-[#10B981] text-black rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50">
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
