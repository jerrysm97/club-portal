// app/(public)/contact/page.tsx
// Contact page: contact info on left, form on right
// Form submits to /api/contact API route

'use client'

import { useState } from 'react'

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
    })
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus('loading')
        setErrorMsg('')

        // Basic client-side validation
        if (!formData.name || !formData.email || !formData.message) {
            setErrorMsg('Please fill in all required fields.')
            setStatus('error')
            return
        }

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to send message')
            setStatus('success')
        } catch {
            setErrorMsg('Something went wrong. Please try again later.')
            setStatus('error')
        }
    }

    return (
        <div className="bg-slate-950">

            {/* Hero Banner */}
            <section className="relative py-28 px-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.3) 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
                <div className="relative max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-lg text-slate-400">
                        Questions, feedback, or want to join? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Content: Info + Form */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">

                    {/* Left column: Contact info */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            Whether you want to join the club, collaborate on an event, or just say hello — drop us a message and we&apos;ll respond within 48 hours.
                        </p>

                        <div className="space-y-6">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Email</p>
                                    <p className="text-slate-400 text-sm">cyberclub@iimscollege.edu.np</p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">Location</p>
                                    <p className="text-slate-400 text-sm">IIMS College, Kumaripati<br />Lalitpur, Kathmandu, Nepal</p>
                                </div>
                            </div>

                            {/* College */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">IIMS College</p>
                                    <a href="https://iimscollege.edu.np/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm">
                                        iimscollege.edu.np →
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Map placeholder */}
                        <div className="mt-10 h-48 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center">
                            <p className="text-slate-500 text-sm">📍 Find us at IIMS College, Kumaripati</p>
                        </div>
                    </div>

                    {/* Right column: Contact form */}
                    <div>
                        {status === 'success' ? (
                            /* Success state */
                            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-10 text-center">
                                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Message Sent!</h3>
                                <p className="text-slate-400">We&apos;ll get back to you within 48 hours.</p>
                            </div>
                        ) : (
                            /* Form */
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        placeholder="you@email.com"
                                    />
                                </div>

                                {/* Subject dropdown */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Subject</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    >
                                        <option>General Inquiry</option>
                                        <option>Join the Club</option>
                                        <option>Event Query</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Message *</label>
                                    <textarea
                                        required
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                                        placeholder="Your message..."
                                    />
                                </div>

                                {/* Error message */}
                                {status === 'error' && (
                                    <p className="text-red-400 text-sm">{errorMsg}</p>
                                )}

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
