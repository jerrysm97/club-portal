'use client'

import { useState } from 'react'
import { Flag, Shield, Trophy, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CTFChallenge } from '@/types/database'
import { submitFlag } from '@/app/portal/ctf/actions'
import { toast } from 'sonner'

interface CTFChallengeCardProps {
    challenge: CTFChallenge & { solved: boolean }
}

export default function CTFChallengeCard({ challenge }: CTFChallengeCardProps) {
    const [flagInput, setFlagInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [solved, setSolved] = useState(challenge.solved)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!flagInput.trim()) return

        setLoading(true)
        const res = await submitFlag(challenge.id, flagInput)
        setLoading(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success(`Flag captured! +${res.points} points awarded.`)
            setSolved(true)
            setFlagInput('')
        }
    }

    return (
        <div className={cn(
            "relative p-6 rounded-sm border transition-all animate-fade-up flex flex-col h-full",
            solved
                ? "bg-[#09090B]/50 border-[#10B981]/30 shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]"
                : "bg-[#09090B] border-[#27272A] hover:border-[#10B981]/50"
        )}>
            {solved && (
                <div className="absolute top-4 right-4 text-[#10B981]">
                    <CheckCircle className="h-5 w-5" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4 pr-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-sm border",
                            challenge.difficulty === 'easy' ? "text-[#10B981] border-[#10B981]/20 bg-[#10B981]/10" :
                                challenge.difficulty === 'medium' ? "text-[#EAB308] border-[#EAB308]/20 bg-[#EAB308]/10" :
                                    challenge.difficulty === 'hard' ? "text-[#F43F5E] border-[#F43F5E]/20 bg-[#F43F5E]/10" :
                                        "text-[#8B5CF6] border-[#8B5CF6]/20 bg-[#8B5CF6]/10"
                        )}>
                            {challenge.difficulty}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#52525B] px-1.5 py-0.5 rounded-sm border border-[#27272A]">
                            {challenge.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-mono font-bold text-[#F8FAFC]">{challenge.title}</h3>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-2xl font-mono font-bold text-[#EAB308]">{challenge.points}</span>
                    <span className="text-[10px] font-mono text-[#52525B] uppercase">POINTS</span>
                </div>
            </div>

            {/* Content */}
            <p className="text-[#A1A1AA] font-mono text-xs mb-6 flex-1 line-clamp-4">
                {challenge.description}
            </p>

            <div className="text-[10px] font-mono text-[#52525B] mb-4 flex items-center gap-2">
                <Trophy className="h-3 w-3" /> {challenge.solves_count} solves
            </div>

            {/* Input */}
            {!solved ? (
                <form onSubmit={handleSubmit} className="mt-auto">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Flag className="absolute left-3 top-2.5 h-4 w-4 text-[#52525B]" />
                            <input
                                type="text"
                                placeholder="Enter flag..."
                                value={flagInput}
                                onChange={(e) => setFlagInput(e.target.value)}
                                className="w-full bg-[#111113] border border-[#27272A] rounded-sm pl-9 pr-3 py-2 text-[#F8FAFC] font-mono text-xs focus:border-[#10B981] outline-none transition-colors placeholder:text-[#3F3F46]"
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !flagInput.trim()}
                            className="px-3 py-2 bg-[#F8FAFC] text-black rounded-sm font-mono text-xs font-bold hover:bg-[#E2E8F0] disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SUBMIT'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mt-auto p-3 bg-[#10B981]/10 border border-[#10B981]/20 rounded-sm text-center">
                    <span className="text-[#10B981] font-mono text-xs font-bold flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4" /> CHALLENGE_PWNED
                    </span>
                </div>
            )}
        </div>
    )
}
