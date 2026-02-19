// types/database.ts — All Supabase table types (CONTEXT v2.0)

export interface Member {
    id: string
    user_id: string | null
    full_name: string
    email: string
    student_id: string | null
    role: 'member' | 'admin' | 'superadmin'
    status: 'pending' | 'approved' | 'rejected' | 'banned'
    bio: string | null
    avatar_url: string | null
    github_url: string | null
    linkedin_url: string | null
    skills: string[] | null
    points: number
    joined_at: string
    approved_at: string | null
    approved_by: string | null
    // backward compat (remove after rewrite)
    name?: string | null
}

export interface Post {
    id: string
    author_id: string
    title: string | null
    content: string
    type: 'post' | 'announcement' | 'resource'
    is_pinned: boolean
    created_at: string
    updated_at: string
    // Joined
    author?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
    reaction_count?: number
    comment_count?: number
    user_has_reacted?: boolean
    // backward compat (remove after rewrite)
    pinned?: boolean
    is_public?: boolean
    members?: { name: string | null; email: string } | null
}

export interface PostReaction {
    id: string
    post_id: string
    member_id: string
    created_at: string
}

export interface PostComment {
    id: string
    post_id: string
    author_id: string
    content: string
    created_at: string
    author?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface Conversation {
    id: string
    created_at: string
    updated_at: string
    // Joined
    participants?: Pick<Member, 'id' | 'full_name' | 'avatar_url'>[]
    last_message?: Pick<Message, 'content' | 'created_at'> | null
    unread_count?: number
}

export interface ConversationParticipant {
    conversation_id: string
    member_id: string
    last_read_at: string
}

export interface Message {
    id: string
    conversation_id: string
    sender_id: string
    content: string
    is_deleted: boolean
    created_at: string
    sender?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface Notification {
    id: string
    recipient_id: string
    sender_id: string | null
    type: 'new_message' | 'new_post' | 'post_reaction' | 'post_comment' | 'event_reminder' | 'member_approved' | 'member_rejected' | 'ctf_new_challenge' | 'ctf_solved' | 'announcement'
    title: string
    body: string | null
    link: string | null
    is_read: boolean
    created_at: string
    sender?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface Document {
    id: string
    uploader_id: string
    title: string
    description: string | null
    file_url: string
    file_size: number | null
    file_type: string | null
    category: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'other'
    is_public: boolean
    download_count: number
    created_at: string
    uploader?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface PublicEvent {
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
    type: 'workshop' | 'ctf' | 'seminar' | 'meetup' | 'competition' | 'other' | 'Workshop' | 'CTF' | 'Seminar' | 'Competition' | 'Other'
    max_attendees: number | null
    is_published: boolean
    created_at: string
    // backward compat aliases (remove after Phase 2 rewrite)
    image_url?: string | null
    status?: 'upcoming' | 'past'
}

export interface EventRsvp {
    id: string
    event_id: string
    member_id: string
    status: 'going' | 'maybe' | 'not_going'
    created_at: string
    member?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface CTFChallenge {
    id: string
    created_by: string | null
    title: string
    description: string
    category: 'web' | 'forensics' | 'crypto' | 'pwn' | 'reversing' | 'osint' | 'misc'
    difficulty: 'easy' | 'medium' | 'hard' | 'insane'
    points: number
    flag_format: string
    hint: string | null
    file_url: string | null
    is_active: boolean
    solves_count: number
    created_at: string
    user_solved?: boolean
}

export interface CTFSolve {
    id: string
    challenge_id: string
    member_id: string
    solved_at: string
    member?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface GalleryImage {
    id: string
    uploader_id: string | null
    url: string
    caption: string | null
    event_id: string | null
    created_at: string
    // backward compat
    image_url?: string
    sort_order?: number
}

export interface ContactMessage {
    id: string
    name: string
    email: string
    subject: string
    message: string
    is_read: boolean
    created_at: string
}

export interface AuditLog {
    id: string
    admin_id: string | null
    action: string
    target_id: string | null
    meta: Record<string, unknown> | null
    ip_address: string | null
    created_at: string
    admin?: Pick<Member, 'id' | 'full_name'> | null
}

export interface SiteSetting {
    key: string
    value: string
    updated_at: string
}

// ─── Backward-compatible aliases (used by existing pages until Phase 2-3 rewrite) ───
export type TeamMember = {
    id: string; name: string; role: string; image_url: string | null;
    sort_order: number; created_at: string;
}
export type SiteSettings = {
    id: string; about_text: string | null; stat_members: string | null;
    stat_events: string | null; stat_competitions: string | null; stat_partners: string | null;
    contact_email: string | null; instagram_url: string | null; facebook_url: string | null;
    github_url: string | null; updated_at: string;
}
