// components/public/ContactSection.tsx
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
        <section id="contact" className="py-28 bg-[#F8FAFC]">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid md:grid-cols-5 gap-12">
                    {/* Info */}
                    <div className="md:col-span-2">
                        <span className="inline-block text-xs font-bold text-[#6366F1] uppercase tracking-[0.2em] mb-3">Contact</span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-6">Get in Touch</h2>
                        <p className="text-[#64748B] leading-relaxed mb-10">
                            Interested in cybersecurity? Join IIMS Cybersecurity Club to gain hands-on experience, compete in CTFs, and connect with like-minded students.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6366F1]">✉️</div>
                                <div>
                                    <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">Email</p>
                                    <p className="text-sm text-[#0F172A] font-medium">{contactEmail || 'cybersec@iimscollege.edu.np'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#6366F1]">📍</div>
                                <div>
                                    <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">Location</p>
                                    <p className="text-sm text-[#0F172A] font-medium">IIMS College, Kathmandu</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl p-8 border border-[#E2E8F0] shadow-sm">
                            {status === 'sent' ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">Message Sent!</h3>
                                    <p className="text-sm text-[#64748B] mb-4">We&apos;ll get back to you soon.</p>
                                    <button onClick={() => setStatus('idle')} className="text-sm font-semibold text-[#6366F1] hover:underline">
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Name</label>
                                            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="input-premium" placeholder="Your name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                                            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="input-premium" placeholder="you@email.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Subject</label>
                                        <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            className="input-premium bg-white">
                                            <option>General Inquiry</option>
                                            <option>Membership</option>
                                            <option>Collaboration</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Message</label>
                                        <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            className="input-premium resize-none" placeholder="Your message..." />
                                    </div>
                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                                            <span className="text-red-500 text-sm">⚠️ Something went wrong. Please try again.</span>
                                        </div>
                                    )}
                                    <button type="submit" disabled={status === 'loading'} className="btn-primary">
                                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
