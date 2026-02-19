'use client'

import { Trash2, FileText, Download } from 'lucide-react'
import { deleteResource } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { Document } from '@/types/database'
import { formatDate } from '@/lib/utils'

export default function ResourcesTab({ resources }: { resources: Document[] }) {

    async function handleDelete(id: string) {
        if (!confirm('Delete this resource?')) return
        const res = await deleteResource(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Resource deleted')
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Archives_Control</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Manage educational resources and documents.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resources.map(doc => (
                    <div key={doc.id} className="p-4 bg-[#111113] border border-[#27272A] rounded-sm flex justify-between items-start group hover:border-[#3F3F46] transition-colors">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[#27272A] rounded-sm text-[#A1A1AA]">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-[#F8FAFC] font-mono font-bold text-sm line-clamp-1">{doc.title}</h3>
                                <div className="flex items-center gap-2 mt-1 mb-2">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-sm border border-[#27272A] text-[#A1A1AA] uppercase font-mono">
                                        {doc.category}
                                    </span>
                                    <span className="text-[10px] text-[#52525B] font-mono">{formatDate(doc.created_at)}</span>
                                </div>
                                <div className="text-[10px] text-[#52525B] font-mono flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Download className="h-3 w-3" /> {doc.download_count}
                                    </span>
                                    <span>By: {doc.uploader?.full_name}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(doc.id)}
                            className="p-2 text-[#A1A1AA] hover:text-[#F43F5E] opacity-0 group-hover:opacity-100 transition-all"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
