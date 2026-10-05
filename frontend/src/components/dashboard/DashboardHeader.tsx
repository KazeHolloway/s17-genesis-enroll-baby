import { Bell, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/landing/ThemeToggle";
import { defaultPageTitle, pageTitles } from "@/lib/dashboard/navigation";

export interface DashboardUser {
  firstName: string;
  lastName: string;
  roleLabel: string;
  initials: string;
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
 * La sidebar dupliquant la navigation sur mobile, l'en-tete n'affiche le
 * bouton menu qu'en dessous de 1024px.
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
    <header className="app-header sticky top-0 z-30 flex items-center gap-2 border-b border-[var(--app-border)] bg-[var(--app-surface)]/85 backdrop-blur-md sm:gap-3">
      {/* Ouverture du tiroir : mobile uniquement */}
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        aria-controls="dashboard-sidebar"
        aria-expanded={isDrawerOpen}
        className="-ml-1.5 shrink-0 rounded-xl p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)] lg:hidden"
      >
        <Menu className="size-5" aria-hidden="true" />
      </button>

      {/* Titre de page */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold text-[var(--app-heading)] sm:text-lg">
          {title}
        </h1>
        <p className="hidden truncate text-xs text-[var(--app-muted)] sm:block">
          {user.roleLabel}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />

        {showBell && (
          <Link
            to={notificationsTo as string}
            aria-label={
              unreadCount > 0
                ? `Notifications (${unreadCount} non lues)`
                : "Notifications"
            }
            className="relative rounded-xl p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)]"
          >
            <Bell className="size-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-[var(--app-mint)] text-[0.5625rem] font-bold text-[#06231d]">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        {/* Identite du compte connecte */}
        <div className="ml-0.5 flex items-center gap-2 sm:ml-1 sm:gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] text-xs font-bold text-white">
            <span className="sr-only">{user.firstName}</span>
            <span aria-hidden="true">{user.initials}</span>
          </div>
          <span
            className={cn(
              "hidden max-w-40 truncate text-sm font-semibold",
              "text-[var(--app-heading)] xl:block",
            )}
          >
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>
    </header>
  );
}