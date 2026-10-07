import React from 'react';
import { Clock, AlertTriangle, AlertCircle, CheckCircle2, Printer } from 'lucide-react';
import type { Child } from '../types/dashboard';

interface CivilDeclarationCountdownProps {
  child: Child;
  onOpenDeclarationModal?: () => void;
  onMarkDeclared?: () => void;
  variant?: 'banner' | 'card' | 'compact';
}

/**
 * Calcule le nombre de jours restants (sur 30 jours max) à partir de la date de naissance.
 * Si delaiDeclarationJours est renseigné manuellement, on l'utilise ou on déduit de la date.
 */
function calculateDeclarationDaysRemaining(child: Child): {
  daysRemaining: number;
  isExpired: boolean;
  totalDays: number;
  percentageUsed: number;
  daysPassed: number;
  birthDateFormatted: string;
} {
  const totalDays = 30;

  // Si l'enfant est déjà déclaré avec un acte complet
  if (child.status === 'complet') {
    return {
      daysRemaining: 0,
      isExpired: false,
      totalDays,
      percentageUsed: 100,
      daysPassed: 30,
      birthDateFormatted: child.dateNaissance,
    };
  }

  // Si delaiDeclarationJours est explicitement fourni
  if (typeof child.delaiDeclarationJours === 'number') {
    const daysRemaining = child.delaiDeclarationJours;
    const isExpired = daysRemaining <= 0;
    const daysPassed = Math.max(0, totalDays - daysRemaining);
    const percentageUsed = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));

    return {
      daysRemaining: Math.max(0, daysRemaining),
      isExpired,
      totalDays,
      percentageUsed,
      daysPassed,
      birthDateFormatted: child.dateNaissance,
    };
  }

  // Calcul basé sur la date de naissance réelle (ex: 22/09/2026 ou 2026-09-22)
  try {
    let birthTimestamp: number;
    if (child.dateNaissance.includes('/')) {
      const parts = child.dateNaissance.split('/');
      // jj/mm/aaaa
      if (parts.length === 3) {
        birthTimestamp = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
      } else {
        birthTimestamp = Date.now();
      }
    } else {
      birthTimestamp = new Date(child.dateNaissance).getTime();
    }

    const now = Date.now();
    const diffMs = now - birthTimestamp;
    const daysPassed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysPassed);
    const isExpired = daysPassed >= totalDays;
    const percentageUsed = Math.min(100, Math.round((daysPassed / totalDays) * 100));

    return {
      daysRemaining,
      isExpired,
      totalDays,
      percentageUsed,
      daysPassed,
      birthDateFormatted: child.dateNaissance,
    };
  } catch {
    return {
      daysRemaining: 18,
      isExpired: false,
      totalDays,
      percentageUsed: 40,
      daysPassed: 12,
      birthDateFormatted: child.dateNaissance,
    };
  }
}

export const CivilDeclarationCountdown: React.FC<CivilDeclarationCountdownProps> = ({
  child,
  onOpenDeclarationModal,
  onMarkDeclared,
}) => {
  const { daysRemaining, isExpired, totalDays, percentageUsed, daysPassed } = calculateDeclarationDaysRemaining(child);

  const isDeclared = child.status === 'complet';

  // Si déjà déclaré
  if (isDeclared) {
    return (
      <div className="p-4 sm:p-5 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-100">
              Déclaration de naissance effectuée
            </h4>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
              {child.prenom} {child.nom} est officiellement inscrit(e) à l'état civil ({child.numeroActe || 'Acte délivré'}).
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
          En règle
        </span>
      </div>
    );
  }

  // CAS DÉLAI EXPIRÉ (0 jour restant) - Exigence critique du ticket
  if (isExpired) {
    return (
      <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/30 border-2 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-100 shadow-sm animate-in fade-in space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm animate-pulse">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm sm:text-base font-bold text-rose-900 dark:text-rose-100">
                  Délai légal de 30 jours expiré (Compte à rebours à 0)
                </h4>
                <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 border border-rose-300 dark:border-rose-700">
                  0 jour restant · Délai dépassé
                </span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200 leading-relaxed max-w-2xl">
                Le délai initial d’un mois (30 jours) pour déclarer la naissance de <strong>{child.prenom} {child.nom}</strong> auprès de la mairie est arrivé à son terme.
              </p>
            </div>
          </div>
        </div>

        {/* Procédure Déclaration Tardive */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-black/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-900 dark:text-rose-200 space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Démarche de déclaration tardive requise :</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Une déclaration tardive avec certificat médical d'accouchement et pièce d'identité des parents doit être introduite auprès de l'officier d'état civil territorialement compétent ou du tribunal d'instance pour obtenir un jugement déclaratif tenant lieu d'acte de naissance.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-[11px] text-rose-700 dark:text-rose-300/80 font-mono">
            Réf. Maternité : {child.referenceMaternite} · Né(e) le {child.dateNaissance}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenDeclarationModal && (
              <button
                type="button"
                onClick={onOpenDeclarationModal}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#121c19] border border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-100 text-xs font-semibold hover:bg-rose-100/70 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5 text-rose-600" />
                <span>Imprimer certificat & déclaration</span>
              </button>
            )}

            {onMarkDeclared && (
              <button
                type="button"
                onClick={onMarkDeclared}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Régulariser / Marquer déclaré</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CAS COMPTE À REBOURS ACTIF (> 0 JOURS)
  const isUrgent = daysRemaining <= 7;

  return (
    <div
      className={`p-5 sm:p-6 rounded-3xl border transition-all shadow-xs space-y-4 ${
        isUrgent
          ? 'bg-amber-50/95 dark:bg-amber-950/25 border-amber-300 dark:border-amber-800/60 text-amber-950 dark:text-amber-100'
          : 'bg-white dark:bg-[#0a0a0a] border-[#134e43]/15 dark:border-emerald-500/25 text-[#103d34] dark:text-[#f0fdf9]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xs ${
              isUrgent
                ? 'bg-amber-500 text-white'
                : 'bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-bold">
                Compte à rebours légal : Déclaration de naissance ({child.prenom})
              </h4>
              <span
                className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full ${
                  isUrgent
                    ? 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-emerald-200/70 mt-0.5">
              Délai légal de 30 jours à compter de la naissance ({child.dateNaissance}). Déjà {daysPassed} jour{daysPassed > 1 ? 's' : ''} écoulé{daysPassed > 1 ? 's' : ''}.
            </p>
          </div>
        </div>

        {/* Chiffre choc du compte à rebours */}
        <div className="flex sm:flex-col items-center justify-between sm:items-end bg-slate-50 dark:bg-white/5 p-2.5 sm:p-0 rounded-2xl sm:bg-transparent">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block sm:hidden">Échéance légale</span>
            <div className="text-xl sm:text-2xl font-black font-mono text-[#1b5e52] dark:text-emerald-400">
              J - {daysRemaining}
            </div>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            sur {totalDays} jours légaux
          </span>
        </div>
      </div>

      {/* Barre de progression visuelle 30 jours */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Jour 1 (Naissance)</span>
          <span className="font-mono text-[#103d34] dark:text-emerald-300 font-bold">
            {percentageUsed}% du délai consommé
          </span>
          <span>Jour 30 (Date limite)</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden relative">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isUrgent
                ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                : 'bg-gradient-to-r from-emerald-500 to-[#134e43]'
            }`}
            style={{ width: `${percentageUsed}%` }}
          />
        </div>
      </div>

      {/* Explications et actions */}
      <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-slate-500 dark:text-emerald-200/70 max-w-xl">
          Rendez-vous à la mairie avec la déclaration certifiée par la maternité pour obtenir l'acte de naissance officiel sans frais.
        </p>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {onOpenDeclarationModal && (
            <button
              type="button"
              onClick={onOpenDeclarationModal}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-[#121c19] text-[#134e43] dark:text-emerald-200 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Imprimer déclaration</span>
            </button>
          )}

          {onMarkDeclared && (
            <button
              type="button"
              onClick={onMarkDeclared}
              className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Marquer comme déclarée</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
