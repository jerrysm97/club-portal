// lib/validations.ts — Zod schemas for all forms
import { z } from 'zod'

export const contactFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

export const registrationSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    student_id: z.string().min(1, 'Student ID is required').max(20),
    bio: z.string().max(500).optional(),
    skills: z.array(z.string()).optional(),
})

export const profileSchema = z.object({
    full_name: z.string().min(2).max(100),
    bio: z.string().max(500).optional(),
    github_url: z.string().url().optional().or(z.literal('')),
    linkedin_url: z.string().url().optional().or(z.literal('')),
    skills: z.array(z.string()).optional(),
})

export const postSchema = z.object({
    title: z.string().max(200).optional(),
    content: z.string().min(1, 'Content is required').max(10000),
    type: z.enum(['post', 'announcement', 'resource']).default('post'),
})

export const eventSchema = z.object({
    title: z.string().min(2).max(200),
    slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().min(10).max(5000),
    short_desc: z.string().max(160).optional(),
    event_date: z.string().min(1, 'Event date is required'),
    end_date: z.string().optional(),
    location: z.string().max(200).optional(),
    meeting_link: z.string().url().optional().or(z.literal('')),
    type: z.enum(['workshop', 'ctf', 'seminar', 'meetup', 'competition', 'other']).default('workshop'),
    max_attendees: z.number().int().positive().optional(),
    is_published: z.boolean().default(false),
})

export const ctfChallengeSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().min(10).max(5000),
    category: z.enum(['web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    points: z.number().int().positive().default(100),
    flag: z.string().min(1, 'Flag is required'),
    flag_format: z.string().default('IIMS{...}'),
    hint: z.string().max(500).optional(),
    is_active: z.boolean().default(false),
})

export const flagSubmitSchema = z.object({
    challengeId: z.string().uuid(),
    flag: z.string().min(1, 'Flag is required'),
})

export const documentSchema = z.object({
    title: z.string().min(2).max(200),
    description: z.string().max(500).optional(),
    category: z.enum(['general', 'study-material', 'writeup', 'presentation', 'report', 'other']).default('general'),
})

export type ContactFormData = z.infer<typeof contactFormSchema>
export type RegistrationData = z.infer<typeof registrationSchema>
export type ProfileData = z.infer<typeof profileSchema>
export type PostData = z.infer<typeof postSchema>
export type EventData = z.infer<typeof eventSchema>
export type CTFChallengeData = z.infer<typeof ctfChallengeSchema>
export type FlagSubmitData = z.infer<typeof flagSubmitSchema>
export type DocumentData = z.infer<typeof documentSchema>
