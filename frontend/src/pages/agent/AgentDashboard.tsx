import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  ClipboardList,
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
import type { AgentStat, RecordStatus } from "@/lib/dashboard/types";

/** Icone associee a chaque compteur, pour que la lecture soit immediate. */
const statIcons = [Baby, ClipboardList, Syringe, FileWarning];

/**
 * Dashboard Agent de maternite : volumes enregistres, dossiers du jour et
 * relances a faire.
 *
 * Aucune action de saisie ici : la creation d'un dossier passe par la page
 * fille /agent/nouveau-ne, ce qui garde ce tableau de bord en lecture seule.
 */
export default function AgentDashboard() {
  const agent = agentProfileMock;
  const records = agentRecordsMock;
  const incomplete = agentIncompleteRecordsMock;
  const pendingVaccinations = agentPendingVaccinationsMock;
  const recentEntries = agentRecentEntriesMock;

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      {/* ---------- Accroche ---------- */}
      <div className="app-card relative overflow-hidden bg-[var(--app-brand)] p-5 text-white sm:p-6 lg:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-16 size-72 rounded-full bg-white/5"
        />

        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            <p className="app-section-title text-white/70">{agent.facility}</p>
            <h2 className="mt-2 font-serif text-2xl font-bold leading-tight sm:text-3xl">
              Bonjour {agent.firstName}
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
              {incomplete.length} dossier{plural(incomplete.length)} incomplet
              {plural(incomplete.length)} et {pendingVaccinations.length} vaccination
              {plural(pendingVaccinations.length)} à suivre.
            </p>
          </div>

          <Link
            to="/agent/nouveau-ne"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[var(--app-brand)] transition-transform hover:scale-[1.02]"
          >
            <UserRoundPlus className="size-4" aria-hidden="true" />
            Enregistrer un nouveau-né
          </Link>
        </div>
      </div>

      {/* ---------- Compteurs ---------- */}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {agentStatsMock.map((stat, index) => (
          <StatCardWithIcon
            key={stat.id}
            stat={stat}
            icon={statIcons[index] ?? ClipboardList}
          />
        ))}
      </div>

      {/* ---------- Dossiers du jour + relances ---------- */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <DashboardCard
          label="Dossiers du jour"
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
              Dossiers du jour
            </h3>
            <Link
              to="/agent/dossiers"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--app-brand)] transition-opacity hover:opacity-75"
            >
              Voir tous
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Sur mobile : liste. A partir de 768px : tableau. */}
          <ul className="mt-4 flex flex-col gap-2 md:hidden">
            {records.map((record) => (
              <li
                key={record.id}
                className="rounded-xl border border-[var(--app-border)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                      {record.babyName}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-[var(--app-muted)]">
                      {record.parentName}
                    </p>
                  </div>
                  <StatusBadge status={record.status} />
                </div>
                <p className="mt-2 text-[0.625rem] text-[var(--app-faint)]">
                  {record.recordNumber} · Né le {record.birthDate}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--app-border)]">
                  <th className="app-section-title pb-2 pr-4 font-bold">
                    Dossier
                  </th>
                  <th className="app-section-title pb-2 pr-4 font-bold">Enfant</th>
                  <th className="app-section-title pb-2 pr-4 font-bold">Parent</th>
                  <th className="app-section-title pb-2 pr-4 font-bold">Naissance</th>
                  <th className="app-section-title pb-2 font-bold">Statut</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b border-[var(--app-border)] last:border-0"
                  >
                    <td className="py-3 pr-4 text-xs text-[var(--app-muted)] tabular-nums">
                      {record.recordNumber}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-[var(--app-heading)]">
                      {record.babyName}
                    </td>
                    <td className="py-3 pr-4 text-[var(--app-muted)]">
                      {record.parentName}
                    </td>
                    <td className="py-3 pr-4 text-[var(--app-muted)] tabular-nums">
                      {record.birthDate}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={record.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard label="Relances à faire">
          <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
            Vaccinations à suivre
          </h3>
          <p className="mt-1 text-xs text-[var(--app-muted)]">
            {pendingVaccinations.length} échéances sur la semaine
          </p>

          <ul className="mt-4 flex flex-col gap-2">
            {pendingVaccinations.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-[var(--app-border)] p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                      {item.babyName}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                      {item.vaccineName}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-bold",
                      item.overdueDays > 0
                        ? "bg-[var(--app-brand)] text-white"
                        : "bg-[var(--app-sage-soft)] text-[var(--app-brand)]",
                    )}
                  >
                    {item.overdueDays > 0 ? `+${item.overdueDays} j` : "A jour"}
                  </span>
                </div>
                <p className="mt-2 text-[0.625rem] text-[var(--app-faint)]">
                  Échéance : {item.dueDate}
                </p>
              </li>
            ))}
          </ul>

          <Link
            to="/agent/vaccinations"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--app-brand)] transition-opacity hover:opacity-75"
          >
            Ouvrir le planning
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </DashboardCard>
      </div>

      {/* ---------- Dossiers incomplets + activite recente ---------- */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <DashboardCard label="Dossiers incomplets">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
              Dossiers incomplets
            </h3>
            <span className="app-chip">{incomplete.length} à régulariser</span>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {incomplete.map((record) => (
              <li
                key={record.id}
                className="flex items-start gap-3 rounded-xl border border-[var(--app-border)] p-3"
              >
                <span className="app-icon-tile size-9 rounded-lg bg-[var(--app-brand)] text-white">
                  <FileWarning className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                    {record.babyName}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                    {record.statusLabel}
                  </p>
                  <p className="mt-1 text-[0.625rem] text-[var(--app-faint)]">
                    {record.recordNumber}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard label="Activité récente">
          <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
            Derniers enregistrements
          </h3>

          <ul className="mt-4 flex flex-col gap-3">
            {recentEntries.map((entry, index) => (
              <li key={entry.id} className="flex items-center gap-3">
                <div className="flex shrink-0 flex-col items-center">
                  <span className="size-2 rounded-full bg-[var(--app-brand)]" />
                  {index < recentEntries.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mt-1 w-px flex-1 bg-[var(--app-border-strong)]"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1 pb-1">
                  <p className="truncate text-sm font-semibold text-[var(--app-heading)]">
                    {entry.babyName}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-[var(--app-muted)]">
                    {entry.facility}
                  </p>
                </div>
                <span className="shrink-0 text-[0.625rem] text-[var(--app-faint)]">
                  {entry.recordedAt}
                </span>
              </li>
            ))}
          </ul>

          <Link
            to="/agent/dossiers"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[var(--app-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--app-brand)] transition-colors hover:bg-[var(--app-surface-2)]"
          >
            <FolderOpen className="size-3.5" aria-hidden="true" />
            Consulter les dossiers
          </Link>
        </DashboardCard>
      </div>
    </div>
  );
}

/* ---------- Compteur + icone ---------- */

function StatCardWithIcon({
  stat,
  icon,
}: {
  stat: AgentStat;
  icon: LucideIcon;
}) {
  return (
    <StatCard
      label={stat.label}
      value={stat.value}
      hint={stat.hint}
      trend={stat.trend}
      icon={icon}
      tone={stat.id === "stat-dossiers-incomplets" ? "attention" : "default"}
    />
  );
}

/* ---------- Pastille de statut ---------- */

const statusStyles: Record<RecordStatus, string> = {
  complet: "bg-[var(--app-sage-soft)] text-[var(--app-brand)]",
  "a-valider": "bg-[var(--app-surface-2)] text-[var(--app-muted)]",
  incomplet: "bg-[var(--app-brand)] text-white",
};

function StatusBadge({ status }: { status: RecordStatus }) {
  const label: Record<RecordStatus, string> = {
    complet: "Complet",
    "a-valider": "À valider",
    incomplet: "Incomplet",
  };

  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-[0.625rem] font-bold",
        statusStyles[status],
      )}
    >
      {label[status]}
    </span>
  );
}

/* ---------- Accords de pluriel francais ---------- */

function plural(count: number): string {
  return count > 1 ? "s" : "";
}