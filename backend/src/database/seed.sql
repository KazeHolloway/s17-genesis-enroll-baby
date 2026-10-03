-- ============================================================================
-- SEED DE DÉVELOPPEMENT LOCAL (seed.sql)
-- ============================================================================

-- Dit à PostgreSQL de lire le fichier en UTF-8 (important pour les caractères accentués)
SET client_encoding = 'UTF8';

-- 1. Référentiels fixes (Vaccins et Calendrier)

-- Insertion des vaccins de base
INSERT INTO public.vaccins (id, code, nom, description) VALUES
(1, 'BCG', 'BCG', NULL),
(2, 'VPI', 'Polio inactivé (VPI)', NULL),
(3, 'ROUGEOLE', 'Rougeole', NULL)
ON CONFLICT (id) DO NOTHING;

-- Insertion du calendrier vaccinal par défaut
INSERT INTO public.calendrier_vaccinal (id, vaccin_id, dose_numero, age_cible_jours, version, date_effet, actif) VALUES
(1, 1, 1, 0, 1, '2026-09-30', true),
(2, 2, 1, 60, 1, '2026-09-30', true),
(3, 2, 2, 270, 1, '2026-09-30', true),
(4, 3, 1, 270, 1, '2026-09-30', true)
ON CONFLICT (id) DO NOTHING;

-- Ajustement des séquences d'auto-incrémentation
SELECT pg_catalog.setval('public.vaccins_id_seq', 3, true);
SELECT pg_catalog.setval('public.calendrier_vaccinal_id_seq', 4, true);

-- 2. Établissement de test
INSERT INTO public.etablissements (id, nom, ville, adresse, telephone) VALUES
(1, 'Maternité Centrale de Brazzaville', 'Brazzaville', 'Avenue de la Paix', '+242060000000')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.etablissements_id_seq', 1, true);

-- 3. Agent de maternité de test (mot de passe : Agent123!)
INSERT INTO public.utilisateurs (id, nom_complet, telephone, mot_de_passe_hash, role, etablissement_id) VALUES
(1, 'Agent Test', '+242060000001', '$2b$10$TuVGpZKCamvwgVgkyFixZ.BzPwu1Qoy.KmYRT8lHS6Uhd/RcTdriW', 'agent_maternite', 1)
ON CONFLICT (id) DO NOTHING;

-- Ajustement de la séquence des utilisateurs
SELECT pg_catalog.setval('public.utilisateurs_id_seq', 1, true);

-- 4. Administrateur de test (mot de passe : Admin123!)
INSERT INTO public.utilisateurs (id, nom_complet, telephone, mot_de_passe_hash, role) VALUES
(2, 'Admin Test', '+242060000002', '$2b$10$FQl3WyfIJR2qJKOcnDQ8QeefCziknGP0CrDzp2mXdP/BPTO9YqdmW', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Ajustement de la séquence des utilisateurs
SELECT pg_catalog.setval('public.utilisateurs_id_seq', 2, true);