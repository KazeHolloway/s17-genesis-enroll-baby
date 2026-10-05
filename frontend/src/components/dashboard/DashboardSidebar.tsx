import { AnimatePresence, motion } from "motion/react";
import { LogOut, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/landing/Brand";
import type { DashboardNavItem } from "@/lib/dashboard/navigation";

interface DashboardSidebarProps {
  navItems: DashboardNavItem[];
  /** Rend le tiroir visible sur mobile. */
  isDrawerOpen: boolean;
  onClose: () => void;
  /** Nom affiché sur le bouton de déconnexion. */
  logoutLabel?: string;
  /** Destination de la déconnexion (page de connexion). */
  logoutTo?: string;
  /** Carte d'identité affichée en pied de sidebar (espace agent). */
  identity?: {
    role: string;
    name: string;
    facility: string;
  };
  }

/**
 * Barre laterale des dashboards.
 *
 * Fond vert forêt (ou noir en thème sombre), identique à la maquette de
 * référence : les liens sont en menthe discret au repos et passent sur un fond
 * plus clair quand la page est active.
 *
 * Desktop : colonne fixe à gauche, jamais masquée.
 * Mobile  : tiroir coulissant piloté par `isDrawerOpen`, avec voile sombre et
 *           bouton de fermeture accessible.
 */
export default function DashboardSidebar({
  navItems,
  isDrawerOpen,
  onClose,
  logoutLabel = "Se déconnecter",
  logoutTo = "/login",
  identity,
}: DashboardSidebarProps) {
  return (
    <>
      {/* Voile : mobile uniquement. */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <aside
        id="dashboard-sidebar"
        aria-label="Navigation principale"
        className={cn(
          // Largeur bornée : sur un écran étroit le tiroir ne doit jamais
          // prendre plus de 85% de la largeur, sinon le voile utile disparaît.
          "app-sidebar flex h-dvh w-[min(17rem,85vw)] shrink-0 flex-col border-r xl:w-72",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out",
          "lg:sticky lg:top-0 lg:z-0 lg:translate-x-0",
          isDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        {/* Identité de marque + fermeture du tiroir.
            Le même padding horizontal que la liste de liens, pour que le logo
            et les entrées soient alignés. */}
        <div className="app-sidebar-top flex shrink-0 items-center justify-between pb-5">
          <Logo variant="white" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="-mr-2 flex size-10 items-center justify-center rounded-lg text-emerald-100/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Liens de navigation.
            `overscroll-contain` empêche le défilement de se propager au corps
            de la page quand la liste est déjà en fin de course. */}
        <nav className="flex-1 overflow-y-auto overscroll-contain px-5">
          <ul className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className="app-nav-link"
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={cn(
                          "app-nav-badge",
                          item.badgeAlert && "app-nav-badge-alert",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pied de sidebar : identité de l'agent puis déconnexion.
            Pas de section « Compte » ici : Profil, Notifications et Réglages sont
            déjà dans la navigation ci-dessus, les y dupliquer donnait l'impression
            d'une seconde barre dans le même tiroir. */}
        <div className="app-footer-safe shrink-0 space-y-1 px-5 pt-3">
          {identity && (
            <div className="app-sidebar-card">
              <span className="block text-[0.6875rem] font-semibold text-emerald-300">
                {identity.role}
              </span>
              <strong className="mt-0.5 block text-xs text-white">
                {identity.name}
              </strong>
              <p className="mt-0.5 text-[0.625rem] text-emerald-200/70">
                {identity.facility}
              </p>
            </div>
          )}

          <Link to={logoutTo} className="app-sidebar-ghost">
            <LogOut className="size-4" aria-hidden="true" />
            <span>{logoutLabel}</span>
          </Link>
        </div>
      </aside>
    </>
  );
}