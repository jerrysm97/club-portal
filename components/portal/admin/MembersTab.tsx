// components/portal/admin/MembersTab.tsx — IIMS Collegiate Operative Management
'use client'

import { useState } from 'react'
import { BadgeCheck, Ban, Trash2, MoreHorizontal, UserCheck, Shield, ShieldAlert, MoreVertical } from 'lucide-react'
import { updateMemberStatus, deleteMember } from '@/app/portal/(protected)/admin/actions'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'
// Import types safely
type Member = any
import { cn } from '@/lib/utils'

export default function MembersTab({ members, refresh }: { members: Member[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleStatus(id: string, status: string, role?: string) {
        setIsLoading(id)
        const res = await updateMemberStatus(id, status, role)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Operative updated to ${status}`)
            refresh()
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Abort Operative Protocol? This action cannot be reversed.')) return
        setIsLoading(id)
        const res = await deleteMember(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Operative records purged')
            refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Operative</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Clearance</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.map(member => (
                                <tr key={member.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={member.avatar_url} name={member.name} size="sm" className="shadow-lg shadow-black/5" />
                                            <div className="min-w-0">
                                                <div className="text-[#111827] text-sm font-bold truncate">{member.name}</div>
                                                <div className="text-gray-400 text-[10px] font-medium truncate">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            member.role === 'admin' || member.role === 'superadmin'
                                                ? "bg-red-50 text-[#C3161C] border-red-100 shadow-sm"
                                                : "bg-blue-50 text-blue-700 border-blue-100"
                                        )}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            member.status === 'approved' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                member.status === 'pending' ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                                                    "bg-gray-50 text-gray-400 border-gray-200"
                                        )}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {member.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatus(member.id, 'approved')}
                                                    disabled={!!isLoading}
                                                    className="p-3 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all shadow-sm border border-emerald-100"
                                                    title="Authorize Protocol"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                </button>
                                            )}
                                            {member.role === 'member' && (
                                                <button
                                                    onClick={() => handleStatus(member.id, member.status, 'admin')}
                                                    disabled={!!isLoading}
                                                    className="p-3 bg-red-50 hover:bg-[#C3161C] text-[#C3161C] hover:text-white rounded-xl transition-all shadow-sm border border-red-100"
                                                    title="Promote Clearance"
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                disabled={!!isLoading}
                                                className="p-3 bg-gray-50 hover:bg-gray-900 text-gray-400 hover:text-white rounded-xl transition-all shadow-sm border border-gray-100"
                                                title="Purge Record"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
