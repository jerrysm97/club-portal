'use client'

import { Activity } from 'lucide-react'
import type { AuditLog } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function AuditTab({ logs }: { logs: AuditLog[] }) {
    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Audit_Logs</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Immutable record of administrative actions.</p>
            </div>

            <div className="border border-[#27272A] rounded-sm overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                    <thead className="bg-[#111113] border-b border-[#27272A] text-[#52525B]">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Admin</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Target</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272A] bg-[#09090B]">
                        {logs.map(log => (
                            <tr key={log.id} className="hover:bg-[#27272A]/20">
                                <td className="px-4 py-2 text-[#52525B]">{formatDate(log.created_at)}</td>
                                <td className="px-4 py-2 text-[#F8FAFC]">{log.admin?.full_name || 'System'}</td>
                                <td className="px-4 py-2 text-[#10B981]">{log.action}</td>
                                <td className="px-4 py-2 text-[#A1A1AA]">{log.target_id || '-'}</td>
                            </tr>
                        ))}
                        {logs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-[#52525B] italic">No logs recorded.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
