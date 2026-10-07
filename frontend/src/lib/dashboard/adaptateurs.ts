import type {
  Child,
  ChildGender,
  DocumentItem,
  NotificationItem,
  VaccineItem,
} from "@/types/dashboard";
import type {
  Echeance,
  EnfantDetail,
  EnfantPayload,
  ParentEspace,
  ParentPayload,
  Utilisateur,
} from "@/services/api";

/**
 * Adaptation des réponses de l'API actuelle vers les types `Child`,
 * `VaccineItem`, `DocumentItem` et `NotificationItem` consommés par les
 * tableaux de bord riches (`components/parent`, `components/agent`).
 *
 * Aucune donnée n'est inventée : chaque champ provient d'une réponse réelle,
 * les champs absents de l'API sont laissés vides plutôt que remplis avec une
 * valeur de démonstration.
 */

/** `2026-09-12` → `12/09/2026` ; une date déjà affichable est renvoyée telle quelle. */
export function dateEnFr(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("fr-FR");
}

/** Avatar généré à partir des initiales, dans l'esprit des cartes de la maquette. */
export function avatarInitiales(prenom: string, nom: string): string {
  const initiales =
    `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase().trim() || "?";
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">` +
    `<rect width="128" height="128" rx="64" fill="#1b5e52"/>` +
    `<text x="64" y="66" text-anchor="middle" dominant-baseline="central" ` +
    `font-family="Georgia, serif" font-size="46" font-weight="700" fill="#ffffff">` +
    `${initiales}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function sexeVersLibelle(sexe: "M" | "F"): ChildGender {
  return sexe === "M" ? "Garçon" : "Fille";
}

function libelleVersSexe(sexe: ChildGender): "M" | "F" {
  return sexe === "Garçon" ? "M" : "F";
}

/**
 * Statut d'affichage d'un dossier parent, déduit du compte à rebours J+30.
 * `declaree` = dossier complet, `delai_expire` = acte en attente de régularisation.
 */
function statutDossierParent(espace: ParentEspace): Child["status"] {
  switch (espace.declaration?.statut) {
    case "declaree":
      return "complet";
    case "delai_expire":
      return "attente_acte";
    default:
      return "en_cours";
  }
}

function etapesParent(espace: ParentEspace): Child["etapes"] {
  const declaree = espace.declaration?.statut === "declaree";
  const date = espace.declaration?.date_declaration;
  return [
    {
      titre: "Naissance enregistrée à la maternité",
      date: dateEnFr(espace.enfant.date_naissance),
      complete: true,
    },
    {
      titre: `Dossier maternité ${espace.dossier.numero}`,
      date: espace.dossier.numero,
      complete: true,
    },
    {
      titre: "Déclaration de naissance",
      date: declaree && date ? dateEnFr(date) : "Sous 30 jours",
      complete: declaree,
    },
    {
      titre: "Émission de l'acte d'état civil",
      date: declaree ? "Transmis en mairie" : "En attente",
      complete: declaree,
    },
  ];
}

function prochaineVaccination(
  echeance: Echeance | null,
): Child["prochaineVaccination"] {
  if (!echeance) return undefined;
  return {
    date: dateEnFr(echeance.date_prevue),
    nom: `${echeance.vaccin_nom} · dose ${echeance.dose_numero}`,
    joursRestants: echeance.jours_restants,
  };
}

/**
 * Espace parent → `Child[]`.
 *
 * `compte` est la session connectée : l'espace parent n'expose pas les
 * identités des parents, seul le compte rattaché au dossier est connu.
 */
export function espaceVersEnfants(
  espaces: ParentEspace[],
  compte: Utilisateur | null,
): Child[] {
  const identite = compte?.nom_complet ?? "";
  const telephone = compte?.telephone ?? "";

  return espaces.map((espace) => {
    const statut = statutDossierParent(espace);
    const sexe = sexeVersLibelle(espace.enfant.sexe);

    return {
      id: String(espace.enfant.id),
      nom: espace.enfant.nom,
      prenom: espace.enfant.prenom,
      dateNaissance: dateEnFr(espace.enfant.date_naissance),
      poids: "",
      taille: "",
      sexe,
      lieuNaissance: espace.enfant.lieu_naissance,
      photoUrl: avatarInitiales(espace.enfant.prenom, espace.enfant.nom),
      status: statut,
      referenceMaternite: espace.dossier.numero,
      delaiDeclarationJours: espace.declaration?.jours_restants,
      numeroActe:
        statut === "complet" && espace.declaration?.date_declaration
          ? `Déclarée le ${dateEnFr(espace.declaration.date_declaration)}`
          : undefined,
      mere: { nom: identite, telephone },
      pere: { nom: "", telephone: "" },
      prochaineVaccination: prochaineVaccination(espace.prochaine_echeance),
      etapes: etapesParent(espace),
    } satisfies Child;
  });
}

/** Calendrier vaccinal → `VaccineItem[]` pour un enfant donné. */
export function echeancesVersVaccins(
  childId: string,
  echeances: Echeance[],
): VaccineItem[] {
  return echeances.map((echeance) => ({
    id: `vaccin-${echeance.calendrier_id}`,
    childId,
    nom: echeance.vaccin_nom,
    dose: `Dose ${echeance.dose_numero}`,
    ageRecommande: `${echeance.age_cible_jours} jours`,
    datePrevue: dateEnFr(echeance.date_prevue),
    dateEffective: echeance.date_administration
      ? dateEnFr(echeance.date_administration)
      : undefined,
    statut:
      echeance.statut === "effectue"
        ? ("administre" as const)
        : echeance.statut === "en_retard"
          ? ("en_retard" as const)
          : ("a_venir" as const),
    professionnel: undefined,
    lotNumero: undefined,
  }));
}

/**
 * Dossier + déclaration → `DocumentItem[]`.
 *
 * Il n'existe pas d'endpoint listant les documents : seuls le dossier
 * imprimable et la déclaration sont réellement téléchargeables, la liste est
 * donc construite à partir de ces deux pièces réelles.
 */
export function espaceVersDocuments(espace: ParentEspace): DocumentItem[] {
  const childId = String(espace.enfant.id);
  const reference = espace.dossier.numero;
  const emetteur = espace.enfant.etablissement || "Maternité";
  const declaree = espace.declaration?.statut === "declaree";

  const documents: DocumentItem[] = [
    {
      id: `dossier-${espace.dossier.id}`,
      childId,
      titre: "Dossier du nouveau-né",
      type: "carnet_sante",
      date: dateEnFr(espace.enfant.date_naissance),
      taille: "—",
      format: "PDF",
      reference,
      signataire: emetteur,
    },
    {
      id: `declaration-${espace.dossier.id}`,
      childId,
      titre: "Déclaration de naissance",
      type: "acte_naissance",
      date: dateEnFr(
        espace.declaration?.date_declaration ?? espace.declaration?.date_limite,
      ),
      taille: "—",
      format: "PDF",
      reference,
      signataire: declaree ? "Officier d'État Civil" : emetteur,
    },
  ];

  return documents;
}

/** Rappels de l'espace parent → `NotificationItem[]`. */
export function rappelsVersNotifications(
  espaces: ParentEspace[],
): NotificationItem[] {
  const notifications: NotificationItem[] = [];

  for (const espace of espaces) {
    espace.rappels.forEach((rappel, index) => {
      notifications.push({
        id: `${espace.enfant.id}-rappel-${index}`,
        titre: rappel.titre,
        message: rappel.prochaine_demarche ?? rappel.statut,
        date: dateEnFr(rappel.date_echeance),
        lu: false,
        type: rappel.type === "vaccin" ? "vaccin" : "etat_civil",
        badge: espace.enfant.prenom,
      });
    });
  }

  return notifications;
}

/**
 * `GET /api/enfants/:id` + `GET /api/dossiers` → `Child[]` côté agent.
 *
 * Le statut d'affichage suit ce que l'API expose réellement : un dossier
 * `actif` est en cours de traitement, un dossier `archive` est soldé.
 */
export function agentVersEnfants(
  details: EnfantDetail[],
  dossiers: Map<number, { numero: string; statut: string }>,
): Child[] {
  return details.map((detail) => {
    const dossier = dossiers.get(detail.id);
    const status: Child["status"] =
      dossier?.statut === "archive" ? "complet" : "en_cours";
    const mere = detail.parents.find((p) => p.lien === "mere");
    const pere = detail.parents.find((p) => p.lien === "pere" || p.lien === "tuteur");

    return {
      id: String(detail.id),
      nom: detail.nom,
      prenom: detail.prenom,
      dateNaissance: dateEnFr(detail.date_naissance),
      poids: "",
      taille: "",
      sexe: sexeVersLibelle(detail.sexe),
      lieuNaissance: detail.lieu_naissance ?? "",
      photoUrl: avatarInitiales(detail.prenom, detail.nom),
      status,
      referenceMaternite: dossier?.numero ?? detail.numero_dossier ?? "",
      numeroActe:
        status === "complet" && dossier?.numero ? dossier.numero : undefined,
      mere: { nom: [mere?.prenom, mere?.nom].filter(Boolean).join(" "), telephone: mere?.telephone ?? "" },
      pere: { nom: [pere?.prenom, pere?.nom].filter(Boolean).join(" "), telephone: pere?.telephone ?? "" },
      etapes: [
        {
          titre: "Naissance enregistrée par l'agent",
          date: dateEnFr(detail.created_at),
          complete: true,
        },
        {
          titre: "Dossier maternité ouvert",
          date: dossier?.numero ?? "En attente",
          complete: Boolean(dossier),
        },
        {
          titre: "Déclaration de naissance",
          date: dossier ? "Sous 30 jours" : "Non démarrée",
          complete: status === "complet",
        },
        {
          titre: "Émission de l'acte d'état civil",
          date: status === "complet" ? "Soldé" : "En attente",
          complete: status === "complet",
        },
      ],
    } satisfies Child;
  });
}

/** Dossiers listés par l'agent, indexés par enfant. */
export function dossiersParEnfant(
  dossiers: Array<{ enfant_id: number; numero_dossier: string; statut: string }>,
): Map<number, { numero: string; statut: string }> {
  const index = new Map<number, { numero: string; statut: string }>();
  for (const dossier of dossiers) {
    index.set(dossier.enfant_id, {
      numero: dossier.numero_dossier,
      statut: dossier.statut,
    });
  }
  return index;
}

export { libelleVersSexe };

/** `12/09/2026` → `2026-09-12` (format attendu par `date_naissance`). */
export function dateFrVersIso(date: string): string {
  const [jour, mois, annee] = date.split("/");
  if (!jour || !mois || !annee) return date;
  return `${annee}-${mois.padStart(2, "0")}-${jour.padStart(2, "0")}`;
}

/** `3.4 kg` / `50 cm` → nombre, ou `undefined` si le champ est vide. */
export function nombreDe(valeur: string): number | undefined {
  const nettoye = valeur.replace(",", ".").replace(/[^\d.]/g, "");
  if (!nettoye) return undefined;
  const nombre = Number(nettoye);
  return Number.isFinite(nombre) ? nombre : undefined;
}

/** Découpe un nom complet : « Marie Moussana » → prénom + nom. */
function decouperNom(complet: string): { prenom: string; nom: string } {
  const parties = complet.trim().split(/\s+/).filter(Boolean);
  if (parties.length <= 1) return { prenom: complet.trim(), nom: "" };
  return {
    prenom: parties[0],
    nom: parties.slice(1).join(" "),
  };
}

/**
 * `Child` édité dans le formulaire agent → payload de
 * `POST /api/enfants/enregistrement`.
 */
export function childVersEnregistrement(child: Child): {
  enfant: EnfantPayload;
  parents: ParentPayload[];
} {
  const mere = decouperNom(child.mere.nom);
  const pere = decouperNom(child.pere.nom);

  const parents: ParentPayload[] = [];
  if (mere.prenom || mere.nom) {
    parents.push({
      nom: mere.nom,
      prenom: mere.prenom,
      lien: "mere",
      telephone: child.mere.telephone || undefined,
    });
  }
  if (pere.prenom || pere.nom) {
    parents.push({
      nom: pere.nom,
      prenom: pere.prenom,
      lien: "pere",
      telephone: child.pere.telephone || undefined,
    });
  }

  return {
    enfant: {
      nom: child.nom,
      prenom: child.prenom,
      sexe: libelleVersSexe(child.sexe),
      date_naissance: dateFrVersIso(child.dateNaissance),
      lieu_naissance: child.lieuNaissance || "",
      poids_naissance: nombreDe(child.poids),
      taille_naissance: nombreDe(child.taille),
      statut_vital: "vivant",
    },
    parents,
  };
}

