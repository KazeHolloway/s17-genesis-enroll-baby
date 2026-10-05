// pages/Calendrier.tsx

import { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/ui/Layout";
import VaccineTimeline from "../components/vaccines/VaccineTimeline";
import VaccineItem from "../components/vaccines/VaccineItem";
import VaccineFilter from "../components/vaccines/VaccineFilter";
import type { Vaccine, VaccineStatus } from "../lib/types";
import { getVaccines } from "../services/api";

type Filter = "tous" | VaccineStatus;

export default function Calendrier() {
  const { childId } = useParams();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [filter, setFilter] = useState<Filter>("tous");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Charger les vaccins
  useState(() => {
    getVaccines(childId!).then(setVaccines);
  });

  const counts: Record<Filter, number> = {
    tous: vaccines.length,
    realise: vaccines.filter((v) => v.statut === "realise").length,
    avenir: vaccines.filter((v) => v.statut === "avenir").length,
    retard: vaccines.filter((v) => v.statut === "retard").length,
  };

  const filtered = vaccines.filter((v) => {
    if (selectedMonth !== null && v.mois !== selectedMonth) return false;
    if (filter !== "tous" && v.statut !== filter) return false;
    return true;
  });

  return (
    <Layout>
      <h1 className="text-xl font-bold text-primary">Calendrier Vaccinal</h1>

      {/* Timeline */}
      <VaccineTimeline
        vaccines={vaccines}
        onMonthClick={(mois) =>
          setSelectedMonth(selectedMonth === mois ? null : mois)
        }
      />

      {/* Filtres */}
      <VaccineFilter active={filter} onChange={setFilter} counts={counts} />

      {/* Liste */}
      <div className="flex flex-col gap-3 w-full">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Aucun vaccin ne correspond aux filtres.
          </p>
        ) : (
          filtered.map((vaccine) => (
            <VaccineItem
              key={vaccine.id}
              vaccine={vaccine}
              onClick={() => {}}
            />
          ))
        )}
      </div>
    </Layout>
  );
}
