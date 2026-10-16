import { useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Pill,
  Syringe,
} from "lucide-react";
import RendezVousSuivi from "@/components/RendezVousSuivi";
import ConfirmationStatutVaccin from "@/components/ConfirmationStatutVaccin";
import { useEspaceParent } from "@/lib/dashboard/useEspaceParent";
import { useAuth } from "@/contexts/useAuth";
import { toDisplayDate } from "@/lib/dashboard/adapterParent";
import { cn } from "@/lib/utils";
import type { Echeance } from "@/services/api";
import type { LucideIcon } from "lucide-react";

/**
 * Onglet « Vaccins » de l'espace Parent.
 *
 * Trois vues sur le même calendrier, accessibles par sous-onglets :
 *  - Calendrier PEV : la frise des doses de l'enfant ;
 *  - Rendez-vous & Rappels 24 h : le suivi de `RendezVousSuivi` ;
 *  - Statuts validés : ce que la maternité a officiellement validé.
 *
 * Sur téléphone, les sous-onglets défilent horizontalement plutôt que de
 * s'empiler : trois libellés ne tiennent pas sur 375px.
 */

type Onglet = "calendrier" | "rendez-vous" | "statuts";

const ONGLETS: { cle: Onglet; libelle: string; icone: LucideIcon }[] = [
  { cle: "calendrier", libelle: "Calendrier", icone: Syringe },
  { cle: "rendez-vous", libelle: "Rendez-vous", icone: CalendarClock },
  { cle: "statuts", libelle: "Statuts validés", icone: CheckCircle2 },
];

function LigneEcheance({ echeance }: { echeance: Echeance }) {
  const statut = echeance.statut;
  return (
    <li className="rdv-ligne">
      <span className="rdv-ligne-fort">
        {echeance.vaccin_nom} · dose {echeance.dose_numero}
      </span>
      <span>{toDisplayDate(echeance.date_prevue)}</span>
      <span className="rdv-ligne-souple">
        {statut === "effectue"
          ? `Administré le ${toDisplayDate(echeance.date_administration ?? echeance.date_prevue)}`
          : echeance.jours_restants < 0
            ? `${Math.abs(echeance.jours_restants)} jours de retard`
            : `dans ${echeance.jours_restants} jours`}
      </span>
      <span
        className={cn(
          "badge",
          statut === "effectue"
            ? "badge-honore"
            : statut === "en_retard"
              ? "badge-manque"
              : "badge-planifie",
        )}
      >
        {statut === "effectue"
          ? "Administré"
          : statut === "en_retard"
            ? "Non administré"
            : "À venir"}
      </span>
    </li>
  );
}

export default function ParentVaccinations() {
  const [onglet, setOnglet] = useState<Onglet>("calendrier");
  const { utilisateur } = useAuth();
  /* Réservé au rôle parent : évite d'aller chercher un espace qui serait refusé. */
  const { enfants, chargement, erreur } = useEspaceParent(utilisateur?.role === "parent");

  const espace = enfants[0];
  const echeances = espace?.echeances ?? [];

  return (
    <div className="space-y-6">
      {/* ---------- Sous-onglets ---------- */}
      <div
        className="app-subtabs"
        role="tablist"
        aria-label="Sections vaccinations"
      >
        {ONGLETS.map(({ cle, libelle, icone: Icone }) => (
          <button
            key={cle}
            type="button"
            role="tab"
            aria-selected={onglet === cle}
            onClick={() => setOnglet(cle)}
            className={cn("app-subtab", onglet === cle && "app-subtab-actif")}
          >
            <Icone className="size-4 shrink-0" aria-hidden="true" />
            <span>{libelle}</span>
          </button>
        ))}
      </div>

      {chargement && (
        <p className="text-sm text-[var(--app-muted)]" role="status">
          Chargement du calendrier…
        </p>
      )}

      {!chargement && erreur && (
        <div className="app-card" role="alert">
          <p className="text-sm text-[var(--app-muted)]">{erreur}</p>
        </div>
      )}

      {/* ---------- Calendrier PEV ---------- */}
      {!chargement && onglet === "calendrier" && (
        <>
          {echeances.length === 0 ? (
            <div className="app-card p-6 text-center text-sm text-[var(--app-muted)]">
              Aucun calendrier vaccinal disponible pour cet enfant.
            </div>
          ) : (
            <section className="app-card p-5 sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Pill
                  className="size-4 text-[var(--app-action)]"
                  aria-hidden="true"
                />
                <h2 className="text-base font-bold text-[var(--app-heading)]">
                  Calendrier vaccinal
                </h2>
              </div>

              {/* Cartes sur téléphone, liste en grille sur grand écran. */}
              <ul className="space-y-2 md:hidden">
                {echeances.map((echeance) => (
                  <li key={echeance.calendrier_id} className="app-card p-4">
                    <LigneEcheance echeance={echeance} />
                  </li>
                ))}
              </ul>

              <ul className="rdv-liste hidden md:block">
                {echeances.map((echeance) => (
                  <LigneEcheance key={echeance.calendrier_id} echeance={echeance} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {/* ---------- Rendez-vous & rappels 24 h ---------- */}
      {!chargement && onglet === "rendez-vous" && <RendezVousSuivi mode="parent" />}

      {/* ---------- Statuts validés ---------- */}
      {!chargement && onglet === "statuts" && (
        <ConfirmationStatutVaccin mode="lecture" />
      )}
    </div>
  );
}
