import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Phone, Pin, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import {
  getEtablissements,
  identiteUtilisateur,
  type Etablissement,
} from "@/services/api";

/**
 * Paramètres du compte agent.
 *
 * Lecture des informations réelles de la session et de l'établissement
 * d'affectation (`GET /api/etablissements`). Aucun endpoint de mise à jour n'est
 * exposé : la page reste en lecture seule ; le thème se règle dans l'en-tête.
 */
export default function AgentSettings() {
  const { utilisateur } = useAuth();
  const identite = identiteUtilisateur(utilisateur);
  const [etablissement, setEtablissement] = useState<Etablissement | null>(null);

  useEffect(() => {
    let ignore = false;
    getEtablissements()
      .then((reponse) => {
        if (!ignore) {
          const trouve = reponse.data.find(
            (e) => e.id === utilisateur?.etablissement_id,
          );
          setEtablissement(trouve ?? null);
        }
      })
      .catch(() => {
        /* Établissement introuvable : la page reste lisible. */
      });
    return () => {
      ignore = true;
    };
  }, [utilisateur?.etablissement_id]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--app-heading)]">
          Paramètres
        </h1>
        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Votre profil et votre service d’affectation.
        </p>
      </div>

      <section className="app-card space-y-5 p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[var(--app-brand)] font-serif text-lg font-bold text-white">
            {identite.initials || <ShieldCheck className="size-6" aria-hidden="true" />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-lg font-bold text-[var(--app-heading)]">
              {identite.firstName} {identite.lastName}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--app-muted)]">
              {utilisateur?.role === "admin"
                ? "Administrateur du système"
                : "Agent de maternité"}
            </p>
          </div>
        </div>

        <dl className="space-y-3 border-t border-[var(--app-border-soft)] pt-4">
          <Ligne libelle="Identifiant professionnel">
            {utilisateur ? `AG-${String(utilisateur.id).padStart(3, "0")}` : "—"}
          </Ligne>
          <Ligne libelle="Téléphone">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-4 text-[var(--app-action)]" aria-hidden="true" />
              {utilisateur?.telephone}
            </span>
          </Ligne>
          <Ligne libelle="Adresse électronique">
            {utilisateur?.email ?? "Non renseignée"}
          </Ligne>
        </dl>
      </section>

      <section className="app-card space-y-3 p-5 sm:p-6">
        <h2 className="text-base font-bold text-[var(--app-heading)]">
          Service d’affectation
        </h2>
        {etablissement ? (
          <dl className="space-y-3">
            <Ligne libelle="Établissement">{etablissement.nom}</Ligne>
            <Ligne libelle="Ville">
              <span className="inline-flex items-center gap-1.5">
                <Pin className="size-4 text-[var(--app-action)]" aria-hidden="true" />
                {etablissement.ville}
              </span>
            </Ligne>
            {etablissement.telephone && (
              <Ligne libelle="Téléphone">{etablissement.telephone}</Ligne>
            )}
          </dl>
        ) : (
          <p className="text-sm text-[var(--app-muted)]">
            Aucun établissement associé au compte.
          </p>
        )}
      </section>

      <section className="app-card p-5 sm:p-6">
        <h2 className="text-base font-bold text-[var(--app-heading)]">
          Modification des informations
        </h2>
        <p className="mt-2 text-sm text-[var(--app-muted)]">
          L’API n’expose pas encore la mise à jour du profil. Adressez-vous à
          l’administration pour toute correction.
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