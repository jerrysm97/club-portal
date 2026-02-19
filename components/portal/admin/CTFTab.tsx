'use client'

import { useState } from 'react'
import { Plus, Trash2, Trophy, Edit2, Flag } from 'lucide-react'
import { upsertChallenge, deleteChallenge } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { CTFChallenge } from '@/types/database'

export default function CTFTab({ challenges }: { challenges: CTFChallenge[] }) {
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState<Partial<CTFChallenge> & { flag?: string }>({})

    function startEdit(challenge?: CTFChallenge) {
        setForm(challenge || {
            title: '',
            description: '',
            category: 'web',
            difficulty: 'easy',
            points: 100,
            is_active: true,
            flag_format: 'flag{...}'
        })
        setIsEditing(true)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const res = await upsertChallenge(form)
        if (res?.error) toast.error(res.error)
        else {
            toast.success('Challenge manifest updated')
            setIsEditing(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Decommission this challenge?')) return
        const res = await deleteChallenge(id)
        if (res?.error) toast.error(res.error)
        else toast.success('Challenge decommissioned')
    }

    return (
        <div className="space-y-6 animate-fade-up">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">CTF_Arena_Control</h2>
                    <p className="text-[#A1A1AA] font-mono text-sm">Deploy and manage wargame challenges.</p>
                </div>
                <button
                    onClick={() => startEdit()}
                    className="flex items-center gap-2 px-3 py-2 bg-[#EAB308] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#FACC15] transition-colors"
                >
                    <Plus className="h-4 w-4" /> DEPLOY_CHALLENGE
                </button>
            </div>

            {isEditing && (
                <form onSubmit={handleSubmit} className="p-6 bg-[#111113] border border-[#27272A] rounded-sm space-y-4 mb-8">
                    <h3 className="text-[#F8FAFC] font-mono font-bold">{form.id ? 'Edit Protocol' : 'New Protocol'}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Challenge Title"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.title || ''}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                        />
                        <div className="flex gap-2">
                            <select
                                className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm flex-1"
                                value={form.category || 'web'}
                                onChange={e => setForm({ ...form, category: e.target.value as any })}
                            >
                                <option value="web">Web</option>
                                <option value="pwn">Pwn</option>
                                <option value="crypto">Crypto</option>
                                <option value="forensics">Forensics</option>
                                <option value="misc">Misc</option>
                            </select>
                            <select
                                className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm flex-1"
                                value={form.difficulty || 'easy'}
                                onChange={e => setForm({ ...form, difficulty: e.target.value as any })}
                            >
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                                <option value="insane">Insane</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            placeholder="Points"
                            type="number"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.points || ''}
                            onChange={e => setForm({ ...form, points: parseInt(e.target.value) })}
                            required
                        />
                        <input
                            placeholder="Flag (e.g. flag{...})"
                            className="bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm border-l-4 border-l-[#EAB308]"
                            value={form.flag || ''}
                            onChange={e => setForm({ ...form, flag: e.target.value })}
                        />
                    </div>
                    <textarea
                        placeholder="Challenge Description..."
                        rows={4}
                        className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                        value={form.description || ''}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 text-[#A1A1AA] hover:text-[#F8FAFC] font-mono text-sm">CANCEL</button>
                        <button type="submit" className="px-3 py-2 bg-[#EAB308] text-black font-mono text-xs font-bold rounded-sm hover:bg-[#FACC15]">DEPLOY</button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((chal) => (
                    <div key={chal.id} className="p-4 bg-[#111113] border border-[#27272A] rounded-sm flex flex-col justify-between group hover:border-[#EAB308]/50 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-[#F8FAFC] font-mono font-bold text-sm">{chal.title}</h3>
                                <span className="text-[#EAB308] font-mono font-bold text-sm">{chal.points} pts</span>
                            </div>
                            <div className="flex gap-2 text-[10px] font-mono uppercase mb-3">
                                <span className="px-1.5 py-0.5 border border-[#27272A] rounded-sm text-[#A1A1AA]">{chal.category}</span>
                                <span className="px-1.5 py-0.5 border border-[#27272A] rounded-sm text-[#A1A1AA]">{chal.difficulty}</span>
                            </div>
                            <p className="text-[#A1A1AA] text-xs font-mono line-clamp-2 mb-4">{chal.description}</p>
                        </div>
                        <div className="flex justify-between items-center border-t border-[#27272A] pt-3">
                            <span className="text-[10px] text-[#52525B] font-mono flex items-center gap-1">
                                <Trophy className="h-3 w-3" /> {chal.solves_count} Solves
                            </span>
                            <div className="flex gap-2">
                                <button onClick={() => startEdit(chal)} className="text-[#A1A1AA] hover:text-[#F8FAFC]">
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(chal.id)} className="text-[#A1A1AA] hover:text-[#F43F5E]">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
