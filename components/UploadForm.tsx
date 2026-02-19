// components/UploadForm.tsx
// A modal form for uploading documents.
// Lets the user pick a file (PDF, DOC, DOCX), give it a title, and upload it.

'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

type UploadFormProps = {
    onSuccess: () => void
    onClose: () => void
}

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

// Allowed file types
const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export default function UploadForm({ onSuccess, onClose }: UploadFormProps) {
    const [title, setTitle] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handle file selection
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (!selectedFile) return

        // Check file type
        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            setError('Only PDF, DOC, and DOCX files are allowed.')
            setFile(null)
            return
        }

        // Check file size
        if (selectedFile.size > MAX_FILE_SIZE) {
            setError('File size must be less than 10MB.')
            setFile(null)
            return
        }

        setError(null)
        setFile(selectedFile)
    }

    // Determine file extension from the file name
    const getFileType = (fileName: string): string => {
        const ext = fileName.split('.').pop()?.toLowerCase()
        if (ext === 'pdf') return 'pdf'
        if (ext === 'docx') return 'docx'
        if (ext === 'doc') return 'doc'
        return 'pdf' // default fallback
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) {
            setError('Please select a file to upload.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            // Get current user
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('You must be logged in to upload documents')

            // Create a unique file name to avoid collisions
            const fileExt = file.name.split('.').pop()
            const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

            // Upload the file to Supabase Storage bucket called "documents"
            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // Get the public URL for the uploaded file
            const { data: urlData } = supabase.storage
                .from('documents')
                .getPublicUrl(fileName)

            // Save the document record in the database
            const { error: insertError } = await supabase
                .from('documents')
                .insert({
                    title,
                    file_url: urlData.publicUrl,
                    file_type: getFileType(file.name),
                    uploaded_by: session.user.id,
                })

            if (insertError) throw insertError

            // Success! Refresh the list
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Something went wrong during upload.')
        } finally {
            setLoading(false)
        }
    }

    return (
        // Dark overlay
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            {/* Modal card */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Document title */}
                    <div>
                        <label htmlFor="doc-title" className="block text-sm font-medium text-slate-700 mb-1">
                            Document Title
                        </label>
                        <input
                            id="doc-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Meeting Minutes - February"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* File picker */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            File (PDF, DOC, DOCX — max 10MB)
                        </label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
                        >
                            {file ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                </div>
                            ) : (
                                <div>
                                    <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <p className="text-sm text-slate-500">Click to select a file</p>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                'Upload Document'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
