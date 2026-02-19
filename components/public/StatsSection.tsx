// components/public/StatsSection.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import type { SiteSettings } from '@/types/database'

interface Props { settings: SiteSettings | null }

function AnimatedNumber({ target, suffix = '+' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0
                    const duration = 2000
                    const step = (ts: number) => {
                        start = start || ts
                        const progress = Math.min((ts - start) / duration, 1)
                        const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
                        setCount(Math.floor(eased * target))
                        if (progress < 1) requestAnimationFrame(step)
                    }
                    requestAnimationFrame(step)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target])

    return <div ref={ref} className="text-5xl md:text-6xl font-extrabold text-white tabular-nums">{count}{suffix}</div>
}

export default function StatsSection({ settings }: Props) {
    const stats = [
        { label: 'Members', value: parseInt(settings?.stat_members || '0') || 0, icon: '👥' },
        { label: 'Events', value: parseInt(settings?.stat_events || '0') || 0, icon: '🎯' },
        { label: 'Competitions', value: parseInt(settings?.stat_competitions || '0') || 0, icon: '🏆' },
        { label: 'Partners', value: parseInt(settings?.stat_partners || '0') || 0, icon: '🤝' },
    ]

    return (
        <section className="relative py-28 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6366F1]/10 rounded-full blur-[150px]" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="inline-block text-xs font-bold text-[#818CF8] uppercase tracking-[0.2em] mb-3">Our Impact</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white">By the Numbers</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center p-6 rounded-2xl bg-white/[0.05] backdrop-blur-sm border border-white/[0.08] hover:bg-white/[0.08] transition-colors">
                            <div className="text-2xl mb-3">{s.icon}</div>
                            <AnimatedNumber target={s.value} />
                            <p className="mt-3 text-sm text-[#C7D2FE]/60 uppercase tracking-wider font-medium">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
