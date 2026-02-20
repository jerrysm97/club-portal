ICEHC PORTAL
MISSING FEATURES SPECIFICATION
Superadmin Role  ·  Post-Based Access Control  ·  DB & Logic Plan
IIMS Cybersecurity & Ethical Hacking Club (ICEHC)  |  IIMS College, Kathmandu, Nepal


1. OVERVIEW — WHAT'S MISSING
Three gaps identified in the current implementation

The ICEHC portal currently implements three roles: member, BOD, and admin. After review, three critical gaps remain unaddressed:

•	Superadmin role — a tier above admin with god-level privileges (needed for technical oversight without interfering with club governance)
•	Post-based access — the President and superadmin can assign BOD positions and post-holders; currently only admin can do this
•	General member management improvements — clearer member lifecycle, better self-service profile capabilities

⚠  These features are logically separate from the BOD governance flow. Superadmin is a TECHNICAL role. President is a CLUB GOVERNANCE role. They have different permissions for different reasons.

2. SUPERADMIN ROLE — DESIGN
Higher than admin; technical oversight tier

2.1  Why Superadmin?
The existing 'admin' role was designed for faculty advisors and club technical admins. However, there is a need for a root-level user who:
•	Can manage admin accounts themselves (create, demote, reset)
•	Can override any club decision in emergencies (e.g., banned admin account)
•	Has read access to all system internals including encrypted fields, full audit trail
•	Cannot be demoted by any other role — only another superadmin or self-demotion
•	Is NOT a BOD member — this is a purely technical/system role

2.2  Role Hierarchy (Updated)

Tier	Role Value	Description	Who Holds It
0 — Base	member	Approved IIMS student. Full portal access.	All 200+ regular members
1 — Club Ops	bod	Board of Directors. Member management, events, content.	9 founding BOD positions
2 — System Admin	admin	Full admin access. CTF, bans, settings, points.	Faculty advisor + 1-2 technical admins
3 — Root	superadmin	God-mode. Manages admins, emergency overrides, system audits.	1–2 people max (Sujal + faculty)

2.3  DB Changes Required

members table — role CHECK constraint update
ALTER TABLE members DROP CONSTRAINT members_role_check;
ALTER TABLE members ADD CONSTRAINT members_role_check
  CHECK (role IN ('member', 'bod', 'admin', 'superadmin'));

New superadmin_sessions table (optional hardening)
CREATE TABLE superadmin_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_seen  timestamptz DEFAULT now()
);

Audit log — add superadmin action types
-- New action values to support in audit_logs.action:
-- 'superadmin_promote'   — someone made superadmin
-- 'superadmin_demote'    — superadmin removed
-- 'admin_force_logout'   — superadmin forced admin signout
-- 'emergency_override'   — superadmin overrode a decision

2.4  Auth Library Changes — lib/auth.ts

Update role hierarchy constant
const ROLE_HIERARCHY: Record<Role, number> = {
  member:     0,
  bod:        1,
  admin:      2,
  superadmin: 3,   // ← NEW
};

Add assertSuperadmin() wrapper
export async function assertSuperadmin() {
  return assertRole('superadmin');
}

Update assertSuperadminOrPresident() (already exists — update logic)
export async function assertSuperadminOrPresident() {
  const member = await assertRole('member');
  const isSuperadmin = member.role === 'superadmin';
  const isPresident  = member.role === 'admin' && member.club_post === 'President';
  const isBODPresident = member.role === 'bod' && member.club_post === 'President';
  if (!isSuperadmin && !isPresident && !isBODPresident) {
    throw new Error('INSUFFICIENT_ROLE');
  }
  return member;
}

2.5  What Superadmin Can Do (Beyond Admin)

Feature / Action	Member	BOD	Admin	Superadmin	President
Approve / reject members	❌	✅	✅	✅	✅
Ban members	❌	❌	✅	✅	✅
Assign BOD role + position	❌	❌	✅	✅	✅
Assign admin role	❌	❌	❌	✅	❌
Assign superadmin role	❌	❌	❌	✅	❌
Demote superadmin	❌	❌	❌	✅	❌
Force-logout any session	❌	❌	❌	✅	❌
View superadmin audit trail	❌	❌	❌	✅	❌
Override ban (un-ban with reason)	❌	❌	❌	✅	❌
Edit any site setting	❌	❌	✅	✅	❌
Delete member permanently	❌	❌	✅	✅	❌
Create CTF challenges	❌	❌	✅	✅	❌
Manual point adjustment	❌	❌	✅	✅	❌
Assign BOD positions (post holders)	❌	❌	✅	✅	✅
Create/remove President	❌	❌	❌	✅	❌

3. POST-BASED ACCESS CONTROL
President and Superadmin can manage BOD designations

3.1  The Core Concept
'Post-based access' means that certain permissions derive from club_post (position), not just role. Specifically:

•	The President (club_post = 'President') should be able to assign BOD positions to members — this is a governance power, not a system admin power
•	The superadmin retains the same power as a safety net
•	Regular admin and BOD cannot do this — this prevents a random admin from reshuffling the committee

⚠  This distinction matters: the President is a CLUB role. The admin is a SYSTEM role. Mixing them causes governance confusion. The President manages who holds what club position. The admin manages who can access what system feature.

3.2  Who Can Assign What

Action	Superadmin	Admin	President	BOD	Member
Assign role=bod + any BOD position	✅	✅	✅	❌	❌
Assign role=admin	✅	❌	❌	❌	❌
Assign role=superadmin	✅	❌	❌	❌	❌
Change President position	✅	❌	❌	❌	❌
Remove BOD role → member	✅	✅	✅	❌	❌
Change non-President BOD positions	✅	✅	✅	❌	❌
View designation modal (Admin panel)	✅	✅	✅	❌	❌
Approve / reject registrations	✅	✅	✅	✅	❌

3.3  API Changes Required

PATCH /api/admin/members/[id]/role — update authorization
// Current: assertAdmin()
// New: assertSuperadminOrPresidentOrAdmin()

// Additional restriction inside the handler:
if (role === 'admin' || role === 'superadmin') {
  // Only superadmin can assign these roles
  if (caller.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only superadmin can assign admin/superadmin roles.' }, { status: 403 });
  }
}

// President restriction:
if (club_post === 'President') {
  if (caller.role !== 'superadmin') {
    return NextResponse.json({ error: 'Only superadmin can assign the President position.' }, { status: 403 });
  }
}

New helper — assertSuperadminOrPresidentOrAdmin()
export async function assertSuperadminOrPresidentOrAdmin() {
  const member = await assertRole('member');
  const ok = member.role === 'superadmin'
    || member.role === 'admin'
    || (member.role === 'bod' && member.club_post === 'President');
  if (!ok) throw new Error('INSUFFICIENT_ROLE');
  return member;
}

3.4  UI Changes — Admin Panel Members Tab

The Manage Designation modal (already built) needs the following conditional logic:

UI Element	Shown To	Hidden From
'Assign BOD Role' dropdown	Superadmin, Admin, President	BOD, Member
'Assign Position' dropdown (all positions)	Superadmin, Admin, President	BOD, Member
'Assign President' option in position list	Superadmin only	Admin, President, BOD, Member
'Assign Admin Role' option	Superadmin only	Everyone else
'Assign Superadmin Role' option	Superadmin only	Everyone else
Basic approve/reject buttons	Superadmin, Admin, BOD	Member

Code pattern for UI conditional rendering
const canAssignRoles =
  currentUser.role === 'superadmin' ||
  currentUser.role === 'admin' ||
  (currentUser.role === 'bod' && currentUser.club_post === 'President');

const canAssignSuperadmin = currentUser.role === 'superadmin';
const canAssignPresident  = currentUser.role === 'superadmin';

4. GENERAL MEMBER — IMPROVEMENTS
Better member lifecycle, onboarding, and self-service

4.1  Current Member Gaps
•	Members have no way to see their own 'joining date' vs 'approved date' — both should be visible
•	No self-service way to request a role change (member must email BOD manually)
•	Members cannot deactivate/delete their own account (GDPR-style right to erasure)
•	No skill endorsement system — members list skills but nobody can validate them
•	Member 'intake cohort' is visible but not used for any grouping/filtering

4.2  DB Additions for Members

Add deactivation support
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS deactivation_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS deactivation_reason        text CHECK (length(deactivation_reason) <= 500);

-- Status flow with deactivation:
-- pending → approved → (active use) → deactivation_requested
-- Admin reviews → sets status = 'inactive' or rejects deactivation request

Add skill endorsements table
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  endorsed_by  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  skill        text NOT NULL,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (member_id, endorsed_by, skill)  -- one endorsement per skill per person
);

4.3  New API Routes for Members

Method	Route	Description
GET	/api/members/me	Own full profile (includes joined_at, approved_at, points history)
POST	/api/members/deactivate	Request account deactivation (sets flag, notifies BOD)
POST	/api/members/[id]/endorse	Endorse a skill on another member's profile
DELETE	/api/members/[id]/endorse	Remove own endorsement
GET	/api/members/cohort/[intake]	List all members in same intake cohort
GET	/api/members/[id]/activity	Member's public activity (CTF solves, posts count)

5. DB CHANGES — COMPLETE CHECKLIST
Everything that needs to change in Supabase

5.1  Schema Changes

#	Table / Object	Change	Priority	Risk
1	members.role CHECK	Add 'superadmin' to allowed values	P0	Low — additive
2	members	Add deactivation_requested_at + deactivation_reason	P2	Low — nullable cols
3	skill_endorsements (new table)	Create with RLS enabled	P3	Low — new table
4	superadmin_sessions (new table)	Optional hardening — track superadmin logins	P3	Low — new table
5	audit_logs.action	Document new action type strings in comments	P1	None — existing column
6	RLS: members	Superadmin can see ALL columns including sensitive ones	P1	Medium — verify carefully
7	RLS: audit_logs	Superadmin SELECT policy (currently 0 public policies)	P1	Medium — audit exposure

5.2  RLS Changes

Superadmin full read on members
CREATE POLICY 'Superadmin sees all members'
  ON members FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members m
    WHERE m.user_id = auth.uid()
    AND m.role = 'superadmin'
    AND m.status = 'approved'
  ));

Superadmin read on audit_logs
CREATE POLICY 'Superadmin sees all audit logs'
  ON audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM members m
    WHERE m.user_id = auth.uid()
    AND m.role IN ('admin', 'superadmin')
    AND m.status = 'approved'
  ));

5.3  Middleware Update

The middleware needs one additional check for the superadmin route prefix:
// Add to middleware.ts
if (path.startsWith('/portal/superadmin') && member.role !== 'superadmin') {
  return NextResponse.redirect(new URL('/portal/dashboard', request.url));
}

6. IMPLEMENTATION ORDER
What to build first for maximum stability

Step 1 — DB First (30 min)
•	Run the role CHECK constraint ALTER TABLE
•	Create skill_endorsements table
•	Add deactivation columns to members
•	Add superadmin RLS policies
•	Run: npx supabase gen types typescript > types/database.ts

Step 2 — Auth Library (20 min)
•	Update ROLE_HIERARCHY in lib/auth.ts to include superadmin: 3
•	Add assertSuperadmin() wrapper
•	Add assertSuperadminOrPresidentOrAdmin() helper
•	Update assertSuperadminOrPresident() to also match BOD President

Step 3 — API Routes (45 min)
•	Update PATCH /api/admin/members/[id]/role with new permission checks
•	Restrict role=admin and role=superadmin assignment to superadmin only
•	Restrict club_post=President assignment to superadmin only
•	Add POST /api/members/deactivate endpoint
•	Add POST/DELETE /api/members/[id]/endorse endpoints

Step 4 — Admin Panel UI (45 min)
•	Update MembersTab.tsx — conditionally show role assignment UI
•	Update Manage Designation modal — hide President option for non-superadmin
•	Add superadmin-only section in sidebar (below Admin section)
•	Add superadmin audit log view (separate tab or sub-tab)

Step 5 — Member UX (30 min)
•	Add 'Request Account Deactivation' option in profile settings
•	Add skill endorsement buttons on member profile pages
•	Show endorsement count per skill on profile page
•	Show cohort members link on dashboard ('X members in your intake')

Step 6 — Test & Verify (use autonomous test plan)
•	Run Phase 1 static scan — confirm superadmin role string is not flagged
•	Update 1B.11 check to ALLOW 'superadmin' (remove old prohibition)
•	Add new attack tests: member cannot escalate to superadmin
•	Add test: President can assign BOD but NOT assign President or admin
•	Add test: admin cannot assign superadmin role

7. TEST CASES FOR NEW FEATURES
Add these to the autonomous test plan

7.1  Superadmin Tests

Test ID	Attack / Scenario	Expected Result
SA-01	Admin tries to set another user to role=superadmin	403 Forbidden
SA-02	BOD President tries to set role=superadmin	403 Forbidden
SA-03	Member tries to set own role=superadmin via profile API	403, role unchanged
SA-04	Superadmin sets admin to superadmin	200, role updated, audit log created
SA-05	Superadmin demotes superadmin to member	200, role=member, club_post=General Member
SA-06	Superadmin accesses /portal/superadmin route	200, page loads
SA-07	Admin accesses /portal/superadmin route	307, redirect to dashboard
SA-08	Superadmin force-logs out admin	200, admin session cleared, audit logged

7.2  Post-Based Access Tests

Test ID	Attack / Scenario	Expected Result
PB-01	President assigns BOD role + Secretary position to member	200, role=bod, club_post=Secretary, audit logged
PB-02	President tries to assign club_post=President to member	403 Forbidden — only superadmin can
PB-03	President tries to assign role=admin	403 Forbidden
PB-04	Admin assigns BOD role + Treasurer position	200, role=bod, club_post=Treasurer, audit logged
PB-05	Admin tries to assign role=superadmin	403 Forbidden
PB-06	BOD (non-President) tries to assign any role	403 Forbidden
PB-07	President demotes BOD member back to General Member	200, role=member, club_post=General Member
PB-08	Superadmin assigns President position	200, club_post=President, audit logged

7.3  General Member Tests

Test ID	Scenario	Expected Result
GM-01	Member submits deactivation request	200, deactivation_requested_at set, BOD notified
GM-02	Member endorses another member's skill	200, endorsement row created
GM-03	Member tries to endorse own skill	400 Bad Request
GM-04	Member tries to endorse same person's skill twice	409 Conflict (UNIQUE violation)
GM-05	Member views cohort page /api/members/cohort/[intake]	200, list of same-intake members
GM-06	Member views own profile at /api/members/me	200, includes joined_at, approved_at, points, solves

Feed this document to your agent alongside BACKEND_LOGIC_PROMPT.md
ICEHC Portal — Missing Features Plan v1.0  |  IIMS College, Kathmandu, Nepal, 2026

