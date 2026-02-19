// components/ui/Pagination.tsx — Page navigation
'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-sm text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111113] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="font-mono text-sm text-[#A1A1AA]">
                {page} <span className="text-[#27272A]">/</span> {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-sm text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111113] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}
