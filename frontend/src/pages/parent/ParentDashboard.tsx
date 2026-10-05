import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  ChevronRight,
  FileText,
  Ruler,
  Syringe,
  Weight,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { cn } from "@/lib/utils";
import { parentDashboardMock } from "@/lib/dashboard/mockParentData";
import type { StepStatus } from "@/lib/dashboard/types";

/**
 * Dashboard Parent : suivi du nouveau-ne, echeances et notifications.
 *
 * Les blocs sont volontairement independants les uns des autres pour que les
 * pages filles (vaccinations, documents...) puissent reutiliser les memes
 * sous-composants avec leurs propres donnees.
 */
export default function ParentDashboard() {
  const { parent, child, nextVaccination, lastSteps, civilRegistration, notifications, quickActions } =
    parentDashboardMock;

  return (
    <div className="flex flex-col gap-4 sm:gap-5 lg:gap-6">
      {/* ---------- Accroche ---------- */}
      <div className="app-card relative overflow-hidden bg-[var(--app-brand)] p-5 text-white sm:p-6 lg:p-8">
        {/* Formes decoratives, purement visuelles */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-12 size-64 rounded-full bg-white/5"
        />

        <div className="relative">
          <p className="app-section-title text-white/70">
            {parent.roleLabel} · {child.ageLabel}
          </p>
          <h2 className="mt-2 font-serif text-2xl font-bold leading-tight sm:text-3xl">
            Bonjour {parent.firstName}
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/80">
            Le dossier de {child.firstName} {child.lastName} est a jour.
            Une déclaration reste à finaliser.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/parent/vaccinations"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-[var(--app-brand)] transition-transform hover:scale-[1.02]"
            >
              Calendrier de vaccination
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              to="/parent/documents"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <FileText className="size-4" aria-hidden="true" />
              Mes documents
            </Link>
          </div>
        </div>
      </div>

      {/* ---------- Synthese de l'enfant + echeances ---------- */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <DashboardCard label="Résumé du dossier" className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="app-section-title">Nouveau-né</p>
              <h3 className="mt-1.5 font-serif text-xl font-bold text-[var(--app-heading)]">
                {child.firstName} {child.lastName}
              </h3>
              <p className="mt-1 text-sm text-[var(--app-muted)]">
                Né le {child.birthDate} · {child.ageLabel}
              </p>
            </div>
            <span className="app-chip">
              Dossier {child.recordNumber}
            </span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl bg-[var(--app-surface-2)] p-3">
              <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-[var(--app-faint)]">
                <Weight className="size-3.5" aria-hidden="true" />
                Poids
              </dt>
              <dd className="mt-1 text-lg font-bold text-[var(--app-heading)] tabular-nums">
                {child.weightKg}
                <span className="ml-0.5 text-xs font-medium text-[var(--app-faint)]">kg</span>
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--app-surface-2)] p-3">
              <dt className="flex items-center gap-1.5 text-[0.6875rem] font-semibold text-[var(--app-faint)]">
                <Ruler className="size-3.5" aria-hidden="true" />
                Taille
              </dt>
              <dd className="mt-1 text-lg font-bold text-[var(--app-heading)] tabular-nums">
                {child.heightCm}
                <span className="ml-0.5 text-xs font-medium text-[var(--app-faint)]">cm</span>
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--app-surface-2)] p-3">
              <dt className="text-[0.6875rem] font-semibold text-[var(--app-faint)]">
                Statut
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--app-brand)]">
                Actif
              </dd>
            </div>
            <div className="rounded-xl bg-[var(--app-surface-2)] p-3">
              <dt className="text-[0.6875rem] font-semibold text-[var(--app-faint)]">
                Sexe
              </dt>
              <dd className="mt-1 text-sm font-bold text-[var(--app-brand)]">
                {child.sex === "M" ? "Masculin" : "Féminin"}
              </dd>
            </div>
          </dl>
        </DashboardCard>

        <DashboardCard label="Prochaine vaccination" interactive>
          <p className="app-section-title">Prochaine échéance</p>

          <div className="mt-3 flex items-start gap-3">
            <span className="app-icon-tile bg-[var(--app-brand)] text-white">
              <Syringe className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-serif text-lg font-bold text-[var(--app-heading)]">
                {nextVaccination.vaccineName}
              </p>
              <p className="text-xs text-[var(--app-muted)]">
                {nextVaccination.doseLabel}
              </p>
            </div>
          </div>

          <p className="mt-4 flex items-center gap-2 rounded-xl bg-[var(--app-sage-soft)] px-3 py-2.5 text-sm font-semibold text-[var(--app-brand)]">
            <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
            {nextVaccination.date}
          </p>

          <Link
            to="/parent/vaccinations"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--app-brand)] transition-opacity hover:opacity-75"
          >
            Voir tout le calendrier
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </DashboardCard>
      </div>

      {/* ---------- Etapes + declaration d'etat civil ---------- */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-3">
        <DashboardCard label="Dernières étapes" className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
              Avancement du parcours
            </h3>
            <span className="app-chip">
              {lastSteps.filter((step) => step.status === "done").length}/
              {lastSteps.length} etapes
            </span>
          </div>

          <ol className="mt-4 flex flex-col gap-4">
            {lastSteps.map((step, index) => (
              <TimelineRow
                key={step.id}
                status={step.status}
                title={step.title}
                description={step.description}
                date={step.date}
                isLast={index === lastSteps.length - 1}
              />
            ))}
          </ol>
        </DashboardCard>

        <DashboardCard label="Déclaration à l’état civil">
          <p className="app-section-title">Échéance</p>
          <h3 className="mt-1.5 font-serif text-base font-bold text-[var(--app-heading)]">
            Déclaration à l’état civil
          </h3>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-serif text-4xl font-bold leading-none text-[var(--app-brand)] tabular-nums">
              {civilRegistration.daysLeft}
            </span>
            <span className="text-sm font-medium text-[var(--app-muted)]">jours restants</span>
          </div>
          <p className="mt-2 text-xs text-[var(--app-faint)]">
            À finaliser avant le {civilRegistration.deadline}
          </p>

          <div
            className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--app-surface-2)]"
            role="progressbar"
            aria-valuenow={Math.round(civilRegistration.progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Avancement du délai de déclaration"
          >
            <div
              className="h-full rounded-full bg-[var(--app-brand)]"
              style={{ width: `${civilRegistration.progress * 100}%` }}
            />
          </div>

          <Link
            to="/parent/documents"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--app-brand)] transition-opacity hover:opacity-75"
          >
            Ouvrir mes documents
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </DashboardCard>
      </div>

      {/* ---------- Notifications + acces rapides ---------- */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        <DashboardCard label="Notifications">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
              Notifications
            </h3>
            <Link
              to="/parent/notifications"
              className="text-xs font-semibold text-[var(--app-brand)] transition-opacity hover:opacity-75"
            >
              Tout voir
            </Link>
          </div>

          <ul className="mt-4 flex flex-col gap-2">
            {notifications.slice(0, 3).map((item) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-3",
                  item.read
                    ? "border-[var(--app-border)] bg-[var(--app-surface)]"
                    : "border-[var(--app-border-strong)] bg-[var(--app-sage-soft)]",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                    item.read
                      ? "bg-[var(--app-surface-2)] text-[var(--app-faint)]"
                      : "bg-[var(--app-brand)] text-white",
                  )}
                >
                  {item.read ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Bell className="size-4" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--app-heading)]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[var(--app-muted)]">
                    {item.body}
                  </p>
                  <p className="mt-1 text-[0.625rem] text-[var(--app-faint)]">
                    {item.date}
                  </p>
                </div>
                {!item.read && (
                  <span
                    aria-label="Non lue"
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--app-mint)]"
                  />
                )}
              </li>
            ))}
          </ul>
        </DashboardCard>

        <DashboardCard label="Accès rapides">
          <h3 className="font-serif text-base font-bold text-[var(--app-heading)]">
            Accès rapides
          </h3>

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.to + action.label}
                to={action.to}
                className="group flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3 transition-colors hover:border-[var(--app-border-strong)] hover:bg-[var(--app-surface-2)]"
              >
                <span className="app-icon-tile size-10 rounded-xl">
                  <ChevronRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--app-heading)]">
                    {action.label}
                  </span>
                  <span className="block truncate text-[0.6875rem] text-[var(--app-faint)]">
                    {action.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}

/* ---------- Ligne de la frise chronologique ---------- */

const statusStyles: Record<StepStatus, { dot: string; ring: string }> = {
  done: {
    dot: "bg-[var(--app-brand)] text-white",
    ring: "border-[var(--app-border)]",
  },
  current: {
    dot: "bg-[var(--app-mint)] text-[#06231d]",
    ring: "border-[var(--app-mint)]",
  },
  upcoming: {
    dot: "bg-[var(--app-surface-3)] text-[var(--app-faint)]",
    ring: "border-[var(--app-border)]",
  },
};

function TimelineRow({
  status,
  title,
  description,
  date,
  isLast,
}: {
  status: StepStatus;
  title: string;
  description: string;
  date?: string;
  isLast: boolean;
}) {
  const style = statusStyles[status];

  return (
    <li className="flex gap-3">
      {/* Colonne du trait vertical */}
      <div className="flex shrink-0 flex-col items-center">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full border",
            style.dot,
            style.ring,
          )}
        >
          {status === "done" ? (
            <Check className="size-3.5" aria-hidden="true" />
          ) : status === "current" ? (
            <span className="size-2 rounded-full bg-[#06231d]" />
          ) : null}
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            className="mt-1 w-px flex-1 bg-[var(--app-border-strong)]"
          />
        )}
      </div>

      {/* Contenu */}
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-[var(--app-heading)]">
            {title}
          </p>
          {status === "current" && <span className="app-chip">En cours</span>}
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-[var(--app-muted)]">
          {description}
        </p>
        {date && (
          <p className="mt-1 text-[0.625rem] text-[var(--app-faint)]">{date}</p>
        )}
      </div>
    </li>
  );
}