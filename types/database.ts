// types/database.ts — Database type definitions for IIMS IT Club Portal
// Based on CONTEXT.md §7 schema. Ideally auto-generated via `supabase gen types typescript`.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            members: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string
                    email: string
                    student_id: string | null
                    program: 'BCS' | 'BBUS' | 'BIHM' | 'MBA' | 'Other' | null
                    intake: string | null
                    role: 'member' | 'admin' | 'superadmin'
                    status: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post: string
                    bio: string | null
                    avatar_url: string | null
                    github_url: string | null
                    linkedin_url: string | null
                    skills: string[]
                    points: number
                    joined_at: string
                    approved_at: string | null
                    approved_by: string | null
                    ban_reason: string | null
                    reject_reason: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    full_name: string
                    email: string
                    student_id?: string | null
                    program?: 'BCS' | 'BBUS' | 'BIHM' | 'MBA' | 'Other' | null
                    intake?: string | null
                    role?: 'member' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post?: string
                    bio?: string | null
                    avatar_url?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    skills?: string[]
                    points?: number
                    joined_at?: string
                    approved_at?: string | null
                    approved_by?: string | null
                    ban_reason?: string | null
                    reject_reason?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string
                    email?: string
                    student_id?: string | null
                    program?: 'BCS' | 'BBUS' | 'BIHM' | 'MBA' | 'Other' | null
                    intake?: string | null
                    role?: 'member' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected' | 'banned'
                    club_post?: string
                    bio?: string | null
                    avatar_url?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    skills?: string[]
                    points?: number
                    joined_at?: string
                    approved_at?: string | null
                    approved_by?: string | null
                    ban_reason?: string | null
                    reject_reason?: string | null
                }
                Relationships: []
            }
            posts: {
                Row: {
                    id: string
                    author_id: string
                    title: string | null
                    content: string
                    type: 'post' | 'announcement' | 'resource' | 'project'
                    is_pinned: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    author_id: string
                    title?: string | null
                    content: string
                    type?: 'post' | 'announcement' | 'resource' | 'project'
                    is_pinned?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    author_id?: string
                    title?: string | null
                    content?: string
                    type?: 'post' | 'announcement' | 'resource' | 'project'
                    is_pinned?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            post_reactions: {
                Row: {
                    id: string
                    post_id: string
                    member_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    member_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    member_id?: string
                    created_at?: string
                }
                Relationships: []
            }
            post_comments: {
                Row: {
                    id: string
                    post_id: string
                    author_id: string
                    content: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    author_id: string
                    content: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    author_id?: string
                    content?: string
                    created_at?: string
                }
                Relationships: []
            }
            conversations: {
                Row: {
                    id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    created_at?: string
                    updated_at?: string
                }
                Relationships: []
            }
            conversation_participants: {
                Row: {
                    conversation_id: string
                    member_id: string
                    last_read_at: string
                }
                Insert: {
                    conversation_id: string
                    member_id: string
                    last_read_at?: string
                }
                Update: {
                    conversation_id?: string
                    member_id?: string
                    last_read_at?: string
                }
                Relationships: []
            }
            messages: {
                Row: {
                    id: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_deleted: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    conversation_id: string
                    sender_id: string
                    content: string
                    is_deleted?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    conversation_id?: string
                    sender_id?: string
                    content?: string
                    is_deleted?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            notifications: {
                Row: {
                    id: string
                    recipient_id: string
                    sender_id: string | null
                    type: string
                    title: string
                    body: string | null
                    link: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    recipient_id: string
                    sender_id?: string | null
                    type: string
                    title: string
                    body?: string | null
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    recipient_id?: string
                    sender_id?: string | null
                    type?: string
                    title?: string
                    body?: string | null
                    link?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            documents: {
                Row: {
                    id: string
                    uploader_id: string
                    title: string
                    description: string | null
                    file_url: string
                    file_size: number | null
                    file_type: string | null
                    category: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'project' | 'other'
                    is_public: boolean
                    download_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    uploader_id: string
                    title: string
                    description?: string | null
                    file_url: string
                    file_size?: number | null
                    file_type?: string | null
                    category?: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'project' | 'other'
                    is_public?: boolean
                    download_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    uploader_id?: string
                    title?: string
                    description?: string | null
                    file_url?: string
                    file_size?: number | null
                    file_type?: string | null
                    category?: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'project' | 'other'
                    is_public?: boolean
                    download_count?: number
                    created_at?: string
                }
                Relationships: []
            }
            public_events: {
                Row: {
                    id: string
                    created_by: string | null
                    title: string
                    slug: string
                    description: string
                    short_desc: string | null
                    event_date: string
                    end_date: string | null
                    location: string | null
                    meeting_link: string | null
                    cover_image_url: string | null
                    type: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees: number | null
                    is_published: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    created_by?: string | null
                    title: string
                    slug: string
                    description: string
                    short_desc?: string | null
                    event_date: string
                    end_date?: string | null
                    location?: string | null
                    meeting_link?: string | null
                    cover_image_url?: string | null
                    type?: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees?: number | null
                    is_published?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_by?: string | null
                    title?: string
                    slug?: string
                    description?: string
                    short_desc?: string | null
                    event_date?: string
                    end_date?: string | null
                    location?: string | null
                    meeting_link?: string | null
                    cover_image_url?: string | null
                    type?: 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'
                    max_attendees?: number | null
                    is_published?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            event_rsvps: {
                Row: {
                    id: string
                    event_id: string
                    member_id: string
                    status: 'going' | 'maybe' | 'not_going'
                    created_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    member_id: string
                    status?: 'going' | 'maybe' | 'not_going'
                    created_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    member_id?: string
                    status?: 'going' | 'maybe' | 'not_going'
                    created_at?: string
                }
                Relationships: []
            }
            ctf_challenges: {
                Row: {
                    id: string
                    created_by: string | null
                    title: string
                    description: string
                    category: 'web' | 'forensics' | 'crypto' | 'pwn' | 'reversing' | 'osint' | 'misc'
                    difficulty: 'easy' | 'medium' | 'hard' | 'insane'
                    points: number
                    flag_hash: string
                    flag_format: string | null
                    hint: string | null
                    file_url: string | null
                    is_active: boolean
                    solves_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    created_by?: string | null
                    title: string
                    description: string
                    category: 'web' | 'forensics' | 'crypto' | 'pwn' | 'reversing' | 'osint' | 'misc'
                    difficulty: 'easy' | 'medium' | 'hard' | 'insane'
                    points: number
                    flag_hash: string
                    flag_format?: string | null
                    hint?: string | null
                    file_url?: string | null
                    is_active?: boolean
                    solves_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    created_by?: string | null
                    title?: string
                    description?: string
                    category?: 'web' | 'forensics' | 'crypto' | 'pwn' | 'reversing' | 'osint' | 'misc'
                    difficulty?: 'easy' | 'medium' | 'hard' | 'insane'
                    points?: number
                    flag_hash?: string
                    flag_format?: string | null
                    hint?: string | null
                    file_url?: string | null
                    is_active?: boolean
                    solves_count?: number
                    created_at?: string
                }
                Relationships: []
            }
            ctf_solves: {
                Row: {
                    id: string
                    challenge_id: string
                    member_id: string
                    solved_at: string
                }
                Insert: {
                    id?: string
                    challenge_id: string
                    member_id: string
                    solved_at?: string
                }
                Update: {
                    id?: string
                    challenge_id?: string
                    member_id?: string
                    solved_at?: string
                }
                Relationships: []
            }
            gallery_images: {
                Row: {
                    id: string
                    uploader_id: string | null
                    url: string
                    caption: string | null
                    event_id: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    uploader_id?: string | null
                    url: string
                    caption?: string | null
                    event_id?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    uploader_id?: string | null
                    url?: string
                    caption?: string | null
                    event_id?: string | null
                    created_at?: string
                }
                Relationships: []
            }
            contact_messages: {
                Row: {
                    id: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    ip_hash: string | null
                    is_read: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    email: string
                    subject: string
                    message: string
                    ip_hash?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    email?: string
                    subject?: string
                    message?: string
                    ip_hash?: string | null
                    is_read?: boolean
                    created_at?: string
                }
                Relationships: []
            }
            audit_logs: {
                Row: {
                    id: string
                    admin_id: string | null
                    action: string
                    target_id: string | null
                    meta: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    admin_id?: string | null
                    action: string
                    target_id?: string | null
                    meta?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    admin_id?: string | null
                    action?: string
                    target_id?: string | null
                    meta?: Json
                    created_at?: string
                }
                Relationships: []
            }
            site_settings: {
                Row: {
                    key: string
                    value: string
                    updated_by: string | null
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: string
                    updated_by?: string | null
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: string
                    updated_by?: string | null
                    updated_at?: string
                }
                Relationships: []
            }
        }
        Views: Record<string, never>
        Functions: Record<string, never>
        Enums: Record<string, never>
        CompositeTypes: Record<string, never>
    }
}
