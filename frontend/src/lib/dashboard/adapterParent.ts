import type {
  ParentDashboardData,
  StepStatus,
  VaccinationSummary,
} from "./types";

import type { Echeance, ParentEspace, Rappel } from "@/services/api";

/**
 * Traduit la réponse de `GET /api/parents/espace` vers la forme de présentation
 * attendue par les composants.
 *
 * L'interface consomme des dates déjà formatées (`JJ/MM/AAAA`) et des libellés
 * en français ; l'API renvoie de l'ISO et des statuts techniques
 * (`a_venir`, `effectue`). Cette couche est le seul endroit qui connaît les deux
 * vocabulary.
 */

/** `2026-10-01` → `01/10/2026`. */
export function toDisplayDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Âge lisible : « 6 mois » jusqu'à 2 ans, puis « 2 ans et 3 mois ».
 * Une date de naissance en cours de saisie produit une durée négative, d'où la
 * mise à zéro.
 */
export function ageLabel(iso: string): string {
  const naissance = new Date(iso);
  if (Number.isNaN(naissance.getTime())) return "";

  const maintenant = new Date();
  const annees = maintenant.getFullYear() - naissance.getFullYear();
  const moisAnnules = maintenant.getMonth() - naissance.getMonth();

  const totalMois = Math.max(0, annees * 12 + moisAnnules);
  if (totalMois < 1) return "Moins d'un mois";
  if (totalMois < 24) return `${totalMois} mois`;

  const anneesEntiers = Math.floor(totalMois / 12);
  const reste = totalMois % 12;
  if (reste === 0) return `${anneesEntiers} an${anneesEntiers > 1 ? "s" : ""}`;
  return `${anneesEntiers} an${anneesEntiers > 1 ? "s" : ""} et ${reste} mois`;
}

/** `vaccin_nom` + `dose_numero` → un libellé unique, ex. « Penta 1 ». */
function libelleEcheance(echeance: Echeance): string {
  return `${echeance.vaccin_nom} ${echeance.dose_numero}`;
}

function aVaccinationSummary(echeance: Echeance): VaccinationSummary {
  return {
    vaccineName: libelleEcheance(echeance),
    doseLabel: `Dose ${echeance.dose_numero}`,
    date: toDisplayDate(echeance.date_prevue),
    daysUntil: echeance.jours_restants,
    status:
      echeance.statut === "effectue"
        ? "effectuee"
        : echeance.statut === "en_retard"
          ? "retard"
          : "a-venir",
  };
}

/**
 * Les rappels n'ont pas de champ « lu » côté API : le compte à rebours et la
 * date d'échéance suffisent. Ils sont donc tous comptés comme à traiter, ce qui
 * alimente le badge de la cloche.
 */
function aNotification(rappel: Rappel, index: number) {
  return {
    id: `rappel-${index}-${rappel.type}`,
    title: rappel.titre,
    body: rappel.prochaine_demarche ?? "",
    date: toDisplayDate(rappel.date_echeance),
    read: false,
  };
}

/**
 * Construit le jeu de données du dashboard Parent à partir de l'espace API.
 *
 * `parent` vient de la session (le nom du parent n'est pas dans `espace`) ; les
 * actions rapides sont statiques et restent ici.
 */
export function versParentDashboard(
  espace: ParentEspace | undefined,
  parent: { firstName: string; lastName: string },
): ParentDashboardData {
  const enfant = espace?.enfant;
  const declaration = espace?.declaration;
  const rappels = espace?.rappels ?? [];

  /* Compte à rebours : le backend fournit statut, date limite et jours restants.
     `jours_restants` est négatif quand le délai est dépassé, d'où le `Math.max`
     pour l'affichage ; c'est `statut` qui distingue « en cours » de « dépassé ». */
  const joursRestants = Math.max(0, declaration?.jours_restants ?? 0);
  const delai = 30;
  const civilRegistration = {
    deadline: declaration?.date_limite
      ? toDisplayDate(declaration.date_limite)
      : "",
    daysLeft: joursRestants,
    progress: Math.min(1, Math.max(0, (delai - joursRestants) / delai)),
    isDone: declaration?.statut === "declaree",
  };

  /* Prochaine vaccination : le backend la donne déjà. À défaut, on prend la
     première échéance non faite. */
  const prochaine = espace?.prochaine_echeance ?? null;

  /* Les « dernières étapes » sont derivées du calendrier vaccinal : les doses
     faites deviennent « done », la prochaine « current », le reste « upcoming ».
     Sans donnée API, la liste reste vide plutôt que d'inventer des étapes. */
  const echeances = espace?.echeances ?? [];
  const prochaineId = prochaine?.calendrier_id;
  const lastSteps = echeances.slice(0, 4).map((echeance): {
    id: string;
    title: string;
    description: string;
    status: StepStatus;
    date?: string;
  } => {
    const status: StepStatus =
      echeance.statut === "effectue"
        ? "done"
        : echeance.calendrier_id === prochaineId
          ? "current"
          : "upcoming";
    return {
      id: `echeance-${echeance.calendrier_id}`,
      title: libelleEcheance(echeance),
      description:
        echeance.statut === "effectue"
          ? "Dose administrée."
          : `Prévu le ${toDisplayDate(echeance.date_prevue)}`,
      status,
      ...(echeance.statut === "effectue"
        ? { date: toDisplayDate(echeance.date_prevue) }
        : {}),
    };
  });

  return {
    parent: {
      firstName: parent.firstName,
      lastName: parent.lastName,
      roleLabel: "Parent",
      initials: `${parent.firstName.charAt(0)}${parent.lastName.charAt(0)}`,
    },

    child: {
      firstName: enfant?.prenom ?? "",
      lastName: enfant?.nom ?? "",
      birthDate: enfant ? toDisplayDate(enfant.date_naissance) : "",
      ageLabel: enfant ? ageLabel(enfant.date_naissance) : "",
      sex: enfant?.sexe ?? "M",
      recordNumber: espace?.dossier.numero ?? "",
      // Poids et taille ne figurent pas dans `espace` : l'API ne renvoie que
      // les donnés de naissance pour l'écran d'accueil. Zéro afficherait « 0 kg »,
      // on omet donc la ligne.
      weightKg: null,
      heightCm: null,
    },

    nextVaccination: prochaine
      ? aVaccinationSummary(prochaine)
      : {
          vaccineName: "Aucune échéance",
          doseLabel: "",
          date: "",
          daysUntil: 0,
          status: "a-venir",
        },

    lastSteps,

    civilRegistration,

    notifications: rappels.map(aNotification),

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
}
