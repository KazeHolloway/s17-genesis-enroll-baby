import { Bell, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { defaultPageTitle, pageTitles } from "@/lib/dashboard/navigation";

export interface DashboardUser {
  firstName: string;
  lastName: string;
  roleLabel: string;
  initials: string;
  /** Etablissement affiche a cote du nom (espace agent). */
  facility?: string;
  /** Matricule de l'agent, affiche en pastille. */
  matricule?: string;
}

interface DashboardHeaderProps {
  user: DashboardUser;
  /** Nombre de notifications non lues (badge de la cloche). */
  unreadCount?: number;
  /** Route de la liste des notifications ; masquee si vide. */
  notificationsTo?: string;
  /** Etat du tiroir, pour `aria-expanded` du bouton menu. */
  isDrawerOpen: boolean;
  onOpenMenu: () => void;
}

/**
 * En-tete commun aux deux dashboards.
 *
* Collante, translucide, avec le voile `backdrop-blur` de la maquette de
 * reference. Le bouton menu n'apparait qu'en dessous de 1024px, la sidebar
 * occupant la colonne de gauche au-dela.
 *
 * Pas de bascule de rôle ici : elle occupait une place régulière en tête
 * d'écran sur téléphone et n'est pas un accès indispensable au quotidien.
 */
export default function DashboardHeader({
  user,
  unreadCount = 0,
  notificationsTo,
  isDrawerOpen,
  onOpenMenu,
}: DashboardHeaderProps) {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? defaultPageTitle;
  const showBell = Boolean(notificationsTo);

  return (
    <header className="app-header sticky top-0 z-30 flex items-center justify-between gap-1.5 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl sm:gap-3 dark:border-white/10 dark:bg-black/90">
      {/* Ouverture du tiroir : mobile uniquement. Au-delà de 1024px, la
          sidebar est déjà visible et le bouton n'a plus d'objet. */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        aria-controls="dashboard-sidebar"
        aria-expanded={isDrawerOpen}
        className="-ml-2 flex size-10 shrink-0 items-center justify-center rounded-xl text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-3)] lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Titre de page + sous-titre.
          `min-w-0` + `truncate` : le titre se coupe proprement au lieu de
          pousser les actions hors de l'écran sur téléphone. */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-bold text-[var(--app-heading)] sm:text-xl lg:text-2xl">
          {user.facility ?? `Bonjour, ${user.firstName} !`}
        </h1>
        {/* Sous-titre : statut du rôle actif, puis page courante sous 640px.
            Sur téléphone la ligne fait une seule hauteur. */}
        <p className="mt-0.5 truncate text-[0.6875rem] text-[var(--app-muted)] sm:text-sm">
          {user.facility ? user.roleLabel : title}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
        <ThemeToggle />

        {/* La cloche passe sous 640px, où la bascule de rôle occupe la place.
            Elle reste dans l'en-tête au-delà, et dans le tiroir en dessous. */}
        {showBell && (
          <Link
            to={notificationsTo as string}
            aria-label={
              unreadCount > 0
                ? `Notifications (${unreadCount} non lues)`
                : "Notifications"
            }
            className="relative hidden size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--app-brand)] transition-colors hover:bg-[var(--app-surface-2)] sm:flex dark:border-emerald-500/30 dark:bg-[var(--app-surface-2)] dark:text-emerald-200"
          >
            <Bell className="size-4" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-black"
              />
            )}
          </Link>
        )}

        {/* Avatar du compte connecté : son nom apparaît dès 640px. */}
        <div className="flex items-center gap-2 sm:pl-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--app-action)] text-xs font-bold text-white sm:size-9 sm:text-sm">
            <span className="sr-only">{user.firstName}</span>
            <span aria-hidden="true">{user.initials}</span>
          </div>
          <span className="hidden max-w-40 truncate text-xs font-semibold text-[var(--app-heading)] sm:block">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
}