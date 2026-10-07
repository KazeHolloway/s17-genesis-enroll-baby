import React, { useState } from 'react';
import { Syringe, CheckCircle2, CalendarCheck } from 'lucide-react';
import type { VaccineItem, Child } from '../../types/dashboard';
import RendezVousSuivi from '../RendezVousSuivi';
import ConfirmationStatutVaccin from '../ConfirmationStatutVaccin';

interface AgentVaccinationsProps {
  vaccines: VaccineItem[];
  childrenList?: Child[];
  initialSubTab?: 'confirmation' | 'lots' | 'rendezvous';
  onShowToast: (msg: string) => void;
}

/**
 * Vue PEV de l'espace agent.
 *
 * - « Confirmation Statuts » : `POST /vaccinations/confirmer` (agent/admin).
 * - « Rendez-vous & Rappels » : `POST /rendez-vous` + `PUT /rendez-vous/:id`
 *   (agent/admin), rappels 24 h calculés par le serveur.
 * - « Traçabilité PEV » : lecture seule du calendrier. Aucun endpoint ne
 *   gère les lots ni l'envoi de rappels manuels, les actions qui les
 *   simulaient ont été retirées plutôt que laissées inactives.
 */
export const AgentVaccinations: React.FC<AgentVaccinationsProps> = ({
  vaccines,
  initialSubTab = 'confirmation',
}) => {
  const [activeTab, setActiveTab] = useState<'confirmation' | 'lots' | 'rendezvous'>(initialSubTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Programme Élargi de Vaccination (PEV) & Traçabilité
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Validation des statuts (administré / non administré), suivi des lots et rappels automatiques.
          </p>
        </div>

        {/* View Switcher: Confirmation Statuts vs Traçabilité PEV vs Rendez-vous & Rappels 24h */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-white/10 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('confirmation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'confirmation'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Confirmation Statuts</span>
          </button>
          <button
            onClick={() => setActiveTab('lots')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'lots'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Traçabilité PEV</span>
          </button>
          <button
            onClick={() => setActiveTab('rendezvous')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'rendezvous'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Rendez-vous & Rappels 24h</span>
          </button>
        </div>
      </div>

      {activeTab === 'confirmation' && <ConfirmationStatutVaccin mode="validation" />}

      {activeTab === 'rendezvous' && <RendezVousSuivi mode="agent" />}

      {activeTab === 'lots' && (
        <>
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs">
        {/* Mobile View: Cards (md:hidden) */}
        <div className="md:hidden space-y-3">
          {vaccines.map((v) => (
            <div
              key={v.id}
              className="p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
                    {v.nom}
                  </h4>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {v.dose} · {v.ageRecommande}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                    v.statut === 'administre'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  {v.statut === 'administre' ? `✓ Fait le ${v.dateEffective}` : 'À venir'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-white/5">
                <div>
                  <span className="text-slate-400 block text-[10px]">Date prévue</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {v.datePrevue}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Lot & Traçabilité</span>
                  <span className="font-mono text-slate-600 dark:text-emerald-400/80">
                    {v.lotNumero || 'Non attribué'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 text-xs font-semibold uppercase">
                <th className="py-3 px-3">Vaccin</th>
                <th className="py-3 px-3">Dose & Âge</th>
                <th className="py-3 px-3">Date Prévue</th>
                <th className="py-3 px-3">Statut & Date Effectuée</th>
                <th className="py-3 px-3">Lot & Professionnel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {vaccines.map((v) => (
                <tr key={v.id} className="hover:bg-[#f9fcfa] dark:hover:bg-[#121c19] transition-colors">
                  <td className="py-3.5 px-3 font-semibold text-[#103d34] dark:text-emerald-100">
                    {v.nom}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 dark:text-emerald-200/80">
                    {v.dose} ({v.ageRecommande})
                  </td>
                  <td className="py-3.5 px-3 text-xs">{v.datePrevue}</td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        v.statut === 'administre'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {v.statut === 'administre' ? `✓ Fait le ${v.dateEffective}` : 'À venir'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-slate-400 font-mono">
                    {v.lotNumero || 'En attente'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
