# 🚀 ANTIGRAVITY MEGA PROMPT — Complete Club Website + Member Portal
# One Project. One Domain. Public Website + Private Portal.
#
# HOW TO USE THIS PROMPT:
# Step 1 → Paste your CONTEXT.md first in Antigravity
# Step 2 → Paste this ENTIRE file right after it
# Step 3 → Say "Start with Step 1" — AI goes one file at a time
# Step 4 → Say "done, next" after each file is tested and confirmed working
#
# Fill in every [SQUARE BRACKET] with your real details before pasting.

---

## 📍 FULL PROJECT VISION

I am building ONE Next.js 14 project that contains TWO connected experiences:

**1. Public Club Website** — anyone on the internet can visit this
**2. Private Member Portal** — only approved members can access this after login

Both live on the same domain. The public website has a prominent button that takes visitors into the member portal. From inside the portal, members can navigate back to the public website.

This is NOT two separate projects. Everything is in one Next.js app, one GitHub repo, one Vercel deployment.

---

## 🗂️ COMPLETE FOLDER STRUCTURE

Build exactly this folder structure. Do not deviate from it:

```
club-portal/
│
├── app/
│   │
│   ├── layout.tsx                    ← Root layout (fonts, global styles, metadata)
│   ├── globals.css                   ← Global CSS (smooth scroll, base styles)
│   │
│   │── (public)/                     ← Route group for public website pages
│   │   ├── layout.tsx                ← Public layout with Navbar + Footer
│   │   ├── page.tsx                  ← Homepage /
│   │   ├── about/
│   │   │   └── page.tsx              ← About the club /about
│   │   ├── events/
│   │   │   └── page.tsx              ← Events & activities /events
│   │   └── contact/
│   │       └── page.tsx              ← Contact form /contact
│   │
│   ├── portal/                       ← All portal routes live under /portal
│   │   ├── login/
│   │   │   └── page.tsx              ← Magic link login /portal/login
│   │   ├── pending/
│   │   │   └── page.tsx              ← Awaiting approval /portal/pending
│   │   ├── dashboard/
│   │   │   ├── layout.tsx            ← Dashboard sidebar layout
│   │   │   ├── page.tsx              ← Post feed /portal/dashboard
│   │   │   ├── documents/
│   │   │   │   └── page.tsx          ← File sharing /portal/dashboard/documents
│   │   │   └── profile/
│   │   │       └── page.tsx          ← Member profile /portal/dashboard/profile
│   │   └── admin/
│   │       └── page.tsx              ← Admin panel /portal/admin
│   │
│   └── api/
│       ├── auth/
│       │   └── callback/
│       │       └── route.ts          ← Supabase auth callback handler
│       └── contact/
│           └── route.ts              ← Contact form submission handler
│
├── components/
│   ├── public/
│   │   ├── PublicNavbar.tsx          ← Navigation for public website
│   │   ├── PublicFooter.tsx          ← Footer for public website
│   │   ├── HeroSection.tsx           ← Homepage hero with CTA
│   │   ├── PhotoGallery.tsx          ← Club photo grid
│   │   ├── EventCard.tsx             ← Single event display card
│   │   └── ContactForm.tsx           ← Contact form component
│   │
│   └── portal/
│       ├── PortalNavbar.tsx          ← Top bar inside portal with "Back to Website" link
│       ├── Sidebar.tsx               ← Portal sidebar navigation
│       ├── PostCard.tsx              ← Post display card
│       ├── PostForm.tsx              ← Create/edit post modal
│       ├── DocumentCard.tsx          ← Document display card
│       └── UploadForm.tsx            ← File upload component
│
├── lib/
│   ├── supabase.ts                   ← Supabase browser client
│   └── supabase-server.ts            ← Supabase server client (for server components)
│
├── middleware.ts                     ← Route protection — portal routes only
├── .env.local                        ← Secret keys (never commit this)
├── push.sh                           ← GitHub auto-push script
└── CONTEXT.md                        ← Project context file
```

---

## 🔐 UPDATED MIDDLEWARE RULES

The middleware ONLY protects routes starting with `/portal/dashboard` and `/portal/admin`.
The public website routes (`/`, `/about`, `/events`, `/contact`) are completely open — no auth check.
The `/portal/login` and `/portal/pending` routes are also open (no auth needed to reach them).

Middleware logic:
```
Request comes in
      ↓
Is the path /portal/dashboard/* or /portal/admin/*?
      ↓ YES
Check Supabase session
      ↓
No session? → redirect to /portal/login
      ↓
Has session? → query members table for status and role
      ↓
  status = pending   → redirect to /portal/pending
  status = rejected  → redirect to /portal/login?error=access_denied
  status = approved  → allow through ✅
  role = admin       → allow through /portal/admin ✅
      ↓ NO (public route)
Allow through with no checks ✅
```

Wrap the entire members table query in try/catch.
On any catch error → redirect to `/portal/login?error=server_error`

---

## 🌐 STEP 1 — Public Website Layout (app/(public)/layout.tsx)

Build the shared layout that wraps all public website pages.

**PublicNavbar (components/public/PublicNavbar.tsx):**
- Fixed at top, `bg-slate-900/95`, backdrop-blur
- Logo/club name on the left (white bold text, links to `/`)
- Navigation links on the right:
  - Home → `/`
  - About → `/about`
  - Events → `/events`
  - Contact → `/contact`
- A special CTA button: **"Member Portal →"** → links to `/portal/login`
  - Style: indigo-600 filled, white text, rounded-lg, hover:indigo-500
  - This button must visually stand out from the nav links
- Mobile: hamburger menu that toggles a dropdown with all links
- Smooth underline hover effect on nav links

**PublicFooter (components/public/PublicFooter.tsx):**
- Dark background `bg-slate-900`, top border `border-t border-slate-800`
- Three columns on desktop, stacked on mobile:
  - Column 1: Club name + one-line description + social media icons
  - Column 2: Quick links (Home, About, Events, Contact, Member Portal)
  - Column 3: College name + college website link + college address
- Bottom bar: `© 2026 [CLUB NAME] · [COLLEGE NAME] · All rights reserved`
- Social media icons as inline SVGs (Instagram, Facebook, LinkedIn, Twitter/X — only include ones I have)

**Layout file:**
- Import and render PublicNavbar at top, children in middle, PublicFooter at bottom
- Add `pt-16` to main content area to account for fixed navbar height

---

## 🏠 STEP 2 — Homepage (app/(public)/page.tsx)

Build the complete homepage with these sections in order:

### Hero Section
- Full viewport height (`min-h-screen`)
- Dark gradient background: `from-slate-900 via-slate-800 to-indigo-950`
- Centered content:
  - Small label above heading: "[COLLEGE NAME]" in indigo-400, uppercase, letter-spacing wide
  - Main heading: "[CLUB NAME]" in large white bold text (text-5xl md:text-7xl)
  - Tagline: one line description of the club in slate-300
  - Two buttons side by side:
    - Primary: **"Enter Member Portal"** → `/portal/login` (indigo filled, large)
    - Secondary: **"Learn More ↓"** → scrolls to `#about` section (outline white, large)
- Subtle animated gradient or particle background (CSS only — no JS libraries)
- Scroll indicator arrow at bottom of hero that bounces

### About Preview Section (id="about")
- Two columns on desktop: text left, image right
- Text: short paragraph about the club (placeholder text I can replace)
- Image: `/public/1.jpg` using Next.js Image component
- "Learn More About Us →" link to `/about`

### Photo Gallery Section
- Section heading: "Club Life" centered
- Responsive grid showing images `/public/1.jpg` through `/public/5.jpg`
  - Mobile: 1 column | Tablet: 2 columns | Desktop: 3 columns
- Each image: rounded-xl, shadow-lg, object-cover, h-64, hover scale-105 with transition

### Upcoming Events Preview Section
- Section heading: "Upcoming Events" centered
- Show 3 placeholder event cards (hardcoded for now — I'll replace content)
- Each card: date badge, event title, short description, location
- "View All Events →" link to `/events`
- Card style: bg-slate-800, rounded-xl, border border-slate-700, hover:border-indigo-500

### College Affiliation Section
- Background: `bg-slate-800` (slight contrast from rest of page)
- Two columns on desktop:
  - Left: College logo (`/public/college-logo.png`) + college name + tagline + address
  - Right: "Visit Our College" button + college social links
- College website link opens in new tab: `[COLLEGE WEBSITE URL]`
- This section establishes credibility and connects club to institution

### Portal CTA Section (bottom of page, above footer)
- Dark indigo background: `bg-indigo-900`
- Centered large text: "Already a member? Access your portal."
- Big button: **"Member Login →"** → `/portal/login`
- Smaller text below: "Not a member yet? Contact us to join."

---

## 👥 STEP 3 — About Page (app/(public)/about/page.tsx)

Build a complete about page with:

### Hero Banner
- Page title "About [CLUB NAME]" with dark background and subtle image overlay (use `/public/2.jpg` with opacity)

### Club Story Section
- Two columns: story text on left, image on right (`/public/3.jpg`)
- Placeholder paragraph text I can replace (2-3 paragraphs about the club's founding and mission)

### Mission & Values Section
- Three cards side by side on desktop:
  - Card 1: Mission statement with an icon (use inline SVG)
  - Card 2: Vision statement with an icon
  - Card 3: Core values with an icon
- Card style: bg-slate-800, rounded-xl, centered content

### Team Section
- Section heading: "Our Team"
- Grid of team member cards (3-4 columns on desktop):
  - Each card: placeholder avatar (gray circle with initials), name, role/position
  - Include 6 placeholder team member cards with names like "Team Member" and role "President", "Vice President", "Secretary", "Treasurer", "Tech Lead", "Design Lead"
  - I will replace these with real names later
- Card style: centered, avatar on top, name bold, role in indigo

### College Association Banner
- Simple banner: "Officially recognized by [COLLEGE NAME]"
- College logo small, link to college website

---

## 📅 STEP 4 — Events Page (app/(public)/events/page.tsx)

Build a complete events page:

### Page Hero
- Title "Events & Activities" with dark banner

### Filter Tabs
- Three tabs: "All", "Upcoming", "Past"
- Active tab: indigo underline/fill
- Clicking a tab filters the event cards shown (use React state for filtering)

### Events Grid
- 6 placeholder event cards in a 3-column desktop grid
- 3 "upcoming" events + 3 "past" events (use a status field to differentiate)
- Each event card contains:
  - Date badge (top left, indigo background): "19 Feb"
  - Event title (bold, white)
  - Short description (slate-400)
  - Location with a pin icon (inline SVG)
  - Status badge: "Upcoming" (green) or "Past" (gray)
  - For upcoming events only: "Register Interest" button (outline indigo)
- Card: bg-slate-800, rounded-xl, border border-slate-700

### Note at bottom
- Add a comment in the code: `// TODO: Replace hardcoded events array with Supabase fetch in Phase 4`
- This way I know where to wire in real data later

---

## 📬 STEP 5 — Contact Page (app/(public)/contact/page.tsx + API route)

### Contact Page UI
Two columns on desktop:

**Left column — Contact Info:**
- Club name and tagline
- Email address with mail icon
- College name and address with location icon
- Social media links with icons
- Map embed or placeholder: simple gray box with "Find us at [COLLEGE NAME]" text (no Google Maps API needed)

**Right column — Contact Form:**
- Fields: Full Name, Email, Subject (dropdown: "General Inquiry", "Join the Club", "Event Query", "Other"), Message textarea
- Submit button: "Send Message" in indigo
- On submit: call `/api/contact` POST route
- Success state: replace form with green success message "Message sent! We'll get back to you soon."
- Error state: show red error message below form

**API Route (app/api/contact/route.ts):**
- Receives POST with: name, email, subject, message
- Sends email using Resend to: `[YOUR CLUB EMAIL ADDRESS]`
- Email subject: `"New Contact Form Submission: [subject]"`
- Email body: formatted HTML showing all four fields clearly
- Returns 200 on success, 500 on failure
- Input validation: all fields required, email must be valid format

---

## 🔒 STEP 6 — Portal Login Page (app/portal/login/page.tsx)

**Important change from before:** Login page is now at `/portal/login` not `/login`.
Update all redirects in middleware and auth callback accordingly.

Build the login page:
- Centered card on dark full-screen background
- Club logo or name at top
- Heading: "Member Portal"
- Subtext: "Enter your email to receive a secure login link"
- Email input field (large, clean)
- Submit button: "Send Login Link" (indigo filled, full width)
- Loading state: button shows spinner and "Sending..." text while waiting
- Success state: replace form with: "✉️ Check your email! We've sent a magic link to [email]. Click it to sign in."
- Error states:
  - `?error=access_denied` → show: "Your membership application was not approved."
  - `?error=server_error` → show: "Something went wrong on our end. Please try again."
  - `?error=email_not_found` → show nothing extra (new emails auto-create pending accounts)
- Bottom link: "← Back to Club Website" → links to `/`
- This back link is important — it connects the portal back to the public website

---

## 🔄 STEP 7 — Auth Callback + Middleware (Updated Paths)

**File: app/api/auth/callback/route.ts**
- Handles Supabase magic link callback
- After verifying session, checks members table:
  - Email not found → create pending member record → redirect to `/portal/pending`
  - Status pending → redirect to `/portal/pending`
  - Status rejected → redirect to `/portal/login?error=access_denied`
  - Status approved → redirect to `/portal/dashboard`
- Wrap everything in try/catch → on error redirect to `/portal/login?error=server_error`

**File: middleware.ts**
- Protect ONLY these path patterns: `/portal/dashboard/:path*` and `/portal/admin/:path*`
- All other paths pass through freely
- Full try/catch around db query
- On catch → redirect to `/portal/login?error=server_error`

---

## 🏠 STEP 8 — Portal Dashboard with "Back to Website" Link

**File: components/portal/PortalNavbar.tsx**
- This is the top bar inside the member portal (not the public website navbar)
- Left side: Club name (smaller) + "Member Portal" label
- Right side:
  - Member name/avatar
  - **"← Public Website"** link → `/` (opens same tab — this is how members go back to the website)
  - Logout button
- Style: bg-slate-900, border-b border-slate-800

**File: app/portal/dashboard/layout.tsx**
- Renders PortalNavbar at top
- Fixed Sidebar on left (desktop) / hamburger on mobile
- Main content area on right
- Sidebar links: Feed, Documents, Profile
- Sidebar bottom: Admin Panel link (only visible if role = admin)

---

## 🖥️ STEP 9 — Remaining Portal Pages

These follow the same structure as previously defined. Build them at the new `/portal/` paths:

**app/portal/pending/page.tsx:**
- Full screen centered message: "⏳ Your membership is under review"
- Subtext: "Our admin team will review your application and get back to you."
- "← Back to Club Website" link → `/`
- Logout button

**app/portal/dashboard/page.tsx:**
- Post feed from Supabase posts table (pinned first, then newest)
- New Post button → PostForm modal
- Loading skeleton while fetching

**app/portal/dashboard/documents/page.tsx:**
- File upload (PDF, DOC, DOCX only)
- Upload to Supabase Storage bucket: `club-documents`
- Document list with View (signed URL) and Download buttons
- Admin sees Delete button on each document

**app/portal/admin/page.tsx:**
- Protected — redirect non-admins to `/portal/dashboard`
- Three tabs: Members, Posts, Documents
- Members tab: pending list with Approve/Reject buttons
- Posts tab: all posts with Delete and Pin/Unpin
- Documents tab: all documents with Delete

---

## 🤖 STEP 10 — GitHub Auto-Push Script (push.sh)

Create at project root. The script must:
1. Print: `"🚀 Pushing to GitHub..."`
2. Run: `npx prettier --write . --log-level silent`
3. Run: `git add .`
4. Create timestamp: `"Update: DD Mon YYYY — HH:MM"`
5. Run: `git commit -m "[timestamp]"` — if nothing to commit, print `"Nothing new to commit."` and exit cleanly
6. Run: `git push origin main`
7. On success: print `"✅ Done! Changes live on GitHub."`
8. On push failure: print `"❌ Push failed. Check internet or GitHub credentials."` and exit code 1

After giving me the script, tell me:
- Exact command to make it executable: `chmod +x push.sh`
- Exact command to run it: `./push.sh`
- How to verify on GitHub that it worked

---

## ✅ STEP 11 — Full Testing Checklist

Give me a complete numbered checklist to test every feature:

**Public Website:**
- [ ] Visit `localhost:3000` — homepage loads with hero, gallery, events preview, college section
- [ ] Click every navbar link — all pages load without errors
- [ ] Resize to mobile — hamburger menu appears, all sections stack correctly
- [ ] Click "Enter Member Portal" button — goes to `/portal/login`
- [ ] On `/portal/login` — click "Back to Club Website" — returns to `/`
- [ ] Submit contact form with valid data — success message appears
- [ ] Submit contact form with empty fields — validation errors appear
- [ ] Check email inbox — contact form email received

**Portal Auth:**
- [ ] Go to `localhost:3000/portal/dashboard` without logging in — redirects to `/portal/login`
- [ ] Enter email on login page — success message "Check your email" appears
- [ ] Click magic link from email — redirected to `/portal/pending` (first time) or `/portal/dashboard` (if approved)
- [ ] Set your own account to approved in Supabase — login again — goes to `/portal/dashboard`
- [ ] Break Supabase URL in .env.local — try visiting `/portal/dashboard` — redirects to `/portal/login?error=server_error` (then restore correct URL)

**Portal Features:**
- [ ] Create a post from dashboard — appears in feed immediately
- [ ] Upload a PDF — appears in documents list
- [ ] Click View on a document — signed URL opens the file
- [ ] Visit `/portal/admin` as admin — admin panel loads with three tabs
- [ ] Approve a pending member — their status updates in Supabase

**GitHub Script:**
- [ ] Run `./push.sh` — all steps print without errors
- [ ] Go to github.com → your repo → see new commit with timestamp message

---

## 📋 CODING RULES (Remind AI of these every session)

1. Every code block starts with file path as a comment: `// app/portal/login/page.tsx`
2. After every file: tell me where to paste it + any command to run
3. Comments inside code explaining what each section does — I am a beginner
4. One file at a time — never bundle multiple files
5. All TypeScript — no plain JavaScript files
6. Error handling with try/catch on every async operation
7. Loading states on every data fetch (skeleton or spinner)
8. All forms must have client-side validation before submitting
9. Never use `window.location.href` — always use `router.push()`
10. Never hardcode Supabase keys — always use `process.env`

---

## ▶️ HOW TO START THIS SESSION

After pasting this full prompt, say exactly:

> "I have read everything. Let's start with Step 1 — the Public Website Layout.
> Build `components/public/PublicNavbar.tsx` first and wait for my confirmation."

---

## 🔑 MY DETAILS (Fill these in before pasting)

```
Club Name:             [IIMS cyber security club ]
College Name:          [IIMS COLLEGE ]
College Website:       [https://iimscollege.edu.np/]
Club Email:            [EMAIL_ADDRESS]
Club Instagram:        [URL or leave as "none"]
Club Facebook:         [URL or leave as "none"]
Club LinkedIn:         [URL or leave as "none"]
Club Twitter/X:        [URL or leave as "none"]
Images in /public:     1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg
College Logo:          college-logo.png (place in /public before Step 2)
Supabase Project:      [Already set up — keys in .env.local]
Vercel Project:        [Already connected to GitHub]
```

---

*Mega Prompt v3.0 | Public Website + Member Portal | One Project One Domain*