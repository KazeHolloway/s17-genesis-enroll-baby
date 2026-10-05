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

const API_URL = "http://localhost:5000/api";

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

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string | null;
  role: "parent" | "agent_maternite" | "admin";
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

export default request;
