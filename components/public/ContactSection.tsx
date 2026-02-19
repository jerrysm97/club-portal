// components/public/ContactSection.tsx — Stealth Terminal Contact
'use client'

import React, { useState } from 'react' // Import React and useState
import { Send, Loader2, CheckCircle, Mail, MapPin } from 'lucide-react'
import { contactFormSchema } from '@/lib/validations'
import { z } from 'zod'

export default function ContactSection({ contactEmail }: { contactEmail?: string | null }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErrors({}) // Clear previous errors

        try {
            // Validate form
            contactFormSchema.parse(formData)

            // Simulate API call (replace with actual fetch later)
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to send message')

            setSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
        } catch (err) {
            if (err instanceof z.ZodError) {
                const fieldErrors: Record<string, string> = {}; // Added semicolon to prevent ASI issues

                // Type assertion to fix build error
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (err as any).errors.forEach((e: any) => {
                    if (e.path[0]) fieldErrors[e.path[0] as string] = e.message
                })
                setErrors(fieldErrors)
            } else {
                alert('Transmission failed. Check network connection.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 bg-[#09090B] border-t border-[#27272A]">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div>
                    <h2 className="text-3xl md:text-5xl font-mono font-bold text-[#F8FAFC] mb-8">
                        Establish <span className="text-[#10B981]">Uplink</span>
                    </h2>
                    <p className="text-[#A1A1AA] font-mono mb-12 leading-relaxed">
                        Have a query about our operations? Want to collaborate on a security project?
                        Initiate a secure transmission below.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4 p-6 rounded-sm bg-black border border-[#27272A]">
                            <Mail className="h-6 w-6 text-[#10B981] mt-1" />
                            <div>
                                <h4 className="font-mono font-bold text-[#F8FAFC] mb-1">Electronic Mail</h4>
                                <a href={`mailto:${contactEmail || 'cybersec@iimscollege.edu.np'}`} className="text-[#A1A1AA] hover:text-[#10B981] transition-colors font-mono text-sm">
                                    {contactEmail || 'cybersec@iimscollege.edu.np'}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-6 rounded-sm bg-black border border-[#27272A]">
                            <MapPin className="h-6 w-6 text-[#10B981] mt-1" />
                            <div>
                                <h4 className="font-mono font-bold text-[#F8FAFC] mb-1">Base of Operations</h4>
                                <p className="text-[#A1A1AA] font-mono text-sm">
                                    IIMS College<br />
                                    Putalisadak, Kathmandu
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-black border border-[#27272A] rounded-sm p-8">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mb-6">
                                <CheckCircle className="h-8 w-8 text-[#10B981]" />
                            </div>
                            <h3 className="font-mono font-bold text-xl text-[#F8FAFC] mb-2">Transmission Received</h3>
                            <p className="text-[#A1A1AA] font-mono text-sm">Our operatives will respond shortly.</p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="mt-8 text-[#10B981] font-mono text-xs hover:underline"
                            >
                                Send_Another_Transmission
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block font-mono text-xs text-[#A1A1AA] mb-2 uppercase">Identity</label>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-4 py-3 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] focus:outline-none transition-colors placeholder:text-[#3F3F46]"
                                />
                                {errors.name && <p className="text-[#EF4444] text-xs font-mono mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-mono text-xs text-[#A1A1AA] mb-2 uppercase">Return Address</label>
                                <input
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-4 py-3 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] focus:outline-none transition-colors placeholder:text-[#3F3F46]"
                                />
                                {errors.email && <p className="text-[#EF4444] text-xs font-mono mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block font-mono text-xs text-[#A1A1AA] mb-2 uppercase">Subject Line</label>
                                <input
                                    type="text"
                                    placeholder="Collaboration Inquiry"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-4 py-3 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] focus:outline-none transition-colors placeholder:text-[#3F3F46]"
                                />
                                {errors.subject && <p className="text-[#EF4444] text-xs font-mono mt-1">{errors.subject}</p>}
                            </div>

                            <div>
                                <label className="block font-mono text-xs text-[#A1A1AA] mb-2 uppercase">Payload</label>
                                <textarea
                                    rows={4}
                                    placeholder="Type your message here..."
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-4 py-3 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] focus:outline-none transition-colors placeholder:text-[#3F3F46] resize-none"
                                />
                                {errors.message && <p className="text-[#EF4444] text-xs font-mono mt-1">{errors.message}</p>}
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#F8FAFC] text-black font-mono font-bold py-3 rounded-sm hover:bg-[#E2E8F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                    {loading ? 'Transmitting...' : 'Send_Transmission'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}
