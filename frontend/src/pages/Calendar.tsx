import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/ui/Layout";
import VaccineTimeline from "../components/vaccines/VaccineTimeline";
import VaccineItem from "../components/vaccines/VaccineItem";
import VaccineFilter from "../components/vaccines/VaccineFilter";
import type { Vaccine, VaccineStatus } from "../lib/types";
import { getVaccines } from "../services/api";

type Filter = "tous" | VaccineStatus;

export default function Calendrier() {
  const { enfantId } = useParams();
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [prochaine, setProchaine] = useState<Vaccine | null>(null);
  const [filter, setFilter] = useState<Filter>("tous");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getVaccines(enfantId!)
      .then((data) => {
        setVaccines(data.echeances);
        setProchaine(data.prochaine_echeance);
      })
      .finally(() => setLoading(false));
  }, [enfantId]);

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

      {/* Prochaine échéance */}
      {prochaine && (
        <div className="w-full p-4 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-xs text-muted-foreground">Prochaine échéance</p>
          <p className="font-medium text-sm text-primary">{prochaine.nom}</p>
        </div>
      )}

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
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Chargement...
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          Aucun vaccin ne correspond aux filtres.
        </p>
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {filtered.map((vaccine) => (
            <VaccineItem
              key={vaccine.id}
              vaccine={vaccine}
              onClick={() => {}}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
