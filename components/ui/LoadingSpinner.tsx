// components/ui/LoadingSpinner.tsx — IIMS Collegiate Spinner
import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

export default function LoadingSpinner({
    size = 'md',
    className,
}: LoadingSpinnerProps) {
    const sizes = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4',
    }

    return (
        <div
            className={cn(
                'animate-spin rounded-full border-t-transparent',
                'border-[#C3161C]', // Main color
                sizes[size],
                className
            )}
            role="status"
            aria-label="loading"
        />
    )
}
