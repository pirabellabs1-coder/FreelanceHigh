-- 1.12 — Policies RLS Supabase pour les tables formations
-- Appliquer via Supabase SQL Editor
-- Prérequis : RLS activé sur chaque table

-- ============================================================
-- Formation — lecture publique ACTIF, write par instructeur owner
-- ============================================================
ALTER TABLE "Formation" ENABLE ROW LEVEL SECURITY;

-- Lecture publique : seules les formations ACTIF sont visibles
CREATE POLICY "formations_public_read" ON "Formation"
  FOR SELECT
  USING ("status" = 'ACTIF');

-- Lecture par instructeur : ses propres formations (tous statuts)
CREATE POLICY "formations_instructor_read" ON "Formation"
  FOR SELECT
  USING (
    "instructeurId" IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

-- Écriture par instructeur : seulement ses propres formations
CREATE POLICY "formations_instructor_write" ON "Formation"
  FOR ALL
  USING (
    "instructeurId" IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  )
  WITH CHECK (
    "instructeurId" IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

-- Admin : accès total
CREATE POLICY "formations_admin_all" ON "Formation"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- FormationCategory — lecture publique, write admin uniquement
-- ============================================================
ALTER TABLE "FormationCategory" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_read" ON "FormationCategory"
  FOR SELECT
  USING (true);

CREATE POLICY "categories_admin_write" ON "FormationCategory"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- InstructeurProfile — lecture publique des APPROUVE, write par owner
-- ============================================================
ALTER TABLE "InstructeurProfile" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "instructeur_public_read" ON "InstructeurProfile"
  FOR SELECT
  USING ("status" = 'APPROUVE');

CREATE POLICY "instructeur_own_read" ON "InstructeurProfile"
  FOR SELECT
  USING ("userId" = auth.uid()::text);

CREATE POLICY "instructeur_own_write" ON "InstructeurProfile"
  FOR ALL
  USING ("userId" = auth.uid()::text)
  WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "instructeur_admin_all" ON "InstructeurProfile"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- Enrollment — lecture/write par le propriétaire uniquement
-- ============================================================
ALTER TABLE "Enrollment" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "enrollment_own_read" ON "Enrollment"
  FOR SELECT
  USING ("userId" = auth.uid()::text);

CREATE POLICY "enrollment_instructor_read" ON "Enrollment"
  FOR SELECT
  USING (
    "formationId" IN (
      SELECT id FROM "Formation" WHERE "instructeurId" IN (
        SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
      )
    )
  );

CREATE POLICY "enrollment_admin_all" ON "Enrollment"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- Certificate — lecture par owner, vérification publique par code
-- ============================================================
ALTER TABLE "Certificate" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificate_own_read" ON "Certificate"
  FOR SELECT
  USING ("userId" = auth.uid()::text);

CREATE POLICY "certificate_public_verify" ON "Certificate"
  FOR SELECT
  USING ("revokedAt" IS NULL);

CREATE POLICY "certificate_admin_all" ON "Certificate"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- FormationReview — lecture publique, write par auteur
-- ============================================================
ALTER TABLE "FormationReview" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "review_public_read" ON "FormationReview"
  FOR SELECT
  USING (true);

CREATE POLICY "review_own_write" ON "FormationReview"
  FOR ALL
  USING ("userId" = auth.uid()::text)
  WITH CHECK ("userId" = auth.uid()::text);

CREATE POLICY "review_admin_all" ON "FormationReview"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- Section, Lesson, Quiz, Question — lecture publique des formations ACTIF
-- ============================================================
ALTER TABLE "Section" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "section_public_read" ON "Section"
  FOR SELECT
  USING (
    "formationId" IN (SELECT id FROM "Formation" WHERE "status" = 'ACTIF')
    OR "formationId" IN (
      SELECT id FROM "Formation" WHERE "instructeurId" IN (
        SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
      )
    )
  );

CREATE POLICY "section_instructor_write" ON "Section"
  FOR ALL
  USING (
    "formationId" IN (
      SELECT id FROM "Formation" WHERE "instructeurId" IN (
        SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
      )
    )
  );

CREATE POLICY "section_admin_all" ON "Section"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

ALTER TABLE "Lesson" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_public_read" ON "Lesson"
  FOR SELECT
  USING (
    "sectionId" IN (
      SELECT id FROM "Section" WHERE "formationId" IN (
        SELECT id FROM "Formation" WHERE "status" = 'ACTIF'
      )
    )
    OR "sectionId" IN (
      SELECT id FROM "Section" WHERE "formationId" IN (
        SELECT id FROM "Formation" WHERE "instructeurId" IN (
          SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
        )
      )
    )
  );

CREATE POLICY "lesson_instructor_write" ON "Lesson"
  FOR ALL
  USING (
    "sectionId" IN (
      SELECT id FROM "Section" WHERE "formationId" IN (
        SELECT id FROM "Formation" WHERE "instructeurId" IN (
          SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
        )
      )
    )
  );

CREATE POLICY "lesson_admin_all" ON "Lesson"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- CartItem — lecture/write par owner uniquement
-- ============================================================
ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_own" ON "CartItem"
  FOR ALL
  USING ("userId" = auth.uid()::text)
  WITH CHECK ("userId" = auth.uid()::text);

-- ============================================================
-- LessonProgress, LessonNote — via enrollment owner
-- ============================================================
ALTER TABLE "LessonProgress" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_own_read" ON "LessonProgress"
  FOR SELECT
  USING (
    "enrollmentId" IN (
      SELECT id FROM "Enrollment" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "progress_own_write" ON "LessonProgress"
  FOR ALL
  USING (
    "enrollmentId" IN (
      SELECT id FROM "Enrollment" WHERE "userId" = auth.uid()::text
    )
  )
  WITH CHECK (
    "enrollmentId" IN (
      SELECT id FROM "Enrollment" WHERE "userId" = auth.uid()::text
    )
  );

ALTER TABLE "LessonNote" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "note_own" ON "LessonNote"
  FOR ALL
  USING (
    "enrollmentId" IN (
      SELECT id FROM "Enrollment" WHERE "userId" = auth.uid()::text
    )
  )
  WITH CHECK (
    "enrollmentId" IN (
      SELECT id FROM "Enrollment" WHERE "userId" = auth.uid()::text
    )
  );

-- ============================================================
-- PromoCode — lecture publique des codes actifs
-- ============================================================
ALTER TABLE "PromoCode" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "promo_public_read" ON "PromoCode"
  FOR SELECT
  USING ("isActive" = true AND ("expiresAt" IS NULL OR "expiresAt" > now()));

CREATE POLICY "promo_admin_all" ON "PromoCode"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );

-- ============================================================
-- InstructorWithdrawal — lecture par owner instructeur
-- ============================================================
ALTER TABLE "InstructorWithdrawal" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "withdrawal_own_read" ON "InstructorWithdrawal"
  FOR SELECT
  USING (
    "instructeurId" IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "withdrawal_own_create" ON "InstructorWithdrawal"
  FOR INSERT
  WITH CHECK (
    "instructeurId" IN (
      SELECT id FROM "InstructeurProfile" WHERE "userId" = auth.uid()::text
    )
  );

CREATE POLICY "withdrawal_admin_all" ON "InstructorWithdrawal"
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM "User" WHERE id = auth.uid()::text AND role = 'admin'
    )
  );
