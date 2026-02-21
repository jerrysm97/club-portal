-- migration.sql — Document Security & Soft Deletes (v4.1)

-- 1. Upgrade table schema
ALTER TABLE documents 
ADD COLUMN deleted_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN visibility TEXT DEFAULT 'all' CHECK (visibility IN ('all', 'bod_only'));

-- 2. Drop legacy policies (if they exist)
DROP POLICY IF EXISTS "Anyone can view resources" ON documents;
DROP POLICY IF EXISTS "High perms can upload" ON documents;
DROP POLICY IF EXISTS "Authors or Admins can delete" ON documents;

-- 3. Rebuild with Multi-Tier Logic
-- SELECT: Members see 'all', High perms see 'bod_only'. Uploader always sees their own (prevents UPDATE trap).
CREATE POLICY "Strict Read Access" ON documents FOR SELECT
USING (
  (
    deleted_at IS NULL AND (
      visibility = 'all' OR 
      (EXISTS (
        SELECT 1 FROM members 
        WHERE id = auth.uid() 
        AND role IN ('bod', 'president', 'admin', 'superadmin')
      ))
    )
  )
  OR (uploader_id = (SELECT id FROM members WHERE id = auth.uid())) 
  OR (EXISTS (
    SELECT 1 FROM members 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'superadmin')
  ))
);

-- INSERT: BOD and above can upload.
CREATE POLICY "Restricted Uploads" ON documents FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM members 
    WHERE id = auth.uid() 
    AND role IN ('bod', 'president', 'admin', 'superadmin')
  )
);

-- UPDATE: BOD can soft-delete their own. President/Admin can soft-delete anything.
CREATE POLICY "Uploader Soft Delete & Admin Override" ON documents FOR UPDATE
USING (
  (EXISTS (SELECT 1 FROM members WHERE id = auth.uid() AND role = 'bod') AND uploader_id = (SELECT id FROM members WHERE id = auth.uid())) OR
  (EXISTS (SELECT 1 FROM members WHERE id = auth.uid() AND role IN ('president', 'admin', 'superadmin')))
);

-- DELETE: Only President/Admin can hard-delete.
CREATE POLICY "Top Tier Hard Delete" ON documents FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM members 
    WHERE id = auth.uid() 
    AND role IN ('president', 'admin', 'superadmin')
  )
);
