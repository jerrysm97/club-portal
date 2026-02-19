// components/ui/ToastProvider.tsx — Global toast context
'use client'
import { createContext, useCallback, useContext, useState, useRef } from 'react'
import Toast, { type ToastData, type ToastType } from './Toast'

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside ToastProvider')
    return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([])
    const counterRef = useRef(0)

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const toast = useCallback((message: string, type: ToastType = 'info') => {
        const id = `toast-${++counterRef.current}`
        setToasts(prev => [...prev, { id, type, message }])
        setTimeout(() => dismiss(id), 4000)
    }, [dismiss])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div
                aria-live="polite"
                aria-label="Notifications"
                className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2"
            >
                {toasts.map(t => (
                    <Toast key={t.id} toast={t} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    )
}
