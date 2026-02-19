// app/admin/page.tsx
// Admin panel — only accessible by users with role: 'admin'
// Has 3 tabs: Members, Posts, Documents
// Admins can approve/reject members, change roles, and delete any content.

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Member, Post, Document } from '@/lib/types'

type Tab = 'members' | 'posts' | 'documents'

export default function AdminPage() {
    // Which tab is currently active
    const [activeTab, setActiveTab] = useState<Tab>('members')

    // Data for each tab
    const [members, setMembers] = useState<Member[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [documents, setDocuments] = useState<Document[]>([])

    // Loading and error states
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Check if current user is admin
    const [isAdmin, setIsAdmin] = useState(false)
    const [checking, setChecking] = useState(true)

    // Verify admin access on page load
    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    window.location.href = '/login'
                    return
                }

                const { data: member } = await supabase
                    .from('members')
                    .select('role, status')
                    .eq('id', session.user.id)
                    .single()

                if (!member || member.role !== 'admin' || member.status !== 'approved') {
                    // Not an admin — redirect to dashboard
                    window.location.href = '/dashboard'
                    return
                }

                setIsAdmin(true)
            } catch {
                window.location.href = '/dashboard'
            } finally {
                setChecking(false)
            }
        }

        checkAdmin()
    }, [])

    // Fetch data based on active tab
    const fetchData = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            if (activeTab === 'members') {
                const { data, error: err } = await supabase
                    .from('members')
                    .select('*')
                    .order('created_at', { ascending: false })
                if (err) throw err
                setMembers(data || [])
            } else if (activeTab === 'posts') {
                const { data, error: err } = await supabase
                    .from('posts')
                    .select(`*, author:members!posts_author_id_fkey (id, name, email)`)
                    .order('created_at', { ascending: false })
                if (err) throw err
                setPosts(data || [])
            } else if (activeTab === 'documents') {
                const { data, error: err } = await supabase
                    .from('documents')
                    .select(`*, uploader:members!documents_uploaded_by_fkey (id, name, email)`)
                    .order('created_at', { ascending: false })
                if (err) throw err
                setDocuments(data || [])
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [activeTab])

    useEffect(() => {
        if (isAdmin) fetchData()
    }, [isAdmin, fetchData])

    // ─── Member actions ────────────────────────────────────────
    const updateMemberStatus = async (memberId: string, status: 'approved' | 'rejected') => {
        try {
            const { error } = await supabase
                .from('members')
                .update({ status })
                .eq('id', memberId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to update member')
        }
    }

    const updateMemberRole = async (memberId: string, role: 'admin' | 'member') => {
        try {
            const { error } = await supabase
                .from('members')
                .update({ role })
                .eq('id', memberId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to update role')
        }
    }

    const deleteMember = async (memberId: string) => {
        if (!confirm('Are you sure you want to delete this member? This cannot be undone.')) return
        try {
            const { error } = await supabase.from('members').delete().eq('id', memberId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to delete member')
        }
    }

    // ─── Post actions ──────────────────────────────────────────
    const deletePost = async (postId: string) => {
        if (!confirm('Delete this post?')) return
        try {
            const { error } = await supabase.from('posts').delete().eq('id', postId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to delete post')
        }
    }

    const togglePin = async (postId: string, currentlyPinned: boolean) => {
        try {
            const { error } = await supabase
                .from('posts')
                .update({ pinned: !currentlyPinned })
                .eq('id', postId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to update pin')
        }
    }

    // ─── Document actions ──────────────────────────────────────
    const deleteDocument = async (docId: string) => {
        if (!confirm('Delete this document?')) return
        try {
            const { error } = await supabase.from('documents').delete().eq('id', docId)
            if (error) throw error
            fetchData()
        } catch (err: any) {
            alert(err.message || 'Failed to delete document')
        }
    }

    // Show loading while checking admin status
    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAdmin) return null

    // ─── Tab configuration ─────────────────────────────────────
    const tabs: { key: Tab; label: string; count: number }[] = [
        { key: 'members', label: 'Members', count: members.length },
        { key: 'posts', label: 'Posts', count: posts.length },
        { key: 'documents', label: 'Documents', count: documents.length },
    ]

    // Status badge colors
    const statusColors: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        approved: 'bg-green-50 text-green-700 border-green-200',
        rejected: 'bg-red-50 text-red-700 border-red-200',
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 md:p-10">
            <div className="max-w-5xl mx-auto">
                {/* Page header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
                        <span className="px-2.5 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-full border border-purple-200">
                            Admin
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        Manage members, posts, and documents
                    </p>
                </div>

                {/* Back to dashboard link */}
                <a
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 mb-6 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </a>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-100 shadow-sm mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab.key
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`ml-1.5 text-xs ${activeTab === tab.key ? 'text-indigo-200' : 'text-slate-400'
                                    }`}>
                                    ({tab.count})
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm mb-6">{error}</div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    </div>
                )}

                {/* ─── MEMBERS TAB ─── */}
                {!loading && activeTab === 'members' && (
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Member</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Status</th>
                                    <th className="text-left px-5 py-3 font-medium text-slate-600">Role</th>
                                    <th className="text-right px-5 py-3 font-medium text-slate-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {members.map((member) => (
                                    <tr key={member.id} className="hover:bg-slate-50/50">
                                        {/* Name + email */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-semibold text-indigo-600">
                                                        {(member.name || member.email || '?')[0].toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-900">{member.name || 'No name'}</p>
                                                    <p className="text-xs text-slate-400">{member.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status badge */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${statusColors[member.status] || ''}`}>
                                                {member.status}
                                            </span>
                                        </td>

                                        {/* Role toggle */}
                                        <td className="px-5 py-4">
                                            <select
                                                value={member.role}
                                                onChange={(e) => updateMemberRole(member.id, e.target.value as 'admin' | 'member')}
                                                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700 bg-white cursor-pointer"
                                            >
                                                <option value="member">Member</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>

                                        {/* Action buttons */}
                                        <td className="px-5 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {member.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateMemberStatus(member.id, 'approved')}
                                                            className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => updateMemberStatus(member.id, 'rejected')}
                                                            className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer"
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {member.status === 'rejected' && (
                                                    <button
                                                        onClick={() => updateMemberStatus(member.id, 'approved')}
                                                        className="px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer"
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {member.status === 'approved' && (
                                                    <button
                                                        onClick={() => updateMemberStatus(member.id, 'rejected')}
                                                        className="px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                                                    >
                                                        Suspend
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteMember(member.id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                                    title="Delete member"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {members.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-5 py-12 text-center text-slate-400">No members yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ─── POSTS TAB ─── */}
                {!loading && activeTab === 'posts' && (
                    <div className="space-y-3">
                        {posts.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                                <p className="text-slate-400">No posts yet</p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-slate-900 truncate">{post.title}</h3>
                                            {post.pinned && (
                                                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Pinned</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">
                                            by {post.author?.name || post.author?.email || 'Unknown'} · {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">{post.content}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => togglePin(post.id, post.pinned)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${post.pinned
                                                    ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                                                    : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
                                                }`}
                                        >
                                            {post.pinned ? 'Unpin' : 'Pin'}
                                        </button>
                                        <button
                                            onClick={() => deletePost(post.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ─── DOCUMENTS TAB ─── */}
                {!loading && activeTab === 'documents' && (
                    <div className="space-y-3">
                        {documents.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-xl border border-slate-100">
                                <p className="text-slate-400">No documents yet</p>
                            </div>
                        ) : (
                            documents.map((doc) => (
                                <div key={doc.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                                        <span className="text-xs font-bold text-red-600 uppercase">{doc.file_type || '?'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-slate-900 truncate">{doc.title}</h3>
                                        <p className="text-xs text-slate-400">
                                            by {doc.uploader?.name || doc.uploader?.email || 'Unknown'} · {new Date(doc.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <a
                                            href={doc.file_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            Download
                                        </a>
                                        <button
                                            onClick={() => deleteDocument(doc.id)}
                                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
