-- ============================================================================
-- Migration : champs de la console super admin sur `utilisateurs`
-- Idempotent (IF NOT EXISTS) : ré-exécutable sans risque.
-- Exécution : `npm run migrate` (backend)
-- ============================================================================

ALTER TABLE public.utilisateurs ADD COLUMN IF NOT EXISTS matricule VARCHAR(30);
ALTER TABLE public.utilisateurs ADD COLUMN IF NOT EXISTS metier VARCHAR(60);

CREATE UNIQUE INDEX IF NOT EXISTS uq_utilisateurs_matricule
    ON public.utilisateurs (matricule);
