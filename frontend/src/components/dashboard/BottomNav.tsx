import { NavLink } from "react-router-dom";

import { cn } from "@/lib/utils";
import type { BottomNavItem } from "@/lib/dashboard/navigation";

interface BottomNavProps {
  items: BottomNavItem[];
  /** Ouvre le tiroir de navigation (onglet « Menu »). */
  onOpenMenu: () => void;
  /** Rôle courant, utilisé pour l'aria-label global. */
  roleLabel: string;
}

/**
 * Barre de navigation basse, smartphones uniquement (cachée à partir de `lg`).
 *
 * Ergonomie pouce : les 5 cibles font au minimum 48px de haut et la barre
 * respecte la zone de geste iOS via `padding-bottom: env(safe-area-inset-bottom)`.
 * L'onglet central Agent (`kind: "action"`) est surélevé au-dessus de la barre :
 * c'est l'action la plus fréquente, elle doit être atteignable au pouce.
 */
export function BottomNav({ items, onOpenMenu, roleLabel }: BottomNavProps) {
  return (
    <nav
      aria-label={`Navigation ${roleLabel}`}
      className="app-bottom-nav fixed inset-x-0 bottom-0 z-30 lg:hidden"
    >
      <ul className="app-bottom-nav-list">
        {items.map((item) => {
          const Icon = item.icon;

          /* Action rapide surélevée au centre (Agent). */
          if (item.kind === "action") {
            return (
              <li key={`${item.kind}-${item.to}`} className="app-bottom-nav-item">
                <NavLink
                  to={item.to}
                  aria-label={item.label}
                  className="app-bottom-nav-fab"
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="sr-only">{item.label}</span>
                </NavLink>
              </li>
            );
          }

          /* Onglet Menu : ouvre le tiroir, ce n'est pas une route. */
          if (item.kind === "menu") {
            return (
              <li key={`${item.kind}-${item.to}`} className="app-bottom-nav-item">
                <button
                  type="button"
                  onClick={onOpenMenu}
                  aria-label={item.label}
                  aria-haspopup="dialog"
                  className="app-bottom-nav-link"
                >
                  <span className="relative">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="app-bottom-nav-label">{item.label}</span>
                </button>
              </li>
            );
          }

          return (
            <li key={item.to} className="app-bottom-nav-item">
              <NavLink
                to={item.to}
                end={item.end}
                aria-label={
                  item.badge ? `${item.label} (${item.badge})` : item.label
                }
                className={({ isActive }: { isActive: boolean }) =>
                  cn("app-bottom-nav-link", isActive && "is-active")
                }
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" />
                  {item.badge ? (
                    <span
                      aria-hidden="true"
                      className={cn(
                        "app-bottom-nav-badge",
                        item.badgeAlert && "app-bottom-nav-badge-alert",
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </span>
                <span className="app-bottom-nav-label">{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}