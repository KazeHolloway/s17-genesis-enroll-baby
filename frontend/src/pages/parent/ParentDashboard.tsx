import { Link } from "react-router-dom";
import {
  ArrowRight,
  Baby,
  Calendar,
  CheckCircle2,
  ChevronRight,
  FileText,
  Plus,
  Ruler,
  Syringe,
  Weight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import babyHandsParent from "@/assets/baby-hand-parent2.jpg";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { versParentDashboard } from "@/lib/dashboard/adapterParent";
import { useAuth } from "@/contexts/useAuth";
import { identiteUtilisateur } from "@/services/api";
import type { StepStatus } from "@/lib/dashboard/types";

/**
 * Accueil du dashboard Parent.
 *
 * Les données viennent de `GET /api/parents/espace`, via `useEspaceParent`, puis
 * sont traduites par `versParentDashboard` vers la forme de présentation attendue
 * ici. Sans session ou sans enfant, l'écran affiche un état vide explicite
 * plutôt que des valeurs mockées : afficher « Moussa Moussa » alors que l'API a
 * rendu le vide serait pire que de ne rien montrer.
 */
export default function ParentDashboard() {
  const { utilisateur } = useAuth();
  const { enfants, chargement, erreur } = useEspaceParent(
    utilisateur?.role === "parent",
  );

  const donnees = versParentDashboard(enfants[0], identiteUtilisateur(utilisateur));
  const { child, nextVaccination, lastSteps, quickActions } = donnees;

  if (chargement) {
    return (
      <p className="text-sm text-[var(--app-muted)]" role="status">
        Chargement de votre espace…
      </p>
    );
  }

  if (erreur) {
    return (
      <div className="app-card space-y-3 p-6" role="alert">
        <h2 className="text-base font-bold text-[var(--app-heading)]">
          Impossible de charger votre espace
        </h2>
        <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
      </div>
    );
  }

  /* Parent sans enfant rattaché : il n'a pas encore utilisé un code d'accès,
     ou son compte n'est lié à aucun dossier. */
  if (enfants.length === 0) {
    return (
      <div className="app-card space-y-3 p-6">
        <h2 className="text-base font-bold text-[var(--app-heading)]">
          Aucun enfant dans votre dossier
        </h2>
        <p className="text-sm text-[var(--app-muted)]">
          Si vous avez reçu un code d’accès de la maternité, contactez l’agent pour
          rattacher votre compte à votre dossier.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ---------- Grille principale : 2 colonnes sur grand écran ---------- */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* 1. Carte enfant */}
        <div className="app-card app-card-interactive flex flex-col items-center gap-5 p-5 text-center sm:flex-row sm:items-start sm:p-6 sm:text-left">
          {/* Pas de photo pour l'instant : pastille d'initiales, le champ
              photoUrl viendra avec l'API. */}
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-[var(--app-action)]/30 font-serif text-2xl font-bold text-[var(--app-action)] sm:size-24">
            {child.firstName.charAt(0)}
            {child.lastName.charAt(0)}
          </div>

          <div className="w-full min-w-0 flex-1 space-y-2">
            <div>
              <h2 className="truncate font-serif text-xl font-bold text-[var(--app-heading)]">
                {child.firstName} {child.lastName}
              </h2>
              {/* Poids et taille ne sont pas fournis par l'espace parent :
                  la ligne n'affiche que ce qui est connu, sans « null kg ». */}
              <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                Né le {child.birthDate} · {child.ageLabel}
                {child.weightKg !== null ? ` · ${child.weightKg} kg` : ""}
                {child.heightCm !== null ? ` · ${child.heightCm} cm` : ""}
              </p>
            </div>

            <div>
              <span className="app-chip max-w-full">
                <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  Dossier {child.recordNumber}
                </span>
              </span>
            </div>

            <div className="pt-1">
              <Link to="/parent/enfants" className="app-action w-full sm:w-auto">
                <span>Voir le dossier</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Prochaine vaccination */}
        <div className="app-card flex flex-col justify-between p-5 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="app-icon-tile">
                <Calendar className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[var(--app-heading)]">
                  Prochaine vaccination
                </h3>
                <span className="text-xs text-[var(--app-faint)]">
                  Rappel automatique
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-2xl font-bold text-[var(--app-heading)]">
                {nextVaccination.date}
              </div>
              <p className="text-sm font-medium text-[var(--app-text)]">
                {nextVaccination.vaccineName} · {nextVaccination.doseLabel}
              </p>
              <p className="text-xs font-semibold text-[var(--app-emerald)]">
                Il reste {nextVaccination.daysUntil} jours
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-[var(--app-border-soft)] pt-4">
            <Link to="/parent/vaccinations" className="app-link-action">
              <span>Voir le calendrier</span>
              <ChevronRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 3. Dernières étapes */}
        <div className="app-card flex flex-col justify-between p-5 sm:p-6">
          <div>
            <h3 className="pb-2 text-base font-bold text-[var(--app-heading)]">
              Dernières étapes
            </h3>

            <ol className="space-y-3 pt-1">
              {lastSteps.map((step) => (
                <TimelineRow
                  key={step.id}
                  status={step.status}
                  title={step.title}
                  date={step.date}
                />
              ))}
            </ol>
          </div>

          <div className="mt-4 border-t border-[var(--app-border-soft)] pt-4">
            <Link to="/parent/enfants" className="app-link-action">
              <span>Voir tout le parcours</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 4. Carte d'affirmation (image plein cadre) */}
        <div className="group relative flex min-h-[180px] items-center justify-center overflow-hidden rounded-3xl border border-[var(--app-border)] p-6 text-center shadow-xs sm:min-h-[220px]">
          <img
            src={babyHandsParent}
            alt="Mains parentales tenant les pieds du bébé"
            className="absolute inset-0 size-full object-cover brightness-[0.75] transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-black/20"
          />
          <div className="relative z-10 space-y-1 text-white">
            <p className="font-serif text-2xl drop-shadow-md sm:text-3xl">
              Parce que chaque enfant compte
            </p>
            <p className="text-xl text-emerald-200 sm:text-2xl">♡</p>
          </div>
        </div>
      </div>

      {/* ---------- Chiffres clés ----------
          Une colonne sur téléphone : à 375px, deux colonnes de compteurs
          produiraient des valeurs coupées. */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
        <MiniStat
          icon={Baby}
          label="Âge de l’enfant"
          value={child.ageLabel}
        />
        <MiniStat
          icon={Weight}
          label="Poids de naissance"
          value={`${child.weightKg} kg`}
        />
        <MiniStat
          icon={Ruler}
          label="Taille de naissance"
          value={`${child.heightCm} cm`}
        />
        <MiniStat
          icon={Syringe}
          label="Prochaine dose"
          value={nextVaccination.vaccineName}
        />
      </div>

      {/* ---------- Accès rapides ---------- */}
      <div className="app-card flex flex-col items-center gap-4 p-4 sm:flex-row sm:justify-between sm:p-5">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] text-white">
            <Plus className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-[var(--app-heading)]">
              Un autre enfant à déclarer ?
            </h4>
            <p className="text-xs text-[var(--app-muted)]">
              Retrouvez ici l’ensemble des raccourcis de votre espace.
            </p>
          </div>
        </div>

        {/* Grille de 2 colonnes sur téléphone : les 4 raccourcis restent
            accessibles au doigt sans horizontal scroll. */}
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:justify-end">
          {quickActions.map((action) => (
            <Link
              key={action.to + action.label}
              to={action.to}
              className="app-action-outline min-w-0"
            >
              <FileText className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Compteur compact ---------- */

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Baby;
  label: string;
  value: string;
}) {
  return (
    <div className="app-card space-y-2 p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-xs text-[var(--app-faint)]">
          {label}
        </span>
        <Icon className="size-4 shrink-0 text-[var(--app-emerald)]" aria-hidden="true" />
      </div>
      <p className="truncate font-serif text-lg font-bold text-[var(--app-heading)] sm:text-xl">
        {value}
      </p>
    </div>
  );
}

/* ---------- Ligne de la frise chronologique ---------- */

const statusStyles: Record<StepStatus, string> = {
  done: "text-[var(--app-emerald)]",
  current: "text-[var(--app-brand)]",
  upcoming: "text-[var(--app-faint)]",
};

function TimelineRow({
  status,
  title,
  date,
}: {
  status: StepStatus;
  title: string;
  date?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-2.5 text-xs sm:text-sm">
      <span className="flex min-w-0 items-center gap-2.5">
        {status === "done" ? (
          <CheckCircle2
            className={cn("size-4 shrink-0", statusStyles[status])}
            aria-hidden="true"
          />
        ) : (
          <span
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 rounded-full border-2 border-current",
              statusStyles[status],
            )}
          />
        )}
        <span
          className={cn(
            "truncate font-medium text-[var(--app-heading)]",
            status === "upcoming" && "text-[var(--app-muted)]",
          )}
        >
          {title}
        </span>
      </span>
      {date && (
        <span className="shrink-0 font-mono text-xs text-[var(--app-faint)]">
          {date}
        </span>
      )}
    </li>
  );
}