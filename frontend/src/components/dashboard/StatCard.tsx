import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  /** Precision affichee sous le compteur. */
  hint: string;
  icon: LucideIcon;
  /** Variation en pourcentage sur la periode. */
  trend?: number;
  className?: string;
  /**
   * Rend la carte cliquable : le role change de `<article>` en `<a>`, ce qui
   * donne un lien explicite au clavier et un role correct pour les lecteurs
   * d'ecran, au lieu d'un `<div onClick>` sans tabulation.
   */
  to?: string;
}

/**
 * Compteur cle d'un tableau de bord : libelle, valeur, icone et variation.
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
  className,
  to,
}: StatCardProps) {
  const formatted = new Intl.NumberFormat("fr-FR").format(value);
  const isUp = typeof trend === "number" && trend > 0;
  const hasTrend = typeof trend === "number" && trend !== 0;

  const classes = cn("app-card app-card-interactive p-5", className);

  /* Le contenu ne change pas selon que la carte est cliquable : seul l'enveloppe
     change, pour ne pas dupliquer le JSX. */
  const contenu = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs text-[var(--app-faint)]">{label}</span>
        <Icon className="size-4 shrink-0 text-[var(--app-emerald)]" aria-hidden="true" />
      </div>

      <p className="mt-2 font-serif text-2xl font-bold text-[var(--app-heading)] tabular-nums sm:text-3xl">
        {formatted}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
        {hasTrend && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[0.6875rem] font-semibold",
              isUp ? "text-[var(--app-emerald)]" : "text-[var(--app-muted)]",
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
    </>
  );

  if (to) {
    return (
      <Link to={to} className={cn(classes, "block")}>
        {contenu}
      </Link>
    );
  }

  return <article className={classes}>{contenu}</article>;
}