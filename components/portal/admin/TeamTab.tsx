'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { TeamMember } from '@/types/database'
import { toast } from 'sonner'
import Avatar from '@/components/ui/Avatar'

export default function TeamTab({ team }: { team: TeamMember[] }) {
    // Basic implementation since this is static content
    return (
        <div className="space-y-6 animate-fade-up">
            <div>
                <h2 className="text-xl font-mono font-bold text-[#F8FAFC]">Roster_Management</h2>
                <p className="text-[#A1A1AA] font-mono text-sm">Manage public facing team members.</p>
            </div>

            <div className="p-12 border border-dashed border-[#27272A] text-center text-[#52525B] font-mono">
                Team management module offline. (Placeholder)
            </div>
        </div>
    )
}
