// components/portal/admin/CTFTab.tsx — IIMS Collegiate Arena Operations
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
                <button className="bg-[#58151C] text-white px-8 py-4 rounded-[1.5rem] font-bold shadow-xl shadow-red-900/10 flex items-center gap-3 hover:translate-y-[-2px] transition-all hover:bg-[#C3161C]">
                    <Plus className="h-5 w-5" /> New Arena Challenge
                </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Challenge Intel</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Difficulty</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">XP Value</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Breaches</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {challenges.map(chal => (
                                <tr key={chal.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className={cn(
                                                "p-3 rounded-xl bg-gray-50 text-gray-400 shadow-inner group-hover:bg-white group-hover:text-[#58151C] transition-colors",
                                                !chal.is_active && "opacity-30"
                                            )}>
                                                {getIcon(chal.category)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className={cn("text-sm font-bold truncate", !chal.is_active ? "text-gray-300" : "text-[#111827]")}>{chal.title}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{chal.category} protocol</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            chal.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-gray-50 text-gray-400 border-gray-200"
                                        )}>
                                            {chal.is_active ? 'Active' : 'Offline'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            chal.difficulty === 'hard' || chal.difficulty === 'expert' ? "bg-red-50 text-[#C3161C] border-red-100" :
                                                chal.difficulty === 'medium' ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                    "bg-blue-50 text-blue-700 border-blue-100"
                                        )}>
                                            {chal.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-sm font-poppins font-black text-[#58151C]">{chal.points}</span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold">
                                            <BarChart3 className="h-4 w-4 opacity-30" />
                                            {chal.solved_count?.[0]?.count || 0}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(chal.id, chal.is_active)}
                                                disabled={!!isLoading}
                                                className={cn(
                                                    "p-3 rounded-xl transition-all shadow-sm border",
                                                    chal.is_active
                                                        ? "bg-gray-900 border-gray-800 text-white hover:bg-black"
                                                        : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                                                )}
                                                title={chal.is_active ? "Deactivate Challenge" : "Activate Challenge"}
                                            >
                                                {chal.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button className="p-3 bg-white border border-gray-100 text-[#58151C] hover:bg-[#58151C] hover:text-white rounded-xl transition-all shadow-sm">
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
