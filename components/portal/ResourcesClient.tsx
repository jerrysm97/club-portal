// components/portal/ResourcesClient.tsx — IIMS Collegiate Resource Arena
'use client'

import { useState } from 'react'
import { FileText, Download, ExternalLink, Filter, Search, Plus, Terminal, Trash2, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Document } from '@/types/database'
import { uploadDocument, deleteDocument } from '@/app/portal/resources/actions'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

interface ResourcesClientProps {
    initialDocs: Document[]
    userRole: string
}

const CATEGORIES = [
    { id: 'all', label: 'All Intel' },
    { id: 'study-material', label: 'Study Assets' },
    { id: 'writeup', label: 'Writeups' },
    { id: 'presentation', label: 'Briefings' },
    { id: 'report', label: 'Field Reports' },
    { id: 'general', label: 'General' },
]

export default function ResourcesClient({ initialDocs, userRole }: ResourcesClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)

    const isHighPerms = ['bod', 'admin', 'superadmin'].includes(userRole)

    const filteredDocs = initialDocs.filter(doc => {
        const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (doc.description || '').toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    async function handleUpload(formData: FormData) {
        const res = await uploadDocument(null, formData)
        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Information archived in central frequency')
            setIsUploadOpen(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Execute redaction protocol? This action is permanent.')) return
        setLoading(id)
        const res = await deleteDocument(id)
        setLoading(null)
        if (res?.error) toast.error(res.error)
        else toast.success('Intel purged from archives')
    }

    return (
        <div className="space-y-12 animate-fade-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#58151C]/5 text-[#58151C] font-black text-[10px] uppercase tracking-widest mb-4 border border-[#58151C]/10">
                        <Terminal className="h-3.5 w-3.5" /> Archive Node
                    </div>
                    <h1 className="text-4xl md:text-5xl font-poppins font-black text-[#111827] leading-tight">
                        Central <span className="text-[#C3161C]">Intel</span>
                    </h1>
                    <p className="text-gray-400 font-medium text-base mt-2 max-w-xl">
                        Access classified mission assets, training modules, and operative writeups for IIMS operations.
                    </p>
                </div>

                {isHighPerms && (
                    <Button
                        onClick={() => setIsUploadOpen(true)}
                        className="rounded-[1.25rem] h-14 px-8 font-black uppercase text-xs tracking-widest shadow-xl shadow-red-100"
                        leftIcon={<Plus className="h-5 w-5" />}
                    >
                        Archive Intel
                    </Button>
                )}
            </div>

            {/* Control Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all",
                                    activeCategory === cat.id
                                        ? "bg-[#58151C] text-white shadow-lg"
                                        : "bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 shadow-sm"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Query archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-4 focus:ring-[#58151C]/5 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl hover:border-[#58151C]/10 transition-all animate-fade-up">
                        <div className="flex items-start justify-between mb-8">
                            <div className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-[#58151C] group-hover:text-white transition-all shadow-inner">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-300">
                                    {doc.category}
                                </span>
                                {isHighPerms && (
                                    <button
                                        onClick={() => handleDelete(doc.id)}
                                        disabled={loading === doc.id}
                                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        {loading === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-poppins font-black text-[#111827] mb-3 group-hover:text-[#C3161C] transition-colors leading-tight truncate px-1">
                            {doc.title}
                        </h3>
                        <p className="text-gray-500 font-medium text-xs leading-relaxed line-clamp-2 mb-8 flex-1 px-1">
                            {doc.description || 'No briefing attached to this intel asset.'}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 mt-auto">
                            <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">{formatDate(doc.created_at)}</span>
                            <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-[#58151C] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#58151C] hover:text-white transition-all group/link"
                            >
                                Access <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                ))}

                {filteredDocs.length === 0 && (
                    <div className="col-span-full py-32 rounded-[3.5rem] border-2 border-dashed border-gray-100 bg-white text-center">
                        <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-8 w-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-bold text-xl uppercase tracking-widest">Archive Silent</p>
                        <p className="text-gray-300 mt-2 font-medium">No assets matching your query were found in the frequency.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#58151C]/10 backdrop-blur-xl p-6">
                    <div className="w-full max-w-lg bg-white rounded-[3rem] p-10 shadow-3xl border border-white animate-fade-up relative">
                        <button onClick={() => setIsUploadOpen(false)} className="absolute top-8 right-8 text-gray-300 hover:text-[#58151C] transition-colors">
                            <Plus className="h-6 w-6 rotate-45" />
                        </button>

                        <h3 className="text-2xl font-poppins font-black text-[#111827] mb-8 flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-[#C3161C]" />
                            Archive Protocol
                        </h3>

                        <form action={handleUpload} className="space-y-6">
                            <Input label="Asset Title" name="title" required placeholder="Mission Writeup: Sector X" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Asset Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-[#58151C]/5 transition-all outline-none resize-none"
                                    placeholder="Brief summary of the intel content..."
                                />
                            </div>
                            <Input label="Direct URL / Link" name="url" type="url" required placeholder="https://drive.google.com/..." />

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Archive Classification</label>
                                <select name="category" className="w-full bg-gray-50 border-transparent rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-[#58151C]/5 transition-all outline-none cursor-pointer appearance-none">
                                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button type="submit" className="flex-1 rounded-2xl h-14 shadow-lg shadow-red-100">
                                    Execute Archival
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
