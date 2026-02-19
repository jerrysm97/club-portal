// app/dashboard/profile/page.tsx
// The profile page — lets the user view and edit their own profile (name, bio).

'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Member } from '@/lib/types'

export default function ProfilePage() {
    const [member, setMember] = useState<Member | null>(null)
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Load the current user's profile on page load
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) return

                const { data, error } = await supabase
                    .from('members')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (error) throw error
                if (data) {
                    setMember(data)
                    setName(data.name || '')
                    setBio(data.bio || '')
                }
            } catch (err: any) {
                setMessage({ type: 'error', text: err.message || 'Failed to load profile' })
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    // Save profile changes
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error('Not logged in')

            const { error } = await supabase
                .from('members')
                .update({ name, bio })
                .eq('id', session.user.id)

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to save profile' })
        } finally {
            setSaving(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Update your name and bio so other members know who you are
                </p>
            </div>

            {/* Profile card */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
                {/* Avatar + email (read only) */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-xl font-bold text-indigo-600">
                            {(name || member?.email || '?')[0].toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900">{name || 'No name set'}</p>
                        <p className="text-sm text-slate-500">{member?.email}</p>
                        <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${member?.role === 'admin'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                            {member?.role}
                        </span>
                    </div>
                </div>

                {/* Editable form */}
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Name input */}
                    <div>
                        <label htmlFor="profile-name" className="block text-sm font-medium text-slate-700 mb-1">
                            Display Name
                        </label>
                        <input
                            id="profile-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name"
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Bio textarea */}
                    <div>
                        <label htmlFor="profile-bio" className="block text-sm font-medium text-slate-700 mb-1">
                            Bio
                        </label>
                        <textarea
                            id="profile-bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the club a little about yourself..."
                            rows={4}
                            className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        />
                    </div>

                    {/* Status message */}
                    {message && (
                        <div className={`p-3 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    {/* Save button */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                    >
                        {saving ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
