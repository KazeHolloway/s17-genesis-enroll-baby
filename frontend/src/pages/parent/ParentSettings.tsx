import { type ReactNode } from "react";
import { Contact, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { identiteUtilisateur } from "@/services/api";

/**
 * Paramètres du compte parent.
 *
 * Lecture des informations réelles de la session : `GET /auth/moi` ne fournit
 * pas d'endpoint de mise à jour, la page reste donc en lecture seule. Le thème
 * se règle via le bouton de l'en-tête (ThemeToggle) et n'est pas dupliqué ici.
 */
export default function ParentSettings() {
  const { utilisateur } = useAuth();
  const identite = identiteUtilisateur(utilisateur);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--app-heading)]">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Les informations de votre compte, telles qu’enregistrées à la
          maternité.
        </p>
      </div>

      <section className="app-card space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] font-serif text-lg font-bold text-white">
            {identite.initials || (
              <Contact className="size-6" aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg font-bold text-[var(--app-heading)]">
              {identite.firstName} {identite.lastName}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--app-muted)]">
              Compte parent rattaché par la maternité.
            </p>
          </div>
        </div>

        <dl className="space-y-3 border-t border-[var(--app-border-soft)] pt-4">
          <Ligne libelle="Téléphone principal">
            {utilisateur?.telephone}
          </Ligne>
          <Ligne libelle="Adresse électronique">
            {utilisateur?.email ?? "Non renseignée"}
          </Ligne>
          <Ligne libelle="Rôle">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-[var(--app-action)]" aria-hidden="true" />
              Parent
            </span>
          </Ligne>
        </dl>
      </section>

      <section className="app-card p-5 sm:p-6">
        <h2 className="text-base font-bold text-[var(--app-heading)]">
          Modification des informations
        </h2>
        <p className="mt-2 text-sm text-[var(--app-muted)]">
          L’API n’expose pas encore la mise à jour du profil. Pour corriger un
          nom ou un numéro, contactez le service de maternité qui a créé le
          dossier.
        </p>
      </section>
    </div>
  );
}

function Ligne({
  libelle,
  children,
}: {
  libelle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <dt className="text-sm text-[var(--app-muted)]">{libelle}</dt>
      <dd className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-heading)]">
        {children}
      </dd>
    </div>
  );
}