# UI REFORM PROMPT — ICEHC Portal
## Full Visual & Content Redesign — Grounded in Club Proposal + IIMS College Website
## IIMS Cybersecurity & Ethical Hacking Club (ICEHC), IIMS College, Kathmandu, Nepal
> Feed this file AFTER `CONTEXT.md`, `AGENT_PROMPT.md`, and `BACKEND_LOGIC_PROMPT.md`.
> This prompt OVERRIDES and REPLACES all UI decisions in previous prompts wherever there is conflict.
> It is grounded in two primary sources: (1) the official ICEHC Club Proposal document, and
> (2) live content from https://iimscollege.edu.np/ as of February 2026.

---

## WHY THIS REFORM EXISTS

The existing UI prompts describe a correct technical architecture but treat design as generic.
The result risks producing a portal that looks like any SaaS dashboard — not an IIMS College
sub-product. This prompt corrects that. Every UI decision below is traceable to:

- **Source A** — The official ICEHC Club Proposal (founding members, vision, objectives, activities plan)
- **Source B** — The live IIMS College website at https://iimscollege.edu.np/
- **Source C** — The IIMS College brand language: "Re-Defining Modern Education", "IIMS 2.0",
  "International Degrees in IT, Business & Hospitality", Taylor's University collaboration

The portal must feel like it was designed **by the same team** that designed iimscollege.edu.np —
a direct extension of the IIMS College visual identity applied to a cybersecurity club context.

---

## TABLE OF CONTENTS

1. [Brand Source of Truth](#1-brand-source-of-truth)
2. [ICEHC Club Identity — From the Proposal](#2-icehc-club-identity--from-the-proposal)
3. [IIMS College Website — What We Extract](#3-iims-college-website--what-we-extract)
4. [The Dual Aesthetic — IIMS Professional + Cyber Precision](#4-the-dual-aesthetic--iims-professional--cyber-precision)
5. [Reformed Color System](#5-reformed-color-system)
6. [Reformed Typography](#6-reformed-typography)
7. [Public Website — Page-by-Page Reform](#7-public-website--page-by-page-reform)
8. [Portal — Shell Reform (Sidebar + Topbar)](#8-portal--shell-reform-sidebar--topbar)
9. [Portal — Dashboard Reform](#9-portal--dashboard-reform)
10. [Portal — CTF Section Reform](#10-portal--ctf-section-reform)
11. [Portal — Feed Reform](#11-portal--feed-reform)
12. [Portal — Events Reform](#12-portal--events-reform)
13. [Portal — BOD Section Reform](#13-portal--bod-section-reform)
14. [Portal — Admin Panel Reform](#14-portal--admin-panel-reform)
15. [Founding Members — Real Data to Seed](#15-founding-members--real-data-to-seed)
16. [Copywriting & Voice Guide](#16-copywriting--voice-guide)
17. [Component Reform Specifications](#17-component-reform-specifications)
18. [IIMS Website Navigation to Mirror](#18-iims-website-navigation-to-mirror)
19. [What Must Change vs What Must Stay](#19-what-must-change-vs-what-must-stay)
20. [Reform Implementation Order](#20-reform-implementation-order)

---

## 1. BRAND SOURCE OF TRUTH

### Primary Sources (Read Before Writing a Single Line)

| Source | URL / Location | What to Extract |
|---|---|---|
| IIMS College Website | https://iimscollege.edu.np/ | Color palette, nav structure, tone, logo placement, card styles, hero format |
| IIMS IT Club Page | https://iimscollege.edu.np/it-club/ | How the college presents clubs, what content is shown |
| IIMS CTF Page | https://iimscollege.edu.np/capture-the-flag/ | How CTF is branded at the institutional level |
| IIMS Hackathon Page | https://iimscollege.edu.np/iims-hackathon/ | Event page structure to mirror in portal events |
| ICEHC Club Proposal | (PDF — uploaded) | Vision, objectives, founding members, activities plan, actual names + IDs |
| Taylor's University | https://iimscollege.edu.np/taylor-university/ | Co-branding, academic partnership badge |

### IIMS Website Observed Structure (February 2026)

From visiting https://iimscollege.edu.np/ directly:

- **Hero**: Full-viewport video background. Overlaid text: "IIMS 2.0 — International Degrees in IT, Business & Hospitality"
- **Navigation**: Top bar (Events, Blogs, News) + main nav with mega-menu structure
- **Nav sections**: Discover Us | Our Courses | Media | News & Updates | Community & Clubs | Learning In Action | Contact Us
- **Community & Clubs** includes: Sports Club, Toastmasters, Hospitality Hub, Wellbeing Unit, **IT Club**, Media Club, Biz Hub, IIMS IMPACT
- **Learning In Action** includes: Hackathon, **Capture The Flag**, Project Showcase
- **CTA buttons**: "Apply", "Virtual Tour", "Info" — prominent, red/crimson
- **Logo**: Top-left, white on dark nav bar
- **Typography feel**: Clean, modern, institutional — not startup, not academic-stiff
- **Color feel**: Navy dominant in headers/nav, white/light grey surfaces for content, crimson red for CTAs
- **Event cards**: Image top, date badge, title — simple grid layout
- **Tagline style**: Short, punchy — "Re-Defining Modern Education", "IIMS 2.0", "Seek Opportunity", "Become Future Proof"

---

## 2. ICEHC CLUB IDENTITY — FROM THE PROPOSAL

### 2.1 Official Club Details (Ground Truth — Use Exactly)

```
Full Name:    IIMS Cybersecurity & Ethical Hacking Club
Short Name:   ICEHC
Type:         Academic / Professional + Technology & Innovation
College:      IIMS College, Kathmandu, Nepal
Partner:      Taylor's University, Malaysia
Email:        icehc@iimscollege.edu.np
Founded:      2026 (BCS 2026 Jan Intake)
```

### 2.2 Official Vision Statement (Use Word-for-Word on About Page and Hero)

> "To establish IIMS College as a premier hub for cybersecurity excellence in Nepal. We envision
> a community where students bridge the gap between theoretical computer science and real-world
> defense strategies, fostering a culture of ethical responsibility, digital safety, and
> proactive threat mitigation."

### 2.3 Four Official Objectives (Use on About Page — Verbatim)

1. **Practical Skill Development** — To move beyond theory by providing hands-on training in
   industry-standard tools (e.g., Kali Linux, Burp Suite, Wireshark) and methodologies
   (Penetration Testing, Network Defence).

2. **Ethical Hacking Awareness** — To promote "White Hat" hacking principles and educate the
   student body on digital hygiene, phishing defence, and scam prevention (aligning with the
   "Scan the Scammers" initiative).

3. **Career Readiness** — To prepare members for professional certifications (CEH, CompTIA
   Security+) and cybersecurity careers through Capture The Flag (CTF) competitions and expert
   guest sessions.

4. **Innovation & Research** — To encourage students to build and test their own security tools
   and research papers on emerging vulnerabilities.

### 2.4 Sustainability Vision (Use on About Page)

- **Mentorship Pipeline**: 2nd and 3rd-year students train 1st-year members in specific tools
- **Club Wiki**: GitHub or Notion — documenting every workshop
- **Faculty Integration**: Activities aligned with the academic calendar and BCS curriculum

### 2.5 Official Activities Plan — First 6 Months (Seed as Initial Events)

| Month | Event Name | Type | Description |
|---|---|---|---|
| 1 | Introduction to the Red Team | `workshop` | Kickoff: installing VMs (Kali Linux), ethics of hacking |
| 2 | Scan the Scammers Seminar | `seminar` | Dissecting financial fraud + educational scams, phishing defence |
| 3 | Internal CTF | `ctf` | Beginner-level: decryption, web exploitation for points |
| 4 | Guest Lecture Series | `seminar` | Cybersecurity professional: Nepal job market + threat landscape |
| 5 | Secure Coding Bootcamp | `workshop` | SQL Injection, XSS patching — collaboration with Coding Club |
| 6 | Hackathon / Cyber Day | `hackathon` | Red vs. Blue team simulation + project showcase |

### 2.6 Founding Members — Real Data (9 Members)

| # | Name | Student ID | Role | Club Position | Email |
|---|---|---|---|---|---|
| 1 | Sujal Mainali | IIMS-2082-0490 | admin | President | sujal2082-0490@iimscollege.edu.np |
| 2 | Karuna Bishkarma | IIMS-2082-0386 | bod | Executive Head | karuna2082-0386@iimscollege.edu.np |
| 3 | Sabina Neupane | IIMS-2082-0388 | bod | Event & Activities Coordinator | sabina2082-0388@iimscollege.edu.np |
| 4 | Raskin Shrestha | IIMS-2082-0279 | bod | Secretary | raskin2082-0279@iimscollege.edu.np |
| 5 | Deepika Kumari Yadav | IIMS-2082-0420 | bod | Vice President | dipika2082-0420@iimscollege.edu.np |
| 6 | Namika Prajapati | IIMS-2082-0429 | bod | Treasurer | namika2082-0429@iimscollege.edu.np |
| 7 | Radha Rawat | IIMS-2082-0357 | bod | IT Head | radha2082-0357@iimscollege.edu.np |
| 8 | Samrachana Lama | IIMS-2082-0339 | bod | Marketing & Communication Lead | samrachana2082-0339@iimscollege.edu.np |
| 9 | Barsha Shrestha | IIMS-2082-0358 | bod | Joint/Assistant Secretary | barsha2082-0358@iimscollege.edu.np |

> **Note on Radha Rawat**: The proposal lists her as "IT Head" which is not in the standard
> `club_post` CHECK constraint. Map her to `'Technical Lead'` in the DB — closest equivalent.
> The BOD Management tab in Admin shows display name "IT Head" via the UI label, but the DB
> stores `'Technical Lead'`. Update the CHECK constraint to include `'IT Head'` as an alias
> or just use `'Technical Lead'` consistently.

---

## 3. IIMS COLLEGE WEBSITE — WHAT WE EXTRACT

### 3.1 Navigation Architecture to Mirror

The IIMS site has a two-tier nav:
1. **Top utility bar**: Quick links (Events, Blogs, News) — very slim, small text
2. **Main nav bar**: Logo left + mega-menu links + CTAs (Apply, Virtual Tour, Info) right

ICEHC Public Website should mirror this exactly:
```
TOP BAR (slim, navy):   Upcoming Events | News | About IIMS College | icehc@iimscollege.edu.np
MAIN NAV (navy, bold):  [IIMS Logo] [ICEHC] | About | Events | CTF | Hackathon | Contact | [Member Login — crimson CTA]
```

### 3.2 Content Sections Seen on IIMS Homepage (Mirror in ICEHC Homepage)

| IIMS Homepage Section | ICEHC Equivalent |
|---|---|
| Upcoming Events grid (image + date badge + title) | Upcoming ICEHC Events grid |
| Recent Events | Past ICEHC Events |
| "IIMS 2.0 — International Degrees" hero with video | "ICEHC — Hack Ethically. Defend Relentlessly." hero |
| 4 card grid (Academic Excellence, Diverse & Inclusive, etc.) | 4 card grid (Objectives from the proposal) |
| Community & Clubs nav item | Link back to IT Club page |
| Learning In Action (CTF, Hackathon) | ICEHC CTF + Hackathon links |

### 3.3 Card Style Observed on IIMS Website

IIMS event cards:
- Image fills top portion of card (16:9 or similar)
- Date badge overlaid bottom-left on the image (navy bg, white text)
- Title below in bold
- Clean white card background
- No excessive shadows — very flat, clean
- Hover: slight scale on image

Replicate this **exactly** for ICEHC event cards on the public website.

### 3.4 IIMS Logo Usage Rules

- IIMS logo appears at: https://iimscollege.edu.np/wp-content/uploads/2024/04/logo.png
- Always link it to https://iimscollege.edu.np/ (opens new tab)
- Appear alongside ICEHC name — never replace the ICEHC wordmark
- In the portal sidebar: smaller version, navy background, white logo
- In emails: same side-by-side treatment, navy header

### 3.5 Taylor's University Co-branding

The IIMS site prominently features Taylor's University as an academic partner. The proposal
header shows both IIMS and Taylor's logos side-by-side. Replicate this:
- On the About page: "In academic collaboration with Taylor's University, Malaysia"
- On the public homepage footer: Taylor's University badge strip
- URL: https://iimscollege.edu.np/taylor-university/

---

## 4. THE DUAL AESTHETIC — IIMS PROFESSIONAL + CYBER PRECISION

### The Core Design Philosophy

ICEHC exists at the intersection of two worlds:

```
WORLD A — IIMS College Institutional:
  Clean | Professional | Light | Navy/White/Crimson | Academic credibility
  "Re-Defining Modern Education" | Taylor's University partner | Established 2010

WORLD B — Cybersecurity Club:
  Precise | Technical | Sharp | Focused | "White Hat" | Ethical | Defense-first
  CTF | Kali Linux | Burp Suite | Penetration Testing | Ethical responsibility
```

The ICEHC Portal must live authentically in BOTH worlds simultaneously. It is NOT:
- ❌ A dark hacker aesthetic (that's irresponsible and misrepresents IIMS)
- ❌ A generic corporate SaaS dashboard (that erases the cybersecurity identity)
- ❌ A CTFd clone with green terminal text (embarrassing for IIMS College)

It IS:
- ✅ An IIMS institutional product first — light, clean, professional, navy/crimson
- ✅ With deliberate cybersecurity personality — terminal-dark sections for CTF/code only,
     precise grid layouts, monospace where it matters (flag input, code blocks)
- ✅ Something that could sit naturally next to https://iimscollege.edu.np/it-club/ as its
     "portal extension" — same visual language, same institutional trust

### The "Dual Surface" Rule

Every component decides which world it primarily lives in:

| Component | Primary World | Secondary World | Implementation |
|---|---|---|---|
| Public Navbar | IIMS Institutional | — | Navy `#1A237E`, IIMS logo, clean links |
| Hero Section | IIMS Institutional | Cyber Precision | Navy hero, ICEHC tagline, terminal-styled accent text only |
| Event Cards | IIMS Institutional | — | Match iimscollege.edu.np card style exactly |
| Portal Sidebar | IIMS Institutional | — | White, navy active states, clean icons |
| Dashboard Stats | IIMS Institutional | — | White cards, navy numbers, crimson icons |
| CTF Challenge Cards | Cyber Precision | IIMS Institutional | Dark bg card, green/amber/red difficulty, monospace |
| Flag Submit Input | Cyber Precision | — | Dark terminal box, JetBrains Mono, green cursor blink |
| Code Blocks | Cyber Precision | — | `#1E1E2E` bg, `#CDD6F4` text |
| Post Feed | IIMS Institutional | — | White cards, clean typography |
| BOD Section | IIMS Institutional | — | Professional, committee-style layout |
| About Page | IIMS Institutional | — | Mission, objectives, member cards |
| Footer | IIMS Institutional | — | Navy, Taylor's logo, IIMS affiliation |

---

## 5. REFORMED COLOR SYSTEM

The base palette from CONTEXT.md is retained but extended with ICEHC-specific tokens:

### 5.1 Base IIMS Brand (Unchanged from CONTEXT.md)

```
IIMS Navy:        #1A237E  — Headers, nav, hero, sidebar accents, secondary buttons
IIMS Navy Dark:   #0D1757  — Hover on navy
IIMS Crimson:     #E53935  — Primary CTAs, active nav, badges, highlight
IIMS Crimson Dark:#C62828  — Hover on crimson
White:            #FFFFFF  — Primary card surface
Off-White:        #F8F9FA  — Page background
Light Grey:       #F5F5F5  — Input background, alternating rows
Border Light:     #E0E0E0  — Card borders, dividers
Text Primary:     #212121  — Body text
Text Secondary:   #424242  — Secondary text
Text Muted:       #757575  — Captions, timestamps
```

### 5.2 ICEHC Cyber Precision Tokens (New — Apply to CTF sections only)

```
Terminal BG:      #0D1117  — CTF challenge cards bg, flag input bg (darker than old #1E1E2E)
Terminal Surface: #161B22  — CTF card inner surface, code block bg
Terminal Border:  #30363D  — CTF card borders
Terminal Text:    #E6EDF3  — Primary text in terminal sections
Terminal Green:   #3FB950  — "Solved" badge, correct flag flash, easy difficulty
Terminal Amber:   #D29922  — Medium difficulty, warning states in terminal context
Terminal Red:     #F85149  — Hard/Insane difficulty, error states in terminal context
Terminal Blue:    #58A6FF  — Links, info, URLs in terminal context
Terminal Purple:  #BC8CFF  — Flag format highlight, special challenge badges
Cursor Green:     #00FF41  — The blinking cursor in FlagSubmitForm.tsx ONLY
```

> **Why new terminal tokens?** The old `#1E1E2E`/`#CDD6F4` is Catppuccin Mocha — beautiful but
> not authentic to the GitHub/VS Code dark theme that cybersecurity students actually live in.
> The new tokens are extracted from GitHub's dark theme (`#0D1117` = GitHub dark bg) — a platform
> every ICEHC member uses daily. This is an intentional, authentic choice.

### 5.3 Difficulty Colors (Use Everywhere a Difficulty Badge Appears)

```
Easy:   text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/20   — Terminal Green
Medium: text-[#D29922] bg-[#D29922]/10 border-[#D29922]/20   — Terminal Amber
Hard:   text-[#F85149] bg-[#F85149]/10 border-[#F85149]/20   — Terminal Red
Insane: text-[#F85149] bg-[#F85149]/15 border-[#F85149]/40 font-bold uppercase tracking-widest
```

### 5.4 Category Colors (CTF Challenge Categories)

```
web:        #58A6FF  — Blue
forensics:  #3FB950  — Green
crypto:     #BC8CFF  — Purple
pwn:        #F85149  — Red
reversing:  #D29922  — Amber
osint:      #79C0FF  — Light Blue
misc:       #8B949E  — Grey
```

---

## 6. REFORMED TYPOGRAPHY

### Font Stack

```typescript
// app/layout.tsx — load via next/font/google
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'

// Primary — all body text, UI labels, nav
const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700'] })

// ICEHC Wordmark / Hero Headlines ONLY — gives the name distinctive personality
// Also used for club tagline on hero
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-space-grotesk'
})

// Technical / Code / CTF — flag input, code blocks, challenge IDs, category badges
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains-mono'
})
```

### Usage Rules

| Context | Font | Weight | Notes |
|---|---|---|---|
| Page body text | Inter | 400 | Default for all paragraphs |
| UI labels, nav items | Inter | 500 | Buttons, tabs, sidebar items |
| Card titles, section headers | Inter | 600 | Clean and readable |
| Page H1 on public pages | Space Grotesk | 700 | Distinctive — ICEHC brand feel |
| "ICEHC" wordmark | Space Grotesk | 700 | Always — wherever the club name is displayed as a brand mark |
| Hero tagline | Space Grotesk | 600 | "Hack Ethically. Defend Relentlessly." |
| CTF challenge titles | Space Grotesk | 600 | Gives challenges a distinct feel |
| Code blocks | JetBrains Mono | 400 | Dark sections only |
| Flag submit input | JetBrains Mono | 500 | Terminal feel |
| Challenge IDs / category labels | JetBrains Mono | 400 | Small monospace badges |
| Point values on leaderboard | JetBrains Mono | 700 | Numbers feel precise |

> **Why Space Grotesk?** IIMS College's website uses a clean geometric sans for headlines.
> Space Grotesk has that same geometric, confident character but with a slight technical edge
> in its letterforms — perfectly bridging the IIMS professional world with cybersecurity precision.
> It is NOT a terminal font. It is used ONLY for brand moments, never for body text.

---

## 7. PUBLIC WEBSITE — PAGE-BY-PAGE REFORM

### 7.1 Homepage (`/`) — Full Reform

#### Navbar (Exact Structure)

```
[Top Utility Bar — slim, bg-[#0D1757], text-white/60, text-xs]
  Left:  📅 Upcoming Events  |  📰 ICEHC News  |  🎓 About IIMS College
  Right: ✉ icehc@iimscollege.edu.np  |  📍 Kathmandu, Nepal

[Main Nav — bg-[#1A237E], h-16, shadow-lg]
  Left:  [IIMS Logo → links to iimscollege.edu.np]
         [divider]
         [ICEHC wordmark in Space Grotesk]
         [subtext: "Cybersecurity & Ethical Hacking Club" in text-white/50 text-xs]
  Center: About | Events | CTF Program | Hackathon | Contact
  Right:  [Member Portal → bg-[#E53935] pill button]
```

#### Hero Section (Full Reform)

```
Layout: Full-viewport, bg-[#1A237E] to bg-[#0D1757] gradient
        Subtle diagonal pattern overlay (CSS, not image) — grid or hex pattern at 3% opacity white

LEFT SIDE (60% width):
  [Small label — JetBrains Mono, text-[#E53935], uppercase tracking-widest]
  "IIMS COLLEGE · KATHMANDU · EST. 2026"

  [H1 — Space Grotesk 700, text-white, text-5xl md:text-7xl, leading-tight]
  "Hack Ethically."
  "Defend Relentlessly."

  [Subheading — Inter 400, text-white/70, text-xl, mt-4, max-w-lg]
  "Official cybersecurity club of IIMS College. We bridge the gap between
   theoretical CS and real-world defense — one challenge at a time."

  [Two CTAs — mt-8 flex gap-4]
  [Join ICEHC → bg-[#E53935] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#C62828]]
  [Learn More → border border-white/30 text-white px-6 py-3 rounded-lg hover:bg-white/10]

  [Stats row — mt-12 flex gap-8]
  [9 Founding Members] [6 Monthly Events] [CTF Competitions] [BCS 2026]

RIGHT SIDE (40% width):
  [Terminal card — bg-[#0D1117] border border-[#30363D] rounded-xl p-6]
  [Header bar: 3 dots (red/yellow/green) + "icehc@iims:~$" in JetBrains Mono]
  [Animated terminal text — typewriter effect:]
    $ whoami
    > ICEHC Member
    $ cat objectives.txt
    > [1] Practical Skill Development
    > [2] Ethical Hacking Awareness
    > [3] Career Readiness
    > [4] Innovation & Research
    $ ./join_club.sh
    > Application portal open...
    > Status: ACCEPTING MEMBERS ✓
  [Blinking green cursor]
```

#### Club Vision Section (Below Hero)

```
bg-white, py-20

[Section label — text-[#E53935], Inter 600, uppercase tracking-wider, text-sm]
"OUR VISION"

[H2 — Space Grotesk 700, text-[#1A237E], text-4xl, max-w-3xl]
"To establish IIMS College as a premier hub for cybersecurity excellence in Nepal."

[Body — Inter 400, text-[#424242], text-lg, max-w-2xl, mt-4]
Full vision statement from the proposal (word-for-word, see Section 2.2 above)

[Divider — thin crimson line, w-16, h-1, bg-[#E53935], mt-8]
```

#### Four Objectives (Cards Below Vision)

```
bg-[#F8F9FA], py-20

Grid: 2x2 on desktop, 1 column on mobile

Each card:
  bg-white border border-[#E0E0E0] rounded-xl p-8 shadow-sm
  hover:shadow-md hover:border-[#1A237E]/20 transition-all

  [Icon — h-10 w-10, bg-[#1A237E]/10 rounded-lg, flex items-center justify-center]
  [Lucide icon: Wrench for Skill Dev | Shield for Ethical Hacking | Briefcase for Career | Microscope for Research]

  [Number — JetBrains Mono, text-[#E53935]/50, text-5xl, font-700, absolute top-right]
  "01" | "02" | "03" | "04"

  [Title — Space Grotesk 600, text-[#1A237E], text-xl, mt-4]
  Exact objective names from the proposal

  [Body — Inter 400, text-[#424242], mt-2, text-sm leading-relaxed]
  Exact objective descriptions from the proposal
```

#### Upcoming Events Section

```
bg-white, py-20

Header: "UPCOMING EVENTS" (label) + "Don't Miss What's Next" (H2)
[View All Events → text link with arrow, text-[#E53935]]

Event cards: Mirror iimscollege.edu.np event card style EXACTLY
  Image top (16:9, rounded-t-xl)
  Date badge overlaid: bottom-left of image, bg-[#E53935], text-white, font-semibold
    "27\nFEB" — day large, month small
  Card body: white bg, p-5
    Event type badge (CTF/Workshop/Seminar) — navy/crimson/green
    Title: Inter 600, text-[#212121]
    Short desc: text-[#757575], text-sm, line-clamp-2
    [RSVP Button → "Login to RSVP" if public, "RSVP Now" if logged in]

Show max 3 most recent published events. Fetch on server with revalidate: 3600.
```

#### Activities Plan Section ("What We Do")

```
bg-[#1A237E], py-20 (navy section)

[Label — text-[#E53935]/80, JetBrains Mono, text-sm]
"6-MONTH ACTIVITIES PLAN"

[H2 — Space Grotesk 700, text-white, text-4xl]
"From Zero to Defender —
 A Structured Path."

Timeline: Horizontal scroll on mobile, grid on desktop
  6 cards — one per month of the activities plan
  Each card:
    bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-sm
    Month badge: JetBrains Mono, text-[#E53935], text-sm "Month 01"
    Title: Inter 600, text-white, text-lg
    Description: Inter 400, text-white/60, text-sm
    Event type icon: small lucide icon
```

#### IIMS College Affiliation Strip

```
bg-white, border-t border-b border-[#E0E0E0], py-12

Center-aligned:

[IIMS Logo] [divider] [Taylor's University logo]

Text: Inter 400, text-[#757575], text-sm, text-center, mt-6
"ICEHC is an official student club of IIMS College, operating in academic
 collaboration with Taylor's University, Malaysia."

[Link: "Visit IIMS College ↗" → https://iimscollege.edu.np/ | text-[#1A237E] font-medium]
```

#### Founding Committee Section

```
bg-[#F8F9FA], py-20

[Label] "FOUNDING COMMITTEE"
[H2] "The Nine Who Started It"

Grid: 3 columns desktop, 2 tablet, 1 mobile

Each member card (use real data from Section 2.6):
  bg-white border border-[#E0E0E0] rounded-xl p-6 text-center shadow-sm
  Avatar: circular, h-20 w-20, mx-auto — initials fallback in IIMS Navy
  Name: Inter 600, text-[#212121], mt-3
  Position: text-[#E53935], Inter 500, text-sm — exact club_post
  Program: text-[#757575], text-xs — "BCS 2026 Jan Intake"
  [GitHub icon if github_url set]

Show all 9 founding members with their real names and positions.
Sujal Mainali → President (distinct card, slightly larger/featured)
```

#### Join CTA Section (Above Footer)

```
bg-[#1A237E] → bg-[#0D1757] gradient, py-20

[H2 — Space Grotesk 700, text-white, text-4xl, text-center]
"Ready to Defend the Digital World?"

[Subtext — Inter 400, text-white/70, text-center, max-w-lg mx-auto, mt-4]
"Join ICEHC — open to all IIMS College students across all programs.
 Applications reviewed by the Board of Directors."

[CTA — bg-[#E53935] text-white px-8 py-4 rounded-lg font-semibold text-lg mx-auto block w-fit]
"Apply for Membership →"

[Under CTA — text-white/40, text-xs, mt-3]
"BCS · BBUS · BIHM · MBA — All programs welcome"
```

### 7.2 About Page (`/about`) — Full Reform

```
SECTIONS (in order):

1. Page Hero — navy, short
   Title: "About ICEHC"
   Subtitle: "IIMS Cybersecurity & Ethical Hacking Club — Founded 2026"

2. Vision & Mission
   Use official vision text from proposal (Section 2.2)
   Left: Text. Right: decorative terminal card showing mission keywords

3. Objectives — 4-card grid
   Verbatim from proposal (Section 2.3)

4. Sustainability Plan
   3 cards: Mentorship Pipeline | Club Wiki | Faculty Integration
   Use exact text from proposal (Section 2.4)

5. Activities Timeline
   All 6 months with full descriptions from the proposal

6. Committee Section
   Full team grid — all 9 members with real names, positions, programs
   President gets featured card at the top

7. IIMS Affiliation
   Link to https://iimscollege.edu.np/it-club/
   Link to https://iimscollege.edu.np/capture-the-flag/
   Taylor's University partner logo

8. Contact CTA
   icehc@iimscollege.edu.np
   Link to /contact
```

### 7.3 Events Page (`/events`) — Reform

```
Mirror iimscollege.edu.np/events/ structure:
- Filter tabs: All | Workshop | CTF | Seminar | Hackathon | Competition
- Grid: 3 columns (same card style as homepage events)
- Upcoming first, then Past Events section
- Each card matches the IIMS website event card format exactly
- Seed with the 6 activities plan events as initial data
```

### 7.4 Contact Page (`/contact`) — Reform

```
LEFT (60%): Contact form
  Rate-limited, Zod-validated
  Fields: Name | Email | Subject | Message
  Submit → bg-[#E53935] "Send Message"

RIGHT (40%): Club info card
  Club: IIMS Cybersecurity & Ethical Hacking Club (ICEHC)
  Email: icehc@iimscollege.edu.np
  Location: IIMS College, Kathmandu, Nepal
  [Link to iimscollege.edu.np]
  [IIMS Logo]
  "Applications reviewed by the Board of Directors within 2-3 working days."
```

---

## 8. PORTAL — SHELL REFORM (SIDEBAR + TOPBAR)

### 8.1 Sidebar Reform

```tsx
// Full sidebar spec — white, ICEHC branded

HEADER (top of sidebar):
  bg-[#1A237E], p-4
  [Row: IIMS logo (small, white) + divider + "ICEHC" in Space Grotesk text-white]
  [Below: "Cybersecurity & Ethical Hacking Club" — text-white/50 text-xs]
  [Below: Member's name + role badge]

NAVIGATION SECTIONS:

[Section label: "MAIN" — text-[#9E9E9E] text-xs uppercase tracking-widest px-4 mb-1]

  Dashboard          Shield icon
  Feed               Newspaper icon
  Events             Calendar icon
  Documents          FileText icon
  Members            Users icon
  Leaderboard        Trophy icon
  Messages           MessageSquare icon + unread badge
  Notifications      Bell icon + unread badge

[Section label: "CTF" — text-[#9E9E9E] text-xs uppercase tracking-widest px-4 mb-1 mt-6]

  Challenges         Terminal icon (JetBrains Mono for CTF label in sidebar)
  My Solves          CheckSquare icon

[Section label: "BOD" — ONLY visible for role='bod' + role='admin']

  Pending Approvals  UserCheck icon + pending count badge
  Event Management   CalendarPlus icon
  Announcements      Megaphone icon
  Member Directory   UsersIcon icon
  Analytics          BarChart2 icon
  Meeting Minutes    FileText icon
  Contact Inbox      Mail icon

[Section label: "ADMIN" — ONLY visible for role='admin']

  System Settings    Settings icon
  CTF Management     Terminal icon
  Audit Logs         ClipboardList icon

BOTTOM:
  [My Profile link]
  [IIMS College link → iimscollege.edu.np (new tab)]
  [Sign Out button]
```

Active state:
```
text-[#E53935] bg-[#E53935]/8 border-l-2 border-[#E53935] font-medium
```

### 8.2 Topbar Reform

```tsx
LEFT:   Page title (Inter 600, text-[#212121]) + breadcrumb (text-[#757575])

CENTER: Search bar
  bg-[#F5F5F5] border border-[#E0E0E0] rounded-lg px-4 py-2
  placeholder: "Search challenges, events, members..."
  [Ctrl+K shortcut label]

RIGHT:
  [Points chip — JetBrains Mono, text-[#1A237E] font-bold, small badge]
  e.g.: "⚡ 450 pts"

  [Notifications bell — Bell icon, badge with unread count in bg-[#E53935]]

  [Avatar — circular, h-9 w-9, initials fallback in IIMS Navy]
  [Name — Inter 500, text-[#212121], hidden on mobile]
  [Role badge — 'President' or 'Vice President' etc. — text-[#757575] text-xs]
```

---

## 9. PORTAL — DASHBOARD REFORM

### Dashboard Layout (Desktop: 3-column grid)

```
ROW 1 — Welcome Banner (full width)
  bg-[#1A237E] → bg-[#0D1757] gradient, rounded-2xl, p-6
  Left: "Welcome back, [first name] 👋" — Space Grotesk 700, text-white, text-2xl
        "[Program] · [Intake] · [club_post]" — Inter 400, text-white/60, text-sm
  Right: Points chip + Rank chip (JetBrains Mono, white)
         "⚡ 450 pts  |  #3 on Leaderboard"

ROW 2 — 4 Stat Cards (equal width grid)
  Card 1: Total Members   — People icon, crimson
  Card 2: Active CTF      — Terminal icon, navy
  Card 3: Your Rank       — Trophy icon, gold #F9A825
  Card 4: CTF Solved      — CheckCircle icon, green
  Each: bg-white, border, rounded-xl, p-5
  Number: JetBrains Mono 700, text-[#1A237E], text-3xl
  Label: Inter 400, text-[#757575], text-sm
  Icon: bg-[color]/10, h-10 w-10, rounded-lg

ROW 3 — Split Layout
  LEFT (2/3): Announcements feed — latest 3 pinned posts
              Each: left crimson border, white card, content preview
  RIGHT (1/3): Upcoming events — next 2 with RSVP button

ROW 4 — CTF Progress Bar
  Full width, bg-white, border, rounded-xl, p-6
  "Your CTF Progress" — Inter 600
  Progress bar: bg-[#E0E0E0] track, bg-[#3FB950] fill, rounded-full
  "[N] of [Total] challenges solved — [N] points from CTF"
  Top 3 unsolved challenges shown as small cards below

ROW 5 — Recent Notifications
  Last 3 unread, each with type icon + title + "X mins ago"
  [View All Notifications →]
```

---

## 10. PORTAL — CTF SECTION REFORM

### 10.1 CTF Challenges Page (`/portal/ctf`)

This page transitions into Cyber Precision world. Apply Terminal tokens here.

```
PAGE BACKGROUND: bg-[#0D1117] (NOT the usual off-white)
This is intentional. The CTF section is the ONE place the full dark aesthetic is used.
It signals to members: "You are now in the lab."

HEADER:
  py-8 px-6
  [Label — JetBrains Mono, text-[#3FB950], text-sm] "CAPTURE THE FLAG"
  [H1 — Space Grotesk 700, text-white, text-4xl] "Challenge Lab"
  [Stats row — JetBrains Mono, text-[#8B949E], text-sm]
    "[N] Active  ·  [N] Solved  ·  [Your Points] pts  ·  Rank #[N]"

FILTERS (sticky, bg-[#161B22] border-b border-[#30363D]):
  Category: All | Web | Forensics | Crypto | Pwn | Reversing | OSINT | Misc
  Difficulty: All | Easy | Medium | Hard | Insane
  Status: All | Unsolved | Solved
  Sort: By Points ↑ | By Difficulty | By Solves

CHALLENGE GRID (3 cols desktop, 2 tablet, 1 mobile):

Challenge Card (unsolved):
  bg-[#161B22] border border-[#30363D] rounded-xl p-5
  hover: border-[#58A6FF]/40 shadow-[0_0_20px_rgba(88,166,255,0.05)] transition-all

  [Top row: Category badge (JetBrains Mono, category color) + Difficulty badge]
  [Title: Space Grotesk 600, text-white, text-lg, mt-3]
  [Desc preview: Inter 400, text-[#8B949E], text-sm, line-clamp-2, mt-2]
  [Bottom row: Points chip + Solves count + Created date]
    Points: JetBrains Mono 700, text-[#D29922], "[N] pts"
    Solves: text-[#8B949E], text-xs, "[N] solves"
  [Solve button: bg-[#E53935] text-white full-width mt-4 rounded-lg]
    "Attempt Challenge →"

Challenge Card (solved):
  bg-[#161B22] border border-[#3FB950]/30 rounded-xl p-5
  [Green "✓ SOLVED" badge top-right — bg-[#3FB950]/10 text-[#3FB950] border border-[#3FB950]/30]
  [Title: text-[#8B949E] — muted, already conquered]
  [Points badge: text-[#3FB950]] "✓ [N] pts earned"
```

### 10.2 CTF Challenge Detail Page (`/portal/ctf/[challengeId]`)

```
LAYOUT: Single column, max-w-3xl mx-auto, still on dark bg-[#0D1117]

HEADER CARD:
  bg-[#161B22] border border-[#30363D] rounded-xl p-8
  [Breadcrumb: "CTF Lab / [Category]" — JetBrains Mono, text-[#58A6FF]]
  [Title: Space Grotesk 700, text-white, text-3xl, mt-2]
  [Row: Difficulty badge | Category badge | Points chip | Solves count]
  [Divider: border-[#30363D]]
  [Description: rendered Markdown — text-[#E6EDF3], Inter 400]
    (Code blocks within description: bg-[#0D1117] border border-[#30363D])
  [File download if present: text-[#58A6FF] with Download icon]
  [Hint (collapsed by default): "Show Hint" button → reveals text-[#D29922] hint text]

FLAG SUBMIT FORM (FlagSubmitForm.tsx — reformed):
  bg-[#0D1117] border border-[#30363D] rounded-xl p-6 mt-6

  [Label: JetBrains Mono, text-[#8B949E], text-xs uppercase mb-2]
  "SUBMIT YOUR FLAG"

  [Flag format hint: JetBrains Mono, text-[#BC8CFF], text-sm mb-3]
  "Flag format: ICEHC{...}"

  [Input wrapper: bg-[#161B22] border border-[#30363D] rounded-lg p-4 flex items-center gap-3]
    [Prefix: JetBrains Mono 500, text-[#BC8CFF]] "ICEHC{"
    [Input: JetBrains Mono 500, text-[#00FF41], bg-transparent, flex-1, outline-none]
      placeholder="your_flag_here"
      [Blinking cursor animation CSS]
    [Suffix: JetBrains Mono 500, text-[#BC8CFF]] "}"

  [Submit button: bg-[#E53935] full-width mt-4 rounded-lg]
  "Submit Flag →"

  [Result states:]
    Correct: bg-[#3FB950]/10 border border-[#3FB950]/30 text-[#3FB950] p-3 rounded-lg
      "✓ Correct! You earned [N] points. Rank updated."
    Wrong: bg-[#F85149]/10 border border-[#F85149]/30 text-[#F85149] p-3 rounded-lg
      "✗ Incorrect flag. [N] attempts remaining this minute."
    Already Solved: bg-[#3FB950]/10 text-[#3FB950]
      "✓ Already solved! You earned [N] points on [date]."
```

### 10.3 Leaderboard Page (`/portal/leaderboard`)

```
STAYS ON DARK THEME: bg-[#0D1117] (consistent with CTF section)

TOP 3 PODIUM:
  #1: Gold  #F9A825 — Large card, centered
  #2: Silver #90A4AE — Left of #1
  #3: Bronze #A1887F — Right of #1
  Each: Avatar + Name + Points (JetBrains Mono 700) + Solves

TABLE (positions 4+):
  bg-[#161B22] border border-[#30363D] rounded-xl overflow-hidden
  Headers: Rank | Member | Program | CTF Solved | Points
  Your row highlighted: border-l-4 border-l-[#E53935] bg-[#E53935]/5
  Points column: JetBrains Mono 700, text-[#D29922]
  Rank numbers: JetBrains Mono, text-[#8B949E]
```

---

## 11. PORTAL — FEED REFORM

```
BACK TO LIGHT THEME: bg-[#F8F9FA]

COMPOSER (PostComposer.tsx):
  bg-white border border-[#E0E0E0] rounded-xl p-5 mb-6
  [Avatar + "What's on your mind, [first name]?"]
  [Type selector: Post | Resource | Project (Announcement for BOD+)]
  [Markdown editor with Preview tab]
  [Post button: bg-[#E53935]]

POST TYPE VISUAL TREATMENT:
  announcement: left border bg-[#E53935], top badge "📢 ANNOUNCEMENT"
  resource:     left border bg-[#1A237E], top badge "📚 RESOURCE"
  project:      left border bg-[#2E7D32], top badge "🔨 PROJECT"
  post:         no accent border, no badge

POST CARD:
  bg-white border border-[#E0E0E0] rounded-xl p-6 shadow-sm
  Author row: Avatar + Name + club_post badge + "X mins ago"
  Content: MarkdownRenderer (Inter 400, text-[#212121])
  Reactions: ♥ [N] + 💬 [N] Comments
  Reaction button: toggle — filled crimson if reacted, ghost if not
```

---

## 12. PORTAL — EVENTS REFORM

```
LIGHT THEME: bg-[#F8F9FA]

Filter tabs: All | Workshop | CTF | Seminar | Hackathon | Competition

EVENT CARD (portal version):
  Same as public website event card PLUS:
  RSVP status indicator (going/maybe/not going)
  Meeting link revealed only after RSVP 'going'
  Attendee count: "[N] going · [N] maybe"

EVENT DETAIL:
  Cover image (full width, rounded-xl, max-h-64 object-cover)
  Title: Space Grotesk 700, text-[#1A237E], text-3xl
  Meta row: Date | Location | Type badge | Organizer
  Description: MarkdownRenderer
  RSVP section: 3 buttons (Going / Maybe / Not Going) — selected state highlighted
  Attendees list: avatar stack + "[N] members going"
  Meeting link (if going + link present): shown after RSVP
```

---

## 13. PORTAL — BOD SECTION REFORM

```
LIGHT THEME: bg-[#F8F9FA]

BOD SECTION HEADER (top of each BOD page):
  bg-[#1A237E] text-white rounded-xl p-6 mb-6
  [Small label: "BOARD OF DIRECTORS · RESTRICTED ACCESS"]
  [Page title in Space Grotesk]

PENDING APPROVALS PAGE:
  Priority queue layout — most recent pending first
  Each pending member card:
    bg-white border border-[#F57F17]/30 rounded-xl p-5
    [Left: Avatar + Name + student_id + program + intake + skills]
    [Right: Approve (green) | Reject (red with reason modal) buttons]
    Submitted X days ago — text-[#F57F17] if > 3 days old
  Empty state: "🎉 No pending applications" + green checkmark

ANALYTICS PAGE:
  Stat cards in 2x2 grid (same style as dashboard)
  Charts: use Recharts — match IIMS navy/crimson color scheme
  All charts use Inter font (configured via Recharts customization)
```

---

## 14. PORTAL — ADMIN PANEL REFORM

```
Admin panel sits inside the same portal shell.
No additional visual treatment beyond the BOD reforms.

CTF MANAGEMENT TAB (Admin Only):
  Switch from light theme to hybrid — table is light, but challenge form uses terminal tokens
  Challenge form has a "Raw Flag" input:
    bg-[#0D1117] border border-[#30363D] text-[#3FB950] JetBrains Mono
    placeholder="ICEHC{your_flag_here}"
  On save: flag hashed, input cleared, "Flag secured ✓" shown in green

BOD MANAGEMENT TAB (Admin Only):
  Table of all BOD members with their exact positions
  "Assign BOD Role" modal:
    Member select + Position dropdown (all positions from the proposal)
    Clear warning: "This gives elevated portal access"
```

---

## 15. FOUNDING MEMBERS — REAL DATA TO SEED

### Seed SQL (Run After Registration)

```sql
-- After all 9 founding members complete registration via magic link,
-- run this to set their roles and positions correctly.
-- Note: Radha Rawat's "IT Head" → stored as 'Technical Lead' in DB

UPDATE members SET
  role = 'admin',
  club_post = 'President',
  status = 'approved',
  approved_at = now()
WHERE student_id = 'IIMS-2082-0490';  -- Sujal Mainali

UPDATE members SET role = 'bod', club_post = 'Vice President', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0420';  -- Deepika Kumari Yadav

UPDATE members SET role = 'bod', club_post = 'Secretary', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0279';  -- Raskin Shrestha

UPDATE members SET role = 'bod', club_post = 'Joint Secretary', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0358';  -- Barsha Shrestha

UPDATE members SET role = 'bod', club_post = 'Treasurer', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0429';  -- Namika Prajapati

UPDATE members SET role = 'bod', club_post = 'Event & Activities Coordinator', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0388';  -- Sabina Neupane

UPDATE members SET role = 'bod', club_post = 'Marketing & Communication Lead', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0339';  -- Samrachana Lama

UPDATE members SET role = 'bod', club_post = 'Technical Lead', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0357';  -- Radha Rawat (proposal: IT Head → stored as Technical Lead)

UPDATE members SET role = 'bod', club_post = 'Executive Head', status = 'approved', approved_at = now()
WHERE student_id = 'IIMS-2082-0386';  -- Karuna Bishkarma
```

### Seed Initial Events (6-Month Activities Plan)

```typescript
// Seed via Supabase admin client — paste into a seed script

const events = [
  {
    title: 'Introduction to the Red Team',
    slug: 'intro-red-team-2026',
    description: `## Workshop: Introduction to the Red Team

A kickoff workshop where members install Virtual Machines (Kali Linux) and learn the fundamental ethics of hacking. Topics include:
- Setting up your ethical hacking lab
- Understanding White Hat vs Black Hat
- First look at tools: Kali Linux, basic terminal navigation
- The legal and ethical framework for penetration testing`,
    short_desc: 'Kickoff workshop: install Kali Linux and learn the ethics and mindset of ethical hacking.',
    type: 'workshop',
    is_published: true,
    location: 'IIMS College Computer Lab, Kathmandu',
  },
  {
    title: '"Scan the Scammers" Awareness Seminar',
    slug: 'scan-the-scammers-2026',
    description: `## Seminar: Scan the Scammers

An awareness session dissecting common financial frauds and educational scams targeting Nepali students. Learn to identify, report, and protect yourself and others. Topics:
- Common financial fraud patterns in Nepal
- Phishing detection and defence
- How to report cybercrime in Nepal
- Live demo: identifying scam emails`,
    short_desc: 'Dissecting financial fraud and phishing scams — how to identify and report them.',
    type: 'seminar',
    is_published: true,
    location: 'IIMS College Auditorium, Kathmandu',
  },
  {
    title: 'ICEHC Internal CTF — Beginner Edition',
    slug: 'internal-ctf-2026',
    description: `## Internal CTF Competition

Our first internal Capture The Flag competition — designed for beginners. Solve security puzzles across categories including decryption, web exploitation, and basic forensics. All skill levels welcome.

**Flag Format:** ICEHC{...}
**Scoring:** Individual points, live leaderboard`,
    short_desc: 'Beginner-level internal CTF: decryption, web exploitation, and forensics challenges.',
    type: 'ctf',
    is_published: true,
    location: 'IIMS College Computer Lab, Kathmandu',
  },
  {
    title: 'Guest Lecture Series — Cybersecurity in Nepal',
    slug: 'guest-lecture-cybersecurity-nepal',
    description: `## Guest Lecture: Cybersecurity Careers in Nepal

Inviting a cybersecurity professional from the industry to discuss:
- The current cybersecurity job market in Nepal
- Real-world threat landscape facing Nepali organizations
- Career paths: SOC Analyst, Penetration Tester, CISO
- Certifications that matter: CEH, CompTIA Security+, OSCP`,
    short_desc: 'Industry expert on the Nepali cybersecurity job market and threat landscape.',
    type: 'seminar',
    is_published: true,
    location: 'IIMS College, Kathmandu',
  },
  {
    title: 'Secure Coding Bootcamp',
    slug: 'secure-coding-bootcamp-2026',
    description: `## Secure Coding Bootcamp

In collaboration with the IIMS Coding community. Learn to identify and patch real vulnerabilities in code:
- SQL Injection: identification and prevention
- Cross-Site Scripting (XSS): how it works, how to fix it
- Authentication flaws
- Hands-on: patch a vulnerable web application`,
    short_desc: 'Hands-on: patch SQL Injection and XSS vulnerabilities in real code.',
    type: 'workshop',
    is_published: true,
    location: 'IIMS College Computer Lab, Kathmandu',
  },
  {
    title: 'Hackathon / Cyber Day 2026',
    slug: 'cyber-day-hackathon-2026',
    description: `## Hackathon / Cyber Day — ICEHC Inaugural Event

Our flagship college-wide event showcasing cybersecurity projects and tools, culminating in a Red vs. Blue team simulation. Categories:
- **Red Team**: Offensive security challenges
- **Blue Team**: Defend the infrastructure
- **Project Showcase**: Members present security tools and research
- **Guest Judges**: Industry professionals evaluating submissions`,
    short_desc: 'College-wide event: Red vs. Blue simulation, project showcase, and hackathon.',
    type: 'hackathon',
    is_published: true,
    location: 'IIMS College, Kathmandu',
  },
]
```

---

## 16. COPYWRITING & VOICE GUIDE

### The ICEHC Voice

The ICEHC portal should sound like it was written by the founding members themselves:
confident, technically precise, genuinely passionate about cybersecurity, and proud of their
IIMS College identity. It does NOT sound like:
- Corporate marketing (avoid buzzwords like "leverage", "synergize", "ecosystem")
- Dark web edginess (no "we hack everything" energy — ICEHC is explicitly ethical)
- Generic student club vagueness (be specific: "Kali Linux", "CEH", "Nepal threat landscape")

### Phrase Bank — Use These

| Context | Phrase |
|---|---|
| Hero tagline | "Hack Ethically. Defend Relentlessly." |
| Secondary tagline | "Bridging theoretical CS and real-world defence." |
| CTA primary | "Join ICEHC →" |
| CTA secondary | "Explore Challenges →" |
| Pending state | "Your application is with the Board of Directors." |
| Approval state | "Welcome to ICEHC. Let's secure the future." |
| CTF empty | "No challenges yet. The lab is being prepared." |
| Leaderboard empty | "Be the first to claim the top flag." |
| About page opening | "ICEHC was founded in 2026 by 9 BCS students at IIMS College with one shared conviction: cybersecurity education in Nepal needs to go beyond the textbook." |
| Footer affiliation | "ICEHC is an official student club of IIMS College, Kathmandu — operating in academic collaboration with Taylor's University, Malaysia." |

### Tone for Each Section

| Section | Tone |
|---|---|
| Public website hero | Ambitious, institutional, proud |
| About page | Formal but warm, mission-driven |
| Events | Practical, informative, inviting |
| CTF challenges | Technical, precise, challenging |
| Dashboard welcome | Personal, encouraging |
| BOD section | Professional, administrative |
| Error messages | Direct, not alarming |
| Success states | Specific — include the points earned, not just "Success!" |

---

## 17. COMPONENT REFORM SPECIFICATIONS

### 17.1 `Avatar.tsx` — IIMS-branded Fallback

```tsx
// When no avatar_url — show initials in IIMS Navy
// Color logic: use club_post to vary the bg slightly

const POSITION_COLORS: Record<string, string> = {
  'President':    'bg-[#1A237E] text-white',       // Deep Navy
  'Vice President': 'bg-[#283593] text-white',
  'Secretary':    'bg-[#303F9F] text-white',
  'Treasurer':    'bg-[#3949AB] text-white',
  'Executive Head': 'bg-[#1565C0] text-white',
  'General Member': 'bg-[#455A64] text-white',     // Blue-grey for regular members
  // ... etc
}
```

### 17.2 `Badge.tsx` — Club Position Badges

For BOD positions, show with a small shield icon:

```tsx
// President / Vice President → crimson badge with shield
// Other BOD → navy badge
// General Member → grey badge, no icon
// admin → deep navy with crown icon (subtle)
```

### 17.3 `CTFChallengeCard.tsx` — Full Reform

```tsx
// Category gets a specific color AND a specific icon:
const CATEGORY_META = {
  web:       { color: '#58A6FF', icon: Globe,      label: 'Web' },
  forensics: { color: '#3FB950', icon: Search,     label: 'Forensics' },
  crypto:    { color: '#BC8CFF', icon: Lock,       label: 'Crypto' },
  pwn:       { color: '#F85149', icon: Terminal,   label: 'Pwn' },
  reversing: { color: '#D29922', icon: RotateCcw,  label: 'Reversing' },
  osint:     { color: '#79C0FF', icon: Eye,        label: 'OSINT' },
  misc:      { color: '#8B949E', icon: Package,    label: 'Misc' },
}
```

### 17.4 `FlagSubmitForm.tsx` — Animated Cursor

```css
/* globals.css — add blinking cursor animation */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor-blink::after {
  content: '▋';
  color: #00FF41;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
}
```

### 17.5 `HeroSection.tsx` — Terminal Card Animation

```tsx
// Terminal card on homepage right side
// Use typewriter effect with useEffect + setInterval
// Lines appear one by one with realistic typing delay
// Cursor blinks between lines
// Loop every 12 seconds

const TERMINAL_LINES = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'ICEHC Member — IIMS College' },
  { type: 'command', text: 'cat vision.txt' },
  { type: 'output', text: 'Premier cybersecurity hub in Nepal' },
  { type: 'command', text: 'ls objectives/' },
  { type: 'output', text: '01_skill_dev.md  02_ethics.md' },
  { type: 'output', text: '03_career.md     04_research.md' },
  { type: 'command', text: './apply.sh' },
  { type: 'success', text: '✓ Applications open — Join ICEHC' },
]
```

---

## 18. IIMS WEBSITE NAVIGATION TO MIRROR

The IIMS site places clubs under "Community & Clubs" and CTF/Hackathon under "Learning In Action."
ICEHC is listed at: https://iimscollege.edu.np/it-club/

The ICEHC public site footer should link back into the IIMS navigation:

```
FOOTER LINKS SECTION:
  "IIMS College"
    → About IIMS: https://iimscollege.edu.np/about/
    → IT Club: https://iimscollege.edu.np/it-club/
    → CTF Program: https://iimscollege.edu.np/capture-the-flag/
    → Hackathon: https://iimscollege.edu.np/iims-hackathon/
    → BCS Program: https://iimscollege.edu.np/program/bachelor-of-computer-science-hons/
    → Taylor's University: https://iimscollege.edu.np/taylor-university/

  "ICEHC Portal"
    → Member Login: /portal/login
    → About ICEHC: /about
    → Events: /events
    → Contact: /contact
```

---

## 19. WHAT MUST CHANGE VS WHAT MUST STAY

### Changes from Previous UI Prompts

| Old Decision | New Decision | Reason |
|---|---|---|
| Generic hero text | Official vision from proposal (word-for-word) | Authenticity |
| Placeholder team section | Real 9 founding members with exact positions | Real data |
| Generic objectives | Exact 4 objectives from proposal | Official document |
| Generic events | 6-month activities plan seeded as events | Realistic content |
| CTF page on light bg | CTF page on dark bg (`#0D1117`) | Cyber section = deliberate dark |
| Leaderboard on light bg | Leaderboard on dark bg (same CTF section) | Consistency |
| Old Terminal BG `#1E1E2E` | New GitHub-dark `#0D1117` | Authentic to GitHub users |
| Old terminal text `#CDD6F4` | New `#E6EDF3` | Matches GitHub dark scheme |
| JetBrains Mono for hero text | Space Grotesk for hero, JetBrains for technical only | Better brand hierarchy |
| Generic nav | Two-tier nav matching iimscollege.edu.np structure | IIMS mirror |
| Sidebar: no section structure | Sidebar with labeled sections (MAIN / CTF / BOD / ADMIN) | Clarity |
| Generic card shadow | Flat cards matching IIMS website card style | IIMS consistency |
| No terminal animation | Homepage hero has animated terminal card | Engagement |
| Flag input shows "IIMS{" | Flag input shows "ICEHC{" | Correct club name |
| Flag format: "IIMS{...}" | Flag format: "ICEHC{...}" | Correct |

### What Stays Unchanged

| Decision | Why Kept |
|---|---|
| All security architecture (flag hashing, RLS, triggers, rate limiting) | Non-negotiable |
| Three-role system (member / BOD / admin) | Core to ICEHC governance |
| Zod validation everywhere | Non-negotiable |
| `user_id` not `id` in auth checks | Non-negotiable |
| `import 'server-only'` in server libs | Non-negotiable |
| IIMS Navy `#1A237E` as primary brand color | Correct IIMS color |
| IIMS Crimson `#E53935` as primary CTA | Correct IIMS color |
| White card surfaces for non-CTF sections | IIMS website match |
| Inter as primary UI font | Correct choice |
| Lucide React icons only | Consistency |
| No `window.alert()` / `window.confirm()` | UX standard |
| `<Image />` from Next.js | Performance |

---

## 20. REFORM IMPLEMENTATION ORDER

Execute in this order. Do not skip steps or reorder them.

### Step 1 — Tokens & Fonts (1 hour)
- [ ] Add Space Grotesk to `next/font/google` in `app/layout.tsx`
- [ ] Add terminal color tokens to `globals.css` as CSS variables
- [ ] Add cursor-blink animation to `globals.css`
- [ ] Update Tailwind config with new terminal token arbitrary values

### Step 2 — Core Data (1 hour)
- [ ] Run founding members seed SQL (Section 15)
- [ ] Run initial events seed with 6-month activities plan (Section 15)
- [ ] Update `site_settings` with correct ICEHC values

### Step 3 — Public Website (4 hours)
- [ ] `Navbar.tsx` — two-tier nav, IIMS + ICEHC co-branding
- [ ] `HeroSection.tsx` — full reform with terminal card + Space Grotesk tagline
- [ ] `HomepageObjectives.tsx` — 4 cards from proposal objectives
- [ ] `HomepageActivities.tsx` — 6-month timeline
- [ ] `IIMSAffiliationStrip.tsx` — IIMS + Taylor's University
- [ ] `FoundingCommitteeSection.tsx` — all 9 members with real data
- [ ] `Footer.tsx` — IIMS nav links + affiliation text
- [ ] `/about` — full page with vision, objectives, sustainability, team
- [ ] `/events` — IIMS-styled event cards
- [ ] `/contact` — reformed with club info sidebar

### Step 4 — Portal Shell (2 hours)
- [ ] `Sidebar.tsx` — labeled sections, BOD/Admin sections, navy header
- [ ] `Topbar.tsx` — points chip, Space Grotesk, JetBrains Mono for numbers
- [ ] Portal layout auth gate

### Step 5 — Dashboard (1 hour)
- [ ] Reformed dashboard with navy welcome banner
- [ ] Stat cards with JetBrains Mono numbers
- [ ] CTF progress bar

### Step 6 — CTF Section (2 hours)
- [ ] Switch CTF page to `bg-[#0D1117]` dark theme
- [ ] `CTFChallengeCard.tsx` — terminal dark card with category colors
- [ ] `FlagSubmitForm.tsx` — `ICEHC{` prefix, blinking cursor, terminal input
- [ ] Challenge detail page — dark theme with hybrid light/dark content
- [ ] Leaderboard — dark theme, podium top 3

### Step 7 — Feed, Events, Messaging (2 hours)
- [ ] Post feed with type visual treatments
- [ ] Event cards (portal) with RSVP states
- [ ] Message bubbles (unchanged from spec)

### Step 8 — BOD + Admin Panel (2 hours)
- [ ] BOD section header (navy, professional)
- [ ] Pending approvals layout
- [ ] Admin CTF tab with dark flag input

### Step 9 — Review Pass
- [ ] Verify every page matches the IIMS website's visual weight
- [ ] Confirm `ICEHC{` (not `IIMS{`) everywhere
- [ ] Confirm Space Grotesk only used in brand moments
- [ ] Confirm JetBrains Mono only in technical contexts
- [ ] Confirm dark theme ONLY on CTF + Leaderboard pages
- [ ] Confirm all founding member real names display correctly
- [ ] Confirm vision + objectives match proposal word-for-word

---

*UI REFORM PROMPT v1.0 — ICEHC Portal.*
*Grounded in: (1) ICEHC Club Proposal PDF — founding members, vision, objectives, activities plan.*
*(2) Live IIMS College website https://iimscollege.edu.np/ — Feb 2026.*
*Feed after CONTEXT.md + AGENT_PROMPT.md + BACKEND_LOGIC_PROMPT.md.*
*This prompt governs ALL visual decisions. Where it conflicts with previous prompts, this wins.*