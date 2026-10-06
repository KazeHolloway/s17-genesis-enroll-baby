import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Baby,
  Clock,
  FileWarning,
  FolderOpen,
  Syringe,
  UserRoundPlus,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import StatCard from "@/components/dashboard/StatCard";
import { cn } from "@/lib/utils";
import {
  agentIncompleteRecordsMock,
  agentPendingVaccinationsMock,
  agentProfileMock,
  agentRecentEntriesMock,
  agentRecordsMock,
  agentStatsMock,
} from "@/lib/dashboard/mockAgentData";
import type { LucideIcon } from "lucide-react";
import type { NewbornRecord, RecordStatus } from "@/lib/dashboard/types";

/** Icone associee a chaque compteur, alignee sur l'ordre de `agentStatsMock`. */
const statIcons: LucideIcon[] = [Baby, Clock, Syringe, FileWarning];

/**
 * Accueil du dashboard Agent de maternité.
 *
 * Reprend la maquette de référence : quatre compteurs, un bandeau d'alerte
 * ambre, puis le registre des dernières déclarations. La page de déclaration
 * de naissance reste un placeholder : ce lot livre la coquille et l'accueil.
 */
export default function AgentDashboard() {
  const agent = agentProfileMock;
  const records = agentRecordsMock;
  const incomplete = agentIncompleteRecordsMock;
  const pendingVaccinations = agentPendingVaccinationsMock;
  const recentEntries = agentRecentEntriesMock;

  return (
    <div className="space-y-6">
      {/* ---------- Compteurs ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        {agentStatsMock.map((stat, index) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            hint={stat.hint}
            trend={stat.trend}
            icon={statIcons[index] ?? Baby}
            /* La carte « Vaccinations a suivre » est le raccourci vers la
               confirmation des statuts : c'est la tache principale de l'agent. */
            to={stat.id === "stat-vaccinations" ? "/agent/statuts" : undefined}
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
              {incomplete.length} dossier{plural(incomplete.length)} incomplet
              {plural(incomplete.length)} et {pendingVaccinations.length} vaccination
              {plural(pendingVaccinations.length)} à suivre
            </h4>
            <p className="app-alert-text mt-0.5">
              Documents manquants à régulariser et échéances de la semaine à
              relancer auprès des familles.
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
            Voir les dossiers urgents
          </Link>
        </div>
      </div>

      {/* ---------- Actions principales ---------- */}
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
              Session de {agent.firstName} {agent.lastName} · {agent.facility}
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
              {agent.facility} · registre synchronisé avec le service de
              maternité.
            </p>
          </div>

          <Link to="/agent/dossiers" className="app-link-action shrink-0">
            <span>Consulter le registre complet</span>
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile : cartes interactives. Initiales, référence maternité, contact
            parent et bouton « Examiner » tactile (48px).
            L'autel existe aussi dans les données mais la photo n'est pas
            retenue ici : aucune photo de nouveau-né n'est fournie, et une
            initiales est preferable a un conteneur vide. */}
        <ul className="flex flex-col gap-3 border-t border-[var(--app-border-soft)] pt-4 lg:hidden">
          {records.map((record) => (
            <li key={record.id}>
              <MobileRecordCard record={record} />
            </li>
          ))}
        </ul>

        {/* `lg` et non `sm` : à 640px, 6 colonnes ne tiennent pas sans
            défile ment horizontal, ce que l'utilisateur ne voit pas venir.
            La liste empilée ci-dessus prend le relais jusqu'à 1024px. */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="app-table">
            <thead>
              <tr>
                <th>Enfant</th>
                <th>Date de naissance</th>
                <th>Réf. maternité</th>
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

      {/* ---------- Dossiers incomplets + activité récente ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        <DashboardCard label="Dossiers incomplets">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[var(--app-heading)]">
              À régulariser
            </h3>
            <span className="app-chip">
              {incomplete.length} dossier{plural(incomplete.length)}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
            {incomplete.map((record) => (
              <li
                key={record.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--app-border-soft)] p-3"
              >
                <span className="app-icon-tile">
                  <FileWarning className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                    {record.babyName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                    {record.statusLabel}
                  </p>
                  <p className="mt-1 font-mono text-[0.625rem] text-[var(--app-faint)]">
                    {record.recordNumber}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard label="Activité récente">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-bold text-[var(--app-heading)]">
              Vaccinations à suivre
            </h3>
            <span className="app-chip">
              {pendingVaccinations.length} échéance
              {plural(pendingVaccinations.length)}
            </span>
          </div>

          <ul className="mt-4 space-y-2">
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
                  {item.overdueDays > 0 ? `+${item.overdueDays} j` : "À jour"}
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

          {/* Derniers enregistrements, repliés pour garder la carte lisible. */}
          <details className="mt-4 border-t border-[var(--app-border-soft)] pt-4">
            <summary className="cursor-pointer text-xs font-semibold text-[var(--app-muted)]">
              Voir les {recentEntries.length} derniers enregistrements
            </summary>
            <ul className="mt-3 space-y-2">
              {recentEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <span className="truncate font-medium text-[var(--app-heading)]">
                    {entry.babyName}
                  </span>
                  <span className="shrink-0 text-[var(--app-faint)]">
                    {entry.recordedAt}
                  </span>
                </li>
              ))}
            </ul>
          </details>
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
  complet: "Dossier complet",
  "a-valider": "À valider",
  incomplet: "Incomplet",
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

/**
 * Carte de dossier, affichée à la place du tableau sous 1024px.
 * Toute la carte est cliquable et se termine par une action explicite : le
 * tableau masque cette colonne sous le pli du défilement horizontal.
 */
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

/* ---------- Accords de pluriel francais ---------- */

/** Initiales d'un nom d'enfant, pour les avatars de la vue mobile. */
function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function plural(count: number): string {
  return count > 1 ? "s" : "";
}