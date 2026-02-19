// components/public/ContactSection.tsx — Premium minimal
'use client'

import { useState } from 'react'

interface Props { contactEmail?: string }

export default function ContactSection({ contactEmail }: Props) {
    const [form, setForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' })
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!form.name || !form.email || !form.message) return
        setStatus('loading')
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            if (!res.ok) throw new Error()
            setStatus('sent')
            setForm({ name: '', email: '', subject: 'General Inquiry', message: '' })
        } catch {
            setStatus('error')
        }
    }

    return (
        <section id="contact" className="py-24 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Info */}
                    <div>
                        <p className="text-sm font-semibold text-[#6366F1] uppercase tracking-wider mb-2">Contact</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">Get in Touch</h2>
                        <p className="text-[#6B7280] leading-relaxed mb-8">
                            Interested in cybersecurity? Join IIMS Cybersecurity Club to gain hands-on experience, compete in CTFs, and connect with like-minded students.
                        </p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                                <span className="text-[#6366F1]">✉</span>
                                {contactEmail || 'cybersec@iimscollege.edu.np'}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-xl p-8 border border-[#E5E7EB] shadow-sm">
                        {status === 'sent' ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-3">✓</div>
                                <h3 className="text-xl font-semibold text-[#111827] mb-2">Message Sent!</h3>
                                <p className="text-sm text-[#6B7280]">We&apos;ll get back to you soon.</p>
                                <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-[#6366F1] hover:underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Name</label>
                                        <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all" placeholder="Your name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#374151] mb-1.5">Email</label>
                                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all" placeholder="you@email.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Subject</label>
                                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all bg-white">
                                        <option>General Inquiry</option>
                                        <option>Membership</option>
                                        <option>Collaboration</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#374151] mb-1.5">Message</label>
                                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20 focus:border-[#6366F1] transition-all resize-none" placeholder="Your message..." />
                                </div>
                                {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
                                <button type="submit" disabled={status === 'loading'}
                                    className="w-full py-3 rounded-lg bg-[#6366F1] text-white font-semibold hover:bg-[#4F46E5] transition-colors disabled:opacity-50">
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
