// components/portal/CTFChallengeCard.tsx — IIMS Collegiate Challenge Card
'use client'

import { useState } from 'react'
import { Flag, ShieldCheck, Trophy, CheckCircle, AlertTriangle, Loader2, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
// Import types safely
type CTFChallenge = any
import { submitFlag } from '@/app/portal/(protected)/ctf/actions'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'

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
            "relative p-8 rounded-[2rem] border transition-all animate-fade-up flex flex-col h-full group overflow-hidden",
            solved
                ? "bg-emerald-50/50 border-emerald-100"
                : "bg-white border-gray-100 hover:shadow-2xl hover:border-[#58151C]/10 shadow-sm"
        )}>
            {/* Solved Overlay Decoration */}
            {solved && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[4rem] flex items-center justify-center pointer-events-none">
                    <CheckCircle className="h-6 w-6 text-emerald-600 opacity-20" />
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                            challenge.difficulty === 'easy' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                challenge.difficulty === 'medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                    challenge.difficulty === 'hard' ? "bg-red-50 text-red-600 border-red-100" :
                                        "bg-purple-50 text-purple-600 border-purple-100"
                        )}>
                            {challenge.difficulty}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-gray-50 text-gray-400 border border-gray-100 text-[9px] font-black uppercase tracking-widest">
                            {challenge.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-poppins font-black text-[#111827] group-hover:text-[#C3161C] transition-colors leading-tight">{challenge.title}</h3>
                </div>

                <div className="text-right">
                    <div className="text-3xl font-poppins font-black text-[#58151C]">{challenge.points}</div>
                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest leading-none">PTS</div>
                </div>
            </div>

            {/* Content */}
            <p className="text-gray-500 font-medium text-sm mb-8 flex-1 leading-relaxed">
                {challenge.description}
            </p>

            {/* Input Overlay / Footer */}
            <div className="mt-auto">
                {!solved ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-[#C3161C] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Enter flag sequence..."
                                    value={flagInput}
                                    onChange={(e) => setFlagInput(e.target.value)}
                                    className="w-full bg-gray-50 border-transparent rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-[#58151C]/5 transition-all outline-none placeholder:text-gray-300"
                                    disabled={loading}
                                />
                            </div>
                            <Button
                                type="submit"
                                loading={loading}
                                disabled={!flagInput.trim()}
                                className="rounded-xl h-12 shadow-lg shadow-red-100 px-6"
                            >
                                Capture
                            </Button>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">
                            <ShieldCheck className="h-3.5 w-3.5" /> Security Protocol Active
                        </div>
                    </form>
                ) : (
                    <div className="bg-emerald-600 rounded-xl p-4 flex items-center justify-center gap-3 text-white shadow-lg shadow-emerald-100 border border-emerald-500 animate-fade-up">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Mission Accomplished</span>
                    </div>
                )}
            </div>
        </div>
    )
}
