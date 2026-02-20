// types/database.ts — IIMS IT Club Portal — v4.0
// Matches CONTEXT.md §7 schema exactly.
// Run `supabase gen types typescript > types/database.ts` after any schema change.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          club_post: 'General Member' | 'Web Development' | 'Cybersecurity' | 'AI & Machine Learning' | 'Mobile Development' | 'Cloud & DevOps' | 'Data Science' | 'Open Source' | 'Graphic Design'
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
          club_post?: 'General Member' | 'Web Development' | 'Cybersecurity' | 'AI & Machine Learning' | 'Mobile Development' | 'Cloud & DevOps' | 'Data Science' | 'Open Source' | 'Graphic Design'
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
          full_name?: string
          student_id?: string | null
          program?: 'BCS' | 'BBUS' | 'BIHM' | 'MBA' | 'Other' | null
          intake?: string | null
          role?: 'member' | 'admin' | 'superadmin'
          status?: 'pending' | 'approved' | 'rejected' | 'banned'
          club_post?: 'General Member' | 'Web Development' | 'Cybersecurity' | 'AI & Machine Learning' | 'Mobile Development' | 'Cloud & DevOps' | 'Data Science' | 'Open Source' | 'Graphic Design'
          bio?: string | null
          avatar_url?: string | null
          github_url?: string | null
          linkedin_url?: string | null
          skills?: string[]
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
          title?: string | null
          content?: string
          type?: 'post' | 'announcement' | 'resource' | 'project'
          is_pinned?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'post_reactions_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_reactions_member_id_fkey'
            columns: ['member_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          content?: string
        }
        Relationships: [
          {
            foreignKeyName: 'post_comments_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'post_comments_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          last_read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'conversation_participants_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'conversation_participants_member_id_fkey'
            columns: ['member_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          is_deleted?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'messages_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          recipient_id: string
          sender_id: string | null
          type: 'new_message' | 'new_post' | 'post_reaction' | 'post_comment' | 'event_reminder' | 'member_approved' | 'member_rejected' | 'ctf_new_challenge' | 'ctf_solved' | 'announcement'
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
          type: 'new_message' | 'new_post' | 'post_reaction' | 'post_comment' | 'event_reminder' | 'member_approved' | 'member_rejected' | 'ctf_new_challenge' | 'ctf_solved' | 'announcement'
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_recipient_id_fkey'
            columns: ['recipient_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
      }
      documents: {
        Row: {
          id: string
          uploader_id: string
          title: string
          description: string | null
          file_url: string
          file_size: number
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
          file_size: number
          file_type?: string | null
          category?: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'project' | 'other'
          is_public?: boolean
          download_count?: number
          created_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          category?: 'general' | 'study-material' | 'writeup' | 'presentation' | 'report' | 'project' | 'other'
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'documents_uploader_id_fkey'
            columns: ['uploader_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          status?: 'going' | 'maybe' | 'not_going'
        }
        Relationships: [
          {
            foreignKeyName: 'event_rsvps_event_id_fkey'
            columns: ['event_id']
            isOneToOne: false
            referencedRelation: 'public_events'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'event_rsvps_member_id_fkey'
            columns: ['member_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          flag_hash: string  // SHA-256 hex digest ONLY — NEVER expose client-side
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
        Update: Record<string, never>
        Relationships: [
          {
            foreignKeyName: 'ctf_solves_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'ctf_challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ctf_solves_member_id_fkey'
            columns: ['member_id']
            isOneToOne: false
            referencedRelation: 'members'
            referencedColumns: ['id']
          }
        ]
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
          caption?: string | null
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
          is_read?: boolean
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
        Update: Record<string, never>
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
          value?: string
          updated_by?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
