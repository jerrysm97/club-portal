// components/DocumentCard.tsx
// Displays a single document in a card format.
// Shows file type badge, title, uploader name, date, and download/delete buttons.

'use client'

import type { Document } from '@/lib/types'

type DocumentCardProps = {
    document: Document
    currentUserId: string | null
    currentUserRole: string | null
    onDelete: (docId: string) => void
}

// Map file types to colors for the badge
const fileTypeColors: Record<string, { bg: string; text: string }> = {
    pdf: { bg: 'bg-red-50', text: 'text-red-700' },
    docx: { bg: 'bg-blue-50', text: 'text-blue-700' },
    doc: { bg: 'bg-blue-50', text: 'text-blue-700' },
}

export default function DocumentCard({
    document,
    currentUserId,
    currentUserRole,
    onDelete,
}: DocumentCardProps) {
    // Check if the current user can delete (own documents OR admin)
    const canDelete = currentUserId === document.uploaded_by || currentUserRole === 'admin'

    // Format date
    const formattedDate = new Date(document.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })

    // Get badge colors based on file type
    const colors = fileTypeColors[document.file_type || ''] || { bg: 'bg-slate-50', text: 'text-slate-700' }

    return (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4 transition-all hover:shadow-md">
            {/* File type icon */}
            <div className={`shrink-0 w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                <span className={`text-xs font-bold uppercase ${colors.text}`}>
                    {document.file_type || '?'}
                </span>
            </div>

            {/* Document info */}
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-slate-900 truncate">{document.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                    Uploaded by {document.uploader?.name || document.uploader?.email || 'Unknown'} · {formattedDate}
                </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Download button */}
                <a
                    href={document.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download
                </a>

                {/* Delete button — only shown if user has permission */}
                {canDelete && (
                    <button
                        onClick={() => onDelete(document.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Delete document"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}
