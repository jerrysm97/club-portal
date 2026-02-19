// components/PostForm.tsx
// A modal form for creating or editing a post.
// Shows as a centered overlay on top of the page.

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'

type PostFormProps = {
    // If editingPost is provided, we're in "edit mode", otherwise "create mode"
    editingPost: Post | null
    // Called after a post is successfully created or updated
    onSuccess: () => void
    // Called when the user clicks Cancel or the X button
    onClose: () => void
}

export default function PostForm({ editingPost, onSuccess, onClose }: PostFormProps) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // If we're editing an existing post, fill the form with its data
    useEffect(() => {
        if (editingPost) {
            setTitle(editingPost.title)
            setContent(editingPost.content)
        }
    }, [editingPost])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (editingPost) {
                // UPDATE an existing post
                const { error: updateError } = await supabase
                    .from('posts')
                    .update({ title, content })
                    .eq('id', editingPost.id)

                if (updateError) throw updateError
            } else {
                // CREATE a new post
                // First, get the current user's ID to set as author
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) throw new Error('You must be logged in to create a post')

                const { error: insertError } = await supabase
                    .from('posts')
                    .insert({
                        title,
                        content,
                        author_id: session.user.id,
                    })

                if (insertError) throw insertError
            }

            // Success! Tell the parent component to refresh the post list
            onSuccess()
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.')
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
                    <h2 className="text-xl font-bold text-slate-900">
                        {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title input */}
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                        </label>
                        <input
                            id="post-title"
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What's this about?"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Content textarea */}
                    <div>
                        <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 mb-1">
                            Content
                        </label>
                        <textarea
                            id="post-content"
                            required
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post here..."
                            rows={5}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
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
                                    <span>{editingPost ? 'Saving...' : 'Posting...'}</span>
                                </div>
                            ) : (
                                editingPost ? 'Save Changes' : 'Create Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
