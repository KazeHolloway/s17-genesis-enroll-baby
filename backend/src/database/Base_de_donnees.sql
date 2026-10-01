--
-- PostgreSQL database dump
--

\restrict iguJ3SDdBMDHPgqGKaKrmXPSi70bVOzXkdYOvSInXvHfHmnfSxQL1aitmD5fldR

-- Dumped from database version 16.6
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-30 21:40:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 73729)
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO root;

--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: root
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 880 (class 1247 OID 73750)
-- Name: lien_parente; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.lien_parente AS ENUM (
    'mere',
    'pere',
    'tuteur'
);


ALTER TYPE public.lien_parente OWNER TO root;

--
-- TOC entry 871 (class 1247 OID 73731)
-- Name: role_utilisateur; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.role_utilisateur AS ENUM (
    'parent',
    'agent_maternite',
    'admin'
);


ALTER TYPE public.role_utilisateur OWNER TO root;

--
-- TOC entry 874 (class 1247 OID 73738)
-- Name: sexe_enfant; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.sexe_enfant AS ENUM (
    'M',
    'F'
);


ALTER TYPE public.sexe_enfant OWNER TO root;

--
-- TOC entry 886 (class 1247 OID 73764)
-- Name: statut_declaration; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_declaration AS ENUM (
    'en_attente',
    'declaree',
    'hors_delai'
);


ALTER TYPE public.statut_declaration OWNER TO root;

--
-- TOC entry 883 (class 1247 OID 73758)
-- Name: statut_dossier; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_dossier AS ENUM (
    'actif',
    'archive'
);


ALTER TYPE public.statut_dossier OWNER TO root;

--
-- TOC entry 895 (class 1247 OID 73786)
-- Name: statut_rappel; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_rappel AS ENUM (
    'a_venir',
    'affiche',
    'lu',
    'clos'
);


ALTER TYPE public.statut_rappel OWNER TO root;

--
-- TOC entry 898 (class 1247 OID 73796)
-- Name: statut_rdv; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_rdv AS ENUM (
    'planifie',
    'honore',
    'manque',
    'annule'
);


ALTER TYPE public.statut_rdv OWNER TO root;

--
-- TOC entry 889 (class 1247 OID 73772)
-- Name: statut_vaccination; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_vaccination AS ENUM (
    'a_venir',
    'effectue',
    'en_retard'
);


ALTER TYPE public.statut_vaccination OWNER TO root;

--
-- TOC entry 877 (class 1247 OID 73744)
-- Name: statut_vital; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.statut_vital AS ENUM (
    'vivant',
    'mort_ne',
    'decede'
);


ALTER TYPE public.statut_vital OWNER TO root;

--
-- TOC entry 892 (class 1247 OID 73780)
-- Name: type_rappel; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public.type_rappel AS ENUM (
    'declaration',
    'vaccin'
);


ALTER TYPE public.type_rappel OWNER TO root;

--
-- TOC entry 245 (class 1255 OID 73975)
-- Name: fn_set_date_limite(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.fn_set_date_limite() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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


ALTER FUNCTION public.fn_set_date_limite() OWNER TO root;

--
-- TOC entry 246 (class 1255 OID 74111)
-- Name: fn_touch_updated_at(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.fn_touch_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_touch_updated_at() OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 73935)
-- Name: acces_dossier; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.acces_dossier (
    utilisateur_id integer NOT NULL,
    dossier_id integer NOT NULL,
    date_rattachement timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.acces_dossier OWNER TO root;

--
-- TOC entry 234 (class 1259 OID 73989)
-- Name: calendrier_vaccinal; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.calendrier_vaccinal (
    id integer NOT NULL,
    vaccin_id integer NOT NULL,
    dose_numero smallint DEFAULT 1 NOT NULL,
    age_cible_jours integer NOT NULL,
    version smallint DEFAULT 1 NOT NULL,
    date_effet date DEFAULT CURRENT_DATE NOT NULL,
    actif boolean DEFAULT true NOT NULL,
    CONSTRAINT calendrier_vaccinal_age_cible_jours_check CHECK ((age_cible_jours >= 0)),
    CONSTRAINT calendrier_vaccinal_dose_numero_check CHECK ((dose_numero > 0))
);


ALTER TABLE public.calendrier_vaccinal OWNER TO root;

--
-- TOC entry 233 (class 1259 OID 73988)
-- Name: calendrier_vaccinal_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.calendrier_vaccinal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calendrier_vaccinal_id_seq OWNER TO root;

--
-- TOC entry 5120 (class 0 OID 0)
-- Dependencies: 233
-- Name: calendrier_vaccinal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.calendrier_vaccinal_id_seq OWNED BY public.calendrier_vaccinal.id;


--
-- TOC entry 230 (class 1259 OID 73953)
-- Name: declarations_naissance; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.declarations_naissance (
    id integer NOT NULL,
    dossier_id integer NOT NULL,
    numero character varying(30) NOT NULL,
    date_emission date DEFAULT CURRENT_DATE NOT NULL,
    date_limite date,
    statut public.statut_declaration DEFAULT 'en_attente'::public.statut_declaration NOT NULL,
    date_declaration date,
    certificat_token character varying(100),
    certificat_url character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_declaree_date CHECK (((statut <> 'declaree'::public.statut_declaration) OR (date_declaration IS NOT NULL)))
);


ALTER TABLE public.declarations_naissance OWNER TO root;

--
-- TOC entry 229 (class 1259 OID 73952)
-- Name: declarations_naissance_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.declarations_naissance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.declarations_naissance_id_seq OWNER TO root;

--
-- TOC entry 5121 (class 0 OID 0)
-- Dependencies: 229
-- Name: declarations_naissance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.declarations_naissance_id_seq OWNED BY public.declarations_naissance.id;


--
-- TOC entry 227 (class 1259 OID 73918)
-- Name: dossiers; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.dossiers (
    id integer NOT NULL,
    enfant_id integer NOT NULL,
    numero_dossier character varying(30) NOT NULL,
    code_acces_hash character varying(255) NOT NULL,
    code_expire_at timestamp with time zone,
    statut public.statut_dossier DEFAULT 'actif'::public.statut_dossier NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.dossiers OWNER TO root;

--
-- TOC entry 226 (class 1259 OID 73917)
-- Name: dossiers_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.dossiers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dossiers_id_seq OWNER TO root;

--
-- TOC entry 5122 (class 0 OID 0)
-- Dependencies: 226
-- Name: dossiers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.dossiers_id_seq OWNED BY public.dossiers.id;


--
-- TOC entry 225 (class 1259 OID 73901)
-- Name: enfant_parents; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.enfant_parents (
    enfant_id integer NOT NULL,
    parent_id integer NOT NULL,
    lien public.lien_parente NOT NULL
);


ALTER TABLE public.enfant_parents OWNER TO root;

--
-- TOC entry 224 (class 1259 OID 73877)
-- Name: enfants; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.enfants (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    sexe public.sexe_enfant NOT NULL,
    date_naissance date NOT NULL,
    lieu_naissance character varying(150),
    photo_url character varying(255),
    poids_naissance numeric(5,2),
    taille_naissance numeric(5,1),
    statut_vital public.statut_vital DEFAULT 'vivant'::public.statut_vital NOT NULL,
    etablissement_id integer NOT NULL,
    agent_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_date_naissance CHECK ((date_naissance <= CURRENT_DATE))
);


ALTER TABLE public.enfants OWNER TO root;

--
-- TOC entry 223 (class 1259 OID 73876)
-- Name: enfants_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.enfants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.enfants_id_seq OWNER TO root;

--
-- TOC entry 5123 (class 0 OID 0)
-- Dependencies: 223
-- Name: enfants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.enfants_id_seq OWNED BY public.enfants.id;


--
-- TOC entry 216 (class 1259 OID 73806)
-- Name: etablissements; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.etablissements (
    id integer NOT NULL,
    nom character varying(150) NOT NULL,
    ville character varying(100) DEFAULT 'Brazzaville'::character varying NOT NULL,
    adresse character varying(255),
    telephone character varying(20),
    actif boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.etablissements OWNER TO root;

--
-- TOC entry 215 (class 1259 OID 73805)
-- Name: etablissements_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.etablissements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.etablissements_id_seq OWNER TO root;

--
-- TOC entry 5124 (class 0 OID 0)
-- Dependencies: 215
-- Name: etablissements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.etablissements_id_seq OWNED BY public.etablissements.id;


--
-- TOC entry 242 (class 1259 OID 74095)
-- Name: journal_audit; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.journal_audit (
    id bigint NOT NULL,
    utilisateur_id integer,
    action character varying(50) NOT NULL,
    entite character varying(50) NOT NULL,
    entite_id integer,
    details jsonb,
    ip inet,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.journal_audit OWNER TO root;

--
-- TOC entry 241 (class 1259 OID 74094)
-- Name: journal_audit_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.journal_audit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.journal_audit_id_seq OWNER TO root;

--
-- TOC entry 5125 (class 0 OID 0)
-- Dependencies: 241
-- Name: journal_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.journal_audit_id_seq OWNED BY public.journal_audit.id;


--
-- TOC entry 222 (class 1259 OID 73859)
-- Name: parents; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.parents (
    id integer NOT NULL,
    nom character varying(100) NOT NULL,
    prenom character varying(100) NOT NULL,
    telephone character varying(20),
    email character varying(150),
    adresse character varying(255),
    utilisateur_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.parents OWNER TO root;

--
-- TOC entry 221 (class 1259 OID 73858)
-- Name: parents_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.parents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.parents_id_seq OWNER TO root;

--
-- TOC entry 5126 (class 0 OID 0)
-- Dependencies: 221
-- Name: parents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.parents_id_seq OWNED BY public.parents.id;


--
-- TOC entry 238 (class 1259 OID 74043)
-- Name: rappels; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rappels (
    id integer NOT NULL,
    enfant_id integer NOT NULL,
    type public.type_rappel NOT NULL,
    declaration_id integer,
    vaccination_id integer,
    date_echeance date NOT NULL,
    date_affichage date NOT NULL,
    statut public.statut_rappel DEFAULT 'a_venir'::public.statut_rappel NOT NULL,
    lu_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_rappel_cible CHECK ((((type = 'declaration'::public.type_rappel) AND (declaration_id IS NOT NULL) AND (vaccination_id IS NULL)) OR ((type = 'vaccin'::public.type_rappel) AND (vaccination_id IS NOT NULL) AND (declaration_id IS NULL))))
);


ALTER TABLE public.rappels OWNER TO root;

--
-- TOC entry 237 (class 1259 OID 74042)
-- Name: rappels_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rappels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rappels_id_seq OWNER TO root;

--
-- TOC entry 5127 (class 0 OID 0)
-- Dependencies: 237
-- Name: rappels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rappels_id_seq OWNED BY public.rappels.id;


--
-- TOC entry 220 (class 1259 OID 73842)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.refresh_tokens (
    id integer NOT NULL,
    utilisateur_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoque boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO root;

--
-- TOC entry 219 (class 1259 OID 73841)
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.refresh_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.refresh_tokens_id_seq OWNER TO root;

--
-- TOC entry 5128 (class 0 OID 0)
-- Dependencies: 219
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;


--
-- TOC entry 240 (class 1259 OID 74070)
-- Name: rendez_vous; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rendez_vous (
    id integer NOT NULL,
    enfant_id integer NOT NULL,
    etablissement_id integer NOT NULL,
    vaccination_id integer,
    date_rdv timestamp with time zone NOT NULL,
    motif character varying(255),
    statut public.statut_rdv DEFAULT 'planifie'::public.statut_rdv NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rendez_vous OWNER TO root;

--
-- TOC entry 239 (class 1259 OID 74069)
-- Name: rendez_vous_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rendez_vous_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rendez_vous_id_seq OWNER TO root;

--
-- TOC entry 5129 (class 0 OID 0)
-- Dependencies: 239
-- Name: rendez_vous_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.rendez_vous_id_seq OWNED BY public.rendez_vous.id;


--
-- TOC entry 218 (class 1259 OID 73818)
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.utilisateurs (
    id integer NOT NULL,
    nom_complet character varying(150) NOT NULL,
    telephone character varying(20) NOT NULL,
    email character varying(150),
    mot_de_passe_hash character varying(255) NOT NULL,
    role public.role_utilisateur DEFAULT 'parent'::public.role_utilisateur NOT NULL,
    etablissement_id integer,
    actif boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_agent_etablissement CHECK (((role <> 'agent_maternite'::public.role_utilisateur) OR (etablissement_id IS NOT NULL)))
);


ALTER TABLE public.utilisateurs OWNER TO root;

--
-- TOC entry 217 (class 1259 OID 73817)
-- Name: utilisateurs_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.utilisateurs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_seq OWNER TO root;

--
-- TOC entry 5130 (class 0 OID 0)
-- Dependencies: 217
-- Name: utilisateurs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.utilisateurs_id_seq OWNED BY public.utilisateurs.id;


--
-- TOC entry 244 (class 1259 OID 74123)
-- Name: v_stats_mortalite; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.v_stats_mortalite AS
 SELECT etablissement_id,
    (date_trunc('month'::text, (date_naissance)::timestamp with time zone))::date AS mois,
    count(*) FILTER (WHERE (statut_vital = 'mort_ne'::public.statut_vital)) AS mort_nes,
    count(*) FILTER (WHERE (statut_vital = 'decede'::public.statut_vital)) AS deces
   FROM public.enfants
  GROUP BY etablissement_id, (date_trunc('month'::text, (date_naissance)::timestamp with time zone));


ALTER VIEW public.v_stats_mortalite OWNER TO root;

--
-- TOC entry 243 (class 1259 OID 74118)
-- Name: v_stats_natalite; Type: VIEW; Schema: public; Owner: root
--

CREATE VIEW public.v_stats_natalite AS
 SELECT etablissement_id,
    (date_trunc('month'::text, (date_naissance)::timestamp with time zone))::date AS mois,
    count(*) AS naissances,
    count(*) FILTER (WHERE (sexe = 'M'::public.sexe_enfant)) AS garcons,
    count(*) FILTER (WHERE (sexe = 'F'::public.sexe_enfant)) AS filles
   FROM public.enfants
  GROUP BY etablissement_id, (date_trunc('month'::text, (date_naissance)::timestamp with time zone));


ALTER VIEW public.v_stats_natalite OWNER TO root;

--
-- TOC entry 236 (class 1259 OID 74009)
-- Name: vaccinations; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.vaccinations (
    id integer NOT NULL,
    enfant_id integer NOT NULL,
    calendrier_id integer NOT NULL,
    date_prevue date NOT NULL,
    statut public.statut_vaccination DEFAULT 'a_venir'::public.statut_vaccination NOT NULL,
    date_administration date,
    agent_id integer,
    etablissement_id integer,
    numero_lot character varying(50),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_effectue_date CHECK (((statut <> 'effectue'::public.statut_vaccination) OR (date_administration IS NOT NULL)))
);


ALTER TABLE public.vaccinations OWNER TO root;

--
-- TOC entry 235 (class 1259 OID 74008)
-- Name: vaccinations_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.vaccinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaccinations_id_seq OWNER TO root;

--
-- TOC entry 5131 (class 0 OID 0)
-- Dependencies: 235
-- Name: vaccinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.vaccinations_id_seq OWNED BY public.vaccinations.id;


--
-- TOC entry 232 (class 1259 OID 73978)
-- Name: vaccins; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.vaccins (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    nom character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.vaccins OWNER TO root;

--
-- TOC entry 231 (class 1259 OID 73977)
-- Name: vaccins_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.vaccins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vaccins_id_seq OWNER TO root;

--
-- TOC entry 5132 (class 0 OID 0)
-- Dependencies: 231
-- Name: vaccins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.vaccins_id_seq OWNED BY public.vaccins.id;


--
-- TOC entry 4823 (class 2604 OID 73992)
-- Name: calendrier_vaccinal id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.calendrier_vaccinal ALTER COLUMN id SET DEFAULT nextval('public.calendrier_vaccinal_id_seq'::regclass);


--
-- TOC entry 4818 (class 2604 OID 73956)
-- Name: declarations_naissance id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance ALTER COLUMN id SET DEFAULT nextval('public.declarations_naissance_id_seq'::regclass);


--
-- TOC entry 4814 (class 2604 OID 73921)
-- Name: dossiers id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.dossiers ALTER COLUMN id SET DEFAULT nextval('public.dossiers_id_seq'::regclass);


--
-- TOC entry 4810 (class 2604 OID 73880)
-- Name: enfants id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfants ALTER COLUMN id SET DEFAULT nextval('public.enfants_id_seq'::regclass);


--
-- TOC entry 4796 (class 2604 OID 73809)
-- Name: etablissements id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.etablissements ALTER COLUMN id SET DEFAULT nextval('public.etablissements_id_seq'::regclass);


--
-- TOC entry 4837 (class 2604 OID 74098)
-- Name: journal_audit id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.journal_audit ALTER COLUMN id SET DEFAULT nextval('public.journal_audit_id_seq'::regclass);


--
-- TOC entry 4808 (class 2604 OID 73862)
-- Name: parents id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.parents ALTER COLUMN id SET DEFAULT nextval('public.parents_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 74046)
-- Name: rappels id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rappels ALTER COLUMN id SET DEFAULT nextval('public.rappels_id_seq'::regclass);


--
-- TOC entry 4805 (class 2604 OID 73845)
-- Name: refresh_tokens id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('public.refresh_tokens_id_seq'::regclass);


--
-- TOC entry 4834 (class 2604 OID 74073)
-- Name: rendez_vous id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rendez_vous ALTER COLUMN id SET DEFAULT nextval('public.rendez_vous_id_seq'::regclass);


--
-- TOC entry 4800 (class 2604 OID 73821)
-- Name: utilisateurs id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id SET DEFAULT nextval('public.utilisateurs_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 74012)
-- Name: vaccinations id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations ALTER COLUMN id SET DEFAULT nextval('public.vaccinations_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 73981)
-- Name: vaccins id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccins ALTER COLUMN id SET DEFAULT nextval('public.vaccins_id_seq'::regclass);


--
-- TOC entry 5098 (class 0 OID 73935)
-- Dependencies: 228
-- Data for Name: acces_dossier; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.acces_dossier (utilisateur_id, dossier_id, date_rattachement) FROM stdin;
\.


--
-- TOC entry 5104 (class 0 OID 73989)
-- Dependencies: 234
-- Data for Name: calendrier_vaccinal; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.calendrier_vaccinal (id, vaccin_id, dose_numero, age_cible_jours, version, date_effet, actif) FROM stdin;
1	1	1	0	1	2026-09-30	t
2	2	1	60	1	2026-09-30	t
3	2	2	270	1	2026-09-30	t
4	3	1	270	1	2026-09-30	t
\.


--
-- TOC entry 5100 (class 0 OID 73953)
-- Dependencies: 230
-- Data for Name: declarations_naissance; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.declarations_naissance (id, dossier_id, numero, date_emission, date_limite, statut, date_declaration, certificat_token, certificat_url, created_at) FROM stdin;
\.


--
-- TOC entry 5097 (class 0 OID 73918)
-- Dependencies: 227
-- Data for Name: dossiers; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.dossiers (id, enfant_id, numero_dossier, code_acces_hash, code_expire_at, statut, created_at) FROM stdin;
\.


--
-- TOC entry 5095 (class 0 OID 73901)
-- Dependencies: 225
-- Data for Name: enfant_parents; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.enfant_parents (enfant_id, parent_id, lien) FROM stdin;
\.


--
-- TOC entry 5094 (class 0 OID 73877)
-- Dependencies: 224
-- Data for Name: enfants; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.enfants (id, nom, prenom, sexe, date_naissance, lieu_naissance, photo_url, poids_naissance, taille_naissance, statut_vital, etablissement_id, agent_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5086 (class 0 OID 73806)
-- Dependencies: 216
-- Data for Name: etablissements; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.etablissements (id, nom, ville, adresse, telephone, actif, created_at) FROM stdin;
\.


--
-- TOC entry 5112 (class 0 OID 74095)
-- Dependencies: 242
-- Data for Name: journal_audit; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.journal_audit (id, utilisateur_id, action, entite, entite_id, details, ip, created_at) FROM stdin;
\.


--
-- TOC entry 5092 (class 0 OID 73859)
-- Dependencies: 222
-- Data for Name: parents; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.parents (id, nom, prenom, telephone, email, adresse, utilisateur_id, created_at) FROM stdin;
\.


--
-- TOC entry 5108 (class 0 OID 74043)
-- Dependencies: 238
-- Data for Name: rappels; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rappels (id, enfant_id, type, declaration_id, vaccination_id, date_echeance, date_affichage, statut, lu_at, created_at) FROM stdin;
\.


--
-- TOC entry 5090 (class 0 OID 73842)
-- Dependencies: 220
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.refresh_tokens (id, utilisateur_id, token_hash, expires_at, revoque, created_at) FROM stdin;
\.


--
-- TOC entry 5110 (class 0 OID 74070)
-- Dependencies: 240
-- Data for Name: rendez_vous; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rendez_vous (id, enfant_id, etablissement_id, vaccination_id, date_rdv, motif, statut, created_at) FROM stdin;
\.


--
-- TOC entry 5088 (class 0 OID 73818)
-- Dependencies: 218
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.utilisateurs (id, nom_complet, telephone, email, mot_de_passe_hash, role, etablissement_id, actif, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5106 (class 0 OID 74009)
-- Dependencies: 236
-- Data for Name: vaccinations; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.vaccinations (id, enfant_id, calendrier_id, date_prevue, statut, date_administration, agent_id, etablissement_id, numero_lot, created_at) FROM stdin;
\.


--
-- TOC entry 5102 (class 0 OID 73978)
-- Dependencies: 232
-- Data for Name: vaccins; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.vaccins (id, code, nom, description) FROM stdin;
1	BCG	BCG	\N
2	VPI	Polio inactivé (VPI)	\N
3	ROUGEOLE	Rougeole	\N
\.


--
-- TOC entry 5133 (class 0 OID 0)
-- Dependencies: 233
-- Name: calendrier_vaccinal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.calendrier_vaccinal_id_seq', 4, true);


--
-- TOC entry 5134 (class 0 OID 0)
-- Dependencies: 229
-- Name: declarations_naissance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.declarations_naissance_id_seq', 1, false);


--
-- TOC entry 5135 (class 0 OID 0)
-- Dependencies: 226
-- Name: dossiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.dossiers_id_seq', 1, false);


--
-- TOC entry 5136 (class 0 OID 0)
-- Dependencies: 223
-- Name: enfants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.enfants_id_seq', 1, false);


--
-- TOC entry 5137 (class 0 OID 0)
-- Dependencies: 215
-- Name: etablissements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.etablissements_id_seq', 1, false);


--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 241
-- Name: journal_audit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.journal_audit_id_seq', 1, false);


--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 221
-- Name: parents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.parents_id_seq', 1, false);


--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 237
-- Name: rappels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rappels_id_seq', 1, false);


--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 219
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.refresh_tokens_id_seq', 1, false);


--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 239
-- Name: rendez_vous_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rendez_vous_id_seq', 1, false);


--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 217
-- Name: utilisateurs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.utilisateurs_id_seq', 1, false);


--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 235
-- Name: vaccinations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.vaccinations_id_seq', 1, false);


--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 231
-- Name: vaccins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.vaccins_id_seq', 3, true);


--
-- TOC entry 4879 (class 2606 OID 73940)
-- Name: acces_dossier acces_dossier_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.acces_dossier
    ADD CONSTRAINT acces_dossier_pkey PRIMARY KEY (utilisateur_id, dossier_id);


--
-- TOC entry 4895 (class 2606 OID 74000)
-- Name: calendrier_vaccinal calendrier_vaccinal_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.calendrier_vaccinal
    ADD CONSTRAINT calendrier_vaccinal_pkey PRIMARY KEY (id);


--
-- TOC entry 4897 (class 2606 OID 74002)
-- Name: calendrier_vaccinal calendrier_vaccinal_vaccin_id_dose_numero_version_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.calendrier_vaccinal
    ADD CONSTRAINT calendrier_vaccinal_vaccin_id_dose_numero_version_key UNIQUE (vaccin_id, dose_numero, version);


--
-- TOC entry 4882 (class 2606 OID 73968)
-- Name: declarations_naissance declarations_naissance_certificat_token_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance
    ADD CONSTRAINT declarations_naissance_certificat_token_key UNIQUE (certificat_token);


--
-- TOC entry 4884 (class 2606 OID 73964)
-- Name: declarations_naissance declarations_naissance_dossier_id_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance
    ADD CONSTRAINT declarations_naissance_dossier_id_key UNIQUE (dossier_id);


--
-- TOC entry 4886 (class 2606 OID 73966)
-- Name: declarations_naissance declarations_naissance_numero_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance
    ADD CONSTRAINT declarations_naissance_numero_key UNIQUE (numero);


--
-- TOC entry 4888 (class 2606 OID 73962)
-- Name: declarations_naissance declarations_naissance_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance
    ADD CONSTRAINT declarations_naissance_pkey PRIMARY KEY (id);


--
-- TOC entry 4873 (class 2606 OID 73927)
-- Name: dossiers dossiers_enfant_id_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_enfant_id_key UNIQUE (enfant_id);


--
-- TOC entry 4875 (class 2606 OID 73929)
-- Name: dossiers dossiers_numero_dossier_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_numero_dossier_key UNIQUE (numero_dossier);


--
-- TOC entry 4877 (class 2606 OID 73925)
-- Name: dossiers dossiers_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_pkey PRIMARY KEY (id);


--
-- TOC entry 4870 (class 2606 OID 73905)
-- Name: enfant_parents enfant_parents_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfant_parents
    ADD CONSTRAINT enfant_parents_pkey PRIMARY KEY (enfant_id, parent_id);


--
-- TOC entry 4866 (class 2606 OID 73888)
-- Name: enfants enfants_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfants
    ADD CONSTRAINT enfants_pkey PRIMARY KEY (id);


--
-- TOC entry 4847 (class 2606 OID 73816)
-- Name: etablissements etablissements_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.etablissements
    ADD CONSTRAINT etablissements_pkey PRIMARY KEY (id);


--
-- TOC entry 4913 (class 2606 OID 74103)
-- Name: journal_audit journal_audit_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.journal_audit
    ADD CONSTRAINT journal_audit_pkey PRIMARY KEY (id);


--
-- TOC entry 4862 (class 2606 OID 73867)
-- Name: parents parents_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_pkey PRIMARY KEY (id);


--
-- TOC entry 4864 (class 2606 OID 73869)
-- Name: parents parents_utilisateur_id_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_utilisateur_id_key UNIQUE (utilisateur_id);


--
-- TOC entry 4906 (class 2606 OID 74051)
-- Name: rappels rappels_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rappels
    ADD CONSTRAINT rappels_pkey PRIMARY KEY (id);


--
-- TOC entry 4857 (class 2606 OID 73849)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- TOC entry 4859 (class 2606 OID 73851)
-- Name: refresh_tokens refresh_tokens_token_hash_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);


--
-- TOC entry 4909 (class 2606 OID 74077)
-- Name: rendez_vous rendez_vous_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_pkey PRIMARY KEY (id);


--
-- TOC entry 4850 (class 2606 OID 73834)
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- TOC entry 4852 (class 2606 OID 73830)
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id);


--
-- TOC entry 4854 (class 2606 OID 73832)
-- Name: utilisateurs utilisateurs_telephone_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_telephone_key UNIQUE (telephone);


--
-- TOC entry 4900 (class 2606 OID 74019)
-- Name: vaccinations vaccinations_enfant_id_calendrier_id_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_enfant_id_calendrier_id_key UNIQUE (enfant_id, calendrier_id);


--
-- TOC entry 4902 (class 2606 OID 74017)
-- Name: vaccinations vaccinations_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_pkey PRIMARY KEY (id);


--
-- TOC entry 4891 (class 2606 OID 73987)
-- Name: vaccins vaccins_code_key; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccins
    ADD CONSTRAINT vaccins_code_key UNIQUE (code);


--
-- TOC entry 4893 (class 2606 OID 73985)
-- Name: vaccins vaccins_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccins
    ADD CONSTRAINT vaccins_pkey PRIMARY KEY (id);


--
-- TOC entry 4880 (class 1259 OID 73951)
-- Name: idx_acces_dossier_dossier; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_acces_dossier_dossier ON public.acces_dossier USING btree (dossier_id);


--
-- TOC entry 4910 (class 1259 OID 74110)
-- Name: idx_audit_entite; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_audit_entite ON public.journal_audit USING btree (entite, entite_id);


--
-- TOC entry 4911 (class 1259 OID 74109)
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_audit_user ON public.journal_audit USING btree (utilisateur_id, created_at);


--
-- TOC entry 4889 (class 1259 OID 73974)
-- Name: idx_declarations_limite; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_declarations_limite ON public.declarations_naissance USING btree (date_limite, statut);


--
-- TOC entry 4871 (class 1259 OID 73916)
-- Name: idx_enfant_parents_parent; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_enfant_parents_parent ON public.enfant_parents USING btree (parent_id);


--
-- TOC entry 4867 (class 1259 OID 73900)
-- Name: idx_enfants_agent; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_enfants_agent ON public.enfants USING btree (agent_id);


--
-- TOC entry 4868 (class 1259 OID 73899)
-- Name: idx_enfants_etablissement; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_enfants_etablissement ON public.enfants USING btree (etablissement_id, date_naissance);


--
-- TOC entry 4860 (class 1259 OID 73875)
-- Name: idx_parents_telephone; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_parents_telephone ON public.parents USING btree (telephone);


--
-- TOC entry 4903 (class 1259 OID 74068)
-- Name: idx_rappels_affichage; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_rappels_affichage ON public.rappels USING btree (date_affichage, statut);


--
-- TOC entry 4904 (class 1259 OID 74067)
-- Name: idx_rappels_enfant; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_rappels_enfant ON public.rappels USING btree (enfant_id, statut);


--
-- TOC entry 4907 (class 1259 OID 74093)
-- Name: idx_rdv_date; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_rdv_date ON public.rendez_vous USING btree (etablissement_id, date_rdv);


--
-- TOC entry 4855 (class 1259 OID 73857)
-- Name: idx_refresh_tokens_user; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_refresh_tokens_user ON public.refresh_tokens USING btree (utilisateur_id);


--
-- TOC entry 4848 (class 1259 OID 73840)
-- Name: idx_utilisateurs_etablissement; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_utilisateurs_etablissement ON public.utilisateurs USING btree (etablissement_id);


--
-- TOC entry 4898 (class 1259 OID 74040)
-- Name: idx_vaccinations_echeance; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX idx_vaccinations_echeance ON public.vaccinations USING btree (date_prevue, statut);


--
-- TOC entry 4939 (class 2620 OID 73976)
-- Name: declarations_naissance trg_declaration_date_limite; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_declaration_date_limite BEFORE INSERT ON public.declarations_naissance FOR EACH ROW EXECUTE FUNCTION public.fn_set_date_limite();


--
-- TOC entry 4938 (class 2620 OID 74113)
-- Name: enfants trg_enfants_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_enfants_updated BEFORE UPDATE ON public.enfants FOR EACH ROW EXECUTE FUNCTION public.fn_touch_updated_at();


--
-- TOC entry 4937 (class 2620 OID 74112)
-- Name: utilisateurs trg_utilisateurs_updated; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER trg_utilisateurs_updated BEFORE UPDATE ON public.utilisateurs FOR EACH ROW EXECUTE FUNCTION public.fn_touch_updated_at();


--
-- TOC entry 4922 (class 2606 OID 73946)
-- Name: acces_dossier acces_dossier_dossier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.acces_dossier
    ADD CONSTRAINT acces_dossier_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.dossiers(id) ON DELETE CASCADE;


--
-- TOC entry 4923 (class 2606 OID 73941)
-- Name: acces_dossier acces_dossier_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.acces_dossier
    ADD CONSTRAINT acces_dossier_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- TOC entry 4925 (class 2606 OID 74003)
-- Name: calendrier_vaccinal calendrier_vaccinal_vaccin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.calendrier_vaccinal
    ADD CONSTRAINT calendrier_vaccinal_vaccin_id_fkey FOREIGN KEY (vaccin_id) REFERENCES public.vaccins(id);


--
-- TOC entry 4924 (class 2606 OID 73969)
-- Name: declarations_naissance declarations_naissance_dossier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.declarations_naissance
    ADD CONSTRAINT declarations_naissance_dossier_id_fkey FOREIGN KEY (dossier_id) REFERENCES public.dossiers(id) ON DELETE CASCADE;


--
-- TOC entry 4921 (class 2606 OID 73930)
-- Name: dossiers dossiers_enfant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.dossiers
    ADD CONSTRAINT dossiers_enfant_id_fkey FOREIGN KEY (enfant_id) REFERENCES public.enfants(id) ON DELETE CASCADE;


--
-- TOC entry 4919 (class 2606 OID 73906)
-- Name: enfant_parents enfant_parents_enfant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfant_parents
    ADD CONSTRAINT enfant_parents_enfant_id_fkey FOREIGN KEY (enfant_id) REFERENCES public.enfants(id) ON DELETE CASCADE;


--
-- TOC entry 4920 (class 2606 OID 73911)
-- Name: enfant_parents enfant_parents_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfant_parents
    ADD CONSTRAINT enfant_parents_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.parents(id) ON DELETE CASCADE;


--
-- TOC entry 4917 (class 2606 OID 73894)
-- Name: enfants enfants_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfants
    ADD CONSTRAINT enfants_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.utilisateurs(id);


--
-- TOC entry 4918 (class 2606 OID 73889)
-- Name: enfants enfants_etablissement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.enfants
    ADD CONSTRAINT enfants_etablissement_id_fkey FOREIGN KEY (etablissement_id) REFERENCES public.etablissements(id);


--
-- TOC entry 4936 (class 2606 OID 74104)
-- Name: journal_audit journal_audit_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.journal_audit
    ADD CONSTRAINT journal_audit_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE SET NULL;


--
-- TOC entry 4916 (class 2606 OID 73870)
-- Name: parents parents_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.parents
    ADD CONSTRAINT parents_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE SET NULL;


--
-- TOC entry 4930 (class 2606 OID 74057)
-- Name: rappels rappels_declaration_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rappels
    ADD CONSTRAINT rappels_declaration_id_fkey FOREIGN KEY (declaration_id) REFERENCES public.declarations_naissance(id) ON DELETE CASCADE;


--
-- TOC entry 4931 (class 2606 OID 74052)
-- Name: rappels rappels_enfant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rappels
    ADD CONSTRAINT rappels_enfant_id_fkey FOREIGN KEY (enfant_id) REFERENCES public.enfants(id) ON DELETE CASCADE;


--
-- TOC entry 4932 (class 2606 OID 74062)
-- Name: rappels rappels_vaccination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rappels
    ADD CONSTRAINT rappels_vaccination_id_fkey FOREIGN KEY (vaccination_id) REFERENCES public.vaccinations(id) ON DELETE CASCADE;


--
-- TOC entry 4915 (class 2606 OID 73852)
-- Name: refresh_tokens refresh_tokens_utilisateur_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_utilisateur_id_fkey FOREIGN KEY (utilisateur_id) REFERENCES public.utilisateurs(id) ON DELETE CASCADE;


--
-- TOC entry 4933 (class 2606 OID 74078)
-- Name: rendez_vous rendez_vous_enfant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_enfant_id_fkey FOREIGN KEY (enfant_id) REFERENCES public.enfants(id) ON DELETE CASCADE;


--
-- TOC entry 4934 (class 2606 OID 74083)
-- Name: rendez_vous rendez_vous_etablissement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_etablissement_id_fkey FOREIGN KEY (etablissement_id) REFERENCES public.etablissements(id);


--
-- TOC entry 4935 (class 2606 OID 74088)
-- Name: rendez_vous rendez_vous_vaccination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rendez_vous
    ADD CONSTRAINT rendez_vous_vaccination_id_fkey FOREIGN KEY (vaccination_id) REFERENCES public.vaccinations(id) ON DELETE SET NULL;


--
-- TOC entry 4914 (class 2606 OID 73835)
-- Name: utilisateurs utilisateurs_etablissement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_etablissement_id_fkey FOREIGN KEY (etablissement_id) REFERENCES public.etablissements(id) ON DELETE SET NULL;


--
-- TOC entry 4926 (class 2606 OID 74030)
-- Name: vaccinations vaccinations_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.utilisateurs(id);


--
-- TOC entry 4927 (class 2606 OID 74025)
-- Name: vaccinations vaccinations_calendrier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_calendrier_id_fkey FOREIGN KEY (calendrier_id) REFERENCES public.calendrier_vaccinal(id);


--
-- TOC entry 4928 (class 2606 OID 74020)
-- Name: vaccinations vaccinations_enfant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_enfant_id_fkey FOREIGN KEY (enfant_id) REFERENCES public.enfants(id) ON DELETE CASCADE;


--
-- TOC entry 4929 (class 2606 OID 74035)
-- Name: vaccinations vaccinations_etablissement_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.vaccinations
    ADD CONSTRAINT vaccinations_etablissement_id_fkey FOREIGN KEY (etablissement_id) REFERENCES public.etablissements(id);


--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: root
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2026-09-30 21:40:49

--
-- PostgreSQL database dump complete
--

\unrestrict iguJ3SDdBMDHPgqGKaKrmXPSi70bVOzXkdYOvSInXvHfHmnfSxQL1aitmD5fldR

