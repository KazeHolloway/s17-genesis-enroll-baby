import React, { useState } from 'react';
import { User, Shield, ChevronRight, HelpCircle, Users } from 'lucide-react';

interface ParentSettingsProps {
  onShowToast: (msg: string) => void;
  onNavigateToChildren?: () => void;
}

export const ParentSettings: React.FC<ParentSettingsProps> = ({
  onShowToast,
  onNavigateToChildren,
}) => {
  const [activeSubView, setActiveSubView] = useState<'menu' | 'infos' | 'securite'>('menu');
  const [nom, setNom] = useState('Awa Moussana');
  const [tel, setTel] = useState('+242 06 12 34 56');
  const [email, setEmail] = useState('awa@gmail.com');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Vos informations personnelles ont été mises à jour.');
    setActiveSubView('menu');
  };

  return (
    <div className="space-y-5 max-w-xl mx-auto animate-in fade-in duration-200">
      {/* Title matching Screen 4 of mockup */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
          Mon profil
        </h1>
      </div>

      {/* Profile Header matching Screen 4 of mockup */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex items-center gap-4 text-left">
        <div className="w-16 h-16 rounded-full bg-[#1b5e52] dark:bg-emerald-600 text-white font-bold text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
          A
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            {nom}
          </h2>
          <p className="text-xs text-slate-500 dark:text-emerald-200/70 font-mono">
            {email}
          </p>
          <span className="inline-block text-[11px] font-semibold text-[#1b7e5c] dark:text-emerald-400">
            Compte Parent Certifié
          </span>
        </div>
      </div>

      {activeSubView === 'menu' && (
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-1">
          {/* Menu Items matching Screen 4 of mockup */}
          <button
            onClick={() => setActiveSubView('infos')}
            className="w-full p-4 rounded-2xl hover:bg-[#f4f8f6] dark:hover:bg-[#121c19] flex items-center justify-between transition-colors cursor-pointer group text-left min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#103d34] dark:text-emerald-100 block">
                  Mes informations
                </span>
                <span className="text-[11px] text-slate-400">Nom, contact, adresse</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {onNavigateToChildren && (
            <button
              onClick={onNavigateToChildren}
              className="w-full p-4 rounded-2xl hover:bg-[#f4f8f6] dark:hover:bg-[#121c19] flex items-center justify-between transition-colors cursor-pointer group text-left min-h-[52px]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#103d34] dark:text-emerald-100 block">
                    Mes enfants
                  </span>
                  <span className="text-[11px] text-slate-400">Gérer les dossiers rattachés</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          <button
            onClick={() => setActiveSubView('securite')}
            className="w-full p-4 rounded-2xl hover:bg-[#f4f8f6] dark:hover:bg-[#121c19] flex items-center justify-between transition-colors cursor-pointer group text-left min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#103d34] dark:text-emerald-100 block">
                  Sécurité & Authentification
                </span>
                <span className="text-[11px] text-slate-400">Mot de passe, biométrie, sessions</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => onShowToast('Pour toute assistance, notre équipe est disponible via support@enrollbaby.org')}
            className="w-full p-4 rounded-2xl hover:bg-[#f4f8f6] dark:hover:bg-[#121c19] flex items-center justify-between transition-colors cursor-pointer group text-left min-h-[52px]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-[#103d34] dark:text-emerald-100 block">
                  Aide & FAQ
                </span>
                <span className="text-[11px] text-slate-400">Questions fréquentes et support</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Edit Infos Sub-view */}
      {activeSubView === 'infos' && (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
              Modifier mes informations
            </h3>
            <button
              type="button"
              onClick={() => setActiveSubView('menu')}
              className="text-xs text-[#1b5e52] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Retour
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Nom complet
            </label>
            <input
              type="text"
              required
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Numéro de téléphone mobile
            </label>
            <input
              type="tel"
              required
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-100 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold shadow-xs cursor-pointer min-h-[44px]"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      )}

      {/* Security Sub-view */}
      {activeSubView === 'securite' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">
              Sécurité du compte
            </h3>
            <button
              type="button"
              onClick={() => setActiveSubView('menu')}
              className="text-xs text-[#1b5e52] dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Retour
            </button>
          </div>

          <div className="space-y-3 text-xs text-[#3d5a52] dark:text-emerald-200/80">
            <div className="p-3.5 rounded-xl bg-[#f8fbf9] dark:bg-[#121c19] border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-[#103d34] dark:text-emerald-100">Mot de passe</span>
                <span>Dernière modification il y a 3 mois</span>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('Lien de réinitialisation envoyé par SMS')}
                className="text-xs font-bold text-[#1b5e52] dark:text-emerald-400 hover:underline"
              >
                Changer
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-[#f8fbf9] dark:bg-[#121c19] border border-slate-200 dark:border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="font-semibold block text-[#103d34] dark:text-emerald-100">Authentification à deux facteurs</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">✓ Activée par SMS</span>
              </div>
              <span className="text-xs text-slate-400">Géré</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
