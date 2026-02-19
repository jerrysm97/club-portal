// components/ui/Modal.tsx — Reusable dark modal
'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({ open, onClose, title, children, maxWidth = 'max-w-md' }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return
        const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [open, onClose])

    if (!open) return null

    return (
        <div
            ref={overlayRef}
            onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
            <div className={`bg-[#09090B] border border-[#27272A] rounded-md p-6 ${maxWidth} w-full mx-4 animate-fade-up`}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-mono font-bold text-[#F8FAFC] text-lg">{title}</h2>
                    <button onClick={onClose} className="text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    )
}
