
-- 1. members additions
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS deactivation_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS deactivation_reason        text CHECK (length(deactivation_reason) <= 500);

-- 2. skill endorsements
CREATE TABLE IF NOT EXISTS skill_endorsements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  endorsed_by  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  skill        text NOT NULL,
  created_at   timestamptz DEFAULT now(),
  UNIQUE (member_id, endorsed_by, skill)
);

ALTER TABLE skill_endorsements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view endorsements"
  ON skill_endorsements FOR SELECT
  USING (true);

CREATE POLICY "Members can endorse others"
  ON skill_endorsements FOR INSERT
  WITH CHECK (auth.uid() = (SELECT user_id FROM members WHERE id = endorsed_by));

CREATE POLICY "Members can delete their endorsements"
  ON skill_endorsements FOR DELETE
  USING (auth.uid() = (SELECT user_id FROM members WHERE id = endorsed_by));

-- 3. superadmin sessions
CREATE TABLE IF NOT EXISTS superadmin_sessions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now(),
  last_seen  timestamptz DEFAULT now()
);

ALTER TABLE superadmin_sessions ENABLE ROW LEVEL SECURITY;

-- 4. New RLS Policies for superadmin
-- Only run if they don't exist yet to prevent errors
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Superadmin sees all members') THEN
    CREATE POLICY "Superadmin sees all members"
      ON members FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM members m
        WHERE m.user_id = auth.uid()
        AND m.role = 'superadmin'
        AND m.status = 'approved'
      ));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Superadmin sees all audit logs') THEN
    CREATE POLICY "Superadmin sees all audit logs"
      ON audit_logs FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM members m
        WHERE m.user_id = auth.uid()
        AND m.role IN ('admin', 'superadmin')
        AND m.status = 'approved'
      ));
  END IF;
END $$;

