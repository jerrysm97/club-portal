'use client'

import { ShieldAlert, Terminal, Clock, User } from 'lucide-react'
import { formatDate } from '@/lib/utils'

type AuditLog = any

export default function AuditTab({ logs }: { logs: AuditLog[] }) {
    return (
        <div className="space-y-8 animate-fade-up">
            <div className="bg-white rounded-[2rem] border border-[#E0E0E0] shadow-sm overflow-hidden">
                <div className="p-8 border-b border-[#EEEEEE] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-[#212121]">System Audit Logs</h2>
                        <p className="text-[#757575] text-sm mt-1">Immutable record of high-level administrative actions.</p>
                    </div>
                    <div className="h-12 w-12 bg-[#FFEBEE] rounded-sm flex items-center justify-center border border-[#FFCDD2]">
                        <ShieldAlert className="h-6 w-6 text-[#D32F2F]" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Actor ID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Action Event</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Target ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="group hover:bg-[#F8F9FA] transition-all">
                                        <td className="px-8 py-5 text-sm text-[#757575] flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-[#9E9E9E]" />
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-8 py-5 text-sm font-medium text-[#212121]">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-[#111111]" />
                                                {log.actor_id || log.admin_id || 'System'}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border bg-[#E3F2FD] text-[#1976D2] border-[#BBDEFB]">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-sm text-[#757575]">
                                            <div className="flex items-center gap-2 font-mono text-xs">
                                                <Terminal className="w-3.5 h-3.5 text-[#9E9E9E]" />
                                                {log.target_id || 'N/A'}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-12 text-center text-[#9E9E9E] font-medium text-sm">
                                        No audit logs recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
