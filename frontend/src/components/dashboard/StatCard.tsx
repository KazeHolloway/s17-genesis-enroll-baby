import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  /** Precision affichee sous le compteur. */
  hint: string;
  icon: LucideIcon;
  /** Variation en pourcentage sur la periode. */
  trend?: number;
  /** Variante visuelle, utile pour distinguer les compteurs urgents. */
  tone?: "default" | "attention";
  className?: string;
}

/**
 * Compteur cle d'un tableau de bord : icone, valeur, variation et precision.
 *
 * La valeur est formatee a la francaise (espace insecable entre les milliers)
 * via `Intl`, sans dependance externe.
 */
export default function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  tone = "default",
  className,
}: StatCardProps) {
  const formatted = new Intl.NumberFormat("fr-FR").format(value);
  const isUp = typeof trend === "number" && trend > 0;
  const hasTrend = typeof trend === "number" && trend !== 0;

  return (
    <article
      className={cn(
        "app-card app-card-interactive relative overflow-hidden p-4 sm:p-5",
        className,
      )}
    >
      {/* Liseré de couleur, masque en lecture mobile pour rester sobre */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-1",
          tone === "attention" ? "bg-[var(--app-mint)]" : "bg-[var(--app-brand)]",
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="app-section-title">{label}</p>
          <p className="mt-2 font-serif text-3xl font-bold leading-none text-[var(--app-heading)] tabular-nums sm:text-4xl">
            {formatted}
          </p>
        </div>
        <span className="app-icon-tile">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold",
              isUp
                ? "bg-[var(--app-sage-soft)] text-[var(--app-brand)]"
                : "bg-[var(--app-surface-2)] text-[var(--app-muted)]",
            )}
          >
            {isUp ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {isUp ? "+" : "−"}
            {Math.abs(trend)}%
          </span>
        )}
        <span className="text-[0.6875rem] leading-snug text-[var(--app-faint)]">
          {hint}
        </span>
      </div>
    </article>
  );
}