import { useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CalendarClock,
  Check,
  FileText,
} from "lucide-react";
import { useAuth } from "@/contexts/useAuth";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { toDisplayDate } from "@/lib/dashboard/adapterParent";
import { cn } from "@/lib/utils";
import type { Rappel } from "@/services/api";

type Filtre = "toutes" | "non-lues";

interface NotificationAffichee {
  cle: string;
  rappel: Rappel;
  enfantPrenom: string;
  enfantNom: string;
}

/**
 * Liste complète des notifications du parent.
 *
 * Sources : les rappels calculés par le serveur pour chaque enfant de l'espace
 * (`type` vaccin ou déclaration). Le statut « lu » n'existant pas côté API, il
 * est géré localement — le compteur de la cloche, lui, reste dérivé des rappels
 * réels dans le layout.
 */
export default function ParentNotifications() {
  const { utilisateur } = useAuth();
  const { enfants, chargement, erreur } = useEspaceParent(
    utilisateur?.role === "parent",
  );
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const [enLues, setEnLues] = useState<Set<string>>(new Set());

  const notifications: NotificationAffichee[] = useMemo(() => {
    return enfants.flatMap((espace) =>
      espace.rappels.map((rappel) => ({
        cle: `rappel-${espace.dossier.id}-${rappel.type}-${rappel.date_echeance}`,
        rappel,
        enfantPrenom: espace.enfant.prenom,
        enfantNom: espace.enfant.nom,
      })),
    );
  }, [enfants]);

  const affichees = notifications.filter((n) =>
    filtre === "non-lues" ? !enLues.has(n.cle) : true,
  );
  const nonLues = notifications.length - enLues.size;

  const basculer = (cle: string) => {
    setEnLues((precedent) => {
      const nouveau = new Set(precedent);
      if (nouveau.has(cle)) nouveau.delete(cle);
      else nouveau.add(cle);
      return nouveau;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[var(--app-heading)]">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-[var(--app-muted)]">
            Rappels de vaccination et démarches à venir pour vos enfants.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(["toutes", "non-lues"] as const).map((valeur) => (
            <button
              key={valeur}
              type="button"
              onClick={() => setFiltre(valeur)}
              aria-pressed={filtre === valeur}
              className={cn(
                "app-subtab",
                filtre === valeur && "app-subtab-actif",
              )}
            >
              {valeur === "toutes" ? "Toutes" : `Non lues (${nonLues})`}
            </button>
          ))}
        </div>
      </div>

      {chargement && (
        <p className="text-sm text-[var(--app-muted)]" role="status">
          Chargement des notifications…
        </p>
      )}

      {!chargement && erreur && (
        <div className="app-card p-6" role="alert">
          <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
        </div>
      )}

      {!chargement && !erreur && affichees.length === 0 && (
        <div className="app-card p-6 text-center">
          <Bell className="mx-auto mb-3 size-10 text-[var(--app-brand)]" aria-hidden="true" />
          <h2 className="font-serif text-lg font-bold text-[var(--app-heading)]">
            {filtre === "non-lues" ? "Aucune notification non lue" : "Aucune notification"}
          </h2>
          <p className="mt-2 text-sm text-[var(--app-muted)]">
            {filtre === "non-lues"
              ? "Toutes vos notifications sont à jour."
              : "Les rappels du service de maternité apparaîtront ici."}
          </p>
        </div>
      )}

      {!chargement && !erreur && affichees.length > 0 && (
        <ul className="space-y-2">
          {affichees.map(({ cle, rappel, enfantPrenom, enfantNom }) => {
            const lue = enLues.has(cle);
            return (
              <li
                key={cle}
                className={cn(
                  "app-card flex items-start gap-3 p-4 transition-opacity",
                  lue && "opacity-60",
                )}
              >
                <span className="app-icon-tile shrink-0">
                  {rappel.type === "vaccin" ? (
                    <CalendarClock className="size-4" aria-hidden="true" />
                  ) : (
                    <FileText className="size-4" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--app-heading)]">
                    {rappel.titre}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--app-muted)]">
                    {enfantPrenom} {enfantNom} · échéance{" "}
                    {toDisplayDate(rappel.date_echeance)}
                  </p>
                  {rappel.prochaine_demarche && (
                    <p className="mt-1 text-xs text-[var(--app-muted)]">
                      {rappel.prochaine_demarche}
                    </p>
                  )}
                  <span
                    className={cn(
                      "mt-2 inline-flex rounded-full px-2.5 py-1 text-[0.6875rem] font-bold",
                      rappel.statut === "delai_expire" ||
                        rappel.jours_restants < 0
                        ? "bg-[var(--app-action)] text-white"
                        : "bg-[var(--app-sage-soft)] text-[var(--app-emerald)]",
                    )}
                  >
                    {rappel.statut === "declaree"
                      ? "Déclarée"
                      : rappel.jours_restants < 0
                        ? `${Math.abs(rappel.jours_restants)} j de retard`
                        : `Dans ${rappel.jours_restants} j`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => basculer(cle)}
                  aria-label={lue ? "Marquer comme non lue" : "Marquer comme lue"}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--app-border-soft)] px-2.5 py-1.5 text-xs font-semibold text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-3)]"
                >
                  <BellRing className="size-3.5" aria-hidden="true" />
                  {lue ? "Relire" : "Lire"}
                </button>
              </li>
            );
          })}

          {nonLues > 0 && (
            <li className="pt-1">
              <button
                type="button"
                onClick={() => setEnLues(new Set(notifications.map((n) => n.cle)))}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-[var(--app-action)] transition-colors hover:underline"
              >
                <Check className="size-4" aria-hidden="true" />
                Tout marquer comme lu
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}