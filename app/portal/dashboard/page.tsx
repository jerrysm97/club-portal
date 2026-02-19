// app/dashboard/page.tsx
// The main dashboard page — shows the post feed.
// Displays all posts (pinned first), lets users create/edit/delete posts.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PostForm from '@/components/PostForm'

export default function DashboardPage() {
    // State for posts data
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // State for current user info (needed to show/hide edit/delete buttons)
    const [currentUserId, setCurrentUserId] = useState<string | null>(null)
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null)

    // State for the post form modal
    const [showForm, setShowForm] = useState(false)
    const [editingPost, setEditingPost] = useState<Post | null>(null)

    // Fetch all posts from the database, with author info joined in
    const fetchPosts = useCallback(async () => {
        try {
            setError(null)
            const { data, error: fetchError } = await supabase
                .from('posts')
                .select(`
          *,
          author:members!posts_author_id_fkey (id, name, email, avatar_url)
        `)
                .order('pinned', { ascending: false })   // Pinned posts first
                .order('created_at', { ascending: false }) // Then newest first

            if (fetchError) throw fetchError
            setPosts(data || [])
        } catch (err: any) {
            setError(err.message || 'Failed to load posts')
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

                // Get their role from the members table
                const { data: member } = await supabase
                    .from('members')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                if (member) setCurrentUserRole(member.role)
            }
        }

        getCurrentUser()
        fetchPosts()
    }, [fetchPosts])

    // Delete a post
    const handleDelete = async (postId: string) => {
        // Show a confirmation dialog before deleting
        if (!confirm('Are you sure you want to delete this post?')) return

        try {
            const { error: deleteError } = await supabase
                .from('posts')
                .delete()
                .eq('id', postId)

            if (deleteError) throw deleteError

            // Refresh the posts list after deletion
            fetchPosts()
        } catch (err: any) {
            alert(err.message || 'Failed to delete post')
        }
    }

    // Open the form in "edit mode" for a specific post
    const handleEdit = (post: Post) => {
        setEditingPost(post)
        setShowForm(true)
    }

    // Called when a post is successfully created or updated
    const handleFormSuccess = () => {
        setShowForm(false)
        setEditingPost(null)
        fetchPosts() // Refresh the list
    }

    // Close the form and reset editing state
    const handleFormClose = () => {
        setShowForm(false)
        setEditingPost(null)
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Post Feed</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Stay updated with the latest from the club
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all cursor-pointer"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    New Post
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

            {/* Posts list */}
            {!loading && !error && (
                <div className="space-y-4">
                    {posts.length === 0 ? (
                        // Empty state — no posts yet
                        <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                            <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <p className="text-slate-500 font-medium">No posts yet</p>
                            <p className="text-sm text-slate-400 mt-1">Be the first to share something!</p>
                        </div>
                    ) : (
                        // Render each post using the PostCard component
                        posts.map((post) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                currentUserId={currentUserId}
                                currentUserRole={currentUserRole}
                                onDelete={handleDelete}
                                onEdit={handleEdit}
                            />
                        ))
                    )}
                </div>
            )}

            {/* Post form modal — only shown when showForm is true */}
            {showForm && (
                <PostForm
                    editingPost={editingPost}
                    onSuccess={handleFormSuccess}
                    onClose={handleFormClose}
                />
            )}
        </div>
    )
}
