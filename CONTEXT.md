# 🚀 ANTIGRAVITY MEGA PROMPT — IIMS Cybersecurity Club
# V5.0 FINAL — All Real Details Filled In | Zero Placeholders
# Public Website + Member Portal | One Project | One Domain
#
# HOW TO USE:
# 1. Paste your CONTEXT.md first in Antigravity
# 2. Paste this ENTIRE file right after it
# 3. Say "Start with Step 1 — build PublicNavbar.tsx and wait for my confirmation"
# 4. Say "done, next" after each file is tested and working

---

## 📍 PROJECT IDENTITY

```
Club Name:          IIMS Cybersecurity Club
College Name:       IIMS College
College Website:    https://iimscollege.edu.np/
Club Email:         cybersec@iimscollege.edu.np          ← mock, use this for now
Instagram:          https://instagram.com/iimscyberclub   ← mock, use this for now
Facebook:           https://facebook.com/iimscyberclub    ← mock, use this for now
GitHub:             https://github.com/iimscyberclub      ← mock, use this for now
Domain intent:      One domain, portal lives at /portal
Stack:              Next.js 14 App Router, Supabase, Tailwind CSS, Resend
```

---

## 📍 FULL PROJECT VISION

I am building ONE Next.js 14 project containing:
1. **Public Club Website** — anyone on the internet can visit
2. **Private Member Portal** — only approved members access after email login

Both live on the same domain. The public website is **entirely data-driven** — all public content (events, gallery, announcements) is pushed from the Admin Portal. There is zero hardcoded content that requires a developer to update.

The public site connects to the portal via a prominent CTA button. Inside the portal, members can navigate back to the public website at any time.

---

## 🎨 DESIGN SYSTEM: CYBER BLUE MATRIX

Apply this design system consistently across EVERY page and component.

### Typography (load via Google Fonts in layout.tsx)
```
Headings:      Orbitron      weights: 700, 900
Body text:     Exo 2         weights: 300, 400, 700
Mono/labels:   Share Tech Mono  (monospace — use for dates, codes, section labels)
```

### Color Palette (use Tailwind arbitrary values)
```
Primary surface:    #0A1F44   Deep Navy Blue   → bg-[#0A1F44]
Electric accent:    #00B4FF   Electric Blue    → text-[#00B4FF], border-[#00B4FF]
Neon accent:        #00FF9C   Neon Green       → text-[#00FF9C] (badges, glows, highlights)
Background:         #0D0D0D   Near Black       → bg-[#0D0D0D]
Alert/danger:       #FF3B3B   Red              → text-[#FF3B3B]
Muted text:         #8892A4   Slate gray       → text-[#8892A4]
```

### UI Rules
- **Glassmorphism cards:** `bg-white/5 backdrop-blur-md border border-white/10 rounded-xl`
- **Neon glow on hover:** `hover:shadow-[0_0_20px_rgba(0,180,255,0.3)]`
- **Section labels:** monospace prefix style — `// 01 — About Us` in Share Tech Mono, #00FF9C color
- **Circuit/grid background:** subtle CSS grid pattern on dark backgrounds
- **Buttons — Primary:** `bg-[#00B4FF] text-[#0D0D0D] font-bold hover:bg-[#00FF9C] transition-all`
- **Buttons — Outline:** `border border-[#00B4FF] text-[#00B4FF] hover:bg-[#00B4FF] hover:text-[#0D0D0D]`
- **Buttons — Danger:** `bg-[#FF3B3B] text-white hover:opacity-80`
- **Smooth transitions:** `transition-all duration-300` on all interactive elements

---

## 🗂️ COMPLETE FOLDER STRUCTURE

Build exactly this. Do not add or remove any folders:

```
iims-cyber-club/
│
├── app/
│   ├── layout.tsx                        ← Root layout: Google Fonts + metadata
│   ├── globals.css                       ← Smooth scroll + circuit grid CSS pattern
│   │
│   ├── (public)/                         ← Route group: public website
│   │   ├── layout.tsx                    ← PublicNavbar + PublicFooter wrapper
│   │   ├── page.tsx                      ← Homepage / (7 sections)
│   │   ├── about/
│   │   │   └── page.tsx                  ← /about
│   │   ├── events/
│   │   │   └── page.tsx                  ← /events
│   │   └── contact/
│   │       └── page.tsx                  ← /contact
│   │
│   ├── portal/
│   │   ├── login/
│   │   │   └── page.tsx                  ← /portal/login
│   │   ├── pending/
│   │   │   └── page.tsx                  ← /portal/pending
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                ← Sidebar layout
│   │   │   ├── page.tsx                  ← /portal/dashboard (feed)
│   │   │   ├── documents/
│   │   │   │   └── page.tsx              ← /portal/dashboard/documents
│   │   │   └── profile/
│   │   │       └── page.tsx              ← /portal/dashboard/profile
│   │   └── admin/
│   │       └── page.tsx                  ← /portal/admin (5 tabs)
│   │
│   └── api/
│       ├── auth/callback/route.ts        ← Supabase magic link callback
│       └── contact/route.ts             ← Contact form email via Resend
│
├── components/
│   ├── public/
│   │   ├── PublicNavbar.tsx
│   │   ├── PublicFooter.tsx
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── DomainsSection.tsx
│   │   ├── EventsSection.tsx             ← Fetches from Supabase, handles empty state
│   │   ├── TeamSection.tsx
│   │   ├── StatsSection.tsx              ← Scroll-triggered count animation
│   │   ├── GallerySection.tsx            ← Fetches from Supabase
│   │   └── ContactSection.tsx
│   │
│   └── portal/
│       ├── PortalTopbar.tsx              ← "← Public Website" link inside portal
│       ├── Sidebar.tsx
│       ├── PostCard.tsx
│       ├── PostForm.tsx
│       ├── DocumentCard.tsx
│       └── UploadForm.tsx
│
├── lib/
│   ├── supabase.ts                       ← Browser client
│   └── supabase-server.ts               ← Server client (for server components)
│
├── types/
│   └── database.ts                       ← TypeScript types for all Supabase tables
│
├── middleware.ts                         ← Protects /portal/dashboard/* and /portal/admin/*
├── .env.local                            ← Secret keys
├── push.sh                               ← GitHub auto-push script
└── CONTEXT.md
```

---

## 🗄️ DATABASE SCHEMA (Supabase — PostgreSQL)

Run this complete SQL in Supabase SQL Editor. Build all tables exactly as defined:

### Table 1: members
```sql
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
```

### Table 2: posts
```sql
CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  content     text NOT NULL,
  author_id   uuid REFERENCES members(id) ON DELETE SET NULL,
  pinned      boolean DEFAULT false,
  is_public   boolean DEFAULT false,  -- true = appears on public website news section
  created_at  timestamptz DEFAULT now()
);
```

### Table 3: documents
```sql
CREATE TABLE documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  file_url     text NOT NULL,
  file_type    text CHECK (file_type IN ('pdf', 'docx', 'doc')),
  uploaded_by  uuid REFERENCES members(id) ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now()
);
```

### Table 4: public_events
```sql
CREATE TABLE public_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL,
  event_date   timestamptz NOT NULL,
  location     text,
  description  text,
  type         text CHECK (type IN ('Workshop', 'CTF', 'Seminar', 'Competition', 'Other')),
  status       text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'past')),
  image_url    text,  -- poster/photo uploaded by admin to Supabase Storage
  created_at   timestamptz DEFAULT now()
);
```

### Table 5: public_gallery
```sql
CREATE TABLE public_gallery (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url   text NOT NULL,  -- from Supabase Storage bucket: public-gallery
  caption     text,
  sort_order  integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
```

### RLS Policies (run after creating tables)
```sql
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_gallery ENABLE ROW LEVEL SECURITY;

-- public_events: anyone can read (public website fetches this)
CREATE POLICY "Public can read events" ON public_events FOR SELECT USING (true);

-- public_gallery: anyone can read (public website fetches this)
CREATE POLICY "Public can read gallery" ON public_gallery FOR SELECT USING (true);

-- posts: approved members can read, is_public posts readable by all
CREATE POLICY "Approved members read posts" ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

-- members: approved members can read all, update only own row
CREATE POLICY "Members read all" ON members FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Members update own" ON members FOR UPDATE
  USING (auth.uid() = id);

-- documents: approved members can read and insert
CREATE POLICY "Members read documents" ON documents FOR SELECT
  USING (auth.role() = 'authenticated');
CREATE POLICY "Members upload documents" ON documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Admin-only deletes (handled server-side with service role key)
```

### Supabase Storage Buckets (create these manually in Supabase dashboard)
```
Bucket 1: club-documents     → private (signed URLs for members only)
Bucket 2: public-gallery     → public (images served directly to public website)
Bucket 3: event-images       → public (event posters served to public website)
```

---

## 🔐 MIDDLEWARE (middleware.ts)

Protect ONLY these routes: `/portal/dashboard/:path*` and `/portal/admin/:path*`
All public routes pass through freely — no auth check.

```
Request → Is path /portal/dashboard/* or /portal/admin/*?

YES →
  Get Supabase session
  No session → redirect to /portal/login

  Has session → query members table (wrap in try/catch)
    status = pending   → redirect to /portal/pending
    status = rejected  → redirect to /portal/login?error=access_denied
    status = approved  → allow ✅
    catch error        → redirect to /portal/login?error=server_error

  For /portal/admin/* additionally:
    role ≠ admin → redirect to /portal/dashboard

NO → allow through ✅ (public website — no checks)
```

---

## 🌐 STEP 1 — Public Layout: Navbar + Footer

### PublicNavbar (components/public/PublicNavbar.tsx)

- Fixed top, `bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#00B4FF]/20`
- Left: Club logo placeholder (cyber shield SVG icon inline) + "IIMS Cybersecurity Club" in Orbitron font, white
- Center (desktop only): nav links with Share Tech Mono font
  - `Home` → `/`
  - `About` → `/about`
  - `Events` → `/events`
  - `Contact` → `/contact`
  - Hover: underline in `#00B4FF` with glow effect
- Right: **"Member Portal →"** button
  - Style: `border border-[#00B4FF] text-[#00B4FF] hover:bg-[#00B4FF] hover:text-[#0D0D0D] font-bold px-4 py-2 rounded transition-all`
  - Links to `/portal/login`
- Mobile: hamburger icon (inline SVG) → slide-down menu with all links + portal button
- Use `useState` for mobile menu toggle

### PublicFooter (components/public/PublicFooter.tsx)

Three columns on desktop, stacked on mobile. Background: `bg-[#0A1F44]` with top border `border-t border-[#00B4FF]/30`

**Column 1 — Club Identity:**
- Club name in Orbitron white
- Tagline: `// Securing the Digital Future`  in Share Tech Mono, #00FF9C
- Social icons (inline SVGs — Facebook, Instagram, GitHub):
  - Facebook: `https://facebook.com/iimscyberclub`
  - Instagram: `https://instagram.com/iimscyberclub`
  - GitHub: `https://github.com/iimscyberclub`
  - Icon hover: scale-110 + neon blue glow

**Column 2 — Quick Links:**
- "Quick Links" heading in Orbitron
- Links: Home, About, Events, Contact, Member Portal
- Each with `→` prefix in #00FF9C, hover:text-[#00B4FF]

**Column 3 — College:**
- "Our Institution" heading in Orbitron
- IIMS College
- Link: `https://iimscollege.edu.np/` → opens new tab
- Style link: text-[#00B4FF] hover:text-[#00FF9C]

**Bottom bar:**
- `© 2026 IIMS Cybersecurity Club · IIMS College · All rights reserved`
- Share Tech Mono font, #8892A4 color, centered
- Separator: `border-t border-white/10 mt-8 pt-4`

---

## 🏠 STEP 2 — Homepage (app/(public)/page.tsx)

This is a **Server Component** that fetches from Supabase and passes data as props to child components. Import all section components. The page itself is the orchestrator.

### Section 1 — Hero (components/public/HeroSection.tsx)
- Full viewport height `min-h-screen`, background `#0D0D0D`
- **Animated circuit grid background:** CSS only — use `bg-grid` pattern via globals.css:
  ```css
  .bg-grid {
    background-image:
      linear-gradient(rgba(0,180,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,180,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
  }
  ```
- Floating neon orb decorations: two `absolute` divs with `rounded-full blur-3xl opacity-20`:
  - One `bg-[#00B4FF]` top-left
  - One `bg-[#00FF9C]` bottom-right
- Content centered:
  - Label above heading: `// IIMS COLLEGE · EST. 2024` in Share Tech Mono, #00FF9C, letter-spacing wide
  - Main heading: **"Securing the Digital Future"** in Orbitron 900 weight, white, text-5xl to text-7xl responsive
  - Sub-heading: **"IIMS Cybersecurity Club"** in Orbitron 700, text-[#00B4FF], text-2xl
  - Body text: "Nepal's next generation of ethical hackers, defenders, and security researchers." in Exo 2, #8892A4
  - Two buttons:
    - Primary: **"Explore Club Life ↓"** → scrolls to `#about` (anchor link)
    - Outline: **"Member Portal →"** → `/portal/login`
  - Animated scroll arrow at very bottom of hero: bouncing chevron-down SVG in #00B4FF

### Section 2 — About (components/public/AboutSection.tsx)
- Section label: `// 01 — About Us` in Share Tech Mono #00FF9C
- Two columns desktop: text left, image right
- Text: "IIMS Cybersecurity Club is the premier technical club at IIMS College, Kathmandu. We train the next generation of security professionals through hands-on workshops, CTF competitions, and real-world security research. From ethical hacking to digital forensics, we cover the full spectrum of cybersecurity."
- Image: `/public/about-mission.jpg` using Next.js Image (add placeholder note: "// TODO: Add about-mission.jpg to /public folder")
- 2x2 icon grid below text (use inline SVGs for icons):
  - 🛡️ Ethical Hacking
  - 🔒 Defense & Blue Team
  - 🔬 Security Research
  - 🏆 CTF Competitions
- Each icon card: glassmorphism style + hover neon glow

### Section 3 — Domains (components/public/DomainsSection.tsx)
- Section label: `// 02 — Our Domains`
- Heading: "What We Do"
- 5 domain cards in a responsive grid (2 cols tablet, 3 cols then 2+3 desktop):
  - **Red Team** — Offensive security, penetration testing, vulnerability research
  - **Blue Team** — Threat detection, incident response, SIEM, SOC operations
  - **Cloud & DevSecOps** — Securing pipelines, AWS/Azure security, container hardening
  - **Digital Forensics** — Memory analysis, disk forensics, malware reverse engineering
  - **AI & Security** — Adversarial ML, AI-powered threat detection, LLM security
- Each card: glassmorphism, relevant inline SVG icon, title in Orbitron, description in Exo 2
- Hover: border color shifts to #00FF9C + neon glow

### Section 4 — Events (components/public/EventsSection.tsx)
- **This is a Server Component prop receiver — data is fetched in page.tsx**
- Section label: `// 03 — Events`
- Heading: "Upcoming Events"
- Receives `events` prop (array from `public_events` table where `status = 'upcoming'`)
- **CRITICAL: Handle empty state gracefully:**
  ```
  if (events.length === 0) → show elegant empty state:
    Icon: calendar with question mark (inline SVG)
    Text: "The team is cooking up something exciting..."
    Sub: "Check back soon or follow our socials for announcements."
    Social links: Instagram + Facebook icons
    Style: glassmorphism card, centered, #00FF9C accent
  ```
- When events exist: responsive grid of event cards
  - Each card: event image (from `image_url`) with fallback gradient if no image
  - Event type badge: `Workshop` / `CTF` / `Seminar` in color-coded pills
    - CTF → #FF3B3B (red), Workshop → #00B4FF (blue), Seminar → #00FF9C (green)
  - Event date in Share Tech Mono
  - Title in Orbitron
  - Location with pin icon
  - Description excerpt (max 100 chars, truncated with `...`)
  - Card: glassmorphism + hover glow

### Section 5 — Team (components/public/TeamSection.tsx)
- Section label: `// 04 — The Team`
- Heading: "Meet the Team"
- **HARDCODED team data** (this section is static, not from database):

```typescript
const team = [
  { name: "Vision KC",     role: "President",        initials: "VK" },
  { name: "Hari",          role: "Vice President",    initials: "H"  },
  { name: "Hari",          role: "Treasurer",         initials: "H"  },
  { name: "Hari",          role: "Secretary",         initials: "H"  },
  { name: "Hari",          role: "Joint Secretary",   initials: "H"  },
  { name: "Hari",          role: "Marketing Lead",    initials: "H"  },
  { name: "Sujal Mainali", role: "Technical Head",    initials: "SM" },
  { name: "Hari",          role: "Logistics",         initials: "H"  },
]
```

- Each member card: glassmorphism
  - Avatar: circle with initials in Orbitron, gradient background `from-[#00B4FF] to-[#00FF9C]`
  - Name in Orbitron white
  - Role in Share Tech Mono #00FF9C
  - Hover: lift effect + neon glow
- Grid: 2 cols mobile, 3 cols tablet, 4 cols desktop

### Section 6 — Stats (components/public/StatsSection.tsx)
- Section label: `// 05 — By the Numbers`
- Full-width dark section with grid background
- 4 stats in a row:
  - **50+** Active Members
  - **15+** Events Conducted
  - **5+** Competitions Won
  - **3+** Partner Organizations
- **Scroll-triggered counting animation:**
  - Use `IntersectionObserver` in a `useClient` component
  - Numbers count up from 0 to target when section enters viewport
  - Duration: 2 seconds, easeOut timing
- Numbers in Orbitron 900, text-5xl, text-[#00FF9C]
- Labels in Exo 2, text-[#8892A4]

### Section 7 — Gallery (components/public/GallerySection.tsx)
- **Server Component prop receiver — data fetched in page.tsx**
- Section label: `// 06 — Club Life`
- Heading: "Gallery"
- Receives `gallery` prop (array from `public_gallery` table, ordered by `sort_order`)
- Admin-managed captions will include entries like:
  - "Winning the 2025 CTF Challenge"
  - "Guest lecture on Network Forensics"
  - "Hands-on Kali Linux Lab Session"
  - "Annual Cybersecurity Summit Team"
- Responsive masonry-style grid (CSS grid with `grid-auto-rows`)
- Each image: Next.js `<Image>`, rounded-xl, object-cover
  - Overlay on hover: dark gradient + caption text slides up from bottom
- **Empty state:** if no gallery images: "Gallery coming soon. Follow our journey on Instagram." + Instagram link
- Sort by `sort_order` ascending

### Section 8 — Contact/Join (components/public/ContactSection.tsx)
- Section label: `// 07 — Get In Touch`
- Two columns desktop:
  - Left: "Join the Club" — brief text about joining + link to `/portal/login`
  - Right: Contact form
- Contact form fields:
  - Full Name (text input)
  - Email (email input)
  - Subject (select: "General Inquiry", "Join the Club", "Event Query", "Partnership", "Other")
  - Message (textarea, min 4 rows)
- Submit calls `/api/contact` POST
- Success state: replace form with green success message with checkmark icon
- Error state: red error below form
- Client-side validation: all fields required, valid email format
- Contact info below form:
  - Email: `cybersec@iimscollege.edu.np`
  - College: IIMS College, Kathmandu, Nepal
  - Website: `https://iimscollege.edu.np/`

---

## 👥 STEP 3 — About Page (app/(public)/about/page.tsx)

### Hero Banner
- Dark banner with circuit grid background
- Title: "About Us" in Orbitron
- Breadcrumb: `Home / About` in Share Tech Mono

### Club Story
- Section label: `// 01 — Our Story`
- Two columns: story text left, image right (`/public/2.jpg`)
- Story text: "Founded in 2024 at IIMS College, the IIMS Cybersecurity Club was established with a singular mission: to build Nepal's next generation of cybersecurity professionals. What began as a small group of passionate students has grown into a thriving community of ethical hackers, defenders, and researchers."

### Mission & Values
- Section label: `// 02 — What We Stand For`
- Three glassmorphism cards:
  - **Mission:** "To cultivate cybersecurity talent through practical, hands-on education and real-world security challenges."
  - **Vision:** "A Nepal where every digital system is secured by locally trained, world-class cybersecurity professionals."
  - **Values:** "Integrity. Curiosity. Collaboration. Ethical practice above all."

### Team Section
- Same team data as homepage — reuse TeamSection component

### College Association
- Banner: "Officially Recognized by IIMS College"
- College logo (placeholder: `/public/college-logo.png`)
- Link to `https://iimscollege.edu.np/` in new tab
- Style: glassmorphism, border-[#00B4FF]

---

## 📅 STEP 4 — Events Page (app/(public)/events/page.tsx)

**Server Component** — fetches ALL events from `public_events` table (both upcoming and past).

### Page Hero
- Title: "Events & Activities" banner

### Filter Tabs
- Three tabs: "All", "Upcoming", "Past"
- Client component for tab state
- Filters the events array client-side
- Active tab: `border-b-2 border-[#00B4FF] text-[#00B4FF]`

### Events Grid
- 3 columns desktop, 2 tablet, 1 mobile
- Each card: same style as homepage events section (image, type badge, date, title, location, description)
- Past events: slightly desaturated + "Past" badge in gray
- **Empty state per tab:** if no upcoming events → cyber-styled empty state card

### Event Type Legend
- Small legend at top: color key for CTF (red), Workshop (blue), Seminar (green), Competition (orange)

---

## 📬 STEP 5 — Contact Page (app/(public)/contact/page.tsx)

### Layout
Two columns desktop, stacked mobile.

**Left — Contact Info:**
- Email: `cybersec@iimscollege.edu.np`
- Address: IIMS College, Kathmandu, Nepal
- Website: `https://iimscollege.edu.np/`
- Social links: Facebook, Instagram, GitHub
- Map placeholder: gray box with text "IIMS College, Kathmandu" (no Maps API)

**Right — Contact Form:**
- Same form as ContactSection component — reuse it
- Full validation + Resend API call

**API Route (app/api/contact/route.ts):**
- POST receives: name, email, subject, message
- Sends via Resend to: `cybersec@iimscollege.edu.np`
- Email subject: `New Contact: [subject] — IIMS Cybersecurity Club`
- Validate all fields server-side too
- Return 200 success or 500 with error message

---

## 🔒 STEP 6 — Portal Login (app/portal/login/page.tsx)

- Full screen dark background with grid pattern
- Centered glassmorphism card
- Club name + cyber shield SVG icon at top
- Label: `// MEMBER ACCESS` in Share Tech Mono #00FF9C
- Heading: "Member Portal" in Orbitron
- Subtext: "Enter your IIMS email to receive a secure magic login link"
- Email input: dark themed, border-[#00B4FF] on focus
- Submit button: "Send Login Link →" (primary style)
- Loading state: spinner + "Sending..."
- Success state: "✉️ Check your inbox! Magic link sent to [email]"
- Error states:
  - `?error=access_denied` → "Your membership application was not approved. Contact cybersec@iimscollege.edu.np"
  - `?error=server_error` → "Something went wrong. Please try again in a moment."
- Bottom: `← Back to Club Website` link → `/`

---

## 🔄 STEP 7 — Auth Callback + Middleware

**app/api/auth/callback/route.ts:**
- Handle Supabase magic link exchange
- After session confirmed, query members table:
  - Email not in members → create `{ email, status: 'pending', role: 'member' }` → redirect `/portal/pending`
  - Status pending → redirect `/portal/pending`
  - Status rejected → redirect `/portal/login?error=access_denied`
  - Status approved → redirect `/portal/dashboard`
- Full try/catch → catch → redirect `/portal/login?error=server_error`

**middleware.ts:**
- Protect: `/portal/dashboard/:path*` and `/portal/admin/:path*`
- All other routes: pass through
- Full try/catch on db query
- Catch → `/portal/login?error=server_error`

---

## 🏠 STEP 8 — Portal Dashboard

**PortalTopbar (components/portal/PortalTopbar.tsx):**
- `bg-[#0A1F44] border-b border-[#00B4FF]/30`
- Left: "IIMS Cybersecurity Club" small + "Member Portal" label
- Right: member name, "← Public Website" link → `/`, Logout button

**Sidebar (components/portal/Sidebar.tsx):**
- Dark navy background
- Links: Feed, Documents, Profile
- Bottom (admin only): Admin Panel link
- Active link: #00B4FF left border + text

**Dashboard pages:**
- `/portal/dashboard` → post feed (pinned first, newest first), create post button
- `/portal/dashboard/documents` → upload PDF/DOC, list with View (signed URL) + Download
- `/portal/dashboard/profile` → edit name, bio, view own posts

---

## ⚙️ STEP 9 — Admin Panel (app/portal/admin/page.tsx)

5 tabs — full CRUD control over the entire platform:

### Tab 1: Members
- Table of all members: name, email, role, status, joined date
- Pending members highlighted, Approve + Reject buttons
- Approved members: Remove button
- Real-time update after action (re-fetch)

### Tab 2: Posts (Member Feed)
- All portal posts: title, author, date, pinned status
- Delete button, Pin/Unpin toggle
- `is_public` toggle — "Publish to Website" switch (pushes post to public announcements)

### Tab 3: Public Announcements
- Shows only posts where `is_public = true`
- Toggle visibility, delete

### Tab 4: Events Manager
- Table of all events in `public_events`
- "Add Event" button → modal form:
  - Title, Date/Time, Location, Type (dropdown), Description, Status (upcoming/past)
  - Image upload → uploads to Supabase Storage `event-images` bucket → saves URL
- Edit and Delete buttons on each row
- Status toggle: upcoming ↔ past

### Tab 5: Gallery Manager
- Grid of current gallery images from `public_gallery`
- "Upload Image" button → file picker → upload to `public-gallery` bucket → save URL + caption + sort_order
- Each image: caption edit inline, delete button, drag-to-reorder (update sort_order)

---

## 🤖 STEP 10 — GitHub Auto-Push Script (push.sh)

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
  echo "✅ Done! Changes live on GitHub."
else
  echo "❌ Push failed. Check internet or GitHub credentials."
  exit 1
fi
```

Make executable: `chmod +x push.sh`
Run anytime: `./push.sh`

---

## ✅ STEP 11 — Full Testing Checklist

### Public Website
- [ ] `localhost:3000` loads — all 8 sections visible
- [ ] Circuit grid background shows in hero
- [ ] "Explore Club Life" scrolls to About section
- [ ] "Member Portal →" goes to `/portal/login`
- [ ] Navbar links work: About, Events, Contact
- [ ] Mobile: hamburger menu opens/closes with all links
- [ ] Footer: Facebook, Instagram, GitHub links correct
- [ ] Footer: IIMS College link opens `https://iimscollege.edu.np/` in new tab
- [ ] Stats section: numbers animate when scrolled into view
- [ ] Events section with empty DB: shows elegant empty state (not broken/blank)
- [ ] Gallery section with empty DB: shows empty state message (not broken/blank)
- [ ] Contact form: submit with empty fields → validation errors shown
- [ ] Contact form: submit valid data → success message appears

### Portal Auth
- [ ] Visit `/portal/dashboard` not logged in → redirects to `/portal/login`
- [ ] Login page shows "← Back to Club Website" → returns to `/`
- [ ] Enter email → "Check your inbox" message shows
- [ ] Click magic link → redirects to `/portal/pending` (first time)
- [ ] Approve own account in Supabase → login again → goes to `/portal/dashboard`
- [ ] Break Supabase URL → visit `/portal/dashboard` → redirects to `/portal/login?error=server_error`
- [ ] Error message shows on login page for `?error=server_error`

### Portal Features
- [ ] Create a post → appears in feed
- [ ] Pin a post from admin → appears first in feed
- [ ] Upload PDF → appears in documents
- [ ] View document → signed URL opens file
- [ ] `/portal/admin` as non-admin → redirected to dashboard
- [ ] Admin panel: all 5 tabs load
- [ ] Approve pending member → status updates in Supabase
- [ ] Add an event in Events Manager → appears on public homepage events section
- [ ] Upload gallery image → appears on public homepage gallery section
- [ ] Toggle `is_public` on a post → appears in Public Announcements tab

### GitHub Script
- [ ] Run `./push.sh` → all steps print without errors
- [ ] Go to GitHub repo → new commit with timestamp visible

---

## 📋 CODING RULES (AI must follow all of these)

1. Every code block starts with file path comment: `// app/(public)/page.tsx`
2. After every file: tell me exactly where to paste it + any command to run
3. Comments inside every component explaining what each section does
4. **One file at a time** — never give multiple files together
5. All TypeScript — define types in `types/database.ts` and import them
6. **Public data fetching = Server Components** using `supabase-server.ts` for SEO
7. **Portal/interactive = Client Components** with `'use client'` directive
8. Error handling with try/catch on every async operation
9. **Never break UI if DB returns empty array** — always handle empty states
10. All forms: client-side validation first, then API call
11. Never use `window.location.href` — always `router.push()` + `router.refresh()`
12. Never hardcode Supabase keys — always `process.env.NEXT_PUBLIC_SUPABASE_URL` etc.
13. Tailwind arbitrary values for exact hex colors: `text-[#00B4FF]`, `bg-[#0D0D0D]`
14. Google Fonts loaded in `app/layout.tsx` using Next.js `next/font/google`

---

## ▶️ START COMMAND

After pasting this full prompt say exactly:

> "I have read everything. Let's start with Step 1.
> Build `components/public/PublicNavbar.tsx` first.
> Use the exact Cyber Blue Matrix design system and IIMS Cybersecurity Club details.
> Wait for my confirmation before giving me the next file."

---

*IIMS Cybersecurity Club · IIMS College · Kathmandu, Nepal*
*Prompt V5.0 FINAL — No placeholders. All details filled in. Ready to build.*