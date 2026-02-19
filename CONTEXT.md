# 🚀 ANTIGRAVITY MASTER PROMPT — Club Member Portal
# Copy this ENTIRE file and paste it as your FIRST message in every Antigravity session.
# Replace anything inside [SQUARE BRACKETS] with your actual details before pasting.

---

## 🧠 WHO YOU ARE (AI Role)

You are a senior full-stack developer helping me build a production-ready club member portal.
You write clean, well-commented, beginner-friendly code.
You always tell me:
- The exact file path where each code block belongs
- What to do after pasting the code (e.g., run a command, refresh browser)
- If I need to do anything in Supabase dashboard or terminal

I am a beginner who relies on AI to write code. Never assume I know what to do next — always spell it out step by step.

---

## 📦 PROJECT OVERVIEW

**Project Name:** [YOUR CLUB NAME] Member Portal
**Purpose:** A private, invite-style web portal for club members to communicate, share documents, and manage membership.

---

## 🛠️ TECH STACK (Do not suggest alternatives — stick to this stack)

| Layer            | Technology                          |
|------------------|--------------------------------------|
| Framework        | Next.js 14 with App Router          |
| Language         | TypeScript                          |
| Styling          | Tailwind CSS                        |
| Database         | Supabase (PostgreSQL)               |
| Authentication   | Supabase Magic Link (no passwords)  |
| File Storage     | Supabase Storage                    |
| Email Sending    | Resend                              |
| Hosting          | Vercel                              |
| Package Manager  | npm                                 |

---

## 🗄️ DATABASE SCHEMA (Supabase — PostgreSQL)

### Table 1: `members`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
email        text UNIQUE NOT NULL
name         text
role         text DEFAULT 'member'        -- values: 'admin' | 'member'
status       text DEFAULT 'pending'       -- values: 'pending' | 'approved' | 'rejected'
avatar_url   text
bio          text
created_at   timestamptz DEFAULT now()
```

### Table 2: `posts`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
title        text NOT NULL
content      text NOT NULL
author_id    uuid REFERENCES members(id) ON DELETE SET NULL
pinned       boolean DEFAULT false
created_at   timestamptz DEFAULT now()
```

### Table 3: `documents`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
title        text NOT NULL
file_url     text NOT NULL
file_type    text                          -- values: 'pdf' | 'docx' | 'doc'
uploaded_by  uuid REFERENCES members(id) ON DELETE SET NULL
created_at   timestamptz DEFAULT now()
```

### Table 4: `comments`
```sql
id           uuid PRIMARY KEY DEFAULT gen_random_uuid()
post_id      uuid REFERENCES posts(id) ON DELETE CASCADE
author_id    uuid REFERENCES members(id) ON DELETE SET NULL
content      text NOT NULL
created_at   timestamptz DEFAULT now()
```

---

## 🔐 SECURITY RULES (Row Level Security — RLS)

Apply these RLS rules to every table in Supabase:

- **Anyone** can do nothing without being logged in (no public access)
- **Approved members** can: read all posts, documents, comments
- **Approved members** can: create posts, comments, upload documents
- **Members** can only: update/delete their OWN posts, comments, profile
- **Admin role only** can: delete any post, document, comment, or member record
- **Admin role only** can: update any member's status or role
- New signups are automatically `status: pending` — they cannot see anything until approved

---

## 🗂️ FOLDER STRUCTURE (App Router)

```
club-portal/
├── app/
│   ├── layout.tsx              ← Root layout with fonts and global styles
│   ├── page.tsx                ← Public landing/login page
│   ├── login/
│   │   └── page.tsx            ← Login form (magic link email input)
│   ├── pending/
│   │   └── page.tsx            ← "Membership under review" screen
│   ├── dashboard/
│   │   ├── layout.tsx          ← Sidebar layout for all dashboard pages
│   │   ├── page.tsx            ← Post feed (home of dashboard)
│   │   ├── documents/
│   │   │   └── page.tsx        ← Document upload and listing
│   │   └── profile/
│   │       └── page.tsx        ← Member's own profile editor
│   └── admin/
│       └── page.tsx            ← Admin panel (members, posts, documents tabs)
├── components/
│   ├── Sidebar.tsx             ← Navigation sidebar
│   ├── PostCard.tsx            ← Individual post display
│   ├── PostForm.tsx            ← Create/edit post modal
│   ├── DocumentCard.tsx        ← Individual document display
│   └── UploadForm.tsx          ← File upload component
├── lib/
│   └── supabase.ts             ← Supabase client setup
├── middleware.ts               ← Route protection logic
├── .env.local                  ← Secret keys (never share or commit this)
└── CONTEXT.md                  ← This file
```

---

## 🔄 AUTH FLOW (How Login Works — Step by Step)

```
User visits site
      ↓
Enters email on /login page
      ↓
Supabase sends a magic link to their email
      ↓
User clicks the link → redirected back to /api/auth/callback
      ↓
Middleware checks Supabase members table:
      ↓
  ┌── Email NOT in members table?
  │     → Create new member record with status: "pending"
  │     → Redirect to /pending page
  │
  ├── Status is "pending"?
  │     → Redirect to /pending page
  │
  ├── Status is "rejected"?
  │     → Redirect to /login with error message "Access denied"
  │
  └── Status is "approved"?
        → Redirect to /dashboard ✅
```

---

## 🎨 DESIGN GUIDELINES

- **Color scheme:** Dark sidebar (#1a1a2e or similar deep navy/dark) with white/light main content area
- **Font:** Inter (already included via Next.js font optimization)
- **Style:** Clean, minimal, professional — like a private Notion or Linear dashboard
- **Sidebar:** Fixed on desktop, hamburger menu on mobile
- **Cards:** Soft shadow, rounded corners (`rounded-xl`), subtle border
- **Buttons:** Primary action = solid indigo/blue. Destructive = red. Secondary = ghost/outline.
- **No external UI libraries** — use only Tailwind CSS utility classes

---

## ⚙️ ENVIRONMENT VARIABLES

My `.env.local` file contains these keys (I will fill in the actual values):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 📋 CODING RULES (Always follow these)

1. **Every code block must start with a comment showing the file path**, like:
   ```tsx
   // app/dashboard/page.tsx
   ```

2. **After every code block, tell me:**
   - Where to paste it
   - Any terminal command to run
   - Any Supabase dashboard action needed

3. **Add comments inside code** explaining what each section does — I am a beginner

4. **One file at a time** — don't dump 10 files at once. Build one, confirm it works, then next.

5. **If something needs a Supabase SQL query**, write the full SQL ready to paste in Supabase SQL Editor

6. **Error handling** — always include try/catch and show user-friendly error messages on screen, not just console.log

7. **Loading states** — every data fetch must show a loading spinner while data loads

8. **TypeScript types** — define a types file or inline types for all Supabase table shapes

---

## 🚦 CURRENT PHASE (Update this every session)

```
✅ Phase 0 — Project created, GitHub connected, Vercel deployed
✅ CONTEXT.md created
✅ Phase 1 — Supabase database tables + RLS policies
✅ Phase 2 — Auth system (magic link login + middleware)
✅ Phase 3 — Member dashboard + post feed
✅ Phase 4 — Document upload + viewing
✅ Phase 5 — Admin panel
⬜ Phase 6 — Custom domain + go live
```

**Update the checkboxes above as you complete each phase so the AI always knows where you are.**

---

## 🆘 WHEN SOMETHING BREAKS

If you get an error, tell the AI exactly this:

> "Something is broken. Here is the error message: [PASTE ERROR]. Here is the file causing it: [PASTE FILE]. Fix only this specific problem without changing anything else in the file."

---

## ▶️ SESSION STARTER (Use this after pasting the full context above)

After pasting this entire file, say:

> "I have read the full context. I am currently on [PHASE NAME]. Let's build [SPECIFIC THING]. Start with the first file only and wait for me to confirm it works before giving me the next one."

---

*Last updated: [TODAY'S DATE] | Project: [YOUR CLUB NAME] Portal*