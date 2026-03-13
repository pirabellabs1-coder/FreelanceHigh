-- 1.13 — Index GIN search_vector sur Formation pour Postgres FTS bilingue (FR + EN)
-- Appliquer via Supabase SQL Editor ou prisma migrate

-- Ajouter la colonne search_vector tsvector
ALTER TABLE "Formation"
ADD COLUMN IF NOT EXISTS "searchVector" tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('french', coalesce("titleFr", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("titleEn", '')), 'A') ||
  setweight(to_tsvector('french', coalesce("shortDescFr", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("shortDescEn", '')), 'B') ||
  setweight(to_tsvector('french', coalesce("descriptionFr", '')), 'C') ||
  setweight(to_tsvector('english', coalesce("descriptionEn", '')), 'C')
) STORED;

-- Index GIN pour recherche rapide
CREATE INDEX IF NOT EXISTS "Formation_searchVector_idx"
ON "Formation" USING GIN("searchVector");

-- Index trigram pour recherche floue (tolérance aux fautes de frappe)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS "Formation_titleFr_trgm_idx"
ON "Formation" USING GIN("titleFr" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Formation_titleEn_trgm_idx"
ON "Formation" USING GIN("titleEn" gin_trgm_ops);

-- Exemple de requête FTS :
-- SELECT * FROM "Formation"
-- WHERE "searchVector" @@ plainto_tsquery('french', 'développement web')
--    OR "searchVector" @@ plainto_tsquery('english', 'web development')
-- ORDER BY ts_rank("searchVector", plainto_tsquery('french', 'développement web')) DESC;
