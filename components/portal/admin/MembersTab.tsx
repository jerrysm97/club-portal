'use client'

import { useState } from 'react'
import { BadgeCheck, Ban, Trash2, MoreHorizontal, UserCheck, Shield } from 'lucide-react'
import { updateMemberStatus, deleteMember } from '@/app/portal/admin/actions'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'
import type { Member } from '@/types/database'

export default function MembersTab({ members }: { members: Member[] }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleStatus(id: string, status: string, role?: string) {
        setIsLoading(id)
        const res = await updateMemberStatus(id, status, role)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else toast.success(`Member updated to ${status}`)
    }

    async function handleDelete(id: string) {
        if (!confirm('Are you sure? This action is irreversible.')) return
        setIsLoading(id)
        const res = await deleteMember(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else toast.success('Member removed')
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Member_Database</h2>
                    <p className="text-[#A1A1AA] font-mono text-sm">Manage operatives and permissions.</p>
                </div>
            </div>

            <div className="bg-[#111113] border border-[#27272A] rounded-sm overflow-hidden">
                <table className="w-full text-left font-mono">
                    <thead className="bg-[#09090B] border-b border-[#27272A] text-xs text-[#52525B] uppercase">
                        <tr>
                            <th className="px-4 py-3">Operative</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A]">
                        {members.map(member => (
                            <tr key={member.id} className="hover:bg-[#27272A]/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Avatar src={member.avatar_url} name={member.full_name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <div className="text-[#F8FAFC] text-sm font-bold">{member.full_name}</div>
                                            <div className="text-[#52525B] text-xs">{member.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase border ${member.role === 'admin'
                                            ? 'border-[#EF4444]/30 text-[#EF4444] bg-[#EF4444]/10'
                                            : 'border-[#27272A] text-[#A1A1AA]'
                                        }`}>
                                        {member.role}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-0.5 rounded-sm text-[10px] uppercase border ${member.status === 'approved' ? 'border-[#10B981]/30 text-[#10B981] bg-[#10B981]/10' :
                                            member.status === 'pending' ? 'border-[#EAB308]/30 text-[#EAB308] bg-[#EAB308]/10' :
                                                'border-[#F43F5E]/30 text-[#F43F5E] bg-[#F43F5E]/10'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        {member.status === 'pending' && (
                                            <button
                                                onClick={() => handleStatus(member.id, 'approved')}
                                                disabled={!!isLoading}
                                                className="p-1 hover:bg-[#10B981]/20 text-[#10B981] rounded-sm transition-colors"
                                            >
                                                <UserCheck className="h-4 w-4" />
                                            </button>
                                        )}
                                        {member.role !== 'admin' && (
                                            <button
                                                onClick={() => handleStatus(member.id, member.status, 'admin')}
                                                disabled={!!isLoading}
                                                className="p-1 hover:bg-[#EF4444]/20 text-[#EF4444] rounded-sm transition-colors"
                                                title="Promote to Admin"
                                            >
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            disabled={!!isLoading}
                                            className="p-1 hover:bg-[#F43F5E]/20 text-[#F43F5E] rounded-sm transition-colors"
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
    )
}
