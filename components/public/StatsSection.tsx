// components/public/StatsSection.tsx
// Scroll-triggered counting animation using IntersectionObserver.

'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
    { target: 50, suffix: '+', label: 'Active Members' },
    { target: 15, suffix: '+', label: 'Events Conducted' },
    { target: 5, suffix: '+', label: 'Competitions Won' },
    { target: 3, suffix: '+', label: 'Partner Organizations' },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0)
    const [started, setStarted] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        const duration = 2000
        const steps = 60
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) {
                setCount(target)
                clearInterval(timer)
            } else {
                setCount(Math.floor(current))
            }
        }, duration / steps)
        return () => clearInterval(timer)
    }, [started, target])

    return (
        <div ref={ref} className="text-center">
            <p className="font-[var(--font-orbitron)] font-black text-5xl text-[#00FF9C] mb-2">
                {count}{suffix}
            </p>
        </div>
    )
}

export default function StatsSection() {
    return (
        <section className="py-20 px-4 bg-[#0A1F44] bg-grid">
            <div className="max-w-7xl mx-auto">
                <p className="font-[var(--font-mono)] text-[#00FF9C] text-sm mb-3 text-center">// 05 — By the Numbers</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center">
                            <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                            <p className="font-[var(--font-exo2)] text-[#8892A4] text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
