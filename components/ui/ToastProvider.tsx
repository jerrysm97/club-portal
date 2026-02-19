// components/ui/ToastProvider.tsx — Context-based toast system
'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import Toast, { type ToastType } from './Toast'

interface ToastItem {
    id: number
    message: string
    type: ToastType
}

interface ToastContextValue {
    toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue>({ toast: () => { } })

export function useToast() {
    return useContext(ToastContext)
}

let nextId = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const toast = useCallback((message: string, type: ToastType = 'success') => {
        const id = nextId++
        setToasts(prev => [...prev, { id, message, type }])
    }, [])

    const remove = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t, i) => (
                    <div key={t.id} style={{ transform: `translateY(-${i * 4}px)` }}>
                        <Toast
                            message={t.message}
                            type={t.type}
                            onClose={() => remove(t.id)}
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}
