/**
 * Contrats de donnees des dashboards Parent et Agent.
 *
 * Ces interfaces decrivent la forme attendue par l'interface. Elles sont
 * volontairement independantes de la couche reseau : le jour ou l'API est
 * branchee, il suffira de typer la reponse et de supprimer `mockParentData` /
 * `mockAgentData`. Les composants ne doivent lire QUE ces types.
 */

/* ---------- Commun ---------- */

/** Statut d'une etape du parcours de l'enfant. */
export type StepStatus = "done" | "current" | "upcoming";

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: StepStatus;
  /** Date cible au format ISO (AAAA-MM-JJ). */
  date?: string;
}

/* ---------- Parent ---------- */

export interface ParentProfile {
  firstName: string;
  lastName: string;
  /** Role affiche sous le nom dans l'en-tete. */
  roleLabel: string;
  initials: string;
}

export interface ChildSummary {
  firstName: string;
  lastName: string;
  /** Date de naissance au format JJ/MM/AAAA. */
  birthDate: string;
  ageLabel: string;
  sex: "F" | "M";
  /** Identifiant du dossier, tel qu'affiche dans l'interface. */
  recordNumber: string;
  /** Poids et taille, uniquement pour la presentation. */
  weightKg: number;
  heightCm: number;
}

export interface VaccinationSummary {
  vaccineName: string;
  /** Mois de l'-ieme dose. */
  doseLabel: string;
  /** Date cible au format JJ/MM/AAAA. */
  date: string;
  /** Nombre de jours restants avant la date cible. */
  daysUntil: number;
  status: "a-venir" | "effectuee" | "retard";
}

export interface CivilRegistrationCountdown {
  /** Date limite au format JJ/MM/AAAA. */
  deadline: string;
  /** Jours restants avant l'echeance. */
  daysLeft: number;
  /** Fraction du delai deja ecoulee (0 -> 1). */
  progress: number;
  isDone: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  /** Date au format JJ/MM/AAAA. */
  date: string;
  read: boolean;
}

export interface QuickAction {
  label: string;
  description: string;
  /** Route interne du dashboard. */
  to: string;
}

export interface ParentDashboardData {
  parent: ParentProfile;
  child: ChildSummary;
  nextVaccination: VaccinationSummary;
  lastSteps: TimelineStep[];
  civilRegistration: CivilRegistrationCountdown;
  notifications: NotificationItem[];
  quickActions: QuickAction[];
}

/* ---------- Agent ---------- */

export interface AgentProfile {
  firstName: string;
  lastName: string;
  roleLabel: string;
  initials: string;
  /** Etablissement ou service d'affectation. */
  facility: string;
}

export interface AgentStat {
  id: string;
  label: string;
  value: number;
  /** Variation sur la periode, en pourcentage. */
  trend?: number;
  hint: string;
}

export type RecordStatus = "complet" | "incomplet" | "a-valider";

export interface NewbornRecord {
  id: string;
  /** Reference du dossier. */
  recordNumber: string;
  babyName: string;
  parentName: string;
  /** Date au format JJ/MM/AAAA. */
  birthDate: string;
  status: RecordStatus;
  statusLabel: string;
}

export interface PendingVaccination {
  id: string;
  babyName: string;
  vaccineName: string;
  /** Date cible au format JJ/MM/AAAA. */
  dueDate: string;
  /** Nombre de jours de retard. */
  overdueDays: number;
}