// types/database.ts
// TypeScript types for all Supabase tables — V6.0

export interface Member {
    id: string
    email: string
    name: string | null
    role: 'admin' | 'member'
    status: 'pending' | 'approved' | 'rejected'
    avatar_url: string | null
    bio: string | null
    created_at: string
}

export interface Post {
    id: string
    title: string
    content: string
    author_id: string | null
    pinned: boolean
    is_public: boolean
    created_at: string
    members?: Pick<Member, 'name' | 'email'> | null
}

export interface Document {
    id: string
    title: string
    file_url: string
    file_type: 'pdf' | 'docx' | 'doc' | null
    uploaded_by: string | null
    created_at: string
    members?: Pick<Member, 'name' | 'email'> | null
}

export interface PublicEvent {
    id: string
    title: string
    event_date: string
    location: string | null
    description: string | null
    type: 'Workshop' | 'CTF' | 'Seminar' | 'Competition' | 'Other'
    status: 'upcoming' | 'past'
    image_url: string | null
    created_at: string
}

export interface GalleryImage {
    id: string
    image_url: string
    caption: string | null
    sort_order: number
    created_at: string
}

export interface TeamMember {
    id: string
    name: string
    role: string
    image_url: string | null
    sort_order: number
    created_at: string
}

export interface SiteSettings {
    id: string
    about_text: string | null
    stat_members: string | null
    stat_events: string | null
    stat_competitions: string | null
    stat_partners: string | null
    contact_email: string | null
    instagram_url: string | null
    facebook_url: string | null
    github_url: string | null
    updated_at: string
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
