import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
    usePathname: () => '',
    redirect: vi.fn(),
}))

// Mock Supabase Server Client
vi.mock('@/lib/supabase-server', () => ({
    createServerClient: vi.fn(() => ({
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
        })),
    })),
}))

// Mock Auth
vi.mock('@/lib/auth', () => ({
    getSession: vi.fn(async () => ({ user: { id: 'test-user-123' } })),
    getMember: vi.fn(async () => ({
        id: 'member-123',
        role: 'member',
        full_name: 'Test Member',
        status: 'approved'
    })),
}))
