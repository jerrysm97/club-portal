// components/public/StatsSection.tsx — Premium minimal
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
                    const duration = 1500
                    const step = (ts: number) => {
                        start = start || ts
                        const progress = Math.min((ts - start) / duration, 1)
                        setCount(Math.floor(progress * target))
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

    return <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#111827]">{count}{suffix}</div>
}

export default function StatsSection({ settings }: Props) {
    const stats = [
        { label: 'Members', value: settings?.stat_members || 0 },
        { label: 'Events', value: settings?.stat_events || 0 },
        { label: 'Competitions', value: settings?.stat_competitions || 0 },
        { label: 'Partners', value: settings?.stat_partners || 0 },
    ]

    return (
        <section className="py-24 bg-gradient-to-br from-[#111827] to-[#1E1B4B] text-white">
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm font-semibold text-[#818CF8] uppercase tracking-wider mb-2">Our Impact</p>
                <h2 className="text-3xl md:text-4xl font-bold mb-14">By the Numbers</h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-white">
                                <AnimatedNumber target={s.value} />
                            </div>
                            <p className="mt-2 text-sm text-[#C7D2FE]/70 uppercase tracking-wider">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
