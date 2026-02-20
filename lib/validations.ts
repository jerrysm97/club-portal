// lib/validations.ts — All Zod schemas for IIMS IT Club Portal (CONTEXT.md §12, §13, §14)
import { z } from 'zod'

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Step 1: Magic link send — just needs a valid email */
export const magicLinkSchema = z.object({
    email: z.string().email('Enter a valid email address').toLowerCase().trim(),
})

/** Step 2: Profile completion after first login */
export const registerSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
    student_id: z.string().min(3, 'Student ID must be at least 3 characters').max(20).trim(),
    program: z.enum(['BCS', 'BBUS', 'BIHM', 'MBA', 'Other']),
    intake: z.string().max(20).optional(),
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().max(50)).max(10).default([]),
    // club_post is NOT in schema — hardcoded server-side as 'General Member' (Security Fix #6)
})

/** Profile update (own profile) */
export const profileUpdateSchema = z.object({
    full_name: z.string().min(2).max(100).trim().optional(),
    bio: z.string().max(500).optional(),
    skills: z.array(z.string().max(50)).max(10).optional(),
    github_url: z.string().url().startsWith('https://github.com/').optional().or(z.literal('')),
    linkedin_url: z.string().url().startsWith('https://linkedin.com/').optional().or(z.literal('')),
})

// ─── Posts ────────────────────────────────────────────────────────────────────

export const createPostSchema = z.object({
    title: z.string().max(200).optional(),
    content: z.string().min(1, 'Post cannot be empty').max(10000),
    type: z.enum(['post', 'announcement', 'resource', 'project']).default('post'),
})

export const updatePostSchema = createPostSchema.partial()

// ─── Admin: Member Management ─────────────────────────────────────────────────

export const memberStatusSchema = z.object({
    member_id: z.string().uuid('Invalid member ID'),
    status: z.enum(['approved', 'rejected', 'banned']),
    reason: z.string().max(500).optional(),
})

export const memberRoleSchema = z.object({
    member_id: z.string().uuid('Invalid member ID'),
    role: z.enum(['member', 'admin', 'superadmin']),
})

export const memberClubPostSchema = z.object({
    member_id: z.string().uuid('Invalid member ID'),
    club_post: z.enum([
        'General Member', 'Web Development', 'Cybersecurity',
        'AI & Machine Learning', 'Mobile Development', 'Cloud & DevOps',
        'Data Science', 'Open Source', 'Graphic Design'
    ]),
})

// ─── Admin: Events ────────────────────────────────────────────────────────────

export const createEventSchema = z.object({
    title: z.string().min(2).max(200).trim(),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens').min(2).max(100),
    description: z.string().min(10, 'Description must be at least 10 characters').max(10000),
    short_desc: z.string().max(200).optional(),
    event_date: z.string().datetime({ message: 'Invalid event date' }),
    end_date: z.string().datetime().optional(),
    location: z.string().max(300).optional(),
    meeting_link: z.string().url().optional().or(z.literal('')),
    type: z.enum(['workshop', 'ctf', 'hackathon', 'seminar', 'meetup', 'competition', 'other']).default('workshop'),
    max_attendees: z.number().int().positive().optional(),
    is_published: z.boolean().default(false),
})

export const updateEventSchema = createEventSchema.partial()

// ─── Admin: CTF ───────────────────────────────────────────────────────────────

export const createChallengeSchema = z.object({
    title: z.string().min(2).max(200).trim(),
    description: z.string().min(10).max(10000),
    category: z.enum(['web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']),
    difficulty: z.enum(['easy', 'medium', 'hard', 'insane']),
    points: z.number().int().min(1).max(10000),
    flag: z.string().min(1, 'Flag is required').max(500), // raw flag — hashed server-side
    flag_format: z.string().max(50).default('IIMS{...}'),
    hint: z.string().max(500).optional(),
    is_active: z.boolean().default(false),
})

/** Flag submission — used in /api/ctf/submit */
export const ctfSubmitSchema = z.object({
    challenge_id: z.string().uuid('Invalid challenge ID'),
    flag: z.string().min(1, 'Flag is required').max(500),
})

// ─── Admin: Documents ─────────────────────────────────────────────────────────

export const createDocumentSchema = z.object({
    title: z.string().min(2).max(200).trim(),
    description: z.string().max(1000).optional(),
    file_url: z.string().url('Invalid file URL'),
    file_size: z.number().int().positive().max(52428800, 'File too large (max 50MB)'),
    file_type: z.string().max(100).optional(),
    category: z.enum(['general', 'study-material', 'writeup', 'presentation', 'report', 'project', 'other']).default('general'),
    is_public: z.boolean().default(false),
})

// ─── Admin: Broadcast ─────────────────────────────────────────────────────────

export const broadcastSchema = z.object({
    title: z.string().min(2).max(200).trim(),
    body: z.string().max(500).optional(),
    link: z.string().url().optional().or(z.literal('')),
})

// ─── Admin: Settings ─────────────────────────────────────────────────────────

export const siteSettingSchema = z.object({
    key: z.string().regex(/^[a-z_]+$/).min(1),
    value: z.string().min(0).max(1000),
})

// ─── Contact ──────────────────────────────────────────────────────────────────

export const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
    email: z.string().email('Enter a valid email address').trim(),
    subject: z.string().min(5, 'Subject must be at least 5 characters').max(200).trim(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(3000).trim(),
})

// ─── Messages ─────────────────────────────────────────────────────────────────

export const sendMessageSchema = z.object({
    conversation_id: z.string().uuid(),
    content: z.string().min(1).max(5000),
})

export const createConversationSchema = z.object({
    recipient_id: z.string().uuid('Invalid recipient'),
})

// ─── RSVP ─────────────────────────────────────────────────────────────────────

export const rsvpSchema = z.object({
    event_id: z.string().uuid('Invalid event ID'),
    status: z.enum(['going', 'maybe', 'not_going']),
})

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type CreateChallengeInput = z.infer<typeof createChallengeSchema>
export type CTFSubmitInput = z.infer<typeof ctfSubmitSchema>
export type MemberStatusInput = z.infer<typeof memberStatusSchema>
export type MemberRoleInput = z.infer<typeof memberRoleSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type BroadcastInput = z.infer<typeof broadcastSchema>
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>
export type RSVPInput = z.infer<typeof rsvpSchema>
