import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: ReactNode;
  className?: string;
  /** Rend la carte cliquable (ombre au survol). */
  interactive?: boolean;
  /** Etiquette accessible decrivant le contenu. */
  label?: string;
}

/**
 * Surface de base des dashboards : carte blanche, coins arrondis, ombre legere.
 * Les couleurs viennent des variables de `.app-root`, donc le mode sombre est
 * automatique.
 */
export default function DashboardCard({
  children,
  className,
  interactive = false,
  label,
}: DashboardCardProps) {
  return (
    <section
      aria-label={label}
      className={cn(
        "app-card p-4 sm:p-6",
        interactive && "app-card-interactive",
        className,
      )}
    >
      {children}
    </section>
  );
}