import React, { useState } from 'react';
import { FileText, Download, ShieldCheck, Printer } from 'lucide-react';
import type { DocumentItem, Child } from '../../types/dashboard';
import { PrintableChildDossierModal } from '../PrintableChildDossierModal';
import { PrintableDeclarationModal } from '../PrintableDeclarationModal';

interface ParentDocumentsProps {
  documents: DocumentItem[];
  childrenList?: Child[];
  onShowToast: (msg: string) => void;
}

export const ParentDocuments: React.FC<ParentDocumentsProps> = ({
  documents,
  childrenList = [],
}) => {
  const [activeFilter, setActiveFilter] = useState<'tous' | 'naissance' | 'vaccins' | 'autres'>('tous');
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);

  const activeChild = childrenList[0];

  const handlePrintDocument = (doc: DocumentItem) => {
    if (doc.type === 'certificat_naissance' || doc.type === 'acte_naissance') {
      setShowDeclarationModal(true);
    } else if (doc.type === 'carnet_sante') {
      setShowDossierModal(true);
    } else {
      setShowDeclarationModal(true);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (activeFilter === 'tous') return true;
    if (activeFilter === 'naissance') {
      return doc.type === 'acte_naissance' || doc.type === 'certificat_naissance';
    }
    if (activeFilter === 'vaccins') {
      return doc.type === 'carnet_sante';
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Mobile-First Header matching Screen 3 of mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Documents
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Tous les actes et certificats officiels de votre enfant.
          </p>
        </div>
      </div>

      {/* Filter Chips matching Screen 3: [ Tous ] [ Naissance ] [ Vaccins ] [ Autres ] */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {[
          { key: 'tous', label: 'Tous' },
          { key: 'naissance', label: 'Naissance' },
          { key: 'vaccins', label: 'Vaccins' },
          { key: 'autres', label: 'Autres' },
        ].map((tab) => {
          const isActive = activeFilter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key as 'tous' | 'naissance' | 'vaccins' | 'autres')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1b5e52] text-white shadow-xs dark:bg-emerald-500 dark:text-black'
                  : 'bg-white dark:bg-[#121c19] text-[#103d34] dark:text-emerald-200 border border-slate-200/80 dark:border-emerald-500/25 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Featured Printable Access Cards for Ticket 4 & 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setShowDeclarationModal(true)}
          className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-3 text-left hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/60 text-[#1b7e5c] dark:text-emerald-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs sm:text-sm text-[#103d34] dark:text-emerald-100 block">
              Déclaration Officielle & Certificat Numérique
            </strong>
            <span className="text-[11px] text-[#526f67] dark:text-emerald-200/70">
              Pour transcription auprès de l'Officier d'État Civil
            </span>
          </div>
        </button>

        <button
          onClick={() => setShowDossierModal(true)}
          className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-3 text-left hover:border-emerald-500/50 transition-all cursor-pointer group shadow-2xs"
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-black/60 text-[#1b7e5c] dark:text-emerald-300 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <Printer className="w-5 h-5" />
          </div>
          <div>
            <strong className="text-xs sm:text-sm text-[#103d34] dark:text-emerald-100 block">
              Dossier Papier Complet & Carnet Physique
            </strong>
            <span className="text-[11px] text-[#526f67] dark:text-emerald-200/70">
              Parcours papier autonome pour parents sans smartphone
            </span>
          </div>
        </button>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#134e43]/30 transition-all active:scale-[0.99]"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-base font-bold text-[#103d34] dark:text-emerald-100 leading-snug">
                  {doc.titre}
                </h4>
                <p className="text-xs text-slate-500 dark:text-emerald-200/70 font-mono">
                  {doc.format} · {doc.taille} · {doc.date}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Délivré par : {doc.signataire}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5 justify-end">
              <button
                onClick={() => handlePrintDocument(doc)}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-emerald-500/30 text-[#103d34] dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#121c19] transition-colors cursor-pointer min-h-[42px] min-w-[42px] flex items-center justify-center"
                title="Consulter et Imprimer"
                aria-label="Imprimer le document"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={() => handlePrintDocument(doc)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#134e43] hover:bg-[#0e3b33] dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs min-h-[42px]"
              >
                <Download className="w-4 h-4" />
                <span>Ouvrir / Télécharger</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Reassurance */}
      <div className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-[#1b7e5c] dark:text-emerald-400 flex-shrink-0" />
        <p className="text-xs text-[#2b4c42] dark:text-emerald-200 leading-relaxed">
          Chaque document est doté d’un cachet électronique sécurisé et d'un QR code certifié par les autorités sanitaires et l’état civil.
        </p>
      </div>

      {/* Printable Modals */}
      {showDossierModal && activeChild && (
        <PrintableChildDossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          child={activeChild}
        />
      )}
      {showDeclarationModal && activeChild && (
        <PrintableDeclarationModal
          isOpen={showDeclarationModal}
          onClose={() => setShowDeclarationModal(false)}
          child={activeChild}
        />
      )}
    </div>
  );
};
