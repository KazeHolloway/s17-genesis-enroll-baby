import type { AgentProfile, AgentStat, NewbornRecord, PendingVaccination } from "./types";

/* ==========================================================================
   DONNEES DE PRESENTATION — A REMPLACER PAR L'API
   --------------------------------------------------------------------------
   Meme principe que `mockParentData` : uniquement de l'affichage, aucune
   logique metier. Les developpeurs metier remplaceront ces exports par leurs
   propres hooks de fetching sans toucher aux composants des dashboards.
   ========================================================================== */

export const agentProfileMock: AgentProfile = {
  firstName: "Brichelvie",
  lastName: "Owala",
  roleLabel: "Agent de maternité",
  initials: "BO",
  facility: "Hôpital général de Brazzaville",
};

export const agentStatsMock: AgentStat[] = [
  {
    id: "stat-nouveaux-nes",
    label: "Nouveau-nés enregistrés",
    value: 128,
    trend: 12,
    hint: "Sur les 30 derniers jours",
  },
  {
    id: "stat-dossiers-recents",
    label: "Dossiers récents",
    value: 12,
    hint: "Créés dans les dernières 24 h",
  },
  {
    id: "stat-vaccinations",
    label: "Vaccinations à suivre",
    value: 5,
    hint: "Échéances de la semaine",
  },
  {
    id: "stat-dossiers-incomplets",
    label: "Dossiers incomplets",
    value: 3,
    trend: -8,
    hint: "Documents manquants",
  },
];

export const agentRecordsMock: NewbornRecord[] = [
  {
    id: "rec-1",
    recordNumber: "EB-2025-04902",
    babyName: "Moussa Moussa",
    parentName: "Awa Moussa",
    birthDate: "12/04/2025",
    status: "complet",
    statusLabel: "Complet",
  },
  {
    id: "rec-2",
    recordNumber: "EB-2025-04901",
    babyName: "Nadege Kimpanga",
    parentName: "Clarisse Kimpanga",
    birthDate: "13/04/2025",
    status: "a-valider",
    statusLabel: "À valider",
  },
  {
    id: "rec-3",
    recordNumber: "EB-2025-04898",
    babyName: "Zora Owala",
    parentName: "Bertrand Owala",
    birthDate: "11/04/2025",
    status: "incomplet",
    statusLabel: "Incomplet",
  },
];

export const agentIncompleteRecordsMock: NewbornRecord[] = [
  {
    id: "rec-inc-1",
    recordNumber: "EB-2025-04898",
    babyName: "Zora Owala",
    parentName: "Bertrand Owala",
    birthDate: "11/04/2025",
    status: "incomplet",
    statusLabel: "Acte de naissance manquant",
  },
  {
    id: "rec-inc-2",
    recordNumber: "EB-2025-04894",
    babyName: "Ilona Bassala",
    parentName: "Nathalie Bassala",
    birthDate: "09/04/2025",
    status: "incomplet",
    statusLabel: "Fiche de vaccination à compléter",
  },
  {
    id: "rec-inc-3",
    recordNumber: "EB-2025-04890",
    babyName: "Yvan M'Pemo",
    parentName: "Serge M'Pemo",
    birthDate: "08/04/2025",
    status: "incomplet",
    statusLabel: "Code d’accès non remis",
  },
];

export const agentPendingVaccinationsMock: PendingVaccination[] = [
  {
    id: "vac-1",
    babyName: "Moussa Moussa",
    vaccineName: "Penta 3",
    dueDate: "15/10/2025",
    overdueDays: 2,
  },
  {
    id: "vac-2",
    babyName: "Nadege Kimpanga",
    vaccineName: "BCG",
    dueDate: "16/10/2025",
    overdueDays: 1,
  },
  {
    id: "vac-3",
    babyName: "Zora Owala",
    vaccineName: "Polio 2",
    dueDate: "18/10/2025",
    overdueDays: 0,
  },
];

export const agentRecentEntriesMock: {
  id: string;
  babyName: string;
  facility: string;
  recordedAt: string;
}[] = [
  { id: "entry-1", babyName: "Moussa Moussa", facility: "Salle de naissance 2", recordedAt: "Aujourd’hui · 09:12" },
  { id: "entry-2", babyName: "Nadege Kimpanga", facility: "Salle de naissance 1", recordedAt: "Aujourd’hui · 08:47" },
  { id: "entry-3", babyName: "Zora Owala", facility: "Salle de naissance 2", recordedAt: "Hier · 17:03" },
  { id: "entry-4", babyName: "Ilona Bassala", facility: "Nurserie", recordedAt: "Hier · 15:38" },
];