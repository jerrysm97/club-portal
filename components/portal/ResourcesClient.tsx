'use client'

import { useState } from 'react'
import { FileText, Download, ExternalLink, Filter, Search, Plus, Terminal } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Document } from '@/types/database'
import Link from 'next/link'
import { uploadDocument } from '@/app/portal/resources/actions'
import { toast } from 'sonner'

interface ResourcesClientProps {
    initialDocs: Document[]
    userRole: string
}

const CATEGORIES = [
    { id: 'all', label: 'All_Files' },
    { id: 'study-material', label: 'Study_Material' },
    { id: 'writeup', label: 'CTF_Writeups' },
    { id: 'presentation', label: 'Presentations' },
    { id: 'report', label: 'Reports' },
    { id: 'general', label: 'General' },
]

export default function ResourcesClient({ initialDocs, userRole }: ResourcesClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isUploadOpen, setIsUploadOpen] = useState(false)

    const filteredDocs = initialDocs.filter(doc => {
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    async function handleUpload(formData: FormData) {
        const res = await uploadDocument(null, formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Resource archived successfully')
            setIsUploadOpen(false)
        }
    }

    return (
        <div className="animate-fade-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-mono font-bold text-[#F8FAFC]">Mission_Archives</h1>
                    <p className="text-[#A1A1AA] font-mono text-sm">Classified resources and training material.</p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-4 py-2 bg-[#10B981] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#059669] transition-colors flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> UPLOAD_INTEL
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#52525B]" />
                    <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#111113] border border-[#27272A] rounded-sm pl-10 pr-4 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-3 py-2 rounded-sm font-mono text-xs whitespace-nowrap transition-colors border ${activeCategory === cat.id
                                ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'
                                : 'bg-[#111113] text-[#A1A1AA] border-[#27272A] hover:text-[#F8FAFC]'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="group p-5 bg-[#09090B] border border-[#27272A] rounded-sm hover:border-[#10B981]/50 transition-colors flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-2 bg-[#27272A]/50 rounded-sm">
                                <FileText className="h-5 w-5 text-[#A1A1AA] group-hover:text-[#10B981] transition-colors" />
                            </div>
                            <span className="text-[10px] font-mono uppercase text-[#52525B] border border-[#27272A] px-1.5 py-0.5 rounded-sm">
                                {doc.category}
                            </span>
                        </div>

                        <h3 className="text-[#F8FAFC] font-mono font-bold mb-2 truncate" title={doc.title}>{doc.title}</h3>
                        <p className="text-[#A1A1AA] font-mono text-xs line-clamp-2 mb-4 flex-1">
                            {doc.description || 'No briefing available.'}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-[#27272A]/50 mt-auto">
                            <span className="text-[10px] text-[#52525B] font-mono">{formatDate(doc.created_at)}</span>
                            <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-[#10B981] hover:underline font-mono text-xs font-bold"
                            >
                                ACCESS <ExternalLink className="h-3 w-3" />
                            </a>
                        </div>
                    </div>
                ))}

                {filteredDocs.length === 0 && (
                    <div className="col-span-full py-12 text-center border border-dashed border-[#27272A] text-[#52525B] font-mono italic">
                        No intel found in archives matching parameters.
                    </div>
                )}
            </div>

            {/* Upload Modal (Simple Overlay) */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-[#09090B] border border-[#27272A] p-6 rounded-sm animate-fade-up">
                        <h3 className="text-xl font-mono font-bold text-[#F8FAFC] mb-6 flex items-center gap-2">
                            <Terminal className="h-5 w-5 text-[#10B981]" /> UPLOAD_PROTOCOL
                        </h3>

                        <form action={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-[#52525B] uppercase mb-1">Resource_Title</label>
                                <input name="title" required className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-3 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-[#52525B] uppercase mb-1">Briefing (Description)</label>
                                <textarea name="description" rows={3} className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-3 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-[#52525B] uppercase mb-1">Source_URL</label>
                                <input name="url" type="url" required placeholder="https://" className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-3 py-2 text-[#F8FAFC] font-mono text-sm focus:border-[#10B981] outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-[#52525B] uppercase mb-1">Classification</label>
                                    <select name="category" className="w-full bg-[#111113] border border-[#27272A] rounded-sm px-3 py-2 text-[#A1A1AA] font-mono text-sm focus:border-[#10B981] outline-none">
                                        {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                            <option key={c.id} value={c.id}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsUploadOpen(false)} className="flex-1 px-4 py-2 border border-[#27272A] text-[#A1A1AA] hover:text-[#F8FAFC] font-mono text-sm">ABORT</button>
                                <button type="submit" className="flex-1 px-4 py-2 bg-[#F8FAFC] text-black hover:bg-[#E2E8F0] font-mono text-sm font-bold">INITIATE_UPLOAD</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
