// app/portal/profile/edit/page.tsx — IIMS IT Club Profile Editor (v4.0)
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, uploadAvatar } from '@/app/portal/(protected)/profile/actions'
import { ArrowLeft, Upload, Loader2, Save, Terminal, Camera, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'

export default function EditProfilePage() {
    const router = useRouter()
    const supabase = createClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [member, setMember] = useState<any>(null)

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            const session = user ? { user } : null
            if (!session) return router.push('/portal/login')

            const { data } = await supabase
                .from('members')
                .select('*')
                .eq('user_id', session.user.id)
                .single()

            if (data) setMember(data)
            setLoading(false)
        }
        loadProfile()
    }, [router, supabase])

    async function handleSave(formData: FormData) {
        setSaving(true)
        const res = await updateProfile(formData)
        setSaving(false)

        if (res?.error) {
            toast.error(res.error)
        } else {
            toast.success('Profile updated successfully')
            router.push('/portal/profile')
        }
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadAvatar(formData)
        setUploading(false)

        if (res?.error) {
            toast.error(res.error)
        } else if (res?.url) {
            setMember({ ...member, avatar_url: res.url })
            toast.success('Avatar updated')
        }
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#111111]" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-up pb-16">
            <Link href="/portal/profile" className="inline-flex items-center gap-2 text-[#757575] hover:text-[#111111] font-bold text-xs uppercase tracking-widest transition-all group">
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Return to Profile
            </Link>

            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#FAFAFA] text-[#111111] font-bold text-[10px] uppercase tracking-widest mb-3 border border-[#E5E5E5]">
                    <Terminal className="h-3.5 w-3.5" /> Identity Core
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-[#212121] leading-tight flex items-center gap-4">
                    Update <span className="text-[#111111]">Profile</span>
                </h1>
                <p className="text-[#757575] font-medium text-sm mt-3 max-w-xl leading-relaxed">
                    Modify your personal directory listing, upload a verified photo, and calibrate your technical expertise matrix.
                </p>
            </div>

            <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-[#E0E0E0] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F8F9FA] rounded-bl-[4rem] -z-10" />

                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center space-y-4 shrink-0">
                        <div className="relative group">
                            <div className="p-2 bg-white rounded-[2.5rem] border border-[#E0E0E0] shadow-sm">
                                <Avatar
                                    src={member?.avatar_url}
                                    name={member?.full_name || member?.email}
                                    className="w-40 h-40 rounded-[2rem] border-4 border-[#F8F9FA]"
                                />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="absolute bottom-4 right-4 p-3 bg-[#E53935] hover:bg-[#D32F2F] text-white rounded-sm shadow-sm shadow-black/20 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-[#E53935]/30 disabled:opacity-50"
                            >
                                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <p className="text-[#9E9E9E] text-[10px] font-bold uppercase tracking-widest text-center mt-2">
                            Max size: 2MB<br />Square aspect recommended
                        </p>
                    </div>

                    {/* Edit Form */}
                    <form action={handleSave} className="flex-1 space-y-6 w-full relative z-10">
                        <Input
                            label="Full Name"
                            name="full_name"
                            defaultValue={member?.full_name || ''}
                            placeholder="John Doe"
                            required
                        />

                        <div className="space-y-1.5 focus-within:text-[#111111]">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1 transition-colors">
                                Professional Biography
                            </label>
                            <textarea
                                name="bio"
                                defaultValue={member?.bio || ''}
                                rows={4}
                                className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3 text-sm font-medium focus:bg-white focus:border-[#111111]/30 focus:ring-4 focus:ring-[#111111]/10 transition-all outline-none resize-none text-[#212121]"
                                placeholder="Write a short summary about yourself..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="GitHub Profile URL"
                                name="github_url"
                                type="url"
                                defaultValue={member?.github_url || ''}
                                placeholder="https://github.com/..."
                            />
                            <Input
                                label="LinkedIn URL"
                                name="linkedin_url"
                                type="url"
                                defaultValue={member?.linkedin_url || ''}
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>

                        <div className="space-y-1.5 focus-within:text-[#111111]">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#757575] ml-1 flex items-center gap-2">
                                <Zap className="h-3 w-3" /> Technical Expertise
                            </label>
                            <input
                                name="skills"
                                type="text"
                                defaultValue={(member?.skills || []).join(', ')}
                                className="w-full bg-[#F8F9FA] border border-[#E0E0E0] rounded-sm px-4 py-3.5 text-sm font-semibold focus:bg-white focus:border-[#111111]/30 focus:ring-4 focus:ring-[#111111]/10 transition-all outline-none text-[#212121]"
                                placeholder="React, Node.js, Python, Penetration Testing (Comma separated)"
                            />
                        </div>

                        <div className="pt-8 mt-8 border-t border-[#E0E0E0] flex justify-end gap-4">
                            <Link href="/portal/profile">
                                <Button type="button" variant="outline" className="border-[#E0E0E0] hover:border-[#BDBDBD] text-[#757575] hover:bg-[#F8F9FA] h-[52px]">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={saving} className="bg-[#111111] hover:bg-[#C8102E] shadow-sm shadow-[#111111]/20 h-[52px] px-8 border-transparent">
                                {saving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
