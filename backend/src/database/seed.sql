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

-- 5. DONNÉES DE TEST MÉTIER (enfants, parents, dossiers, vaccinations, rendez-vous)
-- À exécuter sur une base vide, juste après schema.sql

-- Compte parent de test (mot de passe : Parent123!)
INSERT INTO public.utilisateurs (id, nom_complet, telephone, mot_de_passe_hash, role) VALUES
(3, 'Marie Nzaba', '+242061000010', '$2b$10$GljS5jhgZfnaCgo5J1b0yuOhymN96y9sUIVs647kwV6992fanKTFi', 'parent')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 3, true);

-- Nouveau-nés de test, tous enregistrés par l'agent 1 dans l'établissement 1
-- Enfant 1 : né il y a 5 jours, code d'accès pas encore utilisé (pour tester l'inscription parent)
-- Enfant 2 : né il y a 40 jours, délai de déclaration dépassé, compte parent déjà créé (Marie Nzaba)
-- Enfant 3 : né il y a 20 jours, naissance déjà déclarée à la mairie, code d'accès pas encore utilisé
-- Enfant 4 : né il y a 12 jours, mort-né (pour les statistiques de mortalité)
INSERT INTO public.enfants (id, nom, prenom, sexe, date_naissance, lieu_naissance, poids_naissance, taille_naissance, statut_vital, etablissement_id, agent_id) VALUES
(1, 'Mabiala', 'Grâce', 'F', CURRENT_DATE - 5, 'Brazzaville', 3.20, 50.0, 'vivant', 1, 1),
(2, 'Nzaba', 'Kevin', 'M', CURRENT_DATE - 40, 'Brazzaville', 3.50, 51.0, 'vivant', 1, 1),
(3, 'Okemba', 'Sarah', 'F', CURRENT_DATE - 20, 'Brazzaville', 2.90, 48.0, 'vivant', 1, 1),
(4, 'Ibara', 'Test', 'M', CURRENT_DATE - 12, 'Brazzaville', 2.10, 45.0, 'mort_ne', 1, 1)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.enfants_id_seq', 4, true);

-- Parents (personnes enregistrées par la maternité, distinctes des comptes utilisateurs)
-- Le parent 3 (Marie Nzaba) est rattaché à son compte utilisateur 3
INSERT INTO public.parents (id, nom, prenom, telephone, email, adresse, utilisateur_id) VALUES
(1, 'Mabiala', 'Julie', '+242061000001', NULL, 'Makélékélé, Brazzaville', NULL),
(2, 'Mabiala', 'Paul', '+242061000002', NULL, 'Makélékélé, Brazzaville', NULL),
(3, 'Nzaba', 'Marie', '+242061000010', NULL, 'Bacongo, Brazzaville', 3),
(4, 'Okemba', 'Annick', '+242061000020', NULL, 'Talangaï, Brazzaville', NULL),
(5, 'Ibara', 'Clarisse', '+242061000030', NULL, 'Moungali, Brazzaville', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.parents_id_seq', 5, true);

-- Liens enfants <-> parents
INSERT INTO public.enfant_parents (enfant_id, parent_id, lien) VALUES
(1, 1, 'mere'),
(1, 2, 'pere'),
(2, 3, 'mere'),
(3, 4, 'mere'),
(4, 5, 'mere')
ON CONFLICT (enfant_id, parent_id) DO NOTHING;

-- Dossiers : le code d'accès est stocké sous forme d'empreinte SHA-256, comme dans l'application
-- Codes de test pour l'inscription d'un parent (sans tirets ni majuscules obligatoires) :
--   Enfant 1 : ABCD-2345-EFGH (libre, à utiliser pour tester l'inscription)
--   Enfant 3 : JKLM-6789-NPQR (libre)
--   Enfant 2 : STUV-2345-WXYZ (déjà utilisé par Marie Nzaba)
--   Enfant 4 : BCDF-3456-GHJK (libre)
INSERT INTO public.dossiers (id, enfant_id, numero_dossier, code_acces_hash, code_expire_at, statut) VALUES
(1, 1, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000001', encode(sha256('ABCD2345EFGH'::bytea), 'hex'), NULL, 'actif'),
(2, 2, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000002', encode(sha256('STUV2345WXYZ'::bytea), 'hex'), NULL, 'actif'),
(3, 3, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000003', encode(sha256('JKLM6789NPQR'::bytea), 'hex'), NULL, 'actif'),
(4, 4, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000004', encode(sha256('BCDF3456GHJK'::bytea), 'hex'), NULL, 'actif')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.dossiers_id_seq', 4, true);

-- Accès au dossier : le compte parent 3 voit le dossier de l'enfant 2
INSERT INTO public.acces_dossier (utilisateur_id, dossier_id) VALUES
(3, 2)
ON CONFLICT (utilisateur_id, dossier_id) DO NOTHING;

-- Déclaration de naissance de l'enfant 3 : déjà enregistrée à la mairie il y a 10 jours
INSERT INTO public.declarations_naissance (id, dossier_id, numero, date_emission, date_limite, statut, date_declaration, certificat_token, certificat_url) VALUES
(1, 3, 'DEC-' || to_char(CURRENT_DATE, 'YYYY') || '-000001', CURRENT_DATE - 20, CURRENT_DATE + 10, 'declaree', CURRENT_DATE - 10, 'seed-certificat-okemba-sarah', '/api/certificats/seed-certificat-okemba-sarah')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.declarations_naissance_id_seq', 1, true);

-- Vaccinations déjà administrées (BCG à la naissance pour les enfants 2 et 3)
-- Les autres doses restent calculées automatiquement par le calendrier vaccinal
INSERT INTO public.vaccinations (id, enfant_id, calendrier_id, date_prevue, statut, date_administration, agent_id, etablissement_id, numero_lot) VALUES
(1, 2, 1, CURRENT_DATE - 40, 'effectue', CURRENT_DATE - 39, 1, 1, 'LOT-BCG-001'),
(2, 3, 1, CURRENT_DATE - 20, 'effectue', CURRENT_DATE - 20, 1, 1, 'LOT-BCG-002')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.vaccinations_id_seq', 2, true);

-- Rendez-vous de suivi : un dans 12 heures (apparaît dans les rappels 24 h), un dans 10 jours
INSERT INTO public.rendez_vous (id, enfant_id, etablissement_id, vaccination_id, date_rdv, motif, statut) VALUES
(1, 2, 1, NULL, now() + interval '12 hours', 'Vaccin VPI dose 1', 'planifie'),
(2, 1, 1, NULL, now() + interval '10 days', 'Contrôle de suivi', 'planifie')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.rendez_vous_id_seq', 2, true);