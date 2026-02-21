// components/portal/admin/ResourcesTab.tsx — IIMS IT Club Asset Management (v4.0)
'use client'

import { useState } from 'react'
import { FileText, Download, Trash2, ExternalLink, ShieldCheck, FileType, Database, Plus, Search, Loader2 } from 'lucide-react'
import { deleteResource } from '@/app/portal/(protected)/admin/actions'
import { restoreDocument } from '@/app/portal/(protected)/resources/actions'
import { formatFileSize, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ResourcesTab({ resources, refresh }: { resources: any[], refresh: () => void }) {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const [view, setView] = useState<'active' | 'trash'>('active')

    const activeDocs = resources.filter(r => !r.deleted_at)
    const trashedDocs = resources.filter(r => r.deleted_at)
    const displayDocs = view === 'active' ? activeDocs : trashedDocs

    async function handleRestore(id: string) {
        setIsLoading(id)
        const res = await restoreDocument(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Asset restored to active duty')
            refresh()
        }
    }

    async function handleDelete(id: string) {
        const confirmMsg = view === 'trash'
            ? 'PERMANENTLY PURGE this asset? This cannot be reversed.'
            : 'Move asset to Redaction Queue (Soft Delete)?'

        if (!confirm(confirmMsg)) return
        setIsLoading(id)
        const res = await deleteResource(id)
        setIsLoading(null)
        if (res?.error) toast.error(res.error)
        else {
            toast.success(view === 'trash' ? 'Asset permanently purged' : 'Asset moved to trash')
            refresh()
        }
    }

    return (
        <div className="space-y-10 animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-center bg-[#F8F9FA] p-6 md:p-8 rounded-[2rem] border border-[#E0E0E0] gap-6 shadow-sm">
                <div className="flex items-center gap-2 p-1 bg-white border border-[#E0E0E0] rounded-sm shadow-sm">
                    <button
                        onClick={() => setView('active')}
                        className={cn(
                            "px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all",
                            view === 'active' ? "bg-[#111111] text-white" : "text-[#757575] hover:text-[#111111] hover:bg-[#F5F5F5]"
                        )}
                    >
                        Active Intel ({activeDocs.length})
                    </button>
                    <button
                        onClick={() => setView('trash')}
                        className={cn(
                            "px-6 py-2 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all",
                            view === 'trash' ? "bg-[#E53935] text-white" : "text-[#757575] hover:text-[#E53935] hover:bg-[#FFEBEE]"
                        )}
                    >
                        Recycle Bin ({trashedDocs.length})
                    </button>
                </div>

                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#BDBDBD]" />
                    <input
                        type="text"
                        placeholder="Filter archives..."
                        className="w-full pl-14 pr-6 py-3.5 bg-white border border-[#E0E0E0] rounded-sm text-sm font-semibold text-[#212121] focus:ring-4 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all outline-none shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-[#E0E0E0] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#F8F9FA] border-b border-[#E0E0E0]">
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">{view === 'trash' ? 'Redacted Date' : 'Asset Name'}</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Metadata</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest">Visibility</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-[#757575] uppercase tracking-widest text-right">Ops</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EEEEEE]">
                            {displayDocs.map(res => (
                                <tr key={res.id} className="group hover:bg-[#F8F9FA] transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3.5 rounded-sm bg-[#F8F9FA] text-[#9E9E9E] border border-[#E0E0E0] group-hover:bg-[#FAFAFA] group-hover:border-[#E5E5E5] group-hover:text-[#111111] transition-colors shadow-sm">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="text-sm font-bold truncate text-[#212121] group-hover:text-[#111111] transition-colors">{res.title}</div>
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
                                            "px-3.5 py-1.5 rounded-sm text-[9px] font-bold uppercase tracking-widest border shadow-sm",
                                            res.is_public ? "bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]" : "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]"
                                        )}>
                                            {res.is_public ? 'Public Access' : 'Classified'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2.5">
                                            {view === 'trash' ? (
                                                <button
                                                    onClick={() => handleRestore(res.id)}
                                                    disabled={!!isLoading}
                                                    className="px-4 py-2 bg-[#E3F2FD] border border-[#BBDEFB] text-[#0D47A1] rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-[#0D47A1] hover:text-white transition-all shadow-sm flex items-center gap-2"
                                                >
                                                    {isLoading === res.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                                    Restore
                                                </button>
                                            ) : (
                                                <a
                                                    href={res.file_url}
                                                    target="_blank"
                                                    className="p-2.5 bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#111111] hover:border-[#111111] hover:text-white rounded-sm transition-all shadow-sm"
                                                    title="Extract Asset"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => handleDelete(res.id)}
                                                disabled={!!isLoading}
                                                className="p-2.5 bg-white border border-[#E0E0E0] text-[#D32F2F] hover:bg-[#FFEBEE] hover:border-[#FFCDD2] rounded-sm transition-all shadow-sm"
                                                title={view === 'trash' ? "Permanent Purge" : "Redact Asset"}
                                            >
                                                {isLoading === res.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
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
