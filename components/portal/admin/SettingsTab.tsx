'use client'

import { useState } from 'react'
import { updateSettings } from '@/app/portal/admin/actions'
import { toast } from 'sonner'
import type { SiteSettings } from '@/types/database'

export default function SettingsTab({ settings }: { settings: SiteSettings }) {
    const [form, setForm] = useState(settings)

    async function handleSave() {
        const res = await updateSettings(form)
        if (res?.error) toast.error(res.error)
        else toast.success('Global configuration saved')
    }

    return (
        <div className="space-y-6 animate-fade-up max-w-2xl">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">System_Configuration</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Global variables and SEO settings.</p>
            </div>

            <div className="p-6 bg-[#111113] border border-[#27272A] rounded-sm space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-mono text-[#A1A1AA]">About Text</label>
                    <textarea
                        rows={4}
                        className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                        value={form.about_text || ''}
                        onChange={e => setForm({ ...form, about_text: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-[#A1A1AA]">Contact Email</label>
                        <input
                            className="w-full bg-[#09090B] border border-[#27272A] p-2 text-[#F8FAFC] text-sm font-mono rounded-sm"
                            value={form.contact_email || ''}
                            onChange={e => setForm({ ...form, contact_email: e.target.value })}
                        />
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-2 bg-[#10B981] text-black font-mono text-sm font-bold rounded-sm hover:bg-[#34D399]"
                >
                    SAVE_CONFIGURATION
                </button>
            </div>
        </div>
    )
}
