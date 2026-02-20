// app/portal/register/RegisterForm.tsx — Form for profile completion
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, BookOpen, GraduationCap, Calendar, FileText, Code2, ArrowRight, Loader2 } from 'lucide-react'

export default function RegisterForm({ initialName }: { initialName: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [skillsInput, setSkillsInput] = useState('')

    const [form, setForm] = useState({
        full_name: initialName,
        student_id: '',
        program: 'BSc (Hons) Computing',
        intake: '',
        bio: '',
        skills: [] as string[],
    })

    const programs = ['BSc (Hons) Computing', 'BBA', 'BHM', 'Other']

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Process comma-separated skills
            const processedSkills = skillsInput
                .split(',')
                .map(s => s.trim())
                .filter(s => s.length > 0)

            const submission = { ...form, skills: processedSkills }

            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submission),
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to update profile')

            // Success, redirect to pending (or dashboard if approved)
            router.push('/portal/pending')
            router.refresh()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-xl bg-[#FFEBEE] border border-[#E53935]/20 text-[#C62828] text-sm font-medium animate-slide-in">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="full_name" className="block text-sm font-semibold text-[#424242] mb-1.5">Full Name</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-[#9E9E9E]" />
                        </div>
                        <input
                            id="full_name"
                            required
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="student_id" className="block text-sm font-semibold text-[#424242] mb-1.5">Student ID</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <BookOpen className="h-4 w-4 text-[#9E9E9E]" />
                        </div>
                        <input
                            id="student_id"
                            required
                            value={form.student_id}
                            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all"
                            placeholder="e.g. 10002345"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="program" className="block text-sm font-semibold text-[#424242] mb-1.5">Program</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-4 w-4 text-[#9E9E9E]" />
                        </div>
                        <select
                            id="program"
                            required
                            value={form.program}
                            onChange={(e) => setForm({ ...form, program: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all appearance-none"
                        >
                            {programs.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="intake" className="block text-sm font-semibold text-[#424242] mb-1.5">Intake (Year & Session)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-[#9E9E9E]" />
                        </div>
                        <input
                            id="intake"
                            required
                            value={form.intake}
                            onChange={(e) => setForm({ ...form, intake: e.target.value })}
                            className="block w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all"
                            placeholder="e.g. Autumn 2024"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label htmlFor="skills" className="block text-sm font-semibold text-[#424242] mb-1.5">Skills (Comma separated)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <Code2 className="h-4 w-4 text-[#9E9E9E]" />
                    </div>
                    <input
                        id="skills"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2.5 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all"
                        placeholder="React, Python, Penetration Testing, UI/UX"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="bio" className="block text-sm font-semibold text-[#424242] mb-1.5">Bio (Optional)</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                        <FileText className="h-4 w-4 text-[#9E9E9E]" />
                    </div>
                    <textarea
                        id="bio"
                        rows={3}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        className="block w-full pl-10 pr-3 py-3 bg-[#F8F9FA] border border-[#E0E0E0] rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1A237E]/20 focus:border-[#1A237E] text-[#212121] text-sm transition-all resize-none"
                        placeholder="Tell us a bit about yourself..."
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A237E] text-white font-semibold flex items-center justify-center gap-2 py-3.5 rounded-xl hover:bg-[#283593] active:bg-[#1A237E] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-[#1A237E]/20 transition-all mt-4"
            >
                {loading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving Profile...
                    </>
                ) : (
                    <>
                        Complete Registration
                        <ArrowRight className="h-5 w-5" />
                    </>
                )}
            </button>
        </form>
    )
}
