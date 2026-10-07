import { Link } from "react-router-dom";
import { ArrowRight, Baby, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";

export default function ParentChildren() {
  const { utilisateur } = useAuth();

  const { enfants } = useEspaceParent(utilisateur?.role === "parent");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-[var(--app-heading)]">
          Mes enfants
        </h1>

        <p className="mt-1 text-sm text-[var(--app-muted)]">
          Retrouvez les enfants rattachés à votre compte.
        </p>
      </div>

      {enfants.length === 0 ? (
        <div className="app-card p-6 text-center">
          <Baby
            className="mx-auto mb-3 size-10 text-[var(--app-brand)]"
            aria-hidden="true"
          />

          <h2 className="font-serif text-lg font-bold text-[var(--app-heading)]">
            Aucun enfant
          </h2>

          <p className="mt-2 text-sm text-[var(--app-muted)]">
            Aucun enfant n'est actuellement rattaché à votre compte.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {enfants.map((item) => (
            <div
              key={item.enfant.id}
              className="app-card space-y-5 p-5 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-[var(--app-action)]/30 font-serif text-xl font-bold text-[var(--app-action)]">
                  {item.enfant.prenom.charAt(0)}
                  {item.enfant.nom.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-xl font-bold text-[var(--app-heading)]">
                    {item.enfant.prenom} {item.enfant.nom}
                  </h2>

                  <p className="mt-1 text-sm text-[var(--app-muted)]">
                    Né(e) le {item.enfant.date_naissance}
                  </p>

                  <div className="mt-3">
                    <span className="app-chip">
                      <CheckCircle2
                        className="size-3.5"
                        aria-hidden="true"
                      />
                      Dossier {item.dossier.numero}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-[var(--app-border-soft)] pt-4">
                <p className="text-sm text-[var(--app-muted)]">
                  Statut du dossier
                </p>

                <p className="text-sm font-semibold text-[var(--app-heading)]">
                  {item.dossier.statut}
                </p>
              </div>

              <Link
                to={`/parent/enfants/${item.enfant.id}`}
                className="app-action w-full justify-center"
              >
                <span>Voir le dossier</span>
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}