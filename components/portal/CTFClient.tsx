'use client'

import { useState } from 'react'
import { Search, Trophy, Medal } from 'lucide-react'
import type { CTFChallenge, Member } from '@/types/database'
import CTFChallengeCard from './CTFChallengeCard'

interface CTFClientProps {
    challenges: (CTFChallenge & { solved: boolean })[]
    leaderboard: Pick<Member, 'id' | 'full_name' | 'points' | 'avatar_url'>[]
    userPoints: number
    userRank: number
}

const CATEGORIES = ['all', 'web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']

export default function CTFClient({ challenges, leaderboard, userPoints, userRank }: CTFClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')

    const filteredChallenges = challenges.filter(c => {
        const matchesCategory = activeCategory === 'all' || c.category === activeCategory
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.description.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    // Calculate stats
    const totalPoints = challenges.reduce((sum, c) => sum + c.points, 0)
    const solvedCount = challenges.filter(c => c.solved).length
    const progress = Math.round((userPoints / totalPoints) * 100) || 0

    return (
        <div className="max-w-6xl mx-auto py-8 animate-fade-up">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Challenge Area */}
                <div className="flex-1">
                    <div className="mb-8">
                        <h1 className="text-3xl font-mono font-bold text-[#F8FAFC] mb-2">CTF_Arena</h1>
                        <p className="text-[#A1A1AA] font-mono text-sm">
                            Test your skills. Capture flags. Climb the ranks.
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#52525B]" />
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111113] border border-[#27272A] rounded-sm pl-9 pr-4 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-2 rounded-sm font-mono text-xs uppercase whitespace-nowrap transition-colors border ${activeCategory === cat
                                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                                            : 'bg-[#111113] text-[#A1A1AA] border-[#27272A] hover:text-[#F8FAFC]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredChallenges.map(challenge => (
                            <CTFChallengeCard key={challenge.id} challenge={challenge} />
                        ))}

                        {filteredChallenges.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-[#27272A] text-[#52525B] font-mono italic">
                                No challenges found.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar / Leaderboard */}
                <div className="w-full lg:w-80 space-y-6">
                    {/* User Stats */}
                    <div className="p-6 bg-[#09090B] border border-[#27272A] rounded-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Trophy className="h-24 w-24 text-[#EAB308]" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-sm font-mono text-[#A1A1AA] uppercase">Your_Stats</h3>

                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-3xl font-mono font-bold text-[#F8FAFC]">{userPoints}</div>
                                    <div className="text-[10px] font-mono text-[#52525B] uppercase">TOTAL SCORE</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-mono font-bold text-[#10B981]">#{userRank}</div>
                                    <div className="text-[10px] font-mono text-[#52525B] uppercase">CURRENT RANK</div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-[#A1A1AA]">
                                    <span>PROGRESS</span>
                                    <span>{solvedCount} / {challenges.length} SOLVED</span>
                                </div>
                                <div className="h-1 bg-[#27272A] rounded-full overflow-hidden">
                                    <div className="h-full bg-[#10B981]" style={{ width: `${progress}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top 5 Leaderboard */}
                    <div className="p-6 bg-[#09090B] border border-[#27272A] rounded-sm">
                        <h3 className="font-mono font-bold text-[#F8FAFC] flex items-center gap-2 mb-4 border-b border-[#27272A] pb-2">
                            <Medal className="h-4 w-4 text-[#EAB308]" /> TOP_OPERATIVES
                        </h3>

                        <div className="space-y-3">
                            {leaderboard.map((member, idx) => (
                                <div key={member.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                       w-6 h-6 flex items-center justify-center rounded-sm font-mono text-xs font-bold
                                       ${idx === 0 ? 'bg-[#EAB308]/20 text-[#EAB308]' :
                                                idx === 1 ? 'bg-[#94A3B8]/20 text-[#94A3B8]' :
                                                    idx === 2 ? 'bg-[#B45309]/20 text-[#B45309]' :
                                                        'bg-[#27272A] text-[#71717A]'}
                                   `}>
                                            {idx + 1}
                                        </div>
                                        <span className="text-sm font-mono text-[#A1A1AA] group-hover:text-[#F8FAFC] transition-colors truncate max-w-[120px]">
                                            {member.full_name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-mono font-bold text-[#10B981]">{member.points}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
