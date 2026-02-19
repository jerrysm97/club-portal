// app/(public)/contact/page.tsx — ICEHC Contact Page: info card + dark form
'use client'
import { useState } from 'react'
import { Mail, Shield, MapPin, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react'

interface FormData {
    name: string
    email: string
    subject: string
    message: string
}

interface FieldErrors {
    name?: string[]
    email?: string[]
    subject?: string[]
    message?: string[]
}

export default function ContactPage() {
    const [form, setForm] = useState<FormData>({ name: '', email: '', subject: '', message: '' })
    const [errors, setErrors] = useState<FieldErrors>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    function validate(): boolean {
        const errs: FieldErrors = {}
        if (form.name.trim().length < 2) errs.name = ['Name must be at least 2 characters.']
        if (form.name.trim().length > 100) errs.name = ['Name must be under 100 characters.']
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = ['Enter a valid email address.']
        if (form.subject.trim().length < 5) errs.subject = ['Subject must be at least 5 characters.']
        if (form.subject.trim().length > 200) errs.subject = ['Subject must be under 200 characters.']
        if (form.message.trim().length < 10) errs.message = ['Message must be at least 10 characters.']
        if (form.message.trim().length > 3000) errs.message = ['Message must be under 3000 characters.']
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setServerError(null)
        if (!validate()) return

        setLoading(true)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    email: form.email.trim(),
                    subject: form.subject.trim(),
                    message: form.message.trim(),
                }),
            })

            if (res.status === 429) {
                setServerError('Too many requests. Please try again later.')
                return
            }

            const data = await res.json()
            if (!res.ok) {
                setServerError(data.error || 'Failed to send message.')
                return
            }

            setSuccess(true)
        } catch {
            setServerError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    function updateField(field: keyof FormData, value: string) {
        setForm(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const next = { ...prev }
                delete next[field]
                return next
            })
        }
    }

    return (
        <div className="bg-black min-h-screen pt-24">
            <div className="max-w-7xl mx-auto px-6 pb-20">
                <p className="font-mono text-[#00FF87] text-sm mb-2">// contact.sh</p>
                <h1 className="font-mono font-bold text-[#F0F0FF] text-3xl md:text-4xl mb-4">
                    Contact Us
                    <span className="block h-1 w-16 bg-[#00FF87] mt-3 rounded-full" />
                </h1>
                <p className="text-[#8888AA] text-sm font-sans mb-12">
                    Have a question or want to collaborate? Reach out to ICEHC.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* Left — Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-md bg-[#00FF87]/10 flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-[#00FF87]" />
                                </div>
                                <div>
                                    <p className="font-mono font-bold text-[#F0F0FF] text-sm">ICEHC</p>
                                    <p className="text-[#8888AA] text-xs font-sans">IIMS Cybersecurity & Ethical Hacking Club</p>
                                </div>
                            </div>

                            <div className="space-y-4 mt-6">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-4 w-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[#8888AA] font-mono text-xs uppercase tracking-widest mb-1">Email</p>
                                        <a href="mailto:cybersec@iimscollege.edu.np" className="text-[#F0F0FF] text-sm font-sans hover:text-[#00D4FF] transition-colors">
                                            cybersec@iimscollege.edu.np
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="h-4 w-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[#8888AA] font-mono text-xs uppercase tracking-widest mb-1">Location</p>
                                        <p className="text-[#F0F0FF] text-sm font-sans">IIMS College, Kathmandu, Nepal</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <ExternalLink className="h-4 w-4 text-[#00D4FF] mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-[#8888AA] font-mono text-xs uppercase tracking-widest mb-1">College</p>
                                        <a
                                            href="https://iimscollege.edu.np/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#00D4FF] text-sm font-sans hover:underline"
                                        >
                                            iimscollege.edu.np →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — Contact Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6 md:p-8">
                            {success ? (
                                <div className="text-center py-8">
                                    <div className="h-14 w-14 rounded-full bg-[#00FF87]/10 border border-[#00FF87]/30 flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="h-7 w-7 text-[#00FF87]" />
                                    </div>
                                    <p className="font-mono text-[#00FF87] text-sm mb-2">Transmission successful.</p>
                                    <p className="text-[#8888AA] text-sm font-sans">
                                        Your message has been sent to the ICEHC team. We will get back to you shortly.
                                    </p>
                                    <button
                                        onClick={() => { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                                        className="mt-6 text-[#8888AA] font-mono text-xs hover:text-[#F0F0FF] transition-colors"
                                    >
                                        ← Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {serverError && (
                                        <div className="p-3 rounded-md bg-[#FF3333]/10 border border-[#FF3333]/30 text-[#FF3333] text-sm font-mono">
                                            {serverError}
                                        </div>
                                    )}

                                    <FormField
                                        label="Name"
                                        id="name"
                                        type="text"
                                        value={form.name}
                                        onChange={v => updateField('name', v)}
                                        error={errors.name?.[0]}
                                        placeholder="Your name"
                                        required
                                    />
                                    <FormField
                                        label="Email"
                                        id="email"
                                        type="email"
                                        value={form.email}
                                        onChange={v => updateField('email', v)}
                                        error={errors.email?.[0]}
                                        placeholder="you@example.com"
                                        required
                                    />
                                    <FormField
                                        label="Subject"
                                        id="subject"
                                        type="text"
                                        value={form.subject}
                                        onChange={v => updateField('subject', v)}
                                        error={errors.subject?.[0]}
                                        placeholder="What is this about?"
                                        required
                                    />

                                    <div>
                                        <label htmlFor="message" className="block text-[#8888AA] font-mono text-xs font-bold uppercase tracking-widest mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            value={form.message}
                                            onChange={e => updateField('message', e.target.value)}
                                            placeholder="Your message..."
                                            required
                                            rows={5}
                                            className="bg-[#0A0A0F] border border-[#2D2D44] text-[#F0F0FF] rounded-md px-3 py-2 focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87]/20 placeholder:text-[#8888AA]/50 w-full font-mono text-sm transition-colors resize-none"
                                        />
                                        {errors.message?.[0] && (
                                            <p className="text-[#FF3333] text-xs font-mono mt-1">{errors.message[0]}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#00FF87] text-black font-mono font-bold px-5 py-2.5 rounded-md hover:bg-[#00e87a] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                PROCESSING...
                                            </>
                                        ) : (
                                            'Send Message'
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function FormField({
    label,
    id,
    type,
    value,
    onChange,
    error,
    placeholder,
    required,
}: {
    label: string
    id: string
    type: string
    value: string
    onChange: (v: string) => void
    error?: string
    placeholder: string
    required?: boolean
}) {
    return (
        <div>
            <label htmlFor={id} className="block text-[#8888AA] font-mono text-xs font-bold uppercase tracking-widest mb-2">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                className="bg-[#0A0A0F] border border-[#2D2D44] text-[#F0F0FF] rounded-md px-3 py-2 focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87]/20 placeholder:text-[#8888AA]/50 w-full font-mono text-sm transition-colors"
            />
            {error && (
                <p className="text-[#FF3333] text-xs font-mono mt-1">{error}</p>
            )}
        </div>
    )
}
