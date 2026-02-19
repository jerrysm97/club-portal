// components/ui/ConfirmModal.tsx — Destructive action confirmation
'use client'

import { useState } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Modal from './Modal'

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => Promise<void> | void
    title: string
    message: string
    confirmLabel?: string
    variant?: 'danger' | 'warning'
}

export default function ConfirmModal({
    open, onClose, onConfirm, title, message,
    confirmLabel = 'DELETE', variant = 'danger',
}: ConfirmModalProps) {
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        setLoading(true)
        try {
            await onConfirm()
            onClose()
        } finally {
            setLoading(false)
        }
    }

    const btnClass = variant === 'danger'
        ? 'bg-[#EF4444] hover:bg-[#dc2626] text-white'
        : 'bg-[#F59E0B] hover:bg-[#d97706] text-black'

    return (
        <Modal open={open} onClose={onClose} title={title}>
            <div className="flex items-start gap-3 mb-6">
                <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${variant === 'danger' ? 'text-[#EF4444]' : 'text-[#F59E0B]'}`} />
                <p className="text-sm text-[#A1A1AA]">{message}</p>
            </div>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="text-[#A1A1AA] font-mono px-4 py-2 rounded-sm hover:text-[#F8FAFC] hover:bg-[#111113] transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`font-mono font-bold px-4 py-2 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${btnClass}`}
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            PROCESSING...
                        </span>
                    ) : confirmLabel}
                </button>
            </div>
        </Modal>
    )
}
