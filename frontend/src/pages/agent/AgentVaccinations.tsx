import { useState } from "react";
import { CalendarClock, CheckCircle2, PackageSearch } from "lucide-react";
import RendezVousSuivi from "@/components/RendezVousSuivi";
import ConfirmationStatutVaccin from "@/components/ConfirmationStatutVaccin";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Onglet « Vaccins » de l'espace Agent : suivi vaccinal & PMI.
 *
 * Trois sous-onglets :
 *  - Confirmation Statuts : la tâche principale de l'agent, ouverte par défaut ;
 *  - Traçabilité PEV : gestion des lots et enregistrement d'une injection ;
 *  - Rendez-vous & Rappels 24 h : planification et relances.
 *
 * `ongletInitial` permet d'ouvrir directement une vue depuis une entrée de
 * navigation ou une carte de l'accueil, sans dupliquer la page.
 */

type Onglet = "statuts" | "tracabilite" | "rendez-vous";

const ONGLETS: { cle: Onglet; libelle: string; icone: LucideIcon }[] = [
  { cle: "statuts", libelle: "Confirmation Statuts", icone: CheckCircle2 },
  { cle: "tracabilite", libelle: "Traçabilité PEV", icone: PackageSearch },
  { cle: "rendez-vous", libelle: "Rendez-vous & Rappels", icone: CalendarClock },
];

export default function AgentVaccinations({
  ongletInitial = "statuts",
}: {
  ongletInitial?: Onglet;
}) {
  const [onglet, setOnglet] = useState<Onglet>(ongletInitial);

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

      {/* ---------- Confirmation Statuts ---------- */}
      {onglet === "statuts" && <ConfirmationStatutVaccin mode="validation" />}

      {/* ---------- Traçabilité PEV ---------- */}
      {onglet === "tracabilite" && (
        <section className="app-card space-y-3 p-6">
          <h2 className="text-base font-bold text-[var(--app-heading)]">
            Traçabilité des lots PEV
          </h2>
          <p className="text-sm text-[var(--app-muted)]">
            Gestion des numéros de lot et enregistrement d’une injection.
          </p>
          <p className="text-sm text-[var(--app-muted)]">
            À implémenter : l’API n’expose pas encore d’inventaire de lots. Le
            numéro de lot se saisit aujourd’hui dans l’onglet Confirmation
            Statuts, au moment de valider la dose.
          </p>
        </section>
      )}

      {/* ---------- Rendez-vous & rappels ---------- */}
      {onglet === "rendez-vous" && <RendezVousSuivi mode="agent" />}
    </div>
  );
}
