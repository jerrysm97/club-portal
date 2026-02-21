-- =============================================
-- EXTENSIONS
-- =============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_net";

-- =============================================
-- MEMBERS (Combines CONTEXT.md and BACKEND_LOGIC.md rules)
-- =============================================
CREATE TABLE members (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name     text NOT NULL CHECK (length(full_name) BETWEEN 2 AND 100),
  email         text UNIQUE NOT NULL,
  student_id    text UNIQUE CHECK (length(student_id) <= 20),
  program       text CHECK (program IN ('BCS', 'BBUS', 'BIHM', 'MBA', 'Other')),
  intake        text CHECK (length(intake) <= 30),
  phone         text CHECK (phone ~ '^[9][6-9][0-9]{8}$' OR phone IS NULL),
  role          text NOT NULL DEFAULT 'member'
                CHECK (role IN ('member', 'bod', 'admin', 'superadmin')),
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected', 'banned')),
  club_post     text NOT NULL DEFAULT 'General Member'
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
                )),
  bio           text CHECK (length(bio) <= 500),
  avatar_url    text,
  github_url    text CHECK (github_url LIKE 'https://github.com/%' OR github_url IS NULL),
  linkedin_url  text CHECK (linkedin_url LIKE 'https://linkedin.com/%' OR linkedin_url IS NULL),
  skills        text[] DEFAULT '{}',
  points        integer DEFAULT 0 CHECK (points >= 0),
  joined_at     timestamptz DEFAULT now(),
  approved_at   timestamptz,
  approved_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  ban_reason    text,
  reject_reason text,
  is_public_profile boolean DEFAULT false,
  display_order integer DEFAULT 999
);

-- =============================================
-- POSTS (Club Feed)
-- =============================================
CREATE TABLE posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  title       text CHECK (length(title) <= 200),
  content     text NOT NULL CHECK (length(content) BETWEEN 1 AND 10000),
  type        text DEFAULT 'post'
              CHECK (type IN ('post', 'announcement', 'resource', 'project')),
  is_pinned   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- =============================================
-- POST REACTIONS
-- =============================================
CREATE TABLE post_reactions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, member_id)
);

-- =============================================
-- POST COMMENTS
-- =============================================
CREATE TABLE post_comments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content    text NOT NULL CHECK (length(content) BETWEEN 1 AND 2000),
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- DIRECT MESSAGES
-- =============================================
CREATE TABLE conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE conversation_participants (
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  member_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  last_read_at     timestamptz DEFAULT now(),
  PRIMARY KEY (conversation_id, member_id)
);

CREATE TABLE messages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id  uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id        uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  content          text NOT NULL CHECK (length(content) BETWEEN 1 AND 5000),
  attachment_url   text,
  attachment_type  text,
  is_deleted       boolean DEFAULT false,
  created_at       timestamptz DEFAULT now()
);

-- FIND CONVERSATION FUNCTION (from BACKEND_LOGIC.md)
CREATE OR REPLACE FUNCTION find_conversation(member_a uuid, member_b uuid)
RETURNS TABLE(id uuid) AS $$
  SELECT c.id FROM conversations c
  WHERE
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_a)
    AND
    EXISTS (SELECT 1 FROM conversation_participants WHERE conversation_id = c.id AND member_id = member_b)
  LIMIT 1;
$$ LANGUAGE sql STABLE;

-- =============================================
-- NOTIFICATIONS
-- =============================================
CREATE TABLE notifications (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  sender_id    uuid REFERENCES members(id) ON DELETE SET NULL,
  type         text NOT NULL CHECK (type IN (
    'new_message', 'new_post', 'post_reaction', 'post_comment',
    'event_reminder', 'member_approved', 'member_rejected',
    'ctf_new_challenge', 'ctf_solved', 'announcement'
  )),
  title        text NOT NULL CHECK (length(title) <= 200),
  body         text CHECK (length(body) <= 500),
  link         text,
  is_read      boolean DEFAULT false,
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- DOCUMENTS (Club Resources)
-- =============================================
CREATE TABLE documents (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id    uuid NOT NULL REFERENCES members(id) ON DELETE SET NULL,
  title          text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  description    text CHECK (length(description) <= 1000),
  file_url       text NOT NULL,
  file_size      bigint CHECK (file_size > 0 AND file_size <= 52428800),
  file_type      text,
  category       text DEFAULT 'general' CHECK (category IN (
    'general', 'study-material', 'writeup', 'presentation', 'report', 'project', 'other'
  )),
  access_level   text DEFAULT 'public' CHECK (access_level IN ('public', 'members', 'bod', 'admin')),
  download_count integer DEFAULT 0 CHECK (download_count >= 0),
  created_at     timestamptz DEFAULT now()
);

-- =============================================
-- EVENTS
-- =============================================
CREATE TABLE public_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      uuid REFERENCES members(id) ON DELETE SET NULL,
  title           text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  slug            text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description     text NOT NULL,
  short_desc      text CHECK (length(short_desc) <= 200),
  event_date      timestamptz NOT NULL,
  end_date        timestamptz,
  location        text CHECK (length(location) <= 300),
  meeting_link    text,
  cover_image_url text,
  type            text DEFAULT 'workshop' CHECK (type IN (
    'workshop', 'ctf', 'hackathon', 'seminar', 'meetup', 'competition', 'other'
  )),
  max_attendees   integer CHECK (max_attendees > 0),
  is_published    boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  CONSTRAINT end_after_start CHECK (end_date IS NULL OR end_date > event_date)
);

-- =============================================
-- EVENT RSVPs
-- =============================================
CREATE TABLE event_rsvps (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   uuid NOT NULL REFERENCES public_events(id) ON DELETE CASCADE,
  member_id  uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status     text DEFAULT 'going' CHECK (status IN ('going', 'maybe', 'not_going')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- =============================================
-- CTF CHALLENGES
-- =============================================
CREATE TABLE ctf_challenges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by   uuid REFERENCES members(id) ON DELETE SET NULL,
  title        text NOT NULL CHECK (length(title) BETWEEN 2 AND 200),
  description  text NOT NULL,
  category     text NOT NULL CHECK (category IN (
    'web', 'forensics', 'crypto', 'pwn', 'reversing', 'osint', 'misc'
  )),
  difficulty   text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'insane')),
  points       integer NOT NULL CHECK (points > 0 AND points <= 10000),
  flag_hash    text NOT NULL CHECK (length(flag_hash) = 64),
  flag_format  text DEFAULT 'ICEHC{...}',
  hint         text CHECK (length(hint) <= 500),
  file_url     text,
  is_active    boolean DEFAULT false,
  solves_count integer DEFAULT 0 CHECK (solves_count >= 0),
  created_at   timestamptz DEFAULT now()
);

-- =============================================
-- CTF SOLVES
-- =============================================
CREATE TABLE ctf_solves (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES ctf_challenges(id) ON DELETE CASCADE,
  member_id    uuid NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  solved_at    timestamptz DEFAULT now(),
  UNIQUE(challenge_id, member_id)
);

-- =============================================
-- CTF TRIGGER (Updated with BACKEND_LOGIC.md rules)
-- =============================================
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

CREATE TRIGGER trg_ctf_solve
  AFTER INSERT ON ctf_solves
  FOR EACH ROW EXECUTE FUNCTION fn_on_ctf_solve();

-- =============================================
-- AUTH TRIGGER (Updated with BACKEND_LOGIC.md rules)
-- =============================================
CREATE OR REPLACE FUNCTION fn_on_auth_user_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.members (user_id, email, full_name, status, role, club_post)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New Member'), 'pending', 'member', 'General Member')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION fn_on_auth_user_created();

-- =============================================
-- GALLERY
-- =============================================
CREATE TABLE gallery_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_id uuid REFERENCES members(id) ON DELETE SET NULL,
  url         text NOT NULL,
  caption     text CHECK (length(caption) <= 300),
  event_id    uuid REFERENCES public_events(id) ON DELETE SET NULL,
  created_at  timestamptz DEFAULT now()
);

-- =============================================
-- CONTACT MESSAGES
-- =============================================
CREATE TABLE contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL CHECK (length(name) BETWEEN 2 AND 100),
  email      text NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject    text NOT NULL CHECK (length(subject) BETWEEN 5 AND 200),
  message    text NOT NULL CHECK (length(message) BETWEEN 10 AND 3000),
  ip_hash    text,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- AUDIT LOGS
-- =============================================
CREATE TABLE audit_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id   uuid REFERENCES members(id) ON DELETE SET NULL,
  action     text NOT NULL CHECK (length(action) <= 100),
  target_id  text,
  meta       jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- MEETING MINUTES
-- =============================================
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


-- =============================================
-- SITE SETTINGS (Updated with BACKEND_LOGIC.md rules)
-- =============================================
CREATE TABLE site_settings (
  key        text PRIMARY KEY CHECK (key ~ '^[a-z_]+$'),
  value      text NOT NULL,
  updated_by uuid REFERENCES members(id) ON DELETE SET NULL,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('registration_open',  'true'),
  ('site_title',         'ICEHC — IIMS Cybersecurity & Ethical Hacking Club'),
  ('hero_tagline',       'Hack Ethically. Defend Relentlessly.'),
  ('hero_subtext',       'Official Cybersecurity Club of IIMS College, Kathmandu.'),
  ('contact_email',      'icehc@iimscollege.edu.np'),
  ('ctf_enabled',        'true'),
  ('college_url',        'https://iimscollege.edu.np/'),
  ('club_page_url',      'https://iimscollege.edu.np/it-club/'),
  ('ctf_page_url',       'https://iimscollege.edu.np/capture-the-flag/'),
  ('hackathon_url',      'https://iimscollege.edu.np/iims-hackathon/'),
  ('flag_format',        'ICEHC{...}'),
  ('club_short_name',    'ICEHC'),
  ('founding_year',      '2026')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =============================================
-- PERFORMANCE INDEXES
-- =============================================
CREATE INDEX idx_members_user_id       ON members(user_id);
CREATE INDEX idx_members_status        ON members(status);
CREATE INDEX idx_members_role          ON members(role);
CREATE INDEX idx_members_points        ON members(points DESC);
CREATE INDEX idx_posts_created         ON posts(created_at DESC);
CREATE INDEX idx_posts_author          ON posts(author_id);
CREATE INDEX idx_posts_pinned          ON posts(is_pinned DESC, created_at DESC);
CREATE INDEX idx_messages_conv         ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_conv_participants     ON conversation_participants(member_id);
CREATE INDEX idx_notifications_recip   ON notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX idx_events_date           ON public_events(event_date DESC);
CREATE INDEX idx_events_published      ON public_events(is_published, event_date DESC);
CREATE INDEX idx_ctf_active            ON ctf_challenges(is_active);
CREATE INDEX idx_ctf_solves_member     ON ctf_solves(member_id);
CREATE INDEX idx_ctf_solves_challenge  ON ctf_solves(challenge_id);
CREATE INDEX idx_audit_created         ON audit_logs(created_at DESC);
CREATE INDEX idx_documents_category    ON documents(category);

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

-- 5. Unified Storage Cleanup Trigger Functions
CREATE OR REPLACE FUNCTION delete_storage_object(bucket_id text, object_path text)
RETURNS void AS $$
BEGIN
  -- We assume standard Supabase storage configuration. 
  -- Objects are actually recorded in storage.objects, removing them cleans them up for GC.
  DELETE FROM storage.objects WHERE bucket_id = delete_storage_object.bucket_id AND name = delete_storage_object.object_path;
EXCEPTION
  WHEN OTHERS THEN
    -- Suppress errors if storage schema isn't fully linked in this executing context, but log it.
    RAISE NOTICE 'Failed to delete storage object: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION fn_cleanup_document_file()
RETURNS TRIGGER AS $$
DECLARE
  v_bucket_id text := 'portal_documents';
  v_object_path text;
BEGIN
  -- Assuming file_url is something like "https://.../portal_documents/resources/filename.pdf"
  -- We extract the path after "portal_documents/"
  v_object_path := substring(OLD.file_url from 'portal_documents/(.*)$');
  IF v_object_path IS NOT NULL THEN
    PERFORM delete_storage_object(v_bucket_id, v_object_path);
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_cleanup_document
  AFTER DELETE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION fn_cleanup_document_file();

CREATE OR REPLACE FUNCTION fn_cleanup_message_attachment()
RETURNS TRIGGER AS $$
DECLARE
  v_bucket_id text := 'portal_documents';
  v_object_path text;
BEGIN
  IF OLD.attachment_url IS NOT NULL THEN
    v_object_path := substring(OLD.attachment_url from 'portal_documents/(.*)$');
    IF v_object_path IS NOT NULL THEN
      PERFORM delete_storage_object(v_bucket_id, v_object_path);
    END IF;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_cleanup_message_attachment
  AFTER DELETE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION fn_cleanup_message_attachment();


