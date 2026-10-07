import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import type { AgentUser } from '../../types/dashboard';

interface AgentSettingsProps {
  agent: AgentUser;
  onShowToast: (msg: string) => void;
}

export const AgentSettings: React.FC<AgentSettingsProps> = ({ agent, onShowToast }) => {
  const [nom, setNom] = useState(agent.nom);
  const [role, setRole] = useState(agent.role);
  const [etablissement, setEtablissement] = useState(agent.etablissement);
  const [matricule, setMatricule] = useState(agent.matricule);
  const [ville, setVille] = useState(agent.ville);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Profil professionnel consulté : la modification du compte agent n’est pas encore reliée à l’API.');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
          Paramètres du compte professionnel
        </h2>
        <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
          Informations de l'agent, accréditation de l'établissement et clé de signature.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Nom et Prénom du professionnel
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Rôle / Fonction
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Établissement rattaché
            </label>
            <input
              type="text"
              required
              value={etablissement}
              onChange={(e) => setEtablissement(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Matricule officiel
            </label>
            <input
              type="text"
              required
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
            Ville / Circonscription
          </label>
          <input
            type="text"
            required
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm"
          />
        </div>

        <div className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#1b7e5c] dark:text-emerald-400 flex-shrink-0" />
          <div className="text-xs text-[#2b4c42] dark:text-emerald-200">
            <span className="font-bold block">Session professionnelle authentifiée</span>
            <span>Connexion sécurisée par jeton · rattachée à {agent.etablissement || 'votre établissement'}</span>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
