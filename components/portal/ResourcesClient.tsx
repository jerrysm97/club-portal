// components/portal/ResourcesClient.tsx — IIMS IT Club Resource Archive (v4.0)
'use client'

import { useState } from 'react'
import { FileText, Download, ExternalLink, Filter, Search, Plus, Terminal, Trash2, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { uploadDocument, deleteDocument } from '@/app/portal/(protected)/resources/actions'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { cn } from '@/lib/utils'

type Document = any

interface ResourcesClientProps {
    initialDocs: Document[]
    userRole: string
}

const CATEGORIES = [
    { id: 'all', label: 'All Documents' },
    { id: 'study-material', label: 'Study Assets' },
    { id: 'writeup', label: 'Writeups' },
    { id: 'presentation', label: 'Briefings' },
    { id: 'report', label: 'Reports' },
    { id: 'minutes', label: 'Meeting Minutes' },
    { id: 'general', label: 'General' },
]

export default function ResourcesClient({ initialDocs, userRole }: ResourcesClientProps) {
    const [activeCategory, setActiveCategory] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [loading, setLoading] = useState<string | null>(null)

    const isHighPerms = ['bod', 'president', 'admin', 'superadmin'].includes(userRole)
    const canUpload = ['bod', 'president', 'admin', 'superadmin'].includes(userRole)
    const isOwner = (docUploaderId: string) => docUploaderId === (initialDocs as any).find((d: any) => d.uploader_id === docUploaderId)?.uploader_id // This is a bit complex, actually we need the current member ID. 
    // Wait, ResourcesClient only takes userRole. We need memberId to check ownership.


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
            toast.success('Document archived successfully')
            setIsUploadOpen(false)
        }
    }

    async function handleDelete(id: string, uploaderId: string) {
        const isTopTier = ['president', 'admin', 'superadmin'].includes(userRole)
        const confirmMsg = isTopTier
            ? 'Execute PERMANENT redaction protocol? This cannot be undone.'
            : 'Execute soft-redaction? This will move the asset to the Recycle Bin.'

        if (!confirm(confirmMsg)) return
        setLoading(id)
        const res = await deleteDocument(id)
        setLoading(null)
        if (res?.error) toast.error(res.error)
        else toast.success('Document purged from archives')
    }

    return (
        <div className="space-y-10 animate-fade-up">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FAFAFA] text-[#111111] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#E5E5E5]">
                        <Terminal className="h-3 w-3" /> Archive Node
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[#212121] leading-tight">
                        Central <span className="text-[#111111]">Intel</span>
                    </h1>
                    <p className="text-[#757575] font-medium text-sm mt-3 max-w-xl leading-relaxed">
                        Access official club documents, training modules, and operative writeups for IIMS IT Club operations.
                    </p>
                </div>

                {canUpload && (
                    <Button
                        onClick={() => setIsUploadOpen(true)}
                        className="rounded-sm h-[54px] px-8 font-bold uppercase text-xs tracking-widest shadow-sm shadow-[#111111]/20 bg-[#111111] hover:bg-[#C8102E] border-transparent"
                        leftIcon={<Plus className="h-5 w-5" />}
                    >
                        Upload Document
                    </Button>
                )}
            </div>

            {/* Control Strip */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={cn(
                                    "px-5 py-2.5 rounded-sm font-bold text-[10px] uppercase tracking-widest transition-all",
                                    activeCategory === cat.id
                                        ? "bg-[#111111] text-white shadow-sm shadow-[#111111]/20"
                                        : "bg-white border border-[#E0E0E0] text-[#757575] hover:bg-[#F8F9FA] hover:text-[#212121] shadow-sm"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
                    <input
                        type="text"
                        placeholder="Query archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-[#E0E0E0] rounded-sm py-3 pl-10 pr-4 text-sm font-semibold focus:border-[#111111]/30 focus:ring-4 focus:ring-[#111111]/10 outline-none transition-all shadow-sm text-[#212121] placeholder:text-[#9E9E9E]"
                    />
                </div>
            </div>

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredDocs.map(doc => (
                    <div key={doc.id} className="group flex flex-col bg-white rounded-sm border border-[#E0E0E0] p-6 shadow-sm hover:shadow-sm hover:border-[#111111]/20 transition-all animate-fade-up">
                        <div className="flex items-start justify-between mb-6">
                            <div className="p-3.5 bg-[#F8F9FA] rounded-sm text-[#9E9E9E] group-hover:bg-[#FAFAFA] group-hover:text-[#111111] transition-all border border-[#E0E0E0] group-hover:border-[#E5E5E5]">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border",
                                    doc.category === 'writeup' ? "bg-[#FFEBEE] text-[#D32F2F] border-[#FFCDD2]" : "bg-[#F5F5F5] text-[#757575] border-[#EEEEEE]"
                                )}>
                                    {doc.category}
                                </span>
                                {isHighPerms && (
                                    <button
                                        onClick={() => handleDelete(doc.id, doc.uploader_id)}
                                        disabled={loading === doc.id}
                                        className="p-1.5 text-[#BDBDBD] hover:text-[#D32F2F] hover:bg-[#FFEBEE] rounded-sm transition-all"
                                    >
                                        {loading === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Visual Preview for Images/PDFs */}
                        {doc.file_url?.toLowerCase().match(/\.(jpeg|jpg|png|webp)$/) ? (
                            <div className="w-full h-32 mb-4 rounded-sm overflow-hidden border border-[#E0E0E0] bg-[#F8F9FA]">
                                <img src={doc.file_url} alt={doc.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : doc.file_url?.toLowerCase().endsWith('.pdf') ? (
                            <div className="w-full h-32 mb-4 rounded-sm border border-[#E0E0E0] bg-[#F8F9FA] flex flex-col items-center justify-center text-[#9E9E9E] group-hover:text-[#111111] transition-colors relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-[#111111]/5 rounded-bl-3xl" />
                                <FileText className="h-10 w-10 mb-2 opacity-50" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">PDF Document</span>
                            </div>
                        ) : null}

                        <h3 className="text-lg font-bold text-[#212121] mb-2 group-hover:text-[#111111] transition-colors leading-tight line-clamp-2 px-1">
                            {doc.title}
                        </h3>
                        <p className="text-[#757575] font-medium text-sm leading-relaxed line-clamp-2 mb-8 flex-1 px-1">
                            {doc.description || 'No briefing attached to this document.'}
                        </p>

                        <div className="flex items-center justify-between pt-5 border-t border-[#E0E0E0] mt-auto">
                            <span className="text-[10px] text-[#9E9E9E] font-bold uppercase tracking-widest shrink-0">{formatDate(doc.created_at)}</span>
                            <a
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F8F9FA] border border-[#E0E0E0] text-[#111111] rounded-sm font-bold text-[10px] uppercase tracking-widest hover:bg-[#111111] hover:border-[#111111] hover:text-white transition-all group/link shrink-0"
                            >
                                Access <ChevronRight className="h-3 w-3 group-hover/link:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                ))}

                {filteredDocs.length === 0 && (
                    <div className="col-span-full py-24 rounded-sm border border-dashed border-[#E0E0E0] bg-[#F8F9FA] text-center shadow-sm">
                        <div className="h-16 w-16 bg-white rounded-sm flex items-center justify-center mx-auto mb-5 border border-[#E0E0E0]">
                            <FileText className="h-8 w-8 text-[#BDBDBD]" />
                        </div>
                        <p className="text-[#424242] font-bold text-lg uppercase tracking-widest">Archive Silent</p>
                        <p className="text-[#757575] mt-1 font-medium text-sm">No documents matching your query were found.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            {isUploadOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/20 backdrop-blur-md p-4 md:p-6">
                    <div className="w-full max-w-lg bg-white rounded-sm p-8 md:p-10 shadow-sm border border-[#E0E0E0] animate-fade-up relative">
                        <button onClick={() => setIsUploadOpen(false)} className="absolute top-6 right-6 text-[#9E9E9E] hover:text-[#212121] transition-colors p-2 bg-[#F8F9FA] rounded-full hover:bg-[#EEEEEE]">
                            <Plus className="h-5 w-5 rotate-45" />
                        </button>

                        <h3 className="text-2xl font-bold text-[#212121] mb-8 flex items-center gap-3">
                            <ShieldCheck className="h-6 w-6 text-[#111111]" />
                            Archive Document
                        </h3>

                        <form action={handleUpload} className="space-y-5">
                            <Input label="Document Title" name="title" required placeholder="Mission Writeup: Sector X" />
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1">Asset Description</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all outline-none resize-none text-[#212121]"
                                    placeholder="Brief summary of the document content..."
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1">Document File</label>
                                <input
                                    type="file"
                                    name="file"
                                    required
                                    accept=".pdf,.docx,.doc,image/*"
                                    className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all outline-none text-[#212121] file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-[#FAFAFA] file:text-[#111111] hover:file:bg-[#E5E5E5] file:transition-colors file:cursor-pointer cursor-pointer"
                                />
                                <p className="text-[10px] text-[#9E9E9E] font-medium ml-1">Max 10MB. PDF, Word, or Images only.</p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1">Archive Classification</label>
                                <select name="category" className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3.5 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all outline-none cursor-pointer appearance-none text-[#212121]">
                                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                        <option key={c.id} value={c.id}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1">Privacy Protocol</label>
                                <select name="visibility" className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3.5 text-sm font-semibold focus:bg-white focus:ring-4 focus:ring-[#111111]/10 focus:border-[#111111]/30 transition-all outline-none cursor-pointer appearance-none text-[#212121]">
                                    <option value="all">Public to All Members</option>
                                    <option value="bod_only">Classified (BOD/Admin Only)</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <Button type="submit" className="flex-1 rounded-sm h-[52px] shadow-sm shadow-[#111111]/20 bg-[#111111] hover:bg-[#C8102E] border-transparent font-bold tracking-wide">
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
