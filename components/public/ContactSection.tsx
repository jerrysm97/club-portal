// components/public/ContactSection.tsx — IIMS Collegiate Public Contact
'use client'
import React, { useState } from 'react'
import { Send, Loader2, CheckCircle, Mail, MapPin, Globe, ArrowRight } from 'lucide-react'
import { contactSchema } from '@/lib/validations'
import { z } from 'zod'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ContactSection({ contactEmail }: { contactEmail?: string | null }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setErrors({})

        try {
            contactSchema.parse(formData)

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
                const fieldErrors: Record<string, string> = {}
                err.issues.forEach((e) => {
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
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    {/* Contact Info */}
                    <div className="animate-fade-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-poppins text-sm font-bold tracking-wider uppercase mb-6">
                            <Mail className="h-4 w-4" />
                            <span>Get In Touch</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-poppins font-bold text-[#111827] mb-8 leading-tight">
                            Establish a <span className="text-[#C3161C]">Secure Uplink</span> with Our Team
                        </h2>

                        <p className="text-[#6B7280] text-lg mb-12 leading-relaxed font-medium">
                            Have a query about our operations? Want to collaborate on a security project?
                            Initiate a secure transmission below and our operatives will respond shortly.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <ContactInfoCard
                                icon={<Mail className="h-6 w-6" />}
                                title="Electronic Mail"
                                value={contactEmail || 'cybersec@iimscollege.edu.np'}
                                href={`mailto:${contactEmail || 'cybersec@iimscollege.edu.np'}`}
                            />
                            <ContactInfoCard
                                icon={<MapPin className="h-6 w-6" />}
                                title="Base of Operations"
                                value="IIMS College Campus, Putalisadak, Kathmandu"
                                href="#"
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="relative animate-fade-up">
                        <div className="absolute -inset-4 bg-gradient-to-br from-[#58151C]/5 to-[#C3161C]/5 blur-3xl rounded-[2rem] -z-10" />
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12 shadow-2xl">
                            {success ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                        <CheckCircle className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-poppins font-bold text-[#111827] mb-3">Transmission Received</h3>
                                    <p className="text-[#6B7280] mb-8">Your message has been encrypted and sent to our lead operators.</p>
                                    <Button
                                        variant="outline"
                                        onClick={() => setSuccess(false)}
                                        className="rounded-xl border-2 px-8"
                                    >
                                        Send Another Transmission
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <Input
                                        label="Identity (Full Name)"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        error={errors.name}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Return Address (Email)"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            error={errors.email}
                                        />
                                        <Input
                                            label="Subject Line"
                                            placeholder="Collaboration Inquiry"
                                            required
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            error={errors.subject}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-[#374151]">Payload (Message)</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Type your secure message here..."
                                            required
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full rounded-lg border border-[#D1D5DB] bg-white px-4 py-3 text-sm text-[#111827] focus:ring-2 focus:ring-[#C3161C] focus:border-transparent transition-all outline-none resize-none"
                                        />
                                        {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message}</p>}
                                    </div>
                                    <Button
                                        type="submit"
                                        loading={loading}
                                        className="w-full h-12 rounded-xl text-base shadow-xl shadow-red-100"
                                        rightIcon={<ArrowRight className="h-5 w-5" />}
                                    >
                                        {loading ? 'Transmitting...' : 'Initiate Transmission'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

function ContactInfoCard({ icon, title, value, href }: { icon: React.ReactNode; title: string; value: string; href: string }) {
    return (
        <div className="group p-6 rounded-2xl bg-gray-50 border border-transparent hover:border-[#58151C]/20 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="p-3 rounded-xl bg-white text-[#58151C] shadow-sm mb-4 w-fit group-hover:scale-110 group-hover:bg-[#C3161C] group-hover:text-white transition-all">
                {icon}
            </div>
            <h4 className="font-poppins font-bold text-[#111827] mb-2">{title}</h4>
            <a
                href={href}
                className="text-[#6B7280] text-sm font-medium hover:text-[#C3161C] transition-colors inline-block leading-relaxed"
            >
                {value}
            </a>
        </div>
    )
}
