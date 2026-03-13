-- 1.9 — Créer les buckets Supabase Storage pour les formations
-- Appliquer via Supabase SQL Editor

-- ============================================================
-- Créer les buckets privés
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('formation-videos', 'formation-videos', false, 2147483648, -- 2GB max
    ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']),
  ('formation-pdfs', 'formation-pdfs', false, 52428800, -- 50MB max
    ARRAY['application/pdf']),
  ('certificates', 'certificates', false, 10485760, -- 10MB max
    ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Policies Storage : formation-videos
-- ============================================================

-- Instructeurs peuvent uploader dans leurs propres dossiers
CREATE POLICY "instructor_upload_videos" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'formation-videos'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "InstructeurProfile"
      WHERE "userId" = auth.uid()::text AND "status" = 'APPROUVE'
    )
  );

-- Instructeurs peuvent supprimer leurs propres vidéos
CREATE POLICY "instructor_delete_videos" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'formation-videos'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

-- Apprenants inscrits peuvent lire les vidéos de leurs formations
CREATE POLICY "enrolled_read_videos" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'formation-videos'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "Enrollment" e
      JOIN "Formation" f ON f.id = e."formationId"
      WHERE e."userId" = auth.uid()::text
        AND f."instructeurId" = (storage.foldername(name))[1]
    )
  );

-- Admin accès total vidéos
CREATE POLICY "admin_all_videos" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'formation-videos'
    AND EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- Policies Storage : formation-pdfs
-- ============================================================

CREATE POLICY "instructor_upload_pdfs" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'formation-pdfs'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "InstructeurProfile"
      WHERE "userId" = auth.uid()::text AND "status" = 'APPROUVE'
    )
  );

CREATE POLICY "instructor_delete_pdfs" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'formation-pdfs'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "enrolled_read_pdfs" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'formation-pdfs'
    AND auth.uid() IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM "Enrollment" e
      JOIN "Formation" f ON f.id = e."formationId"
      WHERE e."userId" = auth.uid()::text
        AND f."instructeurId" = (storage.foldername(name))[1]
    )
  );

CREATE POLICY "admin_all_pdfs" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'formation-pdfs'
    AND EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- Policies Storage : certificates
-- ============================================================

-- Seul le serveur (service_role) génère et uploade les certificats
-- Les apprenants ne peuvent que lire leurs propres certificats

CREATE POLICY "own_read_certificates" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'certificates'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "admin_all_certificates" ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'certificates'
    AND EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );
