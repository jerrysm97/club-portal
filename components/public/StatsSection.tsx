// components/public/StatsSection.tsx
// Dynamic stats from site_settings — terminal output style.
// Scroll-triggered counting animation.

'use client'

import { useEffect, useRef, useState } from 'react'

interface StatsProps {
    statMembers: string
    statEvents: string
    statCompetitions: string
    statPartners: string
}

function AnimatedStat({ label, value }: { label: string; value: string }) {
    // Extract numeric part for counting animation
    const numericMatch = value.match(/(\d+)/)
    const target = numericMatch ? parseInt(numericMatch[1]) : 0
    const suffix = value.replace(/\d+/, '')

    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started || target === 0) return
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(current))
        }, duration / steps)
        return () => clearInterval(timer)
    }, [started, target])

    return (
        <div ref={ref} className="text-center">
            <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-1 uppercase">{'>'} {label}:</p>
            <p className="font-[var(--font-mono)] font-bold text-4xl text-[#F8FAFC]">
                {count}{suffix}
            </p>
        </div>
    )
}

export default function StatsSection({ statMembers, statEvents, statCompetitions, statPartners }: StatsProps) {
    const stats = [
        { label: 'MEMBERS', value: statMembers },
        { label: 'EVENTS', value: statEvents },
        { label: 'COMPETITIONS', value: statCompetitions },
        { label: 'PARTNERS', value: statPartners },
    ]

    return (
        <section className="py-20 px-4 bg-[#09090B] bg-grid">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#10B981] text-sm mb-8 text-center uppercase">{'>'} 05_STATS</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <AnimatedStat key={i} label={stat.label} value={stat.value} />
                    ))}
                </div>
            </div>
        </section>
    )
}
