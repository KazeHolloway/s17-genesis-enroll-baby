/**
 * Client HTTP de l'API Enroll Baby.
 *
 * Toutes les requêtes passent par ici, ce qui garantit trois choses :
 *  - le `token` est envoyé automatiquement quand il existe,
 *  - un `401` remonte une erreur unique et exploitable par l'appelant,
 *  - les identifiants restent des nombres : le backend répond `400` si on
 *    envoie `"1"` au lieu de `1`.
 *
 * Deux formes de réponse coexistent côté API :
 *  - `{ success, message, data }` pour la plupart des routes,
 *  - l'objet nu pour `/api/enfants` et `/api/dossiers`.
 * `request` gère les deux : il ne déballe pas, il retourne la réponse brute.
 */

import type { CountdownDeclaration } from "@/lib/types";

/** Origine du serveur API, pour reconstruire les URLs relatives (certificat…). */
export const API_ORIGIN = "http://localhost:5000";

const API_URL = `${API_ORIGIN}/api`;

const TOKEN_KEY = "enroll_baby_token";

/* ---------- Token ---------- */

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    // Navigation privée ou stockage bloqué : on reste non authentifié
    // plutôt que de casser le rendu.
    return null;
  }
}

export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Ignoré : le token ne sera simplement pas persisté.
  }
}

/* ---------- Erreurs ---------- */

/**
 * Erreur portant le statut HTTP, pour que l'appelant distingue un `401`
 * (session expirée) d'un `400` (données invalides) sans lire le message.
 * Le message du backend est en français et directement affichable.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  /** Session expirée ou absente : l'utilisateur doit se reconnecter. */
  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  /** Rôle interdit : le compte n'a pas les droits sur cette route. */
  get isForbidden(): boolean {
    return this.status === 403;
  }

  /** Conflit : code d'accès déjà utilisé, enfant déjà enregistré. */
  get isConflict(): boolean {
    return this.status === 409;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** Corps envoyé en JSON. */
  body?: unknown;
  /** Force l'envoi du token même si aucun n'est stocké (routes publiques). */
  auth?: boolean;
  /** Réception attendue : `json` par défaut, `text` pour les pages HTML. */
  expect?: "json" | "text";
  /** En-têtes additionnels, pour les cas où le token est fourni à l'appel. */
  headers?: Record<string, string>;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true, expect = "json", headers: extra } = options;

  const headers: Record<string, string> = { ...extra };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  // Un Authorization fourni explicitement prime sur celui de la session :
  // l'appelant qui passe son token veut précisément celui-là.
  if (auth && !headers.Authorization) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let reponse: Response;
  try {
    reponse = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Impossible de joindre le serveur");
  }

  if (!reponse.ok) {
    // Le backend renvoie { message } sur les erreurs, dans les deux formats.
    let message = "Une erreur est survenue";
    try {
      const erreur = (await reponse.json()) as { message?: string };
      if (erreur.message) message = erreur.message;
    } catch {
      // Corps non JSON : on garde le message générique.
    }
    throw new ApiError(reponse.status, message);
  }

  if (expect === "text") return (await reponse.text()) as T;
  return (await reponse.json()) as T;
}

/* ---------- Authentification ---------- */

/**
 * Utilisateur tel que renvoyé par `/auth/login` et `/auth/moi`.
 *
 * La base ne stocke qu'une colonne `nom_complet` : le backend ne renvoie donc
 * pas de champs `nom` / `prenom` séparés. Les lire déclencherait un
 * `undefined`, et tout accès direct (`utilisateur.prenom.charAt(0)`) ferait
 * tomber l'écran. Passer par `identiteUtilisateur()` ci-dessous.
 */
export interface Utilisateur {
  id: number;
  nom_complet: string;
  telephone: string;
  email: string | null;
  role: "parent" | "agent_maternite" | "admin";
  etablissement_id: number | null;
  actif: boolean;
}

export interface Identite {
  firstName: string;
  lastName: string;
  initials: string;
}

/**
 * Décompose `nom_complet` en prénom et nom pour l'affichage.
 *
 * « Rosine Loubaki » → `{ firstName: "Rosine", lastName: "Loubaki" }`.
 * Un nom unique (« Marie ») bascule tout sur le prénom : l'écart est invisible
 * à l'affichage, alors qu'une regexp plus fine se tromperait sur les noms
 * composés à particule (« Marie Nkoulou »).
 */
export function identiteUtilisateur(u: Utilisateur | null): Identite {
  const complet = (u?.nom_complet ?? "").trim();
  if (!complet) return { firstName: "", lastName: "", initials: "" };

  const parties = complet.split(/\s+/);
  const lastName = parties.length > 1 ? parties.pop() ?? "" : "";
  const firstName = parties.join(" ");

  return {
    firstName,
    lastName,
    initials: `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase(),
  };
}

export interface LoginReponse {
  success: boolean;
  message: string;
  data: { token: string; utilisateur: Utilisateur };
}

export function login(telephone: string, motDePasse: string) {
  return request<LoginReponse>("/auth/login", {
    method: "POST",
    body: { telephone, mot_de_passe: motDePasse },
    auth: false,
  });
}

/**
 * Recharge la session au rafraîchissement de page.
 * Un `401` est attendu quand aucun token n'est valide : il est converti en
 * session vide plutôt qu'en erreur, pour ne pas casser le premier rendu.
 */
export async function moi(): Promise<{
  utilisateur: Utilisateur | null;
  dossiers: unknown[];
}> {
  if (!getToken()) return { utilisateur: null, dossiers: [] };
  try {
    const reponse = await request<{
      data: { utilisateur: Utilisateur; dossiers: unknown[] };
    }>("/auth/moi");
    return reponse.data;
  } catch {
    return { utilisateur: null, dossiers: [] };
  }
}

/* ---------- Espace parent ---------- */

/**
 * Réponse de `GET /api/parents/espace`.
 *
 * Elle ne fournit pas `photo` : les identités affichées côté front sont
 * générées à partir du prénom et du nom.
 */
export interface ParentEspace {
  dossier: { id: number; numero: string; statut: string };
  enfant: {
    id: number;
    nom: string;
    prenom: string;
    sexe: "M" | "F";
    date_naissance: string;
    lieu_naissance: string;
    etablissement: string | null;
  };
  declaration: {
    statut: "en_cours" | "delai_expire" | "declaree";
    /** Négatif quand le délai est dépassé : -10 signifie 10 jours de retard. */
    jours_restants: number;
    /** Date limite J+30, telle que calculée par le serveur. */
    date_limite: string | null;
    date_declaration: string | null;
    message: string;
  } | null;
  prochaine_demarche: string | null;
  prochaine_echeance: Echeance | null;
  echeances: Echeance[];
  rappels: Rappel[];
}

export interface Echeance {
  calendrier_id: number;
  /** Code court du vaccin, ex. « VPI ». */
  code: string;
  vaccin_nom: string;
  dose_numero: number;
  age_cible_jours: number;
  date_prevue: string;
  /** Négatif quand la dose est en retard. */
  jours_restants: number;
  statut: "a_venir" | "en_retard" | "effectue";
  date_administration: string | null;
}

export interface Rappel {
  type: "vaccin" | "declaration";
  titre: string;
  date_echeance: string;
  jours_restants: number;
  statut: string;
  prochaine_demarche: string | null;
}

export interface ParentEspaceReponse {
  success: boolean;
  message: string;
  data: { enfants: ParentEspace[] };
}

/**
 * Compte à rebours J+30 d'un dossier.
 *
 * Déballe `data` pour l'appelant : le composant n'a pas à connaître la forme
 * `{ success, message, data }`. Le token est pris en paramètre explicite car ce
 * composant est utilisable hors session (aperçu d'un dossier par un agent).
 */
export async function getCountdownDeclaration(
  dossierId: number,
  token?: string,
): Promise<CountdownDeclaration> {
  const reponse = await request<{
    data: CountdownDeclaration;
  }>(`/declarations/dossier/${dossierId}/compte-a-rebours`, {
    auth: Boolean(token),
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
  return reponse.data;
}

export function getEspaceParent() {
  return request<ParentEspaceReponse>("/parents/espace");
}

/* ---------- Création de compte parent ---------- */

export interface InscriptionParentPayload {
  /** Code d'accès reçu par l'agent : c'est lui qui rattache le compte au dossier. */
  code_acces: string;
  nom: string;
  telephone: string;
  email?: string;
  mot_de_passe: string;
}

/**
 * `POST /api/parents/inscription` : route publique, le compte n'existe pas
 * encore. Le backend valide le code d'accès, refuse un code déjà utilisé et
 * crée l'utilisateur ; la session n'est donc pas ouverte ici, l'utilisateur
 * se connecte ensuite via `/auth/login`.
 */
export function inscriptionParent(
  payload: InscriptionParentPayload,
): Promise<{ success: boolean; message?: string }> {
  return request("/parents/inscription", {
    method: "POST",
    auth: false,
    body: payload,
  });
}

/* ---------- Enregistrement d'un nouveau-né (agent) ---------- */

export interface EnfantPayload {
  nom: string;
  prenom: string;
  /**
   * Doit valoir `"M"` ou `"F"`. Accepté en `string` parce que le `<select>` du
   * formulaire fournit toujours une chaîne ; l'API refuse toute autre valeur
   * avec un `400`.
   */
  sexe: string;
  date_naissance: string;
  lieu_naissance: string;
  poids_naissance?: number;
  taille_naissance?: number;
  statut_vital?: string;
}

export interface ParentPayload {
  nom: string;
  prenom: string;
  lien: "mere" | "pere" | "tuteur";
  telephone?: string;
  email?: string;
  adresse?: string;
}

/**
 * `POST /api/enfants/enregistrement` : crée le dossier et renvoie le code
 * d'accès. Cette route répond l'objet **direct**, sans enveloppe `data`.
 *
 * `dossier.code_acces` n'est renvoyé qu'ici, une seule fois dans toute la vie du
 * dossier : l'écran agent doit donc l'afficher immédiatement.
 */
export interface EnregistrementReponse {
  enfant: { id: number; nom: string; prenom: string };
  dossier: { id: number; numero: string; code_acces: string };
  parents: ParentPayload[];
}

export function enregistrerEnfant(payload: {
  enfant: EnfantPayload;
  parents: ParentPayload[];
}) {
  return request<EnregistrementReponse>("/enfants/enregistrement", {
    method: "POST",
    body: payload,
  });
}

/** `GET /api/parents/rappels` : tous les rappels, tous enfants confondus. */
export function getRappelsParent() {
  return request<{ data: { rappels: Rappel[] } }>("/parents/rappels");
}

/* ---------- Calendrier vaccinal ---------- */

export interface CalendrierReponse {
  data: { prochaine_echeance: Echeance | null; echeances: Echeance[] };
}

/** `enfantId` et `calendrierId` doivent être des nombres, pas des chaînes. */
export function getCalendrierVaccinal(enfantId: number) {
  return request<CalendrierReponse>(`/calendrier-vaccinal/enfant/${enfantId}`);
}

/**
 * Confirmation d'un vaccin (agent ou admin uniquement).
 * `date_administration` et `numero_lot` sont facultatifs côté backend.
 */
export function confirmerVaccin(payload: {
  enfant_id: number;
  calendrier_id: number;
  date_administration?: string;
  numero_lot?: string;
}) {
  return request<{ success: boolean; message: string }>("/vaccinations/confirmer", {
    method: "POST",
    body: payload,
  });
}

/* ---------- Rendez-vous de suivi et rappels 24 h ---------- */

export interface Etablissement {
  id: number;
  nom: string;
  ville: string;
  adresse: string | null;
  telephone: string | null;
}

export function getEtablissements() {
  return request<{ success: boolean; data: Etablissement[] }>("/etablissements");
}

/** Enfant listé par `GET /api/enfants` (réservé aux agents). */
export interface EnfantAgent {
  id: number;
  nom: string;
  prenom: string;
  sexe: "M" | "F";
  date_naissance: string;
  lieu_naissance: string | null;
  etablissement_id: number;
  statut_vital: string;
  /** Horodatage d'enregistrement (`created_at` de la table). */
  created_at: string;
}

/**
 * Détail d'un enfant (`GET /api/enfants/:id`) : le dossier et ses parents.
 * Le parent de l'enfant n'est pas dans la liste : seule cette route l'expose.
 */
export interface EnfantDetail extends EnfantAgent {
  numero_dossier: string | null;
  parents: ParentPayload[];
}

export function getEnfants() {
  return request<EnfantAgent[]>("/enfants");
}

export function getEnfantDetail(id: number) {
  return request<EnfantDetail>(`/enfants/${id}`);
}

/* ---------- Dossiers et statistiques (agent) ---------- */

/** Ligne de `GET /api/dossiers` (agent ou admin), avec l'enfant associé. */
export interface DossierAgent {
  id: number;
  numero_dossier: string;
  statut: "actif" | "archive";
  enfant_id: number;
  enfant_nom: string;
  enfant_prenom: string;
  created_at: string;
}

export function getDossiers() {
  return request<{ success: boolean; data: DossierAgent[] }>("/dossiers");
}

export interface StatistiquesParMois {
  mois: string;
  naissances: number;
  garcons: number;
  filles: number;
  mort_nes: number;
  deces: number;
}

export interface Statistiques {
  periode: { debut: string; fin: string };
  total: {
    naissances: number;
    garcons: number;
    filles: number;
    mort_nes: number;
    deces: number;
  };
  par_mois: StatistiquesParMois[];
}

/** `GET /api/statistiques?debut=AAAA-MM-JJ&fin=AAAA-MM-JJ` (agent ou admin). */
export function getStatistiques(debut: string, fin: string) {
  return request<{
    success: boolean;
    data: Statistiques;
  }>(`/statistiques?debut=${debut}&fin=${fin}`);
}

/* ---------- Documents imprimables ---------- */

/** `GET /api/imprimable/dossier/:id` : page HTML complète du dossier. */
export function getDossierImprimable(dossierId: number) {
  return request<string>(`/imprimable/dossier/${dossierId}`, { expect: "text" });
}

/** `GET /api/declarations/dossier/:id/imprimable` : déclaration de naissance. */
export function getDeclarationImprimable(dossierId: number) {
  return request<string>(`/declarations/dossier/${dossierId}/imprimable`, {
    expect: "text",
  });
}

/**
 * `GET /api/declarations/dossier/:id` : déclaration (générée si besoin) et lien
 * de certificat. Le `certificat_url` renvoyé est relatif (`/api/certificats/…`).
 */
export interface DeclarationDossier {
  numero: string;
  date_emission: string;
  statut: string;
  certificat_url: string | null;
  compte_a_rebours: unknown;
}

export function getDeclarationDossier(dossierId: number) {
  return request<{ success: boolean; data: DeclarationDossier }>(
    `/declarations/dossier/${dossierId}`,
  );
}

/**
 * Le certificat est une route publique protégée par son jeton : on reconstruit
 * une URL absolue depuis l'origine du serveur pour `window.open`.
 */
export function certificatUrlAbsolu(url: string): string {
  try {
    return new URL(url, API_ORIGIN).toString();
  } catch {
    return url;
  }
}

/**
 * Ligne de `rendez_vous`.
 *
 * `statut` suit exactement l'énumération du backend : `planifie`, `honore`,
 * `manque`, `annule`. Aucun mapping n'est nécessaire côté interface, les
 * badges reprennent ces quatre libellés.
 */
export interface RendezVous {
  id: number;
  enfant_id: number;
  vaccination_id: number | null;
  etablissement_id: number;
  date_rdv: string;
  motif: string | null;
  statut: "planifie" | "honore" | "manque" | "annule";
}

export function getRendezVousEnfant(enfantId: number) {
  return request<{ success: boolean; data: RendezVous[] }>(
    `/rendez-vous/enfant/${enfantId}`,
  );
}

/**
 * `POST /api/rendez-vous` : l'établissement n'est pas transmis, le serveur le
 * déduit de l'enfant. La date doit être dans le futur, sinon l'API répond 400.
 */
export function creerRendezVous(payload: {
  enfant_id: number;
  date_rdv: string;
  /** `null` et « non renseigné » sont équivalents : la colonne est nullable. */
  motif?: string | null;
  vaccination_id?: number | null;
}) {
  return request<{ success: boolean; message: string; data: RendezVous }>(
    "/rendez-vous",
    { method: "POST", body: payload },
  );
}

/** `PUT /api/rendez-vous/:id` : modifie date, motif et/ou statut. */
export function majRendezVous(
  id: number,
  payload: { date_rdv?: string; motif?: string; statut?: RendezVous["statut"] },
) {
  return request<{ success: boolean; message: string; data: RendezVous }>(
    `/rendez-vous/${id}`,
    { method: "PUT", body: payload },
  );
}

/**
 * Rappel 24 h d'un rendez-vous, tel que calculé par le serveur.
 *
 * Point important : aucun rappel n'est stocké en base. La requête SQL
 * `getRappelsParent` liste à la volée les rendez-vous `planifie` dont la date
 * tombe dans les prochaines 24 h. Les champs `statut` et `date_affichage`
 * n'existent donc pas dans cette réponse : `minutes_restantes` est calculé ici
 * pour afficher un compte à rebours, et un rendez-vous modifié ou annulé sort
 * naturellement de la liste au prochain appel.
 */
export interface RappelRendezVous {
  id: number;
  date_rdv: string;
  motif: string | null;
  enfant_id: number;
  enfant_prenom: string;
}

/** `GET /api/rendez-vous/rappels` : réservé au parent connecté. */
export function getRappelsRendezVous() {
  return request<{ success: boolean; data: RappelRendezVous[] }>(
    "/rendez-vous/rappels",
  );
}

export default request;
