// lib/validations.ts — Zod schemas for all API routes (CONTEXT §18)
import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),
    confirm_password: z.string(),
    student_id: z.string().optional(),
    club_post: z.string().optional(),
}).refine(data => data.password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
})

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
})

// ─── Admin ────────────────────────────────────────────────────────────────────

export const approveSchema = z.object({
    member_id: z.string().uuid(),
    status: z.enum(['approved', 'rejected', 'banned']),
    role: z.enum(['member', 'bod', 'admin', 'superadmin']).optional(),
    club_post: z.string().max(100).optional(),
})

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(3).max(200),
    message: z.string().min(10).max(5000),
})

// ─── CTF ──────────────────────────────────────────────────────────────────────

export const ctfSubmitSchema = z.object({
    challenge_id: z.string().uuid(),
    flag: z.string().min(1, 'Flag is required').max(500),
})

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ApproveInput = z.infer<typeof approveSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type CTFSubmitInput = z.infer<typeof ctfSubmitSchema>
