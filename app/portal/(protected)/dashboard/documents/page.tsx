// app/dashboard/documents/page.tsx
// The documents page — shows all uploaded documents and lets users upload new ones.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Document } from '@/lib/types'
import DocumentCard from '@/components/DocumentCard'
import UploadForm from '@/components/UploadForm'

export default function DocumentsPage() {
    // State for documents data
    const [documents, setDocuments] = useState<Document[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State for current user info
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

    // State for upload form modal
    const [showUploadForm, setShowUploadForm] = useState(false)

    // Fetch all documents from the database, with uploader info joined
    const fetchDocuments = useCallback(async () => {
        try {
            setError(null)
            const { data, error: fetchError } = await supabase
                .from('documents')
                .select(`
          *,
          uploader:members!documents_uploaded_by_fkey (id, name, email)
        `)
                .order('created_at', { ascending: false }) // Newest first

            if (fetchError) throw fetchError
            setDocuments(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to load documents')
        } finally {
            setLoading(false)
        }
    }, [])

    // Get the current user's ID and role on page load
    useEffect(() => {
        const getCurrentUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                setCurrentUserId(session.user.id)

                const { data: member } = await supabase
                    .from('members')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (member) setCurrentUserRole(member.role)
            }
        }

        getCurrentUser()
        fetchDocuments()
    }, [fetchDocuments])

    // Delete a document (from storage AND database)
    const handleDelete = async (docId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        try {
            // Find the document to get its file URL for storage deletion
            const doc = documents.find((d) => d.id === docId)

            // Delete from database first
            const { error: deleteError } = await supabase
                .from('documents')
                .delete()
                .eq('id', docId)

            if (deleteError) throw deleteError

            // Try to delete from storage too (extract path from URL)
            if (doc?.file_url) {
                try {
                    const url = new URL(doc.file_url)
                    // The path in storage is after /object/public/documents/
                    const storagePath = url.pathname.split('/storage/v1/object/public/documents/')[1]
                    if (storagePath) {
                        await supabase.storage.from('documents').remove([storagePath])
                    }
                } catch {
                    // Storage deletion is best-effort — don't block on it
                    console.warn('Could not delete file from storage')
                }
            }

            // Refresh the list
            fetchDocuments()
        } catch (err: any) {
            alert(err.message || 'Failed to delete document')
        }
    }

    // Called when upload succeeds
    const handleUploadSuccess = () => {
        setShowUploadForm(false)
        fetchDocuments()
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Shared files and resources for the club
                    </p>
                </div>
                <button
                    onClick={() => setShowUploadForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Upload
                </button>
            </div>

            {/* Loading spinner */}
            {loading && (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm mb-6">
                    {error}
                </div>
            )}

            {/* Documents list */}
            {!loading && !error && (
                <div className="space-y-3">
                    {documents.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            <p className="text-slate-500 font-medium">No documents yet</p>
                            <p className="text-sm text-slate-400 mt-1">Upload a file to share with the club</p>
                        </div>
                    ) : (
                        documents.map((doc) => (
                            <DocumentCard
                                key={doc.id}
                                document={doc}
                                currentUserId={currentUserId}
                                currentUserRole={currentUserRole}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Upload form modal */}
            {showUploadForm && (
                <UploadForm
                    onSuccess={handleUploadSuccess}
                    onClose={() => setShowUploadForm(false)}
                />
            )}
        </div>
    )
}
