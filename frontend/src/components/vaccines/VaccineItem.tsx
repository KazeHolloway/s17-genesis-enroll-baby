// components/vaccines/VaccineItem.tsx

import type { Vaccine } from "../../lib/types";
import VaccineStatus from "./VaccineStatus";

export default function VaccineItem({
  vaccine,
  onClick,
}: {
  vaccine: Vaccine;
  onClick: () => void;
}) {
  const dateStr = new Date(vaccine.date_prevue).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border transition hover:shadow-md cursor-pointer ${
        vaccine.statut === "retard"
          ? "border-red-300 bg-red-50"
          : vaccine.statut === "realise"
            ? "border-green-200 bg-green-50"
            : "border-primary/20 bg-background"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-sm text-primary">
            {vaccine.nom}{" "}
            {vaccine.dose > 1 && (
              <span className="text-xs text-muted-foreground">
                (Dose {vaccine.dose})
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {vaccine.date_effectuee
              ? `Effectué le ${new Date(vaccine.date_effectuee).toLocaleDateString("fr-FR")}`
              : `Prévu le ${dateStr}`}
          </p>
          {vaccine.etablissement && (
            <p className="text-xs text-muted-foreground mt-0.5">
              📍 {vaccine.etablissement}
            </p>
          )}
        </div>
        <VaccineStatus status={vaccine.statut} />
      </div>
    </button>
  );
}
