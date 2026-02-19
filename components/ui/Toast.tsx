// components/ui/Toast.tsx — IIMS Collegiate toast notification
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
    id: string
    type: ToastType
    message: string
}

interface ToastProps {
    toast: ToastData
    onDismiss: (id: string) => void
}

const config: Record<ToastType, { icon: React.ElementType; bg: string; iconColor: string; border: string }> = {
    success: { icon: CheckCircle, bg: 'bg-white', iconColor: 'text-[#059669]', border: 'border-l-4 border-l-[#059669]' },
    error: { icon: XCircle, bg: 'bg-white', iconColor: 'text-[#C3161C]', border: 'border-l-4 border-l-[#C3161C]' },
    warning: { icon: AlertTriangle, bg: 'bg-white', iconColor: 'text-[#D97706]', border: 'border-l-4 border-l-[#D97706]' },
    info: { icon: Info, bg: 'bg-white', iconColor: 'text-[#2563EB]', border: 'border-l-4 border-l-[#2563EB]' },
}

export default function Toast({ toast, onDismiss }: ToastProps) {
    const { icon: Icon, bg, iconColor, border } = config[toast.type]

    return (
        <div
            role="alert"
            className={cn(
                'flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border border-[#E5E7EB] min-w-[280px] max-w-sm animate-slide-in',
                bg,
                border
            )}
        >
            <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', iconColor)} />
            <p className="flex-1 text-sm text-[#374151] leading-snug">{toast.message}</p>
            <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#9CA3AF] hover:text-[#374151] transition-colors"
                aria-label="Dismiss notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    )
}
