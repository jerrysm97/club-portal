// components/ui/Button.tsx — IIMS Collegiate Button Primitive
'use client'
import React from 'react'
import { cn } from '@/lib/utils'
import LoadingSpinner from './LoadingSpinner'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    loading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

export default function Button({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const variants = {
        primary: 'bg-[#C3161C] text-white hover:bg-[#A31217] shadow-sm',
        secondary: 'bg-[#58151C] text-white hover:bg-[#431015] shadow-sm',
        outline: 'border border-[#D1D5DB] text-[#374151] hover:bg-[#F9FAFB] hover:border-[#374151]',
        ghost: 'text-[#374151] hover:bg-[#F3F4F6]',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    }

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-10 w-10 flex items-center justify-center',
    }

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3161C] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    )
}
