// components/portal/admin/ResourcesTab.tsx — IIMS Collegiate Asset Management
'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, ExternalLink, ShieldCheck, FileType, Database, Plus, Search } from 'lucide-react'
import { deleteResource } from '@/app/portal/(protected)/admin/actions'
import { formatDate, formatFileSize } from '@/lib/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ResourcesTab({ resources, refresh }: { resources: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (!confirm('Purge Intel Asset? Action is permanent.')) return
        setIsLoading(id)
        const res = await deleteResource(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Asset purged from mission database')
            refresh()
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex justify-between items-center bg-gray-50 p-6 rounded-[2.5rem] border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search asset database..."
                        className="w-full pl-12 pr-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-[#58151C] focus:border-transparent transition-all outline-none"
                    />
                </div>
                <button className="bg-[#58151C] text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-red-900/10 flex items-center gap-3 hover:bg-[#C3161C] transition-all">
                    <Plus className="h-5 w-5" /> Ingest Intel
                </button>
            </div>

            <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Intel</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Data</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Encryption</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {resources.map(res => (
                                <tr key={res.id} className="group hover:bg-gray-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-xl bg-gray-50 text-gray-400 shadow-inner group-hover:bg-white group-hover:text-indigo-600 transition-colors">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold truncate text-[#111827]">{res.title}</div>
                                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">Relayed by {res.uploader?.full_name || 'System'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                                <Database className="h-3 w-3" /> {formatFileSize(res.file_size || 0)}
                                            </span>
                                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                                <FileType className="h-3 w-3" /> {res.file_type || 'Unknown Format'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={cn(
                                            "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                            res.is_public ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-[#C3161C] border-red-100 shadow-inner"
                                        )}>
                                            {res.is_public ? 'Public Access' : 'Classified'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <a
                                                href={res.file_url}
                                                target="_blank"
                                                className="p-3 bg-white border border-gray-100 text-gray-400 hover:bg-[#58151C] hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Extract Asset"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                disabled={!!isLoading}
                                                className="p-3 bg-white border border-gray-100 text-[#C3161C] hover:bg-[#C3161C] hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Purge Intel"
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
