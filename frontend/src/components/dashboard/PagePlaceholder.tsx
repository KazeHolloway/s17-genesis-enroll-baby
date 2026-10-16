import { Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";

/**
 * Page en attente d'implementation.
 *
 * But : la navigation, la coquille, le theme et l'accueil sont deja livres ;
 * il ne reste qu'a remplacer le contenu de chaque page. Les textes d'attente
 * sont volontairement generiques pour ne pas figer une copie metier.
 */
export default function PagePlaceholder({
  title,
  description,
  hint,
  cta,
  to,
}: {
  /** Titre de la page, tel qu'affiche dans l'en-tete de la navigation. */
  title: string;
  /** Explication courte de ce que contiendra la page. */
  description: string;
  /** Rappel pour l'equipe de developpement, retire a la livraison finale. */
  hint: string;
  /** Libelle du bouton de retour ; laisse vide pour ne pas afficher de bouton. */
  cta?: string;
  /** Destination du bouton. */
  to?: string;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="app-card w-full max-w-lg p-6 text-center sm:p-8">
        <span className="app-chip mx-auto">
          <Clock className="size-3.5" aria-hidden="true" />
          <span>En construction</span>
        </span>

        <h2 className="mt-4 font-serif text-xl font-bold text-[var(--app-heading)] sm:text-2xl">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--app-muted)]">
          {description}
        </p>

        {cta && to && (
          <Link
            to={to}
            className="app-action mt-6 !rounded-full !px-5 !py-2.5 !text-sm"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {cta}
          </Link>
        )}

        {/* Repere pour l'equipe : a supprimer quand la page est livree. */}
        <p className="mt-6 border-t border-dashed border-[var(--app-border)] pt-4 text-xs leading-relaxed text-[var(--app-faint)]">
          {hint}
        </p>
      </div>
    </div>
  );
}