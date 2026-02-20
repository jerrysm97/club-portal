// components/portal/admin/MembersTab.tsx — IIMS IT Club Operative Management (v4.0)
'use client'

import { useState } from 'react'
import { BadgeCheck, Ban, Trash2, MoreHorizontal, UserCheck, Shield, ShieldAlert, MoreVertical } from 'lucide-react'
import { updateMemberStatus, deleteMember } from '@/app/portal/(protected)/admin/actions'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type Member = any

export default function MembersTab({ members, refresh }: { members: Member[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleStatus(id: string, status: string, role?: string) {
        setIsLoading(id)
        const res = await updateMemberStatus(id, status, role)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(`Member updated to ${status}`)
            refresh()
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Abort member profile? This action cannot be reversed.')) return
        setIsLoading(id)
        const res = await deleteMember(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Member record deleted')
            refresh()
        }
    }

    return (
        <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-[2rem] border border-[#E0E0E0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Member</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Role Clearance</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {members.map(member => (
                                <tr key={member.id} className="group hover:bg-[#F8F9FA] transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={member.avatar_url} name={member.full_name || member.email} size="sm" className="shadow-sm" />
                                            <div className="min-w-0">
                                                <div className="text-[#212121] text-sm font-bold truncate">{member.full_name || member.email}</div>
                                                <div className="text-[#9E9E9E] text-[10px] font-semibold truncate">{member.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                                            member.role === 'admin' || member.role === 'superadmin'
                                                ? "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2] shadow-sm"
                                                : "bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]"
                                        )}>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                                            member.status === 'approved' ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" :
                                                member.status === 'pending' ? "bg-[#FFF8E1] text-[#F57F17] border-[#FFECB3] animate-pulse" :
                                                    "bg-[#F5F5F5] text-[#757575] border-[#E0E0E0]"
                                        )}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            {member.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatus(member.id, 'approved')}
                                                    disabled={!!isLoading}
                                                    className="p-2.5 bg-[#E8F5E9] hover:bg-[#4CAF50] text-[#2E7D32] hover:text-white rounded-xl transition-all shadow-sm border border-[#C8E6C9]"
                                                    title="Authorize Protocol"
                                                >
                                                    <UserCheck className="h-4 w-4" />
                                                </button>
                                            )}
                                            {member.role === 'member' && (
                                                <button
                                                    onClick={() => handleStatus(member.id, member.status, 'admin')}
                                                    disabled={!!isLoading}
                                                    className="p-2.5 bg-[#FFEBEE] hover:bg-[#E53935] text-[#D32F2F] hover:text-white rounded-xl transition-all shadow-sm border border-[#FFCDD2]"
                                                    title="Promote Clearance"
                                                >
                                                    <ShieldAlert className="h-4 w-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                disabled={!!isLoading}
                                                className="p-2.5 bg-white hover:bg-[#212121] text-[#9E9E9E] hover:text-white rounded-xl transition-all shadow-sm border border-[#E0E0E0]"
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
