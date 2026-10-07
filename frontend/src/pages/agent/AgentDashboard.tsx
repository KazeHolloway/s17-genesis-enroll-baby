import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Clock,
  FolderOpen,
  Syringe,
  Users,
  UserRoundPlus,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { cn } from "@/lib/utils";
import {
  ApiError,
  getCalendrierVaccinal,
  getDossiers,
  getEnfantDetail,
  getEnfants,
  getStatistiques,
  type DossierAgent,
  type EnfantAgent,
  type Echeance,
} from "@/services/api";
import type { LucideIcon } from "lucide-react";
import type { NewbornRecord, PendingVaccination, RecordStatus } from "@/lib/dashboard/types";

interface Compteur {
  id: string;
  label: string;
  value: number;
  hint: string;
  icone: LucideIcon;
  to?: string;
}

interface LigneRecente {
  id: string;
  babyName: string;
  enregistreLe: string;
}

interface EcheanceEnfant extends Echeance {
  enfant: EnfantAgent;
}

/** `AAAA-MM-JJ` (ou ISO complet) → `JJ/MM/AAAA`. */
function formaterDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("fr-FR");
}

function plural(nombre: number): string {
  return nombre > 1 ? "s" : "";
}

/**
 * Accueil du dashboard Agent de maternité, branché sur l'API :
 *  - compteurs dérivés de `GET /api/statistiques` et `GET /api/dossiers` ;
 *  - échéances vaccinales à suivre issues des calendriers des derniers dossiers ;
 *  - registre des dernières déclarations réel du service de maternité.
 */
export default function AgentDashboard() {
  const [enfants, setEnfants] = useState<EnfantAgent[]>([]);
  const [dossiers, setDossiers] = useState<DossierAgent[]>([]);
  const [echeances, setEcheances] = useState<EcheanceEnfant[]>([]);
  const [parentsParEnfant, setParentsParEnfant] = useState<Map<number, string>>(
    new Map(),
  );
  const [totaux, setTotaux] = useState<{
    naissances: number;
    garcons: number;
    filles: number;
  } | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let ignore = false;
    const fin = new Date().toISOString().slice(0, 10);
    const debut = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    async function charger() {
      try {
        const [listeEnfants, reponseDossiers, stats] = await Promise.all([
          getEnfants(),
          getDossiers(),
          getStatistiques(debut, fin),
        ]);

        const recents = listeEnfants.slice(0, 6);
        const calendriers = await Promise.all(
          recents.map((enfant) =>
            getCalendrierVaccinal(enfant.id)
              .then((reponse) =>
                reponse.data.echeances.map((echeance) => ({
                  ...echeance,
                  enfant,
                })),
              )
              .catch(() => [] as EcheanceEnfant[]),
          ),
        );

        const parents = await Promise.all(
          recents.map((enfant) =>
            getEnfantDetail(enfant.id)
              .then((detail) => {
                const parent = detail.parents[0];
                if (!parent) return [enfant.id, "—"] as const;
                return [
                  enfant.id,
                  `${parent.prenom} ${parent.nom}`,
                ] as const;
              })
              .catch(() => [enfant.id, "—"] as const),
          ),
        );

        if (ignore) return;
        setEnfants(listeEnfants);
        setDossiers(reponseDossiers.data);
        setEcheances(calendriers.flat());
        setParentsParEnfant(new Map(parents));
        setTotaux({
          naissances: stats.data.total.naissances,
          garcons: stats.data.total.garcons,
          filles: stats.data.total.filles,
        });
        setChargement(false);
      } catch (e: unknown) {
        if (ignore) return;
        setErreur(
          e instanceof ApiError ? e.message : "Impossible de charger le tableau de bord.",
        );
        setChargement(false);
      }
    }

    void charger();
    return () => {
      ignore = true;
    };
  }, []);

  /* ---------- Données dérivées ---------- */

  const aSuivre = echeances
    .filter((echeance) => echeance.statut !== "effectue")
    .sort(
      (a, b) =>
        new Date(a.date_prevue).getTime() - new Date(b.date_prevue).getTime(),
    );

  const pendingVaccinations: PendingVaccination[] = aSuivre
    .slice(0, 6)
    .map((echeance) => ({
      id: `vac-${echeance.calendrier_id}`,
      babyName: `${echeance.enfant.prenom} ${echeance.enfant.nom}`,
      vaccineName: `${echeance.vaccin_nom} ${echeance.dose_numero}`,
      dueDate: formaterDate(echeance.date_prevue),
      overdueDays: echeance.jours_restants < 0 ? -echeance.jours_restants : 0,
    }));

  const enfantParId = new Map(enfants.map((e) => [e.id, e]));

  const records: NewbornRecord[] = dossiers.slice(0, 6).map((dossier) => {
    const enfant = enfantParId.get(dossier.enfant_id);
    return {
      id: `dossier-${dossier.id}`,
      recordNumber: dossier.numero_dossier,
      babyName: `${dossier.enfant_prenom} ${dossier.enfant_nom}`,
      parentName: parentsParEnfant.get(dossier.enfant_id) ?? "—",
      birthDate: enfant ? formaterDate(enfant.date_naissance) : "—",
      status: ("actif" as RecordStatus),
      statusLabel: dossier.statut === "actif" ? "Dossier actif" : "Archivé",
    };
  });

  const recentEntries: LigneRecente[] = enfants.slice(0, 5).map((enfant) => ({
    id: `entree-${enfant.id}`,
    babyName: `${enfant.prenom} ${enfant.nom}`,
    enregistreLe: new Date(enfant.created_at).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const compteurs: Compteur[] = [
    {
      id: "stat-nouveaux-nes",
      label: "Nouveau-nés enregistrés",
      value: totaux?.naissances ?? 0,
      hint: "Sur les 30 derniers jours",
      icone: Baby,
    },
    {
      id: "stat-dossiers",
      label: "Dossiers au registre",
      value: dossiers.length,
      hint: "Dossiers du service de maternité",
      icone: FolderOpen,
    },
    {
      id: "stat-filles-garcons",
      label: "Naissances de filles",
      value: totaux?.filles ?? 0,
      hint: `Garçons : ${totaux?.garcons ?? 0} · 30 derniers jours`,
      icone: Users,
    },
    {
      id: "stat-vaccinations",
      label: "Vaccinations à suivre",
      value: aSuivre.length,
      hint: "Échéances à venir ou en retard",
      icone: Syringe,
      to: "/agent/statuts",
    },
  ];

  /* ---------- Rendu ---------- */

  if (chargement) {
    return (
      <p className="text-sm text-[var(--app-muted)]" role="status">
        Chargement du tableau de bord…
      </p>
    );
  }

  if (erreur) {
    return (
      <div className="app-card p-6" role="alert">
        <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------- Compteurs ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {compteurs.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            icon={stat.icone}
            to={stat.to}
          />
        ))}
      </div>

      {/* ---------- Bandeau d'alerte ---------- */}
      <div className="app-alert flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <AlertTriangle className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h4 className="app-alert-title">
              {aSuivre.length} vaccination{plural(aSuivre.length)} à suivre
            </h4>
            <p className="app-alert-text mt-0.5">
              Échéances à venir ou en retard à confirmer et à relancer auprès des
              familles.
            </p>
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
          <Link
            to="/agent/statuts"
            className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-emerald-700 px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-800"
          >
            Confirmer les statuts
          </Link>
          <Link
            to="/agent/dossiers"
            className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl bg-amber-600 px-3.5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-amber-700 sm:py-1.5"
          >
            Voir le registre
          </Link>
        </div>
      </div>

      {/* ---------- Action principale ---------- */}
      <div className="app-card flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between sm:p-5">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] text-white">
            <UserRoundPlus className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[var(--app-heading)]">
              Enregistrer une nouvelle naissance
            </h4>
            <p className="truncate text-xs text-[var(--app-muted)]">
              Le code d’accès est généré et remis aux parents à la fin du
              formulaire.
            </p>
          </div>
        </div>

        <Link
          to="/agent/nouveau-ne"
          className="app-action w-full shrink-0 sm:w-auto"
        >
          <UserRoundPlus className="size-4" aria-hidden="true" />
          <span>Déclarer une naissance</span>
        </Link>
      </div>

      {/* ---------- Registre des dernières déclarations ---------- */}
      <DashboardCard label="Registre des naissances" className="overflow-hidden p-0">
        <div className="flex flex-col items-start justify-between gap-3 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-base font-bold text-[var(--app-heading)]">
              Dernières déclarations enregistrées
            </h3>
            <p className="mt-0.5 text-xs text-[var(--app-faint)]">
              Registre synchronisé avec le service de maternité.
            </p>
          </div>

          <Link to="/agent/dossiers" className="app-link-action shrink-0">
            <span>Consulter le registre complet</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <ul className="flex flex-col gap-3 border-t border-[var(--app-border-soft)] pt-4 lg:hidden">
          {records.map((record) => (
            <li key={record.id}>
              <MobileRecordCard record={record} />
            </li>
          ))}
        </ul>

        <div className="hidden overflow-x-auto lg:block">
          <table className="app-table">
            <thead>
              <tr>
                <th>Enfant</th>
                <th>Date de naissance</th>
                <th>Réf. dossier</th>
                <th>Parent</th>
                <th>Statut</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>
                    <span className="font-semibold text-[var(--app-heading)]">
                      {record.babyName}
                    </span>
                    <span className="block text-[0.6875rem] text-[var(--app-faint)]">
                      Né le {record.birthDate}
                    </span>
                  </td>
                  <td className="text-[var(--app-muted)] tabular-nums">
                    {record.birthDate}
                  </td>
                  <td className="font-mono text-xs text-[var(--app-action)]">
                    {record.recordNumber}
                  </td>
                  <td className="text-xs text-[var(--app-muted)]">
                    {record.parentName}
                  </td>
                  <td>
                    <StatusBadge status={record.status} />
                  </td>
                  <td className="text-right">
                    <Link
                      to="/agent/dossiers"
                      className="app-action-outline !rounded-lg !px-3 !py-1"
                    >
                      Examiner
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>

      {/* ---------- Vaccinations à suivre + derniers enregistrements ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <DashboardCard label="Vaccinations à suivre">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[var(--app-heading)]">
              Échéances en attente
            </h3>
            <span className="app-chip">
              {aSuivre.length} échéance{plural(aSuivre.length)}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {pendingVaccinations.length === 0 && (
              <li className="rounded-xl border border-dashed border-[var(--app-border-soft)] p-4 text-center text-xs text-[var(--app-muted)]">
                Aucune échéance sur les derniers dossiers.
              </li>
            )}
            {pendingVaccinations.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[var(--app-border-soft)] p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                    {item.babyName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                    {item.vaccineName} · échéance {item.dueDate}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold",
                    item.overdueDays > 0
                      ? "bg-[var(--app-action)] text-white"
                      : "bg-[var(--app-sage-soft)] text-[var(--app-emerald)]",
                  )}
                >
                  {item.overdueDays > 0 ? `+${item.overdueDays} j` : "À venir"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[var(--app-border-soft)] pt-4">
            <Link to="/agent/vaccinations" className="app-link-action">
              <span>Ouvrir le planning</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <Link to="/agent/dossiers" className="app-link-action">
              <FolderOpen className="size-3.5" aria-hidden="true" />
              <span>Registre complet</span>
            </Link>
          </div>
        </DashboardCard>

        <DashboardCard label="Activité récente">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[var(--app-heading)]">
              Derniers enregistrements
            </h3>
            <span className="app-chip">
              {recentEntries.length} entrée{plural(recentEntries.length)}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {recentEntries.length === 0 && (
              <li className="rounded-xl border border-dashed border-[var(--app-border-soft)] p-4 text-center text-xs text-[var(--app-muted)]">
                Aucun enregistrement pour l’instant.
              </li>
            )}
            {recentEntries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--app-border-soft)] p-3 text-sm"
              >
                <span className="truncate font-medium text-[var(--app-heading)]">
                  {entry.babyName}
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-[var(--app-faint)]">
                  <Clock className="size-3.5" aria-hidden="true" />
                  {entry.enregistreLe}
                </span>
              </li>
            ))}
          </ul>
        </DashboardCard>
      </div>
    </div>
  );
}

/* ---------- Pastille de statut ---------- */

const statusStyles: Record<RecordStatus, string> = {
  complet: "bg-[var(--app-sage-soft)] text-[var(--app-emerald)]",
  "a-valider": "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  incomplet: "bg-[var(--app-action)] text-white",
};

const statusLabels: Record<RecordStatus, string> = {
  complet: "Dossier actif",
  "a-valider": "À valider",
  incomplet: "Archivé",
};

function StatusBadge({ status }: { status: RecordStatus }) {
  return (
    <span
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

/* ---------- Vue mobile du registre ---------- */

function MobileRecordCard({ record }: { record: NewbornRecord }) {
  return (
    <Link
      to="/agent/dossiers"
      className="app-record-card"
      aria-label={`Ouvrir le dossier de ${record.babyName}, ${record.recordNumber}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] text-xs font-bold text-white"
        >
          {initialsOf(record.babyName)}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="min-w-0 truncate text-sm font-semibold text-[var(--app-heading)]">
              {record.babyName}
            </p>
            <StatusBadge status={record.status} />
          </div>
          <p className="mt-0.5 truncate text-xs text-[var(--app-muted)]">
            Né le {record.birthDate}
          </p>
          <dl className="mt-2 space-y-0.5 text-xs text-[var(--app-muted)]">
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-[var(--app-faint)]">Réf.</dt>
              <dd className="min-w-0 truncate font-mono text-[var(--app-action)]">
                {record.recordNumber}
              </dd>
            </div>
            <div className="flex gap-1.5">
              <dt className="shrink-0 text-[var(--app-faint)]">Parent</dt>
              <dd className="min-w-0 truncate">{record.parentName}</dd>
            </div>
          </dl>
        </div>
      </div>

      <span className="app-record-card-action">
        Examiner
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </span>
    </Link>
  );
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}