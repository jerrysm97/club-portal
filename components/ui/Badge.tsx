// components/ui/Badge.tsx — IIMS Collegiate status badges
import { cn } from '@/lib/utils'

interface BadgeProps {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'maroon' | 'info' | 'outline'
    children: React.ReactNode
    className?: string
}

const variants: Record<string, string> = {
    default: 'bg-[#F3F4F6] text-[#374151]',
    success: 'bg-[#D1FAE5] text-[#065F46]',
    warning: 'bg-[#FEF3C7] text-[#92400E]',
    danger: 'bg-[#FEE2E2] text-[#991B1B]',
    maroon: 'bg-[#58151C] text-white',
    info: 'bg-[#DBEAFE] text-[#1E40AF]',
    outline: 'border border-[#E5E7EB] text-[#374151] bg-transparent',
}

export default function Badge({ variant = 'default', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    )
}

// Status-specific helpers
export function MemberStatusBadge({ status }: { status: string }) {
    const map: Record<string, 'warning' | 'success' | 'danger' | 'default'> = {
        pending: 'warning',
        approved: 'success',
        rejected: 'danger',
        banned: 'danger',
    }
    return <Badge variant={map[status] ?? 'default'}>{status}</Badge>
}

export function RoleBadge({ role }: { role: string }) {
    const map: Record<string, 'maroon' | 'danger' | 'info' | 'default'> = {
        superadmin: 'maroon',
        admin: 'danger',
        bod: 'info',
        member: 'default',
    }
    return <Badge variant={map[role] ?? 'default'}>{role}</Badge>
}
