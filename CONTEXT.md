# CONTEXT.md — IIMS Cybersecurity Club Portal
> **Version:** 3.0.0 | **Architecture:** Production-Ready, Security-Hardened
> **College Website:** https://iimscollege.edu.np/
> **Single source of truth.** Every AI session and every contributor MUST read this before writing a single line of code.

---

## TABLE OF CONTENTS

1. [Project Identity & Brand Alignment](#1-project-identity--brand-alignment)
2. [Project Overview & Feature Map](#2-project-overview--feature-map)
3. [Tech Stack](#3-tech-stack)
4. [Design System — IIMS Stealth Terminal](#4-design-system--iims-stealth-terminal)
5. [Folder Structure](#5-folder-structure)
6. [Environment Variables](#6-environment-variables)
7. [Complete Database Schema (Security-Hardened)](#7-complete-database-schema-security-hardened)
8. [Supabase Storage Buckets](#8-supabase-storage-buckets)
9. [Row-Level Security (RLS) Policies](#9-row-level-security-rls-policies)
10. [Authentication & Middleware](#10-authentication--middleware)
11. [Security Vulnerability Fixes (MANDATORY)](#11-security-vulnerability-fixes-mandatory)
12. [Feature Specifications](#12-feature-specifications)
13. [Admin Panel Specification](#13-admin-panel-specification)
14. [API Routes Reference](#14-api-routes-reference)
15. [Real-Time Features](#15-real-time-features)
16. [Email Templates (Resend)](#16-email-templates-resend)
17. [Rate Limiting Strategy](#17-rate-limiting-strategy)
18. [Coding Rules & Standards](#18-coding-rules--standards)
19. [Performance & Scalability Rules](#19-performance--scalability-rules)
20. [Implementation Plan (Ordered Build Sequence)](#20-implementation-plan-ordered-build-sequence)
21. [Security Checklist](#21-security-checklist)
22. [Quick Reference — DO / DON'T](#22-quick-reference--do--dont)

---

## 1. PROJECT IDENTITY & BRAND ALIGNMENT

| Field | Value |
|---|---|
| Club Name | IIMS Cybersecurity Club |
| College | IIMS College, Kathmandu, Nepal |
| College Website | https://iimscollege.edu.np/ |
| Club Email | cybersec@iimscollege.edu.np |
| Project Folder | `iims-cyber-club` |
| Domain Structure | Single domain — portal at `/portal/*` |
| Architecture Level | Production-Ready, Security-Hardened |
| Design Language | IIMS Stealth Terminal (college-branded cyber dark theme) |

### 1.1 IIMS College Brand Context
IIMS College offers programs in IT (BCS Hons), Business, and Hospitality. They actively run a **Capture The Flag** program (`/iims-hackathon`, `/capture-the-flag`) and an **IT Club**. The cybersecurity club portal must feel like an official, premium IIMS sub-product — not a generic side project. The design blends IIMS's professional academic identity with a hacker/cybersecurity aesthetic.

---

## 2. PROJECT OVERVIEW & FEATURE MAP

One Next.js 14 project. Two experiences. One domain.

### 2.1 Public Website (`/`) — Anyone on the internet

| Page | Route | Description |
|---|---|---|
| Homepage | `/` | Hero with IIMS branding, club intro, live stats, featured events |
| About | `/about` | Team, mission, IIMS affiliation, club history, gallery |
| Events | `/events` | Public event listings (workshops, CTFs, seminars) |
| Contact | `/contact` | Contact form with rate limiting |

### 2.2 Private Member Portal (`/portal/*`) — Approved members only

| Feature | Route | Access Level |
|---|---|---|
| Login | `/portal/login` | Public |
| Registration Complete | `/portal/register` | Post-magic-link, pre-approval |
| Pending Approval | `/portal/pending` | Registered, unapproved |
| Dashboard | `/portal/dashboard` | `approved` members |
| Post Feed | `/portal/feed` | `approved` members |
| Direct Messages List | `/portal/messages` | `approved` members |
| DM Thread | `/portal/messages/[conversationId]` | `approved` members |
| Notifications | `/portal/notifications` | `approved` members |
| Documents | `/portal/documents` | `approved` members |
| Events Portal | `/portal/events` | `approved` members |
| Event Detail + RSVP | `/portal/events/[id]` | `approved` members |
| CTF Challenges | `/portal/ctf` | `approved` members |
| CTF Challenge Detail | `/portal/ctf/[challengeId]` | `approved` members |
| Leaderboard | `/portal/leaderboard` | `approved` members |
| Own Profile | `/portal/profile` | `approved` members |
| View Member Profile | `/portal/members/[id]` | `approved` members |
| Admin Panel | `/portal/admin` | `admin` / `superadmin` only |

---

## 3. TECH STACK

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 14 (App Router) | Server Components by default |
| Language | TypeScript | 5.x strict | No `.js` / `.jsx` files — ever |
| Styling | Tailwind CSS | 3.x | Arbitrary hex values for brand colors |
| Database | Supabase (PostgreSQL) | Latest | All data storage |
| Auth | Supabase Magic Link | — | Email-only, no passwords |
| Real-Time | Supabase Realtime | — | DMs, notifications, live reactions |
| File Storage | Supabase Storage | — | 5 buckets (see Section 8) |
| Email | Resend | Latest | Magic links, welcome, notifications |
| Hosting | Vercel | — | Edge middleware supported |
| Rate Limiting | Upstash Redis | Latest | `@upstash/ratelimit` + `@upstash/redis` |
| Markdown | `react-markdown` + `remark-gfm` | Latest | Posts, event descriptions |
| Notifications UI | Custom `Toast.tsx` | — | Non-blocking, bottom-right |
| Date Handling | `date-fns` | Latest | Formatting, relative time |
| Form Validation | `zod` | Latest | Schema validation everywhere |
| Icons | `lucide-react` | Latest | Only icon library permitted |
| Security | `server-only` package | Latest | Prevents server files leaking to client |
| Type Safety | `supabase gen types` | — | Auto-generated DB types |

---

## 4. DESIGN SYSTEM — IIMS STEALTH TERMINAL

> **CRITICAL RULE:** This is a **dark-only** design system. It is inspired by IIMS College's professional maroon/navy brand identity fused with a hacker terminal aesthetic. No `bg-white`. No `bg-gray-*`. No light mode. No external UI libraries.

### 4.1 IIMS Brand Color Extraction
From https://iimscollege.edu.np/ — the college uses deep maroon/burgundy as primary brand color, navy/dark blue as secondary, and gold/amber accents. The cybersecurity club inherits this but darkens and "terminalifies" it.

### 4.2 Full Color Palette

| Token Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| **Pure Black** | `#000000` | `bg-black` | Page backgrounds |
| **Matte Dark** | `#0A0A0F` | `bg-[#0A0A0F]` | Cards, surfaces, modals |
| **Elevated Surface** | `#12121A` | `bg-[#12121A]` | Hover states, nested panels |
| **Deep Navy** | `#0D1B2A` | `bg-[#0D1B2A]` | Secondary surfaces (IIMS brand echo) |
| **Border Dark** | `#1E1E2E` | `border-[#1E1E2E]` | Subtle borders |
| **Border Visible** | `#2D2D44` | `border-[#2D2D44]` | Active borders, dividers |
| **IIMS Maroon** | `#8B1A1A` | `text-[#8B1A1A]` `bg-[#8B1A1A]` | IIMS brand accent, special badges |
| **IIMS Maroon Light** | `#C0392B` | `text-[#C0392B]` | Maroon highlights, active states |
| **Terminal Emerald** | `#00FF87` | `text-[#00FF87]` `bg-[#00FF87]` | Primary CTA, success, online dot |
| **Emerald Dim** | `#10B981` | `text-[#10B981]` | Secondary success, solved badges |
| **Hacker Cyan** | `#00D4FF` | `text-[#00D4FF]` | Tags, badges, links, highlights |
| **Cyan Dim** | `#06B6D4` | `text-[#06B6D4]` | Secondary cyan usage |
| **IIMS Gold** | `#D4AF37` | `text-[#D4AF37]` | Leaderboard #1, premium badges, IIMS brand echo |
| **Danger Red** | `#FF3333` | `text-[#FF3333]` `bg-[#FF3333]` | Errors, delete, reject, ban |
| **Warning Amber** | `#F59E0B` | `text-[#F59E0B]` | Warnings, pending, medium difficulty |
| **Ghost White** | `#F0F0FF` | `text-[#F0F0FF]` | Primary readable text |
| **Muted Slate** | `#8888AA` | `text-[#8888AA]` | Subtitles, timestamps, placeholders |
| **Invisible** | `transparent` | `bg-transparent` | Ghost buttons |

### 4.3 UI Primitives (Copy-Paste Ready)

```
PAGE BG:        bg-black min-h-screen

CARD:           bg-[#0A0A0F] border border-[#2D2D44] rounded-lg p-6
CARD (hover):   hover:bg-[#12121A] hover:border-[#00FF87]/30 transition-all duration-200
CARD (navy):    bg-[#0D1B2A] border border-[#2D2D44] rounded-lg p-6

INPUT:          bg-[#0A0A0F] border border-[#2D2D44] text-[#F0F0FF] rounded-md px-3 py-2
                focus:outline-none focus:border-[#00FF87] focus:ring-1 focus:ring-[#00FF87]/20
                placeholder:text-[#8888AA] w-full font-mono text-sm transition-colors
TEXTAREA:       Same as INPUT — add resize-none
SELECT:         Same as INPUT

BTN PRIMARY:    bg-[#00FF87] text-black font-mono font-bold px-5 py-2.5 rounded-md
                hover:bg-[#00e87a] active:scale-95 disabled:opacity-40
                disabled:cursor-not-allowed transition-all duration-150
BTN SECONDARY:  border border-[#2D2D44] text-[#F0F0FF] font-mono px-5 py-2.5 rounded-md
                hover:bg-[#12121A] hover:border-[#00FF87]/50 transition-all
BTN DANGER:     bg-[#FF3333] text-white font-mono font-bold px-5 py-2.5 rounded-md
                hover:bg-[#e02020] active:scale-95 disabled:opacity-40 transition-all
BTN GHOST:      text-[#8888AA] font-mono px-4 py-2 rounded-md
                hover:text-[#F0F0FF] hover:bg-[#12121A] transition-all
BTN IIMS:       bg-[#8B1A1A] text-white font-mono font-bold px-5 py-2.5 rounded-md
                hover:bg-[#C0392B] transition-all                   ← For IIMS-branded CTAs

BADGE (cyan):   text-[#00D4FF] bg-[#00D4FF]/10 border border-[#00D4FF]/30
                font-mono text-xs px-2 py-0.5 rounded-full
BADGE (green):  text-[#00FF87] bg-[#00FF87]/10 border border-[#00FF87]/30
BADGE (red):    text-[#FF3333] bg-[#FF3333]/10 border border-[#FF3333]/30
BADGE (amber):  text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/30
BADGE (gold):   text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/30
BADGE (maroon): text-[#C0392B] bg-[#8B1A1A]/20 border border-[#8B1A1A]/40

MODAL OVERLAY:  fixed inset-0 z-50 flex items-center justify-center
                bg-black/85 backdrop-blur-md
MODAL PANEL:    bg-[#0A0A0F] border border-[#2D2D44] rounded-xl p-6 max-w-lg w-full mx-4
                shadow-2xl shadow-black/50

TOAST SUCCESS:  fixed bottom-4 right-4 z-50 bg-[#0A0A0F] border-l-4 border-[#00FF87]
                text-[#F0F0FF] px-4 py-3 rounded-md shadow-xl font-mono text-sm
                flex items-center gap-2
TOAST ERROR:    Same but border-[#FF3333]
TOAST WARN:     Same but border-[#F59E0B]
TOAST INFO:     Same but border-[#00D4FF]

SIDEBAR:        bg-[#0A0A0F] border-r border-[#1E1E2E] h-screen w-64 fixed left-0 top-0
                flex flex-col overflow-y-auto
NAV ITEM:       flex items-center gap-3 px-4 py-2.5 rounded-md font-mono text-sm
                text-[#8888AA] hover:text-[#F0F0FF] hover:bg-[#12121A] transition-all
NAV ITEM ACT:   text-[#00FF87] bg-[#00FF87]/10 hover:bg-[#00FF87]/15

DIVIDER:        border-t border-[#1E1E2E] my-4
SKELETON:       bg-[#1E1E2E] animate-pulse rounded-md
ONLINE DOT:     h-2 w-2 rounded-full bg-[#00FF87] animate-pulse

MSG BUBBLE SELF:  bg-[#00FF87]/15 border border-[#00FF87]/25 text-[#F0F0FF]
                  rounded-2xl rounded-br-sm px-4 py-2 max-w-xs ml-auto font-sans text-sm
MSG BUBBLE OTHER: bg-[#0A0A0F] border border-[#2D2D44] text-[#F0F0FF]
                  rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs font-sans text-sm

TERMINAL BLOCK: bg-black border border-[#2D2D44] rounded-md p-4 font-mono text-sm
                text-[#00FF87] overflow-x-auto
TERMINAL PROMPT: text-[#00D4FF] before:content-['$_']

LEADERBOARD #1: bg-[#D4AF37]/10 border-[#D4AF37]/40 text-[#D4AF37]
LEADERBOARD #2: bg-[#C0C0C0]/10 border-[#C0C0C0]/40 text-[#C0C0C0]
LEADERBOARD #3: bg-[#CD7F32]/10 border-[#CD7F32]/40 text-[#CD7F32]
```

### 4.4 Typography

| Font | Usage | Weights | Load via |
|---|---|---|---|
| **JetBrains Mono** | Headings, labels, badges, buttons, code, terminal | 400, 700 | `next/font/google` |
| **Inter** | Body text, paragraphs, form inputs, descriptions | 300, 400, 600 | `next/font/google` |

> Load fonts in `app/layout.tsx` using `next/font/google` — never via `<link>` tags in HTML.

### 4.5 IIMS Branding Integration Rules

- Public homepage header must show: IIMS College logo link (linking to https://iimscollege.edu.np/) + "Cybersecurity Club" wordmark
- Footer must include: "A club under IIMS College, Kathmandu" + link to https://iimscollege.edu.np/
- The `/about` page links to IIMS's CTF page: https://iimscollege.edu.np/capture-the-flag/
- The `/about` page links to the IT Club page: https://iimscollege.edu.np/it-club/
- IIMS Maroon (`#8B1A1A` / `#C0392B`) is used sparingly as a prestige/institutional accent

### 4.6 Prohibited Patterns

- ❌ `window.alert()` or `window.confirm()` → use `Modal.tsx` / `Toast.tsx`
- ❌ Infinite scroll without skeleton states
- ❌ Client-side filtering for datasets > 50 rows
- ❌ Any external UI library (Radix, MUI, Shadcn, Headless UI)
- ❌ Light mode styles (`bg-white`, `bg-gray-*`, `text-gray-900`)
- ❌ Raw `<img>` tags → use Next.js `<Image />`
- ❌ `console.log` in committed code
- ❌ `any` TypeScript type → use `unknown` and narrow
- ❌ `(supabase.from('table' as any) as any)` → always pass `Database` generic

### 4.7 Iconography

Use **Lucide React** exclusively. Sizes: `h-4 w-4` inline, `h-5 w-5` buttons, `h-6 w-6` nav.

---

## 5. FOLDER STRUCTURE

```
iims-cyber-club/
│
├── app/
│   ├── layout.tsx                           ← Root layout: fonts, ToastProvider, metadata
│   ├── globals.css                          ← Tailwind directives + custom scrollbar
│   │
│   ├── (public)/
│   │   ├── layout.tsx                       ← Public Navbar + Footer
│   │   ├── page.tsx                         ← Homepage
│   │   ├── about/page.tsx
│   │   ├── events/page.tsx
│   │   └── contact/page.tsx
│   │
│   └── portal/
│       ├── layout.tsx                       ← Auth gate → Sidebar shell
│       ├── login/page.tsx                   ← Magic link send form
│       ├── register/page.tsx                ← Complete profile after first login
│       ├── pending/page.tsx                 ← Awaiting approval screen
│       ├── dashboard/page.tsx
│       ├── feed/page.tsx
│       ├── messages/
│       │   ├── page.tsx
│       │   └── [conversationId]/page.tsx
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
│       └── admin/page.tsx
│
├── app/api/
│   ├── contact/route.ts                     ← Rate-limited public contact form
│   ├── auth/
│   │   └── register/route.ts               ← Profile completion (trigger-backed)
│   ├── admin/
│   │   ├── members/route.ts                 ← Approve/reject/ban (role-verified)
│   │   ├── posts/route.ts
│   │   ├── events/route.ts                  ← Zod-validated CRUD
│   │   ├── documents/route.ts
│   │   ├── ctf/route.ts                     ← Challenge management (flag hashed here)
│   │   ├── broadcast/route.ts               ← Bulk notification insert
│   │   ├── settings/route.ts
│   │   └── export-csv/route.ts
│   ├── messages/
│   │   ├── route.ts
│   │   └── [conversationId]/route.ts
│   ├── notifications/route.ts
│   ├── ctf/
│   │   └── submit/route.ts                  ← Flag comparison SERVER-SIDE ONLY
│   └── upload/route.ts                      ← Signed URL generation (server-side)
│
├── components/
│   ├── ui/
│   │   ├── Modal.tsx                        ← Replaces window.confirm
│   │   ├── ConfirmModal.tsx                 ← "Are you sure?" pattern
│   │   ├── Toast.tsx
│   │   ├── ToastProvider.tsx                ← Global toast context
│   │   ├── Pagination.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx                       ← With IIMS-branded fallback initials
│   │   ├── MarkdownEditor.tsx               ← Write + preview tabs
│   │   └── MarkdownRenderer.tsx            ← Sanitized render
│   ├── public/
│   │   ├── Navbar.tsx                       ← IIMS logo + club name
│   │   ├── Footer.tsx                       ← IIMS affiliation footer
│   │   ├── HeroSection.tsx                  ← Terminal animation hero
│   │   ├── EventCard.tsx
│   │   └── ContactForm.tsx
│   └── portal/
│       ├── Sidebar.tsx                      ← Nav + unread badges
│       ├── PostCard.tsx
│       ├── PostComposer.tsx
│       ├── MessageThread.tsx
│       ├── ConversationList.tsx
│       ├── NotificationItem.tsx
│       ├── CTFChallengeCard.tsx
│       ├── FlagSubmitForm.tsx
│       ├── LeaderboardTable.tsx
│       ├── MemberCard.tsx
│       ├── EventCard.tsx
│       └── admin/
│           ├── AdminOverviewTab.tsx
│           ├── AdminMembersTab.tsx
│           ├── AdminPostsTab.tsx
│           ├── AdminEventsTab.tsx
│           ├── AdminDocumentsTab.tsx
│           ├── AdminCTFTab.tsx
│           ├── AdminLeaderboardTab.tsx
│           ├── AdminGalleryTab.tsx
│           ├── AdminBroadcastTab.tsx
│           ├── AdminContactTab.tsx
│           ├── AdminAuditTab.tsx
│           ├── AdminSettingsTab.tsx
│           └── AdminPendingTab.tsx
│
├── lib/
│   ├── supabase.ts                          ← Browser client (ANON key ONLY)
│   ├── supabase-server.ts                   ← Server client (SERVICE ROLE KEY ONLY)
│   ├── resend.ts                            ← Resend client (server-only)
│   ├── ratelimit.ts                         ← Upstash Redis rate limiter instances
│   ├── auth.ts                              ← getSession(), getMember(), assertRole()
│   ├── crypto.ts                            ← hashFlag() using Node crypto SHA256
│   ├── validations.ts                       ← ALL Zod schemas
│   └── utils.ts                             ← formatDate, truncate, cn()
│
├── hooks/
│   ├── useToast.ts
│   ├── useModal.ts
│   ├── useRealtimeMessages.ts
│   └── useNotifications.ts
│
├── types/
│   └── database.ts                          ← Auto-generated by: supabase gen types typescript
│
├── middleware.ts
├── .env.local
└── CONTEXT.md
```

---

## 6. ENVIRONMENT VARIABLES

```env
# .env.local

# ── Supabase ──────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...        # Safe for browser
SUPABASE_SERVICE_ROLE_KEY=eyJ...            # ⚠️ SERVER ONLY — NEVER prefix NEXT_PUBLIC_

# ── Email ─────────────────────────────────────────────────
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@iimscollege.edu.np
RESEND_NOTIFY_EMAIL=cybersec@iimscollege.edu.np

# ── Rate Limiting (Upstash Redis) ─────────────────────────
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # → set to Vercel domain on production
NEXT_PUBLIC_COLLEGE_URL=https://iimscollege.edu.np/
```

---

## 7. COMPLETE DATABASE SCHEMA (SECURITY-HARDENED)

Run this in full in the **Supabase SQL Editor**. Order matters.

```sql
-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- For gen_random_bytes if needed

-- =============================================
-- MEMBERS
-- NOTE: user_id = auth.users.id (FK)
-- NOTE: id = club-internal UUID (PK)
-- These are TWO DIFFERENT UUIDs. Never conflate them.
-- All role checks use: .eq('user_id', session.user.id) — NOT .eq('id', ...)
-- =============================================
CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name     text NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email         text UNIQUE NOT NULL,
  student_id    text UNIQUE CHECK (length(student_id) <= 20),
  role          text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'admin', 'superadmin')),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'banned')),
  -- club_post MUST default to 'General Member'. Never trust client input.
  club_post     text NOT NULL DEFAULT 'General Member'
                CHECK (club_post IN (
                  'General Member', 'Web Security', 'Forensics', 'Cryptography',
                  'Penetration Testing', 'OSINT', 'Reverse Engineering', 'Malware Analysis'
                )),
  bio           text CHECK (length(bio) <= 500),
  avatar_url    text,
  github_url    text CHECK (github_url LIKE 'https://github.com/%' OR github_url IS NULL),
  linkedin_url  text CHECK (linkedin_url LIKE 'https://linkedin.com/%' OR linkedin_url IS NULL),
  skills        text[] DEFAULT '{}',
  -- Points are NEVER written by application code. Only the DB trigger writes points.
  points        integer DEFAULT 0 CHECK (points >= 0),
  joined_at     timestamptz DEFAULT now(),
  approved_at   timestamptz,
  approved_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  ban_reason    text,
  reject_reason text
);

-- =============================================
-- POSTS
-- =============================================
CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title       text CHECK (length(title) <= 200),
  content     text NOT NULL CHECK (length(content) BETWEEN 1 AND 10000),
  type        text DEFAULT 'post'
              CHECK (type IN ('post', 'announcement', 'resource')),
  is_pinned   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- =============================================
-- POST REACTIONS (one per member per post)
-- =============================================
CREATE TABLE post_reactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, member_id)
);

-- =============================================
-- POST COMMENTS
-- =============================================
CREATE TABLE post_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- DIRECT MESSAGES
-- =============================================
CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE conversation_participants (
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  member_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  last_read_at     timestamptz DEFAULT now(),
  PRIMARY KEY (conversation_id, member_id)
);

CREATE TABLE messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content          text NOT NULL CHECK (length(content) BETWEEN 1 AND 5000),
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
  title        text NOT NULL CHECK (length(title) <= 200),
  body         text CHECK (length(body) <= 500),
  link         text,
  is_read      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- DOCUMENTS
-- =============================================
CREATE TABLE documents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id    uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  title          text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  description    text CHECK (length(description) <= 1000),
  file_url       text NOT NULL,
  file_size      bigint CHECK (file_size > 0 AND file_size <= 52428800), -- max 50MB
  file_type      text,
  category       text DEFAULT 'general' CHECK (category IN (
    'general', 'study-material', 'writeup', 'presentation', 'report', 'other'
  )),
  is_public      boolean DEFAULT false,
  download_count integer DEFAULT 0 CHECK (download_count >= 0),
  created_at     timestamptz DEFAULT now()
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE public_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      uuid REFERENCES members(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  slug            text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description     text NOT NULL,
  short_desc      text CHECK (length(short_desc) <= 200),
  event_date      timestamptz NOT NULL,
  end_date        timestamptz,
  location        text CHECK (length(location) <= 300),
  meeting_link    text,
  cover_image_url text,
  type            text DEFAULT 'workshop' CHECK (type IN (
    'workshop', 'ctf', 'seminar', 'meetup', 'competition', 'other'
  )),
  max_attendees   integer CHECK (max_attendees > 0),
  is_published    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  CONSTRAINT end_after_start CHECK (end_date IS NULL OR end_date > event_date)
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
-- CRITICAL: 'flag' column stores SHA-256 hex digest ONLY.
-- Raw flag is NEVER stored. Comparison is SERVER-SIDE ONLY.
-- =============================================
CREATE TABLE ctf_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  title        text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  description  text NOT NULL,
  category     text NOT NULL CHECK (category IN (
    'web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc'
  )),
  difficulty   text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'insane')),
  points       integer NOT NULL CHECK (points > 0 AND points <= 10000),
  -- STORED AS SHA-256 HEX DIGEST — NEVER the raw flag
  flag_hash    text NOT NULL CHECK (length(flag_hash) = 64),
  flag_format  text DEFAULT 'IIMS{...}',
  hint         text CHECK (length(hint) <= 500),
  file_url     text,
  is_active    boolean DEFAULT false,
  solves_count integer DEFAULT 0 CHECK (solves_count >= 0),
  created_at   timestamptz DEFAULT now()
);
-- RENAME 'flag' to 'flag_hash' to make the security contract explicit in code

-- =============================================
-- CTF SOLVES (unique: one solve per member per challenge)
-- =============================================
CREATE TABLE ctf_solves (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES ctf_challenges(id) ON DELETE CASCADE,
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  solved_at    timestamptz DEFAULT now(),
  UNIQUE(challenge_id, member_id)
);

-- =============================================
-- CTF TRIGGER — ATOMIC points update
-- NEVER update points from application code. ONLY this trigger writes points.
-- This prevents TOCTOU race conditions completely.
-- =============================================
CREATE OR REPLACE FUNCTION fn_on_ctf_solve()
RETURNS TRIGGER AS $$
DECLARE
  v_points integer;
BEGIN
  -- Get challenge points
  SELECT points INTO v_points FROM ctf_challenges WHERE id = NEW.challenge_id;

  -- Atomic increment: no read-modify-write in app layer
  UPDATE members
    SET points = points + v_points
    WHERE id = NEW.member_id;

  -- Atomic increment solve count
  UPDATE ctf_challenges
    SET solves_count = solves_count + 1
    WHERE id = NEW.challenge_id;

  -- Auto-create notification for the solver
  INSERT INTO notifications (recipient_id, type, title, body, link)
  VALUES (
    NEW.member_id,
    'ctf_solved',
    'Flag Captured! 🏴',
    'You earned ' || v_points || ' points.',
    '/portal/leaderboard'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_ctf_solve
  AFTER INSERT ON ctf_solves
  FOR EACH ROW EXECUTE FUNCTION fn_on_ctf_solve();

-- =============================================
-- AUTH TRIGGER — Prevent orphaned auth users
-- When auth.users row is created, auto-create a pending members row.
-- This replaces the fragile application-layer rollback pattern.
-- =============================================
CREATE OR REPLACE FUNCTION fn_on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (user_id, email, full_name, status, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'),
    'pending',
    'member'
  )
  ON CONFLICT (user_id) DO NOTHING; -- Idempotent: safe to re-run
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_on_auth_user_created();

-- =============================================
-- GALLERY
-- =============================================
CREATE TABLE gallery_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid REFERENCES members(id) ON DELETE SET NULL,
  url         text NOT NULL,
  caption     text CHECK (length(caption) <= 300),
  event_id    uuid REFERENCES public_events(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
  email      text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject    text NOT NULL CHECK (length(subject) BETWEEN 5 AND 200),
  message    text NOT NULL CHECK (length(message) BETWEEN 10 AND 3000),
  ip_hash    text,           -- Hashed IP for rate limit auditing (never store raw IP in prod)
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   uuid REFERENCES members(id) ON DELETE SET NULL,
  action     text NOT NULL CHECK (length(action) <= 100),
  target_id  text,
  meta       jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- SITE SETTINGS
-- =============================================
CREATE TABLE site_settings (
  key        text PRIMARY KEY CHECK (key ~ '^[a-z_]+$'),
  value      text NOT NULL,
  updated_by uuid REFERENCES members(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('registration_open',  'true'),
  ('site_title',         'IIMS Cybersecurity Club'),
  ('hero_tagline',       'Hack the future. Secure the present.'),
  ('hero_subtext',       'Official cybersecurity club of IIMS College, Kathmandu.'),
  ('contact_email',      'cybersec@iimscollege.edu.np'),
  ('ctf_enabled',        'true'),
  ('college_url',        'https://iimscollege.edu.np/'),
  ('ctf_page_url',       'https://iimscollege.edu.np/capture-the-flag/');

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================
CREATE INDEX idx_members_user_id       ON members(user_id);       -- Critical for auth checks
CREATE INDEX idx_members_status        ON members(status);
CREATE INDEX idx_members_role          ON members(role);
CREATE INDEX idx_members_points        ON members(points DESC);
CREATE INDEX idx_posts_created         ON posts(created_at DESC);
CREATE INDEX idx_posts_author          ON posts(author_id);
CREATE INDEX idx_posts_pinned          ON posts(is_pinned DESC, created_at DESC);
CREATE INDEX idx_messages_conv         ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_conv_participants     ON conversation_participants(member_id);
CREATE INDEX idx_notifications_recip   ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_events_date           ON public_events(event_date DESC);
CREATE INDEX idx_events_published      ON public_events(is_published, event_date DESC);
CREATE INDEX idx_ctf_active            ON ctf_challenges(is_active);
CREATE INDEX idx_ctf_solves_member     ON ctf_solves(member_id);
CREATE INDEX idx_ctf_solves_challenge  ON ctf_solves(challenge_id);
CREATE INDEX idx_audit_created         ON audit_logs(created_at DESC);
CREATE INDEX idx_documents_category    ON documents(category);
```

---

## 8. SUPABASE STORAGE BUCKETS

| Bucket | Visibility | Max Size | Allowed MIME Types | Usage |
|---|---|---|---|---|
| `club-documents` | **Private** | 50MB | `application/pdf`, `application/zip`, `application/vnd.*` | Member docs, writeups |
| `public-gallery` | Public | 10MB | `image/jpeg`, `image/png`, `image/webp` | Event photos, gallery |
| `event-images` | Public | 5MB | `image/jpeg`, `image/png`, `image/webp` | Event cover images |
| `team-avatars` | Public | 2MB | `image/jpeg`, `image/png`, `image/webp` | Member profile photos |
| `ctf-files` | **Private** | 20MB | Any | Challenge attachments |

> Signed URL expiry: `club-documents` = 1hr, `ctf-files` = 2hr. Always generate server-side.

---

## 9. ROW-LEVEL SECURITY (RLS) POLICIES

Enable on **every** table. Use the service role to bypass RLS in admin API routes.

```sql
-- ── MEMBERS ──────────────────────────────────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved members can view approved members"
  ON members FOR SELECT
  USING (status = 'approved');

-- Members can only update their own non-sensitive fields
CREATE POLICY "Members can update own profile"
  ON members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    -- Prevent self-escalation: role and status cannot be changed via RLS
    role = (SELECT role FROM members WHERE user_id = auth.uid()) AND
    status = (SELECT status FROM members WHERE user_id = auth.uid())
  );

-- ── POSTS ─────────────────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved members can read posts"
  ON posts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
  ));

CREATE POLICY "Approved members can create posts"
  ON posts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved'
  ));

CREATE POLICY "Authors can update own posts within 24h"
  ON posts FOR UPDATE
  USING (
    author_id = (SELECT id FROM members WHERE user_id = auth.uid()) AND
    created_at > now() - INTERVAL '24 hours'
  );

-- ── CTF CHALLENGES ────────────────────────────────────────────
ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;

-- CRITICAL: This policy returns rows but the SELECT in code MUST exclude 'flag_hash'
CREATE POLICY "Approved members can read active challenges (no flag)"
  ON ctf_challenges FOR SELECT
  USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved')
  );
-- Application code MUST always use explicit column list — NEVER .select('*') on ctf_challenges

-- ── MESSAGES ──────────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read messages in their conversations"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_participants cp
    JOIN members m ON m.id = cp.member_id
    WHERE cp.conversation_id = messages.conversation_id
      AND m.user_id = auth.uid()
  ));

CREATE POLICY "Members can insert messages to their conversations"
  ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversation_participants cp
    JOIN members m ON m.id = cp.member_id
    WHERE cp.conversation_id = messages.conversation_id
      AND m.user_id = auth.uid()
  ));

-- ── NOTIFICATIONS ─────────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can mark own notifications as read"
  ON notifications FOR UPDATE
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()))
  WITH CHECK (is_read = true);  -- Can only set to true, not back to false

-- ── CONTACT MESSAGES ─────────────────────────────────────────
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_messages FOR INSERT WITH CHECK (true);
-- Admin reads via service role only

-- ── AUDIT LOGS ────────────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- No SELECT policy: audit logs are admin-only, read via service role
```

---

## 10. AUTHENTICATION & MIDDLEWARE

### 10.1 Auth Flow

```
1. User enters email → POST /portal/login
2. Supabase sends Magic Link (handled by Resend via custom SMTP)
3. User clicks link → Supabase creates JWT session cookie
4. Supabase auth trigger: fn_on_auth_user_created() creates members row atomically
5. middleware.ts runs on protected routes:

   ┌─ No Supabase session?          → redirect /portal/login
   ├─ Session exists, status=pending → redirect /portal/pending
   ├─ Session exists, status=rejected → redirect /portal/login?reason=rejected
   ├─ Session exists, status=banned  → clear cookies properly → /portal/login?reason=banned
   ├─ Session + approved             → allow /portal/* (except /admin)
   └─ Session + admin/superadmin    → allow /portal/admin
```

### 10.2 `assertRole()` — The Correct Pattern

```typescript
// lib/auth.ts
import 'server-only'
import { createServerClient } from '@/lib/supabase-server'

export async function assertRole(minRole: 'member' | 'admin' | 'superadmin') {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('UNAUTHENTICATED')

  // ✅ CORRECT: query by user_id (auth.users FK), NOT by id (members PK)
  const { data: member, error } = await supabase
    .from('members')
    .select('id, role, status')
    .eq('user_id', session.user.id)  // ← user_id, never id
    .single()

  if (error || !member) throw new Error('MEMBER_NOT_FOUND')
  if (member.status !== 'approved') throw new Error('NOT_APPROVED')

  const hierarchy = { member: 0, admin: 1, superadmin: 2 }
  if (hierarchy[member.role] < hierarchy[minRole]) throw new Error('INSUFFICIENT_ROLE')

  return member
}
```

### 10.3 `lib/supabase-server.ts` — The Correct Pattern

```typescript
// lib/supabase-server.ts
import 'server-only'  // ← Prevents this file from being bundled client-side
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// ✅ CORRECT: Uses SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix)
// ✅ CORRECT: Passes Database generic for full type safety
export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← Never anon key
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
```

### 10.4 `lib/supabase.ts` — Browser Client

```typescript
// lib/supabase.ts  (client-safe)
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// ✅ CORRECT: Passes Database generic — no more 'as any'
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 10.5 `middleware.ts` — Correct Cookie Handling

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => request.cookies.get(name)?.value,
        set: (name, value, options) => {
          response.cookies.set({ name, value, ...options })
        },
        remove: (name, options) => {
          // ✅ CORRECT: Use .set with maxAge:0 AND copy all options from incoming cookie
          // to ensure path/domain match — prevents infinite redirect loop on ban
          const existingCookie = request.cookies.get(name)
          response.cookies.set({
            name, value: '',
            ...options,
            maxAge: 0,
            // Preserve original path/domain if they exist
            path: existingCookie ? '/' : options?.path,
          })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  const isPortalRoute = path.startsWith('/portal') &&
    !path.startsWith('/portal/login') &&
    !path.startsWith('/portal/pending') &&
    !path.startsWith('/portal/register')

  if (!isPortalRoute) return response
  if (!session) return NextResponse.redirect(new URL('/portal/login', request.url))

  // Fetch member status (lightweight — uses signed cookie cache when possible)
  const { data: member } = await supabase
    .from('members')
    .select('status, role')
    .eq('user_id', session.user.id)  // ✅ user_id, not id
    .single()

  if (!member || member.status === 'pending') {
    return NextResponse.redirect(new URL('/portal/pending', request.url))
  }
  if (member.status === 'rejected') {
    return NextResponse.redirect(new URL('/portal/login?reason=rejected', request.url))
  }
  if (member.status === 'banned') {
    const banResponse = NextResponse.redirect(new URL('/portal/login?reason=banned', request.url))
    // ✅ CORRECT: Clear all Supabase auth cookies with proper options
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        banResponse.cookies.set({ name: cookie.name, value: '', maxAge: 0, path: '/' })
      }
    })
    return banResponse
  }
  if (path.startsWith('/portal/admin') && !['admin', 'superadmin'].includes(member.role)) {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: ['/portal/:path*']
}
```

---

## 11. SECURITY VULNERABILITY FIXES (MANDATORY)

> This section documents every vulnerability identified in the diagnostic report and the exact fix to implement. **All fixes are non-negotiable.**

---

### FIX 1 — CTF Race Condition (TOCTOU) ✅ RESOLVED VIA DB TRIGGER

**Vulnerability:** Application code read `member.points`, added challenge points, then wrote back. Two concurrent requests read the same base value and double-write.

**Fix:** Points are **NEVER** updated from application code. The `trg_ctf_solve` trigger in Section 7 handles all point updates atomically at the database level. The API route `/api/ctf/submit` only inserts into `ctf_solves`. The trigger does the rest.

```typescript
// ✅ CORRECT: app/api/ctf/submit/route.ts
// Only insert the solve. NEVER touch member.points from here.
const { error } = await supabaseAdmin.from('ctf_solves').insert({
  challenge_id: challengeId,
  member_id: member.id
})
if (error?.code === '23505') {
  return NextResponse.json({ error: 'Already solved' }, { status: 409 })
}
// Points are updated atomically by the DB trigger. No application-layer math.
```

---

### FIX 2 — Privilege Escalation via ID Mismatch ✅ RESOLVED

**Vulnerability:** `assertAdmin()` queried `.eq('id', session.user.id)`. But `members.id` is the club UUID, while `session.user.id` is `auth.users.id` stored in `members.user_id`. These are different UUIDs.

**Fix:** All role/status checks use `.eq('user_id', session.user.id)`. See `assertRole()` in Section 10.2. This is enforced everywhere — in middleware, in every API route, in all server components.

```typescript
// ❌ WRONG — never do this
.eq('id', session.user.id)

// ✅ CORRECT — always do this
.eq('user_id', session.user.id)
```

---

### FIX 3 — Missing Zod Validation on Admin Mutations ✅ RESOLVED

**Vulnerability:** Raw `req.json()` passed directly to Supabase `.insert(body)` on admin routes.

**Fix:** Every admin API route validates its request body with a Zod schema before touching the database.

```typescript
// lib/validations.ts — Event schema example
export const createEventSchema = z.object({
  title:        z.string().min(2).max(200),
  slug:         z.string().regex(/^[a-z0-9-]+$/),
  description:  z.string().min(10),
  short_desc:   z.string().max(200).optional(),
  event_date:   z.string().datetime(),
  end_date:     z.string().datetime().optional(),
  location:     z.string().max(300).optional(),
  meeting_link: z.string().url().optional().or(z.literal('')),
  type:         z.enum(['workshop','ctf','seminar','meetup','competition','other']),
  max_attendees: z.number().positive().optional(),
})

// app/api/admin/events/route.ts
export async function POST(req: NextRequest) {
  const admin = await assertRole('admin')  // throws if not admin
  const body = await req.json()
  const parsed = createEventSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const { data, error } = await supabaseAdmin
    .from('public_events')
    .insert({ ...parsed.data, created_by: admin.id })
  // ...
}
```

---

### FIX 4 — CTF Flag Leakage ✅ RESOLVED

**Vulnerability:** Flag fetched using the user's session client and included in SELECT. Any user could query the API directly and see all flags.

**Fix (3-part):**

**Part A — Rename column:** `flag` → `flag_hash` (makes the contract explicit in code).

**Part B — RLS SELECT never includes `flag_hash`:** Application code must explicitly list columns.

**Part C — Flag comparison is server-side only:**

```typescript
// lib/crypto.ts
import 'server-only'
import { createHash } from 'crypto'

export function hashFlag(rawFlag: string): string {
  return createHash('sha256').update(rawFlag.trim().toLowerCase()).digest('hex')
}

// app/api/ctf/submit/route.ts
import 'server-only'
import { hashFlag } from '@/lib/crypto'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const member = await assertRole('member')
  const { challengeId, flag } = submitFlagSchema.parse(await req.json())

  // ✅ Use SERVICE ROLE client to fetch flag_hash (bypasses RLS)
  // ✅ Never use the user's anon-key session for this
  const supabaseAdmin = createServerClient()
  const { data: challenge } = await supabaseAdmin
    .from('ctf_challenges')
    .select('id, points, flag_hash, is_active')  // ← explicit columns. No *.
    .eq('id', challengeId)
    .eq('is_active', true)
    .single()

  if (!challenge) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // ✅ Hash the user's submitted flag and compare — never send hash to client
  const submittedHash = hashFlag(flag)
  if (submittedHash !== challenge.flag_hash) {
    return NextResponse.json({ correct: false }, { status: 200 })
  }

  // Insert solve — trigger handles points atomically
  await supabaseAdmin.from('ctf_solves').insert({
    challenge_id: challengeId,
    member_id: member.id
  })

  return NextResponse.json({ correct: true })
}
```

---

### FIX 5 — Orphaned Auth User (Atomic Registration) ✅ RESOLVED VIA DB TRIGGER

**Vulnerability:** Application created `auth.users` row, then tried to create `members` row. If the second step failed, an orphaned auth account remained.

**Fix:** The `trg_auth_user_created` trigger in Section 7 creates the `members` row atomically inside Postgres whenever an `auth.users` row is inserted. No application-layer rollback needed.

The `/api/auth/register` route now only **updates** the existing members row with profile data (full_name, student_id, bio, skills) — it never inserts.

```typescript
// app/api/auth/register/route.ts
// The members row already exists (created by DB trigger).
// This route only updates profile fields.
const { error } = await supabaseAdmin
  .from('members')
  .update({
    full_name: parsed.data.full_name,
    student_id: parsed.data.student_id,
    bio: parsed.data.bio ?? null,
    skills: parsed.data.skills ?? [],
    // ✅ club_post ALWAYS defaults to 'General Member'. Client cannot set this.
    club_post: 'General Member',
  })
  .eq('user_id', session.user.id)  // ← user_id
```

---

### FIX 6 — Social Engineering via `club_post` ✅ RESOLVED

**Vulnerability:** Client could submit `club_post: "Super Admin"` on registration, making them appear as authority.

**Fix (3-part):**
- Database: `club_post` has a `CHECK` constraint with whitelist of valid values (see Section 7).
- API: `club_post` is hardcoded to `'General Member'` in the registration route — never taken from client payload.
- Zod schema: `club_post` is excluded from the registration schema entirely.

---

### FIX 7 — Supabase Server Client Used Anon Key ✅ RESOLVED

**Vulnerability:** `lib/supabase-server.ts` used `NEXT_PUBLIC_SUPABASE_ANON_KEY` instead of the service role key — completely defeating RLS bypass for admin operations.

**Fix:** See corrected `lib/supabase-server.ts` in Section 10.3. Uses `SUPABASE_SERVICE_ROLE_KEY`. Also adds `import 'server-only'` to prevent client bundle inclusion.

---

### FIX 8 — TypeScript `any` Contagion ✅ RESOLVED

**Vulnerability:** `(supabase.from('ctf_challenges' as any) as any)` — completely blind to schema changes.

**Fix:** Both client and server Supabase clients now receive the `Database` generic. Run `supabase gen types typescript --project-id YOUR_ID > types/database.ts` after every schema change. The types file is the contract.

```typescript
// ✅ CORRECT — full type safety, compiler catches column errors
const { data } = await supabase
  .from('ctf_challenges')  // TypeScript knows all columns here
  .select('id, title, description, category, difficulty, points, flag_format, hint, file_url, solves_count, is_active')
  .eq('is_active', true)
```

---

### FIX 9 — Cookie Destruction on Ban ✅ RESOLVED

**Vulnerability:** Cookie clearing on ban didn't match the original `path`/`domain` options, causing infinite redirect loops.

**Fix:** See corrected middleware in Section 10.5. Uses `path: '/'` on all Supabase cookies (`sb-*` prefix) and iterates all request cookies to clear them properly.

---

### FIX 10 — Rate Limiting on All Public Endpoints ✅ IMPLEMENTED

**Vulnerability:** Registration, flag submission, and contact form had no rate limiting — vulnerable to brute-force and quota exhaustion.

**Fix:** See Section 17 for full Upstash Redis rate limiting implementation.

---

## 12. FEATURE SPECIFICATIONS

### 12.1 Member Registration & Approval

1. Visitor enters email at `/portal/login` → click "Send Magic Link"
2. Resend delivers email (custom branded template)
3. First-time: Supabase auth trigger creates `members` row automatically
4. User redirected to `/portal/register` → fill: `full_name`, `student_id`, `bio`, `skills[]`
5. Submit → API updates members row → status remains `pending`
6. Redirect to `/portal/pending` — "Your application is under review."
7. Admin approves in admin panel → `status = 'approved'` → welcome email sent via Resend
8. Member can now access dashboard

**Registration Zod Schema:**
```typescript
export const registerSchema = z.object({
  full_name:  z.string().min(2).max(100).trim(),
  student_id: z.string().min(3).max(20).trim(),
  bio:        z.string().max(500).optional(),
  skills:     z.array(z.enum(['web','forensics','crypto','pwn','reversing','osint','misc'])).max(7),
  // club_post is NOT in this schema — hardcoded server-side
})
```

### 12.2 Member Dashboard (`/portal/dashboard`)
All data fetched in parallel server-side via `Promise.all()`:
- Welcome banner: "Hello, [name]" + current date
- 4 stat cards: Total members | Active CTF challenges | Upcoming events | Your rank
- Last 3 pinned announcements
- Next 2 events with RSVP button
- CTF progress bar: N solved / total
- Latest 3 unread notifications with "View all" link

### 12.3 Post Feed (`/portal/feed`)
- Paginated 20/page, sorted by `is_pinned DESC, created_at DESC`
- Post types: `announcement` (amber badge), `resource` (cyan badge), `post` (muted)
- Markdown rendered via `MarkdownRenderer.tsx` (no raw HTML)
- Reactions: toggle like (1 per member), live count via Realtime
- Comments: expandable, 20/page, members delete own
- Compose: members create `post`/`resource`. Admins create `announcement`.
- Edit: author can edit own post (24h window enforced by RLS)
- Admin: pin, delete any (with `ConfirmModal`)
- Search: server-side `ilike` on `title || content`

### 12.4 Direct Messaging (`/portal/messages`)
See Section 15 for Realtime setup. Layout:
- Left panel (`w-72 border-r`): conversation list sorted by `updated_at DESC`
  - Each item: avatar, name, last message (60 char), unread badge, relative time
  - "New DM" button → member search modal
- Right panel (`flex-1`): chat window
  - Messages oldest→newest, auto-scroll on load/new message
  - Self: right-aligned emerald bubble. Other: left-aligned dark bubble
  - Timestamps on hover
  - Soft delete own messages (shows `[message deleted]`)
  - Input: textarea + Send (Ctrl+Enter)
- Unread count badge on sidebar icon via `useNotifications`

### 12.5 Notifications (`/portal/notifications`)
- 30/page, newest first
- Unread: `bg-[#00FF87]/5 border-l-2 border-[#00FF87]`
- "Mark all read" button
- Click → navigate to `link` + mark read
- Live unread count on sidebar bell via Realtime

### 12.6 Documents (`/portal/documents`)
- Category filter tabs: All | Study Material | Writeups | Presentations | Reports | Other
- Cards: file-type icon, title, uploader, category badge, size, date, download count
- Download: server-side signed URL (1hr expiry)
- Upload: member uploads → `club-documents` bucket → metadata to DB
- Admin: delete, toggle `is_public`, change category
- Search: server-side `ilike` on `title || description`
- 20/page

### 12.7 Events System
**Public** (`/events`): published events only, no RSVP → "Login to RSVP" CTA
**Portal** (`/portal/events`): RSVP toggle (going/maybe/not_going), meeting link visible, attendee list
Event detail: full Markdown desc, attendee count, RSVP management
Admin: full CRUD, publish toggle, cover image upload

### 12.8 CTF Challenges & Leaderboard

**Challenge Grid** (`/portal/ctf`):
- Filter by category + difficulty (combinable)
- Solved cards: emerald `✓ SOLVED` overlay
- Difficulty colors: `easy`=emerald, `medium`=amber, `hard`=red, `insane`=red+pulse

**Challenge Detail** (`/portal/ctf/[id]`):
- Markdown description, points, category, difficulty
- File download if attached (signed URL)
- "Show Hint" toggle
- `FlagSubmitForm.tsx`: enforces `IIMS{` prefix client-side for UX
- POST `/api/ctf/submit` → server SHA256 comparison (Fix 4)
- Success: Toast "🏴 Flag captured! +[N] points"
- Wrong: Toast error (no timing difference to prevent timing attacks — always add a 50ms artificial delay)
- Already solved: static "✓ Already Solved" display

**Leaderboard** (`/portal/leaderboard`):
- Columns: Rank | Avatar | Name | Points | Solved | Last Solve
- Row 1: gold. Row 2: silver. Row 3: bronze. (CSS classes from Section 4.3)
- Your row: always emerald left border
- 20/page

### 12.9 Member Profiles
**Own** (`/portal/profile`): edit full_name, bio, avatar, github, linkedin, skills
**Other** (`/portal/members/[id]`): read-only, solved challenge list (titles only), recent posts, "Send DM" button

### 12.10 Public Website
- **Homepage** `/`: Terminal-style hero with typewriter animation, stats bar, 3 featured events, admin team section, IIMS affiliation strip
- **About** `/about`: Mission, team cards, gallery, link to https://iimscollege.edu.np/capture-the-flag/
- **Events** `/events`: Published events grid
- **Contact** `/contact`: Rate-limited form → `contact_messages` + Resend notification

---

## 13. ADMIN PANEL SPECIFICATION

Route: `/portal/admin` — `admin` or `superadmin` role required (checked server-side in layout.tsx).

### 13.1 Tabs (13 Total)

| # | Tab | Key Features |
|---|---|---|
| 1 | **Overview** | Live stats cards + pending approvals count |
| 2 | **Pending** | Fast-access view of `status=pending` members |
| 3 | **Members** | Paginated (20/pg), filter by status, Approve/Reject/Ban, CSV Export |
| 4 | **Posts** | Paginated, pin/unpin, delete, create announcement |
| 5 | **Events** | Create/Edit/Delete (Zod-validated), publish toggle, RSVP list |
| 6 | **Documents** | Upload, manage, toggle `is_public`, delete |
| 7 | **CTF** | Create/edit challenges (flag auto-hashed on save), activate/deactivate |
| 8 | **Leaderboard** | Read-only view + manual point adjustment (logged to audit_logs) |
| 9 | **Gallery** | Upload to `public-gallery`, tag to event, delete |
| 10 | **Broadcast** | Compose → INSERT notifications for all approved members |
| 11 | **Contact** | View/mark-read contact form messages |
| 12 | **Audit Logs** | Paginated (30/pg), filter by action type |
| 13 | **Settings** | Edit `site_settings` key-value pairs |

### 13.2 Admin Interaction Standards

- All deletes: `ConfirmModal.tsx` — "This cannot be undone"
- All async buttons: `disabled` + `"PROCESSING..."` + `<Loader2 className="animate-spin" />`
- Success: Toast `border-[#00FF87]`
- Error: Toast `border-[#FF3333]`
- Every admin action: INSERT into `audit_logs` with `{ admin_id, action, target_id, meta }`
- Pagination: `.range(from, to)` — 20 records per page

### 13.3 CTF Challenge Creation (Flag Hashing)

```typescript
// In AdminCTFTab.tsx — POST to /api/admin/ctf
// The raw flag is hashed in the API route, NEVER stored raw
// API route:
const parsed = createChallengeSchema.parse(body)
const flagHash = hashFlag(parsed.raw_flag)  // SHA256 in lib/crypto.ts
await supabaseAdmin.from('ctf_challenges').insert({
  ...parsed,
  flag_hash: flagHash,
  raw_flag: undefined,  // NEVER insert raw_flag
})
```

---

## 14. API ROUTES REFERENCE

| Method | Route | Auth | Zod Validated | Description |
|---|---|---|---|---|
| `POST` | `/api/contact` | Public | ✅ | Rate-limited contact form |
| `POST` | `/api/auth/register` | Session | ✅ | Update member profile (trigger created row) |
| `GET` | `/api/admin/members` | Admin | — | List with filter + pagination |
| `PATCH` | `/api/admin/members` | Admin | ✅ | Update status / role |
| `POST` | `/api/admin/events` | Admin | ✅ | Create event |
| `PATCH` | `/api/admin/events` | Admin | ✅ | Update event |
| `DELETE` | `/api/admin/events` | Admin | ✅ | Delete event |
| `POST` | `/api/admin/ctf` | Admin | ✅ | Create challenge (hash flag) |
| `PATCH` | `/api/admin/ctf` | Admin | ✅ | Update challenge |
| `DELETE` | `/api/admin/ctf` | Admin | ✅ | Delete challenge |
| `POST` | `/api/admin/broadcast` | Admin | ✅ | Bulk notification |
| `GET` | `/api/admin/export-csv` | Admin | — | Stream approved members CSV |
| `PATCH` | `/api/admin/settings` | Superadmin | ✅ | Update site_settings |
| `GET` | `/api/messages` | Member | — | List conversations |
| `POST` | `/api/messages` | Member | ✅ | Start conversation |
| `GET` | `/api/messages/[id]` | Member | — | Fetch messages (paginated) |
| `POST` | `/api/messages/[id]` | Member | ✅ | Send message |
| `GET` | `/api/notifications` | Member | — | List notifications |
| `PATCH` | `/api/notifications` | Member | ✅ | Mark read |
| `POST` | `/api/ctf/submit` | Member | ✅ | Submit flag (rate-limited) |
| `POST` | `/api/upload` | Member | ✅ | Get signed upload URL |

---

## 15. REAL-TIME FEATURES

Enable in **Supabase Dashboard → Database → Replication → Tables**.

| Table | Events | Hook | Consumer |
|---|---|---|---|
| `messages` | `INSERT` | `useRealtimeMessages(convId)` | Chat window |
| `notifications` | `INSERT` | `useNotifications(memberId)` | Sidebar bell |
| `post_reactions` | `INSERT`, `DELETE` | Inline in `PostCard.tsx` | Like count |

```typescript
// hooks/useRealtimeMessages.ts
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Message = Database['public']['Tables']['messages']['Row']

export function useRealtimeMessages(conversationId: string, initial: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initial)
  const supabase = createClient()

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

---

## 16. EMAIL TEMPLATES (Resend)

`from`: `"IIMS Cybersecurity Club <noreply@iimscollege.edu.np>"`

| Email | Trigger | Subject |
|---|---|---|
| Magic Link | Login | `[IIMS CyberSec] Your secure login link` |
| Welcome | Member approved | `Welcome to IIMS Cybersecurity Club 🛡️` |
| Rejection | Admin rejects | `Your application — IIMS Cybersecurity Club` |
| Ban | Admin bans | `Account suspended — IIMS Cybersecurity Club` |
| Event Reminder | 24h before RSVP | `Reminder: [Event] is tomorrow` |
| Contact Confirm | Form submitted | `We received your message` |
| Admin Alert | New pending member | `[Action Required] New member application` |

All templates styled with IIMS Maroon (`#8B1A1A`) header and college logo.

---

## 17. RATE LIMITING STRATEGY

Using `@upstash/ratelimit` + `@upstash/redis`.

```typescript
// lib/ratelimit.ts
import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Different limiters for different endpoints
export const contactFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),   // 3 submissions/IP/hour
  prefix: 'rl:contact',
})

export const flagSubmitLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'),   // 10 attempts/IP/minute
  prefix: 'rl:ctf',
})

export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),    // 5 registrations/IP/hour
  prefix: 'rl:register',
})

export const magicLinkLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '15 m'),   // 3 magic links/IP/15min
  prefix: 'rl:magiclink',
})
```

```typescript
// Usage in any API route
import { flagSubmitLimiter } from '@/lib/ratelimit'

const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
const { success, limit, remaining, reset } = await flagSubmitLimiter.limit(ip)

if (!success) {
  return NextResponse.json(
    { error: 'Too many requests. Slow down.' },
    {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': reset.toString(),
      }
    }
  )
}
// Also add artificial 50ms delay on CTF flag submissions to prevent timing attacks
await new Promise(r => setTimeout(r, 50))
```

---

## 18. CODING RULES & STANDARDS

### Security (Non-Negotiable)
- `lib/supabase-server.ts` uses `SUPABASE_SERVICE_ROLE_KEY` (no `NEXT_PUBLIC_` prefix) + `import 'server-only'`
- `lib/resend.ts` uses `import 'server-only'`
- `lib/ratelimit.ts` uses `import 'server-only'`
- `lib/crypto.ts` uses `import 'server-only'`
- CTF `flag_hash` column: NEVER in any client-facing SELECT. Always use explicit column lists.
- All admin routes: `await assertRole('admin')` is the FIRST line before any logic
- All role checks: `.eq('user_id', session.user.id)` — never `.eq('id', session.user.id)`
- `club_post` always hardcoded server-side. Never from client payload.

### TypeScript
- No `any`. No `as any`. Use `unknown` and narrow.
- All Supabase clients receive `Database` generic: `createClient<Database>(...)`
- All API handlers return `NextResponse<T | { error: string }>`
- Run `supabase gen types typescript` after every schema change

### UI / UX
- Never `window.alert()` / `window.confirm()` — use `Modal.tsx` / `Toast.tsx`
- Every async button: `disabled` + `"PROCESSING..."` + `<Loader2 className="animate-spin" />`
- Every loading state: `<Skeleton />` placeholders
- Empty states: descriptive message + CTA (never blank)

### Data Fetching
- Never `.select('*')` — always explicit column lists
- `.range(from, to)` for all paginated queries (max 20 records)
- No client-side filtering for > 50 rows
- Wrap all DB calls in `try/catch` with `if (error) throw error`
- All server components: parallel fetch via `Promise.all()`

### Forms
- All inputs validated with Zod (same schema on client and server)
- Validation errors: inline field-level (not just a global toast)

---

## 19. PERFORMANCE & SCALABILITY RULES

| Rule | Implementation |
|---|---|
| Paginate all lists | `.range(from, to)` — default 20 records |
| Index all FK columns | All done in Section 7 schema |
| Atomic DB operations | Points via trigger, never app-layer math |
| Image optimization | Next.js `<Image />` with explicit dimensions |
| Server Components | Default. `'use client'` only when required |
| Parallel data fetch | `Promise.all()` in server components |
| Public data cache | `next: { revalidate: 60 }` on public routes |
| Realtime scoping | Subscribe to specific IDs — never whole tables |
| Type generation | `supabase gen types` after every schema migration |
| No N+1 queries | Use Supabase embedded select for related data |

---

## 20. IMPLEMENTATION PLAN (ORDERED BUILD SEQUENCE)

Follow this exact sequence. Never skip ahead. Each phase is a deployable checkpoint.

### PHASE 0 — Project Bootstrap (Day 1)
- [ ] `npx create-next-app@latest iims-cyber-club --typescript --tailwind --app`
- [ ] Install dependencies: `supabase`, `@supabase/ssr`, `zod`, `date-fns`, `lucide-react`, `react-markdown`, `remark-gfm`, `resend`, `@upstash/ratelimit`, `@upstash/redis`, `server-only`
- [ ] Set up `types/database.ts` (initial empty scaffold)
- [ ] Create `.env.local` with all variables from Section 6
- [ ] Configure `next/font/google` for JetBrains Mono + Inter in `app/layout.tsx`
- [ ] Set up `globals.css` with Tailwind directives and custom scrollbar
- [ ] Create `lib/supabase.ts` (browser client with `Database` generic)
- [ ] Create `lib/supabase-server.ts` (service role client with `import 'server-only'`)

### PHASE 1 — Database Setup (Day 1-2)
- [ ] Run complete SQL schema from Section 7 in Supabase SQL Editor
- [ ] Verify all triggers: `trg_auth_user_created` + `trg_ctf_solve`
- [ ] Enable RLS on all tables
- [ ] Apply all RLS policies from Section 9
- [ ] Create all 5 storage buckets from Section 8 with correct visibility
- [ ] Run `supabase gen types typescript --project-id YOUR_ID > types/database.ts`

### PHASE 2 — Design System Foundation (Day 2)
- [ ] Create all UI primitives: `Modal.tsx`, `ConfirmModal.tsx`, `Toast.tsx`, `ToastProvider.tsx`
- [ ] Create `Skeleton.tsx`, `Badge.tsx`, `Avatar.tsx`, `Pagination.tsx`
- [ ] Create `MarkdownEditor.tsx`, `MarkdownRenderer.tsx`
- [ ] Wire `ToastProvider` into `app/layout.tsx`
- [ ] Create `lib/utils.ts` with `cn()`, `formatDate()`, `truncate()`

### PHASE 3 — Authentication & Security Core (Day 3)
- [ ] Implement `middleware.ts` from Section 10.5 (exact cookie handling)
- [ ] Create `lib/auth.ts` with `assertRole()` using `.eq('user_id', ...)` pattern
- [ ] Create `lib/crypto.ts` with `hashFlag()` + `import 'server-only'`
- [ ] Create `lib/ratelimit.ts` with all 4 limiters from Section 17
- [ ] Create `lib/validations.ts` with all Zod schemas
- [ ] Build `/portal/login` page (magic link send form + rate limiting)
- [ ] Build `/portal/register` page (profile completion)
- [ ] Build `/portal/pending` page
- [ ] **VERIFY:** Auth trigger creates members row on new user
- [ ] **VERIFY:** `assertRole()` correctly uses `user_id`, not `id`

### PHASE 4 — Portal Shell & Dashboard (Day 4)
- [ ] Build `Sidebar.tsx` with all nav items + notification/message badge placeholders
- [ ] Build `portal/layout.tsx` auth gate
- [ ] Build `/portal/dashboard` with parallel server-side data fetch

### PHASE 5 — Post Feed (Day 5)
- [ ] Build `PostCard.tsx` (markdown rendering, reaction toggle, comment expand)
- [ ] Build `PostComposer.tsx` with `MarkdownEditor.tsx`
- [ ] Build `/portal/feed` page with pagination
- [ ] Wire Realtime for post reactions

### PHASE 6 — CTF System (Day 6-7) ← HIGHEST SECURITY PRIORITY
- [ ] Build `CTFChallengeCard.tsx`
- [ ] Build `FlagSubmitForm.tsx` (client-side prefix validation only)
- [ ] Build `/api/ctf/submit` route with:
  - `assertRole('member')`
  - `flagSubmitLimiter` rate limiting
  - Artificial 50ms delay (anti-timing)
  - Service role client for `flag_hash` fetch
  - SHA256 comparison in `lib/crypto.ts`
  - Insert into `ctf_solves` only (trigger handles points)
- [ ] Build `/portal/ctf` page + `/portal/ctf/[id]` page
- [ ] Build `LeaderboardTable.tsx`
- [ ] Build `/portal/leaderboard` page
- [ ] **VERIFY:** Flag cannot be extracted via browser console
- [ ] **VERIFY:** Concurrent flag submissions don't double-award points

### PHASE 7 — Direct Messaging (Day 8)
- [ ] Build `ConversationList.tsx`, `MessageThread.tsx`
- [ ] Build `/portal/messages` layout
- [ ] Build `/api/messages` routes
- [ ] Implement `useRealtimeMessages` hook
- [ ] Implement `useNotifications` hook + wire sidebar badge

### PHASE 8 — Notifications, Documents, Events (Day 9-10)
- [ ] Build `/portal/notifications` page + `NotificationItem.tsx`
- [ ] Build `/portal/documents` page + upload flow
- [ ] Build `/portal/events` + `/portal/events/[id]` pages + RSVP API
- [ ] Wire event reminder email scheduling (Vercel cron or Supabase pg_cron)

### PHASE 9 — Member Profiles (Day 11)
- [ ] Build `/portal/profile` (edit own)
- [ ] Build `/portal/members/[id]` (view others)
- [ ] Avatar upload to `team-avatars` bucket

### PHASE 10 — Admin Panel (Day 12-14)
- [ ] Build admin panel tab shell in `/portal/admin/page.tsx`
- [ ] Build each tab component (13 tabs) from Section 13.1
- [ ] **VERIFY all admin routes:** Every route has Zod validation + `assertRole('admin')` as first line
- [ ] **VERIFY:** `flag_hash` never exposed in CTF admin tab
- [ ] Test CSV export
- [ ] Test broadcast notification

### PHASE 11 — Public Website (Day 15-16)
- [ ] Build public `Navbar.tsx` with IIMS logo + affiliation
- [ ] Build `Footer.tsx` with IIMS College link
- [ ] Build `HeroSection.tsx` with terminal typewriter animation
- [ ] Build `/` (homepage), `/about`, `/events`, `/contact`
- [ ] Wire `/api/contact` with `contactFormLimiter`

### PHASE 12 — Hardening & Launch (Day 17-18)
- [ ] Complete all items in **Security Checklist** (Section 21)
- [ ] Run `supabase gen types typescript` one final time
- [ ] Audit all Supabase SELECT statements for explicit column lists
- [ ] Test all 4 rate limiters with load
- [ ] Verify all admin routes reject non-admins
- [ ] Verify `flag_hash` is unreachable client-side
- [ ] Test cookie clearing on banned user (no infinite redirect)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to Vercel production URL
- [ ] Deploy to Vercel

---

## 21. SECURITY CHECKLIST

Before every deploy, verify each item:

**Authentication & Authorization**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` does NOT have `NEXT_PUBLIC_` prefix
- [ ] `lib/supabase-server.ts` has `import 'server-only'` at top
- [ ] All admin API routes: `assertRole('admin')` is the first line
- [ ] All role/member checks use `.eq('user_id', session.user.id)` — NEVER `.eq('id', ...)`
- [ ] Middleware correctly handles ban cookie clearing (no infinite redirect)

**CTF Security**
- [ ] Column is named `flag_hash`, not `flag`
- [ ] `flag_hash` column NOT in any client-facing SELECT (zero occurrences of `flag_hash` in any `/portal/` page or `'use client'` component)
- [ ] `/api/ctf/submit` uses service role client for flag fetch
- [ ] CTF solve trigger (`trg_ctf_solve`) is active in Supabase
- [ ] 50ms artificial delay on flag submission (anti-timing attack)
- [ ] Rate limiting active on `/api/ctf/submit`

**Database**
- [ ] RLS enabled on ALL tables (verify in Supabase Dashboard → Authentication → Policies)
- [ ] Auth trigger (`trg_auth_user_created`) is active
- [ ] `club_post` CHECK constraint in place (no self-promotion via API)
- [ ] `members.points` never written by application code (trigger only)

**Storage**
- [ ] `club-documents` bucket is PRIVATE
- [ ] `ctf-files` bucket is PRIVATE
- [ ] Signed URL generation is server-side only
- [ ] File MIME type validated server-side in upload route

**Rate Limiting**
- [ ] `/api/contact` — `contactFormLimiter` active
- [ ] `/api/ctf/submit` — `flagSubmitLimiter` active
- [ ] `/api/auth/register` — `registerLimiter` active
- [ ] `/portal/login` — `magicLinkLimiter` active

**Data Safety**
- [ ] Zero occurrences of `.select('*')` on growing tables
- [ ] All admin mutations validated with Zod
- [ ] `supabase gen types` has been run after last schema change
- [ ] Zero `any` TypeScript types in codebase

**Infrastructure**
- [ ] `NEXT_PUBLIC_SITE_URL` = actual Vercel production domain
- [ ] Magic Link redirect URL whitelisted in Supabase Auth settings
- [ ] `RESEND_FROM_EMAIL` uses `iimscollege.edu.np` domain
- [ ] No `console.log` with sensitive data

---

## 22. QUICK REFERENCE — DO / DON'T

| ✅ DO | ❌ DON'T |
|---|---|
| `import 'server-only'` in all server libs | Let server code leak to client bundle |
| `.eq('user_id', session.user.id)` | `.eq('id', session.user.id)` — wrong field! |
| Use `assertRole()` as first line in every admin route | Check roles inline or after other logic |
| Use Zod on EVERY admin mutation | Pass raw `req.json()` to Supabase |
| Store `flag_hash` (SHA256) only | Store or transmit raw CTF flags |
| Use service role client for flag comparison | Use user's anon client to fetch flag_hash |
| Let DB trigger update `members.points` | Write points from application code |
| `trg_auth_user_created` trigger creates member row | Rollback in application code |
| Hardcode `club_post: 'General Member'` server-side | Trust `club_post` from client payload |
| Add 50ms delay to flag submission | Return immediate timing-based responses |
| Rate-limit ALL public endpoints | Leave registration/CTF endpoints open |
| Clear ALL `sb-*` cookies on ban (path: '/') | Set maxAge:0 without matching options |
| Use explicit column lists in every SELECT | Use `.select('*')` on any table |
| Use `createClient<Database>(...)` generic | Use `as any` to bypass TypeScript |
| Use `bg-[#0A0A0F]` for surfaces | Use `bg-white`, `bg-gray-*` |
| Use `Toast.tsx` for alerts | Use `window.alert()` |
| Use `ConfirmModal.tsx` for deletes | Use `window.confirm()` |
| Show `<Skeleton />` while loading | Leave blank white space |
| Show `disabled + PROCESSING... + Loader2` | Leave buttons active during async ops |
| Use `next/font/google` for fonts | Use `<link>` tags in HTML |
| Use `<Image />` from Next.js | Use raw `<img>` tags |
| Use Lucide React icons | Use emojis as UI elements |
| Write all files as `.tsx` / `.ts` | Create `.js` or `.jsx` files |
| Run `supabase gen types` after schema changes | Keep stale type definitions |
| Include IIMS logo + affiliation in all public pages | Omit college branding from public site |
| Link footer to https://iimscollege.edu.np/ | Omit institutional affiliation |

---

*This file is the definitive source of truth for the IIMS Cybersecurity Club portal. Version 3.0.0 — Security-Hardened. Every AI session must read this in full before generating any code.*