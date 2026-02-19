// components/ui/Avatar.tsx — Member avatar with fallback initials
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface AvatarProps {
    src?: string | null
    name: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeMap = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
}

function getInitials(name: string | null | undefined): string {
    if (!name) return '??'
    return name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
    const sizeClass = sizeMap[size]
    const pxSize = size === 'sm' ? 32 : size === 'md' ? 40 : 56

    if (src) {
        return (
            <Image
                src={src}
                alt={name}
                width={pxSize}
                height={pxSize}
                className={cn('rounded-full object-cover border border-[#27272A]', sizeClass, className)}
            />
        )
    }

    return (
        <div className={cn(
            'rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center font-mono font-bold text-[#10B981]',
            sizeClass,
            className
        )}>
            {getInitials(name)}
        </div>
    )
}
