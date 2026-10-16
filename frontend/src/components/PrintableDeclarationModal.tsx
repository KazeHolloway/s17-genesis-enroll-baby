import React from 'react';
import { X, Printer, QrCode, Award, Calendar, FileText } from 'lucide-react';
import type { Child } from '../types/dashboard';

interface PrintableDeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child;
}

export const PrintableDeclarationModal: React.FC<PrintableDeclarationModalProps> = ({
  isOpen,
  onClose,
  child,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const declarationNumber = child.referenceMaternite || '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0c0c0c] text-[#111827] dark:text-[#f3f4f6] rounded-3xl shadow-2xl border border-slate-200 dark:border-emerald-500/30 overflow-hidden flex flex-col my-auto max-h-[95vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:p-5 bg-[#123830] text-white flex items-center justify-between gap-3 border-b border-emerald-500/20 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                Déclaration de Naissance Officielle & Certificat Numérique
              </h3>
              <p className="text-xs text-emerald-200/80">
                Document certifié pour l'Officier d'État Civil · Loi n° 29-2019
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Lancer l'impression"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Certificate Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-0 print:m-0 print:overflow-visible">
          {/* Certificate Container with official border */}
          <div className="p-6 sm:p-8 rounded-2xl border-2 border-slate-300 dark:border-white/15 bg-white dark:bg-[#0a0a0a] space-y-6 shadow-sm print:border-black print:shadow-none">
            
            {/* Header: Republic + Maternity Header */}
            <div className="border-b-2 border-slate-200 dark:border-white/10 pb-4 text-center space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <span>RÉPUBLIQUE DU CONGO</span>
                <span>UNITÉ - TRAVAIL - PROGRÈS</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#123830] dark:text-emerald-300 tracking-tight pt-1">
                DÉCLARATION DE NAISSANCE
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                ET CERTIFICAT MÉDICAL DE CONSTATATION D'ACCOUCHEMENT
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  Réf. Déclaration : <strong>{declarationNumber}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                  Certificat Numérique Associé : <strong>{child.referenceMaternite || '—'}</strong>
                </span>
              </div>
            </div>

            {/* Warning Callout: Town hall presentation deadline */}
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/40 text-amber-900 dark:text-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Mentions pour l'Officier d'État Civil (Délai légal de 30 jours) :</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                La présente déclaration atteste de la naissance vivante de l’enfant survenue dans notre maternité. Le parent doit présenter ce document imprimé ainsi que ses pièces d'identité à la mairie de la circonscription pour transcription de l’acte d’état civil.
              </p>
            </div>

            {/* Child Identity Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/80 border-b pb-1">
                1. Identification du Nouveau-Né
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Nom de l’enfant :</span>
                  <strong className="text-sm text-slate-800 dark:text-white uppercase">{child.nom}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Prénom(s) :</span>
                  <strong className="text-sm text-slate-800 dark:text-white">{child.prenom}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date & Heure de naissance :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Le {child.dateNaissance} à {child.heureNaissance || '08:24'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sexe de l’enfant :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{child.sexe}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mensurations à la naissance :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Poids : {child.poids} · Taille : {child.taille}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Lieu de l’accouchement :</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{child.lieuNaissance}</span>
                </div>
              </div>
            </div>

            {/* Parents Identity Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-emerald-400/80 border-b pb-1">
                2. Filiation et Coordonnées des Parents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Mère</span>
                  <p className="font-bold text-slate-800 dark:text-white">{child.mere.nom}</p>
                  <p className="text-slate-500 text-[11px]">Tél : {child.mere.telephone}</p>
                  <p className="text-slate-500 text-[11px]">Profession : {child.mere.profession || 'Enseignante'}</p>
                  <p className="text-slate-500 text-[11px]">Nationalité : {child.mere.nationalite || 'Congolaise'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400">Père</span>
                  <p className="font-bold text-slate-800 dark:text-white">{child.pere.nom}</p>
                  <p className="text-slate-500 text-[11px]">Tél : {child.pere.telephone}</p>
                  <p className="text-slate-500 text-[11px]">Profession : {child.pere.profession || 'Comptable'}</p>
                  <p className="text-slate-500 text-[11px]">Nationalité : {child.pere.nationalite || 'Congolais'}</p>
                </div>
              </div>
            </div>

            {/* Medical Constat & Authentication Stamps */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-xs">
              {/* QR Code */}
              <div className="flex flex-col items-center sm:items-start space-y-1">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/10 p-2 rounded-xl flex items-center justify-center border border-slate-300 dark:border-white/20">
                  <QrCode className="w-16 h-16 text-slate-800 dark:text-white" />
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Contrôle cryptographique</span>
              </div>

              {/* Maternity Stamp */}
              <div className="text-center p-3 rounded-2xl border-2 border-dashed border-emerald-600/40 text-emerald-800 dark:text-emerald-300 space-y-1">
                <Award className="w-6 h-6 mx-auto text-emerald-600" />
                <span className="font-bold text-[10px] uppercase block">Cachet de la Maternité</span>
                <p className="text-[9px] font-mono">Blanche Gomez - Brazzaville</p>
                <p className="text-[9px]">Délivré le {child.dateNaissance}</p>
              </div>

              {/* Physician Signature */}
              <div className="text-right space-y-1">
                <span className="text-[10px] text-slate-400 block">Sage-femme / Médecin accoucheur</span>
                <p className="font-bold text-slate-800 dark:text-white">Dr. Sophie Mampouya</p>
                <p className="text-[10px] text-slate-500 font-script text-base">S. Mampouya</p>
                <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">Signature certifiée PKI</span>
              </div>
            </div>

            {/* Footer Legal notice */}
            <div className="pt-3 border-t text-[10px] text-slate-400 text-center">
              Enroll Baby · Système National de Notification des Naissances et État Civil · Document officiel conforme au Décret n° 2019-340.
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 bg-slate-50 dark:bg-black/50 border-t border-slate-200 dark:border-white/10 flex items-center justify-between print:hidden">
          <p className="text-xs text-slate-500">
            Code d'accès parent associé : <strong className="font-mono text-emerald-600 dark:text-emerald-400">{child.codeAccesParent || '—'}</strong>
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1b5e52] hover:bg-[#144b41] text-white flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la déclaration</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
