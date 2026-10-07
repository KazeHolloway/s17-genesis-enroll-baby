-- ============================================================================
-- SEED DE DÉVELOPPEMENT LOCAL (seed.sql)
-- ============================================================================

-- Dit à PostgreSQL de lire le fichier en UTF-8 (important pour les caractères accentués)
SET client_encoding = 'UTF8';

-- 1. RÉFÉRENTIELS FIXES

-- Insertion des vaccins de base
INSERT INTO public.vaccins (id, code, nom, description) VALUES
(1, 'BCG', 'BCG', NULL),
(2, 'VPI', 'Polio inactivé (VPI)', NULL),
(3, 'ROUGEOLE', 'Rougeole', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.vaccins_id_seq', 3, true);

-- Insertion du calendrier vaccinal par défaut
INSERT INTO public.calendrier_vaccinal (id, vaccin_id, dose_numero, age_cible_jours, version, date_effet, actif) VALUES
(1, 1, 1, 0, 1, '2026-09-30', true),
(2, 2, 1, 60, 1, '2026-09-30', true),
(3, 2, 2, 270, 1, '2026-09-30', true),
(4, 3, 1, 270, 1, '2026-09-30', true)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.calendrier_vaccinal_id_seq', 4, true);

-- Insertion de l'établissement de test
INSERT INTO public.etablissements (id, nom, ville, adresse, telephone) VALUES
(1, 'Maternité Centrale de Brazzaville', 'Brazzaville', 'Avenue de la Paix', '+242060000000')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.etablissements_id_seq', 1, true);

-- 2. COMPTES UTILISATEURS DE TEST

-- Comptes de test :
--   Agent de maternité : +242060000001 / Agent123!
--   Administrateur : +242060000002 / Admin123!
--   Agents 2 à 10 : +242060000003 à +242060000011 (mêmes comptes que sur Neon)
--   Parents (Marie Nzaba, Rosine Loubaki, Esther Tati) : +242061000010, +242061000011, +242061000012 / Parent123!
INSERT INTO public.utilisateurs (id, nom_complet, telephone, mot_de_passe_hash, role, etablissement_id) VALUES
(1, 'Agent Test', '+242060000001', '$2b$10$TuVGpZKCamvwgVgkyFixZ.BzPwu1Qoy.KmYRT8lHS6Uhd/RcTdriW', 'agent_maternite', 1),
(2, 'Admin Test', '+242060000002', '$2b$10$FQl3WyfIJR2qJKOcnDQ8QeefCziknGP0CrDzp2mXdP/BPTO9YqdmW', 'admin', NULL),
(3, 'Marie Nzaba', '+242061000010', '$2b$10$GljS5jhgZfnaCgo5J1b0yuOhymN96y9sUIVs647kwV6992fanKTFi', 'parent', NULL),
(4, 'Rosine Loubaki', '+242061000011', '$2b$10$GljS5jhgZfnaCgo5J1b0yuOhymN96y9sUIVs647kwV6992fanKTFi', 'parent', NULL),
(5, 'Esther Tati', '+242061000012', '$2b$10$GljS5jhgZfnaCgo5J1b0yuOhymN96y9sUIVs647kwV6992fanKTFi', 'parent', NULL),
(6, 'Agent 2', '+242060000003', '$2b$10$5G6rNhH84/SdTTtuCNjhTuEiYDpXtfBo7bJNBILVLEH.vRKFPeC8m', 'agent_maternite', 1),
(7, 'Agent 3', '+242060000004', '$2b$10$tHDXakZB67q1SjVp8Wy0aObom4XBOoPiYyez3itdcJ2LPEzKiu8Ve', 'agent_maternite', 1),
(8, 'Agent 4', '+242060000005', '$2b$10$N63oFnoo/ts4d0oMz8aaB.5.JQ2cryDa/EA3XkleMhN01jYd3L/US', 'agent_maternite', 1),
(9, 'Agent 5', '+242060000006', '$2b$10$ki/h8nvuUfr8/qJVx5R6b.C31MqtwnK3E88NS6BBlBo3YWtOlUrhS', 'agent_maternite', 1),
(10, 'Agent 6', '+242060000007', '$2b$10$9IremX3vATt7t0GHCI50g.1tFsyFmtLyOojbQ4fIqIfXm6D8.nI3.', 'agent_maternite', 1),
(11, 'Agent 7', '+242060000008', '$2b$10$D8PA8vI05Ns57kKnAoSzNO8q5/vNI4EZq3FRiE8FfkR8SKqbCeX3O', 'agent_maternite', 1),
(12, 'Agent 8', '+242060000009', '$2b$10$0GFW6J336Djedg7SXElLeOR4gy07Dioq1Ovf.OtnvTJ48DkDlT0Bq', 'agent_maternite', 1),
(13, 'Agent 9', '+242060000010', '$2b$10$FMLKHK254MHCzjwxZFL7BeIqvisPrAtzCdW7TZLPD23vsle3FydOK', 'agent_maternite', 1),
(14, 'Agent 10', '+242060000011', '$2b$10$tl/m/p4J3fN0slxMhiQTNeMwqMhpMtQw195Rzz8dXyJfJ8l.roD6C', 'agent_maternite', 1)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 14, true);

-- 3. DONNÉES DE TEST MÉTIER (10 nouveau-nés enregistrés par l'agent 1)

-- Enfants de test :
--   Enfant 1 : né il y a 5 jours, code d'accès pas encore utilisé (pour tester l'inscription parent)
--   Enfant 2 : né il y a 40 jours, délai de déclaration dépassé, compte parent déjà créé (Marie Nzaba)
--   Enfant 3 : né il y a 20 jours, naissance déjà déclarée à la mairie, code d'accès libre
--   Enfant 4 : né il y a 12 jours, mort-né (pour les statistiques de mortalité)
--   Enfant 5 : né il y a 2 jours, tout neuf, aucun vaccin fait, code libre
--   Enfant 6 : né il y a 35 jours, délai dépassé, compte parent Rosine Loubaki, rendez-vous dans 3 jours
--   Enfant 7 : né il y a 62 jours, dose VPI 1 en retard, rendez-vous de rattrapage dans 20 heures, code libre
--   Enfant 8 : né il y a 100 jours, naissance déclarée, vaccins à jour, compte parent Esther Tati
--   Enfant 9 : né il y a 280 jours, naissance déclarée, doses VPI 2 et rougeole en retard, code libre
--   Enfant 10 : décédé, pour les statistiques de mortalité
INSERT INTO public.enfants (id, nom, prenom, sexe, date_naissance, lieu_naissance, poids_naissance, taille_naissance, statut_vital, etablissement_id, agent_id) VALUES
(1, 'Mabiala', 'Grâce', 'F', CURRENT_DATE - 5, 'Brazzaville', 3.20, 50.0, 'vivant', 1, 1),
(2, 'Nzaba', 'Kevin', 'M', CURRENT_DATE - 40, 'Brazzaville', 3.50, 51.0, 'vivant', 1, 1),
(3, 'Okemba', 'Sarah', 'F', CURRENT_DATE - 20, 'Brazzaville', 2.90, 48.0, 'vivant', 1, 1),
(4, 'Ibara', 'Test', 'M', CURRENT_DATE - 12, 'Brazzaville', 2.10, 45.0, 'mort_ne', 1, 1),
(5, 'Moukoko', 'Prince', 'M', CURRENT_DATE - 2, 'Brazzaville', 3.40, 50.0, 'vivant', 1, 1),
(6, 'Loubaki', 'Ange', 'F', CURRENT_DATE - 35, 'Brazzaville', 3.00, 49.0, 'vivant', 1, 1),
(7, 'Batchi', 'Josué', 'M', CURRENT_DATE - 62, 'Brazzaville', 3.10, 49.5, 'vivant', 1, 1),
(8, 'Tati', 'Merveille', 'F', CURRENT_DATE - 100, 'Brazzaville', 2.95, 48.5, 'vivant', 1, 1),
(9, 'Ngoma', 'Jordan', 'M', CURRENT_DATE - 280, 'Brazzaville', 3.60, 52.0, 'vivant', 1, 1),
(10, 'Mpassi', 'Éliane', 'F', CURRENT_DATE - 50, 'Brazzaville', 2.80, 47.0, 'decede', 1, 1)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.enfants_id_seq', 10, true);

-- Parents (personnes enregistrées par la maternité, distinctes des comptes utilisateurs)
-- Les parents 3, 7 et 9 sont rattachés à leur compte utilisateur (3, 4 et 5)
INSERT INTO public.parents (id, nom, prenom, telephone, email, adresse, utilisateur_id) VALUES
(1, 'Mabiala', 'Julie', '+242061000001', NULL, 'Makélékélé, Brazzaville', NULL),
(2, 'Mabiala', 'Paul', '+242061000002', NULL, 'Makélékélé, Brazzaville', NULL),
(3, 'Nzaba', 'Marie', '+242061000010', NULL, 'Bacongo, Brazzaville', 3),
(4, 'Okemba', 'Annick', '+242061000020', NULL, 'Talangaï, Brazzaville', NULL),
(5, 'Ibara', 'Clarisse', '+242061000030', NULL, 'Moungali, Brazzaville', NULL),
(6, 'Moukoko', 'Sandrine', '+242061000040', NULL, 'Ouenzé, Brazzaville', NULL),
(7, 'Loubaki', 'Rosine', '+242061000011', NULL, 'Poto-Poto, Brazzaville', 4),
(8, 'Batchi', 'Carine', '+242061000050', NULL, 'Mfilou, Brazzaville', NULL),
(9, 'Tati', 'Esther', '+242061000012', NULL, 'Moungali, Brazzaville', 5),
(10, 'Ngoma', 'Hortense', '+242061000060', NULL, 'Madibou, Brazzaville', NULL),
(11, 'Mpassi', 'Léa', '+242061000070', NULL, 'Talangaï, Brazzaville', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.parents_id_seq', 11, true);

-- Liens enfants <-> parents
INSERT INTO public.enfant_parents (enfant_id, parent_id, lien) VALUES
(1, 1, 'mere'),
(1, 2, 'pere'),
(2, 3, 'mere'),
(3, 4, 'mere'),
(4, 5, 'mere'),
(5, 6, 'mere'),
(6, 7, 'mere'),
(7, 8, 'mere'),
(8, 9, 'mere'),
(9, 10, 'mere'),
(10, 11, 'mere')
ON CONFLICT (enfant_id, parent_id) DO NOTHING;

-- Dossiers : le code d'accès est stocké sous forme d'empreinte SHA-256, comme dans l'application
-- Codes d'accès de test pour l'inscription d'un parent (tirets et majuscules facultatifs) :
--   Codes libres :
--     Enfant 1 : ABCD-2345-EFGH
--     Enfant 3 : JKLM-6789-NPQR
--     Enfant 4 : BCDF-3456-GHJK
--     Enfant 5 : CDEF-4567-HJKM
--     Enfant 7 : UVWX-3456-YZAB
--     Enfant 9 : NPQR-4567-STUV
--     Enfant 10 : WXYZ-5678-BCDF
--   Codes déjà utilisés :
--     Enfant 2 : STUV-2345-WXYZ (Marie Nzaba)
--     Enfant 6 : LMNP-2345-QRST (Rosine Loubaki)
--     Enfant 8 : CDGH-5678-JKLM (Esther Tati)
INSERT INTO public.dossiers (id, enfant_id, numero_dossier, code_acces_hash, code_expire_at, statut) VALUES
(1, 1, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000001', encode(sha256('ABCD2345EFGH'::bytea), 'hex'), NULL, 'actif'),
(2, 2, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000002', encode(sha256('STUV2345WXYZ'::bytea), 'hex'), NULL, 'actif'),
(3, 3, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000003', encode(sha256('JKLM6789NPQR'::bytea), 'hex'), NULL, 'actif'),
(4, 4, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000004', encode(sha256('BCDF3456GHJK'::bytea), 'hex'), NULL, 'actif'),
(5, 5, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000005', encode(sha256('CDEF4567HJKM'::bytea), 'hex'), NULL, 'actif'),
(6, 6, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000006', encode(sha256('LMNP2345QRST'::bytea), 'hex'), NULL, 'actif'),
(7, 7, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000007', encode(sha256('UVWX3456YZAB'::bytea), 'hex'), NULL, 'actif'),
(8, 8, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000008', encode(sha256('CDGH5678JKLM'::bytea), 'hex'), NULL, 'actif'),
(9, 9, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000009', encode(sha256('NPQR4567STUV'::bytea), 'hex'), NULL, 'actif'),
(10, 10, 'EB-' || to_char(CURRENT_DATE, 'YYYY') || '-000010', encode(sha256('WXYZ5678BCDF'::bytea), 'hex'), NULL, 'actif')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.dossiers_id_seq', 10, true);

-- Accès au dossier : Marie Nzaba voit l'enfant 2, Rosine Loubaki l'enfant 6, Esther Tati l'enfant 8
INSERT INTO public.acces_dossier (utilisateur_id, dossier_id) VALUES
(3, 2),
(4, 6),
(5, 8)
ON CONFLICT (utilisateur_id, dossier_id) DO NOTHING;

-- Déclarations de naissance déjà faites à la mairie : enfant 3 (il y a 10 jours), enfant 8 (il y a 90 jours), enfant 9 (il y a 260 jours)
INSERT INTO public.declarations_naissance (id, dossier_id, numero, date_emission, date_limite, statut, date_declaration, certificat_token, certificat_url) VALUES
(1, 3, 'DEC-' || to_char(CURRENT_DATE, 'YYYY') || '-000001', CURRENT_DATE - 20, CURRENT_DATE + 10, 'declaree', CURRENT_DATE - 10, 'seed-certificat-okemba-sarah', '/api/certificats/seed-certificat-okemba-sarah'),
(2, 8, 'DEC-' || to_char(CURRENT_DATE, 'YYYY') || '-000002', CURRENT_DATE - 100, CURRENT_DATE - 70, 'declaree', CURRENT_DATE - 90, 'seed-certificat-tati-merveille', '/api/certificats/seed-certificat-tati-merveille'),
(3, 9, 'DEC-' || to_char(CURRENT_DATE, 'YYYY') || '-000003', CURRENT_DATE - 280, CURRENT_DATE - 250, 'declaree', CURRENT_DATE - 260, 'seed-certificat-ngoma-jordan', '/api/certificats/seed-certificat-ngoma-jordan')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.declarations_naissance_id_seq', 3, true);

-- Vaccinations déjà administrées (calendrier 1 = BCG, 2 = VPI dose 1)
-- Les autres doses restent calculées automatiquement par le calendrier vaccinal
INSERT INTO public.vaccinations (id, enfant_id, calendrier_id, date_prevue, statut, date_administration, agent_id, etablissement_id, numero_lot) VALUES
(1, 2, 1, CURRENT_DATE - 40, 'effectue', CURRENT_DATE - 39, 1, 1, 'LOT-BCG-001'),
(2, 3, 1, CURRENT_DATE - 20, 'effectue', CURRENT_DATE - 20, 1, 1, 'LOT-BCG-002'),
(3, 6, 1, CURRENT_DATE - 35, 'effectue', CURRENT_DATE - 34, 1, 1, 'LOT-BCG-003'),
(4, 7, 1, CURRENT_DATE - 62, 'effectue', CURRENT_DATE - 61, 1, 1, 'LOT-BCG-004'),
(5, 8, 1, CURRENT_DATE - 100, 'effectue', CURRENT_DATE - 99, 1, 1, 'LOT-BCG-005'),
(6, 8, 2, CURRENT_DATE - 40, 'effectue', CURRENT_DATE - 39, 1, 1, 'LOT-VPI-001'),
(7, 9, 1, CURRENT_DATE - 280, 'effectue', CURRENT_DATE - 279, 1, 1, 'LOT-BCG-006'),
(8, 9, 2, CURRENT_DATE - 220, 'effectue', CURRENT_DATE - 219, 1, 1, 'LOT-VPI-002'),
(9, 10, 1, CURRENT_DATE - 50, 'effectue', CURRENT_DATE - 50, 1, 1, 'LOT-BCG-007')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.vaccinations_id_seq', 9, true);

-- Rendez-vous de suivi : enfant 2 dans 12 heures et enfant 7 dans 20 heures (rappels 24 h), les autres plus tard
INSERT INTO public.rendez_vous (id, enfant_id, etablissement_id, vaccination_id, date_rdv, motif, statut) VALUES
(1, 2, 1, NULL, now() + interval '12 hours', 'Vaccin VPI dose 1', 'planifie'),
(2, 1, 1, NULL, now() + interval '10 days', 'Contrôle de suivi', 'planifie'),
(3, 6, 1, NULL, now() + interval '3 days', 'Vaccin VPI dose 1', 'planifie'),
(4, 7, 1, NULL, now() + interval '20 hours', 'Rattrapage VPI dose 1', 'planifie'),
(5, 9, 1, NULL, now() + interval '6 days', 'Vaccin VPI dose 2 et rougeole', 'planifie')
ON CONFLICT (id) DO NOTHING;

SELECT pg_catalog.setval('public.rendez_vous_id_seq', 5, true);