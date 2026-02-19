// types/database.ts — CONTEXT.md v2.0 — Keep in sync with Supabase schema

// ─── Enums ────────────────────────────────────────────────────────────────────
export type MemberRole = 'member' | 'bod' | 'admin' | 'superadmin'
export type MemberStatus = 'pending' | 'approved' | 'rejected' | 'banned'
export type PostType = 'post' | 'announcement' | 'resource'
export type CTFCategory = 'web' | 'crypto' | 'forensics' | 'pwn' | 'reverse' | 'osint' | 'misc'
export type CTFDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type EventType = 'workshop' | 'ctf' | 'seminar' | 'meetup' | 'competition'

// ─── Core entities ────────────────────────────────────────────────────────────

export interface Member {
    id: string
    user_id: string
    full_name: string
    email: string
    student_id: string | null
    club_post: string          // e.g. "Vice President", "General Member"
    role: MemberRole
    status: MemberStatus
    bio: string | null
    avatar_url: string | null
    skills: string[]
    points: number
    joined_at: string
    updated_at: string
}

export interface Post {
    id: string
    author_id: string
    title: string | null
    content: string
    type: PostType
    is_pinned: boolean
    created_at: string
    updated_at: string
    // Joins
    author?: Pick<Member, 'id' | 'full_name' | 'avatar_url' | 'club_post'> | null
    reaction_count?: number
    comment_count?: number
    user_has_reacted?: boolean
}

export interface PostReaction {
    id: string
    post_id: string
    member_id: string
    emoji: string
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

// Direct messages — no conversation table (CONTEXT §3 schema)
export interface Message {
    id: string
    sender_id: string
    receiver_id: string
    content: string
    is_read: boolean
    created_at: string
    sender?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
    receiver?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

export interface Notification {
    id: string
    member_id: string          // recipient
    title: string
    body: string
    type: 'info' | 'success' | 'warning' | 'error'
    is_read: boolean
    link: string | null
    created_at: string
}

export interface Event {
    id: string
    created_by: string | null
    title: string
    slug: string
    description: string
    short_desc: string | null
    starts_at: string
    ends_at: string | null
    location: string | null
    meeting_link: string | null
    cover_image_url: string | null
    type: EventType
    max_attendees: number | null
    is_published: boolean
    created_at: string
}

export interface EventRsvp {
    id: string
    event_id: string
    member_id: string
    status: 'going' | 'maybe' | 'not_going'
    created_at: string
    member?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
}

// flag is NEVER returned to client — omit entirely from this interface
export interface CTFChallenge {
    id: string
    title: string
    description: string
    category: CTFCategory
    difficulty: CTFDifficulty
    points: number
    hints: string[]
    file_url: string | null
    is_active: boolean
    created_by: string | null
    created_at: string
    // client-side computed
    user_solved?: boolean
    solve_count?: number
}

export interface CTFSubmission {
    id: string
    challenge_id: string
    member_id: string
    is_correct: boolean
    points_awarded: number
    submitted_at: string
    member?: Pick<Member, 'id' | 'full_name' | 'avatar_url'> | null
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

// ─── Supabase generic Database type ───────────────────────────────────────────
export type Database = {
    public: {
        Tables: {
            members: { Row: Member; Insert: Partial<Member>; Update: Partial<Member> }
            posts: { Row: Post; Insert: Partial<Post>; Update: Partial<Post> }
            post_reactions: { Row: PostReaction; Insert: Partial<PostReaction>; Update: Partial<PostReaction> }
            post_comments: { Row: PostComment; Insert: Partial<PostComment>; Update: Partial<PostComment> }
            messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> }
            notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
            events: { Row: Event; Insert: Partial<Event>; Update: Partial<Event> }
            event_rsvps: { Row: EventRsvp; Insert: Partial<EventRsvp>; Update: Partial<EventRsvp> }
            ctf_challenges: { Row: CTFChallenge; Insert: Partial<CTFChallenge>; Update: Partial<CTFChallenge> }
            ctf_submissions: { Row: CTFSubmission; Insert: Partial<CTFSubmission>; Update: Partial<CTFSubmission> }
            documents: { Row: Document; Insert: Partial<Document>; Update: Partial<Document> }
        }
    }
}

// ─── Backward-compat aliases (remove after public page rewrite) ───────────────
/** @deprecated Use Event instead */
export type PublicEvent = Event & {
    event_date: string           // alias for starts_at
    image_url?: string | null    // alias for cover_image_url
}

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
