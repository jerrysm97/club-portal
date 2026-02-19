// components/ui/Skeleton.tsx — IIMS Collegiate loading skeleton
import { cn } from '@/lib/utils'

interface SkeletonProps {
    className?: string
}

export default function Skeleton({ className }: SkeletonProps) {
    return (
        <div
            className={cn('animate-pulse rounded-md bg-[#F3F4F6]', className)}
            aria-hidden="true"
        />
    )
}

export function SkeletonCard() {
    return (
        <div className="iims-card p-5 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
        </div>
    )
}
