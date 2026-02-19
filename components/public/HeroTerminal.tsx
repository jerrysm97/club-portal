// components/public/HeroTerminal.tsx — Client-side typewriter animation for Hero
'use client'
import { useState, useEffect } from 'react'

const LINES = [
    'Initializing ICEHC...',
    '> Ethical hacking. Real skills.',
    '> CTF competitions. Certifications.',
    "> Join Nepal's next cybersecurity generation.",
]

export default function HeroTerminal() {
    const [lineIndex, setLineIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [displayText, setDisplayText] = useState('')

    useEffect(() => {
        const currentLine = LINES[lineIndex]

        if (charIndex < currentLine.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + currentLine[charIndex])
                setCharIndex(prev => prev + 1)
            }, 60)
            return () => clearTimeout(timeout)
        }

        // Line fully typed — pause, then move to next
        const pause = setTimeout(() => {
            const nextLine = (lineIndex + 1) % LINES.length
            setLineIndex(nextLine)
            setCharIndex(0)
            setDisplayText('')
        }, 2000)
        return () => clearTimeout(pause)
    }, [lineIndex, charIndex])

    return (
        <div className="font-mono">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#F0F0FF] leading-tight min-h-[1.2em]">
                {displayText}
                <span className="text-[#00FF87] animate-blink">|</span>
            </h1>
        </div>
    )
}
