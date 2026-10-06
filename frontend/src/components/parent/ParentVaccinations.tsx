import React, { useState } from 'react';
import { Calendar, CheckCircle2, Bell, Search, CalendarCheck } from 'lucide-react';
import type { VaccineItem } from '../../types/dashboard';
import { RendezVousSuivi } from './RendezVousSuivi';
import { ConfirmationStatutVaccin } from './ConfirmationStatutVaccin';

interface ParentVaccinationsProps {
  vaccines: VaccineItem[];
  onOpenAppointmentModal: () => void;
  onShowToast: (msg: string) => void;
}

export const ParentVaccinations: React.FC<ParentVaccinationsProps> = ({
  vaccines,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'calendrier' | 'statuts' | 'rendezvous'>('calendrier');
  const [filterQuery, setFilterQuery] = useState('');

  const filteredVaccines = vaccines.filter(
    (v) =>
      v.nom.toLowerCase().includes(filterQuery.toLowerCase()) ||
      v.dose.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Mobile-First Header matching Screen 2 of mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Vaccinations
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Prochaines vaccinations, validation des statuts et rappels du carnet médical.
          </p>
        </div>

        {/* View Switcher Pills: Calendrier vs Statuts Confirmés vs Module RDV & Rappels 24h */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-white/10 rounded-2xl self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveSubTab('calendrier')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'calendrier'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Calendrier
          </button>
          <button
            onClick={() => setActiveSubTab('statuts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'statuts'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Statuts Validés</span>
          </button>
          <button
            onClick={() => setActiveSubTab('rendezvous')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === 'rendezvous'
                ? 'bg-white dark:bg-black text-[#103d34] dark:text-emerald-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Rendez-vous & Rappels 24h</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'statuts' ? (
        <ConfirmationStatutVaccin
          onBack={() => setActiveSubTab('calendrier')}
          onNavigateToRdv={() => setActiveSubTab('rendezvous')}
          onShowToast={onShowToast}
        />
      ) : activeSubTab === 'rendezvous' ? (
        <RendezVousSuivi
          onBack={() => setActiveSubTab('calendrier')}
          onShowToast={onShowToast}
        />
      ) : (
        <>
          {/* Action Callout */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1b5e52] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <CalendarCheck className="w-5 h-5 text-emerald-300" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#103d34] dark:text-emerald-100">
                  Prendre un rendez-vous & Programmer les rappels
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-emerald-200/70">
                  Le système déclenche automatiquement le rappel SMS 24 heures avant l'échéance.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSubTab('rendezvous')}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold shadow-xs cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Gérer les rendez-vous</span>
            </button>
          </div>

      {/* Quick Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un vaccin (VPI, Polio, Pentavalent...)"
          value={filterQuery}
          onChange={(e) => setFilterQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-emerald-500/25 rounded-2xl text-[#103d34] dark:text-emerald-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
        />
      </div>

      {/* Subheader "Prochaines vaccinations" as seen in Screen 2 */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-300/70 mb-2">
          Prochaines vaccinations
        </h3>

        {/* Timeline list matching Screen 2 of mockup */}
        <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-emerald-200 dark:before:bg-emerald-900/60">
          {filteredVaccines.map((v) => {
            const isDone = v.statut === 'administre';
            return (
              <div key={v.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-3.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-[#f4f7f5] dark:ring-black transition-transform group-hover:scale-110 ${
                    isDone
                      ? 'bg-[#1b7e5c] dark:bg-emerald-500 text-white dark:text-black'
                      : 'bg-white dark:bg-[#121c19] border-2 border-[#1b5e52] dark:border-emerald-400 text-[#1b5e52]'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1b5e52] dark:bg-emerald-400" />
                  )}
                </div>

                {/* Card Container */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isDone
                      ? 'bg-white/80 dark:bg-[#0a0a0a]/80 border-emerald-200/80 dark:border-emerald-500/30 shadow-2xs'
                      : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-emerald-500/20 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-[#1b5e52] dark:text-emerald-400">
                          {v.datePrevue}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">·</span>
                        <h4 className="text-sm sm:text-base font-bold text-[#103d34] dark:text-emerald-100">
                          {v.nom}
                        </h4>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                        {v.dose} · Âge recommandé : {v.ageRecommande}
                      </p>

                      {isDone && v.dateEffective && (
                        <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 flex items-center gap-1 font-medium pt-0.5">
                          <span>✓ Reçu le {v.dateEffective}</span>
                          {v.lotNumero && <span>· Lot : {v.lotNumero}</span>}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isDone
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {isDone ? 'Administré' : 'À venir'}
                      </span>

                      <button
                        onClick={() => onShowToast(`Rappel programmé pour : ${v.nom}`)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-500/30 text-xs font-semibold text-[#103d34] dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#121c19] transition-colors cursor-pointer min-h-[38px]"
                      >
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

        {/* Info Notice */}
        <div className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-start sm:items-center gap-3">
          <Bell className="w-5 h-5 text-[#1b7e5c] dark:text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-[#2b4c42] dark:text-emerald-200 leading-relaxed">
            Les rappels sont automatiquement envoyés par SMS à la mère 24h avant chaque échéance vaccinale.
          </p>
        </div>
      </>
      )}
    </div>
  );
};
