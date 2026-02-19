// components/ui/Badge.tsx — Styled badge with color variants
import { cn } from '@/lib/utils'

type BadgeColor = 'cyan' | 'green' | 'red' | 'amber' | 'gray'

interface BadgeProps {
    children: React.ReactNode
    color?: BadgeColor
    className?: string
}

const colorStyles: Record<BadgeColor, string> = {
    cyan: 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30',
    green: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30',
    red: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30',
    amber: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30',
    gray: 'text-[#A1A1AA] bg-[#27272A] border-[#27272A]',
}

export default function Badge({ children, color = 'gray', className }: BadgeProps) {
    return (
        <span className={cn(
            'font-mono text-xs px-2 py-0.5 rounded-full border inline-flex items-center',
            colorStyles[color],
            className
        )}>
            {children}
        </span>
    )
}
