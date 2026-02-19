// lib/types.ts
// TypeScript types that match our Supabase database tables.
// Use these everywhere instead of 'any' to get autocomplete and catch errors early.

// Matches the "members" table
export type Member = {
    id: string
    email: string
    name: string | null
    role: 'admin' | 'member'
    status: 'pending' | 'approved' | 'rejected'
    avatar_url: string | null
    bio: string | null
    created_at: string
}

// Matches the "posts" table
export type Post = {
    id: string
    title: string
    content: string
    author_id: string | null
    pinned: boolean
    created_at: string
    // When we join with the members table, we get the author's info
    author?: Member
}

// Matches the "documents" table
export type Document = {
    id: string
    title: string
    file_url: string
    file_type: 'pdf' | 'docx' | 'doc' | null
    uploaded_by: string | null
    created_at: string
    // When we join with the members table, we get the uploader's info
    uploader?: Member
}

// Matches the "comments" table
export type Comment = {
    id: string
    post_id: string
    author_id: string | null
    content: string
    created_at: string
    // When we join with the members table, we get the author's info
    author?: Member
}
