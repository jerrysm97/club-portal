

## 1. PROJECT IDENTITY

```
Club Name:            IIMS Cybersecurity Club
College Name:         IIMS College
College Website:      https://iimscollege.edu.np/
Club Email:           cybersec@iimscollege.edu.np        [mock — replace when ready]
Instagram:            https://instagram.com/iimscyberclub [mock — replace when ready]
Facebook:             https://facebook.com/iimscyberclub  [mock — replace when ready]
GitHub:               https://github.com/iimscyberclub   [mock — replace when ready]
Project folder name:  iims-cyber-club
Domain structure:     Single domain — portal at /portal/*
```

---

## 2. WHAT I AM BUILDING

One Next.js 14 project. Two experiences. One domain.

PUBLIC WEBSITE — anyone on the internet can visit
→ Homepage, About, Events, Contact pages
→ 100% data-driven — every word, image, stat, team member
   is managed from the Admin Portal
→ Zero hardcoded content that requires a developer to update

PRIVATE MEMBER PORTAL — approved members only
→ Login at /portal/login (Supabase Magic Link — no passwords)
→ Member dashboard: post feed, documents, profile
→ Admin panel: 8 tabs for full platform control

The public website has a button to enter the portal.
Inside the portal, members can navigate back to the public website.
This is NOT two separate projects — one codebase, one GitHub repo, one Vercel deployment.

---

## 3. TECH STACK

```
Framework:        Next.js 14 with App Router
Language:         TypeScript (strict — no plain JS files)
Styling:          Tailwind CSS (arbitrary values for exact hex colors)
Database:         Supabase (PostgreSQL)
Authentication:   Supabase Magic Link (email only — no passwords)
File Storage:     Supabase Storage (3 buckets — see Section 7)
Email:            Resend (contact form + magic link delivery)
Hosting:          Vercel (auto-deploy from GitHub main branch)
Fonts:            Next.js next/font/google (Inter + JetBrains Mono)
Package manager:  npm
```

---

## 4. DESIGN SYSTEM — STEALTH TERMINAL (Minimalist Cyber)

This is the ONLY design language used across every page and component.
Lightweight, fast, terminal-inspired. NO glassmorphism. NO glowing shadows. NO blurs.

### 4.1 Typography

```
JetBrains Mono — All headings, section labels, numbers, dates, code
                 Weights: 400 (regular), 700 (bold)
                 Load via: next/font/google

Inter           — All body text, descriptions, form fields, paragraphs
                 Weights: 300 (light), 400 (regular), 600 (semibold)
                 Load via: next/font/google
```

### 4.2 Color Palette (Always use Tailwind arbitrary values)

```
Pure Black:         #000000   → bg-black (main page background)
Matte Dark:         #09090B   → bg-[#09090B] (cards, containers, surfaces)
Border Gray:        #27272A   → border-[#27272A] (all borders and dividers)
Terminal Emerald:   #10B981   → text-[#10B981] bg-[#10B981] (primary accent — CTAs, active, labels)
Hacker Cyan:        #06B6D4   → text-[#06B6D4] (secondary tags, links, type badges)
Danger Red:         #EF4444   → text-[#EF4444] bg-[#EF4444] (errors, delete, reject)
Ghost White:        #F8FAFC   → text-[#F8FAFC] (primary readable text)
Muted Slate:        #A1A1AA   → text-[#A1A1AA] (subtitles, placeholder, muted info)
```

### 4.3 Component Patterns (Copy these exactly — do not invent new patterns)

```
CARD:
  bg-[#09090B] border border-[#27272A] rounded-md p-6
  hover: hover:border-[#10B981] transition-colors duration-200

SECTION LABEL (above every section heading):
  > 01_SECTION_NAME
  Font: JetBrains Mono, color: #10B981, text-sm, uppercase

SECTION HEADING:
  Font: JetBrains Mono 700, color: #F8FAFC, text-3xl md:text-4xl

BUTTON PRIMARY:
  bg-[#10B981] text-black font-bold px-6 py-3 rounded-sm
  hover:opacity-90 transition-opacity

BUTTON OUTLINE:
  border border-[#10B981] text-[#10B981] px-6 py-3 rounded-sm
  hover:bg-[#10B981]/10 transition-colors

BUTTON DANGER:
  bg-[#EF4444] text-white px-4 py-2 rounded-sm hover:opacity-80

INPUT FIELD:
  bg-[#09090B] border border-[#27272A] text-[#F8FAFC] rounded-sm px-4 py-3
  focus:border-[#10B981] focus:outline-none transition-colors
  placeholder:text-[#A1A1AA]

DIVIDER:
  border-t border-[#27272A]

BADGE — Emerald:    bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded-sm text-xs font-mono
BADGE — Cyan:       bg-[#06B6D4]/10 text-[#06B6D4] px-2 py-1 rounded-sm text-xs font-mono
BADGE — Red:        bg-[#EF4444]/10 text-[#EF4444] px-2 py-1 rounded-sm text-xs font-mono
BADGE — Gray:       bg-[#27272A] text-[#A1A1AA] px-2 py-1 rounded-sm text-xs font-mono
```

### 4.4 Hero Section Special Rules

```
Background: pure black (#000000) with subtle terminal cursor animation:
  — Blinking block cursor ( █ ) after the headline, CSS animation only
  — No JS libraries for animation

Hero grid background pattern (globals.css only, no JS):
  background-image:
    linear-gradient(rgba(16,185,129,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16,185,129,0.03) 1px, transparent 1px);
  background-size: 32px 32px;
```

---

## 5. FOLDER STRUCTURE

Build exactly this. Do not add, rename, or remove any folder or file.

```
iims-cyber-club/
│
├── app/
│   ├── layout.tsx                        ← Root layout: fonts + metadata + globals
│   ├── globals.css                       ← Smooth scroll + grid bg pattern + cursor blink
│   │
│   ├── (public)/                         ← Route group: public website (no auth)
│   │   ├── layout.tsx                    ← Wraps PublicNavbar + PublicFooter
│   │   ├── page.tsx                      ← Homepage / (8 sections, all dynamic)
│   │   ├── about/
│   │   │   └── page.tsx                  ← /about
│   │   ├── events/
│   │   │   └── page.tsx                  ← /events
│   │   └── contact/
│   │       └── page.tsx                  ← /contact
│   │
│   ├── portal/                           ← Member portal (protected routes)
│   │   ├── login/
│   │   │   └── page.tsx                  ← /portal/login
│   │   ├── pending/
│   │   │   └── page.tsx                  ← /portal/pending
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                ← Topbar + Sidebar layout
│   │   │   ├── page.tsx                  ← /portal/dashboard (post feed)
│   │   │   ├── documents/
│   │   │   │   └── page.tsx              ← /portal/dashboard/documents
│   │   │   └── profile/
│   │   │       └── page.tsx              ← /portal/dashboard/profile
│   │   └── admin/
│   │       └── page.tsx                  ← /portal/admin (8 tabs)
│   │
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts              ← Supabase magic link callback handler
│       └── contact/
│           └── route.ts                  ← Contact form: save to DB + send via Resend
│
├── components/
│   ├── public/
│   │   ├── PublicNavbar.tsx              ← Fixed top nav + mobile hamburger
│   │   ├── PublicFooter.tsx              ← 3-column footer
│   │   ├── HeroSection.tsx               ← Hero with grid bg + blinking cursor
│   │   ├── AboutSection.tsx              ← Fetches about_text from site_settings
│   │   ├── DomainsSection.tsx            ← 5 static domain cards
│   │   ├── EventsSection.tsx             ← Fetches public_events — handles empty state
│   │   ├── TeamSection.tsx               ← Fetches team_members — handles empty state
│   │   ├── StatsSection.tsx              ← Fetches stats from site_settings + count animation
│   │   ├── GallerySection.tsx            ← Fetches public_gallery — handles empty state
│   │   └── ContactSection.tsx            ← Contact form with validation
│   │
│   └── portal/
│       ├── PortalTopbar.tsx              ← "← Public Website" link + member name + logout
│       ├── Sidebar.tsx                   ← Nav: Feed, Documents, Profile, Admin (if admin)
│       ├── PostCard.tsx                  ← Post display + edit/delete for own posts
│       ├── PostForm.tsx                  ← Create + edit post modal
│       ├── DocumentCard.tsx              ← Document display + view/download
│       └── UploadForm.tsx                ← File upload (PDF, DOC, DOCX only)
│
├── lib/
│   ├── supabase.ts                       ← Browser client (for client components)
│   └── supabase-server.ts               ← Server client (for server components + API routes)
│
├── types/
│   └── database.ts                       ← TypeScript types for all Supabase tables
│
├── middleware.ts                         ← Protects /portal/dashboard/* and /portal/admin/*
├── .env.local                            ← Secret keys (never commit — in .gitignore)
├── push.sh                               ← GitHub auto-push script
└── CONTEXT.md                            ← This file
```

---

## 6. DATABASE SCHEMA (Supabase — PostgreSQL)

Run this complete SQL block in Supabase SQL Editor. All tables required.

```sql
-- =============================================
-- CORE: Auth and Member Content
-- =============================================

CREATE TABLE members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text UNIQUE NOT NULL,
  name        text,
  role        text DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  status      text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  avatar_url  text,
  bio         text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  content     text NOT NULL,
  author_id   uuid REFERENCES members(id) ON DELETE SET NULL,
  pinned      boolean DEFAULT false,
  is_public   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  file_url     text NOT NULL,
  file_type    text CHECK (file_type IN ('pdf', 'docx', 'doc')),
  uploaded_by  uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- PUBLIC WEBSITE: Dynamic Data
-- =============================================

CREATE TABLE public_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  event_date   timestamptz NOT NULL,
  location     text,
  description  text,
  type         text CHECK (type IN ('Workshop', 'CTF', 'Seminar', 'Competition', 'Other')),
  status       text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past')),
  image_url    text,
  created_at   timestamptz DEFAULT now()
);

CREATE TABLE public_gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   text NOT NULL,
  caption     text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text NOT NULL,
  image_url   text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- SITE SETTINGS: Single row, id = 'global'
-- Admin edits this from the Settings tab
-- =============================================

CREATE TABLE site_settings (
  id                text PRIMARY KEY DEFAULT 'global',
  about_text        text DEFAULT 'IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu.',
  stat_members      text DEFAULT '50+',
  stat_events       text DEFAULT '15+',
  stat_competitions text DEFAULT '5+',
  stat_partners     text DEFAULT '3+',
  contact_email     text DEFAULT 'cybersec@iimscollege.edu.np',
  instagram_url     text DEFAULT 'https://instagram.com/iimscyberclub',
  facebook_url      text DEFAULT 'https://facebook.com/iimscyberclub',
  github_url        text DEFAULT 'https://github.com/iimscyberclub',
  updated_at        timestamptz DEFAULT now()
);

-- Insert the single settings row on setup
INSERT INTO site_settings (id) VALUES ('global');

-- =============================================
-- CONTACT MESSAGES: Inbox for admin
-- =============================================

CREATE TABLE contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text NOT NULL,
  message     text NOT NULL,
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public read (no auth needed — fetched by public website server components)
CREATE POLICY "Public read events"   ON public_events   FOR SELECT USING (true);
CREATE POLICY "Public read gallery"  ON public_gallery  FOR SELECT USING (true);
CREATE POLICY "Public read team"     ON team_members    FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON site_settings   FOR SELECT USING (true);

-- Contact messages: anyone can insert (public form), only admin reads
CREATE POLICY "Public insert contact" ON contact_messages FOR INSERT WITH CHECK (true);

-- Members: authenticated users read all, update only own row
CREATE POLICY "Auth read members"   ON members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth update own"     ON members FOR UPDATE USING (auth.uid() = id);

-- Posts: authenticated users read and create, update/delete own only
CREATE POLICY "Auth read posts"     ON posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth create posts"   ON posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth update own post" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Auth delete own post" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Documents: authenticated users read and create
CREATE POLICY "Auth read docs"      ON documents FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth upload docs"    ON documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Note: Admin-only actions (approve member, delete any post, manage events/gallery/team/settings)
-- are handled server-side using the SUPABASE_SERVICE_ROLE_KEY which bypasses RLS.
```

---

## 7. SUPABASE STORAGE BUCKETS

Create these manually in Supabase Dashboard → Storage → New Bucket:

```
Bucket Name:      club-documents
Access:           Private (signed URLs for members only)
Allowed types:    PDF, DOC, DOCX

Bucket Name:      public-gallery
Access:           Public (direct URL — used by public website gallery)
Allowed types:    JPG, JPEG, PNG, WEBP

Bucket Name:      event-images
Access:           Public (direct URL — used by public events section)
Allowed types:    JPG, JPEG, PNG, WEBP

Bucket Name:      team-avatars
Access:           Public (direct URL — used by public team section)
Allowed types:    JPG, JPEG, PNG, WEBP
```

---

## 8. ENVIRONMENT VARIABLES (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never commit .env.local. Confirm it is in .gitignore before first push.
On Vercel: add these same variables under Project Settings → Environment Variables.

---

## 9. MIDDLEWARE LOGIC (middleware.ts)

Protect ONLY: /portal/dashboard/* and /portal/admin/*
All other routes pass through with no auth check.

```
Incoming request
      │
      ▼
Is path /portal/dashboard/* or /portal/admin/*?
      │
   YES│                              NO → Allow through ✅
      ▼
Get Supabase session
      │
  No session → redirect /portal/login
      │
  Has session → query members table (wrapped in try/catch)
      │
      ├── catch error → redirect /portal/login?error=server_error
      │
      ├── status = pending   → redirect /portal/pending
      ├── status = rejected  → redirect /portal/login?error=access_denied
      │
      └── status = approved
              │
              ├── path is /portal/admin/*
              │     └── role ≠ admin → redirect /portal/dashboard
              │
              └── Allow through ✅
```

---

## 10. AUTH FLOW (api/auth/callback/route.ts)

```
User submits email on /portal/login
      ↓
Supabase sends magic link to their email
      ↓
User clicks link → hits /api/auth/callback
      ↓
Exchange code for session
      ↓
Query members table by email:
      ├── Email NOT found → INSERT new member (status: pending, role: member)
      │                  → redirect /portal/pending
      ├── status = pending   → redirect /portal/pending
      ├── status = rejected  → redirect /portal/login?error=access_denied
      └── status = approved  → redirect /portal/dashboard

On any error → redirect /portal/login?error=server_error
```

---

## 11. HOMEPAGE SECTIONS (app/(public)/page.tsx)

This is a Server Component. It fetches all data and passes as props to child components.
Eight sections in exact order:

```
Section 1 — Hero
  Component:  HeroSection.tsx (client — for cursor animation)
  Data:       none (static layout)
  Content:    Headline: "Securing the Digital Future"
              Subline:  "IIMS Cybersecurity Club"
              Body:     "Nepal's next generation of ethical hackers,
                         defenders, and security researchers."
              Buttons:  "Explore Club Life ↓" (anchor to #about)
                        "Member Portal →" (/portal/login)
  Special:    Blinking terminal cursor after headline (CSS only)
              Grid background pattern from globals.css
              Empty state: N/A

Section 2 — About Us (id="about")
  Component:  AboutSection.tsx (server)
  Data:       about_text from site_settings WHERE id = 'global'
  Empty state: Show default text if null

Section 3 — Domains
  Component:  DomainsSection.tsx (server — static, no DB fetch)
  Data:       Hardcoded — these 5 domains never change:
              Red Team | Blue Team | Cloud & DevSecOps | Digital Forensics | AI & Security
  Empty state: N/A (static)

Section 4 — Events
  Component:  EventsSection.tsx (server)
  Data:       public_events WHERE status = 'upcoming' ORDER BY event_date ASC
  Empty state: "> NO_UPCOMING_EVENTS_FOUND" in JetBrains Mono #10B981
               Subtext: "The team is preparing something. Follow our socials."
               Show Instagram + Facebook links

Section 5 — Team
  Component:  TeamSection.tsx (server)
  Data:       team_members ORDER BY sort_order ASC
  Empty state: "> TEAM_DATA_LOADING" — prompt admin to add team from admin panel

Section 6 — Stats
  Component:  StatsSection.tsx (client — for count animation)
  Data:       stat_members, stat_events, stat_competitions, stat_partners
              from site_settings WHERE id = 'global'
  Animation:  IntersectionObserver — count from 0 to value on scroll into view
  Display:    "> MEMBERS: 50+" terminal output style, JetBrains Mono

Section 7 — Gallery
  Component:  GallerySection.tsx (server)
  Data:       public_gallery ORDER BY sort_order ASC
  Empty state: "> GALLERY_EMPTY — Images coming soon."

Section 8 — Contact
  Component:  ContactSection.tsx (client — for form state)
  Data:       contact_email from site_settings (shown as contact info)
  Form:       Name, Email, Subject (dropdown), Message
              On submit: POST /api/contact
              Saves to contact_messages table AND sends email via Resend
  Empty state: N/A
```

---

## 12. ADMIN PANEL TABS (app/portal/admin/page.tsx)

8 tabs — complete platform control, no developer intervention needed:

```
Tab 1 — Dashboard
  Shows: count of unread messages, count of pending members
  Quick action links to Members tab and Inbox tab

Tab 2 — Members
  Shows: table of all members (name, email, role, status, joined date)
  Actions: Approve, Reject (for pending) | Remove (for approved)
  Pending members row: highlighted with amber left border

Tab 3 — Posts Manager
  Shows: all portal posts (title, author, date, pinned, is_public)
  Actions: Create new post | EDIT existing post | Delete | Pin/Unpin | Toggle is_public
  is_public toggle: instantly publishes to public site news section

Tab 4 — Events Manager
  Shows: all public_events rows (title, date, type, status)
  Actions: Add event (modal form with image upload to event-images bucket)
           Edit event | Delete event | Toggle status upcoming ↔ past
  Image upload: stores to Supabase Storage event-images → saves URL in image_url field

Tab 5 — Gallery Manager
  Shows: grid of all public_gallery images with captions
  Actions: Upload new image (to public-gallery bucket) with caption + sort_order
           Edit caption inline | Delete image | Update sort_order

Tab 6 — Team Manager
  Shows: list of all team_members ordered by sort_order
  Actions: Add member (name, role, avatar upload to team-avatars bucket, sort_order)
           Edit member details | Delete member | Reorder (change sort_order)
  This replaces the previously hardcoded team array

Tab 7 — Site Settings
  Shows: single form for the site_settings row (id = 'global')
  Fields: About Us text (textarea)
          Stat: Active Members | Events Conducted | Competitions Won | Partners
          Contact Email
          Instagram URL | Facebook URL | GitHub URL
  On save: UPDATE site_settings WHERE id = 'global'
           All changes reflect on public website immediately (ISR revalidation)

Tab 8 — Inbox
  Shows: all contact_messages ordered by created_at DESC
  Columns: name, email, subject, date, read status
  Actions: Click to expand full message | Mark as read/unread | Delete
  Unread messages: bold row, emerald left border
  Badge on tab label showing count of unread messages
```

---

## 13. PORTAL PAGES SUMMARY

```
/portal/login
  - Full screen dark background with grid pattern
  - Centered card: club name + "MEMBER ACCESS" label
  - Email input + "Send Login Link" button
  - Success: "✉️ Magic link sent to [email]"
  - Error states from URL params:
      ?error=access_denied → "Your application was not approved."
      ?error=server_error  → "Something went wrong. Please try again."
  - "← Back to Club Website" link → /

/portal/pending
  - "⏳ Your application is under review."
  - "We will notify you at [email] once approved."
  - "← Back to Club Website" link
  - Logout button

/portal/dashboard
  - Post feed: pinned first, then newest first
  - "New Post" button → PostForm modal
  - Each post: title, content, author, date, pin badge (if pinned)
  - Own posts: Edit + Delete buttons
  - Loading: skeleton placeholders while fetching

/portal/dashboard/documents
  - Upload button (PDF, DOC, DOCX only) → Supabase Storage club-documents bucket
  - File list: title, uploader, date, View (1hr signed URL), Download
  - Admin: Delete button on all files
  - Members: Delete only their own uploads

/portal/dashboard/profile
  - Edit name, bio
  - View own posts list
  - Show member since date and status badge

/portal/admin
  - Protected: redirect non-admins to /portal/dashboard
  - 8 tabs as defined in Section 12
```

---

## 14. GITHUB AUTO-PUSH SCRIPT (push.sh)

Save at project root. Run with: ./push.sh

```bash
#!/bin/bash
echo "🚀 IIMS Cyber Club — Pushing to GitHub..."
npx prettier --write . --log-level silent
git add .
TIMESTAMP=$(date "+%d %b %Y — %H:%M")
MSG="Update: $TIMESTAMP"
if git diff --staged --quiet; then
  echo "ℹ️  Nothing new to commit."
  exit 0
fi
git commit -m "$MSG"
if git push origin main; then
  echo "✅ Done! Changes are live on GitHub."
else
  echo "❌ Push failed. Check internet or GitHub credentials."
  exit 1
fi
```

Make executable once: chmod +x push.sh
Run every time:       ./push.sh

---

## 15. CODING RULES (AI must follow every session)

```
1.  Every code block: file path as comment on line 1 → // app/(public)/page.tsx
2.  One file at a time — NEVER bundle multiple files in one response
3.  After every file: state exactly where to paste it + any terminal command to run
4.  Add inline comments explaining what each block does — developer is a beginner
5.  TypeScript only — all types defined in types/database.ts and imported
6.  Public data fetching → Server Components using supabase-server.ts (for SEO)
7.  Interactive/form components → Client Components with 'use client' at top
8.  ALL async operations wrapped in try/catch — no unhandled promise rejections
9.  NEVER break UI if DB returns empty array — always handle empty states gracefully
10. All forms: client-side validation first, then API call, never skip validation
11. Never use window.location.href — always router.push() + router.refresh()
12. Never hardcode Supabase keys — always process.env.NEXT_PUBLIC_SUPABASE_URL etc.
13. Tailwind arbitrary values for colors — bg-[#000000] not bg-black (except bg-black)
14. Fonts loaded only in app/layout.tsx via next/font/google — nowhere else
15. Design system: STEALTH TERMINAL only — no glassmorphism, no glow shadows, no blurs
16. Admin actions that bypass RLS must use SUPABASE_SERVICE_ROLE_KEY server-side only
```

---

## 16. CURRENT BUILD STATUS (Update this every session)

```
✅  Project created (npx create-next-app)
✅  GitHub repo created and connected
✅  Vercel connected and auto-deploy active
✅  CONTEXT.md created
✅  Supabase project created
⬜  SQL schema run in Supabase
⬜  Storage buckets created
⬜  .env.local configured
⬜  Step 1  — PublicNavbar + PublicFooter
⬜  Step 2  — Homepage (all 8 sections)
⬜  Step 3  — About page
⬜  Step 4  — Events page
⬜  Step 5  — Contact page + API route
⬜  Step 6  — Portal Login page
⬜  Step 7  — Auth Callback + Middleware
⬜  Step 8  — Portal Dashboard layout + Topbar + Sidebar
⬜  Step 9  — Dashboard pages (Feed, Documents, Profile)
⬜  Step 10 — Admin Panel (all 8 tabs)
⬜  Step 11 — push.sh script
⬜  Step 12 — Full testing pass
```

Tick a box (✅) after each step is confirmed working before moving to the next.

---

## 17. SESSION STARTER COMMAND

After pasting this CONTEXT.md, say exactly:

> "I have read the full context. Current status is shown in Section 16.
> Let's work on [STEP NAME]. Start with the first file only.
> Use the Stealth Terminal design system. Wait for my confirmation before the next file."

---

*IIMS Cybersecurity Club · IIMS College · Kathmandu, Nepal*
*CONTEXT.md V6.0 FINAL — Zero placeholders. 100% dynamic. Ready to build.*