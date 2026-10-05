import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Brand } from "@/components/landing/Brand";
import type { DashboardNavItem } from "@/lib/dashboard/navigation";

interface DashboardSidebarProps {
  navItems: DashboardNavItem[];
  /** Rend le tiroir visible sur mobile. */
  isDrawerOpen: boolean;
  onClose: () => void;
}

/**
 * Barre laterale des dashboards.
 *
 * Desktop : colonne fixe a gauche, jamais masquee.
 * Mobile  : tiroir coulissant pilote par `isDrawerOpen`, avec voile sombre et
 *           bouton de fermeture accessible.
 */
export default function DashboardSidebar({
  navItems,
  isDrawerOpen,
  onClose,
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
          "flex h-dvh w-[17rem] shrink-0 flex-col border-r border-[var(--app-border)] bg-[var(--app-surface)]",
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-out",
          "lg:sticky lg:top-0 lg:z-0 lg:translate-x-0",
          isDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full",
        )}
      >
        {/* Identite de marque + fermeture du tiroir */}
        <div className="app-header flex shrink-0 items-center justify-between pb-4">
          <Brand variant="full" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="-mr-1 rounded-lg p-2 text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-2)] hover:text-[var(--app-text)] lg:hidden"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Liens de navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          <p className="app-section-title px-3 pb-2 pt-3">Navigation</p>
          <ul className="flex flex-col gap-1">
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
                    <Icon
                      className="size-[1.125rem] shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="app-nav-badge">{item.badge}</span>
                    ) : null}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Aide contextuelle */}
        <div className="app-footer-safe shrink-0 px-3">
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-sage-soft)] p-4">
            <p className="text-xs font-semibold text-[var(--app-brand)]">
              Besoin d’aide ?
            </p>
            <p className="mt-1 text-[0.6875rem] leading-relaxed text-[var(--app-muted)]">
              Contactez votre agent de maternité pour toute question sur le dossier.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}