import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/**
 * Marque d'etape : reservee aux pages metier qui ne sont pas encore
 * developpees (vaccinations, documents, dossiers...).
 *
 * But : la navigation, la coquille et le theme sont deja livres ; il ne reste
 * qu'a remplacer le contenu de la page. Les textes d'attente et le CTA sont
 * volontairement generiques pour ne pas figer une copie metier.
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
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[var(--app-sage-soft)] text-[var(--app-brand)]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6"
            aria-hidden="true"
          >
            <path d="M12 6v6l4 2" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </div>

        <p className="app-section-title mt-5">En construction</p>
        <h2 className="mt-2 font-serif text-xl font-bold text-[var(--app-heading)] sm:text-2xl">
          {title}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[var(--app-muted)]">
          {description}
        </p>

        {cta && to && (
          <Link
            to={to}
            className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-[var(--app-brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--app-shadow-brand)] transition-opacity hover:opacity-90"
          >
            {cta}
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        )}

        {/* Repere pour l'equipe : a supprimer quand la page est livree. */}
        <p className="mt-6 border-t border-dashed border-[var(--app-border-strong)] pt-4 text-xs leading-relaxed text-[var(--app-faint)]">
          {hint}
        </p>
      </div>
    </div>
  );
}