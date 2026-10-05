import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader, { type DashboardUser } from "./DashboardHeader";
import type { DashboardNavItem } from "@/lib/dashboard/navigation";

interface DashboardShellProps {
  navItems: DashboardNavItem[];
  user: DashboardUser;
  /** Nombre de notifications non lues (badge de la cloche). */
  unreadCount?: number;
  /** Route de la liste des notifications ; cloche masquee si absente. */
  notificationsTo?: string;
  /** Page rendue par le routeur : <Outlet /> dans les layouts. */
  children: ReactNode;
}

/**
 * Coquille commune aux deux dashboards : sidebar + en-tete + contenu.
 *
 * Elle recoit la navigation et l'identite du compte, puis rend la page enfant
 * fournie par le routeur. Aucun acces reseau ici : la coquille ne fait que de
 * la mise en page, ce qui laisse les layouts libres de ne fournir que leurs
 * donnees et leurs routes.
 */
export default function DashboardShell({
  navItems,
  user,
  unreadCount = 0,
  notificationsTo,
  children,
}: DashboardShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Le tiroir se referme apres chaque navigation : sinon il masque la page sur
  // mobile apres un clic dans le menu, ou un retour navigateur.
  // L'ajustement se fait pendant le rendu (et non dans un effet) pour eviter un
  // second rendu de l'arbre complet.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsDrawerOpen(false);
  }

  // Verrouille le scroll du document quand le tiroir est ouvert.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isDrawerOpen]);

  // Echap ferme le tiroir, comme attendu sur un panneau modal.
  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDrawerOpen]);

  return (
    <div className="app-root app-shell flex">
      <DashboardSidebar
        navItems={navItems}
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <div className="app-main flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          user={user}
          unreadCount={unreadCount}
          notificationsTo={notificationsTo}
          isDrawerOpen={isDrawerOpen}
          onOpenMenu={() => setIsDrawerOpen(true)}
        />

        <main className="app-content flex-1 py-5 sm:py-6 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}