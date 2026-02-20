# CONTEXT.md — IIMS IT Club Portal
> **Version:** 4.0.0 | **Architecture:** Production-Ready, Security-Hardened  
> **Institution:** IIMS College, Kathmandu, Nepal → https://iimscollege.edu.np/  
> **Club:** IIMS IT Club → https://iimscollege.edu.np/it-club/  
> **CTF Reference:** https://iimscollege.edu.np/capture-the-flag/  
> **Single source of truth.** Every AI session and every contributor MUST read this entire file before writing a single line of code.

---

## CHANGELOG: v3.0 → v4.0

| Change | Reason |
|---|---|
| **Theme changed**: Dark terminal → IIMS College official brand (light, professional, navy/crimson) | Match the actual IIMS College website aesthetic |
| **Club renamed**: "Cybersecurity Club" → "IIMS IT Club" | Align with the official IIMS IT Club |
| **Email domain updated**: cybersec@ → itclub@iimscollege.edu.np | Correct club identity |
| **Color system replaced**: Terminal emerald/black → IIMS Navy/Crimson/White | Official IIMS brand |
| **Font updated**: JetBrains Mono primary → Inter primary (JetBrains Mono for code/CTF only) | IIMS site uses clean sans-serif |
| **All security fixes from v3.0 RETAINED** | Non-negotiable |
| **All database schema from v3.0 RETAINED** | Non-negotiable |
| **Implementation plan RETAINED + expanded** | Non-negotiable |

---

## TABLE OF CONTENTS

1. [Project Identity & Brand Alignment](#1-project-identity--brand-alignment)
2. [Project Overview & Feature Map](#2-project-overview--feature-map)
3. [Tech Stack](#3-tech-stack)
4. [Design System — IIMS College Official Theme](#4-design-system--iims-college-official-theme)
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
| Club Name | IIMS IT Club |
| College | IIMS College, Kathmandu, Nepal |
| College Website | https://iimscollege.edu.np/ |
| IT Club Page | https://iimscollege.edu.np/it-club/ |
| CTF Program Page | https://iimscollege.edu.np/capture-the-flag/ |
| Hackathon Page | https://iimscollege.edu.np/iims-hackathon/ |
| Club Email | itclub@iimscollege.edu.np |
| Project Folder | `iims-it-club` |
| Domain Structure | Single domain — portal at `/portal/*` |
| Architecture Level | Production-Ready, Security-Hardened |
| Design Language | IIMS College Official Theme (light, professional, navy/crimson) |

### 1.1 IIMS College Brand Context

IIMS College is one of Nepal's leading international institutions offering:
- **BCS (Hons)** — Bachelor of Computer Science
- **BBUS (Hons)** — Bachelors of Business
- **BIHM (Hons)** — Bachelor of International Hospitality Management
- **MBA** — Master of Business Administration

All programs are delivered in partnership with **Taylor's University, Malaysia**. IIMS actively runs a **Capture The Flag** competition, a **Hackathon**, and an **IT Club**. This portal is the official digital home for the IT Club — it must feel like a premium, official IIMS sub-product.

The design must mirror and extend the IIMS College website aesthetic: clean white surfaces, deep navy headers, crimson accent buttons, professional typography, and institutional credibility. It is NOT a dark-mode hacker project. It is a polished academic club portal.

---

## 2. PROJECT OVERVIEW & FEATURE MAP

One Next.js 14 project. Two experiences. One domain.

### 2.1 Public Website (`/`) — Anyone on the internet

| Page | Route | Description |
|---|---|---|
| Homepage | `/` | Hero with IIMS branding, IT Club intro, live stats, featured events |
| About | `/about` | Team, mission, IIMS affiliation, club history, gallery |
| Events | `/events` | Public event listings (workshops, CTFs, seminars, hackathons) |
| Contact | `/contact` | Rate-limited contact form |

### 2.2 Private Member Portal (`/portal/*`) — Approved members only

| Feature | Route | Access Level |
|---|---|---|
| Login | `/portal/login` | Public |
| Register / Profile Setup | `/portal/register` | Post-magic-link, pre-approval |
| Pending Approval | `/portal/pending` | Registered, unapproved |
| Dashboard | `/portal/dashboard` | `approved` members |
| Post Feed | `/portal/feed` | `approved` members |
| Direct Messages | `/portal/messages` | `approved` members |
| DM Thread | `/portal/messages/[conversationId]` | `approved` members |
| Notifications | `/portal/notifications` | `approved` members |
| Documents | `/portal/documents` | `approved` members |
| Events (Portal) | `/portal/events` | `approved` members |
| Event Detail + RSVP | `/portal/events/[id]` | `approved` members |
| CTF Challenges | `/portal/ctf` | `approved` members |
| CTF Challenge Detail | `/portal/ctf/[challengeId]` | `approved` members |
| Leaderboard | `/portal/leaderboard` | `approved` members |
| Own Profile | `/portal/profile` | `approved` members |
| Member Profile | `/portal/members/[id]` | `approved` members |
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
| Notifications UI | Custom `Toast.tsx` | — | Non-blocking, top-right |
| Date Handling | `date-fns` | Latest | Formatting, relative time |
| Form Validation | `zod` | Latest | Schema validation everywhere |
| Icons | `lucide-react` | Latest | Only icon library permitted |
| Security | `server-only` package | Latest | Prevents server files leaking to client |
| Type Safety | `supabase gen types` | — | Auto-generated DB types |

---

## 4. DESIGN SYSTEM — IIMS COLLEGE OFFICIAL THEME

> **CRITICAL RULE:** This is a **light-mode-first** design system. It directly mirrors and extends the IIMS College website (https://iimscollege.edu.np/). The palette is deep navy + crimson red + clean white. No dark backgrounds as primary surfaces. No terminal aesthetics as base. Code blocks and CTF sections may use dark styling as intentional contrast.

### 4.1 IIMS Brand Color System

Extracted directly from https://iimscollege.edu.np/:

| Token Name | Hex | Tailwind Class | Usage |
|---|---|---|---|
| **IIMS Navy** | `#1A237E` | `bg-[#1A237E]` `text-[#1A237E]` | Primary brand — headers, nav, hero bg |
| **IIMS Navy Dark** | `#0D1757` | `bg-[#0D1757]` | Hover on navy elements |
| **IIMS Navy Light** | `#283593` | `bg-[#283593]` | Active states on navy |
| **IIMS Crimson** | `#E53935` | `bg-[#E53935]` `text-[#E53935]` | Primary CTA buttons, accent, links |
| **IIMS Crimson Dark** | `#C62828` | `bg-[#C62828]` | Hover on crimson buttons |
| **IIMS Crimson Light** | `#EF5350` | `text-[#EF5350]` | Lighter accent usage |
| **White** | `#FFFFFF` | `bg-white` | Primary surface background |
| **Off-White** | `#F8F9FA` | `bg-[#F8F9FA]` | Page background, alternating rows |
| **Light Grey** | `#F5F5F5` | `bg-[#F5F5F5]` | Card backgrounds, input backgrounds |
| **Border Light** | `#E0E0E0` | `border-[#E0E0E0]` | Subtle dividers, card borders |
| **Border Mid** | `#BDBDBD` | `border-[#BDBDBD]` | Active borders, form outlines |
| **Text Primary** | `#212121` | `text-[#212121]` | Primary body text |
| **Text Secondary** | `#424242` | `text-[#424242]` | Secondary text |
| **Text Muted** | `#757575` | `text-[#757575]` | Captions, timestamps, placeholders |
| **Text Disabled** | `#9E9E9E` | `text-[#9E9E9E]` | Disabled states |
| **Success Green** | `#2E7D32` | `text-[#2E7D32]` `bg-[#2E7D32]` | Approved, solved, success states |
| **Success Light** | `#E8F5E9` | `bg-[#E8F5E9]` | Success badge backgrounds |
| **Warning Amber** | `#F57F17` | `text-[#F57F17]` | Pending, medium difficulty, warnings |
| **Warning Light** | `#FFF8E1` | `bg-[#FFF8E1]` | Warning badge backgrounds |
| **Danger Red** | `#B71C1C` | `text-[#B71C1C]` | Errors, delete, reject, ban |
| **Danger Light** | `#FFEBEE` | `bg-[#FFEBEE]` | Error badge backgrounds |
| **Info Blue** | `#0277BD` | `text-[#0277BD]` | Info messages, links |
| **Info Light** | `#E1F5FE` | `bg-[#E1F5FE]` | Info badge backgrounds |
| **Gold** | `#F9A825` | `text-[#F9A825]` | Leaderboard #1, star badges |
| **Silver** | `#90A4AE` | `text-[#90A4AE]` | Leaderboard #2 |
| **Bronze** | `#A1887F` | `text-[#A1887F]` | Leaderboard #3 |
| **Code BG** | `#1E1E2E` | `bg-[#1E1E2E]` | Code blocks, CTF terminal sections only |
| **Code Text** | `#CDD6F4` | `text-[#CDD6F4]` | Code block text |

### 4.2 UI Primitives (Copy-Paste Ready)

```
PAGE BG:          bg-[#F8F9FA] min-h-screen

CARD:             bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm
CARD (hover):     hover:shadow-md hover:border-[#1A237E]/20 transition-all duration-200
CARD (featured):  bg-white border-l-4 border-l-[#E53935] rounded-xl p-6 shadow-sm

INPUT:            bg-white border border-[#E0E0E0] text-[#212121] rounded-lg px-3 py-2.5
                  focus:outline-none focus:border-[#1A237E] focus:ring-2 focus:ring-[#1A237E]/10
                  placeholder:text-[#9E9E9E] w-full text-sm transition-colors
TEXTAREA:         Same as INPUT — add resize-none
SELECT:           Same as INPUT

BTN PRIMARY:      bg-[#E53935] text-white font-semibold px-5 py-2.5 rounded-lg
                  hover:bg-[#C62828] active:scale-95 disabled:opacity-50
                  disabled:cursor-not-allowed transition-all duration-150
BTN SECONDARY:    bg-[#1A237E] text-white font-semibold px-5 py-2.5 rounded-lg
                  hover:bg-[#0D1757] active:scale-95 disabled:opacity-50 transition-all
BTN OUTLINE:      border-2 border-[#1A237E] text-[#1A237E] font-semibold px-5 py-2.5 rounded-lg
                  hover:bg-[#1A237E] hover:text-white transition-all
BTN GHOST:        text-[#757575] px-4 py-2 rounded-lg
                  hover:text-[#212121] hover:bg-[#F5F5F5] transition-all
BTN DANGER:       bg-[#B71C1C] text-white font-semibold px-5 py-2.5 rounded-lg
                  hover:bg-[#7F0000] active:scale-95 transition-all
BTN IIMS:         bg-[#1A237E] text-white font-semibold px-5 py-2.5 rounded-lg
                  border border-[#1A237E] hover:bg-[#0D1757] transition-all

BADGE (navy):     text-[#1A237E] bg-[#1A237E]/10 border border-[#1A237E]/20
                  text-xs font-medium px-2.5 py-0.5 rounded-full
BADGE (crimson):  text-[#E53935] bg-[#E53935]/10 border border-[#E53935]/20
                  text-xs font-medium px-2.5 py-0.5 rounded-full
BADGE (success):  text-[#2E7D32] bg-[#E8F5E9] border border-[#2E7D32]/20
BADGE (warning):  text-[#F57F17] bg-[#FFF8E1] border border-[#F57F17]/20
BADGE (danger):   text-[#B71C1C] bg-[#FFEBEE] border border-[#B71C1C]/20
BADGE (info):     text-[#0277BD] bg-[#E1F5FE] border border-[#0277BD]/20

MODAL OVERLAY:    fixed inset-0 z-50 flex items-center justify-center
                  bg-[#212121]/60 backdrop-blur-sm
MODAL PANEL:      bg-white border border-[#E0E0E0] rounded-2xl p-6 max-w-lg w-full mx-4
                  shadow-2xl

TOAST SUCCESS:    fixed top-4 right-4 z-50 bg-white border-l-4 border-[#2E7D32]
                  text-[#212121] px-4 py-3 rounded-lg shadow-lg text-sm
                  flex items-center gap-2
TOAST ERROR:      Same but border-[#B71C1C]
TOAST WARN:       Same but border-[#F57F17]
TOAST INFO:       Same but border-[#0277BD]

NAVBAR (public):  bg-[#1A237E] text-white shadow-lg
                  — logo left, nav links center, CTA right
SIDEBAR (portal): bg-white border-r border-[#E0E0E0] h-screen w-64 fixed left-0 top-0
                  flex flex-col overflow-y-auto shadow-sm
NAV ITEM:         flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                  text-[#757575] hover:text-[#212121] hover:bg-[#F5F5F5] transition-all
NAV ITEM ACTIVE:  text-[#E53935] bg-[#E53935]/8 hover:bg-[#E53935]/10 font-medium

TOPBAR (portal):  bg-white border-b border-[#E0E0E0] h-16 sticky top-0 z-40
                  flex items-center justify-between px-6 shadow-sm

DIVIDER:          border-t border-[#E0E0E0] my-4
SKELETON:         bg-[#E0E0E0] animate-pulse rounded-lg
ONLINE DOT:       h-2 w-2 rounded-full bg-[#2E7D32]

MSG BUBBLE SELF:  bg-[#1A237E] text-white rounded-2xl rounded-br-sm
                  px-4 py-2 max-w-xs ml-auto text-sm
MSG BUBBLE OTHER: bg-[#F5F5F5] border border-[#E0E0E0] text-[#212121]
                  rounded-2xl rounded-bl-sm px-4 py-2 max-w-xs text-sm

CODE BLOCK:       bg-[#1E1E2E] text-[#CDD6F4] rounded-lg p-4 font-mono text-sm
                  overflow-x-auto border border-[#2D2D44]
CTF TERMINAL:     bg-[#1E1E2E] text-[#CDD6F4] rounded-lg p-4 font-mono text-sm
                  border border-[#2D2D44]
                  (Only CTF challenge descriptions and code use dark styling)

HERO (public):    bg-[#1A237E] text-white py-20
                  — gradient: from-[#1A237E] to-[#0D1757]
SECTION ALT:      bg-[#F8F9FA]
SECTION WHITE:    bg-white

LEADERBOARD #1:   bg-[#FFF8E1] border-[#F9A825]/30 — gold accent
LEADERBOARD #2:   bg-[#F5F5F5] border-[#90A4AE]/30 — silver accent
LEADERBOARD #3:   bg-[#FBE9E7] border-[#A1887F]/30 — bronze accent
YOUR ROW:         border-l-4 border-l-[#1A237E] bg-[#E8EAF6]

STAT CARD:        bg-white border border-[#E0E0E0] rounded-xl p-5 shadow-sm
                  — icon in crimson, number in navy, label in muted
```

### 4.3 Typography

| Font | Usage | Weights | Load via |
|---|---|---|---|
| **Inter** | ALL text — headings, body, labels, buttons, nav | 300, 400, 500, 600, 700 | `next/font/google` |
| **JetBrains Mono** | Code blocks, CTF sections, flag input only | 400, 700 | `next/font/google` |

> Load fonts in `app/layout.tsx` via `next/font/google`. Never via `<link>` tags.

### 4.4 IIMS Branding Integration Rules

- **Public navbar**: IIMS College logo (link to https://iimscollege.edu.np/) + "IT Club" wordmark side by side
- **Portal sidebar header**: IIMS IT Club logo + college name
- **Footer**: "IIMS IT Club is an official club of IIMS College, Kathmandu, Nepal" + link to https://iimscollege.edu.np/
- **About page**: Links to https://iimscollege.edu.np/it-club/ and https://iimscollege.edu.np/capture-the-flag/
- **Any stats section**: Show IIMS college stats (15 years, 7000+ alumni, #253 global rank, 450+ companies)
- **Partner strip**: Show Taylor's University logo (https://iimscollege.edu.np/taylor-university/)
- **Programs mentioned**: BCS, BBUS, BIHM, MBA — membership open to all IIMS students

### 4.5 Prohibited Patterns

- ❌ `window.alert()` or `window.confirm()` → use `Modal.tsx` / `Toast.tsx`
- ❌ Dark backgrounds as primary surfaces (dark only for code/CTF blocks)
- ❌ External UI libraries (Radix, MUI, Shadcn, Headless UI)
- ❌ Raw `<img>` tags → use Next.js `<Image />`
- ❌ `console.log` in committed code
- ❌ `any` TypeScript type → use `unknown` and narrow
- ❌ `.select('*')` on any growing table
- ❌ `(supabase.from('table' as any) as any)` → always pass `Database` generic
- ❌ Inline scroll-jacking or animation libraries
- ❌ Emojis as primary UI elements (text only, never as icons)

### 4.6 Iconography

Use **Lucide React** exclusively. Sizes: `h-4 w-4` inline, `h-5 w-5` buttons, `h-6 w-6` nav/section.  
Color: match context — crimson for CTA actions, navy for navigation, muted for metadata.

---

## 5. FOLDER STRUCTURE

```
iims-it-club/
│
├── app/
│   ├── layout.tsx                           ← Root layout: fonts, ToastProvider, metadata
│   ├── globals.css                          ← Tailwind directives + custom scrollbar
│   │
│   ├── (public)/
│   │   ├── layout.tsx                       ← Public Navbar (navy) + Footer (navy)
│   │   ├── page.tsx                         ← Homepage: Hero, Stats, Events, Team
│   │   ├── about/page.tsx                   ← Mission, gallery, IIMS affiliation
│   │   ├── events/page.tsx                  ← Published events grid
│   │   └── contact/page.tsx                 ← Rate-limited contact form
│   │
│   └── portal/
│       ├── layout.tsx                       ← Auth gate → Sidebar + Topbar shell
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
│   │   ├── ctf/route.ts                     ← Challenge mgmt (flag hashed here)
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
│   │   ├── Avatar.tsx                       ← IIMS-branded fallback initials
│   │   ├── MarkdownEditor.tsx               ← Write + preview tabs
│   │   └── MarkdownRenderer.tsx
│   ├── public/
│   │   ├── Navbar.tsx                       ← Navy navbar: IIMS logo + IT Club
│   │   ├── Footer.tsx                       ← Navy footer: IIMS affiliation
│   │   ├── HeroSection.tsx                  ← Navy hero with IIMS stats
│   │   ├── StatsBar.tsx                     ← Members, events, CTF solves, rank
│   │   ├── EventCard.tsx
│   │   ├── TeamSection.tsx
│   │   ├── GallerySection.tsx
│   │   ├── IIMSAffiliationStrip.tsx         ← Taylor's Uni + IIMS partner logos
│   │   └── ContactForm.tsx
│   └── portal/
│       ├── Sidebar.tsx                      ← White sidebar: nav + unread badges
│       ├── Topbar.tsx                       ← White topbar: search + profile + bell
│       ├── PostCard.tsx
│       ├── PostComposer.tsx
│       ├── MessageThread.tsx
│       ├── ConversationList.tsx
│       ├── NotificationItem.tsx
│       ├── CTFChallengeCard.tsx
│       ├── FlagSubmitForm.tsx               ← Mono font, dark terminal look
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
│   └── database.ts                          ← Auto-generated: supabase gen types typescript
│
├── middleware.ts
├── .env.local
└── CONTEXT.md                              ← This file
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
RESEND_NOTIFY_EMAIL=itclub@iimscollege.edu.np

# ── Rate Limiting (Upstash Redis) ─────────────────────────
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# ── App ───────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COLLEGE_URL=https://iimscollege.edu.np/
NEXT_PUBLIC_CLUB_PAGE_URL=https://iimscollege.edu.np/it-club/
NEXT_PUBLIC_CTF_PAGE_URL=https://iimscollege.edu.np/capture-the-flag/
```

---

## 7. COMPLETE DATABASE SCHEMA (SECURITY-HARDENED)

Run this in full in the **Supabase SQL Editor**. Order matters.

```sql
-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- MEMBERS
-- IMPORTANT: user_id = auth.users.id (FK)
--            id = club-internal UUID (PK)
-- These are TWO DIFFERENT UUIDs. Never conflate.
-- All auth checks use: .eq('user_id', session.user.id) — NOT .eq('id', ...)
-- =============================================
CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name     text NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email         text UNIQUE NOT NULL,
  student_id    text UNIQUE CHECK (length(student_id) <= 20),
  -- Program must be a valid IIMS program
  program       text CHECK (program IN ('BCS', 'BBUS', 'BIHM', 'MBA', 'Other')),
  intake        text CHECK (length(intake) <= 20),  -- e.g. "Jan 2024"
  role          text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'admin', 'superadmin')),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'banned')),
  -- club_post MUST default to 'General Member'. Never trust client input.
  club_post     text NOT NULL DEFAULT 'General Member'
                CHECK (club_post IN (
                  'General Member', 'Web Development', 'Cybersecurity',
                  'AI & Machine Learning', 'Mobile Development', 'Cloud & DevOps',
                  'Data Science', 'Open Source', 'Graphic Design'
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
-- POSTS (Club Feed)
-- =============================================
CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title       text CHECK (length(title) <= 200),
  content     text NOT NULL CHECK (length(content) BETWEEN 1 AND 10000),
  type        text DEFAULT 'post'
              CHECK (type IN ('post', 'announcement', 'resource', 'project')),
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
-- DOCUMENTS (Club Resources)
-- =============================================
CREATE TABLE documents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id    uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  title          text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  description    text CHECK (length(description) <= 1000),
  file_url       text NOT NULL,
  file_size      bigint CHECK (file_size > 0 AND file_size <= 52428800),
  file_type      text,
  category       text DEFAULT 'general' CHECK (category IN (
    'general', 'study-material', 'writeup', 'presentation', 'report', 'project', 'other'
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
    'workshop', 'ctf', 'hackathon', 'seminar', 'meetup', 'competition', 'other'
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
-- CRITICAL: 'flag_hash' stores SHA-256 hex digest ONLY.
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
  -- STORED AS SHA-256 HEX DIGEST ONLY — NEVER the raw flag string
  flag_hash    text NOT NULL CHECK (length(flag_hash) = 64),
  flag_format  text DEFAULT 'IIMS{...}',
  hint         text CHECK (length(hint) <= 500),
  file_url     text,
  is_active    boolean DEFAULT false,
  solves_count integer DEFAULT 0 CHECK (solves_count >= 0),
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
-- CTF TRIGGER — ATOMIC points update
-- NEVER update points from application code. ONLY this trigger.
-- Prevents TOCTOU race conditions entirely.
-- =============================================
CREATE OR REPLACE FUNCTION fn_on_ctf_solve()
RETURNS TRIGGER AS $$
DECLARE
  v_points integer;
BEGIN
  SELECT points INTO v_points FROM ctf_challenges WHERE id = NEW.challenge_id;

  -- Atomic increment: no read-modify-write in app layer
  UPDATE members SET points = points + v_points WHERE id = NEW.member_id;

  -- Atomic solve count increment
  UPDATE ctf_challenges SET solves_count = solves_count + 1 WHERE id = NEW.challenge_id;

  -- Auto-notification for the solver
  INSERT INTO notifications (recipient_id, type, title, body, link)
  VALUES (
    NEW.member_id,
    'ctf_solved',
    'Challenge Solved!',
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
-- Auto-creates a pending members row on auth.users insert.
-- Replaces fragile application-layer rollback pattern.
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
  ON CONFLICT (user_id) DO NOTHING;
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
  ip_hash    text,
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
  ('site_title',         'IIMS IT Club'),
  ('hero_tagline',       'Code. Build. Innovate.'),
  ('hero_subtext',       'Official IT Club of IIMS College, Kathmandu, Nepal.'),
  ('contact_email',      'itclub@iimscollege.edu.np'),
  ('ctf_enabled',        'true'),
  ('college_url',        'https://iimscollege.edu.np/'),
  ('club_page_url',      'https://iimscollege.edu.np/it-club/'),
  ('ctf_page_url',       'https://iimscollege.edu.np/capture-the-flag/'),
  ('hackathon_url',      'https://iimscollege.edu.np/iims-hackathon/');

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================
CREATE INDEX idx_members_user_id       ON members(user_id);
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
| `club-documents` | **Private** | 50MB | `application/pdf`, `application/zip`, `application/vnd.*` | Club docs, writeups, reports |
| `public-gallery` | Public | 10MB | `image/jpeg`, `image/png`, `image/webp` | Event photos, gallery |
| `event-images` | Public | 5MB | `image/jpeg`, `image/png`, `image/webp` | Event cover images |
| `team-avatars` | Public | 2MB | `image/jpeg`, `image/png`, `image/webp` | Member profile photos |
| `ctf-files` | **Private** | 20MB | Any | Challenge attachment files |

> Signed URL expiry: `club-documents` = 1hr, `ctf-files` = 2hr. Always generate server-side.

---

## 9. ROW-LEVEL SECURITY (RLS) POLICIES

Enable on **every** table. Use the service role to bypass RLS in admin API routes.

```sql
-- ── MEMBERS ─────────────────────────────────────────────
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved members can view approved members"
  ON members FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Members can update own non-sensitive profile fields"
  ON members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    role = (SELECT role FROM members WHERE user_id = auth.uid()) AND
    status = (SELECT status FROM members WHERE user_id = auth.uid())
  );

-- ── POSTS ────────────────────────────────────────────────
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

-- ── CTF CHALLENGES ──────────────────────────────────────
ALTER TABLE ctf_challenges ENABLE ROW LEVEL SECURITY;

-- Application code MUST use explicit column list — NEVER .select('*')
-- flag_hash must NEVER appear in any client-facing SELECT
CREATE POLICY "Approved members can read active challenges"
  ON ctf_challenges FOR SELECT
  USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved')
  );

-- ── MESSAGES ─────────────────────────────────────────────
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read messages in their conversations"
  ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversation_participants cp
    JOIN members m ON m.id = cp.member_id
    WHERE cp.conversation_id = messages.conversation_id AND m.user_id = auth.uid()
  ));

CREATE POLICY "Members can send messages to their conversations"
  ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversation_participants cp
    JOIN members m ON m.id = cp.member_id
    WHERE cp.conversation_id = messages.conversation_id AND m.user_id = auth.uid()
  ));

-- ── NOTIFICATIONS ────────────────────────────────────────
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can read own notifications"
  ON notifications FOR SELECT
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "Members can mark own notifications read"
  ON notifications FOR UPDATE
  USING (recipient_id = (SELECT id FROM members WHERE user_id = auth.uid()))
  WITH CHECK (is_read = true);

-- ── CONTACT MESSAGES ────────────────────────────────────
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form"
  ON contact_messages FOR INSERT WITH CHECK (true);

-- ── AUDIT LOGS ──────────────────────────────────────────
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
-- No SELECT policy — admin reads via service role only
```

---

## 10. AUTHENTICATION & MIDDLEWARE

### 10.1 Auth Flow

```
1. User enters IIMS email → POST /portal/login
2. Supabase sends Magic Link via Resend
3. User clicks link → Supabase creates JWT session cookie
4. DB trigger fn_on_auth_user_created() atomically creates pending members row
5. middleware.ts runs on every /portal/* request:

   ┌─ No session?              → redirect /portal/login
   ├─ status = pending          → redirect /portal/pending
   ├─ status = rejected         → redirect /portal/login?reason=rejected
   ├─ status = banned           → clear sb-* cookies properly → /portal/login?reason=banned
   ├─ status = approved         → allow /portal/* (except /admin)
   └─ role = admin/superadmin   → allow /portal/admin
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
    .eq('user_id', session.user.id)  // ← user_id, NEVER id
    .single()

  if (error || !member) throw new Error('MEMBER_NOT_FOUND')
  if (member.status !== 'approved') throw new Error('NOT_APPROVED')

  const hierarchy = { member: 0, admin: 1, superadmin: 2 }
  if (hierarchy[member.role as keyof typeof hierarchy] < hierarchy[minRole]) {
    throw new Error('INSUFFICIENT_ROLE')
  }
  return member
}
```

### 10.3 `lib/supabase-server.ts`

```typescript
import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createServerClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // ← service role, never anon
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
```

### 10.4 `lib/supabase.ts` — Browser Client

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

### 10.5 `middleware.ts`

```typescript
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
        set: (name, value, options) => { response.cookies.set({ name, value, ...options }) },
        remove: (name, options) => {
          response.cookies.set({ name, value: '', ...options, maxAge: 0, path: '/' })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const path = request.nextUrl.pathname

  const isProtected = path.startsWith('/portal') &&
    !['/portal/login', '/portal/pending', '/portal/register'].some(p => path.startsWith(p))

  if (!isProtected) return response
  if (!session) return NextResponse.redirect(new URL('/portal/login', request.url))

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
    const banRes = NextResponse.redirect(new URL('/portal/login?reason=banned', request.url))
    request.cookies.getAll().forEach(cookie => {
      if (cookie.name.startsWith('sb-')) {
        banRes.cookies.set({ name: cookie.name, value: '', maxAge: 0, path: '/' })
      }
    })
    return banRes
  }
  if (path.startsWith('/portal/admin') && !['admin', 'superadmin'].includes(member.role)) {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }

  return response
}

export const config = { matcher: ['/portal/:path*'] }
```

---

## 11. SECURITY VULNERABILITY FIXES (MANDATORY — ALL RESOLVED)

### FIX 1 — CTF Race Condition (TOCTOU) ✅
**Problem:** App-layer read-modify-write on `members.points`. Concurrent requests double-write.  
**Fix:** `trg_ctf_solve` trigger handles all point updates atomically. App only inserts into `ctf_solves`. Never touches `members.points`.

```typescript
// /api/ctf/submit — only insert the solve. Trigger does the rest.
const { error } = await supabaseAdmin.from('ctf_solves').insert({
  challenge_id: challengeId,
  member_id: member.id
})
if (error?.code === '23505') return NextResponse.json({ error: 'Already solved' }, { status: 409 })
```

### FIX 2 — Privilege Escalation via ID Mismatch ✅
**Problem:** Auth checks used `.eq('id', session.user.id)` — wrong field.  
**Fix:** All auth checks use `.eq('user_id', session.user.id)`.

### FIX 3 — Missing Zod Validation on Admin Mutations ✅
**Problem:** Raw `req.json()` passed directly to Supabase on admin routes.  
**Fix:** Every admin API route validates via Zod before touching the database.

### FIX 4 — CTF Flag Leakage ✅
**Problem:** Flag accessible via client session query.  
**Fix:** Column named `flag_hash` (SHA-256 only). Comparison server-side only via service role.

```typescript
// lib/crypto.ts
import 'server-only'
import { createHash } from 'crypto'
export function hashFlag(raw: string): string {
  return createHash('sha256').update(raw.trim().toLowerCase()).digest('hex')
}

// /api/ctf/submit — full flow
const { data: challenge } = await supabaseAdmin
  .from('ctf_challenges')
  .select('id, points, flag_hash, is_active')  // explicit columns, no *
  .eq('id', challengeId).eq('is_active', true).single()

const submittedHash = hashFlag(flag)
if (submittedHash !== challenge.flag_hash) {
  await new Promise(r => setTimeout(r, 50))  // anti-timing
  return NextResponse.json({ correct: false })
}
await supabaseAdmin.from('ctf_solves').insert({ challenge_id: challengeId, member_id: member.id })
return NextResponse.json({ correct: true })
```

### FIX 5 — Orphaned Auth Users ✅
**Problem:** App-layer rollback fails on crash, leaving ghost auth users.  
**Fix:** `trg_auth_user_created` creates `members` row atomically. `/api/auth/register` only UPDATES.

### FIX 6 — `club_post` Social Engineering ✅
**Problem:** Client could submit `club_post: "Super Admin"`.  
**Fix:** `club_post` hardcoded to `'General Member'` server-side. CHECK constraint enforces whitelist in DB.

### FIX 7 — Server Client Used Wrong Key ✅
**Problem:** `supabase-server.ts` used anon key, defeating RLS bypass.  
**Fix:** Uses `SUPABASE_SERVICE_ROLE_KEY` + `import 'server-only'`.

### FIX 8 — TypeScript `any` Contagion ✅
**Problem:** `as any` everywhere, compiler blind to schema changes.  
**Fix:** Both clients receive `Database` generic. Run `supabase gen types` after every schema change.

### FIX 9 — Cookie Destruction on Ban ✅
**Problem:** Cookie clearing didn't match path/domain, causing infinite redirect.  
**Fix:** Uses `path: '/'` on all `sb-*` cookies. See middleware Section 10.5.

### FIX 10 — No Rate Limiting ✅
**Problem:** `/api/auth/register`, `/api/contact`, `/api/ctf/submit` open to bots.  
**Fix:** Upstash Redis rate limiters. See Section 17.

---

## 12. FEATURE SPECIFICATIONS

### 12.1 Member Registration & Approval

1. Visitor enters IIMS email → "Send Magic Link"
2. Resend delivers branded email
3. First login → DB trigger creates `pending` members row
4. User fills `/portal/register`: `full_name`, `student_id`, `program`, `intake`, `bio`, `skills[]`
5. Status stays `pending` → redirect `/portal/pending`
6. Admin approves → `status = 'approved'` → welcome email via Resend
7. Member accesses portal

**Registration Zod Schema:**
```typescript
export const registerSchema = z.object({
  full_name:  z.string().min(2).max(100).trim(),
  student_id: z.string().min(3).max(20).trim(),
  program:    z.enum(['BCS', 'BBUS', 'BIHM', 'MBA', 'Other']),
  intake:     z.string().max(20).optional(),
  bio:        z.string().max(500).optional(),
  skills:     z.array(z.string()).max(10),
  // club_post is NOT in schema — hardcoded server-side as 'General Member'
})
```

### 12.2 Dashboard (`/portal/dashboard`)
Parallel server-side fetch via `Promise.all()`:
- Welcome banner: "Hello, [name]" + program badge + membership date
- 4 stat cards: Total members | Active CTF challenges | Upcoming events | Your rank
- 3 pinned announcements
- Next 2 events with RSVP CTA
- CTF progress: N solved / total challenges
- Latest 3 unread notifications

### 12.3 Post Feed (`/portal/feed`)
- 20/page, sorted by `is_pinned DESC, created_at DESC`
- Post types: `announcement` (crimson badge), `resource` (navy badge), `project` (green badge), `post` (muted)
- Markdown rendered via `MarkdownRenderer.tsx`
- Reactions: toggle, live count via Realtime
- Comments: expandable thread
- Compose: members create `post`/`resource`/`project`. Admins create `announcement`.
- Edit: 24h window (enforced by RLS)
- Search: `ilike` server-side

### 12.4 Direct Messaging (`/portal/messages`)
- Left panel: conversation list sorted `updated_at DESC` — avatar, name, snippet, unread badge
- Right panel: chat thread oldest→newest, auto-scroll
- Self: right-aligned navy bubble. Other: left-aligned grey bubble
- Input: textarea + Send (Ctrl+Enter)
- Realtime via `useRealtimeMessages(convId)`

### 12.5 CTF System (`/portal/ctf`)
- Grid with category/difficulty filters
- Difficulty colors: `easy`=green, `medium`=amber, `hard`=red, `insane`=red+bold
- Solved cards: green "✓ SOLVED" badge
- Challenge detail: Markdown description, code block sections use dark styling
- `FlagSubmitForm.tsx`: uses JetBrains Mono, `IIMS{` prefix enforced client-side for UX
- Server-side SHA256 comparison (Fix 4)
- Leaderboard: rank / avatar / name / points / solved / last solve

### 12.6 Events System
**Public** (`/events`): published events, no RSVP → "Login to Join" CTA  
**Portal** (`/portal/events`): RSVP toggle (going/maybe), meeting link visible  
Types highlighted: CTF events (crimson), Hackathon (navy), Workshop (green)

### 12.7 Documents (`/portal/documents`)
- Category filter: All | Study Material | Writeups | Presentations | Projects | Reports
- Server-side signed URL download (1hr expiry)
- Upload: MIME-type validated, max 50MB
- 20/page

### 12.8 Member Profiles
- Own: edit full_name, bio, program, avatar, github, linkedin, skills
- Other: read-only, solved challenges list (titles only), recent posts, "Send DM" button

### 12.9 Public Website Pages

**Homepage (`/`):**
- Navy hero: "IIMS IT Club — Code. Build. Innovate." + IIMS logo + "Part of IIMS College"
- Stats bar: Members / Events / CTF Solves / Years Active
- Featured events (3 most recent published)
- Club highlights / recent news cards
- IIMS Affiliation strip: Taylor's University logo + IIMS programs list
- Team/committee section with cards
- "Join the Club" CTA → `/portal/login`

**About (`/about`):**
- Mission statement
- IIMS College affiliation section with logo
- Links to https://iimscollege.edu.np/it-club/ and https://iimscollege.edu.np/capture-the-flag/
- Team cards (from admin-managed data)
- Gallery grid (from `public-gallery` bucket)

**Events (`/events`):**
- Published events grid, filterable by type
- Navy card headers, crimson CTA buttons

**Contact (`/contact`):**
- Rate-limited form → `contact_messages` + Resend admin notification
- IIMS contact info in sidebar

---

## 13. ADMIN PANEL SPECIFICATION

Route: `/portal/admin` — `admin` or `superadmin` role required (server-side check in layout.tsx).

### 13.1 Tabs (13 Total)

| # | Tab | Key Features |
|---|---|---|
| 1 | **Overview** | Live stat cards + pending count alert |
| 2 | **Pending** | Fast-access `status=pending` queue + bulk approve |
| 3 | **Members** | Paginated (20/pg), filter by status/program, Approve/Reject/Ban, CSV Export |
| 4 | **Posts** | Pin/unpin, delete, create announcement |
| 5 | **Events** | Create/Edit/Delete (Zod-validated), publish toggle, RSVP list |
| 6 | **Documents** | Upload, delete, toggle `is_public`, category management |
| 7 | **CTF** | Create/edit challenges (flag auto-hashed on save), activate/deactivate |
| 8 | **Leaderboard** | Read-only + manual point adjustment (logged to audit_logs) |
| 9 | **Gallery** | Upload to `public-gallery`, tag to event, delete |
| 10 | **Broadcast** | Compose → INSERT notifications for all approved members |
| 11 | **Contact** | View/mark-read contact form submissions |
| 12 | **Audit Logs** | Paginated (30/pg), filter by action type |
| 13 | **Settings** | Edit `site_settings` key-value pairs |

### 13.2 Admin Interaction Standards
- All deletes: `ConfirmModal.tsx` — "This cannot be undone"
- All async buttons: `disabled` + `"Processing..."` + `<Loader2 className="animate-spin" />`
- Every admin action: INSERT into `audit_logs`
- Success/error: Toast notifications

### 13.3 CTF Flag Hashing in Admin

```typescript
// /api/admin/ctf — flag hashed here, NEVER stored raw
const parsed = createChallengeSchema.parse(body)
const flagHash = hashFlag(parsed.raw_flag)
await supabaseAdmin.from('ctf_challenges').insert({
  ...parsed,
  flag_hash: flagHash,
  raw_flag: undefined,
})
```

---

## 14. API ROUTES REFERENCE

| Method | Route | Auth | Zod | Description |
|---|---|---|---|---|
| `POST` | `/api/contact` | Public | ✅ | Rate-limited contact |
| `POST` | `/api/auth/register` | Session | ✅ | Update profile (trigger created row) |
| `GET` | `/api/admin/members` | Admin | — | Paginated member list |
| `PATCH` | `/api/admin/members` | Admin | ✅ | Update status/role |
| `POST` | `/api/admin/events` | Admin | ✅ | Create event |
| `PATCH` | `/api/admin/events` | Admin | ✅ | Update event |
| `DELETE` | `/api/admin/events` | Admin | ✅ | Delete event |
| `POST` | `/api/admin/ctf` | Admin | ✅ | Create challenge + hash flag |
| `PATCH` | `/api/admin/ctf` | Admin | ✅ | Update challenge |
| `DELETE` | `/api/admin/ctf` | Admin | ✅ | Delete challenge |
| `POST` | `/api/admin/broadcast` | Admin | ✅ | Bulk notification |
| `GET` | `/api/admin/export-csv` | Admin | — | Stream members CSV |
| `PATCH` | `/api/admin/settings` | Superadmin | ✅ | Update site_settings |
| `GET` | `/api/messages` | Member | — | List conversations |
| `POST` | `/api/messages` | Member | ✅ | Start conversation |
| `GET` | `/api/messages/[id]` | Member | — | Fetch messages |
| `POST` | `/api/messages/[id]` | Member | ✅ | Send message |
| `GET` | `/api/notifications` | Member | — | List notifications |
| `PATCH` | `/api/notifications` | Member | ✅ | Mark read |
| `POST` | `/api/ctf/submit` | Member | ✅ | Submit flag (rate-limited) |
| `POST` | `/api/upload` | Member | ✅ | Get signed upload URL |

---

## 15. REAL-TIME FEATURES

Enable in **Supabase Dashboard → Database → Replication → Supabase Realtime**.

| Table | Events | Hook | Consumer |
|---|---|---|---|
| `messages` | `INSERT` | `useRealtimeMessages(convId)` | Chat window |
| `notifications` | `INSERT` | `useNotifications(memberId)` | Sidebar bell + topbar |
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

`from`: `"IIMS IT Club <noreply@iimscollege.edu.np>"`  
All emails: navy `#1A237E` header, IIMS logo, crimson CTA buttons.

| Email | Trigger | Subject |
|---|---|---|
| Magic Link | Login attempt | `[IIMS IT Club] Your secure login link` |
| Welcome | Admin approves | `Welcome to IIMS IT Club! 🎉` |
| Rejection | Admin rejects | `Your application — IIMS IT Club` |
| Ban | Admin bans | `Account suspended — IIMS IT Club` |
| Event Reminder | 24h before RSVP | `Reminder: [Event Name] is tomorrow` |
| Contact Confirm | Form submitted | `We received your message — IIMS IT Club` |
| Admin Alert | New pending member | `[Action Required] New member application` |

---

## 17. RATE LIMITING STRATEGY

```typescript
// lib/ratelimit.ts
import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const contactFormLimiter  = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'),   prefix: 'rl:contact' })
export const flagSubmitLimiter   = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '1 m'),  prefix: 'rl:ctf' })
export const registerLimiter     = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 h'),   prefix: 'rl:register' })
export const magicLinkLimiter    = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '15 m'),  prefix: 'rl:magiclink' })
```

---

## 18. CODING RULES & STANDARDS

### Security (Non-Negotiable)
- `lib/supabase-server.ts`, `lib/resend.ts`, `lib/ratelimit.ts`, `lib/crypto.ts` — all have `import 'server-only'`
- `SUPABASE_SERVICE_ROLE_KEY` — never prefixed with `NEXT_PUBLIC_`
- `flag_hash` — never in any client-facing SELECT. Always explicit columns.
- All admin routes: `await assertRole('admin')` is FIRST line before any logic
- All auth checks: `.eq('user_id', session.user.id)` — NEVER `.eq('id', ...)`
- `club_post` always hardcoded server-side — never from client

### TypeScript
- No `any`. No `as any`. Use `unknown` and narrow.
- All Supabase clients: `createClient<Database>(...)`
- Run `supabase gen types typescript` after every schema change

### UI/UX
- Never `window.alert()` / `window.confirm()` — use `Modal.tsx` / `Toast.tsx`
- Every async button: `disabled` + `"Processing..."` + `<Loader2 className="animate-spin" />`
- Every loading state: `<Skeleton />` placeholders
- Empty states: descriptive message + CTA

### Data Fetching
- Never `.select('*')` — always explicit column lists
- `.range(from, to)` for all paginated queries (max 20 records)
- No client-side filtering for > 50 rows
- All server components: parallel fetch via `Promise.all()`

---

## 19. PERFORMANCE & SCALABILITY RULES

| Rule | Implementation |
|---|---|
| Paginate all lists | `.range(from, to)` — 20 records default |
| Index all FK columns | Done in Section 7 |
| Atomic DB operations | Points via trigger only |
| Image optimization | `<Image />` with explicit dimensions |
| Server Components default | `'use client'` only when required |
| Parallel data fetch | `Promise.all()` in server components |
| Public data cache | `next: { revalidate: 60 }` on public routes |
| Realtime scoping | Subscribe to specific IDs — never whole tables |
| No N+1 queries | Use Supabase embedded select for related data |

---

## 20. IMPLEMENTATION PLAN (ORDERED BUILD SEQUENCE)

### PHASE 0 — Bootstrap (Day 1)
- [ ] `npx create-next-app@latest iims-it-club --typescript --tailwind --app`
- [ ] Install: `@supabase/supabase-js @supabase/ssr zod date-fns lucide-react react-markdown remark-gfm resend @upstash/ratelimit @upstash/redis server-only`
- [ ] Create `.env.local` (Section 6)
- [ ] `app/layout.tsx`: Inter + JetBrains Mono via `next/font/google`
- [ ] `globals.css`: Tailwind directives + custom scrollbar (navy thumb)
- [ ] `lib/supabase.ts` (browser client with Database generic)
- [ ] `lib/supabase-server.ts` (service role + import 'server-only')

### PHASE 1 — Database (Day 1-2)
- [ ] Run complete SQL schema from Section 7
- [ ] Verify triggers: `trg_auth_user_created` + `trg_ctf_solve`
- [ ] Enable RLS on all tables, apply all policies from Section 9
- [ ] Create 5 storage buckets (Section 8)
- [ ] `supabase gen types typescript > types/database.ts`

### PHASE 2 — Design System (Day 2)
- [ ] `Modal.tsx`, `ConfirmModal.tsx`, `Toast.tsx`, `ToastProvider.tsx`
- [ ] `Skeleton.tsx`, `Badge.tsx`, `Avatar.tsx`, `Pagination.tsx`
- [ ] `MarkdownEditor.tsx`, `MarkdownRenderer.tsx`
- [ ] Wire `ToastProvider` into `app/layout.tsx`
- [ ] `lib/utils.ts`: `cn()`, `formatDate()`, `truncate()`

### PHASE 3 — Auth & Security Core (Day 3)
- [ ] `middleware.ts` (Section 10.5 — exact cookie handling)
- [ ] `lib/auth.ts` with `assertRole()` using `.eq('user_id', ...)`
- [ ] `lib/crypto.ts` with `hashFlag()` + `import 'server-only'`
- [ ] `lib/ratelimit.ts` (Section 17)
- [ ] `lib/validations.ts` (all Zod schemas)
- [ ] `/portal/login`, `/portal/register`, `/portal/pending` pages
- [ ] **VERIFY:** Auth trigger creates members row
- [ ] **VERIFY:** `assertRole()` uses `user_id` not `id`

### PHASE 4 — Portal Shell (Day 4)
- [ ] `Sidebar.tsx` (white, IIMS IT Club branding, nav items, badges)
- [ ] `Topbar.tsx` (white, search, notifications bell, profile)
- [ ] `portal/layout.tsx` auth gate
- [ ] `/portal/dashboard` with parallel data fetch

### PHASE 5 — Feed (Day 5)
- [ ] `PostCard.tsx`, `PostComposer.tsx`
- [ ] `/portal/feed` with pagination
- [ ] Realtime for post reactions

### PHASE 6 — CTF System (Day 6-7) ← HIGHEST SECURITY PRIORITY
- [ ] `CTFChallengeCard.tsx`, `FlagSubmitForm.tsx`
- [ ] `/api/ctf/submit` (rate limit + 50ms delay + SHA256 + trigger-only points)
- [ ] `/portal/ctf` grid + `/portal/ctf/[id]` detail
- [ ] `LeaderboardTable.tsx`, `/portal/leaderboard`
- [ ] **VERIFY:** flag_hash unreachable client-side
- [ ] **VERIFY:** Concurrent submissions don't double-award points

### PHASE 7 — Direct Messaging (Day 8)
- [ ] `ConversationList.tsx`, `MessageThread.tsx`
- [ ] `/portal/messages` + `/api/messages` routes
- [ ] `useRealtimeMessages` hook
- [ ] `useNotifications` hook + sidebar badge

### PHASE 8 — Notifications, Documents, Events (Day 9-10)
- [ ] `/portal/notifications` + `NotificationItem.tsx`
- [ ] `/portal/documents` + upload flow
- [ ] `/portal/events` + `/portal/events/[id]` + RSVP API

### PHASE 9 — Member Profiles (Day 11)
- [ ] `/portal/profile` (edit own)
- [ ] `/portal/members/[id]` (view others)
- [ ] Avatar upload to `team-avatars`

### PHASE 10 — Admin Panel (Day 12-14)
- [ ] Admin tab shell at `/portal/admin/page.tsx`
- [ ] All 13 tab components
- [ ] **VERIFY:** All admin routes have Zod + `assertRole('admin')` as first line
- [ ] Test CSV export, broadcast notification, audit logs

### PHASE 11 — Public Website (Day 15-16)
- [ ] `Navbar.tsx` (navy, IIMS logo + IT Club)
- [ ] `Footer.tsx` (navy, IIMS affiliation)
- [ ] `HeroSection.tsx` (navy hero + IIMS stats)
- [ ] `IIMSAffiliationStrip.tsx` (Taylor's + IIMS logos)
- [ ] `/`, `/about`, `/events`, `/contact`
- [ ] `/api/contact` with rate limiting

### PHASE 12 — Hardening & Deploy (Day 17-18)
- [ ] Complete Security Checklist (Section 21)
- [ ] Run `supabase gen types` one final time
- [ ] Audit all SELECTs for explicit column lists
- [ ] Load test all 4 rate limiters
- [ ] Verify `flag_hash` unreachable from browser
- [ ] Test ban cookie clearing (no infinite redirect)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to Vercel production domain
- [ ] Deploy to Vercel

---

## 21. SECURITY CHECKLIST

**Authentication & Authorization**
- [ ] `SUPABASE_SERVICE_ROLE_KEY` has NO `NEXT_PUBLIC_` prefix
- [ ] `lib/supabase-server.ts` has `import 'server-only'`
- [ ] All admin API routes: `assertRole('admin')` is first line
- [ ] All role/auth checks use `.eq('user_id', session.user.id)` — never `.eq('id', ...)`
- [ ] Banned user cookie clearing works (no infinite redirect)

**CTF Security**
- [ ] Column named `flag_hash` not `flag`
- [ ] `flag_hash` NOT in any `'use client'` component or portal page SELECT
- [ ] `/api/ctf/submit` uses service role client for flag fetch
- [ ] `trg_ctf_solve` trigger is active in Supabase
- [ ] 50ms artificial delay on flag submission
- [ ] Rate limiting on `/api/ctf/submit`

**Database**
- [ ] RLS enabled on ALL tables
- [ ] `trg_auth_user_created` trigger active
- [ ] `club_post` CHECK constraint in place
- [ ] `members.points` never written by application code

**Storage**
- [ ] `club-documents` bucket is PRIVATE
- [ ] `ctf-files` bucket is PRIVATE
- [ ] Signed URL generation server-side only
- [ ] File MIME type validated server-side

**Rate Limiting**
- [ ] `/api/contact` — `contactFormLimiter` active
- [ ] `/api/ctf/submit` — `flagSubmitLimiter` active
- [ ] `/api/auth/register` — `registerLimiter` active
- [ ] `/portal/login` — `magicLinkLimiter` active

**Data Safety**
- [ ] Zero `.select('*')` on growing tables
- [ ] All admin mutations Zod-validated
- [ ] `supabase gen types` run after last schema change
- [ ] Zero `any` TypeScript types

**Infrastructure**
- [ ] `NEXT_PUBLIC_SITE_URL` = actual Vercel domain
- [ ] Magic Link redirect URL whitelisted in Supabase Auth
- [ ] `RESEND_FROM_EMAIL` uses `iimscollege.edu.np`
- [ ] No `console.log` with sensitive data

---

## 22. QUICK REFERENCE — DO / DON'T

| ✅ DO | ❌ DON'T |
|---|---|
| Use IIMS Navy `#1A237E` for primary surfaces | Use dark/black backgrounds as primary |
| Use IIMS Crimson `#E53935` for CTAs | Use generic blue or green as primary CTA |
| White card surfaces, clean borders | Dark card surfaces as default |
| JetBrains Mono ONLY for code/CTF | JetBrains Mono as primary UI font |
| Show IIMS logo + affiliation on all public pages | Omit IIMS College branding |
| Link footer to https://iimscollege.edu.np/ | Omit institutional affiliation |
| `import 'server-only'` in all server libs | Let server code leak to client bundle |
| `.eq('user_id', session.user.id)` | `.eq('id', session.user.id)` — wrong field! |
| `assertRole('admin')` as first line in admin routes | Check roles after other logic |
| Zod validate EVERY admin mutation | Pass raw `req.json()` to Supabase |
| Store `flag_hash` (SHA256 only) | Store or transmit raw CTF flags |
| Use service role to fetch `flag_hash` | Use user's anon client to fetch flag |
| DB trigger updates `members.points` | Write points from application code |
| DB trigger creates `members` row on auth | Multi-step app-layer rollback |
| Hardcode `club_post: 'General Member'` server-side | Trust `club_post` from client |
| 50ms delay on flag submission | Return immediate timing-based response |
| Rate-limit ALL public endpoints | Leave register/CTF/contact open |
| Clear ALL `sb-*` cookies on ban (path: '/') | Clear cookies without matching path |
| Explicit column lists in every SELECT | `.select('*')` on any table |
| `createClient<Database>(...)` with generic | `as any` to bypass TypeScript |
| `<Image />` from Next.js | Raw `<img>` tags |
| `Toast.tsx` for notifications | `window.alert()` |
| `ConfirmModal.tsx` for destructive actions | `window.confirm()` |
| `<Skeleton />` while loading | Blank white space while loading |
| `disabled + "Processing..." + Loader2` on async | Active button during async ops |
| `next/font/google` for fonts | `<link>` tags in HTML |
| Lucide React icons only | Mixed icon libraries or emoji as icons |
| `.tsx` / `.ts` files only | `.js` or `.jsx` files |
| Run `supabase gen types` after schema changes | Stale type definitions |
| Programs: BCS / BBUS / BIHM / MBA | Generic "Computer Science" labels |

---

*CONTEXT.md v4.0 — IIMS IT Club Portal. Production-Ready + Security-Hardened + IIMS College Official Theme.*  
*Read this in full before writing any code. Last updated: February 2026.*