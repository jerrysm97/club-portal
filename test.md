AUTONOMOUS TEST PLAN
v2.0 — WITH SUPERADMIN & POST-BASED ACCESS
Self-Healing Loop: Find → Fix → Retest → Harden
IIMS Cybersecurity & Ethical Hacking Club (ICEHC)  ·  IIMS College, Kathmandu, Nepal  ·  2026


THE CORE LOOP
Read this first — the agent never skips a phase

AUTONOMOUS TEST LOOP — ICEHC PORTAL

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PHASE 1   │────▶│   PHASE 2   │────▶│   PHASE 3   │
│    SCAN     │     │     DB      │     │  SECURITY   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PHASE 6   │◀────│   PHASE 5   │◀────│   PHASE 4   │
│  INTEGRATE  │     │   UI/BRAND  │     │  FEATURES   │
└─────────────┘     └─────────────┘     └─────────────┘
       │
┌─────────────────────────────────────────────────────┐
│  All phases green → PHASE 7 HARDENING               │
│  Any failure → TRIAGE → FIX → RETEST               │
│  EXIT: 0 failures + Phase 7 passed                 │
└─────────────────────────────────────────────────────┘

AGENT OPERATING RULES — NON-NEGOTIABLE
•	The agent NEVER skips a phase or marks a test passing unless it actually passes
•	When a fix is applied, the ENTIRE affected phase reruns — not just the fixed test
•	Loop runs until every single test in every phase is green — zero exceptions
•	P0 bugs HALT everything else and are fixed immediately before any other work
•	EXIT condition: 0 failures across all phases + Phase 7 passed


PHASE 1 — STATIC SCAN
Run before starting any server. Fix ALL failures before Phase 2.

1A. TypeScript Strict Check
Run: npx tsc --noEmit --strict 2>&1 | tee /tmp/icehc-tsc.log
PASS: 0 errors. FAIL action: Fix every type error before proceeding.

1B. Forbidden Pattern Scan — ALL 13 checks must be 0

Check ID	Description	Command Pattern	Expected
1B.1	No console.log in app code	grep -rn 'console\.' --include='*.ts' ./app ./lib	0 matches
1B.2	No TypeScript 'any'	grep -rn ': any\b' --include='*.ts' ./app	0 matches
1B.3	No select('*')	grep -rn ".select('*')" --include='*.ts' ./app	0 matches
1B.4	[P0] flag_hash not in portal pages	grep -rn 'flag_hash' ./app/portal	0 matches
1B.5	[P0] Service role key not NEXT_PUBLIC	grep -rn 'NEXT_PUBLIC.*SERVICE_ROLE' .	0 matches
1B.6	No window.alert/confirm	grep -rn 'window\.alert' ./app	0 matches
1B.7	No raw <img> tags	grep -rn '<img ' --include='*.tsx' ./app	0 matches
1B.8	No .js/.jsx files	find ./app ./lib -name '*.js'	0 files
1B.9	[P0] Auth uses user_id not id	grep -rn ".eq('id', session" ./app/api	0 matches
1B.10	Flag format is ICEHC not IIMS	grep -rn 'IIMS{' --include='*.ts' ./app	0 matches
1B.11	superadmin role IS allowed (updated)	grep -rn 'superadmin' ./lib/auth.ts	>0 — expected
1B.12	Email is icehc@ not itclub@	grep -rn 'itclub@iimscollege' ./app	0 matches
1B.13	server-only in all server libs	grep 'server-only' lib/auth.ts lib/supabase-server.ts	Found in all

NOTE on 1B.11 (Updated from v1.0): The old test plan prohibited 'superadmin' references. Now that the superadmin role is implemented, this check is INVERTED — the agent should verify the role IS properly referenced in auth.ts, not prohibited.

1C. Admin Routes — assertRole First Check
Verify assertRole is the first call in all /api/admin/* and /api/bod/* route.ts files. Any route where business logic precedes the auth check is a P0 bug.

1D. Environment Variables
Variable	Required Value / Pattern	Status
NEXT_PUBLIC_SUPABASE_URL	https://*.supabase.co	☐ Check
NEXT_PUBLIC_SUPABASE_ANON_KEY	Any non-empty string	☐ Check
SUPABASE_SERVICE_ROLE_KEY	Non-empty, NOT NEXT_PUBLIC prefixed	☐ Check
RESEND_API_KEY	re_**** format	☐ Check
RESEND_FROM_EMAIL	Must contain icehc@ not itclub@	☐ Check
UPSTASH_REDIS_REST_URL	https://*.upstash.io	☐ Check
UPSTASH_REDIS_REST_TOKEN	Any non-empty string	☐ Check
NEXT_PUBLIC_SITE_URL	https://icehc.iimscollege.edu.np or localhost	☐ Check


PHASE 2 — DATABASE & INFRASTRUCTURE
Run each SQL block in the Supabase SQL Editor

2A. Schema Completeness

-- 2A.1: All 18 required tables exist (expected: 18)
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public'
AND table_name IN ('members','posts','post_reactions','post_comments',
  'conversations','conversation_participants','messages','notifications',
  'documents','public_events','event_rsvps','ctf_challenges','ctf_solves',
  'gallery_images','contact_messages','audit_logs','site_settings','meeting_minutes');

-- 2A.2: Role CHECK now includes 'superadmin' (UPDATED from v1.0)
SELECT pg_get_constraintdef(oid) FROM pg_constraint
WHERE conname = 'members_role_check' AND conrelid = 'members'::regclass;
-- EXPECTED: contains 'member','bod','admin','superadmin'

-- 2A.3: club_post includes all ICEHC positions
SELECT pg_get_constraintdef(oid) FROM pg_constraint
WHERE conname = 'members_club_post_check' AND conrelid = 'members'::regclass;
-- EXPECTED: President, Vice President, Secretary, Treasurer, etc.

-- 2A.4: flag_hash is 64 chars (SHA-256 hex)
SELECT character_maximum_length FROM information_schema.columns
WHERE table_name = 'ctf_challenges' AND column_name = 'flag_hash';
-- EXPECTED: 64

-- 2A.5: Skill endorsements table exists (NEW — from missing features)
SELECT COUNT(*) FROM information_schema.tables
WHERE table_name = 'skill_endorsements' AND table_schema = 'public';
-- EXPECTED: 1

2B. RLS on All Tables
Every table must have Row Level Security enabled. EXPECTED: 0 rows returned (none without RLS).

2C. Trigger Functional Test
Run the atomic CTF solve trigger test. EXPECTED: 'PASS: trigger fired' with points added exactly once and notification created.

2D. Superadmin Role in DB (NEW — Phase 2 addition)

Check	SQL	Expected
Superadmin role valid	SELECT role FROM members WHERE role='superadmin' LIMIT 1	Returns row (if seeded) OR no error
Superadmin RLS policy exists	SELECT COUNT(*) FROM pg_policies WHERE policyname LIKE '%superadmin%'	>= 2 policies
Superadmin can see all members	Run as superadmin session: SELECT COUNT(*) FROM members	All member count (not just approved)
Admin CANNOT assign superadmin via PATCH	PATCH /api/admin/members/[id]/role body: {role:'superadmin'}	403 Forbidden


PHASE 3 — SECURITY ATTACK SUITE
Every correct result is REJECTION. P0 = halt immediately.

3A. Authentication Bypass (6 attacks)

Attack ID	Attack Description	Method	Expected
ATTACK-01	No session → portal redirect	GET /portal/dashboard (no cookie)	307 → /portal/login
ATTACK-02	Pending member → pending screen	GET /portal/dashboard (pending cookie)	307 → /portal/pending
ATTACK-03	Banned member → cookies cleared	GET /portal/dashboard (banned cookie)	307 + sb-* Max-Age=0
ATTACK-04	Member → admin page blocked	GET /portal/admin (member cookie)	307 → /portal/dashboard
ATTACK-05	Member → BOD page blocked	GET /portal/bod/approvals (member cookie)	307 → /portal/dashboard
ATTACK-06	Tampered JWT rejected	GET /portal/dashboard (tampered token)	307 → /portal/login

3B. Privilege Escalation (10 attacks — updated for superadmin)

Attack ID	Attack Description	Expected HTTP	Severity
ATTACK-07	New member self-assigns President via registration body	400 or 200 but club_post=General Member	P0
ATTACK-08	Member calls admin ban endpoint	403 Forbidden	P0
ATTACK-09	BOD calls admin ban endpoint	403 Forbidden	P0
ATTACK-10	BOD promotes self to admin	403 Forbidden	P0
ATTACK-11	Member updates own points via profile	200 but points unchanged	P0
ATTACK-12	Anon client direct role update via Supabase	Error / DB rejects	P0
ATTACK-13 NEW	Admin tries to assign role=superadmin	403 Forbidden	P0
ATTACK-14 NEW	President (BOD) tries to assign President position to another	403 Forbidden	P0
ATTACK-15 NEW	Admin tries to assign role=superadmin via API	403 Forbidden	P0
ATTACK-16 NEW	Member tries to self-assign superadmin via profile PATCH	403, role unchanged	P0

3C. CTF Flag Security (P0 — Any Failure = Critical Incident)

Attack ID	Description	Expected Result
ATTACK-17	Anon client requests flag_hash column	0 rows or flag_hash undefined in response
ATTACK-18	Authenticated member requests flag_hash	flag_hash undefined in response
ATTACK-19	Wrong flag response must NOT leak hash	Response: {correct: false} ONLY
ATTACK-20	Race condition — 10 simultaneous correct submissions	Points added exactly ONCE
ATTACK-21	Timing oracle — wrong flag must take ≥50ms	Response time ≥ 50ms always
ATTACK-22	SQL injection in flag field	400 or 200 {correct:false}, never 500

3D. Rate Limiter Tests

Attack ID	Endpoint	Limit	Test	Pass Condition
ATTACK-23	/api/ctf/submit	10/min/IP	Send 15 requests rapidly	≥5 return 429
ATTACK-24	/api/contact	3/hour/IP	Send 5 requests	≥2 return 429
ATTACK-25	/api/auth/register	5/hour/IP	Send 8 requests	≥3 return 429


PHASE 4 — FEATURE FUNCTIONAL TESTS
Verify every feature works for every role

4A. Registration & Approval (F-01 to F-06)

Test ID	Scenario	Verify	Expected
F-01	Magic link endpoint responds	POST /api/auth/magic-link	200 OK
F-02	DB trigger creates pending row	SELECT from members WHERE email=...	status='pending', role='member', club_post='General Member'
F-03	Registration never changes role/status/club_post	PATCH /api/auth/register + DB check	role='member', status='pending'
F-04	BOD approves member	PATCH /api/bod/members/[id]/status	status='approved', notification created
F-05	BOD rejection with reason	PATCH with action:'reject'	status='rejected', reject_reason saved
F-06	Admin ban with audit log	PATCH /api/admin/members/[id]/ban	status='banned', audit_logs row created

4B. Superadmin & Post-Based Access Tests (NEW SECTION — v2.0)

Test ID	Scenario	API Route	Expected
F-SA-01	Superadmin assigns admin role to member	PATCH /api/admin/members/[id]/role body:{role:'admin'}	200, role=admin, audit logged
F-SA-02	Superadmin assigns superadmin role	PATCH /api/admin/members/[id]/role body:{role:'superadmin'}	200, role=superadmin, audit logged
F-SA-03	Admin tries to assign superadmin role	Same endpoint, admin session	403 Forbidden
F-SA-04	President assigns BOD + Secretary	PATCH /api/admin/members/[id]/role (president session)	200, role=bod, club_post=Secretary
F-SA-05	President tries to assign President position	body:{role:'bod', club_post:'President'}	403 Forbidden
F-SA-06	Admin assigns BOD + Treasurer	PATCH /api/admin/members/[id]/role (admin session)	200, role=bod, club_post=Treasurer
F-SA-07	Superadmin demotes superadmin to member	body:{role:'member'}	200, role=member, club_post=General Member
F-SA-08	Superadmin force-logs out admin session	POST /api/admin/members/[id]/force-logout	200, session cleared

4C. CTF Features (F-07 to F-11)

Test ID	Scenario	Expected
F-07	Admin creates challenge → flag stored as SHA-256, NOT raw	flag_hash is 64-char hex, not the raw flag
F-08	Inactive challenge not visible to member	RLS blocks — 0 rows returned
F-09	Active challenge visible, flag_hash still hidden	Challenge data returned, flag_hash key absent
F-10	Correct flag → points added exactly once	points += challenge.points, ctf_solves count = 1
F-11	Leaderboard sorted by points descending	lb[i-1].points >= lb[i].points for all i

4D. Feed, Events, Messaging, Notifications (F-12 to F-27)

Range	Features	Key Checks
F-12 to F-15	Feed CRUD + Reactions	Member cannot create announcements; BOD can; reaction toggles correctly
F-16 to F-17	Events + RSVP + Capacity	Meeting link hidden before RSVP; 409 when at max_attendees
F-18 to F-20	Direct Messaging	Cannot DM self (400); IDOR blocked (403); participant check
F-21 to F-22	Notifications	Broadcast creates N notifications; mark-read works
F-23 to F-24	Documents	Download returns signed URL; unauthenticated = 401
F-25 to F-27	Meeting Minutes	Unpublished = 403 for member; published = 200 for member


PHASE 5 — UI & BRAND COMPLIANCE
Run with Playwright at localhost:3000

5A. IIMS Brand Core Checks (B-01 to B-17)

Check ID	What to Verify	Expected Value / Result
B-01	Navbar background color	rgb(26, 35, 126) = #1A237E
B-02	Primary CTA background color	rgb(229, 57, 53) = #E53935
B-03	Homepage body brightness	Luminance > 200 (light theme)
B-04	Club name is ICEHC not 'IIMS IT Club'	ICEHC present, 'IIMS IT Club' absent
B-05	Tagline present and visible	text='Hack Ethically' AND text='Defend Relentlessly'
B-06	Vision statement on About page	text contains 'premier hub for cybersecurity excellence in Nepal'
B-07	All 4 objectives on About page	All 4 objective names visible
B-08	Footer links to IIMS College	footer a[href='https://iimscollege.edu.np/'] visible
B-09	Taylor's University in footer	footer contains text 'Taylor's University'
B-10	Email is icehc@ not itclub@	/contact contains icehc@iimscollege.edu.np
B-11	Flag format shown as ICEHC{	text='ICEHC{' visible, text='IIMS{' absent
B-12	Sujal Mainali as President	text='Sujal Mainali' AND text='President' both visible
B-13	CTF page is DARK (#0D1117)	Luminance < 30 on /portal/ctf
B-14	Flag input uses JetBrains Mono	fontFamily contains 'JetBrains Mono'
B-15	Dashboard uses LIGHT theme	Luminance > 200 on /portal/dashboard
B-16	No SHA-256 hex in CTF page HTML	Page HTML does not match /[a-f0-9]{64}/
B-17	All images have alt text	Count of img:not([alt]) = 0


PHASE 6 — INTEGRATION & JOURNEY TESTS
Full end-to-end flows across roles

Journey 1: New Member Onboarding (9 steps)

Step	Action	Verify
1	Load homepage /	Tagline visible, ICEHC branding, IIMS navbar
2	Navigate to /portal/login	Login page loads, no portal data leaked
3	Submit email → magic link	200 OK, email sent via Resend
4	Pending state at /portal/pending	Shows profile summary, no portal access
5	BOD approves via /api/bod/members/[id]/status	Status=approved, welcome email sent, notification created
6	Approved member loads /portal/dashboard	Dashboard renders, correct role, greeting shown
7	Navigate to /portal/ctf	Dark theme activates (#0D1117), ICEHC{ flag format shown
8	Back to /portal/feed	Light theme restored, posts visible
9	All 8 steps pass in sequence	Journey 1 COMPLETE

Journey 2: BOD Operational Flow (9 steps)

Step	Action	Verify
1	BOD login to /portal/dashboard	BOD sidebar section visible (Pending Approvals, Events, etc.)
2	View /portal/bod/approvals	Pending member cards shown with approve/reject buttons
3	Approve one member	Status changes, audit log created, email sent
4	Create event at /portal/bod/events	Event appears in published events list
5	Create pinned announcement	Visible in feed with crimson left border, is_pinned=true
6	Send broadcast notification	Notification count matches total approved member count
7	View /portal/bod/analytics	Charts render, member count correct
8	Create unpublished meeting minutes	Member cannot see it (403)
9	Publish minutes	Member can now view (200)

Journey 3: Superadmin Role Assignment Flow (NEW — v2.0)

Step	Action	Verify
1	Superadmin logs in	Superadmin sidebar section visible in addition to Admin + BOD sections
2	Open Members tab, find a member	Manage Designation modal shows all role options including 'superadmin'
3	Assign role=admin to member	200, role updated, audit log with action='role_change'
4	Assign role=bod + 'Treasurer' to another member	200, role=bod, club_post=Treasurer
5	Try to assign role=superadmin as admin	403 Forbidden (switch to admin session first)
6	President assigns BOD role to a member	200, only when club_post != 'President'
7	President tries to assign President position	403 Forbidden
8	Superadmin force-logout an admin session	Admin session cleared, audit logged


PHASE 7 — HARDENING & STRESS TESTS
Run ONCE after first full 0-failure cycle

7A. Load Test (k6)
# k6 load test — public homepage and API
# Thresholds: p95 < 3000ms, error rate < 5%
stages: [ 30s ramp to 20 users | 60s hold | 30s ramp down ]
endpoints: GET / | GET /events | POST /api/ctf/submit (authenticated)

7B. Database Performance (EXPLAIN ANALYZE)
All critical queries must use indexes. Execution time targets:
•	Leaderboard query (members by points): < 100ms
•	Notifications for recipient: < 10ms
•	CTF challenges list (active): < 50ms

7C. Signed URL Expiry
Generate a 1-second signed URL for a club-document. Wait 3 seconds. Verify URL returns 400 or 401 (not 200).

7D. Email Delivery
Send a test email via Resend API using icehc@iimscollege.edu.np. Verify the response contains a valid email ID.


TRIAGE PROTOCOL — When a Failure is Found
Execute before writing any fix

Severity Classification

Severity	Definition	Action
P0 — Critical	Security (auth bypass, flag leak, privilege escalation, race condition)	HALT all work. Fix immediately. Retest entire Phase 3.
P1 — High	Data integrity (wrong data written), broken core feature (auth, CTF, DMs)	Fix before P2/P3. Retest affected phase.
P2 — Medium	Broken secondary feature (analytics, export, meeting minutes)	Fix in priority order. Retest feature suite.
P3 — Low	UI/Brand/Copy mismatch, cosmetic issues	Fix in order. Retest Phase 5.

Fix Protocol (5 Steps)
•	1. MINIMAL DIFF — change only what's wrong, no unrelated refactors
•	2. VERIFY RULES — fix must not introduce: any types, select('*'), wrong auth field, missing server-only, wrong flag format
•	3. WRITE THE FIX — apply code change
•	4. WRITE/UPDATE TEST — every fix must have a test that catches regression
•	5. VERIFY — specific test → PASS → full phase suite → PASS → Phase 1 → still 0 failures

Retest Protocol (Always in This Order)
•	1. Specific failing test → MUST PASS
•	2. Full phase suite for affected area (security bug → all of Phase 3; DB bug → all of Phase 2)
•	3. Phase 1 static scan → still 0 failures
•	4. If all pass → bug VERIFIED FIXED → increment TOTAL_BUGS_FIXED
•	5. If new failure appears → new Bug Record → fix → repeat
•	6. Only when ALL tests pass → CYCLE_NUMBER++ → restart from Phase 1


EXIT CHECKLIST — PORTAL VERIFIED FOR DEPLOYMENT
Every box must be checked before deploy

Phase 1 — Static Scan
☐  TypeScript: 0 errors (strict mode)
☐  No console.log in app code
☐  No 'any' types
☐  No .select('*') calls
☐  No flag_hash in portal page files
☐  Service role key not NEXT_PUBLIC
☐  All server libs have import 'server-only'
☐  assertRole is first line in all admin/bod routes
☐  Auth checks use user_id not id
☐  Flag format is ICEHC{ not IIMS{
☐  Email is icehc@ not itclub@
☐  superadmin role referenced correctly in lib/auth.ts

Phase 2 — Database
☐  18 tables exist
☐  RLS on all 18 tables
☐  Both triggers active (ctf_solve + auth_user_created)
☐  Role CHECK: member/bod/admin/superadmin all valid
☐  club_post CHECK: all ICEHC positions valid
☐  flag_hash column = 64 chars
☐  club-documents + ctf-files buckets are PRIVATE
☐  10 critical indexes exist
☐  site_settings has correct ICEHC values (flag_format=ICEHC{...})
☐  Trigger test: points atomic, notification created exactly once
☐  skill_endorsements table exists with RLS (NEW)
☐  Superadmin RLS policies exist (NEW)

Phase 3 — Security
☐  6 auth bypass attacks all blocked
☐  10 privilege escalation attacks all blocked (includes 4 superadmin attacks)
☐  6 CTF flag security attacks all blocked (P0)
☐  3 rate limiter attacks all fire correctly
☐  Admin cannot assign superadmin role (NEW P0)
☐  President cannot assign President position (NEW P0)

Phase 4 — Features
☐  F-01 to F-06: Registration & Approval flow
☐  F-SA-01 to F-SA-08: Superadmin & post-based access tests (NEW)
☐  F-07 to F-11: CTF Create, Activate, Solve, Points
☐  F-12 to F-15: Feed CRUD + Reactions
☐  F-16 to F-17: Events + RSVP + Capacity
☐  F-18 to F-20: Messaging
☐  F-21 to F-22: Notifications
☐  F-23 to F-24: Documents
☐  F-25 to F-27: Meeting Minutes

Phase 5 — UI & Brand
☐  B-01 through B-17 all pass

Phase 6 — Integration Journeys
☐  Journey 1: Member onboarding complete
☐  Journey 2: BOD operational flow complete
☐  Journey 3: Superadmin role assignment flow complete (NEW)

Phase 7 — Hardening
☐  Load: p95 < 3s, error rate < 5%
☐  DB queries use indexes (EXPLAIN ANALYZE)
☐  Signed URLs expire after expiry time
☐  Email delivery confirmed via Resend

ZERO OPEN P0 OR P1 BUGS  ·  ALL 7 PHASES GREEN  →  PORTAL IS VERIFIED. SAFE TO DEPLOY.

AUTONOMOUS TEST PLAN v2.0  ·  ICEHC Portal  ·  Loop: Find → Fix → Retest → Harden  ·  Run until 0 failures, then Phase 7  ·  IIMS College, Kathmandu, Nepal 2026
