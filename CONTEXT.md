# CONTEXT.md — IIMS Cybersecurity Club Portal
> **Version:** 2.0.0 | **Architecture:** Production-Ready (Industry Standard)
> Single source of truth for all contributors and AI sessions.

---

## TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [Project Overview & Feature Map](#2-project-overview--feature-map)
3. [Tech Stack](#3-tech-stack)
4. [Design System — Stealth Terminal](#4-design-system--stealth-terminal)
5. [Folder Structure](#5-folder-structure)
6. [Environment Variables](#6-environment-variables)
7. [Complete Database Schema](#7-complete-database-schema)
8. [Supabase Storage Buckets](#8-supabase-storage-buckets)
9. [Row-Level Security (RLS) Policies](#9-row-level-security-rls-policies)
10. [Authentication & Middleware](#10-authentication--middleware)
11. [Feature Specifications](#11-feature-specifications)
12. [Admin Panel Specification](#12-admin-panel-specification)
13. [API Routes Reference](#13-api-routes-reference)
14. [Real-Time Features](#14-real-time-features-supabase-realtime)
15. [Email Templates](#15-email-templates-resend)
16. [Coding Rules & Standards](#16-coding-rules--standards)
17. [Performance & Scalability Rules](#17-performance--scalability-rules)
18. [Security Checklist](#18-security-checklist)
19. [Quick Reference — DO / DON'T](#19-quick-reference--do--dont)

---

## 1. PROJECT IDENTITY

| Field | Value |
|---|---|
| Club Name | IIMS Cybersecurity Club |
| College | IIMS College |
| Club Email | cybersec@iimscollege.edu.np |
| Project Folder | `iims-cyber-club` |
| Domain Structure | Single domain — portal at `/portal/*` |
| Architecture Level | Production-Ready (Industry Standard) |
| Design Language | Stealth Terminal (Minimalist Cyber — Dark Only) |

---

## 2. PROJECT OVERVIEW & FEATURE MAP

One Next.js 14 project. Two experiences. One domain.

### 2.1 Public Website (`/`) — Anyone on the internet

| Page | Route | Description |
|---|---|---|
| Homepage | `/` | Hero, club intro, stats, featured events |
| About | `/about` | Team, mission, club history, gallery |
| Events | `/events` | Public event listings |
| Contact | `/contact` | Contact form (Resend-powered) |

> All content is 100% data-driven — managed entirely via the Admin Portal.

### 2.2 Private Member Portal (`/portal/*`) — Approved members only

| Feature | Route | Access |
|---|---|---|
| Login | `/portal/login` | Public |
| Pending Approval | `/portal/pending` | Registered but unapproved |
| Dashboard | `/portal/dashboard` | Members |
| Post Feed | `/portal/feed` | Members |
| Direct Messages | `/portal/messages` | Members |
| Direct Message Thread | `/portal/messages/[conversationId]` | Members |
| Notifications | `/portal/notifications` | Members |
| Documents | `/portal/documents` | Members |
| Events (Portal) | `/portal/events` | Members |
| Event Detail + RSVP | `/portal/events/[id]` | Members |
| CTF Challenges | `/portal/ctf` | Members |
| CTF Challenge Detail | `/portal/ctf/[challengeId]` | Members |
| Leaderboard | `/portal/leaderboard` | Members |
| Own Profile | `/portal/profile` | Members |
| Member Profile View | `/portal/members/[id]` | Members |
| Admin Panel | `/portal/admin` | Admins only |

---

## 3. TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 14 (App Router) | Server Components by default |
| Language | TypeScript (strict) | No plain `.js` files ever |
| Styling | Tailwind CSS | Arbitrary values for exact hex colors |
| Database | Supabase (PostgreSQL) | All data storage |
| Auth | Supabase Magic Link | Email-only, no passwords |
| Real-Time | Supabase Realtime | DMs, notifications, live feed reactions |
| File Storage | Supabase Storage | 5 buckets (see Section 8) |
| Email | Resend | Magic links, contact form, notification emails |
| Hosting | Vercel | Edge functions supported |
| Markdown | `react-markdown` + `remark-gfm` | Post/event descriptions |
| Notifications UI | Custom `Toast.tsx` | Non-blocking, bottom-right |
| Date Handling | `date-fns` | Formatting, relative time display |
| Form Validation | `zod` | Schema validation for all forms |
| Icons | `lucide-react` | Only icon library permitted |

---

## 4. DESIGN SYSTEM — STEALTH TERMINAL

> **CRITICAL RULE:** This design language applies to the **ENTIRE project** — public site, member portal, and admin panel. Do **NOT** inject default white/indigo SaaS themes. No `bg-white`. No `border-gray-200`. No Tailwind gray defaults.

### 4.1 Typography

| Font | Usage | Weights |
|---|---|---|
| **JetBrains Mono** | Headings, section labels, code, terminal outputs, all buttons | 400, 700 |
| **Inter** | Body text, paragraphs, long-form descriptions, form inputs | 300, 400, 600 |

### 4.2 Color Palette

| Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| Pure Black | `#000000` | `bg-black` | Page backgrounds |
| Matte Dark | `#09090B` | `bg-[#09090B]` | Cards, surfaces, modals, sidebars |
| Elevated Surface | `#111113` | `bg-[#111113]` | Hover states, nested cards |
| Border Gray | `#27272A` | `border-[#27272A]` | All borders, dividers, separators |
| Terminal Emerald | `#10B981` | `text-[#10B981]` `bg-[#10B981]` | Primary CTA, success, online status dot |
| Hacker Cyan | `#06B6D4` | `text-[#06B6D4]` | Tags, badges, hyperlinks |
| Danger Red | `#EF4444` | `text-[#EF4444]` `bg-[#EF4444]` | Errors, delete actions, ban, reject |
| Warning Amber | `#F59E0B` | `text-[#F59E0B]` | Warnings, pending states, medium difficulty |
| Ghost White | `#F8FAFC` | `text-[#F8FAFC]` | Primary readable text |
| Muted Slate | `#A1A1AA` | `text-[#A1A1AA]` | Subtitles, timestamps, placeholders |

### 4.3 UI Primitives

```
CARD:           bg-[#09090B] border border-[#27272A] rounded-md p-6
CARD (hover):   hover:bg-[#111113] transition-colors duration-150 cursor-pointer

INPUT:          bg-[#09090B] border border-[#27272A] text-[#F8FAFC] rounded-sm px-3 py-2
                focus:outline-none focus:border-[#10B981] placeholder:text-[#A1A1AA] w-full
TEXTAREA:       Same as INPUT — add resize-none
SELECT:         Same as INPUT styling

BTN PRIMARY:    bg-[#10B981] text-black font-mono font-bold px-4 py-2 rounded-sm
                hover:bg-[#0ea472] disabled:opacity-50 disabled:cursor-not-allowed transition-colors
BTN SECONDARY:  border border-[#27272A] text-[#F8FAFC] font-mono px-4 py-2 rounded-sm
                hover:bg-[#111113] transition-colors
BTN DANGER:     bg-[#EF4444] text-white font-mono px-4 py-2 rounded-sm
                hover:bg-[#dc2626] disabled:opacity-50 transition-colors
BTN GHOST:      text-[#A1A1AA] font-mono px-4 py-2 rounded-sm
                hover:text-[#F8FAFC] hover:bg-[#111113] transition-colors

BADGE:          font-mono text-xs px-2 py-0.5 rounded-full border
BADGE (cyan):   text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/30
BADGE (green):  text-[#10B981] bg-[#10B981]/10 border-[#10B981]/30
BADGE (red):    text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/30
BADGE (amber):  text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/30

MODAL OVERLAY:  fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm
MODAL PANEL:    bg-[#09090B] border border-[#27272A] rounded-md p-6 max-w-md w-full mx-4

TOAST (base):   fixed bottom-4 right-4 z-50 bg-[#09090B] border-l-4 px-4 py-3
                rounded-sm shadow-xl font-mono text-sm text-[#F8FAFC]
TOAST (success): border-[#10B981]
TOAST (error):  border-[#EF4444]
TOAST (warning): border-[#F59E0B]

SIDEBAR:        bg-[#09090B] border-r border-[#27272A] h-screen w-64 fixed left-0 top-0
DIVIDER:        border-t border-[#27272A] my-4
SKELETON:       bg-[#27272A] animate-pulse rounded-sm

MSG BUBBLE (self):  bg-[#10B981]/20 border border-[#10B981]/30 text-[#F8FAFC] rounded-md
                    px-3 py-2 max-w-xs ml-auto
MSG BUBBLE (other): bg-[#09090B] border border-[#27272A] text-[#F8FAFC] rounded-md
                    px-3 py-2 max-w-xs
```

### 4.4 Iconography

Use **Lucide React** icons exclusively. No other icon libraries.

```
Size conventions:
  16px (h-4 w-4) — Inline text icons
  20px (h-5 w-5) — Button icons
  24px (h-6 w-6) — Navigation icons

Common icons:
  Shield, Terminal, Lock, Zap — Branding
  Users, UserCheck, UserX    — Member management
  Bell, BellDot              — Notifications
  MessageSquare, Send        — Messaging
  Flag, Trophy               — CTF / Leaderboard
  FileText, Upload, Download — Documents
  Calendar, MapPin           — Events
  Settings, LogOut           — Admin / Auth
  ChevronLeft, ChevronRight  — Pagination
  Search, Filter             — Data controls
  Plus, Trash2, Edit2, Eye   — CRUD actions
  CheckCircle, XCircle       — Status
  Loader2                    — Loading spinner (animate-spin)
```

### 4.5 Prohibited Patterns

- ❌ `window.alert()` or `window.confirm()` — use `Modal.tsx` / `Toast.tsx`
- ❌ Infinite scroll without skeleton states
- ❌ Client-side filtering for datasets > 50 rows
- ❌ Any external UI library (Radix, MUI, Shadcn, Headless UI)
- ❌ Light mode styles: `bg-white`, `bg-gray-100`, `text-gray-900`
- ❌ Raw `<img>` tags — always use Next.js `<Image />`
- ❌ `console.log` in committed code

---

## 5. FOLDER STRUCTURE

```
iims-cyber-club/
│
├── app/
│   ├── layout.tsx                          ← Root layout (fonts, ToastProvider)
│   ├── globals.css                         ← Tailwind + custom scrollbar styling
│   │
│   ├── (public)/                           ← Public website group
│   │   ├── layout.tsx                      ← Public Navbar + Footer
│   │   ├── page.tsx                        ← Homepage
│   │   ├── about/page.tsx
│   │   ├── events/page.tsx
│   │   └── contact/page.tsx
│   │
│   └── portal/                             ← All portal routes
│       ├── layout.tsx                      ← Auth gate + Sidebar shell
│       ├── login/page.tsx
│       ├── pending/page.tsx
│       ├── dashboard/page.tsx
│       ├── feed/page.tsx
│       ├── messages/
│       │   ├── page.tsx                    ← Conversation list
│       │   └── [conversationId]/page.tsx   ← Chat window
│       ├── notifications/page.tsx
│       ├── documents/page.tsx
│       ├── events/
│       │   ├── page.tsx
│       │   └── [id]/page.tsx
│       ├── ctf/
│       │   ├── page.tsx
│       │   └── [challengeId]/page.tsx
│       ├── leaderboard/page.tsx
│       ├── profile/page.tsx
│       ├── members/[id]/page.tsx
│       └── admin/page.tsx                  ← 12-tab admin panel
│
├── app/api/
│   ├── contact/route.ts                    ← Public contact form
│   ├── admin/
│   │   ├── members/route.ts
│   │   ├── posts/route.ts
│   │   ├── events/route.ts
│   │   ├── documents/route.ts
│   │   ├── ctf/route.ts
│   │   ├── broadcast/route.ts              ← Send notification to all members
│   │   └── export-csv/route.ts
│   ├── messages/
│   │   ├── route.ts                        ← List/create conversations
│   │   └── [conversationId]/route.ts       ← Fetch/send messages
│   ├── notifications/route.ts
│   ├── ctf/submit/route.ts                 ← Flag submission (server-side hash compare)
│   └── upload/route.ts                     ← Generate signed upload URL
│
├── components/
│   ├── ui/                                 ← Design system primitives
│   │   ├── Modal.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── Toast.tsx
│   │   ├── ToastProvider.tsx
│   │   ├── Pagination.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── MarkdownEditor.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── public/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── EventCard.tsx
│   │   └── ContactForm.tsx
│   └── portal/
│       ├── Sidebar.tsx                     ← Nav + notification/message badges
│       ├── PostCard.tsx
│       ├── PostComposer.tsx
│       ├── MessageThread.tsx
│       ├── ConversationList.tsx
│       ├── ConversationItem.tsx
│       ├── NotificationItem.tsx
│       ├── CTFChallengeCard.tsx
│       ├── FlagSubmitForm.tsx
│       ├── LeaderboardTable.tsx
│       ├── MemberCard.tsx
│       ├── EventCard.tsx                   ← Portal version (with RSVP)
│       └── admin/                          ← One component per admin tab
│           ├── AdminOverviewTab.tsx
│           ├── AdminMembersTab.tsx
│           ├── AdminPostsTab.tsx
│           ├── AdminEventsTab.tsx
│           ├── AdminDocumentsTab.tsx
│           ├── AdminCTFTab.tsx
│           ├── AdminLeaderboardTab.tsx
│           ├── AdminGalleryTab.tsx
│           ├── AdminMessagesTab.tsx
│           ├── AdminBroadcastTab.tsx
│           ├── AdminContactTab.tsx
│           ├── AdminAuditTab.tsx
│           └── AdminSettingsTab.tsx
│
├── lib/
│   ├── supabase.ts                         ← Browser client (ANON key only)
│   ├── supabase-server.ts                  ← Server client (SERVICE ROLE KEY ONLY)
│   ├── resend.ts                           ← Resend client instance
│   ├── auth.ts                             ← getSession(), getMember(), getRole()
│   ├── validations.ts                      ← All Zod schemas
│   └── utils.ts                            ← formatDate, truncate, cn(), hashFlag()
│
├── hooks/
│   ├── useToast.ts
│   ├── useModal.ts
│   ├── useRealtimeMessages.ts              ← Supabase Realtime DM subscription
│   └── useNotifications.ts                ← Realtime notification count
│
├── types/
│   └── database.ts                         ← All DB types
│
├── middleware.ts
├── .env.local
└── CONTEXT.md
```

---

## 6. ENVIRONMENT VARIABLES

```env
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # Safe for browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...               # ⚠️ SERVER ONLY — never prefix NEXT_PUBLIC_

# Email
RESEND_API_KEY=re_...

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # Update to Vercel prod URL on deploy
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` bypasses ALL Row-Level Security. It must **only** appear inside `lib/supabase-server.ts` and server-side API routes. Never import it in any `'use client'` component.

---

## 7. COMPLETE DATABASE SCHEMA

Run this entirely in the **Supabase SQL Editor**. Order matters — foreign keys depend on prior tables.

```sql
-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MEMBERS
-- =============================================
CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name     text NOT NULL,
  email         text UNIQUE NOT NULL,
  student_id    text UNIQUE,
  role          text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'admin', 'superadmin')),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'banned')),
  bio           text,
  avatar_url    text,
  github_url    text,
  linkedin_url  text,
  skills        text[],              -- e.g. ARRAY['web','forensics','pwn']
  points        integer DEFAULT 0,   -- CTF leaderboard points (managed by trigger)
  joined_at     timestamptz DEFAULT now(),
  approved_at   timestamptz,
  approved_by   uuid REFERENCES members(id) ON DELETE SET NULL
);

-- =============================================
-- POSTS
-- =============================================
CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title       text,
  content     text NOT NULL,         -- Stored as Markdown
  type        text DEFAULT 'post'
              CHECK (type IN ('post', 'announcement', 'resource')),
  is_pinned   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- =============================================
-- POST REACTIONS
-- =============================================
CREATE TABLE post_reactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, member_id)         -- One reaction per member per post
);

-- =============================================
-- POST COMMENTS
-- =============================================
CREATE TABLE post_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- DIRECT MESSAGES — Conversations
-- =============================================
CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()  -- Bump on new message for sort order
);

-- =============================================
-- DIRECT MESSAGES — Participants
-- =============================================
CREATE TABLE conversation_participants (
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  member_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  last_read_at     timestamptz DEFAULT now(),
  PRIMARY KEY (conversation_id, member_id)
);

-- =============================================
-- DIRECT MESSAGES — Messages
-- =============================================
CREATE TABLE messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content          text NOT NULL,
  is_deleted       boolean DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  sender_id    uuid REFERENCES members(id) ON DELETE SET NULL,
  type         text NOT NULL CHECK (type IN (
    'new_message', 'new_post', 'post_reaction', 'post_comment',
    'event_reminder', 'member_approved', 'member_rejected',
    'ctf_new_challenge', 'ctf_solved', 'announcement'
  )),
  title        text NOT NULL,
  body         text,
  link         text,                 -- e.g. '/portal/messages/[convId]'
  is_read      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- DOCUMENTS
-- =============================================
CREATE TABLE documents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id    uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  title          text NOT NULL,
  description    text,
  file_url       text NOT NULL,      -- Supabase Storage path (NOT public URL)
  file_size      bigint,             -- bytes
  file_type      text,               -- MIME type
  category       text DEFAULT 'general' CHECK (category IN (
    'general', 'study-material', 'writeup', 'presentation', 'report', 'other'
  )),
  is_public      boolean DEFAULT false,
  download_count integer DEFAULT 0,
  created_at     timestamptz DEFAULT now()
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE public_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      uuid REFERENCES members(id) ON DELETE SET NULL,
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,  -- URL-friendly e.g. 'ctf-workshop-2025'
  description     text NOT NULL,        -- Markdown
  short_desc      text,                 -- Max 160 chars, for public cards
  event_date      timestamptz NOT NULL,
  end_date        timestamptz,
  location        text,                 -- Physical address or "Online"
  meeting_link    text,                 -- Zoom/Meet URL (portal-only)
  cover_image_url text,
  type            text DEFAULT 'workshop' CHECK (type IN (
    'workshop', 'ctf', 'seminar', 'meetup', 'competition', 'other'
  )),
  max_attendees   integer,
  is_published    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now()
);

-- =============================================
-- EVENT RSVPs
-- =============================================
CREATE TABLE event_rsvps (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES public_events(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status     text DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- =============================================
-- CTF CHALLENGES
-- =============================================
CREATE TABLE ctf_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  title        text NOT NULL,
  description  text NOT NULL,           -- Markdown
  category     text NOT NULL CHECK (category IN (
    'web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc'
  )),
  difficulty   text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'insane')),
  points       integer NOT NULL DEFAULT 100,
  flag         text NOT NULL,           -- SHA256 hash of the real flag — NEVER raw
  flag_format  text DEFAULT 'IIMS{...}',
  hint         text,
  file_url     text,                    -- ctf-files storage path (signed URL on request)
  is_active    boolean DEFAULT false,
  solves_count integer DEFAULT 0,       -- Denormalized via trigger
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- CTF SOLVES
-- =============================================
CREATE TABLE ctf_solves (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES ctf_challenges(id) ON DELETE CASCADE,
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  solved_at    timestamptz DEFAULT now(),
  UNIQUE(challenge_id, member_id)
);

-- =============================================
-- GALLERY
-- =============================================
CREATE TABLE gallery_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid REFERENCES members(id) ON DELETE SET NULL,
  url         text NOT NULL,
  caption     text,
  event_id    uuid REFERENCES public_events(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   uuid REFERENCES members(id) ON DELETE SET NULL,
  action     text NOT NULL,             -- 'APPROVED_MEMBER', 'DELETED_POST', etc.
  target_id  text,
  meta       jsonb,                     -- Old/new values, context
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
  key        text PRIMARY KEY,
  value      text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('registration_open',  'true'),
  ('site_title',         'IIMS Cybersecurity Club'),
  ('hero_tagline',       'Hack the future. Secure the present.'),
  ('hero_subtext',       'Join Nepal''s premier college cybersecurity community.'),
  ('contact_email',      'cybersec@iimscollege.edu.np'),
  ('ctf_enabled',        'true');

-- =============================================
-- TRIGGERS — CTF point + solve count management
-- =============================================
CREATE OR REPLACE FUNCTION on_ctf_solve_fn()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment member points
  UPDATE members
    SET points = points + (SELECT points FROM ctf_challenges WHERE id = NEW.challenge_id)
    WHERE id = NEW.member_id;
  -- Increment challenge solve count
  UPDATE ctf_challenges
    SET solves_count = solves_count + 1
    WHERE id = NEW.challenge_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_ctf_solve
  AFTER INSERT ON ctf_solves
  FOR EACH ROW EXECUTE FUNCTION on_ctf_solve_fn();

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================
CREATE INDEX idx_members_status       ON members(status);
CREATE INDEX idx_members_role         ON members(role);
CREATE INDEX idx_members_points       ON members(points DESC);
CREATE INDEX idx_posts_created        ON posts(created_at DESC);
CREATE INDEX idx_posts_author         ON posts(author_id);
CREATE INDEX idx_messages_conv        ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_conv_participants    ON conversation_participants(member_id);
CREATE INDEX idx_notifications_recip  ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_events_date          ON public_events(event_date DESC);
CREATE INDEX idx_events_published     ON public_events(is_published);
CREATE INDEX idx_ctf_active           ON ctf_challenges(is_active);
CREATE INDEX idx_ctf_solves_member    ON ctf_solves(member_id);
CREATE INDEX idx_ctf_solves_challenge ON ctf_solves(challenge_id);
CREATE INDEX idx_audit_created        ON audit_logs(created_at DESC);
CREATE INDEX idx_documents_category   ON documents(category);
```

---

## 8. SUPABASE STORAGE BUCKETS

| Bucket Name | Visibility | Max Size | Allowed Types | Usage |
|---|---|---|---|---|
| `club-documents` | **Private** (signed URLs, 1hr expiry) | 50MB | PDF, DOCX, PPTX, ZIP | Member docs, writeups |
| `public-gallery` | Public | 10MB | JPG, PNG, WebP | Event photos, gallery |
| `event-images` | Public | 5MB | JPG, PNG, WebP | Event cover images |
| `team-avatars` | Public | 2MB | JPG, PNG, WebP | Member profile photos |
| `ctf-files` | **Private** (signed URLs, 2hr expiry) | 20MB | Any | Challenge files/attachments |

---

## 9. ROW-LEVEL SECURITY (RLS) POLICIES

Enable RLS on **every** table. Use the service role (server-side) to bypass when needed for admin operations.

```sql
-- MEMBERS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved members can view approved members"
  ON members FOR SELECT
  USING (status = 'approved');
CREATE POLICY "Members can update own profile"
  ON members FOR UPDATE
  USING (auth.uid() = user_id);

-- POSTS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved members can read posts"
  ON posts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
  ));
CREATE POLICY "Approved members can insert posts"
  ON posts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
  ));
CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE
  USING (author_id = (SELECT id FROM members WHERE user_id = auth.uid()));

-- MESSAGES — members can only read conversations they participate in
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read own conversation messages"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_participants cp
    JOIN members m ON m.id = cp.member_id
    WHERE cp.conversation_id = messages.conversation_id
      AND m.user_id = auth.uid()
  ));

-- NOTIFICATIONS — only own notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()));
CREATE POLICY "Members can update own notifications (mark read)"
  ON notifications FOR UPDATE
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()));

-- CTF CHALLENGES — never expose flag column client-side
ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved members can read active challenges"
  ON ctf_challenges FOR SELECT
  USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved')
  );
-- Note: API queries must explicitly exclude the 'flag' column:
-- .select('id, title, description, category, difficulty, points, hint, file_url, solves_count')

-- CTF SOLVES
ALTER TABLE ctf_solves ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read own solves"
  ON ctf_solves FOR SELECT
  USING (member_id = (SELECT id FROM members WHERE user_id = auth.uid()));

-- CONTACT MESSAGES — public insert, admin read via service role
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert contact message"
  ON contact_messages FOR INSERT WITH CHECK (true);
```

---

## 10. AUTHENTICATION & MIDDLEWARE

### 10.1 Auth Flow

```
User enters email on /portal/login
→ Supabase sends Magic Link (via Resend)
→ User clicks link → Supabase creates session cookie
→ middleware.ts intercepts protected routes:

  No session?          → redirect /portal/login
  Session + pending?   → redirect /portal/pending
  Session + rejected?  → redirect /portal/login (show reason)
  Session + banned?    → redirect /portal/login (show ban message)
  Session + approved?  → allow access to /portal/*
  Session + admin?     → allow access to /portal/admin
```

### 10.2 Middleware (`middleware.ts`)

```typescript
// Protected prefixes
const MEMBER_ROUTES = [
  '/portal/dashboard', '/portal/feed', '/portal/messages',
  '/portal/notifications', '/portal/documents', '/portal/events',
  '/portal/ctf', '/portal/leaderboard', '/portal/profile', '/portal/members'
]
const ADMIN_ROUTES = ['/portal/admin']

// Performance strategy:
// 1. Check Supabase session (lightweight JWT validation)
// 2. Read signed cookie 'iims_member_ctx' → { memberId, role, status }
// 3. Cookie missing → DB lookup → set cookie (1hr TTL) → proceed
// 4. Avoid DB hit on every route change
```

### 10.3 Role Hierarchy

| Role | Capabilities |
|---|---|
| `member` | All portal features: feed, DMs, docs, CTF, events, profile |
| `admin` | All member features + full Admin Panel (cannot demote other admins) |
| `superadmin` | All admin features + promote/demote admins + site settings |

---

## 11. FEATURE SPECIFICATIONS

### 11.1 Member Registration & Approval

**Flow:**
1. Visitor goes to `/portal/login` → enters email → clicks "Send Magic Link"
2. Email arrives (sent via Resend, not Supabase default)
3. First-time login → redirect to registration completion form
4. Form fields: `full_name` (required), `student_id` (required), `bio` (optional), `skills[]` (multi-select checkboxes)
5. Submit → member created with `status: 'pending'` → redirect to `/portal/pending`
6. `/portal/pending` shows: "Your application is under review. You will receive an email when approved."
7. Admin approves in Admin Panel → `status → 'approved'` → welcome email sent via Resend → member can now log in to dashboard

---

### 11.2 Member Dashboard (`/portal/dashboard`)

Displayed widgets (all data fetched server-side in parallel):
- **Welcome Banner:** "Welcome back, [name]" + formatted current date
- **Stats Row (4 cards):** Total approved members | Active CTF challenges | Upcoming events | Your points + rank
- **Pinned/Announcement Feed:** Last 3 announcement posts
- **Upcoming Events:** Next 2 events with one-click RSVP
- **CTF Progress:** Solved N / Total challenges + your rank position
- **Unread Notifications:** Count badge + latest 3 notification items

---

### 11.3 Post Feed (`/portal/feed`)

- Paginated (20 posts/page), sorted by `created_at DESC`, pinned posts always float to top
- Post type badges: `announcement` = amber, `resource` = cyan, `post` = muted
- Markdown rendered via `MarkdownRenderer.tsx` (sanitized — no raw HTML)
- **Reactions:** Toggle like button (1 per member). Count updates live via Realtime subscription
- **Comments:** Expandable section per post. Paginated 20/page. Members can delete own comments.
- **Compose Panel:** Members can create `post` or `resource` type. Admins can create `announcement`.
- **Pinning:** Admin only — pins post to top of feed
- **Edit:** Author can edit own post within 24h (shows `updated_at` label)
- **Delete:** Author deletes own post. Admin deletes any post (with `ConfirmModal`)
- **Search:** Server-side `ilike` search on `title` + `content`

---

### 11.4 Direct Messaging (DMs) — `/portal/messages`

**Architecture:** Supabase Realtime subscribed to `messages` table filtered by `conversation_id`.

**Conversation List (left panel — `w-72`):**
- Sorted by `conversations.updated_at DESC` (most recent message first)
- Each row: `Avatar` + name + last message preview (60 char truncate) + unread count badge + relative timestamp
- "New Message" button → member search modal → select member → creates/opens conversation

**Chat Window (right panel — `flex-1`):**
- Header: avatar + name + online indicator dot
- Messages: oldest at top, newest at bottom, auto-scroll to bottom on load and new message
- Self messages: right-aligned, emerald bubble. Other messages: left-aligned, dark bubble
- Timestamps shown on hover
- Soft-delete: "Delete" option on own messages → content replaced with `[message deleted]`
- Input: multi-line textarea + Send button (or `Ctrl+Enter`)

**Real-Time:**
```typescript
// useRealtimeMessages hook
supabase.channel(`messages:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT', schema: 'public', table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, (payload) => setMessages(prev => [...prev, payload.new]))
  .subscribe()
```

**Unread count:** Sidebar `MessageSquare` icon shows red badge with total unread count, updated via `useNotifications` hook.

**DB flow for sending a message:**
```
INSERT into messages → UPDATE conversations.updated_at → INSERT notification (type: 'new_message') for recipient
```

---

### 11.5 Notifications (`/portal/notifications`)

**Notification types and triggers:**

| Type | Trigger | Destination Link |
|---|---|---|
| `new_message` | Someone sends a DM | `/portal/messages/[convId]` |
| `announcement` | Admin broadcasts to all | `/portal/feed` |
| `post_reaction` | Someone reacts to your post | `/portal/feed#[postId]` |
| `post_comment` | Someone comments on your post | `/portal/feed#[postId]` |
| `event_reminder` | 24hr before an RSVPd event | `/portal/events/[id]` |
| `member_approved` | Admin approves your registration | `/portal/dashboard` |
| `member_rejected` | Admin rejects your application | `/portal/login` |
| `ctf_new_challenge` | New challenge published | `/portal/ctf` |
| `ctf_solved` | You correctly submit a flag | `/portal/leaderboard` |

**UI:**
- List sorted by `created_at DESC`, 30 per page
- Unread items: subtle `bg-[#10B981]/5 border-l-2 border-[#10B981]` left accent
- "Mark all as read" button (top right, ghost style)
- Click item → navigate to `link` + mark as read
- Sidebar bell icon: red badge with unread count, live via Realtime

---

### 11.6 Documents & Resources (`/portal/documents`)

- Category filter tabs: All | Study Material | Writeups | Presentations | Reports | Other
- Document card: icon (by file type), title, uploader name, category badge, file size, upload date, download count
- **Download:** Private documents → server generates signed URL (1hr expiry) → download starts
- **Upload:** Member uploads → file goes to `club-documents` bucket → metadata saved to `documents` table
- **Search:** Server-side `ilike` on `title` + `description`
- **Admin controls:** Delete any document, toggle `is_public`, change category
- Pagination: 20 per page

---

### 11.7 Events System

**Public site (`/events`):**
- Only `is_published: true` events shown
- Card: cover image, title, date, type badge, short_desc, "Learn More" button
- Event detail: full description, location, type. CTA: "Login to RSVP →"

**Portal (`/portal/events`):**
- Same listing + RSVP control (Going / Maybe / Not Going — toggle)
- Event detail: full Markdown description, meeting link (portal-only), attendee list with avatars
- "My Events" filter tab: shows only events you RSVPd "going" to
- Attendee count shown on card: `X going · Y maybe`

**Admin:** Create, edit (all fields), publish/unpublish toggle, delete (with `ConfirmModal`), upload cover image.

---

### 11.8 CTF Challenges & Leaderboard

**Challenge Grid (`/portal/ctf`):**
- Filter bar: category buttons + difficulty buttons (all combinable)
- Card: title, category badge (cyan), difficulty badge (color-coded), points, solve count
- Solved overlay: emerald `✓ SOLVED` stamp on card
- Difficulty color mapping:
  - `easy` → `text-[#10B981]` badge
  - `medium` → `text-[#F59E0B]` badge
  - `hard` → `text-[#EF4444]` badge
  - `insane` → `text-[#EF4444]` badge + `animate-pulse`

**Challenge Detail (`/portal/ctf/[challengeId]`):**
- Title, category + difficulty badges, points value
- Description rendered as Markdown
- Challenge file download button (if present) → signed URL from `/api/upload`
- **Flag hint:** "Show Hint" button (hint shown inline, tracked for future point deduction)
- **Flag submit form (`FlagSubmitForm.tsx`):**
  - Input enforces `IIMS{` prefix client-side
  - Submit → POST `/api/ctf/submit` with `{ challengeId, flag }`
  - Server: SHA256(flag) compared to stored hash — never return hash to client
  - Success: Toast "🏴 Flag captured! +[points] points" + update member.points display
  - Wrong: Toast error "Incorrect flag. Keep trying." (no hint about closeness)
  - Already solved: Button replaced with "✓ Already Solved"

**Leaderboard (`/portal/leaderboard`):**
- Table: Rank | Avatar | Name | Points | Challenges Solved | Last Solve Date
- Top 3 rows: gold/silver/bronze highlight (`#F59E0B`, `#A1A1AA`, `#B45309` tint)
- Viewer's own row: always highlighted with emerald left border, sticky if outside top 10
- Pagination: 20 per page

---

### 11.9 Member Profiles

**Own Profile (`/portal/profile`):**
- Edit: `full_name`, `bio`, avatar upload (→ `team-avatars` bucket), `github_url`, `linkedin_url`, `skills[]`
- Stats section (read-only): Points, CTF rank, Challenges solved, Posts published, Member since

**Other Member's Profile (`/portal/members/[id]`):**
- Read-only: avatar, name, bio, skills badges, CTF stats, joined date
- Solved challenges list (titles only — no flags ever shown)
- Recent posts by member
- "Send Message" CTA → creates or navigates to existing DM conversation

---

### 11.10 Public Website

**Homepage (`/`):** Hero tagline (from `site_settings`), animated terminal cursor effect, stats bar (member count, events, CTF challenges), 3 upcoming featured events, team section (admins from `members` table), join CTA button.

**About (`/about`):** Mission statement, leadership team cards (avatar, name, role), club gallery grid (from `public-gallery` bucket), brief club history.

**Events (`/events`):** Grid of published events, filter by type. Event cards link to detail page. No RSVP on public site — "Login to RSVP" CTA redirects to `/portal/login`.

**Contact (`/contact`):** Name, email, subject, message form. Submit → POST `/api/contact` → insert into `contact_messages` + send Resend notification to club email. Client receives success Toast.

---

### 11.11 Contact Form API (`/api/contact/route.ts`)

```typescript
// Zod validation
const schema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(2000),
})

// Rate limiting: max 3 submissions per IP per hour (use headers or KV store)
// Success: INSERT into contact_messages + Resend email to club address
// Response: NextResponse<{ success: true }> or NextResponse<{ error: string }, { status: 400 }>
```

---

## 12. ADMIN PANEL SPECIFICATION

Route: `/portal/admin` — requires `role: admin` or `role: superadmin`.

### 12.1 Layout
- Horizontal tab bar at top of page
- Active tab: `border-b-2 border-[#10B981] text-[#F8FAFC] font-mono`
- Inactive tab: `text-[#A1A1AA] hover:text-[#F8FAFC] font-mono`
- Tab content rendered below the bar in a full-width panel

### 12.2 Tabs (13 Total)

| # | Tab Label | Key Features |
|---|---|---|
| 1 | **Overview** | Stat cards: total members, pending approvals, posts, events, CTF solves today, unread contact messages |
| 2 | **Members** | Paginated (20/pg), filter by status, approve/reject/ban buttons, "Export CSV" |
| 3 | **Posts** | Paginated, pin/unpin, delete, create announcement with `MarkdownEditor` |
| 4 | **Events** | Create/edit/delete, publish toggle, view RSVP attendee list per event |
| 5 | **Documents** | Upload new doc, manage existing, toggle `is_public`, delete |
| 6 | **CTF Challenges** | Create/edit challenge (title, desc, category, difficulty, points, flag, hint, file), activate/deactivate |
| 7 | **Leaderboard** | Read-only leaderboard + manual point adjustment input (logged to audit_logs) |
| 8 | **Gallery** | Upload images (to `public-gallery`), tag to event, delete |
| 9 | **Broadcast** | Compose message → creates `notification` row for every approved member (type: `announcement`) |
| 10 | **Contact Inbox** | Paginated list of contact form submissions, mark as read, view full message |
| 11 | **Audit Logs** | Paginated (30/pg), filterable by action type, shows admin + action + target + timestamp |
| 12 | **Site Settings** | Edit `site_settings` key-value pairs: hero tagline, registration open/closed, CTF enabled |
| 13 | **Pending Review** | Quick-access tab showing only `status: 'pending'` members for fast approval workflow |

### 12.3 Admin Interaction Standards

| Interaction | Implementation |
|---|---|
| Delete any record | `ConfirmModal.tsx`: "This action cannot be undone." + [DELETE] [Cancel] |
| Approve member | Inline button → Toast "Member approved. Welcome email sent." + audit log entry |
| Reject member | `ConfirmModal` with optional rejection reason → email sent to member |
| Ban member | `ConfirmModal` with required reason field → logged to `audit_logs` with `meta` |
| Async button states | `disabled + "PROCESSING..."` + `<Loader2 className="animate-spin" />` icon |
| Success | Toast with `border-[#10B981]` |
| Error | Toast with `border-[#EF4444]` |
| Pagination | `.range(from, to)` with `<Pagination />` component — 20 records/page |

### 12.4 CSV Export Format

```
id,full_name,email,student_id,role,status,points,joined_at,approved_at
uuid,Jane Doe,jane@iims.edu.np,STU001,member,approved,350,2025-01-15,2025-01-16
```

---

## 13. API ROUTES REFERENCE

All routes in `app/api/`. Admin routes verify `role` using the service-role Supabase client.

| Method | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit contact form → DB + Resend |
| `GET` | `/api/admin/members` | Admin | List members with status filter + pagination |
| `PATCH` | `/api/admin/members` | Admin | Update member status or role |
| `POST` | `/api/admin/events` | Admin | Create event |
| `PATCH` | `/api/admin/events` | Admin | Update event (including publish toggle) |
| `DELETE` | `/api/admin/events` | Admin | Delete event |
| `POST` | `/api/admin/ctf` | Admin | Create CTF challenge |
| `PATCH` | `/api/admin/ctf` | Admin | Update / activate challenge |
| `DELETE` | `/api/admin/ctf` | Admin | Delete challenge |
| `POST` | `/api/admin/broadcast` | Admin | Send notification to all approved members |
| `GET` | `/api/admin/export-csv` | Admin | Stream approved members as CSV |
| `GET` | `/api/messages` | Member | List conversations for current user |
| `POST` | `/api/messages` | Member | Start a new conversation |
| `GET` | `/api/messages/[id]` | Member | Fetch paginated messages in conversation |
| `POST` | `/api/messages/[id]` | Member | Send a message |
| `GET` | `/api/notifications` | Member | List notifications (paginated) |
| `PATCH` | `/api/notifications` | Member | Mark notification(s) read |
| `POST` | `/api/ctf/submit` | Member | Submit CTF flag (server-side SHA256 compare) |
| `POST` | `/api/upload` | Member | Generate signed upload URL for a storage bucket |

---

## 14. REAL-TIME FEATURES (Supabase Realtime)

Enable Realtime on these tables in **Supabase Dashboard → Database → Replication → Supabase Realtime**.

| Table | Events Listened | Component | Hook |
|---|---|---|---|
| `messages` | `INSERT` | Chat window | `useRealtimeMessages(conversationId)` |
| `notifications` | `INSERT` | Sidebar bell + Notification page | `useNotifications(memberId)` |
| `post_reactions` | `INSERT`, `DELETE` | PostCard like count | Inline subscription in `PostCard.tsx` |

**Pattern (`useRealtimeMessages.ts`):**
```typescript
export function useRealtimeMessages(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId])

  return messages
}
```

**Pattern (`useNotifications.ts`):**
```typescript
export function useNotifications(memberId: string) {
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const channel = supabase
      .channel(`notifications:${memberId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `recipient_id=eq.${memberId}`
      }, () => {
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [memberId])

  return unreadCount
}
```

---

## 15. EMAIL TEMPLATES (Resend)

All emails use `from: "IIMS Cybersecurity Club <noreply@iimscollege.edu.np>"`.

| Email | Trigger | Subject |
|---|---|---|
| Magic Link | Login request | `[IIMS CyberSec] Your login link` |
| Welcome | Member approved by admin | `Welcome to IIMS Cybersecurity Club 🛡️` |
| Rejection | Admin rejects application | `Your application status — IIMS CyberSec Club` |
| Event Reminder | 24hr before RSVPd event | `Reminder: [Event Name] is tomorrow` |
| Contact Confirmation | Public contact form submitted | `We received your message — IIMS CyberSec` |
| Admin Alert | New pending member registration | `New member application — action required` |

---

## 16. CODING RULES & STANDARDS

### Security
- `lib/supabase-server.ts` **MUST** use `process.env.SUPABASE_SERVICE_ROLE_KEY` — never the anon key
- CTF flag column stores **SHA256 hash** only. Flag comparison is server-side only in `/api/ctf/submit`
- The `flag` column must **never** appear in any `SELECT` statement accessible to clients
- All admin API routes must re-verify the caller's `role` server-side using the service client
- Signed URLs for private buckets: generate server-side, max 1hr expiry
- Rate-limit public endpoints (contact form: 3 req/IP/hr)

### TypeScript
- All DB response types come from `types/database.ts`
- No `any` types. Use `unknown` and narrow properly.
- All API handlers return `NextResponse<T | { error: string }>`

### UI / UX
- Never `window.alert()` or `window.confirm()` — use `Modal.tsx` or `Toast.tsx`
- Every async button: `disabled` + `"PROCESSING..."` text + `<Loader2 className="animate-spin" />`
- Every loading state: `<Skeleton />` placeholders — never blank space
- Empty states: descriptive message + relevant CTA button — never just empty

### Data Fetching
- Never `.select('*')` without `.limit()` on any table expected to grow
- All paginated queries use `.range(from, to)` — max 20 records by default
- No client-side filtering for > 50 rows
- All DB calls wrapped in `try/catch` with error toast on failure
- `if (error) throw error` immediately after every Supabase call

### Forms & Validation
- All form inputs validated with Zod schemas (defined in `lib/validations.ts`)
- Server API routes validate request body with the **same** Zod schemas
- Validation errors shown as inline field-level errors — not just a generic toast

---

## 17. PERFORMANCE & SCALABILITY RULES

| Rule | Implementation |
|---|---|
| Paginate everything | `.range(from, to)` — 20 records default, 30 for notifications, audit logs |
| Index all FK columns | Done in schema Section 7 |
| Denormalize counts | `members.points` and `ctf_challenges.solves_count` managed via DB trigger — no aggregation queries |
| Image optimization | Always use Next.js `<Image />`. Set explicit `width` and `height`. Use `priority` for above-fold images. |
| Default to Server Components | Only use `'use client'` when interactivity is required |
| Parallel fetching | Use `Promise.all()` in Server Components to avoid waterfall |
| Cache public data | `next: { revalidate: 60 }` on public event/member fetches |
| Scope Realtime | Subscribe to specific `conversation_id` / `member_id` — never subscribe to entire table |
| Avoid N+1 | Join related data in single queries using Supabase's embedded select syntax |

---

## 18. SECURITY CHECKLIST

Before deploying to production, verify every item:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT prefixed with `NEXT_PUBLIC_`
- [ ] RLS is enabled on **every** table in Supabase
- [ ] `flag` column is excluded from all client-facing SELECT queries
- [ ] All admin API routes verify the caller's `role` server-side
- [ ] Signed URLs for `club-documents` and `ctf-files` have ≤ 1 hour expiry
- [ ] Contact form has IP-based rate limiting
- [ ] Magic Link redirect URL is whitelisted in Supabase Auth settings
- [ ] `NEXT_PUBLIC_SITE_URL` updated to actual Vercel production domain
- [ ] No `console.log` statements containing emails, flags, or tokens in production
- [ ] File upload endpoint validates MIME type and size server-side (not just client-side)
- [ ] All Resend API calls are server-side only

---

## 19. QUICK REFERENCE — DO / DON'T

| ✅ DO | ❌ DON'T |
|---|---|
| Use `bg-[#09090B]` for card surfaces | Use `bg-white`, `bg-gray-100` |
| Use `Toast.tsx` for all alerts | Use `window.alert()` |
| Use `ConfirmModal.tsx` for deletions | Use `window.confirm()` |
| Show `<Skeleton />` while loading | Leave content areas blank |
| Hash CTF flags with SHA256 server-side | Store or compare raw flags |
| Use `SERVICE_ROLE_KEY` server-side only | Prefix it with `NEXT_PUBLIC_` |
| Paginate all lists with `.range()` | Fetch all rows without limit |
| Validate all inputs with Zod | Trust raw user input |
| Show `disabled + PROCESSING...` on submit | Leave buttons clickable during async ops |
| Use Lucide React icons | Use emojis as UI elements |
| Use `JetBrains Mono` for headings/buttons | Mix font families |
| Wrap all DB calls in `try/catch` | Ignore Supabase error objects |
| Use Next.js `<Image />` | Use raw `<img>` tags |
| Subscribe Realtime to specific IDs | Subscribe to entire tables |
| Write all files as `.tsx` / `.ts` | Create `.js` or `.jsx` files |
| Exclude `flag` from all client SELECT | Return flag column in any query |
| Use `<Loader2 className="animate-spin" />` | Use text-only loading states |
| Scope Realtime to specific resource IDs | Broad table-wide subscriptions |

---

*This file is the single source of truth for the IIMS Cybersecurity Club portal. Every AI session, every contributor, and every code generation task must align with these specifications before writing a single line of code.*