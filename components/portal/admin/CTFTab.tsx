// components/portal/admin/CTFTab.tsx — IIMS IT Club Arena Operations (v4.0)
'use client'

import { useState } from 'react'
import { Trophy, Target, Shield, Globe, Cpu, Key, Plus, Edit2, Trash2, Eye, EyeOff, BarChart3 } from 'lucide-react'
import { updateChallengeStatus } from '@/app/portal/(protected)/admin/actions'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export default function CTFTab({ challenges, refresh }: { challenges: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleToggleStatus(id: string, currentStatus: boolean) {
        setIsLoading(id)
        const res = await updateChallengeStatus(id, !currentStatus)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Challenge ${!currentStatus ? 'activated' : 'deactivated'}`)
            refresh()
        }
    }

    const getIcon = (category: string) => {
        switch (category) {
            case 'web': return <Globe className="h-5 w-5" />
            case 'pwn': return <Shield className="h-5 w-5" />
            case 'reverse': return <Cpu className="h-5 w-5" />
            case 'crypto': return <Key className="h-5 w-5" />
            default: return <Target className="h-5 w-5" />
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex justify-end">
                <button className="bg-[#1A237E] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-md shadow-[#1A237E]/20 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-[#283593]">
                    <Plus className="h-5 w-5" /> New Arena Challenge
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-[#E0E0E0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Challenge Intel</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Type</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Difficulty</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-center">XP Value</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-center">Solves</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {challenges.map(chal => (
                                <tr key={chal.id} className="group hover:bg-[#F8F9FA] transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3.5 rounded-xl border group-hover:shadow-sm transition-all",
                                                chal.is_active
                                                    ? "bg-[#1A237E] text-white border-[#1A237E]"
                                                    : "bg-[#F5F5F5] text-[#BDBDBD] border-[#E0E0E0]"
                                            )}>
                                                {getIcon(chal.category)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={cn("text-sm font-bold truncate", !chal.is_active ? "text-[#9E9E9E]" : "text-[#212121]")}>{chal.title}</div>
                                                <div className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest truncate mt-0.5">{chal.category} Category</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            chal.is_active ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" : "bg-[#F5F5F5] text-[#9E9E9E] border-[#E0E0E0]"
                                        )}>
                                            {chal.is_active ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            chal.difficulty === 'hard' || chal.difficulty === 'expert' ? "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]" :
                                                chal.difficulty === 'medium' ? "bg-[#FFF8E1] text-[#F57F17] border-[#FFECB3]" :
                                                    "bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]"
                                        )}>
                                            {chal.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={cn(
                                            "text-sm font-bold tracking-wide",
                                            chal.is_active ? "text-[#1A237E]" : "text-[#BDBDBD]"
                                        )}>{chal.points}</span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="flex items-center justify-center gap-2 text-[#9E9E9E] text-xs font-bold">
                                            <BarChart3 className={cn("h-4 w-4", chal.is_active ? "opacity-70 text-[#1A237E]" : "opacity-30")} />
                                            {chal.solved_count?.[0]?.count || 0}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <button
                                                onClick={() => handleToggleStatus(chal.id, chal.is_active)}
                                                disabled={!!isLoading}
                                                className={cn(
                                                    "p-2.5 rounded-xl transition-all shadow-sm border",
                                                    chal.is_active
                                                        ? "bg-[#212121] border-[#424242] text-white hover:bg-black"
                                                        : "bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32] hover:bg-[#4CAF50] hover:text-white"
                                                )}
                                                title={chal.is_active ? "Deactivate Challenge" : "Activate Challenge"}
                                            >
                                                {chal.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button className="p-2.5 bg-white border border-[#E0E0E0] text-[#1A237E] hover:bg-[#E8EAF6] hover:border-[#C5CAE9] rounded-xl transition-all shadow-sm">
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
