import React, { useMemo, useState } from 'react';
import {
  BarChart3,
  Baby,
  Activity,
  Download,
  ShieldCheck,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import type { AgentKpi } from '../../types/dashboard';

interface AgentStatisticsProps {
  kpi: AgentKpi;
  etablissement: string;
  onShowToast: (msg: string) => void;
}

function pourcentage(part: number, total: number): string {
  if (total <= 0) return '—';
  return `${Math.round((part / total) * 1000) / 10}%`;
}

export const AgentStatistics: React.FC<AgentStatisticsProps> = ({
  kpi,
  etablissement,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'consolidee' | 'natalite' | 'mortalite'>('consolidee');
  const [selectedPeriod, setSelectedPeriod] = useState<'mois' | 'trimestre' | 'annee'>('annee');

  const donnees = useMemo(() => {
    const mois = kpi.parMois;
    if (mois.length === 0) {
      return {
        naissances: kpi.naissances,
        garcons: kpi.garcons,
        filles: kpi.filles,
        mortNes: kpi.mortNes,
        deces: kpi.deces,
        lignes: [] as typeof mois,
      };
    }

    const nombreMois =
      selectedPeriod === 'mois'
        ? 1
        : selectedPeriod === 'trimestre'
          ? Math.min(3, mois.length)
          : mois.length;
    const periode = mois.slice(-nombreMois);
    const somme = (extrait: (ligne: (typeof periode)[number]) => number) =>
      periode.reduce((total, ligne) => total + extrait(ligne), 0);

    return {
      naissances: somme((m) => m.naissances),
      garcons: somme((m) => m.garcons),
      filles: somme((m) => m.filles),
      mortNes: somme((m) => m.mort_nes),
      deces: somme((m) => m.deces),
      lignes: periode,
    };
  }, [kpi, selectedPeriod]);

  const tauxSurvie = pourcentage(donnees.naissances - donnees.mortNes, donnees.naissances);
  const tauxMortaliteNeonatale = pourcentage(donnees.mortNes, donnees.naissances);
  const couvertureVaccinale = pourcentage(kpi.dosesAdministrees, kpi.doses);
  const tauxGarcons = pourcentage(donnees.garcons, donnees.naissances);
  const tauxFilles = pourcentage(donnees.filles, donnees.naissances);

  const handleExportReport = () => {
    onShowToast(
      `Rapport sanitaire officiel (${selectedPeriod.toUpperCase()}) généré depuis les statistiques de l'établissement.`,
    );
  };

  const cartes = [
    {
      libelle: 'Total Naissances',
      valeur: String(donnees.naissances),
      detail: `${donnees.naissances - donnees.mortNes} naissances vivantes (${tauxSurvie})`,
      Icone: Baby,
      accent: 'text-emerald-500',
      valeurClasse: 'text-[#103d34] dark:text-[#f0fdf9]',
      detailClasse: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      libelle: 'Répartition par sexe',
      valeur: `${donnees.garcons} / ${donnees.filles}`,
      detail: `${tauxGarcons} garçons · ${tauxFilles} filles`,
      Icone: Activity,
      accent: 'text-emerald-500',
      valeurClasse: 'text-[#103d34] dark:text-[#f0fdf9]',
      detailClasse: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      libelle: 'Doses PEV Administrées',
      valeur: String(kpi.dosesAdministrees),
      detail: `${couvertureVaccinale} des ${kpi.doses} échéances du calendrier`,
      Icone: ShieldCheck,
      accent: 'text-emerald-500',
      valeurClasse: 'text-[#103d34] dark:text-[#f0fdf9]',
      detailClasse: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      libelle: 'Mortalité Néonatale',
      valeur: `${donnees.mortNes}`,
      detail: `${tauxMortaliteNeonatale} des naissances · ${donnees.deces} décès déclarés`,
      Icone: Heart,
      accent: 'text-rose-500',
      valeurClasse: 'text-rose-600 dark:text-rose-400',
      detailClasse: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Statistiques Épidémiologiques & Sanitaires
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            {etablissement || 'Établissement'} — vue consolidée pour le responsable de santé et la Direction Médicale.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 dark:bg-white/10 rounded-2xl">
            {(['mois', 'trimestre', 'annee'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedPeriod === p
                    ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {p === 'mois' ? 'Ce mois' : p === 'trimestre' ? 'Trimestre' : 'Année'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exporter le rapport</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
        {[
          { key: 'consolidee' as const, label: 'Vue Consolidée', icon: BarChart3 },
          { key: 'natalite' as const, label: 'Statistiques de Natalité', icon: Baby },
          { key: 'mortalite' as const, label: 'Statistiques de Mortalité', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b5e52] text-white shadow-xs dark:bg-emerald-500 dark:text-black'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === 'consolidee' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cartes.map((carte) => {
              const Icon = carte.Icone;
              return (
                <div
                  key={carte.libelle}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1.5"
                >
                  <span className="text-xs text-slate-400 flex items-center justify-between">
                    <span>{carte.libelle}</span>
                    <Icon className={`w-4 h-4 ${carte.accent}`} />
                  </span>
                  <div className={`text-3xl font-bold font-serif ${carte.valeurClasse}`}>
                    {carte.valeur}
                  </div>
                  <p className={`text-[11px] font-medium ${carte.detailClasse}`}>
                    {carte.detail}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Indicateurs de suivi
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Dossiers soldés</span>
                    <span className="text-emerald-600">
                      {pourcentage(kpi.dossiersComplets, kpi.dossiers)}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: pourcentage(kpi.dossiersComplets, kpi.dossiers) }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Couverture du calendrier vaccinal</span>
                    <span className="text-emerald-600">{couvertureVaccinale}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: couvertureVaccinale }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold pb-1">
                    <span>Taux de survie néonatale</span>
                    <span className="text-emerald-600">{tauxSurvie}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: tauxSurvie }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                  Répartition mensuelle
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  {donnees.lignes.length > 0 ? `${donnees.lignes.length} mois` : 'Aucune donnée'}
                </span>
              </div>

              {donnees.lignes.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                  Aucune statistique n'a encore été publiée pour la période demandée.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 text-[11px] uppercase tracking-wider">
                        <th className="py-2 pr-3">Mois</th>
                        <th className="py-2 px-3 text-right">Naissances</th>
                        <th className="py-2 px-3 text-right">Garçons</th>
                        <th className="py-2 px-3 text-right">Filles</th>
                        <th className="py-2 pl-3 text-right">Mort-nés</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {donnees.lignes.map((ligne) => (
                        <tr key={ligne.mois}>
                          <td className="py-2 pr-3 font-semibold text-[#103d34] dark:text-emerald-100">
                            {ligne.mois}
                          </td>
                          <td className="py-2 px-3 text-right text-[#38554d] dark:text-emerald-200/80">
                            {ligne.naissances}
                          </td>
                          <td className="py-2 px-3 text-right text-[#38554d] dark:text-emerald-200/80">
                            {ligne.garcons}
                          </td>
                          <td className="py-2 px-3 text-right text-[#38554d] dark:text-emerald-200/80">
                            {ligne.filles}
                          </td>
                          <td className="py-2 pl-3 text-right text-[#38554d] dark:text-emerald-200/80">
                            {ligne.mort_nes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'natalite' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Répartition par Sexe</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                {tauxGarcons} Garçons · {tauxFilles} Filles
              </div>
              <p className="text-[11px] text-slate-500">
                {donnees.garcons} garçons / {donnees.filles} filles enregistrés
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Naissances Vivantes</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                {donnees.naissances - donnees.mortNes}
              </div>
              <p className="text-[11px] text-slate-500">sur {donnees.naissances} naissances enregistrées</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-xs text-slate-400">Dossiers suivis</span>
              <div className="text-xl font-bold text-[#103d34] dark:text-emerald-200">
                {kpi.dossiers}
              </div>
              <p className="text-[11px] text-slate-500">{kpi.dossiersComplets} dossiers soldés</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Natalité par mois
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {selectedPeriod === 'mois' ? 'Ce mois' : selectedPeriod === 'trimestre' ? 'Trimestre' : 'Année'}
              </span>
            </div>

            {donnees.lignes.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                Aucune donnée de natalité publiée pour la période demandée.
              </p>
            ) : (
              <div className="space-y-3">
                {donnees.lignes.map((ligne) => {
                  const largeur = pourcentage(ligne.naissances, donnees.naissances);
                  return (
                    <div key={ligne.mois} className="text-xs">
                      <div className="flex justify-between font-semibold pb-1">
                        <span>{ligne.mois}</span>
                        <span className="text-emerald-600">
                          {ligne.naissances} naissances ({ligne.garcons}G / {ligne.filles}F)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: largeur }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'mortalite' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/40 text-xs text-[#134e43] dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                <strong>{donnees.deces} décès</strong> enregistrés dans notre établissement sur la période déclarée.
              </span>
            </div>
            <span className="font-bold font-mono text-[11px] px-2.5 py-1 rounded bg-white dark:bg-black border">
              {tauxMortaliteNeonatale} de mortalité néonatale
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Mortalité Néonatale</span>
              <div className="text-2xl font-bold font-serif text-slate-800 dark:text-white">
                {tauxMortaliteNeonatale} ({donnees.mortNes} mort-nés)
              </div>
              <p className="text-[11px] text-slate-500">Calculé sur {donnees.naissances} naissances</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Décès déclarés</span>
              <div className="text-2xl font-bold font-serif text-slate-800 dark:text-white">
                {donnees.deces}
              </div>
              <p className="text-[11px] text-slate-500">Toutes causes confondues sur la période</p>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
              <span className="text-slate-400">Taux de Survie</span>
              <div className="text-2xl font-bold font-serif text-emerald-600 dark:text-emerald-400">
                {tauxSurvie}
              </div>
              <p className="text-[11px] text-slate-500">
                {donnees.naissances - donnees.mortNes} naissances vivantes
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                Décès et mort-nés par mois
              </h3>
              <span className="text-xs text-slate-400 font-mono">Sources : registre sanitaire</span>
            </div>

            {donnees.lignes.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                Aucun décès n'a été publié pour la période demandée.
              </p>
            ) : (
              <div className="space-y-2.5 text-xs">
                {donnees.lignes.map((ligne) => (
                  <div
                    key={ligne.mois}
                    className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-white/5"
                  >
                    <span className="font-semibold">{ligne.mois}</span>
                    <span className="font-bold text-slate-600 dark:text-emerald-200">
                      {ligne.mort_nes} mort-né{ligne.mort_nes > 1 ? 's' : ''} · {ligne.deces} décès
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
