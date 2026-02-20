// components/portal/admin/ResourcesTab.tsx — IIMS IT Club Asset Management (v4.0)
'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, ExternalLink, ShieldCheck, FileType, Database, Plus, Search } from 'lucide-react'
import { deleteResource } from '@/app/portal/(protected)/admin/actions'
import { formatFileSize } from '@/lib/utils'
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
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#F8F9FA] p-6 md:p-8 rounded-[2rem] border border-[#E0E0E0] gap-6 shadow-sm">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                    <input
                        type="text"
                        placeholder="Search document archives..."
                        className="w-full pl-14 pr-6 py-3.5 bg-white border border-[#E0E0E0] rounded-xl text-sm font-semibold text-[#212121] focus:ring-4 focus:ring-[#1A237E]/10 focus:border-[#1A237E]/30 transition-all outline-none shadow-sm"
                    />
                </div>
                <button className="w-full md:w-auto bg-[#1A237E] text-white px-8 py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest shadow-md shadow-[#1A237E]/20 flex items-center justify-center gap-3 hover:bg-[#283593] transition-all shrink-0">
                    <Plus className="h-5 w-5" /> Ingest Document
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-[#E0E0E0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Asset Name</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Technical Data</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Encryption</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {resources.map(res => (
                                <tr key={res.id} className="group hover:bg-[#F8F9FA] transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3.5 rounded-xl bg-[#F8F9FA] text-[#9E9E9E] border border-[#E0E0E0] group-hover:bg-[#E8EAF6] group-hover:border-[#C5CAE9] group-hover:text-[#1A237E] transition-colors shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold truncate text-[#212121] group-hover:text-[#1A237E] transition-colors">{res.title}</div>
                                                <div className="text-[10px] font-bold text-[#9E9E9E] uppercase tracking-widest truncate mt-1">Uploaded by {res.uploader?.name || res.uploader?.full_name || 'System'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="text-[10px] font-bold text-[#757575] uppercase tracking-widest flex items-center gap-2">
                                                <Database className="h-3.5 w-3.5 opacity-70" /> {formatFileSize(res.file_size || 0)}
                                            </span>
                                            <span className="text-[10px] font-bold text-[#BDBDBD] uppercase tracking-widest flex items-center gap-2">
                                                <FileType className="h-3.5 w-3.5 opacity-70" /> {res.file_type || 'Unknown Format'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={cn(
                                            "px-3.5 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            res.is_public ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" : "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]"
                                        )}>
                                            {res.is_public ? 'Public Access' : 'Classified'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            <a
                                                href={res.file_url}
                                                target="_blank"
                                                className="p-2.5 bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#1A237E] hover:border-[#1A237E] hover:text-white rounded-xl transition-all shadow-sm"
                                                title="Extract Asset"
                                            >
                                                <Download className="h-4 w-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                disabled={!!isLoading}
                                                className="p-2.5 bg-white border border-[#E0E0E0] text-[#D32F2F] hover:bg-[#FFEBEE] hover:border-[#FFCDD2] rounded-xl transition-all shadow-sm"
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
