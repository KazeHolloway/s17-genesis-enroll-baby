// components/vaccines/VaccineTimeline.tsx

import type { Vaccine } from "../../lib/types";

const MONTHS = [0, 2, 3, 4, 6, 9, 12, 15];

export default function VaccineTimeline({
  vaccines,
  onMonthClick,
}: {
  vaccines: Vaccine[];
  onMonthClick: (mois: number) => void;
}) {
  const getMonthStatus = (
    mois: number,
  ): "realise" | "avenir" | "retard" | "aucun" => {
    const monthVaccines = vaccines.filter((v) => v.mois === mois);
    if (monthVaccines.length === 0) return "aucun";
    if (monthVaccines.some((v) => v.statut === "retard")) return "retard";
    if (monthVaccines.every((v) => v.statut === "realise")) return "realise";
    return "avenir";
  };

  const DOT_STYLES = {
    realise: "bg-green-500 border-green-500",
    avenir: "bg-blue-400 border-blue-400",
    retard: "bg-red-500 border-red-500 animate-pulse",
    aucun: "bg-stone-300 border-stone-300",
  };

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-center min-w-[600px]">
        {MONTHS.map((mois, i) => {
          const status = getMonthStatus(mois);
          const count = vaccines.filter((v) => v.mois === mois).length;

          return (
            <div
              key={mois}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Ligne connectrice */}
              {i < MONTHS.length - 1 && (
                <div className="absolute top-3 left-1/2 w-full h-0.5 bg-stone-200" />
              )}

              {/* Point */}
              <button
                type="button"
                onClick={() => count > 0 && onMonthClick(mois)}
                className={`relative z-10 w-6 h-6 rounded-full border-2 transition cursor-pointer ${DOT_STYLES[status]} ${
                  count === 0 ? "cursor-default" : "hover:scale-110"
                }`}
                title={
                  count > 0
                    ? `${count} vaccin(s) à ${mois} mois`
                    : "Aucun vaccin"
                }
              >
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>

              {/* Label */}
              <span className="mt-2 text-xs font-medium text-muted-foreground">
                {mois} mois
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
