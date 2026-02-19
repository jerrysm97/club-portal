// types/database.ts
// TypeScript types for all Supabase tables

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
    // Joined fields
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

export interface Comment {
    id: string
    post_id: string
    author_id: string | null
    content: string
    created_at: string
    members?: Pick<Member, 'name' | 'email'> | null
}
