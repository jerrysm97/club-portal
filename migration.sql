
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

-- PHASE 2 MIGRATIONS --

-- Add new columns to members
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS is_public_profile boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 999;

-- Add new columns to messages
ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS attachment_url text,
  ADD COLUMN IF NOT EXISTS attachment_type text;

-- Add new column to documents
ALTER TABLE documents
  ADD COLUMN IF NOT EXISTS access_level text DEFAULT 'public' CHECK (access_level IN ('public', 'members', 'bod', 'admin'));

-- Cleanup triggers
CREATE OR REPLACE FUNCTION delete_storage_object(bucket_id text, object_path text)
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects WHERE bucket_id = delete_storage_object.bucket_id AND name = delete_storage_object.object_path;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to delete storage object: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION fn_cleanup_document_file() RETURNS TRIGGER AS $$
DECLARE v_object_path text;
BEGIN
  v_object_path := substring(OLD.file_url from 'portal_documents/(.*)$');
  IF v_object_path IS NOT NULL THEN
    PERFORM delete_storage_object('portal_documents', v_object_path);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_cleanup_document ON documents;
CREATE TRIGGER trg_cleanup_document AFTER DELETE ON documents FOR EACH ROW EXECUTE FUNCTION fn_cleanup_document_file();

CREATE OR REPLACE FUNCTION fn_cleanup_message_attachment() RETURNS TRIGGER AS $$
DECLARE v_object_path text;
BEGIN
  IF OLD.attachment_url IS NOT NULL THEN
    v_object_path := substring(OLD.attachment_url from 'portal_documents/(.*)$');
    IF v_object_path IS NOT NULL THEN
      PERFORM delete_storage_object('portal_documents', v_object_path);
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_cleanup_message_attachment ON messages;
CREATE TRIGGER trg_cleanup_message_attachment AFTER DELETE ON messages FOR EACH ROW EXECUTE FUNCTION fn_cleanup_message_attachment();

-- Inject sujalmainali11@gmail.com as anchor Super Admin
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (gen_random_uuid(), 'sujalmainali11@gmail.com', '{"full_name": "Sujal Mainali"}') 
ON CONFLICT (email) DO NOTHING;

UPDATE public.members 
SET 
    role = 'superadmin', 
    club_post = 'President', 
    status = 'approved',
    is_public_profile = true,
    display_order = 1
WHERE email = 'sujalmainali11@gmail.com';
