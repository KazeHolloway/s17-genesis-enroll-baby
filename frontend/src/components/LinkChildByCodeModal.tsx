import React, { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import type { Child } from '../types/dashboard';

interface LinkChildByCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  childrenList: Child[];
  onSuccessLinked: (child: Child) => void;
}

export const LinkChildByCodeModal: React.FC<LinkChildByCodeModalProps> = ({
  isOpen,
  onClose,
  childrenList,
  onSuccessLinked,
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successChild, setSuccessChild] = useState<Child | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanCode = accessCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg("Veuillez saisir le code d'accès de maternité.");
      return;
    }

    // Recherche de l'enfant correspondant au code généré par l'agent de maternité
    const matched = childrenList.find(
      (c) =>
        c.codeAccesParent?.toUpperCase() === cleanCode ||
        c.referenceMaternite.toUpperCase() === cleanCode
    );

    if (matched) {
      setSuccessChild(matched);
      setTimeout(() => {
        onSuccessLinked(matched);
        setSuccessChild(null);
        setAccessCode('');
        onClose();
      }, 1200);
    } else {
      setErrorMsg(
        "Code d'accès invalide. Vérifiez le format (ex: MOU-2025-88 ou DIA-2026-42) remis sur la fiche papier de maternité par la sage-femme."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#103d34] dark:text-emerald-100">
              Rattacher le dossier d'un enfant
            </h3>
            <p className="text-xs text-slate-500 dark:text-emerald-200/70">
              Saisissez le code d'accès unique délivré par la maternité.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-[#134e43] dark:text-emerald-300">
            <ShieldCheck className="w-4 h-4" />
            <span>Règle FRD & Sécurité Hospitalière</span>
          </div>
          <p>
            Pour garantir la confidentialité médicale, <strong>seul l'agent de maternité peut créer le dossier de naissance officiel</strong>. Le parent associe son espace grâce au code sécurisé reçu à l'accouchement.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successChild && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>
              Dossier de <strong>{successChild.prenom} {successChild.nom}</strong> rattaché avec succès !
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Code d'accès maternité (sur la fiche imprimée)
            </label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="Ex : MOU-2025-88 ou DIA-2026-42"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121c19] text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#134e43] dark:focus:ring-emerald-400"
              autoFocus
            />
            <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
              Format standard : [3 lettres]-[Année]-[Chiffres]
            </span>
          </div>

          <div className="flex items-center gap-2 pt-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Associer le dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
