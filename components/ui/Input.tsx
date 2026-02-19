// components/ui/Input.tsx — IIMS Collegiate Input Primitive
import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, helperText, type, ...props }, ref) => {
        const id = React.useId()

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-medium text-[#374151] select-none"
                    >
                        {label}
                        {props.required && <span className="text-[#C3161C] ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        type={type}
                        className={cn(
                            'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[#111827] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9CA3AF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C3161C] focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow',
                            error ? 'border-red-500 focus-visible:ring-red-500' : 'border-[#D1D5DB]',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
                {!error && helperText && <p className="text-xs text-[#6B7280]">{helperText}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
