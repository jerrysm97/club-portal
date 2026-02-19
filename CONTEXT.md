# IIMS Cybersecurity Club — Master Project Context
> **Version:** 2.0 — Production-Ready  
> **Stack:** Next.js 14 · TypeScript · Supabase · Tailwind CSS · Resend  
> **Agent Instructions:** Read this file fully before writing any code. Every section is a contract. Violating any rule = broken production build.

---

## TABLE OF CONTENTS

1. [Project Identity](#1-project-identity)
2. [Architecture Overview](#2-architecture-overview)
3. [Tech Stack & Versions](#3-tech-stack--versions)
4. [Design System — IIMS Collegiate Theme](#4-design-system--iims-collegiate-theme)
5. [Folder Structure (Strict)](#5-folder-structure-strict)
6. [Environment Variables](#6-environment-variables)
7. [Complete Database Schema](#7-complete-database-schema)
8. [Supabase Storage Buckets](#8-supabase-storage-buckets)
9. [Row-Level Security (RLS) Policies](#9-row-level-security-rls-policies)
10. [Authentication & Middleware](#10-authentication--middleware)
11. [Frontend ↔ Backend Connection Rules](#11-frontend--backend-connection-rules)
12. [Feature Specifications](#12-feature-specifications)
13. [Admin Panel Specification](#13-admin-panel-specification)
14. [API Routes Reference](#14-api-routes-reference)
15. [Real-Time Features](#15-real-time-features)
16. [Email Templates](#16-email-templates-resend)
17. [Type Definitions](#17-type-definitions)
18. [Coding Rules & Standards](#18-coding-rules--standards)
19. [Security Checklist](#19-security-checklist)
20. [Error Handling Patterns](#20-error-handling-patterns)
21. [Performance Rules](#21-performance-rules)
22. [Common Bugs to Avoid](#22-common-bugs-to-avoid)
23. [Quick Reference — DO / DON'T](#23-quick-reference--do--dont)

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
| Design Language | IIMS Collegiate Theme (White, Maroon, Red, Yellow) |

---

## 2. ARCHITECTURE OVERVIEW

```
iims-cyber-club/
│
├── PUBLIC WEBSITE (/)          → Anyone on the internet
│   └── Content 100% driven from Supabase — no hardcoded text
│
└── MEMBER PORTAL (/portal/*)   → Approved members only (middleware-guarded)
    ├── Auth Layer               → Supabase Auth (Email + Password only)
    ├── Role System              → member → bod → admin → superadmin
    └── Admin Panel              → /portal/admin (admin/superadmin only)
```

### Route Map

| Route | Access Level | Description |
|---|---|---|
| `/` | Public | Homepage — hero, stats, featured events |
| `/about` | Public | Team, mission, gallery |
| `/events` | Public | Public event listings |
| `/contact` | Public | Resend-powered contact form |
| `/portal/login` | Public | Email/Password login |
| `/portal/signup` | Public | Self-registration form |
| `/portal/pending` | Registered (unapproved) | Waiting screen |
| `/portal/dashboard` | `approved` members | Main dashboard |
| `/portal/feed` | `approved` members | Post feed |
| `/portal/messages` | `approved` members | Direct messages (real-time) |
| `/portal/documents` | `approved` members | Club docs |
| `/portal/events` | `approved` members | Events (portal view) |
| `/portal/ctf` | `approved` members | CTF challenges |
| `/portal/leaderboard` | `approved` members | Points leaderboard |
| `/portal/profile` | `approved` members | Own profile |
| `/portal/admin` | `admin` / `superadmin` | Admin panel |

---

## 3. TECH STACK & VERSIONS

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js | 14 — App Router, Server Components by default |
| Language | TypeScript | Strict mode (`"strict": true` in tsconfig) |
| Styling | Tailwind CSS | v3 — arbitrary values for IIMS brand colors |
| Database | Supabase | PostgreSQL — all tables listed in §7 |
| Auth | Supabase Auth | Email + Password **only** — no magic links ever |
| Real-Time | Supabase Realtime | DMs, notifications, live feed reactions |
| File Storage | Supabase Storage | 3 buckets: `club-documents`, `public-gallery`, `team-avatars` |
| Email | Resend | Welcome, rejection, contact form emails |
| Validation | Zod | Every form and API input is validated with Zod schemas |

---

## 4. DESIGN SYSTEM — IIMS COLLEGIATE THEME

> **CRITICAL:** Every page, component, and modal must use ONLY these colors. Never introduce blue, green, purple, or any default Tailwind color class.

### 4.1 Typography

| Font | Usage | Weights |
|---|---|---|
| **Poppins** | Headings, display text, hero sections | 500, 600, 700 |
| **Inter** | Body text, paragraphs, buttons, form inputs | 400, 500, 600 |
| **JetBrains Mono** | Terminal output, CTF flags, code blocks | 400, 700 |

Add to `app/layout.tsx`:
```tsx
import { Poppins, Inter } from 'next/font/google'
// JetBrains Mono loaded via @fontsource/jetbrains-mono
```

### 4.2 Color Palette

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| White | `#FFFFFF` | `bg-white` | Main backgrounds |
| Light Gray | `#F9FAFB` | `bg-[#F9FAFB]` | Section alt backgrounds |
| IIMS Red | `#C3161C` | `bg-[#C3161C]` / `text-[#C3161C]` | Primary CTA, active states |
| IIMS Maroon | `#58151C` | `bg-[#58151C]` / `text-[#58151C]` | Header, footer, sidebar |
| IIMS Yellow | `#FFCD39` | `bg-[#FFCD39]` / `text-[#FFCD39]` | Highlights, badges, stars |
| Text Primary | `#111827` | `text-[#111827]` | Body copy |
| Text Muted | `#6B7280` | `text-[#6B7280]` | Subtitles, timestamps |
| Border Soft | `#E5E7EB` | `border-[#E5E7EB]` | Card borders, dividers |
| Red Hover | `#A31217` | `hover:bg-[#A31217]` | Primary button hover |
| Maroon Hover | `#431015` | `hover:bg-[#431015]` | Secondary button hover |

### 4.3 Component Primitives (Copy-Exact)

```
CARD:          bg-white border border-[#E5E7EB] rounded-xl shadow-sm p-6
CARD HOVER:    hover:shadow-md hover:border-[#C3161C]/30 transition-all duration-200

INPUT:         bg-white border border-[#D1D5DB] text-[#111827] rounded-lg px-4 py-2.5
               focus:outline-none focus:ring-2 focus:ring-[#C3161C]/20 focus:border-[#C3161C]
TEXTAREA:      Same as INPUT + resize-none

BTN PRIMARY:   bg-[#C3161C] text-white font-medium px-5 py-2.5 rounded-lg
               hover:bg-[#A31217] shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed
BTN SECONDARY: bg-[#58151C] text-white font-medium px-5 py-2.5 rounded-lg
               hover:bg-[#431015] shadow-sm transition-colors
BTN OUTLINE:   border border-[#D1D5DB] text-[#374151] bg-white font-medium px-5 py-2.5 rounded-lg
               hover:bg-[#F9FAFB] hover:text-[#C3161C] transition-colors

BADGE RED:     text-[#C3161C] bg-[#C3161C]/10 px-2.5 py-0.5 rounded-full text-xs font-semibold
BADGE MAROON:  text-[#58151C] bg-[#58151C]/10 px-2.5 py-0.5 rounded-full text-xs font-semibold
BADGE YELLOW:  text-[#B45309] bg-[#FFCD39]/20 px-2.5 py-0.5 rounded-full text-xs font-semibold
BADGE GRAY:    text-[#4B5563] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full text-xs font-medium

MODAL OVERLAY: fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/60 backdrop-blur-sm
MODAL PANEL:   bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4 border border-[#E5E7EB]

SIDEBAR:       bg-[#58151C] text-white h-screen w-64 fixed left-0 top-0 shadow-lg overflow-y-auto
SIDEBAR LINK:  px-4 py-2.5 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors
SIDEBAR ACTIVE: bg-[#C3161C] text-white px-4 py-2.5 rounded-lg
```

---

## 5. FOLDER STRUCTURE (STRICT)

```
iims-cyber-club/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx               ← Public layout (no sidebar)
│   │   ├── page.tsx                 ← Homepage
│   │   ├── about/page.tsx
│   │   ├── events/page.tsx
│   │   └── contact/page.tsx
│   │
│   ├── portal/
│   │   ├── layout.tsx               ← Portal layout (sidebar + auth guard)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── pending/page.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── feed/page.tsx
│   │   ├── messages/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── events/page.tsx
│   │   ├── ctf/page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── profile/page.tsx
│   │   └── admin/page.tsx
│   │
│   └── api/
│       ├── auth/
│       │   └── register/route.ts    ← POST: Create user + member row
│       ├── admin/
│       │   └── members/
│       │       └── approve/route.ts ← PATCH: Approve/reject/update role
│       └── contact/
│           └── route.ts             ← POST: Contact form → Resend
│
├── components/
│   ├── ui/                          ← Reusable primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   └── LoadingSpinner.tsx
│   ├── public/                      ← Public site components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   └── EventCard.tsx
│   └── portal/                      ← Portal components
│       ├── Sidebar.tsx
│       ├── DashboardStats.tsx
│       ├── PostCard.tsx
│       ├── MessageThread.tsx
│       └── AdminMemberRow.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                ← Browser client (anon key only)
│   │   ├── server.ts                ← Server client (service role — NEVER import in components)
│   │   └── middleware.ts            ← Middleware Supabase client
│   ├── validations/
│   │   ├── auth.ts                  ← Zod schemas: signup, login
│   │   └── admin.ts                 ← Zod schemas: approve action
│   └── email/
│       └── templates.ts             ← Resend email templates
│
├── types/
│   └── database.ts                  ← All DB types (auto-generated or hand-written)
│
├── middleware.ts                     ← Route protection (root level)
└── .env.local                        ← Environment variables (never commit)
```

---

## 6. ENVIRONMENT VARIABLES

```env
# ─── Supabase ─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...          # Safe for browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...              # ⚠️ SERVER ONLY — never expose to client

# ─── Email ────────────────────────────────────────────────
RESEND_API_KEY=re_...

# ─── App ──────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000    # Change to production URL on deploy
```

> **Rule:** `SUPABASE_SERVICE_ROLE_KEY` must NEVER appear in any file inside `components/`, `app/(public)/`, or any client component (`'use client'`). Only use it inside `app/api/` or `lib/supabase/server.ts`.

---

## 7. COMPLETE DATABASE SCHEMA

Run this entire block in the Supabase SQL Editor **in order**. Do not skip any statement.

```sql
-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- MEMBERS
-- =============================================
CREATE TABLE IF NOT EXISTS members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name     text NOT NULL CHECK (char_length(full_name) >= 2),
  email         text UNIQUE NOT NULL,
  student_id    text UNIQUE,
  club_post     text DEFAULT 'General Member',
  role          text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'bod', 'admin', 'superadmin')),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'banned')),
  bio           text,
  avatar_url    text,
  skills        text[] DEFAULT '{}',
  points        integer DEFAULT 0 CHECK (points >= 0),
  joined_at     timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- =============================================
-- POSTS & FEED
-- =============================================
CREATE TABLE IF NOT EXISTS posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title       text,
  content     text NOT NULL CHECK (char_length(content) >= 1),
  type        text DEFAULT 'post' CHECK (type IN ('post', 'announcement', 'resource')),
  is_pinned   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- =============================================
-- POST REACTIONS
-- =============================================
CREATE TABLE IF NOT EXISTS post_reactions (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id   uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  member_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  emoji     text NOT NULL DEFAULT '👍',
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, member_id, emoji)
);

-- =============================================
-- DIRECT MESSAGES
-- =============================================
CREATE TABLE IF NOT EXISTS messages (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  receiver_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content      text NOT NULL CHECK (char_length(content) >= 1),
  is_read      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  CHECK (sender_id <> receiver_id)
);

-- =============================================
-- DOCUMENTS
-- =============================================
CREATE TABLE IF NOT EXISTS documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id  uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  title        text NOT NULL,
  description  text,
  file_url     text NOT NULL,
  file_type    text NOT NULL CHECK (file_type IN ('pdf', 'docx', 'zip', 'txt', 'md')),
  file_size    bigint,
  category     text DEFAULT 'general' CHECK (category IN ('general', 'writeup', 'resource', 'official')),
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE IF NOT EXISTS events (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  event_type    text DEFAULT 'workshop' CHECK (event_type IN ('workshop', 'ctf', 'seminar', 'meetup', 'competition')),
  location      text,
  starts_at     timestamptz NOT NULL,
  ends_at       timestamptz,
  banner_url    text,
  is_public     boolean DEFAULT true,
  created_by    uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at    timestamptz DEFAULT now()
);

-- =============================================
-- EVENT REGISTRATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS event_registrations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- =============================================
-- CTF CHALLENGES
-- =============================================
CREATE TABLE IF NOT EXISTS ctf_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  description  text NOT NULL,
  category     text NOT NULL CHECK (category IN ('web', 'crypto', 'forensics', 'pwn', 'reverse', 'osint', 'misc')),
  difficulty   text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  points       integer NOT NULL DEFAULT 100 CHECK (points > 0),
  flag         text NOT NULL,
  hints        text[] DEFAULT '{}',
  file_url     text,
  is_active    boolean DEFAULT true,
  created_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- CTF SUBMISSIONS
-- =============================================
CREATE TABLE IF NOT EXISTS ctf_submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES ctf_challenges(id) ON DELETE CASCADE,
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  submitted_flag text NOT NULL,
  is_correct   boolean NOT NULL DEFAULT false,
  points_awarded integer DEFAULT 0,
  submitted_at timestamptz DEFAULT now(),
  UNIQUE(challenge_id, member_id)            -- one correct submission per member per challenge
);

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title      text NOT NULL,
  body       text NOT NULL,
  type       text DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read    boolean DEFAULT false,
  link       text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- UPDATED_AT TRIGGER (applies to members, posts)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- CTF POINTS AUTO-UPDATE TRIGGER
-- =============================================
CREATE OR REPLACE FUNCTION award_ctf_points()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_correct = true AND OLD.is_correct = false THEN
    UPDATE members
    SET points = points + NEW.points_awarded
    WHERE id = NEW.member_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ctf_award_points
  AFTER UPDATE ON ctf_submissions
  FOR EACH ROW EXECUTE FUNCTION award_ctf_points();

-- =============================================
-- INDEXES (Performance)
-- =============================================
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_ctf_submissions_member ON ctf_submissions(member_id);
CREATE INDEX IF NOT EXISTS idx_notifications_member ON notifications(member_id);
```

---

## 8. SUPABASE STORAGE BUCKETS

| Bucket Name | Visibility | Allowed MIME Types | Max Size | Usage |
|---|---|---|---|---|
| `club-documents` | Private | `application/pdf`, `application/zip`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 50 MB | Member docs, writeups |
| `public-gallery` | Public | `image/jpeg`, `image/png`, `image/webp` | 10 MB | Event photos |
| `team-avatars` | Public | `image/jpeg`, `image/png`, `image/webp` | 5 MB | Profile photos |

Create these in the Supabase Dashboard → Storage → New Bucket. Set the appropriate public/private toggle.

---

## 9. ROW-LEVEL SECURITY (RLS) POLICIES

Run in Supabase SQL Editor **after** creating tables.

```sql
-- =============================================
-- MEMBERS TABLE
-- =============================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Any approved member can view the members list
CREATE POLICY "approved_members_can_view_members"
  ON members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members m
      WHERE m.user_id = auth.uid() AND m.status = 'approved'
    )
  );

-- Members can update only their own profile (not role/status)
CREATE POLICY "member_can_update_own_profile"
  ON members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND role = (SELECT role FROM members WHERE user_id = auth.uid())
    AND status = (SELECT status FROM members WHERE user_id = auth.uid())
  );

-- Only service role can insert (via API route)
CREATE POLICY "service_role_insert_members"
  ON members FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- Only service role can update role/status (admin actions go via API)
CREATE POLICY "service_role_admin_update"
  ON members FOR UPDATE
  USING (auth.role() = 'service_role');

-- =============================================
-- POSTS TABLE
-- =============================================
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approved_members_read_posts"
  ON posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

CREATE POLICY "bod_and_above_create_posts"
  ON posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND status = 'approved'
        AND role IN ('bod', 'admin', 'superadmin')
    )
  );

CREATE POLICY "author_can_update_own_post"
  ON posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid() AND id = posts.author_id
    )
  );

CREATE POLICY "admin_can_delete_any_post"
  ON posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND status = 'approved'
        AND role IN ('admin', 'superadmin')
    )
  );

-- =============================================
-- MESSAGES TABLE
-- =============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_see_own_messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid()
        AND (id = messages.sender_id OR id = messages.receiver_id)
        AND status = 'approved'
    )
  );

CREATE POLICY "approved_members_send_messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid() AND id = messages.sender_id AND status = 'approved'
    )
  );

-- =============================================
-- CTF CHALLENGES TABLE
-- =============================================
ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approved_members_view_active_challenges"
  ON ctf_challenges FOR SELECT
  USING (
    is_active = true AND
    EXISTS (
      SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
    )
  );

-- =============================================
-- CTF SUBMISSIONS TABLE
-- =============================================
ALTER TABLE ctf_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_see_own_submissions"
  ON ctf_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members WHERE user_id = auth.uid() AND id = ctf_submissions.member_id
    )
  );

CREATE POLICY "approved_members_submit_flags"
  ON ctf_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE user_id = auth.uid() AND id = ctf_submissions.member_id AND status = 'approved'
    )
  );

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_view_own_notifications"
  ON notifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members WHERE user_id = auth.uid() AND id = notifications.member_id
    )
  );
```

---

## 10. AUTHENTICATION & MIDDLEWARE

### 10.1 Supabase Client Files

**`lib/supabase/client.ts`** — Browser only (anon key)
```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**`lib/supabase/server.ts`** — Server only (service role)
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
        set(name, value, options) { cookieStore.set({ name, value, ...options }) },
        remove(name, options) { cookieStore.set({ name, value: '', ...options }) },
      }
    }
  )
}

// Service role — for admin API routes only
export function createAdminSupabaseClient() {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: () => '', set: () => {}, remove: () => {} } }
  )
}
```

### 10.2 Middleware (`middleware.ts` — root level)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) { return request.cookies.get(name)?.value },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const pathname = request.nextUrl.pathname

  // Not authenticated → send to login (except login/signup/pending pages)
  if (!session && pathname.startsWith('/portal') &&
      !pathname.startsWith('/portal/login') &&
      !pathname.startsWith('/portal/signup') &&
      !pathname.startsWith('/portal/pending')) {
    return NextResponse.redirect(new URL('/portal/login', request.url))
  }

  // Authenticated → check member status
  if (session && pathname.startsWith('/portal') &&
      !pathname.startsWith('/portal/login') &&
      !pathname.startsWith('/portal/signup')) {
    const { data: member } = await supabase
      .from('members')
      .select('status, role')
      .eq('user_id', session.user.id)
      .single()

    if (!member) {
      return NextResponse.redirect(new URL('/portal/login', request.url))
    }

    if (member.status === 'pending' && !pathname.startsWith('/portal/pending')) {
      return NextResponse.redirect(new URL('/portal/pending', request.url))
    }

    if ((member.status === 'rejected' || member.status === 'banned') &&
        !pathname.startsWith('/portal/login')) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/portal/login?reason=access_denied', request.url))
    }

    if (pathname.startsWith('/portal/admin') && !['admin', 'superadmin'].includes(member.role)) {
      return NextResponse.redirect(new URL('/portal/dashboard', request.url))
    }
  }

  // Already logged in → skip login/signup pages
  if (session && (pathname === '/portal/login' || pathname === '/portal/signup')) {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/portal/:path*']
}
```

### 10.3 Role Hierarchy

| Role | DB Value | Capabilities |
|---|---|---|
| General Member | `member` | Read feed, access docs, play CTF, manage own profile |
| Board of Directors | `bod` | All member capabilities + create posts, manage events |
| Admin | `admin` | All BoD capabilities + approve/reject members, admin panel |
| Super Admin | `superadmin` | All admin capabilities + manage admins, cannot be removed |

---

## 11. FRONTEND ↔ BACKEND CONNECTION RULES

> This section defines exactly how data flows. Any deviation causes bugs.

### 11.1 Data Fetching Patterns

**Server Components (default — use for initial data loads):**
```typescript
// app/portal/dashboard/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null  // middleware handles redirect

  const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', session.user.id)
    .single()

  if (error || !member) return <div>Error loading profile</div>
  return <DashboardClient member={member} />
}
```

**Client Components (for interactivity — reactions, real-time, forms):**
```typescript
'use client'
import { createClient } from '@/lib/supabase/client'
```

### 11.2 API Routes — Authenticated

All API routes under `/api/admin/*` must verify session AND role before any DB operation:

```typescript
// Pattern for all admin API routes
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(req: NextRequest) {
  // 1. Verify session
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 2. Verify role
  const { data: caller } = await supabase
    .from('members')
    .select('role, status')
    .eq('user_id', session.user.id)
    .single()

  if (!caller || !['admin', 'superadmin'].includes(caller.role) || caller.status !== 'approved') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // 3. Validate input with Zod
  // 4. Execute with admin client (service role)
  const adminClient = createAdminSupabaseClient()
  // ... DB operations
}
```

### 11.3 Form Submission Pattern

```typescript
'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function PostForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error } = await supabase.from('posts').insert({ content: '...' })
      if (error) throw error
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  // ...
}
```

---

## 12. FEATURE SPECIFICATIONS

### 12.1 Self-Registration & Approval Flow

1. User visits `/portal/signup`
2. Form fields: `full_name` (required), `email` (required), `password` (min 8 chars, required), `confirm_password`, `student_id` (optional), `requested_club_post` (text field)
3. On submit → POST `/api/auth/register`
4. API creates Supabase Auth user, then inserts into `members` with `status: 'pending'`, `role: 'member'`
5. User is redirected to `/portal/pending`
6. Admin approves in Admin Panel → `status` updated to `'approved'` → welcome email sent via Resend

### 12.2 Member Dashboard

- Background: `bg-[#F9FAFB]`
- Stat cards: Points, Challenges Solved, Posts, Events Attended — all cards use IIMS Card primitive
- BoD members see an additional "Quick Actions" panel: "New Post", "Create Event"
- Data fetched server-side on page load, real-time reactions fetched client-side

### 12.3 CTF Module

- Flag submission: POST to `ctf_submissions` via API route (not direct client insert — flag must be verified server-side)
- Points awarded automatically via DB trigger (§7)
- Leaderboard: `SELECT member_id, sum(points_awarded) FROM ctf_submissions WHERE is_correct = true GROUP BY member_id ORDER BY sum DESC`
- Flags must never be returned to client — CTF challenge queries must never include the `flag` column

---

## 13. ADMIN PANEL SPECIFICATION

Route: `/portal/admin` — Requires `role IN ('admin', 'superadmin')`

### 13.1 Tabs

| Tab | Function |
|---|---|
| Members | View all members, filter by status, approve/reject/ban |
| Posts | View all posts, pin/unpin, delete |
| Events | Create/edit/delete events |
| CTF | Create/edit/delete challenges |
| Documents | Upload/delete club documents |

### 13.2 Member Approval Workflow

1. Admin sees list of `status = 'pending'` members (highlighted in yellow badge)
2. Admin sets `role` via dropdown: `member` / `bod`
3. Admin sets `club_post` via text input (e.g., "Vice President")
4. Admin clicks "Approve" → PATCH `/api/admin/members/approve`
5. API validates admin role → updates `members` row → sends Resend welcome email
6. Rejected members: PATCH `/api/admin/members/approve` with `status: 'rejected'` → sends rejection email

### 13.3 Superadmin Protections

- `superadmin` role can never be changed by an `admin`
- Only another `superadmin` can modify a `superadmin`'s record
- Enforce this in the API route level check

---

## 14. API ROUTES REFERENCE

| Method | Route | Auth Required | Role | Description |
|---|---|---|---|---|
| POST | `/api/auth/register` | No | — | Create Supabase user + `members` row |
| PATCH | `/api/admin/members/approve` | Yes | `admin`/`superadmin` | Update member `status`, `role`, `club_post` |
| POST | `/api/contact` | No | — | Send contact form email via Resend |
| POST | `/api/ctf/submit` | Yes | `member`+ | Verify flag, insert submission, update points |

### `/api/auth/register` — Full Implementation

```typescript
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  student_id: z.string().optional(),
  club_post: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = registerSchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error.flatten() }, { status: 400 })
    }

    const { full_name, email, password, student_id, club_post } = validated.data
    const adminClient = createAdminSupabaseClient()

    // Create auth user
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,  // skip email confirmation — admin approves instead
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
      }
      throw authError
    }

    // Create member row
    const { error: memberError } = await adminClient.from('members').insert({
      user_id: authData.user.id,
      full_name,
      email,
      student_id: student_id || null,
      club_post: club_post || 'General Member',
      role: 'member',
      status: 'pending',
    })

    if (memberError) {
      // Rollback: delete auth user if member insert fails
      await adminClient.auth.admin.deleteUser(authData.user.id)
      throw memberError
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: unknown) {
    console.error('[register]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

---

## 15. REAL-TIME FEATURES

### Direct Messages

```typescript
'use client'
import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message } from '@/types/database'

export function useMessages(receiverId: string, onNew: (msg: Message) => void) {
  const supabase = createClient()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    channelRef.current = supabase
      .channel(`messages:${receiverId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${receiverId}`,
        },
        (payload) => onNew(payload.new as Message)
      )
      .subscribe()

    return () => {
      channelRef.current?.unsubscribe()
    }
  }, [receiverId])
}
```

### Post Reactions (Optimistic UI)

```typescript
// Update local state instantly, then sync to DB
async function handleReaction(postId: string, emoji: string) {
  // 1. Optimistic update
  setPosts(prev => prev.map(p => p.id === postId ? { ...p, reacted: true } : p))

  // 2. DB sync
  const { error } = await supabase.from('post_reactions').upsert({
    post_id: postId,
    member_id: currentMemberId,
    emoji,
  })

  // 3. Rollback on failure
  if (error) {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, reacted: false } : p))
  }
}
```

---

## 16. EMAIL TEMPLATES (Resend)

All emails use IIMS branding: Maroon `#58151C` header, IIMS Red `#C3161C` CTA buttons, white body.

```typescript
// lib/email/templates.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, name: string) {
  return resend.emails.send({
    from: 'IIMS Cybersecurity Club <cybersec@iimscollege.edu.np>',
    to,
    subject: 'Welcome to IIMS Cybersecurity Club!',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#58151C;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-family:Poppins,sans-serif">IIMS Cybersecurity Club</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#111827">Welcome, ${name}!</h2>
          <p style="color:#6B7280">Your account has been approved. You now have full access to the member portal.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/portal/dashboard"
             style="display:inline-block;background:#C3161C;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
            Access Portal
          </a>
        </div>
      </div>
    `
  })
}

export async function sendRejectionEmail(to: string, name: string) {
  return resend.emails.send({
    from: 'IIMS Cybersecurity Club <cybersec@iimscollege.edu.np>',
    to,
    subject: 'IIMS Cybersecurity Club — Application Update',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:560px;margin:0 auto">
        <div style="background:#58151C;padding:24px;text-align:center">
          <h1 style="color:#fff;margin:0;font-family:Poppins,sans-serif">IIMS Cybersecurity Club</h1>
        </div>
        <div style="padding:32px;background:#fff">
          <h2 style="color:#111827">Dear ${name},</h2>
          <p style="color:#6B7280">After review, we are unable to approve your application at this time. Please contact us at cybersec@iimscollege.edu.np for more information.</p>
        </div>
      </div>
    `
  })
}
```

---

## 17. TYPE DEFINITIONS

`types/database.ts` — Keep in sync with DB schema.

```typescript
export type MemberRole = 'member' | 'bod' | 'admin' | 'superadmin'
export type MemberStatus = 'pending' | 'approved' | 'rejected' | 'banned'
export type PostType = 'post' | 'announcement' | 'resource'
export type CTFCategory = 'web' | 'crypto' | 'forensics' | 'pwn' | 'reverse' | 'osint' | 'misc'
export type CTFDifficulty = 'easy' | 'medium' | 'hard' | 'expert'
export type EventType = 'workshop' | 'ctf' | 'seminar' | 'meetup' | 'competition'

export interface Member {
  id: string
  user_id: string
  full_name: string
  email: string
  student_id: string | null
  club_post: string
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
  author?: Member  // join
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface CTFChallenge {
  id: string
  title: string
  description: string
  category: CTFCategory
  difficulty: CTFDifficulty
  points: number
  // flag is NEVER returned to client — omit from client-side types
  hints: string[]
  file_url: string | null
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface Notification {
  id: string
  member_id: string
  title: string
  body: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  link: string | null
  created_at: string
}

// Database shape for Supabase client typing
export type Database = {
  public: {
    Tables: {
      members: { Row: Member; Insert: Partial<Member>; Update: Partial<Member> }
      posts: { Row: Post; Insert: Partial<Post>; Update: Partial<Post> }
      messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> }
      ctf_challenges: { Row: CTFChallenge; Insert: Partial<CTFChallenge>; Update: Partial<CTFChallenge> }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
    }
  }
}
```

---

## 18. CODING RULES & STANDARDS

### TypeScript
- `"strict": true` in `tsconfig.json` — no exceptions
- No `any` types — use `unknown` and narrow with type guards
- All function return types must be explicit
- All API route handlers must be typed with `NextRequest` / `NextResponse`

### Components
- Every page defaults to **Server Component** — add `'use client'` only when needed (hooks, event handlers, browser APIs)
- Never call Supabase service role client from a Client Component
- All form inputs must have `aria-label` or associated `<label>` — accessibility is required

### Data Fetching
- Always use `.range(from, to)` for lists with potentially many rows (feed, members, leaderboard)
- Default page size: `20` items
- Always handle both `data` and `error` from Supabase calls — never assume success

### Imports
- Use `@/` path aliases — never relative paths like `../../`
- Import order: React → Next.js → third-party → internal (`@/lib`, `@/components`, `@/types`)

---

## 19. SECURITY CHECKLIST

- [ ] `SUPABASE_SERVICE_ROLE_KEY` never in any client-facing file
- [ ] Every admin API route verifies session + role before any DB write
- [ ] CTF flag column never selected in any client query
- [ ] RLS enabled on all tables
- [ ] All user inputs validated with Zod before DB insertion
- [ ] Password minimum 8 characters enforced at Zod + Supabase level
- [ ] `rejected` and `banned` members are signed out at middleware level
- [ ] File uploads validated by MIME type and file size at API level
- [ ] No SQL string concatenation — always use Supabase parameterized queries
- [ ] `superadmin` role is immutable by `admin` role (enforced in API)

---

## 20. ERROR HANDLING PATTERNS

### Client-Side
```typescript
const [error, setError] = useState<string | null>(null)

// In async handlers:
try {
  const { error } = await supabase.from('posts').insert(...)
  if (error) throw error
} catch (err: unknown) {
  setError(err instanceof Error ? err.message : 'Something went wrong')
}
```

### Server-Side (API Routes)
```typescript
// Always return structured errors
return NextResponse.json({ error: 'Descriptive message' }, { status: 400 })
// Never expose raw DB errors to client — log them server-side
console.error('[route-name]', err)
return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
```

### Supabase Query Pattern
```typescript
const { data, error } = await supabase.from('members').select('*').eq('id', id).single()
if (error) {
  // Handle: log error, return fallback UI or redirect
  console.error('[members fetch]', error.message)
  return null
}
// data is now typed and safe to use
```

---

## 21. PERFORMANCE RULES

- Use Next.js Server Components for all initial data loads — reduces client JS bundle
- Paginate all list queries: `.range(page * 20, page * 20 + 19)`
- Use `select('id, full_name, avatar_url')` — never `select('*')` in list queries; fetch only needed columns
- Images from `public-gallery` bucket: Use `next/image` with `sizes` prop
- Realtime subscriptions: Always unsubscribe in `useEffect` cleanup
- Memoize expensive computations with `useMemo` — especially leaderboard sorting

---

## 22. COMMON BUGS TO AVOID

| Bug | Root Cause | Fix |
|---|---|---|
| Middleware infinite redirect loop | Missing exclusion for `/portal/pending` | Always exclude `/portal/pending`, `/portal/login`, `/portal/signup` from auth redirects |
| `members` row not found after signup | Race condition between auth user creation and member insert | Always use admin client for registration; insert member in same API route |
| CTF flag exposed to client | Using `select('*')` on ctf_challenges | Always use `select('id, title, description, category, difficulty, points, hints, file_url, is_active')` — never include `flag` |
| Realtime subscription memory leak | No cleanup in useEffect | Always return `() => channel.unsubscribe()` from useEffect |
| Service role key in client bundle | Importing `server.ts` from a client component | Only import server client inside `app/api/` or Server Components |
| Broken pagination | Using `.limit()` alone | Always use `.range(from, to)` for correct offset pagination |
| Role check bypass | Only checking `role`, not `status` | Always check BOTH `role IN (...)` AND `status = 'approved'` |
| Double signup | No unique constraint on email | `email UNIQUE` enforced at DB level + catch `409` in API |

---

## 23. QUICK REFERENCE — DO / DON'T

| ✅ DO | ❌ DON'T |
|---|---|
| Use `bg-[#C3161C]` for primary actions | Use default Tailwind blue, green, or purple |
| Use Email + Password auth | Use magic links or OAuth |
| Register users via API route with service role | Insert directly from client with anon key |
| Validate all inputs with Zod | Trust raw request bodies |
| Check `role` AND `status` in every RLS policy | Check only role |
| Paginate all list queries | Fetch unlimited rows |
| Use Server Components for data fetching | Fetch data in Client Components unnecessarily |
| Return from `useEffect` with `channel.unsubscribe()` | Leave realtime subscriptions open |
| Handle both `data` and `error` from Supabase | Assume Supabase calls always succeed |
| Exclude CTF `flag` column from client queries | Use `select('*')` on ctf_challenges |
| Use `@/` import aliases | Use relative `../../` imports |
| Keep `SUPABASE_SERVICE_ROLE_KEY` server-only | Import server client in any component file |
| Rollback auth user creation if member insert fails | Leave orphaned auth users in Supabase |