// lib/utils.ts — Utility functions
import { clsx, type ClassValue } from 'clsx'
import { format, formatDistanceToNow } from 'date-fns'
import { createHash } from 'crypto'

/** Merge Tailwind classes (clsx-only, no tailwind-merge needed) */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

/** Format a date string to "Jan 15, 2025" */
export function formatDate(date: string | Date | null | undefined): string {
    if (!date) return 'TBD'
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'TBD'
    return format(d, 'MMM d, yyyy')
}

/** Format a date to relative time "2 hours ago" */
export function timeAgo(date: string | Date): string {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/** Truncate text with ellipsis */
export function truncate(str: string, length: number = 60): string {
    if (str.length <= length) return str
    return str.slice(0, length).trimEnd() + '…'
}

/** SHA256 hash a CTF flag for comparison */
export function hashFlag(flag: string): string {
    return createHash('sha256').update(flag.trim()).digest('hex')
}

/** Format bytes to human readable string */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
