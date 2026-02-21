// components/ui/ConfirmModal.tsx — IIMS Collegiate confirmation dialog
'use client'
import Modal from './Modal'

interface ConfirmModalProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    title?: string
    message: string
    confirmLabel?: string
    variant?: 'danger' | 'primary'
    loading?: boolean
}

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    message,
    confirmLabel = 'Confirm',
    variant = 'danger',
    loading = false,
}: ConfirmModalProps) {
    const confirmClasses =
        variant === 'danger'
            ? 'bg-[#C3161C] hover:bg-[#A31217] text-white'
            : 'bg-[#58151C] hover:bg-[#431015] text-white'

    return (
        <Modal open={open} onClose={onClose} title={title} size="sm">
            <p className="text-[#374151] text-sm leading-relaxed">{message}</p>
            <div className="mt-6 flex gap-3 justify-end">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 rounded-sm text-sm font-medium text-[#374151] bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-50 ${confirmClasses}`}
                >
                    {loading ? 'Processing…' : confirmLabel}
                </button>
            </div>
        </Modal>
    )
}
