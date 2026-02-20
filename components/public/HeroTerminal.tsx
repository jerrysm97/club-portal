// components/public/HeroTerminal.tsx — Client-side typewriter animation for Hero
'use client'
import { useState, useEffect } from 'react'

const LINES = [
    '$ whoami  -> ICEHC Member — IIMS College',
    '$ cat vision.txt  -> premier hub for cybersecurity excellence',
    '$ ls objectives/  -> 01_skill_dev 02_ethics 03_career 04_research',
    '$ ./apply.sh  -> Status: ACCEPTING MEMBERS ✓',
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
        <div className="font-mono min-h-[120px]">
            <p className="text-sm md:text-base text-[#E6EDF3] leading-relaxed min-h-[1.2em]">
                {displayText}
                <span className="text-[#00FF41] animate-pulse">▌</span>
            </p>
        </div>
    )
}
