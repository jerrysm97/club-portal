// components/ui/Pagination.tsx — IIMS Collegiate Link-Based Pagination
'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface PaginationProps {
    page: number
    totalPages: number
    baseUrl: string
    className?: string
}

export default function Pagination({
    page,
    totalPages,
    baseUrl,
    className,
}: PaginationProps) {
    if (totalPages <= 1) return null

    const prevPage = page > 1 ? page - 1 : 1
    const nextPage = page < totalPages ? page + 1 : totalPages

    return (
        <nav
            aria-label="Pagination"
            className={cn('flex items-center justify-center gap-4', className)}
        >
            <Link
                href={`${baseUrl}?page=${prevPage}`}
                className={cn(
                    "p-3 rounded-sm border border-gray-100 text-gray-500 transition-all shadow-sm bg-white",
                    page === 1 ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-[#58151C] hover:text-white hover:border-[#58151C]"
                )}
                aria-disabled={page === 1}
            >
                <ChevronLeft className="h-5 w-5" />
            </Link>

            <div className="px-6 py-2 bg-gray-50 rounded-sm border border-gray-100 shadow-inner">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Sector</span>
                <span className="text-sm font-poppins font-black text-[#58151C]">{page}</span>
                <span className="mx-2 text-gray-200">/</span>
                <span className="text-sm font-poppins font-black text-gray-400">{totalPages}</span>
            </div>

            <Link
                href={`${baseUrl}?page=${nextPage}`}
                className={cn(
                    "p-3 rounded-sm border border-gray-100 text-gray-500 transition-all shadow-sm bg-white",
                    page === totalPages ? "opacity-30 cursor-not-allowed pointer-events-none" : "hover:bg-[#58151C] hover:text-white hover:border-[#58151C]"
                )}
                aria-disabled={page === totalPages}
            >
                <ChevronRight className="h-5 w-5" />
            </Link>
        </nav>
    )
}
