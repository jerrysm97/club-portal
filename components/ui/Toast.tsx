// components/ui/Toast.tsx — Non-blocking toast notification
'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
    message: string
    type?: ToastType
    duration?: number
    onClose: () => void
}

const borderColors: Record<ToastType, string> = {
    success: 'border-[#10B981]',
    error: 'border-[#EF4444]',
    warning: 'border-[#F59E0B]',
}

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="h-5 w-5 text-[#10B981] shrink-0" />,
    error: <XCircle className="h-5 w-5 text-[#EF4444] shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-[#F59E0B] shrink-0" />,
}

export default function Toast({ message, type = 'success', duration = 4000, onClose }: ToastProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true))
        const timer = setTimeout(() => {
            setVisible(false)
            setTimeout(onClose, 300)
        }, duration)
        return () => clearTimeout(timer)
    }, [duration, onClose])

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 bg-[#09090B] border-l-4 ${borderColors[type]} px-4 py-3 rounded-sm shadow-xl font-mono text-sm text-[#F8FAFC] flex items-center gap-3 max-w-sm transition-all duration-300 ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`}
        >
            {icons[type]}
            <span className="flex-1">{message}</span>
            <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="text-[#A1A1AA] hover:text-[#F8FAFC]">
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
