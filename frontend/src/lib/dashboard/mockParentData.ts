import type { ParentDashboardData } from "./types";

/* ==========================================================================
   DONNEES DE PRESENTATION — A REMPLACER PAR L'API
   --------------------------------------------------------------------------
   Ce fichier n'existe que pour afficher une interface realiste. Il ne contient
   aucune logique metier et ne doit jamais etre utilise comme source de verite.

   Branchement API prevu :
     // avant
     import { parentDashboardMock } from "@/lib/dashboard/mockParentData";
     // apres
     const { data } = useParentDashboard(); // fetching dans le composant

   Les dates sont generees a partir de la date du jour pour que la demo reste
   credible quelle que soit la date de consultation. Des que l'API existe, elles
   viendront du serveur en format ISO et ce calcul disparaitra.
   ========================================================================== */

const DAY_MS = 24 * 60 * 60 * 1000;

function inDays(days: number): Date {
  return new Date(Date.now() + days * DAY_MS);
}

/** JJ/MM/AAAA — format de presentation utilise par toute l'interface. */
function toDisplayDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/** JJ/MM/AAAA HH:MM — pour les horodatages de notification et d'enregistrement. */
function toDisplayDateTime(date: Date): string {
  return `${toDisplayDate(date)} · ${date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

const registrationDeadline = inDays(12);

export const parentDashboardMock: ParentDashboardData = {
  parent: {
    firstName: "Awa",
    lastName: "Moussa",
    roleLabel: "Parent",
    initials: "AM",
  },

  child: {
    firstName: "Moussa",
    lastName: "Moussa",
    birthDate: "12/04/2025",
    ageLabel: "6 mois",
    sex: "M",
    recordNumber: "EB-2025-04871",
    weightKg: 7.4,
    heightCm: 68,
  },

  nextVaccination: {
    vaccineName: "Penta 3",
    doseLabel: "3ᵉ dose",
    date: toDisplayDate(inDays(183)),
    daysUntil: 183,
    status: "a-venir",
  },

  lastSteps: [
    {
      id: "step-maternite",
      title: "Enregistrement à la maternité",
      description: "Dossier du nouveau-né créé par la sage-femme.",
      status: "done",
      date: "12/04/2025",
    },
    {
      id: "step-acte-naissance",
      title: "Déclaration à l’état civil",
      description: "Acte de naissance délivré à la mairie.",
      status: "current",
    },
    {
      id: "step-penta-2",
      title: "Penta 2",
      description: "Deuxième dose du pentavalent.",
      status: "done",
      date: "12/07/2025",
    },
    {
      id: "step-penta-3",
      title: "Penta 3",
      description: "Prochaine échéance du calendrier vaccinal.",
      status: "upcoming",
    },
  ],

  civilRegistration: {
    deadline: toDisplayDate(registrationDeadline),
    daysLeft: 12,
    progress: 0.6,
    isDone: false,
  },

  notifications: [
    {
      id: "notif-1",
      title: "Rappel de vaccination",
      body: "La dose suivante du pentavalent est prévue dans six mois.",
      date: toDisplayDateTime(inDays(-1)),
      read: false,
    },
    {
      id: "notif-2",
      title: "Dossier incomplet",
      body: "Il manque la photocopie de l’acte de naissance pour finaliser le dossier.",
      date: toDisplayDateTime(inDays(-4)),
      read: false,
    },
    {
      id: "notif-3",
      title: "Code d’accès disponible",
      body: "Votre code d’accès à la maternité vous a été remis à la sortie.",
      date: toDisplayDateTime(inDays(-40)),
      read: true,
    },
  ],

  quickActions: [
    {
      label: "Mes enfants",
      description: "Consulter le dossier et l’historique",
      to: "/parent/enfants",
    },
    {
      label: "Vaccinations",
      description: "Calendrier et prochaines échéances",
      to: "/parent/vaccinations",
    },
    {
      label: "Documents",
      description: "Acte de naissance et fiche de vaccination",
      to: "/parent/documents",
    },
    {
      label: "Notifications",
      description: "Alertes et rappels du dossier",
      to: "/parent/notifications",
    },
  ],
};