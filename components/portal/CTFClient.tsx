// components/portal/CTFClient.tsx — IIMS Collegiate CTF Interface
'use client'

import { useState } from 'react'
import { Search, Trophy, Medal, Target, Zap, ChevronRight } from 'lucide-react'
// Import types safely
type CTFChallenge = any
type Member = any
import CTFChallengeCard from './CTFChallengeCard'
import Avatar from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface CTFClientProps {
    challenges: (CTFChallenge & { solved: boolean })[]
    leaderboard: Pick<Member, 'id' | 'name' | 'points' | 'avatar_url'>[]
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

    const totalPoints = challenges.reduce((sum, c) => sum + (c.points || 0), 0)
    const solvedCount = challenges.filter(c => c.solved).length
    const progress = Math.round((userPoints / (totalPoints || 1)) * 100) || 0

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-fade-up">
            {/* Dashboard Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 bg-[#58151C] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-32 translate-x-32" />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-white/60 font-black text-[10px] uppercase tracking-[0.2em] border border-white/10">
                                <Target className="h-3.5 w-3.5" /> High Stakes Arena
                            </div>
                            <h1 className="text-4xl md:text-5xl font-poppins font-black leading-tight">
                                Arena <span className="text-[#FCD34D]">Dashboard</span>
                            </h1>
                            <p className="text-[#FECACA] font-medium text-base max-w-sm">
                                Execute operations, exploit vulnerabilities, and capture flags to advance your rank within the collegiate hierarchy.
                            </p>
                        </div>

                        <div className="flex gap-12 bg-black/20 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-inner">
                            <div className="text-center">
                                <span className="block text-[10px] font-black uppercase text-[#FECACA]/60 tracking-[0.2em] mb-2">My Score</span>
                                <span className="block text-4xl font-poppins font-black text-[#FCD34D]">{userPoints}</span>
                            </div>
                            <div className="w-px h-16 bg-white/10" />
                            <div className="text-center">
                                <span className="block text-[10px] font-black uppercase text-[#FECACA]/60 tracking-[0.2em] mb-2">Global Rank</span>
                                <span className="block text-4xl font-poppins font-black text-white">#{userRank}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-xl flex flex-col justify-between group">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-poppins font-black text-[#111827] flex items-center gap-2">
                                <Zap className="h-5 w-5 text-[#C3161C]" /> Mastery
                            </h3>
                            <span className="text-2xl font-poppins font-black text-[#58151C]">{progress}%</span>
                        </div>

                        <div className="relative h-4 bg-gray-50 rounded-full overflow-hidden p-1">
                            <div
                                className="h-full bg-gradient-to-r from-[#58151C] to-[#C3161C] rounded-full transition-all duration-1000 ease-out shadow-lg"
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                            {solvedCount} Missions Accomplished / {challenges.length} Total Targets
                        </p>
                    </div>

                    <button className="mt-8 flex items-center justify-between w-full p-5 bg-gray-50 rounded-2xl hover:bg-[#58151C]/5 group-hover:scale-[1.02] transition-all">
                        <span className="text-sm font-bold text-[#111827]">View My Badges</span>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>
                </div>
            </section>

            {/* Challenge Navigator */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Challenge Feed */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.15em] transition-all",
                                        activeCategory === cat
                                            ? "bg-[#58151C] text-white shadow-lg shadow-red-100"
                                            : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                    )}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative group min-w-[280px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#C3161C] transition-colors" />
                            <input
                                type="text"
                                placeholder="Query targets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#58151C]/5 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredChallenges.map(challenge => (
                            <CTFChallengeCard key={challenge.id} challenge={challenge} />
                        ))}

                        {filteredChallenges.length === 0 && (
                            <div className="col-span-full py-32 rounded-[3.5rem] border-2 border-dashed border-gray-100 bg-white text-center">
                                <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Target className="h-8 w-8 text-gray-200" />
                                </div>
                                <p className="text-gray-400 font-bold text-lg uppercase tracking-widest">No Targets Detected</p>
                                <p className="text-gray-300 mt-2 font-medium">Try adjusting your reconnaissance filters.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Honor Board */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl">
                        <h3 className="font-poppins font-black text-[#111827] flex items-center gap-2 mb-8 uppercase tracking-widest text-xs">
                            <Medal className="h-5 w-5 text-[#C3161C]" /> Top Operatives
                        </h3>

                        <div className="space-y-6">
                            {leaderboard.map((member, idx) => (
                                <div key={member.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-xl font-poppins font-black text-xs shadow-inner",
                                            idx === 0 ? "bg-[#FCD34D] text-[#58151C]" :
                                                idx === 1 ? "bg-gray-100 text-gray-400" :
                                                    idx === 2 ? "bg-amber-100 text-amber-700" :
                                                        "bg-gray-50 text-gray-300"
                                        )}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Avatar src={member.avatar_url} name={member.name} size="xs" />
                                            <span className="text-sm font-bold text-[#111827] group-hover:text-[#C3161C] transition-colors truncate max-w-[100px]">
                                                {member.name.split(' ')[0]}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-poppins font-black text-[#58151C]">{member.points}</span>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-t border-gray-50 hover:text-[#58151C] transition-colors">
                            Full Leaderboard <ChevronRight className="inline h-3 w-3 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
