-- ============================================================================
-- SCHÉMA DE BASE DE DONNÉES - SYSTEME DE SUIVI MATERNITÉ & VACCINATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TYPES ÉNUMÉRÉS (ENUMS)
-- ----------------------------------------------------------------------------

CREATE TYPE public.role_utilisateur AS ENUM ('parent', 'agent_maternite', 'admin');
CREATE TYPE public.sexe_enfant AS ENUM ('M', 'F');
CREATE TYPE public.statut_vital AS ENUM ('vivant', 'mort_ne', 'decede');
CREATE TYPE public.lien_parente AS ENUM ('mere', 'pere', 'tuteur');
CREATE TYPE public.statut_dossier AS ENUM ('actif', 'archive');
CREATE TYPE public.statut_declaration AS ENUM ('en_attente', 'declaree', 'hors_delai');
CREATE TYPE public.statut_vaccination AS ENUM ('a_venir', 'effectue', 'en_retard');
CREATE TYPE public.type_rappel AS ENUM ('declaration', 'vaccin');
CREATE TYPE public.statut_rappel AS ENUM ('a_venir', 'affiche', 'lu', 'clos');
CREATE TYPE public.statut_rdv AS ENUM ('planifie', 'honore', 'manque', 'annule');

-- ----------------------------------------------------------------------------
-- 2. FONCTIONS
-- ----------------------------------------------------------------------------

-- Mise à jour automatique de la date limite de déclaration
CREATE OR REPLACE FUNCTION public.fn_set_date_limite() 
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
    v_naissance DATE;
BEGIN
    IF NEW.date_limite IS NULL THEN
        SELECT e.date_naissance INTO v_naissance
        FROM dossiers d JOIN enfants e ON e.id = d.enfant_id
        WHERE d.id = NEW.dossier_id;
        NEW.date_limite := v_naissance + 30;
    END IF;
    RETURN NEW;
END;
$$;

-- Mise à jour automatique du champ updated_at
CREATE OR REPLACE FUNCTION public.fn_touch_updated_at() 
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

-- ----------------------------------------------------------------------------
-- 3. TABLES ET CONTRAINTES
-- ----------------------------------------------------------------------------

-- Établissements de santé
CREATE TABLE public.etablissements (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    ville VARCHAR(100) DEFAULT 'Brazzaville' NOT NULL,
    adresse VARCHAR(255),
    telephone VARCHAR(20),
    actif BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Utilisateurs du système
CREATE TABLE public.utilisateurs (
    id SERIAL PRIMARY KEY,
    nom_complet VARCHAR(150) NOT NULL,
    telephone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    mot_de_passe_hash VARCHAR(255) NOT NULL,
    role public.role_utilisateur DEFAULT 'parent'::public.role_utilisateur NOT NULL,
    etablissement_id INT REFERENCES public.etablissements(id) ON DELETE SET NULL,
    -- Console super admin : identifiant professionnel et libellé du rôle affiché
    -- (la colonne `role` porte l'autorisation, `metier` porte le libellé)
    matricule VARCHAR(30) UNIQUE,
    metier VARCHAR(60),
    actif BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_agent_etablissement CHECK (role <> 'agent_maternite'::public.role_utilisateur OR etablissement_id IS NOT NULL)
);

CREATE INDEX idx_utilisateurs_etablissement ON public.utilisateurs(etablissement_id);

-- Tokens de rafraîchissement (Authentification)
CREATE TABLE public.refresh_tokens (
    id SERIAL PRIMARY KEY,
    utilisateur_id INT NOT NULL REFERENCES public.utilisateurs(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    revoque BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_refresh_tokens_user ON public.refresh_tokens(utilisateur_id);

-- Parents / Tuteurs
CREATE TABLE public.parents (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(150),
    adresse VARCHAR(255),
    utilisateur_id INT UNIQUE REFERENCES public.utilisateurs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_parents_telephone ON public.parents(telephone);

-- Enfants
CREATE TABLE public.enfants (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    sexe public.sexe_enfant NOT NULL,
    date_naissance DATE NOT NULL,
    lieu_naissance VARCHAR(150),
    photo_url VARCHAR(255),
    poids_naissance NUMERIC(5,2),
    taille_naissance NUMERIC(5,1),
    statut_vital public.statut_vital DEFAULT 'vivant'::public.statut_vital NOT NULL,
    etablissement_id INT NOT NULL REFERENCES public.etablissements(id),
    agent_id INT NOT NULL REFERENCES public.utilisateurs(id),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_date_naissance CHECK (date_naissance <= CURRENT_DATE)
);

CREATE INDEX idx_enfants_agent ON public.enfants(agent_id);
CREATE INDEX idx_enfants_etablissement ON public.enfants(etablissement_id, date_naissance);

-- Association Enfants <-> Parents
CREATE TABLE public.enfant_parents (
    enfant_id INT NOT NULL REFERENCES public.enfants(id) ON DELETE CASCADE,
    parent_id INT NOT NULL REFERENCES public.parents(id) ON DELETE CASCADE,
    lien public.lien_parente NOT NULL,
    PRIMARY KEY (enfant_id, parent_id)
);

CREATE INDEX idx_enfant_parents_parent ON public.enfant_parents(parent_id);

-- Dossiers médicaux
CREATE TABLE public.dossiers (
    id SERIAL PRIMARY KEY,
    enfant_id INT UNIQUE NOT NULL REFERENCES public.enfants(id) ON DELETE CASCADE,
    numero_dossier VARCHAR(30) UNIQUE NOT NULL,
    code_acces_hash VARCHAR(255) NOT NULL,
    code_expire_at TIMESTAMPTZ,
    statut public.statut_dossier DEFAULT 'actif'::public.statut_dossier NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Droits d'accès aux dossiers
CREATE TABLE public.acces_dossier (
    utilisateur_id INT NOT NULL REFERENCES public.utilisateurs(id) ON DELETE CASCADE,
    dossier_id INT NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
    date_rattachement TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY (utilisateur_id, dossier_id)
);

CREATE INDEX idx_acces_dossier_dossier ON public.acces_dossier(dossier_id);

-- Déclarations de naissance
CREATE TABLE public.declarations_naissance (
    id SERIAL PRIMARY KEY,
    dossier_id INT UNIQUE NOT NULL REFERENCES public.dossiers(id) ON DELETE CASCADE,
    numero VARCHAR(30) UNIQUE NOT NULL,
    date_emission DATE DEFAULT CURRENT_DATE NOT NULL,
    date_limite DATE,
    statut public.statut_declaration DEFAULT 'en_attente'::public.statut_declaration NOT NULL,
    date_declaration DATE,
    certificat_token VARCHAR(100) UNIQUE,
    certificat_url VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_declaree_date CHECK (statut <> 'declaree'::public.statut_declaration OR date_declaration IS NOT NULL)
);

CREATE INDEX idx_declarations_limite ON public.declarations_naissance(date_limite, statut);

-- Vaccins
CREATE TABLE public.vaccins (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- Calendrier vaccinal
CREATE TABLE public.calendrier_vaccinal (
    id SERIAL PRIMARY KEY,
    vaccin_id INT NOT NULL REFERENCES public.vaccins(id),
    dose_numero SMALLINT DEFAULT 1 NOT NULL,
    age_cible_jours INT NOT NULL,
    version SMALLINT DEFAULT 1 NOT NULL,
    date_effet DATE DEFAULT CURRENT_DATE NOT NULL,
    actif BOOLEAN DEFAULT true NOT NULL,
    CONSTRAINT calendrier_vaccinal_age_cible_jours_check CHECK (age_cible_jours >= 0),
    CONSTRAINT calendrier_vaccinal_dose_numero_check CHECK (dose_numero > 0),
    CONSTRAINT uq_vaccin_dose_version UNIQUE (vaccin_id, dose_numero, version)
);

-- Suivi des vaccinations
CREATE TABLE public.vaccinations (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL REFERENCES public.enfants(id) ON DELETE CASCADE,
    calendrier_id INT NOT NULL REFERENCES public.calendrier_vaccinal(id),
    date_prevue DATE NOT NULL,
    statut public.statut_vaccination DEFAULT 'a_venir'::public.statut_vaccination NOT NULL,
    date_administration DATE,
    agent_id INT REFERENCES public.utilisateurs(id),
    etablissement_id INT REFERENCES public.etablissements(id),
    numero_lot VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_effectue_date CHECK (statut <> 'effectue'::public.statut_vaccination OR date_administration IS NOT NULL),
    CONSTRAINT uq_enfant_calendrier UNIQUE (enfant_id, calendrier_id)
);

CREATE INDEX idx_vaccinations_echeance ON public.vaccinations(date_prevue, statut);

-- Rappels de rendez-vous et actes
CREATE TABLE public.rappels (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL REFERENCES public.enfants(id) ON DELETE CASCADE,
    type public.type_rappel NOT NULL,
    declaration_id INT REFERENCES public.declarations_naissance(id) ON DELETE CASCADE,
    vaccination_id INT REFERENCES public.vaccinations(id) ON DELETE CASCADE,
    date_echeance DATE NOT NULL,
    date_affichage DATE NOT NULL,
    statut public.statut_rappel DEFAULT 'a_venir'::public.statut_rappel NOT NULL,
    lu_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT chk_rappel_cible CHECK (
        (type = 'declaration'::public.type_rappel AND declaration_id IS NOT NULL AND vaccination_id IS NULL) OR 
        (type = 'vaccin'::public.type_rappel AND vaccination_id IS NOT NULL AND declaration_id IS NULL)
    )
);

CREATE INDEX idx_rappels_affichage ON public.rappels(date_affichage, statut);
CREATE INDEX idx_rappels_enfant ON public.rappels(enfant_id, statut);

-- Rendez-vous
CREATE TABLE public.rendez_vous (
    id SERIAL PRIMARY KEY,
    enfant_id INT NOT NULL REFERENCES public.enfants(id) ON DELETE CASCADE,
    etablissement_id INT NOT NULL REFERENCES public.etablissements(id),
    vaccination_id INT REFERENCES public.vaccinations(id) ON DELETE SET NULL,
    date_rdv TIMESTAMPTZ NOT NULL,
    motif VARCHAR(255),
    statut public.statut_rdv DEFAULT 'planifie'::public.statut_rdv NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_rdv_date ON public.rendez_vous(etablissement_id, date_rdv);

-- Journal d'audit
CREATE TABLE public.journal_audit (
    id BIGSERIAL PRIMARY KEY,
    utilisateur_id INT REFERENCES public.utilisateurs(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    entite VARCHAR(50) NOT NULL,
    entite_id INT,
    details JSONB,
    ip INET,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_audit_entite ON public.journal_audit(entite, entite_id);
CREATE INDEX idx_audit_user ON public.journal_audit(utilisateur_id, created_at);

-- ----------------------------------------------------------------------------
-- 4. DÉCLENCHEURS (TRIGGERS)
-- ----------------------------------------------------------------------------

CREATE TRIGGER trg_declaration_date_limite
    BEFORE INSERT ON public.declarations_naissance
    FOR EACH ROW EXECUTE FUNCTION public.fn_set_date_limite();

CREATE TRIGGER trg_enfants_updated
    BEFORE UPDATE ON public.enfants
    FOR EACH ROW EXECUTE FUNCTION public.fn_touch_updated_at();

CREATE TRIGGER trg_utilisateurs_updated
    BEFORE UPDATE ON public.utilisateurs
    FOR EACH ROW EXECUTE FUNCTION public.fn_touch_updated_at();

-- ----------------------------------------------------------------------------
-- 5. VUES STATISTIQUES
-- ----------------------------------------------------------------------------

-- Statistiques de natalité
CREATE VIEW public.v_stats_natalite AS
SELECT 
    etablissement_id,
    (date_trunc('month'::text, date_naissance::timestamp with time zone))::date AS mois,
    count(*) AS naissances,
    count(*) FILTER (WHERE sexe = 'M'::public.sexe_enfant) AS garcons,
    count(*) FILTER (WHERE sexe = 'F'::public.sexe_enfant) AS filles
FROM public.enfants
GROUP BY etablissement_id, (date_trunc('month'::text, date_naissance::timestamp with time zone));

-- Statistiques de mortalité
CREATE VIEW public.v_stats_mortalite AS
SELECT 
    etablissement_id,
    (date_trunc('month'::text, date_naissance::timestamp with time zone))::date AS mois,
    count(*) FILTER (WHERE statut_vital = 'mort_ne'::public.statut_vital) AS mort_nes,
    count(*) FILTER (WHERE statut_vital = 'decede'::public.statut_vital) AS deces
FROM public.enfants
GROUP BY etablissement_id, (date_trunc('month'::text, date_naissance::timestamp with time zone));