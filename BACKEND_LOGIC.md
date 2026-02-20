# BACKEND LOGIC PROMPT — ICEHC Portal
## IIMS Cybersecurity & Ethical Hacking Club (ICEHC)
## IIMS College, Kathmandu, Nepal — https://iimscollege.edu.np/
> Feed this file AFTER `CONTEXT.md` and `AGENT_PROMPT.md`.
> This is the single source of truth for ALL backend business logic, permission rules,
> data flows, API contracts, and SQL for the three-role system.
> Where this file conflicts with CONTEXT.md — THIS FILE WINS.

---

## CRITICAL CORRECTIONS TO CONTEXT.md

| Field | CONTEXT.md (old) | THIS FILE (correct) |
|---|---|---|
| Club Full Name | IIMS IT Club | IIMS Cybersecurity & Ethical Hacking Club |
| Club Short Name | — | ICEHC |
| Club Email | itclub@iimscollege.edu.np | icehc@iimscollege.edu.np |
| Resend from | itclub@ | icehc@iimscollege.edu.np |
| DB role values | `member`, `admin`, `superadmin` | `member`, `bod`, `admin` |
| `club_post` values | generic tech roles | Full ICEHC BOD position list (Section 2) |
| Site settings `site_title` | IIMS IT Club | ICEHC — IIMS Cybersecurity & Ethical Hacking Club |
| Site settings `hero_tagline` | Code. Build. Innovate. | Hack Ethically. Defend Relentlessly. |
| Site settings `hero_subtext` | Official IT Club... | Official Cybersecurity Club of IIMS College, Kathmandu. |

---

## TABLE OF CONTENTS

1. [Role System — Three Tiers](#1-role-system)
2. [Registration & Onboarding](#2-registration--onboarding)
3. [Complete Auth Flow](#3-complete-auth-flow)
4. [Member Backend Logic](#4-member-backend-logic)
5. [BOD Backend Logic](#5-bod-backend-logic)
6. [Admin Backend Logic](#6-admin-backend-logic)
7. [CTF Backend Logic](#7-ctf-backend-logic)
8. [Feed & Posts Logic](#8-feed--posts-logic)
9. [Direct Messaging Logic](#9-direct-messaging-logic)
10. [Events Logic](#10-events-logic)
11. [Documents Logic](#11-documents-logic)
12. [Notifications Logic](#12-notifications-logic)
13. [Analytics Dashboard Logic](#13-analytics-dashboard-logic)
14. [CSV / PDF Export Logic](#14-csv--pdf-export-logic)
15. [Meeting Minutes Logic](#15-meeting-minutes-logic)
16. [Full Updated SQL Schema](#16-full-updated-sql-schema)
17. [Updated RLS Policies](#17-updated-rls-policies)
18. [Updated Middleware](#18-updated-middleware)
19. [Complete Permission Matrix](#19-complete-permission-matrix)
20. [Complete API Route List](#20-complete-api-route-list)
21. [All Email Triggers](#21-all-email-triggers)
22. [Error Handling Standards](#22-error-handling-standards)

---

## 1. ROLE SYSTEM

### 1.1 Three Roles — Hierarchy

```
admin   ←── Highest. System owner (faculty advisor or technical admin).
             Full access to everything including system settings, CTF management,
             role assignment, and permanent bans.

bod     ←── Middle. Board of Directors — elected club executives.
             Expanded operational access. Cannot touch system settings or CTF flags.
             Can approve/reject members, manage events, create announcements, view analytics.

member  ←── Base. Approved IIMS students.
             Access to portal features: feed, CTF, DMs, leaderboard, documents, events.
```

### 1.2 DB Role Values

```sql
-- In members table:
role TEXT CHECK (role IN ('member', 'bod', 'admin'))
-- 'superadmin' from CONTEXT.md is REMOVED — use 'admin' for highest privilege
```

### 1.3 BOD Positions (club_post column)

These are the actual ICEHC positions from the club proposal. The DB enforces them via CHECK constraint.

```sql
club_post TEXT NOT NULL DEFAULT 'General Member'
CHECK (club_post IN (
  -- Base member
  'General Member',
  -- Core BOD (founding + ongoing)
  'President',
  'Vice President',
  'Secretary',
  'Joint Secretary',            -- "Joint/Assistant Secretary" in the proposal
  'Treasurer',
  'Event & Activities Coordinator',
  'Marketing & Communication Lead',
  'Logistics & Operations Lead',
  'Executive Head',
  -- Additional BOD slots (for future expansion as club grows)
  'Technical Lead',
  'Media & PR Officer',
  'Research & Development Lead',
  'Training & Development Lead',
  'Community Outreach Lead',
  'Webmaster',
  'Faculty Advisor'             -- For the college-assigned faculty advisor
))
```

> **Why extra slots?** The club proposal has 9 founding members filling all BOD roles.
> As the club grows, new BOD elections will create new positions. Admin can assign any
> position from this list. Admin can ALSO request a new position be added to the CHECK
> constraint via a DB migration — never skip the constraint.

### 1.4 Role Assignment Rules

```
- New registrations → always role='member', club_post='General Member', status='pending'
- Only 'admin' can assign role='admin' to another user
- Only 'admin' can assign role='bod' to a member
- 'bod' CANNOT self-promote or promote others
- 'bod' CANNOT assign role='admin'
- club_post is set by admin when assigning BOD role
- A member can hold role='bod' and any club_post from the BOD list
- If a BOD member's term ends, admin sets role back to 'member' and club_post back to 'General Member'
- Faculty Advisor: role='bod', club_post='Faculty Advisor' — read-only advisory access
```

---

## 2. REGISTRATION & ONBOARDING

### 2.1 What We Know About ICEHC Members

All founding members are BCS students at IIMS College with emails in the format:
`firstname2082-XXXX@iimscollege.edu.np`

The student ID format is: `IIMS-YYYY-XXXX` (e.g., `IIMS-2082-0490`)

### 2.2 Registration Fields (What to Collect)

**Step 1 — Magic Link** (just email):
```
email: string (required)
```
Email domain is NOT enforced at the DB level (some students may use personal email).
Admin manually verifies they are IIMS students via Student ID during approval.

**Step 2 — Profile Completion** (`/portal/register` — after first magic link login):
```typescript
export const registerSchema = z.object({
  full_name:   z.string().min(2).max(100).trim(),
  student_id:  z.string()
                 .regex(/^IIMS-\d{4}-\d{4}$/, 'Format: IIMS-YYYY-XXXX')
                 .trim(),
  program:     z.enum(['BCS', 'BBUS', 'BIHM', 'MBA', 'Other']),
  intake:      z.string().max(30).trim(),   // e.g. "BCS 2026 Jan Intake"
  phone:       z.string()
                 .regex(/^[9][6-9]\d{8}$/, 'Valid Nepal mobile number required')
                 .optional(),
  bio:         z.string().max(500).optional(),
  skills:      z.array(z.enum([
                 'penetration-testing', 'web-security', 'forensics',
                 'cryptography', 'osint', 'reverse-engineering',
                 'malware-analysis', 'network-security', 'secure-coding',
                 'ctf-general'
               ])).max(5).default([]),
  github_url:  z.string().url().startsWith('https://github.com/').optional().or(z.literal('')),
  linkedin_url: z.string().url().startsWith('https://linkedin.com/').optional().or(z.literal('')),
  // club_post is NOT here — always hardcoded to 'General Member' server-side
  // role is NOT here — always hardcoded to 'member' server-side
})
```

**What the server does with the registration:**
```typescript
// /api/auth/register route — members row already created by DB trigger
// Only UPDATE non-sensitive fields. NEVER touch role, status, club_post.
await supabaseAdmin
  .from('members')
  .update({
    full_name:    parsed.data.full_name,
    student_id:   parsed.data.student_id,
    program:      parsed.data.program,
    intake:       parsed.data.intake,
    phone:        parsed.data.phone ?? null,
    bio:          parsed.data.bio ?? null,
    skills:       parsed.data.skills,
    github_url:   parsed.data.github_url || null,
    linkedin_url: parsed.data.linkedin_url || null,
    club_post:    'General Member',   // ← hardcoded, never from client
  })
  .eq('user_id', session.user.id)     // ← user_id, never id
```

### 2.3 Approval Flow

```
Register → pending → [BOD or Admin reviews] → approved / rejected

If approved:
  - status = 'approved'
  - approved_at = now()
  - approved_by = bod/admin member id
  - Trigger: send "Welcome to ICEHC" email
  - Trigger: insert welcome notification for new member
  - Trigger: insert "New member joined" notification for all BOD + admin

If rejected:
  - status = 'rejected'
  - reject_reason = text (required — BOD/admin must provide reason)
  - Trigger: send rejection email with reason

If banned:
  - status = 'banned'
  - ban_reason = text (required — admin only)
  - Trigger: send ban notification email
  - Trigger: clear all active sessions (done via Supabase admin.auth.signOut)
  - Data: keep all posts/messages (soft ban — access blocked, content preserved)
```

### 2.4 The Pending Screen (`/portal/pending`)

Show:
- "Your application is under review" message
- Their submitted profile summary (name, student ID, program, intake)
- "The ICEHC Board of Directors will review your application shortly."
- Club email: icehc@iimscollege.edu.np
- Link to IIMS College website

Do NOT show: any portal content, member count, CTF info, or any operational data.

---

## 3. COMPLETE AUTH FLOW

```
1. User submits email at /portal/login
   → Rate limit: magicLinkLimiter (3 per 15 min per IP)
   → POST to Supabase auth.signInWithOtp({ email, options: { emailRedirectTo: SITE_URL/portal/auth/callback }})
   → Resend delivers branded ICEHC magic link email

2. User clicks link → /portal/auth/callback
   → Supabase exchanges code for session
   → DB trigger fn_on_auth_user_created() fires if new user:
       INSERT INTO members (user_id, email, full_name='New Member', status='pending', role='member', club_post='General Member')
   → Check if members row has full_name still = 'New Member' OR student_id IS NULL:
       → Redirect to /portal/register (profile incomplete)
   → If profile complete and status='pending':
       → Redirect to /portal/pending
   → If profile complete and status='approved':
       → Redirect to /portal/dashboard

3. Middleware runs on every /portal/* request:
   → No session?                        → /portal/login
   → status = 'pending'                 → /portal/pending
   → status = 'rejected'                → /portal/login?reason=rejected
   → status = 'banned'                  → clear sb-* cookies → /portal/login?reason=banned
   → status = 'approved', role='member' → allow /portal/* (not /bod or /admin)
   → status = 'approved', role='bod'    → allow /portal/* + /portal/bod/*
   → status = 'approved', role='admin'  → allow everything

4. Session refresh:
   → Supabase handles JWT refresh automatically via @supabase/ssr
   → On refresh, middleware re-checks status (handles mid-session bans)
```

### 3.1 `assertRole()` — Updated for Three Roles

```typescript
// lib/auth.ts
import 'server-only'
import { createServerClient } from '@/lib/supabase-server'

type Role = 'member' | 'bod' | 'admin'

// Hierarchy: member=0, bod=1, admin=2
const ROLE_HIERARCHY: Record<Role, number> = {
  member: 0,
  bod: 1,
  admin: 2,
}

export async function assertRole(minRole: Role) {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('UNAUTHENTICATED')

  // ✅ ALWAYS user_id — never id
  const { data: member } = await supabase
    .from('members')
    .select('id, role, status, club_post, full_name')
    .eq('user_id', session.user.id)
    .single()

  if (!member) throw new Error('MEMBER_NOT_FOUND')
  if (member.status !== 'approved') throw new Error('NOT_APPROVED')
  if (ROLE_HIERARCHY[member.role as Role] < ROLE_HIERARCHY[minRole]) {
    throw new Error('INSUFFICIENT_ROLE')
  }

  return member
}

// Convenience wrappers
export async function assertMember() { return assertRole('member') }
export async function assertBOD()    { return assertRole('bod') }
export async function assertAdmin()  { return assertRole('admin') }
```

---

## 4. MEMBER BACKEND LOGIC

Members are approved IIMS students. They can access the full portal but cannot manage content, other members, or system settings.

### 4.1 Dashboard Data (`/portal/dashboard`)

Fetch all in parallel via `Promise.all()` on the server:

```typescript
const [stats, announcements, upcomingEvents, ctfProgress, notifications] = await Promise.all([
  // Personal stats
  supabase.from('members')
    .select('points, full_name, program, intake, club_post, joined_at')
    .eq('user_id', session.user.id).single(),

  // Leaderboard rank (computed via count of members with more points)
  supabase.from('members')
    .select('id', { count: 'exact' })
    .eq('status', 'approved')
    .gt('points', memberPoints),  // memberPoints from stats query

  // Pinned announcements (latest 3)
  supabase.from('posts')
    .select('id, title, content, created_at, author_id')
    .eq('is_pinned', true)
    .order('created_at', { ascending: false })
    .limit(3),

  // Upcoming events (next 2 published)
  supabase.from('public_events')
    .select('id, title, event_date, type, location, short_desc, cover_image_url')
    .eq('is_published', true)
    .gte('event_date', new Date().toISOString())
    .order('event_date', { ascending: true })
    .limit(2),

  // CTF progress
  supabase.from('ctf_challenges')
    .select('id', { count: 'exact' })
    .eq('is_active', true),

  supabase.from('ctf_solves')
    .select('id', { count: 'exact' })
    .eq('member_id', memberId),  // memberId from stats query

  // Unread notifications
  supabase.from('notifications')
    .select('id, type, title, body, link, created_at')
    .eq('recipient_id', memberId)
    .eq('is_read', false)
    .order('created_at', { ascending: false })
    .limit(3),
])
```

Dashboard renders:
- Greeting: "Welcome back, [full_name]" + program badge + intake badge
- Stats row: Your Rank (#N) | Points | CTF Solved (N/Total) | Member Since
- Pinned announcements (crimson left border)
- Upcoming events with RSVP quick-button
- Unread notifications preview with "View All" link

### 4.2 Profile Management (`/portal/profile`)

Members can edit their own non-sensitive fields:

```typescript
// PATCH /api/members/profile
// What members CAN update:
const memberUpdateSchema = z.object({
  full_name:    z.string().min(2).max(100).trim().optional(),
  bio:          z.string().max(500).optional(),
  phone:        z.string().regex(/^[9][6-9]\d{8}$/).optional().or(z.literal('')),
  skills:       z.array(z.string()).max(5).optional(),
  github_url:   z.string().url().startsWith('https://github.com/').optional().or(z.literal('')),
  linkedin_url: z.string().url().startsWith('https://linkedin.com/').optional().or(z.literal('')),
  // avatar_url is handled separately via upload endpoint
})

// What members CANNOT update (server enforces):
// role, status, club_post, student_id, program, intake, points, email
```

Avatar upload flow:
```
1. Member selects image
2. Client validates: MIME in [image/jpeg, image/png, image/webp], size < 2MB
3. POST /api/upload with { bucket: 'team-avatars', fileName: `${memberId}-avatar` }
4. Server returns signed upload URL (Supabase Storage)
5. Client uploads directly to signed URL
6. Client sends PATCH /api/members/profile with { avatar_url: publicUrl }
7. Server updates members.avatar_url
```

### 4.3 What Members Can See

```
✅ /portal/dashboard       — own stats + announcements + events + notifications
✅ /portal/feed            — all posts (read + react + comment + create post/resource)
✅ /portal/ctf             — active challenges (NO flag_hash ever)
✅ /portal/ctf/[id]        — challenge detail + flag submit
✅ /portal/leaderboard     — all approved members ranked by points
✅ /portal/messages        — DMs with any approved member
✅ /portal/notifications   — own notifications
✅ /portal/documents       — all documents (download only)
✅ /portal/events          — published events + RSVP
✅ /portal/events/[id]     — event detail + RSVP toggle
✅ /portal/profile         — own profile edit
✅ /portal/members/[id]    — view any approved member's public profile

❌ /portal/bod/*           — BOD-only section
❌ /portal/admin/*         — Admin-only section
❌ Creating announcements
❌ Pinning/unpinning posts
❌ Deleting other members' content
❌ Seeing pending members
❌ Changing any member's role or status
```

---

## 5. BOD BACKEND LOGIC

BOD = Board of Directors. Elected club executives. The original 9 founding members of ICEHC.
Roles: President, Vice President, Secretary, Joint Secretary, Treasurer, Event & Activities Coordinator, Marketing & Communication Lead, Logistics & Operations Lead, Executive Head.
Future roles: Technical Lead, Media & PR Officer, Research Lead, etc.

### 5.1 BOD Portal Section (`/portal/bod/*`)

BOD members see everything members see PLUS an additional BOD section in the sidebar.

```
Sidebar additions for BOD:
  ├── BOD Section Header
  ├── Pending Approvals (/portal/bod/approvals) — with badge count
  ├── Event Management (/portal/bod/events)
  ├── Announcements (/portal/bod/announcements)
  ├── Analytics (/portal/bod/analytics)
  ├── Member Directory (/portal/bod/members)
  └── Meeting Minutes (/portal/bod/meetings)
```

### 5.2 Member Approval (BOD Can Do This)

```typescript
// PATCH /api/bod/members/[memberId]/status
// BOD can: approve, reject (with reason)
// BOD CANNOT: ban (ban is admin-only)

export async function PATCH(req: NextRequest, { params }) {
  const bod = await assertBOD()  // ← first line always
  const { action, reason } = approvalSchema.parse(await req.json())

  // action: 'approve' | 'reject'
  if (action === 'ban') {
    return NextResponse.json({ error: 'BOD cannot ban members. Contact admin.' }, { status: 403 })
  }

  const updates: Record<string, unknown> = {
    status: action === 'approve' ? 'approved' : 'rejected',
    approved_by: bod.id,
    approved_at: action === 'approve' ? new Date().toISOString() : null,
    reject_reason: action === 'reject' ? reason : null,
  }

  await supabaseAdmin.from('members').update(updates).eq('id', params.memberId)

  // Audit log
  await supabaseAdmin.from('audit_logs').insert({
    admin_id: bod.id,
    action: `member_${action}`,
    target_id: params.memberId,
    meta: { reason: reason ?? null, performed_by_role: 'bod' }
  })

  // Email trigger
  if (action === 'approve') await sendWelcomeEmail(memberEmail, memberName)
  if (action === 'reject')  await sendRejectionEmail(memberEmail, memberName, reason)

  // Notification to new member
  await supabaseAdmin.from('notifications').insert({
    recipient_id: params.memberId,
    type: action === 'approve' ? 'member_approved' : 'member_rejected',
    title: action === 'approve' ? 'You have been approved!' : 'Application not approved',
    body: action === 'approve'
      ? 'Welcome to ICEHC! You now have full access to the portal.'
      : `Reason: ${reason}`,
    link: action === 'approve' ? '/portal/dashboard' : null,
  })
}
```

### 5.3 Event Management (BOD Can Create/Edit/Delete Events)

```typescript
// POST /api/bod/events — create event
// PATCH /api/bod/events/[id] — edit event
// DELETE /api/bod/events/[id] — delete event (with ConfirmModal)
// PATCH /api/bod/events/[id]/publish — toggle is_published

// BOD can manage ALL event fields EXCEPT:
// - They cannot create CTF-type events (that's admin only, as CTF challenges are linked)
// Actually: BOD CAN create events of type 'ctf' as public listings,
//           but CTF challenge activation inside those events is admin-only

export const bodCreateEventSchema = z.object({
  title:           z.string().min(2).max(200),
  slug:            z.string().regex(/^[a-z0-9-]+$/),
  description:     z.string().min(10),
  short_desc:      z.string().max(200).optional(),
  event_date:      z.string().datetime(),
  end_date:        z.string().datetime().optional(),
  location:        z.string().max(300).optional(),
  meeting_link:    z.string().url().optional().or(z.literal('')),
  type:            z.enum(['workshop', 'ctf', 'hackathon', 'seminar', 'meetup', 'competition', 'other']),
  max_attendees:   z.number().positive().optional(),
  cover_image_url: z.string().url().optional(),
  is_published:    z.boolean().default(false),
})
```

### 5.4 Announcements (BOD Can Create)

```typescript
// POST /api/bod/posts/announcement
// BOD can create post type='announcement'
// BOD can pin/unpin any post
// BOD can delete any post (with ConfirmModal + audit log)

export const bodAnnouncementSchema = z.object({
  title:   z.string().min(2).max(200),
  content: z.string().min(10).max(10000),
  // type is hardcoded to 'announcement' server-side
  // is_pinned defaults to false, BOD can set to true
  is_pinned: z.boolean().default(false),
})
```

### 5.5 What BOD Can and Cannot Do

```
✅ Approve members (approve / reject only — NOT ban)
✅ Create, edit, delete, publish events
✅ Create announcements and pin/unpin posts
✅ Delete any post or comment (moderation)
✅ View all members (including pending) with full profile data
✅ View audit logs (read-only)
✅ View analytics dashboard
✅ Export member CSV
✅ Create and manage meeting minutes
✅ Broadcast notifications to all approved members
✅ View contact form submissions (read-only)
✅ Upload and manage documents

❌ Ban members (admin only)
❌ Assign BOD role to anyone (admin only)
❌ Assign admin role (admin only)
❌ Create/edit/delete CTF challenges (admin only)
❌ Activate/deactivate CTF challenges (admin only)
❌ Edit site settings (admin only)
❌ Manual point adjustments (admin only)
❌ View raw flag_hash values (nobody except DB)
```

### 5.6 BOD Sidebar Layout

```typescript
// The portal layout.tsx checks role and renders different sidebars:

// For role='member': standard member sidebar
// For role='bod': member sidebar + BOD section
// For role='admin': member sidebar + BOD section + Admin section

// BOD section in sidebar:
const BOD_NAV = [
  { label: 'Pending Approvals', href: '/portal/bod/approvals', icon: UserCheck, badge: pendingCount },
  { label: 'Event Management', href: '/portal/bod/events', icon: Calendar },
  { label: 'Announcements', href: '/portal/bod/announcements', icon: Megaphone },
  { label: 'Member Directory', href: '/portal/bod/members', icon: Users },
  { label: 'Analytics', href: '/portal/bod/analytics', icon: BarChart2 },
  { label: 'Meeting Minutes', href: '/portal/bod/meetings', icon: FileText },
  { label: 'Contact Inbox', href: '/portal/bod/contact', icon: Mail },
]
```

---

## 6. ADMIN BACKEND LOGIC

Admin has full system access. There is one or a handful of admins (faculty advisor level or founding technical admin).

### 6.1 What Admin Has Beyond BOD

```
✅ Everything BOD can do PLUS:
✅ Ban members (with reason, clears sessions)
✅ Assign role='bod' to any member (and set their club_post)
✅ Assign role='admin' to any member
✅ Demote BOD back to member (role='member', club_post='General Member')
✅ Create / edit / delete / activate / deactivate CTF challenges
✅ Manual point adjustment (logged to audit_logs)
✅ Edit site settings (key-value pairs in site_settings table)
✅ View full audit logs with filter + search
✅ Delete any member's account (permanent — requires double confirmation)
✅ Export PDF reports

❌ Cannot view or retrieve raw flag_hash (it's hashed — nobody can reverse it)
```

### 6.2 Role Assignment (Admin Only)

```typescript
// PATCH /api/admin/members/[memberId]/role
export async function PATCH(req: NextRequest, { params }) {
  const admin = await assertAdmin()  // ← first line
  const { role, club_post } = roleAssignSchema.parse(await req.json())

  // Validation rules
  if (role === 'bod' && !VALID_BOD_POSITIONS.includes(club_post)) {
    return NextResponse.json({ error: 'Invalid club_post for BOD role' }, { status: 400 })
  }
  if (role === 'member') {
    // When demoting, always reset club_post to General Member
    await supabaseAdmin.from('members').update({
      role: 'member',
      club_post: 'General Member'
    }).eq('id', params.memberId)
  } else {
    await supabaseAdmin.from('members').update({
      role,
      club_post: role === 'bod' ? club_post : 'General Member'
    }).eq('id', params.memberId)
  }

  await supabaseAdmin.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'role_change',
    target_id: params.memberId,
    meta: { new_role: role, new_club_post: club_post }
  })
}

const roleAssignSchema = z.object({
  role: z.enum(['member', 'bod', 'admin']),
  club_post: z.string().optional(),
})

const VALID_BOD_POSITIONS = [
  'President', 'Vice President', 'Secretary', 'Joint Secretary',
  'Treasurer', 'Event & Activities Coordinator', 'Marketing & Communication Lead',
  'Logistics & Operations Lead', 'Executive Head', 'Technical Lead',
  'Media & PR Officer', 'Research & Development Lead', 'Training & Development Lead',
  'Community Outreach Lead', 'Webmaster', 'Faculty Advisor'
]
```

### 6.3 Ban Member (Admin Only)

```typescript
// PATCH /api/admin/members/[memberId]/ban
export async function PATCH(req: NextRequest, { params }) {
  const admin = await assertAdmin()
  const { ban_reason } = banSchema.parse(await req.json())

  await supabaseAdmin.from('members').update({
    status: 'banned',
    ban_reason,
  }).eq('id', params.memberId)

  // Force sign out — invalidates all active sessions
  await supabaseAdmin.auth.admin.signOut(targetUserId)

  // Email notification
  await sendBanEmail(memberEmail, memberName, ban_reason)

  // Audit log
  await supabaseAdmin.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'member_ban',
    target_id: params.memberId,
    meta: { ban_reason }
  })
}

const banSchema = z.object({
  ban_reason: z.string().min(10).max(500),  // reason is required — must be substantive
})
```

### 6.4 Manual Point Adjustment (Admin Only)

```typescript
// PATCH /api/admin/members/[memberId]/points
export async function PATCH(req: NextRequest, { params }) {
  const admin = await assertAdmin()
  const { adjustment, reason } = pointsSchema.parse(await req.json())

  // Fetch current points first
  const { data: member } = await supabaseAdmin
    .from('members').select('points, full_name').eq('id', params.memberId).single()

  const newPoints = Math.max(0, member.points + adjustment)  // floor at 0

  await supabaseAdmin.from('members')
    .update({ points: newPoints })
    .eq('id', params.memberId)

  // Always log point adjustments
  await supabaseAdmin.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'manual_points_adjustment',
    target_id: params.memberId,
    meta: { old_points: member.points, adjustment, new_points: newPoints, reason }
  })

  // Notify the member
  await supabaseAdmin.from('notifications').insert({
    recipient_id: params.memberId,
    sender_id: admin.id,
    type: 'announcement',
    title: adjustment > 0 ? `+${adjustment} points awarded` : `${adjustment} points adjusted`,
    body: reason,
    link: '/portal/leaderboard',
  })
}

const pointsSchema = z.object({
  adjustment: z.number().int().min(-10000).max(10000),
  reason:     z.string().min(5).max(300),
})
```

### 6.5 Admin Panel Tabs (Full List)

```
Tab 1:  Overview        — Live stats: members, pending, CTF activity, event RSVPs
Tab 2:  Pending         — Fast queue: pending members with approve/reject/preview
Tab 3:  Members         — All members, filter by role/status/program, role assignment, ban, CSV export
Tab 4:  BOD Management  — Assign/remove BOD positions, view current committee
Tab 5:  Posts           — All posts: pin, delete, create announcement
Tab 6:  Events          — Full CRUD, publish toggle, RSVP list
Tab 7:  Documents       — Upload, delete, toggle is_public
Tab 8:  CTF             — Create/edit challenges (flag auto-hashed), activate/deactivate, manual points
Tab 9:  Leaderboard     — Read-only + manual point adjustment per member
Tab 10: Gallery         — Upload/delete gallery images, tag to event
Tab 11: Broadcast       — Compose and send notification to all approved members
Tab 12: Contact         — View/read/respond to contact form submissions
Tab 13: Analytics       — Full analytics dashboard (Section 13)
Tab 14: Audit Logs      — Full audit trail, filter by action/admin/date
Tab 15: Settings        — Edit site_settings key-value pairs
Tab 16: Meeting Minutes — View all minutes, edit any minute (admin can correct BOD minutes)
```

---

## 7. CTF BACKEND LOGIC

Individual scoring only. No teams. Flags are SHA-256 hashed. Only admin creates challenges.

### 7.1 Challenge Lifecycle

```
Admin creates challenge → is_active=false (draft)
Admin sets is_active=true → visible to all approved members
Member submits flag → /api/ctf/submit
  → rate limit (10/min/IP)
  → 50ms delay (anti-timing)
  → server hashes submission → compares to flag_hash
  → if correct: INSERT ctf_solves → trigger fires → points added atomically
  → if wrong: { correct: false } (no extra info)
Admin deactivates → is_active=false → hidden from members
```

### 7.2 Flag Submission Route (Complete)

```typescript
// /api/ctf/submit/route.ts
import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { assertMember } from '@/lib/auth'
import { createServerClient } from '@/lib/supabase-server'
import { flagSubmitLimiter } from '@/lib/ratelimit'
import { hashFlag } from '@/lib/crypto'
import { z } from 'zod'

const submitSchema = z.object({
  challengeId: z.string().uuid(),
  flag:        z.string().min(1).max(500),
})

export async function POST(req: NextRequest) {
  // 1. Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await flagSubmitLimiter.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 1 minute.' }, { status: 429 })
  }

  // 2. Auth check
  const member = await assertMember()

  // 3. Anti-timing delay
  await new Promise(r => setTimeout(r, 50))

  // 4. Validate input
  const { challengeId, flag } = submitSchema.parse(await req.json())

  // 5. Fetch challenge using SERVICE ROLE — never anon client
  const supabaseAdmin = createServerClient()
  const { data: challenge } = await supabaseAdmin
    .from('ctf_challenges')
    .select('id, flag_hash, is_active, points, title')  // explicit cols — never *
    .eq('id', challengeId)
    .eq('is_active', true)
    .single()

  if (!challenge) {
    return NextResponse.json({ error: 'Challenge not found.' }, { status: 404 })
  }

  // 6. Check if already solved
  const { data: existingSolve } = await supabaseAdmin
    .from('ctf_solves')
    .select('id')
    .eq('challenge_id', challengeId)
    .eq('member_id', member.id)
    .single()

  if (existingSolve) {
    return NextResponse.json({ correct: true, alreadySolved: true }, { status: 200 })
  }

  // 7. Compare hashes — flag_hash NEVER sent to client
  const isCorrect = hashFlag(flag) === challenge.flag_hash

  if (!isCorrect) {
    return NextResponse.json({ correct: false }, { status: 200 })
  }

  // 8. Insert solve — DB trigger handles points atomically
  const { error } = await supabaseAdmin.from('ctf_solves').insert({
    challenge_id: challengeId,
    member_id: member.id,
  })

  if (error?.code === '23505') {
    // Race condition: another request solved it first
    return NextResponse.json({ correct: true, alreadySolved: true }, { status: 200 })
  }

  // 9. Return success — trigger already sent notification + added points
  return NextResponse.json({ correct: true, alreadySolved: false, points: challenge.points })
}
```

### 7.3 What Members See on CTF Page

```typescript
// Fetch challenge data — NEVER include flag_hash in this query
const { data: challenges } = await supabase
  .from('ctf_challenges')
  .select('id, title, description, category, difficulty, points, flag_format, hint, file_url, solves_count, is_active, created_at')
  // ← flag_hash is NOT in the column list — this is the rule
  .eq('is_active', true)
  .order('difficulty', { ascending: true })

// Fetch which ones the member has solved
const { data: solves } = await supabase
  .from('ctf_solves')
  .select('challenge_id')
  .eq('member_id', memberId)
```

### 7.4 CTF Admin Panel (Admin Only)

```typescript
// Create challenge — flag hashed here, never stored raw
export const createChallengeSchema = z.object({
  title:       z.string().min(2).max(200),
  description: z.string().min(10),
  category:    z.enum(['web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc']),
  difficulty:  z.enum(['easy', 'medium', 'hard', 'insane']),
  points:      z.number().int().positive().max(10000),
  raw_flag:    z.string().min(5).max(500),  // ← raw flag comes in, never stored
  flag_format: z.string().default('ICEHC{...}'),  // ICEHC flag format!
  hint:        z.string().max(500).optional(),
  file_url:    z.string().url().optional(),
  is_active:   z.boolean().default(false),
})

// In the API route:
const flagHash = hashFlag(parsed.data.raw_flag)
await supabaseAdmin.from('ctf_challenges').insert({
  title:       parsed.data.title,
  description: parsed.data.description,
  category:    parsed.data.category,
  difficulty:  parsed.data.difficulty,
  points:      parsed.data.points,
  flag_hash:   flagHash,       // ← hashed, never raw_flag
  flag_format: parsed.data.flag_format,
  hint:        parsed.data.hint ?? null,
  file_url:    parsed.data.file_url ?? null,
  is_active:   parsed.data.is_active,
  created_by:  admin.id,
  // raw_flag is intentionally not in this object
})
```

---

## 8. FEED & POSTS LOGIC

### 8.1 Post Types and Who Creates Them

| Type | Creator | Description |
|---|---|---|
| `post` | Any approved member | General club discussion, updates |
| `resource` | Any approved member | Links, tools, writeups, learning materials |
| `project` | Any approved member | Member project showcases |
| `announcement` | BOD + Admin only | Official club announcements |

### 8.2 Feed Query (Paginated)

```typescript
// GET /api/posts?page=1&search=&type=
const PAGE_SIZE = 20
const from = (page - 1) * PAGE_SIZE
const to = from + PAGE_SIZE - 1

let query = supabase
  .from('posts')
  .select(`
    id, title, content, type, is_pinned, created_at, updated_at,
    author:members!author_id(id, full_name, avatar_url, club_post, role),
    reactions:post_reactions(count),
    comments:post_comments(count)
  `)
  .eq('author.status', 'approved')
  .order('is_pinned', { ascending: false })
  .order('created_at', { ascending: false })
  .range(from, to)

if (type) query = query.eq('type', type)
if (search) query = query.ilike('content', `%${search}%`)
```

### 8.3 Post CRUD Rules

```
Create:
  - Any approved member can create post/resource/project
  - BOD + Admin can create announcement
  - Server hardcodes author_id = member.id (never from client)

Edit:
  - Authors can edit own posts within 24h (RLS enforces this)
  - BOD + Admin can edit any post at any time
  - type cannot be changed after creation

Delete:
  - Authors can delete own posts (any time)
  - BOD + Admin can delete any post
  - Deletion cascades to post_reactions and post_comments

Pin/Unpin:
  - BOD + Admin only
  - No limit on number of pinned posts

React:
  - Any approved member, one reaction per post
  - Toggle: insert if not exists, delete if exists
  - Realtime: `supabase.channel('post_reactions').on('postgres_changes', ...)`

Comment:
  - Any approved member can comment
  - Authors can delete own comments
  - BOD + Admin can delete any comment
  - 20 comments per page, oldest first
```

---

## 9. DIRECT MESSAGING LOGIC

### 9.1 Conversation Creation

```typescript
// POST /api/messages — start new DM
export async function POST(req: NextRequest) {
  const member = await assertMember()
  const { recipientId } = newConversationSchema.parse(await req.json())

  // Prevent DMing self
  if (recipientId === member.id) {
    return NextResponse.json({ error: 'Cannot message yourself.' }, { status: 400 })
  }

  // Check if conversation already exists between these two
  const { data: existing } = await supabaseAdmin.rpc('find_conversation', {
    member_a: member.id,
    member_b: recipientId
  })

  if (existing) {
    return NextResponse.json({ conversationId: existing.id })
  }

  // Create new conversation
  const { data: conversation } = await supabaseAdmin
    .from('conversations').insert({}).select('id').single()

  await supabaseAdmin.from('conversation_participants').insert([
    { conversation_id: conversation.id, member_id: member.id },
    { conversation_id: conversation.id, member_id: recipientId },
  ])

  return NextResponse.json({ conversationId: conversation.id })
}
```

### 9.2 SQL Function for Conversation Lookup

```sql
-- Add to Supabase SQL Editor
CREATE OR REPLACE FUNCTION find_conversation(member_a uuid, member_b uuid)
RETURNS TABLE(id uuid) AS $$
  SELECT c.id FROM conversations c
  WHERE
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_a)
    AND
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_b)
  LIMIT 1;
$$ LANGUAGE sql STABLE;
```

### 9.3 Message Send

```typescript
// POST /api/messages/[conversationId]
const { content } = messageSchema.parse(await req.json())

// Verify sender is a participant
const { data: participant } = await supabaseAdmin
  .from('conversation_participants')
  .select('member_id')
  .eq('conversation_id', conversationId)
  .eq('member_id', member.id)
  .single()

if (!participant) return NextResponse.json({ error: 'Not a participant.' }, { status: 403 })

await supabaseAdmin.from('messages').insert({
  conversation_id: conversationId,
  sender_id: member.id,
  content,
})

// Update conversation updated_at for sorting
await supabaseAdmin.from('conversations')
  .update({ updated_at: new Date().toISOString() })
  .eq('id', conversationId)
```

### 9.4 Realtime Subscription (Client Component)

```typescript
// hooks/useRealtimeMessages.ts — unchanged from CONTEXT.md Section 15
// Subscribe only to specific conversation_id — never subscribe to entire messages table
```

---

## 10. EVENTS LOGIC

### 10.1 Event Types for ICEHC

```typescript
type EventType = 'workshop' | 'ctf' | 'hackathon' | 'seminar' | 'meetup' | 'competition' | 'other'

// ICEHC-specific event examples from the activities plan:
// Month 1: "Introduction to the Red Team" → type='workshop'
// Month 2: "Scan the Scammers" → type='seminar'
// Month 3: Internal CTF → type='ctf'
// Month 4: Guest Lecture → type='seminar'
// Month 5: Secure Coding Bootcamp → type='workshop'
// Month 6: Hackathon / Cyber Day → type='hackathon'
```

### 10.2 RSVP Logic

```typescript
// POST /api/events/[id]/rsvp
const { status } = rsvpSchema.parse(await req.json())
// status: 'going' | 'maybe' | 'not_going'

// Upsert — insert or update existing RSVP
await supabaseAdmin.from('event_rsvps').upsert({
  event_id: eventId,
  member_id: member.id,
  status,
}, { onConflict: 'event_id,member_id' })

// Check max_attendees
if (event.max_attendees) {
  const { count } = await supabaseAdmin
    .from('event_rsvps')
    .select('*', { count: 'exact' })
    .eq('event_id', eventId)
    .eq('status', 'going')

  if (count >= event.max_attendees && status === 'going') {
    return NextResponse.json({ error: 'Event is full.' }, { status: 409 })
  }
}
```

---

## 11. DOCUMENTS LOGIC

### 11.1 Upload Flow

```
1. Member/BOD selects file
2. Client validates: MIME type + size (server also validates)
3. POST /api/upload → server returns signed URL
4. Client uploads to signed URL (direct to Supabase Storage)
5. POST /api/documents with metadata → inserts DB row
```

### 11.2 Upload Validation (Server-Side — Mandatory)

```typescript
// /api/upload/route.ts
const ALLOWED_MIMES = {
  'club-documents': ['application/pdf', 'application/zip', 'application/vnd.ms-powerpoint',
                     'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                     'application/msword',
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  'public-gallery': ['image/jpeg', 'image/png', 'image/webp'],
  'event-images':   ['image/jpeg', 'image/png', 'image/webp'],
  'team-avatars':   ['image/jpeg', 'image/png', 'image/webp'],
  'ctf-files':      ['*'],  // any — admin only
}

const MAX_SIZE = {
  'club-documents': 50 * 1024 * 1024,  // 50MB
  'public-gallery': 10 * 1024 * 1024,  // 10MB
  'event-images':    5 * 1024 * 1024,  //  5MB
  'team-avatars':    2 * 1024 * 1024,  //  2MB
  'ctf-files':      20 * 1024 * 1024,  // 20MB
}
```

### 11.3 Download — Always Signed URL

```typescript
// GET /api/documents/[id]/download
const member = await assertMember()

// Increment download count
await supabaseAdmin.from('documents')
  .update({ download_count: supabase.rpc('increment', { x: 1 }) })
  .eq('id', documentId)

// Generate signed URL (1 hour expiry)
const { data } = await supabaseAdmin.storage
  .from('club-documents')
  .createSignedUrl(filePath, 3600)

return NextResponse.redirect(data.signedUrl)
```

---

## 12. NOTIFICATIONS LOGIC

### 12.1 Notification Types and Triggers

| Type | When Fired | Who Gets It |
|---|---|---|
| `member_approved` | BOD/Admin approves member | Approved member only |
| `member_rejected` | BOD/Admin rejects member | Rejected member only |
| `new_message` | Someone sends a DM | DM recipient |
| `new_post` | Announcement created | All approved members |
| `post_reaction` | Someone reacts to your post | Post author |
| `post_comment` | Someone comments on your post | Post author |
| `event_reminder` | 24h before an event you RSVP'd to | All 'going' RSVPs |
| `ctf_new_challenge` | Admin activates a new CTF challenge | All approved members |
| `ctf_solved` | Member solves a CTF (DB trigger) | Solver only |
| `announcement` | Manual broadcast, point adjustment | Targeted member(s) |

### 12.2 Broadcast Notification (BOD + Admin)

```typescript
// POST /api/bod/broadcast
export async function POST(req: NextRequest) {
  const sender = await assertBOD()
  const { title, body, link } = broadcastSchema.parse(await req.json())

  // Get all approved member IDs
  const { data: members } = await supabaseAdmin
    .from('members')
    .select('id')
    .eq('status', 'approved')

  // Batch insert notifications
  const notifications = members.map(m => ({
    recipient_id: m.id,
    sender_id: sender.id,
    type: 'announcement' as const,
    title,
    body,
    link: link || null,
  }))

  // Insert in batches of 500
  for (let i = 0; i < notifications.length; i += 500) {
    await supabaseAdmin.from('notifications').insert(notifications.slice(i, i + 500))
  }

  await supabaseAdmin.from('audit_logs').insert({
    admin_id: sender.id,
    action: 'broadcast_notification',
    meta: { title, recipient_count: members.length }
  })
}
```

### 12.3 Unread Count (Realtime)

```typescript
// hooks/useNotifications.ts
// Subscribe to notifications table for recipient_id = current member
// Update sidebar bell badge in real time
// On new notification: also show Toast (top-right)
```

---

## 13. ANALYTICS DASHBOARD LOGIC

Accessible by BOD and Admin. Admin sees everything. BOD sees everything except audit logs.

### 13.1 Data Points to Fetch

```typescript
// All fetched in parallel on the server
const [
  memberStats,
  postStats,
  ctfStats,
  eventStats,
  activityTimeline,
  topMembers,
] = await Promise.all([

  // Member stats
  supabaseAdmin.from('members').select('status, role, program, created_at'),

  // Post stats
  supabaseAdmin.from('posts').select('type, created_at'),
  supabaseAdmin.from('post_reactions').select('created_at'),
  supabaseAdmin.from('post_comments').select('created_at'),

  // CTF stats
  supabaseAdmin.from('ctf_challenges').select('category, difficulty, solves_count, is_active'),
  supabaseAdmin.from('ctf_solves').select('solved_at'),

  // Event stats
  supabaseAdmin.from('public_events').select('type, event_date, is_published'),
  supabaseAdmin.from('event_rsvps').select('status, event_id'),

  // Top 10 members by points
  supabaseAdmin.from('members')
    .select('id, full_name, avatar_url, points, club_post')
    .eq('status', 'approved')
    .order('points', { ascending: false })
    .limit(10),
])
```

### 13.2 Analytics Dashboard Cards

```
Row 1 — Membership Overview:
  - Total Members (approved) | Pending Applications | Rejected | Banned
  - Members by Program (BCS / BBUS / BIHM / MBA)
  - Members by Intake cohort (bar chart)
  - New members this month vs last month (% change)

Row 2 — Engagement:
  - Total Posts | Posts this week
  - Total Reactions | Avg reactions per post
  - Total Comments | Avg comments per post
  - Active members (posted/reacted in last 30 days)

Row 3 — CTF Activity:
  - Total challenges (active / inactive)
  - Total solves | Avg solves per challenge
  - Most solved challenge
  - Hardest challenge (lowest solve rate)
  - Solve rate by difficulty (easy/medium/hard/insane)
  - CTF solves over time (line chart — last 30 days)

Row 4 — Events:
  - Total events (published / upcoming / past)
  - Total RSVPs | Avg per event
  - Most attended event
  - Events by type (workshop/ctf/hackathon/seminar)

Row 5 — Leaderboard Snapshot:
  - Top 10 members table (rank, name, points, CTF solved, club_post)
```

---

## 14. CSV / PDF EXPORT LOGIC

### 14.1 CSV Member Export (BOD + Admin)

```typescript
// GET /api/bod/export/members
export async function GET(req: NextRequest) {
  const bod = await assertBOD()

  const { data: members } = await supabaseAdmin
    .from('members')
    .select('full_name, email, student_id, program, intake, role, club_post, status, points, joined_at, approved_at, phone')
    .order('joined_at', { ascending: true })

  // Build CSV string
  const headers = ['Name', 'Email', 'Student ID', 'Program', 'Intake', 'Role', 'Position', 'Status', 'Points', 'Joined', 'Approved', 'Phone']
  const rows = members.map(m => [
    m.full_name, m.email, m.student_id, m.program, m.intake,
    m.role, m.club_post, m.status, m.points,
    formatDate(m.joined_at), formatDate(m.approved_at), m.phone ?? ''
  ])

  const csv = [headers, ...rows].map(row => row.map(cell =>
    `"${String(cell ?? '').replace(/"/g, '""')}"`
  ).join(',')).join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="icehc-members-${Date.now()}.csv"`,
    }
  })
}
```

### 14.2 PDF Report Export (Admin Only)

```typescript
// GET /api/admin/export/report?type=members|ctf|events
// Uses a server-side PDF library (e.g., @react-pdf/renderer or pdfmake)
// Generates a branded PDF with ICEHC header + IIMS College logo
// Returns as PDF download

// PDF Report includes:
// - ICEHC header (club name, logo, date generated, generated by)
// - IIMS College affiliation footer
// - Data table matching the CSV content
// - Summary statistics at the top
```

---

## 15. MEETING MINUTES LOGIC

BOD and Admin can create, edit, view meeting minutes. Members cannot see this section.

### 15.1 DB Table (Add to Schema)

```sql
CREATE TABLE meeting_minutes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  meeting_date date NOT NULL,
  location     text CHECK (length(location) <= 200),
  attendees    text[] DEFAULT '{}',   -- array of member ids or just names
  agenda       text,
  minutes      text NOT NULL,         -- Markdown content
  action_items text,                  -- Markdown list of follow-ups
  created_by   uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  updated_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false, -- if true, members can also view (optional)
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE INDEX idx_minutes_date ON meeting_minutes(meeting_date DESC);
```

### 15.2 Meeting Minutes RLS

```sql
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;

-- BOD + admin can read all minutes
CREATE POLICY "BOD and admin can view minutes"
  ON meeting_minutes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members
    WHERE user_id = auth.uid()
    AND role IN ('bod', 'admin')
    AND status = 'approved'
  ));

-- Members can view ONLY published minutes
CREATE POLICY "Members can view published minutes"
  ON meeting_minutes FOR SELECT
  USING (
    is_published = true AND
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved')
  );

-- Only BOD + admin can create/edit
CREATE POLICY "BOD and admin can manage minutes"
  ON meeting_minutes FOR ALL
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin')
  ));
```

### 15.3 Meeting Minutes API

```typescript
// GET    /api/bod/meetings           — list all (paginated, 20/pg)
// POST   /api/bod/meetings           — create new minutes (Zod validated)
// GET    /api/bod/meetings/[id]      — view one
// PATCH  /api/bod/meetings/[id]      — edit (updated_by = current user)
// DELETE /api/bod/meetings/[id]      — delete (admin only)
// PATCH  /api/bod/meetings/[id]/publish — toggle is_published

export const meetingMinutesSchema = z.object({
  title:        z.string().min(2).max(200),
  meeting_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  location:     z.string().max(200).optional(),
  attendees:    z.array(z.string()).max(50).default([]),
  agenda:       z.string().max(5000).optional(),
  minutes:      z.string().min(10).max(50000),
  action_items: z.string().max(5000).optional(),
  is_published: z.boolean().default(false),
})
```

---

## 16. FULL UPDATED SQL SCHEMA

Run this in the Supabase SQL Editor. This REPLACES the schema in CONTEXT.md Section 7.
The only additions are: `phone` field in `members`, `meeting_minutes` table, `find_conversation` function,
updated `club_post` CHECK, updated role CHECK, updated `site_settings`.

```sql
-- =============================================
-- DROP AND RECREATE (if starting fresh)
-- Or run ALTER TABLE for existing DBs
-- =============================================

-- ── MEMBERS (updated) ──────────────────────
-- Changes from CONTEXT.md:
--   role CHECK: removed 'superadmin', kept 'member'|'bod'|'admin'
--   club_post CHECK: full ICEHC position list
--   Added: phone, intake columns

ALTER TABLE members
  DROP CONSTRAINT IF EXISTS members_role_check,
  DROP CONSTRAINT IF EXISTS members_club_post_check;

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS phone text CHECK (phone ~ '^[9][6-9][0-9]{8}$' OR phone IS NULL),
  ADD COLUMN IF NOT EXISTS intake text CHECK (length(intake) <= 30);

ALTER TABLE members
  ADD CONSTRAINT members_role_check
    CHECK (role IN ('member', 'bod', 'admin')),
  ADD CONSTRAINT members_club_post_check
    CHECK (club_post IN (
      'General Member',
      'President',
      'Vice President',
      'Secretary',
      'Joint Secretary',
      'Treasurer',
      'Event & Activities Coordinator',
      'Marketing & Communication Lead',
      'Logistics & Operations Lead',
      'Executive Head',
      'Technical Lead',
      'Media & PR Officer',
      'Research & Development Lead',
      'Training & Development Lead',
      'Community Outreach Lead',
      'Webmaster',
      'Faculty Advisor'
    ));

-- ── MEETING MINUTES (new) ──────────────────
CREATE TABLE IF NOT EXISTS meeting_minutes (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  meeting_date date NOT NULL,
  location     text CHECK (length(location) <= 200),
  attendees    text[] DEFAULT '{}',
  agenda       text CHECK (length(agenda) <= 5000),
  minutes      text NOT NULL CHECK (length(minutes) >= 10),
  action_items text CHECK (length(action_items) <= 5000),
  created_by   uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  updated_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  is_published boolean DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_minutes_date ON meeting_minutes(meeting_date DESC);

-- ── FIND CONVERSATION FUNCTION (new) ───────
CREATE OR REPLACE FUNCTION find_conversation(member_a uuid, member_b uuid)
RETURNS TABLE(id uuid) AS $$
  SELECT c.id FROM conversations c
  WHERE
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_a)
    AND
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_b)
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- ── UPDATED SITE SETTINGS ──────────────────
UPDATE site_settings SET value = 'IIMS Cybersecurity & Ethical Hacking Club (ICEHC)' WHERE key = 'site_title';
UPDATE site_settings SET value = 'Hack Ethically. Defend Relentlessly.' WHERE key = 'hero_tagline';
UPDATE site_settings SET value = 'Official Cybersecurity Club of IIMS College, Kathmandu.' WHERE key = 'hero_subtext';
UPDATE site_settings SET value = 'icehc@iimscollege.edu.np' WHERE key = 'contact_email';
INSERT INTO site_settings (key, value) VALUES
  ('flag_format', 'ICEHC{...}'),
  ('club_short_name', 'ICEHC'),
  ('founding_year', '2026')
ON CONFLICT (key) DO NOTHING;

-- ── CTF TRIGGER UPDATE ─────────────────────
-- Notification text uses ICEHC branding
CREATE OR REPLACE FUNCTION fn_on_ctf_solve()
RETURNS TRIGGER AS $$
DECLARE v_points integer; v_title text;
BEGIN
  SELECT points, title INTO v_points, v_title FROM ctf_challenges WHERE id = NEW.challenge_id;
  UPDATE members SET points = points + v_points WHERE id = NEW.member_id;
  UPDATE ctf_challenges SET solves_count = solves_count + 1 WHERE id = NEW.challenge_id;
  INSERT INTO notifications (recipient_id, type, title, body, link)
  VALUES (
    NEW.member_id, 'ctf_solved',
    'Flag Captured! 🏴',
    'You solved "' || v_title || '" and earned ' || v_points || ' points.',
    '/portal/leaderboard'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── AUTH TRIGGER UPDATE ────────────────────
-- Updated to set club_post = 'General Member' explicitly
CREATE OR REPLACE FUNCTION fn_on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (user_id, email, full_name, status, role, club_post)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'), 'pending', 'member', 'General Member')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 17. UPDATED RLS POLICIES

The core RLS from CONTEXT.md Section 9 is retained. These are the additions/updates for the BOD role.

```sql
-- ── POSTS — BOD can pin and delete any post ──────────────
CREATE POLICY "BOD and admin can update any post"
  ON posts FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

CREATE POLICY "BOD and admin can delete any post"
  ON posts FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

-- ── MEMBERS — BOD can view pending members ───────────────
-- Override the base "approved only" policy for BOD
DROP POLICY IF EXISTS "Approved members can view approved members" ON members;

CREATE POLICY "Approved members can view approved members"
  ON members FOR SELECT
  USING (
    -- Approved members see other approved members
    (status = 'approved' AND EXISTS (
      SELECT 1 FROM members m WHERE m.user_id = auth.uid() AND m.status = 'approved'
    ))
    OR
    -- BOD and admin see ALL members (including pending/rejected/banned)
    EXISTS (
      SELECT 1 FROM members m WHERE m.user_id = auth.uid() AND m.role IN ('bod', 'admin') AND m.status = 'approved'
    )
  );

-- ── EVENTS — BOD can manage events ──────────────────────
CREATE POLICY "BOD and admin can insert events"
  ON public_events FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

CREATE POLICY "BOD and admin can update events"
  ON public_events FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

CREATE POLICY "BOD and admin can delete events"
  ON public_events FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

-- ── DOCUMENTS — BOD can manage all documents ─────────────
CREATE POLICY "BOD and admin can manage all documents"
  ON documents FOR ALL
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

-- ── MEETING MINUTES ──────────────────────────────────────
ALTER TABLE meeting_minutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "BOD and admin can view all minutes"
  ON meeting_minutes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

CREATE POLICY "Members can view published minutes"
  ON meeting_minutes FOR SELECT
  USING (
    is_published = true AND
    EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND status = 'approved')
  );

CREATE POLICY "BOD and admin can insert minutes"
  ON meeting_minutes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

CREATE POLICY "BOD and admin can update minutes"
  ON meeting_minutes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role IN ('bod', 'admin') AND status = 'approved'
  ));

-- Only admin can delete meeting minutes
CREATE POLICY "Admin can delete minutes"
  ON meeting_minutes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
  ));

-- ── CTF CHALLENGES — Admin only can manage ───────────────
CREATE POLICY "Admin can manage CTF challenges"
  ON ctf_challenges FOR ALL
  USING (EXISTS (
    SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'admin' AND status = 'approved'
  ));
```

---

## 18. UPDATED MIDDLEWARE

```typescript
// middleware.ts — updated for three roles
// Route groups:
//   /portal/login, /portal/pending, /portal/register — public (auth routes)
//   /portal/bod/* — BOD + admin only
//   /portal/admin/* — admin only
//   /portal/* (all others) — any approved member

if (member.status === 'approved') {
  // BOD routes: requires role='bod' OR role='admin'
  if (path.startsWith('/portal/bod') && !['bod', 'admin'].includes(member.role)) {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }
  // Admin routes: requires role='admin' only
  if (path.startsWith('/portal/admin') && member.role !== 'admin') {
    return NextResponse.redirect(new URL('/portal/dashboard', request.url))
  }
}

export const config = {
  matcher: ['/portal/:path*']
}
```

---

## 19. COMPLETE PERMISSION MATRIX

| Feature | Member | BOD | Admin |
|---|---|---|---|
| View portal (feed, CTF, events, DMs) | ✅ | ✅ | ✅ |
| Submit CTF flags | ✅ | ✅ | ✅ |
| Create post/resource/project | ✅ | ✅ | ✅ |
| RSVP to events | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Upload documents | ✅ | ✅ | ✅ |
| Send/receive DMs | ✅ | ✅ | ✅ |
| View leaderboard | ✅ | ✅ | ✅ |
| **Create announcements** | ❌ | ✅ | ✅ |
| **Pin/unpin posts** | ❌ | ✅ | ✅ |
| **Delete any post/comment** | ❌ | ✅ | ✅ |
| **Approve members** | ❌ | ✅ | ✅ |
| **Reject members (with reason)** | ❌ | ✅ | ✅ |
| **Create/edit/delete events** | ❌ | ✅ | ✅ |
| **Publish events** | ❌ | ✅ | ✅ |
| **View pending members** | ❌ | ✅ | ✅ |
| **View all member data** | ❌ | ✅ | ✅ |
| **View analytics dashboard** | ❌ | ✅ | ✅ |
| **Export member CSV** | ❌ | ✅ | ✅ |
| **Create/edit meeting minutes** | ❌ | ✅ | ✅ |
| **Broadcast notifications** | ❌ | ✅ | ✅ |
| **View contact inbox** | ❌ | ✅ | ✅ |
| **Manage documents (delete, toggle public)** | ❌ | ✅ | ✅ |
| **Ban members** | ❌ | ❌ | ✅ |
| **Assign BOD role + position** | ❌ | ❌ | ✅ |
| **Assign admin role** | ❌ | ❌ | ✅ |
| **Demote BOD to member** | ❌ | ❌ | ✅ |
| **Create CTF challenges** | ❌ | ❌ | ✅ |
| **Edit CTF challenges** | ❌ | ❌ | ✅ |
| **Activate/deactivate CTF** | ❌ | ❌ | ✅ |
| **Manual point adjustments** | ❌ | ❌ | ✅ |
| **Edit site settings** | ❌ | ❌ | ✅ |
| **Delete meeting minutes** | ❌ | ❌ | ✅ |
| **Export PDF reports** | ❌ | ❌ | ✅ |
| **View full audit logs** | ❌ | ❌ | ✅ |
| **Permanently delete member** | ❌ | ❌ | ✅ |

---

## 20. COMPLETE API ROUTE LIST

### Public Routes
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/contact` | Rate-limited contact form |

### Auth Routes
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Complete profile (trigger created row) |

### Member Routes (approved only)
| Method | Route | Description |
|---|---|---|
| `PATCH` | `/api/members/profile` | Update own profile |
| `GET` | `/api/members/[id]` | View member profile |
| `GET` | `/api/posts` | Paginated feed |
| `POST` | `/api/posts` | Create post/resource/project |
| `PATCH` | `/api/posts/[id]` | Edit own post (24h) |
| `DELETE` | `/api/posts/[id]` | Delete own post |
| `POST` | `/api/posts/[id]/react` | Toggle reaction |
| `GET` | `/api/posts/[id]/comments` | Get comments |
| `POST` | `/api/posts/[id]/comments` | Add comment |
| `DELETE` | `/api/posts/[id]/comments/[cid]` | Delete own comment |
| `GET` | `/api/ctf` | List active challenges (no flag_hash) |
| `GET` | `/api/ctf/[id]` | Challenge detail (no flag_hash) |
| `POST` | `/api/ctf/submit` | Submit flag (rate-limited) |
| `GET` | `/api/leaderboard` | Paginated leaderboard |
| `GET` | `/api/events` | Paginated published events |
| `GET` | `/api/events/[id]` | Event detail + RSVPs |
| `POST` | `/api/events/[id]/rsvp` | Toggle RSVP |
| `GET` | `/api/documents` | Paginated document list |
| `GET` | `/api/documents/[id]/download` | Signed URL download |
| `POST` | `/api/documents` | Upload document metadata |
| `GET` | `/api/messages` | List conversations |
| `POST` | `/api/messages` | Start conversation |
| `GET` | `/api/messages/[id]` | Fetch messages |
| `POST` | `/api/messages/[id]` | Send message |
| `DELETE` | `/api/messages/[id]/[msgId]` | Soft delete own message |
| `GET` | `/api/notifications` | List notifications |
| `PATCH` | `/api/notifications` | Mark read/all-read |
| `POST` | `/api/upload` | Get signed upload URL |

### BOD Routes (bod + admin)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/bod/members` | All members with full data |
| `PATCH` | `/api/bod/members/[id]/status` | Approve or reject |
| `POST` | `/api/bod/posts/announcement` | Create announcement |
| `PATCH` | `/api/bod/posts/[id]/pin` | Pin/unpin post |
| `DELETE` | `/api/bod/posts/[id]` | Delete any post |
| `DELETE` | `/api/bod/posts/[id]/comments/[cid]` | Delete any comment |
| `POST` | `/api/bod/events` | Create event |
| `PATCH` | `/api/bod/events/[id]` | Edit event |
| `DELETE` | `/api/bod/events/[id]` | Delete event |
| `PATCH` | `/api/bod/events/[id]/publish` | Toggle publish |
| `GET` | `/api/bod/analytics` | Analytics data |
| `POST` | `/api/bod/broadcast` | Send notification to all |
| `GET` | `/api/bod/contact` | View contact submissions |
| `PATCH` | `/api/bod/contact/[id]` | Mark contact read |
| `GET` | `/api/bod/export/members` | CSV export |
| `GET` | `/api/bod/meetings` | List meeting minutes |
| `POST` | `/api/bod/meetings` | Create meeting minutes |
| `GET` | `/api/bod/meetings/[id]` | View one |
| `PATCH` | `/api/bod/meetings/[id]` | Edit minutes |
| `PATCH` | `/api/bod/meetings/[id]/publish` | Toggle published |

### Admin Routes (admin only)
| Method | Route | Description |
|---|---|---|
| `PATCH` | `/api/admin/members/[id]/ban` | Ban with reason |
| `PATCH` | `/api/admin/members/[id]/role` | Assign role + club_post |
| `PATCH` | `/api/admin/members/[id]/points` | Manual point adjustment |
| `DELETE` | `/api/admin/members/[id]` | Permanent delete |
| `POST` | `/api/admin/ctf` | Create CTF challenge |
| `PATCH` | `/api/admin/ctf/[id]` | Edit CTF challenge |
| `DELETE` | `/api/admin/ctf/[id]` | Delete CTF challenge |
| `PATCH` | `/api/admin/ctf/[id]/activate` | Toggle is_active |
| `GET` | `/api/admin/audit` | Paginated audit logs |
| `PATCH` | `/api/admin/settings` | Edit site_settings |
| `GET` | `/api/admin/export/report` | PDF report |
| `DELETE` | `/api/admin/meetings/[id]` | Delete meeting minutes |

---

## 21. ALL EMAIL TRIGGERS

All sent via Resend. `from`: `"ICEHC — IIMS College <icehc@iimscollege.edu.np>"`
All emails: Navy `#1A237E` header with ICEHC + IIMS logo. Crimson `#E53935` CTA buttons.

| Trigger Event | Email Template | To | Subject |
|---|---|---|---|
| Magic link request | Magic Link | Requester | `[ICEHC] Your secure login link` |
| Member approved | Welcome | New member | `Welcome to ICEHC! You're in. 🏴` |
| Member rejected | Rejection | Applicant | `Your ICEHC application — update` |
| Member banned | Ban Notice | Banned member | `Your ICEHC account has been suspended` |
| New pending member | Admin Alert | All BOD + Admin | `[Action Required] New member application` |
| New CTF challenge activated | Challenge Alert | All approved members (via notification, not email) | — |
| Event reminder | Reminder | All 'going' RSVPs | `Reminder: [Event Name] is tomorrow!` |
| Contact form submitted | Confirmation | Form submitter | `We received your message — ICEHC` |
| Contact form received | Alert | BOD contact email | `[New Message] Contact form submission` |

---

## 22. ERROR HANDLING STANDARDS

Every API route must handle errors consistently:

```typescript
// Standard error response shape
type APIError = {
  error: string           // human-readable message
  code?: string           // machine-readable code (optional)
  details?: unknown       // Zod errors or DB details (optional)
}

// HTTP status codes:
// 400 — Bad Request (Zod validation failure, invalid input)
// 401 — Unauthenticated (no session)
// 403 — Forbidden (wrong role, not participant, etc.)
// 404 — Not Found
// 409 — Conflict (already solved, duplicate, at capacity)
// 429 — Too Many Requests (rate limit hit)
// 500 — Internal Server Error (unexpected DB/network error)

// Standard try/catch wrapper for every route:
export async function POST(req: NextRequest) {
  try {
    const member = await assertMember()
    // ... logic
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'UNAUTHENTICATED') return NextResponse.json({ error: 'Login required.' }, { status: 401 })
      if (err.message === 'NOT_APPROVED') return NextResponse.json({ error: 'Account not approved.' }, { status: 403 })
      if (err.message === 'INSUFFICIENT_ROLE') return NextResponse.json({ error: 'Access denied.' }, { status: 403 })
      if (err.message === 'MEMBER_NOT_FOUND') return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    }
    // Log to audit_logs or console.error in dev
    console.error('[API Error]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
```

---

## SEEDING INITIAL DATA (Founding BOD Members)

After deploying, run this to pre-seed the 9 founding members as BOD. They still need to register via magic link first — this just updates their roles once they register.

```sql
-- Run AFTER founding members have completed registration
-- Replace student IDs with actual values from registration

-- Set Sujal as admin (or BOD — your choice)
UPDATE members SET role = 'admin', club_post = 'President'
  WHERE student_id = 'IIMS-2082-0490';

-- Set remaining founding BOD
UPDATE members SET role = 'bod', club_post = 'Vice President'
  WHERE student_id = 'IIMS-2082-0420';
UPDATE members SET role = 'bod', club_post = 'Secretary'
  WHERE student_id = 'IIMS-2082-0429';
UPDATE members SET role = 'bod', club_post = 'Joint Secretary'
  WHERE student_id = 'IIMS-2082-0358';
UPDATE members SET role = 'bod', club_post = 'Treasurer'
  WHERE student_id = 'IIMS-2082-0279';
UPDATE members SET role = 'bod', club_post = 'Event & Activities Coordinator'
  WHERE student_id = 'IIMS-2082-0388';
UPDATE members SET role = 'bod', club_post = 'Marketing & Communication Lead'
  WHERE student_id = 'IIMS-2082-0339';
UPDATE members SET role = 'bod', club_post = 'Logistics & Operations Lead'
  WHERE student_id = 'IIMS-2082-0357';
UPDATE members SET role = 'bod', club_post = 'Executive Head'
  WHERE student_id = 'IIMS-2082-0386';

-- Optional: Also approve them immediately (skip the pending queue)
UPDATE members SET status = 'approved', approved_at = now()
  WHERE student_id IN (
    'IIMS-2082-0490', 'IIMS-2082-0386', 'IIMS-2082-0388',
    'IIMS-2082-0279', 'IIMS-2082-0420', 'IIMS-2082-0429',
    'IIMS-2082-0357', 'IIMS-2082-0339', 'IIMS-2082-0358'
  );
```

---

*BACKEND LOGIC PROMPT v1.0 — ICEHC Portal. Feed after CONTEXT.md + AGENT_PROMPT.md.*
*Covers: three-role system (member/BOD/admin), all backend flows, updated SQL, RLS, middleware, and API routes.*
*Founding club: IIMS Cybersecurity & Ethical Hacking Club (ICEHC), IIMS College, Kathmandu, Nepal, 2026.*
