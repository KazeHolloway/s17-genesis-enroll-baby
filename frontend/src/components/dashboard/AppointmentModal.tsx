import React, { useState } from 'react';
import { X, Calendar, Sparkles } from 'lucide-react';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookSuccess: (details: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  onBookSuccess,
}) => {
  const [motif, setMotif] = useState('Vaccination VPI 2ème dose');
  const [date, setDate] = useState('2025-10-15');
  const [heure, setHeure] = useState('09:30');
  const [centre, setCentre] = useState('Centre de Santé Intégré Ouenze');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBookSuccess(`Rendez-vous confirmé pour le ${new Date(date).toLocaleDateString('fr-FR')} à ${heure} (${centre}). Un rappel vous sera envoyé dans l'espace parent.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-[#134e43]/20 dark:border-emerald-500/30 overflow-hidden flex flex-col transition-colors">
        <div className="p-5 bg-gradient-to-r from-[#12493e] to-[#0f3d34] dark:from-black dark:to-[#0a1815] text-white flex items-center justify-between border-b border-transparent dark:border-emerald-500/20">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-emerald-300" />
            <h3 className="text-base font-bold text-white">Prendre un rendez-vous</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
              Motif de consultation
            </label>
            <select
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
            >
              <option value="Vaccination VPI 2ème dose">Vaccination - VPI 2ème dose</option>
              <option value="Visite pédiatrique de routine">Visite pédiatrique de routine (pesée & taille)</option>
              <option value="Retrait d'acte d'état civil">Retrait d'acte de naissance officiel</option>
              <option value="Conseil allaitement & nutrition">Conseil allaitement & nutrition</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                Heure
              </label>
              <input
                type="time"
                required
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
              Lieu / Établissement
            </label>
            <select
              value={centre}
              onChange={(e) => setCentre(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
            >
              <option value="Centre de Santé Intégré Ouenze">Centre de Santé Intégré Ouenze</option>
              <option value="Maternité Blanche Gomez">Maternité Blanche Gomez - Brazzaville</option>
              <option value="PMI Centrale Bacongo">PMI Centrale Bacongo</option>
              <option value="Mairie du 3ème Arrondissement">Mairie du 3ème Arrondissement (État Civil)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirmer le rendez-vous</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
