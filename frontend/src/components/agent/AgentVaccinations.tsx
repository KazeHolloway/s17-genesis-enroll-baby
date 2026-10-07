import React, { useState } from 'react';
import { Syringe, Plus, CheckCircle2, Bell, CalendarCheck } from 'lucide-react';
import type { VaccineItem, Child } from '../../types/dashboard';
import { RendezVousSuivi } from '../parent/RendezVousSuivi';
import { ConfirmationStatutVaccin } from '../parent/ConfirmationStatutVaccin';

interface AgentVaccinationsProps {
  vaccines: VaccineItem[];
  childrenList?: Child[];
  initialSubTab?: 'confirmation' | 'lots' | 'rendezvous';
  onShowToast: (msg: string) => void;
}

export const AgentVaccinations: React.FC<AgentVaccinationsProps> = ({
  vaccines,
  childrenList = [],
  initialSubTab = 'confirmation',
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'confirmation' | 'lots' | 'rendezvous'>(initialSubTab);
  const [isInjectModalOpen, setIsInjectModalOpen] = useState(false);
  const [selectedVaccineName, setSelectedVaccineName] = useState('BCG (Tuberculose)');
  const [lotNumber, setLotNumber] = useState('LOT-2026-X89');

  const handleRegisterInjection = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInjectModalOpen(false);
    onShowToast(`Injection de ${selectedVaccineName} enregistrée (Lot : ${lotNumber}). Carnet parent mis à jour.`);
  };

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

      {activeTab === 'confirmation' && (
        <ConfirmationStatutVaccin
          childrenList={childrenList}
          onShowToast={onShowToast}
          onNavigateToRdv={() => setActiveTab('rendezvous')}
        />
      )}

      {activeTab === 'rendezvous' && (
        <RendezVousSuivi
          onBack={() => setActiveTab('confirmation')}
          onShowToast={onShowToast}
        />
      )}

      {activeTab === 'lots' && (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => setIsInjectModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold shadow-xs cursor-pointer min-h-[44px]"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer une injection</span>
            </button>
          </div>

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

              <button
                onClick={() => onShowToast(`Rappel envoyé aux parents pour le vaccin : ${v.nom}`)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#ebf5f0] hover:bg-[#134e43] hover:text-white dark:bg-[#1b2b27] dark:hover:bg-emerald-500 dark:hover:text-black text-[#1b7e5c] dark:text-emerald-300 text-xs font-bold transition-colors cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Envoyer un rappel aux parents</span>
              </button>
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
                <th className="py-3 px-3 text-right">Relance</th>
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
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => onShowToast(`Rappel envoyé aux parents pour le vaccin : ${v.nom}`)}
                      className="px-2.5 py-1 rounded-lg bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b7e5c] dark:text-emerald-300 text-xs font-semibold hover:underline cursor-pointer"
                    >
                      Envoyer le rappel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for registering an injection */}
      {isInjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-[#134e43]/20 dark:border-emerald-500/30 overflow-hidden flex flex-col transition-colors">
            <div className="p-5 bg-[#103d34] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold text-white">Saisie d’administration vaccinale</h3>
              </div>
              <button
                onClick={() => setIsInjectModalOpen(false)}
                className="text-white hover:text-emerald-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterInjection} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-200 mb-1">
                  Vaccin administré
                </label>
                <select
                  value={selectedVaccineName}
                  onChange={(e) => setSelectedVaccineName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-sm"
                >
                  <option value="BCG (Tuberculose)">BCG (Tuberculose) - Dose unique</option>
                  <option value="Polio 0 (VPO)">Polio 0 (VPO) - 1ère dose orale</option>
                  <option value="Pentavalent 1">Pentavalent 1 (DTC-HepB-Hib)</option>
                  <option value="VPI 2ème dose">VPI 2ème dose injectable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-emerald-200 mb-1">
                  Numéro de lot
                </label>
                <input
                  type="text"
                  required
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-sm font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1b5e52] text-white text-xs font-bold hover:bg-[#144b41] cursor-pointer"
                >
                  Valider l’injection & Traçabilité
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
