'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface EndorseSkillButtonProps {
    targetUserId: string
    skill: string
    endorsements: any[]
    currentUserId: string
    readOnly?: boolean
}

export default function EndorseSkillButton({ targetUserId, skill, endorsements, currentUserId, readOnly = false }: EndorseSkillButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const skillEndorsements = endorsements.filter(e => e.skill === skill)
    const count = skillEndorsements.length
    const hasEndorsed = skillEndorsements.some(e => e.endorsed_by === currentUserId)

    async function toggleEndorsement() {
        if (readOnly) return
        setIsLoading(true)

        try {
            const method = hasEndorsed ? 'DELETE' : 'POST'
            const res = await fetch(`/api/members/${targetUserId}/endorse`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skill })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to toggle endorsement')

            router.refresh()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={toggleEndorsement}
            disabled={isLoading || readOnly}
            className={cn(
                "group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                hasEndorsed
                    ? "bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB] shadow-sm hover:bg-[#BBDEFB]"
                    : "bg-[#F8F9FA] text-[#212121] border-[#E0E0E0] hover:bg-[#E8EAF6] hover:text-[#1A237E] hover:border-[#C5CAE9]",
                readOnly && "cursor-default opacity-90 hover:transform-none select-text",
                !readOnly && "hover:scale-105"
            )}
        >
            {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : hasEndorsed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
            ) : !readOnly ? (
                <Plus className="w-3.5 h-3.5 text-[#9E9E9E] group-hover:text-[#1A237E]" />
            ) : null}

            <span>{skill}</span>

            {count > 0 && (
                <span className={cn(
                    "ml-1.5 px-2 py-0.5 rounded-md text-[9px] border",
                    hasEndorsed
                        ? "bg-white text-[#1976D2] border-[#BBDEFB]/50"
                        : "bg-white text-[#757575] border-[#E0E0E0]"
                )}>
                    {count}
                </span>
            )}
        </button>
    )
}
