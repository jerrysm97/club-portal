// components/ui/Skeleton.tsx — Loading placeholder
export default function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`bg-[#27272A] animate-pulse rounded-sm ${className}`} />
}
