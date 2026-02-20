export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            public_events: { Row: any, Insert: any, Update: any, Relationships: [] }
            posts: { Row: any, Insert: any, Update: any, Relationships: [] }
            ctf_challenges: { Row: any, Insert: any, Update: any, Relationships: [] }
            documents: { Row: any, Insert: any, Update: any, Relationships: [] }
            members: {
                Row: {
                    id: string
                    user_id: string
                    full_name: string | null
                    email: string
                    role: 'member' | 'bod' | 'admin' | 'superadmin'
                    status: 'pending' | 'approved' | 'rejected'
                    club_post: string | null
                    avatar_url: string | null
                    bio: string | null
                    points: number
                    student_id: string | null
                    github_url: string | null
                    linkedin_url: string | null
                    program: string | null
                    created_at: string
                    deactivation_requested_at: string | null
                    deactivation_reason: string | null
                }
                Insert: {
                    id?: string
                    user_id?: string
                    full_name?: string | null
                    email: string
                    role?: 'member' | 'bod' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected'
                    club_post?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    points?: number
                    student_id?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    program?: string | null
                    created_at?: string
                    deactivation_requested_at?: string | null
                    deactivation_reason?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    full_name?: string | null
                    email?: string
                    role?: 'member' | 'bod' | 'admin' | 'superadmin'
                    status?: 'pending' | 'approved' | 'rejected'
                    club_post?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    points?: number
                    student_id?: string | null
                    github_url?: string | null
                    linkedin_url?: string | null
                    program?: string | null
                    created_at?: string
                    deactivation_requested_at?: string | null
                    deactivation_reason?: string | null
                }
                Relationships: []
            }
            skill_endorsements: {
                Row: {
                    id: string
                    member_id: string
                    endorsed_by: string
                    skill: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    endorsed_by: string
                    skill: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    endorsed_by?: string
                    skill?: string
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "skill_endorsements_member_id_fkey"
                        columns: ["member_id"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "skill_endorsements_endorsed_by_fkey"
                        columns: ["endorsed_by"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    }
                ]
            }
            superadmin_sessions: {
                Row: {
                    id: string
                    member_id: string
                    ip_address: string | null
                    user_agent: string | null
                    created_at: string
                    last_seen: string
                }
                Insert: {
                    id?: string
                    member_id: string
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                    last_seen?: string
                }
                Update: {
                    id?: string
                    member_id?: string
                    ip_address?: string | null
                    user_agent?: string | null
                    created_at?: string
                    last_seen?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "superadmin_sessions_member_id_fkey"
                        columns: ["member_id"]
                        isOneToOne: false
                        referencedRelation: "members"
                        referencedColumns: ["id"]
                    }
                ]
            }
            audit_logs: {
                Row: {
                    id: string
                    actor_id: string | null
                    action: string
                    target_id: string | null
                    details: Json | null
                    created_at: string
                    ip_address: string | null
                }
                Insert: {
                    id?: string
                    actor_id?: string | null
                    action: string
                    target_id?: string | null
                    details?: Json | null
                    created_at?: string
                    ip_address?: string | null
                }
                Update: {
                    id?: string
                    actor_id?: string | null
                    action?: string
                    target_id?: string | null
                    details?: Json | null
                    created_at?: string
                    ip_address?: string | null
                }
                Relationships: []
            }
        }
    }
}
