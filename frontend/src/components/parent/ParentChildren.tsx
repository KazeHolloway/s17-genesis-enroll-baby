import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Phone,
  Printer,
  ShieldCheck,
  Syringe,
  User,
  Edit3,
  Copy,
} from 'lucide-react';
import type { Child, VaccineItem, DocumentItem } from '../../types/dashboard';
import { PrintableChildDossierModal } from '../PrintableChildDossierModal';
import { PrintableDeclarationModal } from '../PrintableDeclarationModal';
import { CivilDeclarationCountdown } from '../CivilDeclarationCountdown';

interface ParentChildrenProps {
  childrenList: Child[];
  vaccines: VaccineItem[];
  documents: DocumentItem[];
  selectedChildId?: string | null;
  onSelectChild: (id: string | null) => void;
  onShowToast: (msg: string) => void;
}

export const ParentChildren: React.FC<ParentChildrenProps> = ({
  childrenList,
  vaccines,
  documents,
  selectedChildId,
  onSelectChild,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'informations' | 'vaccinations' | 'documents' | 'historique'>('informations');
  const [showDeclarationModal, setShowDeclarationModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [, setCopiedCode] = useState(false);

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || null;

  // If a child is selected, show the detailed Dossier de l'enfant
  if (selectedChild) {
    const childVaccines = vaccines.filter((v) => v.childId === selectedChild.id || !v.childId);
    const childDocuments = documents.filter((d) => d.childId === selectedChild.id || !d.childId);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top Breadcrumb & Return Button matching image.png */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onSelectChild(null)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#134e43] dark:text-emerald-300 hover:text-[#1b5e52] dark:hover:text-emerald-200 transition-colors cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-[#121c19] border border-[#134e43]/15 dark:border-emerald-500/30 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Dossier de l'enfant</span>
          </button>

          <span className="text-xs font-mono px-3 py-1 rounded-full bg-white dark:bg-[#121c19] border border-[#134e43]/15 dark:border-emerald-500/30 text-[#134e43] dark:text-emerald-300">
            Réf : {selectedChild.referenceMaternite}
          </span>
        </div>

        {/* Main Child Header Profile Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#1b5e52]/30 dark:border-emerald-400/40 shadow-md">
              <img
                src={selectedChild.photoUrl}
                alt={`${selectedChild.prenom} ${selectedChild.nom}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                {selectedChild.prenom} {selectedChild.nom}
              </h1>
              <p className="text-xs sm:text-sm text-[#4d6a62] dark:text-emerald-200/80">
                Né le {selectedChild.dateNaissance}
                {selectedChild.poids ? ` · ${selectedChild.poids}` : ''}
                {selectedChild.taille ? ` · ${selectedChild.taille}` : ''}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#e8f7f2] dark:bg-emerald-950/60 text-[#1b7e5c] dark:text-emerald-300 border border-[#1b7e5c]/20 dark:border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dossier complet</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 text-right">
            <div>
              <span className="text-xs text-slate-400 block">Numéro d’acte officiel</span>
              <span className="text-xs font-mono font-bold text-[#103d34] dark:text-emerald-200 bg-[#f4f9f6] dark:bg-[#121c19] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-emerald-500/25">
                {selectedChild.numeroActe || 'En cours'}
              </span>
            </div>

            {selectedChild.codeAccesParent && (
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400">Code parent :</span>
                <button
                  type="button"
                  onClick={() => {
                    const code = selectedChild.codeAccesParent;
                    if (!code) return;
                    navigator.clipboard.writeText(code);
                    setCopiedCode(true);
                    setTimeout(() => setCopiedCode(false), 2500);
                    onShowToast(`Code d'accès parent ${code} copié !`);
                  }}
                  className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 dark:border-emerald-800/40 inline-flex items-center gap-1 cursor-pointer"
                  title="Copier le code d'accès parent"
                >
                  <span>{selectedChild.codeAccesParent}</span>
                  <Copy className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tabs Bar: Informations | Vaccinations | Documents | Historique */}
        <div className="flex border-b border-slate-200 dark:border-white/10 space-x-4 sm:space-x-8 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar pb-0.5">
          {(['informations', 'vaccinations', 'documents', 'historique'] as const).map((tabKey) => {
            const labels: Record<string, string> = {
              informations: 'Informations',
              vaccinations: 'Vaccinations',
              documents: 'Documents',
              historique: 'Historique',
            };
            const isActive = activeTab === tabKey;
            return (
              <button
                key={tabKey}
                onClick={() => setActiveTab(tabKey)}
                className={`pb-3.5 relative transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'text-[#103d34] dark:text-emerald-300 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2.5px] after:bg-[#1b5e52] dark:after:bg-emerald-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {labels[tabKey]}
              </button>
            );
          })}
        </div>

        {/* Main Grid: Details + Actions Rapides */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'informations' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                    <span>Informations de l'enfant</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-400">Nom</span>
                      <span className="font-semibold text-[#103d34] dark:text-emerald-100">{selectedChild.nom}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-400">Prénom</span>
                      <span className="font-semibold text-[#103d34] dark:text-emerald-100">{selectedChild.prenom}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-400">Sexe</span>
                      <span className="font-semibold text-[#103d34] dark:text-emerald-100">{selectedChild.sexe}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-400">Date de naissance</span>
                      <span className="font-semibold text-[#103d34] dark:text-emerald-100">{selectedChild.dateNaissance}</span>
                    </div>
                    <div className="sm:col-span-2 flex justify-between py-1.5 border-b border-slate-100 dark:border-white/5">
                      <span className="text-slate-400">Lieu de naissance</span>
                      <span className="font-semibold text-[#103d34] dark:text-emerald-100">{selectedChild.lieuNaissance}</span>
                    </div>
                  </div>
                </div>

                {/* COMPTE À REBOURS ÉTAT CIVIL 30 JOURS (Ticket Compte à rebours) */}
                <CivilDeclarationCountdown
                  child={selectedChild}
                  onOpenDeclarationModal={() => setShowDeclarationModal(true)}
                  onMarkDeclared={() => {
                    onShowToast(`Déclaration de naissance pour ${selectedChild.prenom} transmise en mairie.`);
                  }}
                />

                <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                    <span>Parents / Tuteurs</span>
                  </h3>

                  <div className="space-y-3.5 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-100 dark:border-emerald-500/20 gap-2">
                      <div>
                        <span className="text-xs text-slate-400 block">Mère</span>
                        <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">{selectedChild.mere.nom}</strong>
                      </div>
                      <span className="font-mono text-xs text-[#1b5e52] dark:text-emerald-300 font-medium">
                        {selectedChild.mere.telephone}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-100 dark:border-emerald-500/20 gap-2">
                      <div>
                        <span className="text-xs text-slate-400 block">Père</span>
                        <strong className="text-[#103d34] dark:text-emerald-100 font-semibold">{selectedChild.pere.nom}</strong>
                      </div>
                      <span className="font-mono text-xs text-[#1b5e52] dark:text-emerald-300 font-medium">
                        {selectedChild.pere.telephone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'vaccinations' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                  <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 flex items-center gap-2">
                    <Syringe className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                    <span>Calendrier vaccinal personnalisé</span>
                  </h3>
                  <span className="text-xs text-[#1b7e5c] dark:text-emerald-400 font-semibold">
                    {childVaccines.filter((v) => v.statut === 'administre').length} / {childVaccines.length} doses reçues
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  {childVaccines.map((v) => {
                    const isDone = v.statut === 'administre';
                    return (
                      <div
                        key={v.id}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                          isDone
                            ? 'bg-[#f8fdfb] dark:bg-[#0c1a16] border-emerald-200 dark:border-emerald-500/35'
                            : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              isDone
                                ? 'bg-[#1b7e5c] dark:bg-emerald-500 text-white dark:text-black'
                                : 'bg-slate-100 dark:bg-white/10 text-slate-400'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">{v.nom}</h4>
                            <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                              {v.dose} · {v.ageRecommande}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              isDone
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {isDone ? `Reçu le ${v.dateEffective}` : `Prévu : ${v.datePrevue}`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  <span>Documents & Certificats officiels</span>
                </h3>

                <div className="space-y-3 pt-2">
                  {childDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-[#134e43]/30 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#103d34] dark:text-emerald-100">{doc.titre}</h4>
                          <p className="text-xs text-slate-500 dark:text-emerald-200/70">
                            {doc.reference} · {doc.taille} · {doc.signataire}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onShowToast(`Téléchargement de : ${doc.titre}`)}
                        className="px-3.5 py-2 text-xs font-semibold text-white bg-[#134e43] dark:bg-emerald-600 rounded-xl hover:bg-[#0e3b33] dark:hover:bg-emerald-500 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'historique' && (
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-[#103d34] dark:text-emerald-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  <span>Historique du parcours de naissance</span>
                </h3>

                <div className="space-y-4 pt-2">
                  {selectedChild.etapes.map((etape, idx) => (
                    <div key={idx} className="flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          etape.complete
                            ? 'bg-[#1b7e5c] dark:bg-emerald-500 text-white dark:text-black'
                            : 'bg-slate-200 dark:bg-white/10 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#103d34] dark:text-emerald-100">{etape.titre}</h4>
                        <p className="text-xs text-slate-400">{etape.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Actions Rapides Panel */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#103d34] dark:text-emerald-100 uppercase tracking-wider">
                Actions rapides
              </h3>

              <div className="space-y-2.5">
                <button
                  onClick={() => setShowDeclarationModal(true)}
                  className="w-full text-left p-3 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] hover:bg-[#eef7f3] dark:hover:bg-[#182622] border border-slate-200/80 dark:border-emerald-500/20 text-xs sm:text-sm font-medium text-[#103d34] dark:text-emerald-100 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-black/60 flex items-center justify-center text-[#1b7e5c] dark:text-emerald-300 shadow-2xs group-hover:scale-105 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Déclaration de naissance officielle</span>
                    <span className="text-[11px] text-slate-400">Pour démarche état civil (Mairie)</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowDossierModal(true)}
                  className="w-full text-left p-3 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] hover:bg-[#eef7f3] dark:hover:bg-[#182622] border border-slate-200/80 dark:border-emerald-500/20 text-xs sm:text-sm font-medium text-[#103d34] dark:text-emerald-100 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-black/60 flex items-center justify-center text-[#1b7e5c] dark:text-emerald-300 shadow-2xs group-hover:scale-105 transition-transform">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block font-semibold">Dossier papier & carnet vaccinal</span>
                    <span className="text-[11px] text-slate-400">Version physique complète imprimable</span>
                  </div>
                </button>

                <button
                  onClick={() => onShowToast("La modification des informations n'est pas encore disponible.")}
                  className="w-full text-left p-3 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] hover:bg-[#eef7f3] dark:hover:bg-[#182622] border border-slate-200/80 dark:border-emerald-500/20 text-xs sm:text-sm font-medium text-[#103d34] dark:text-emerald-100 flex items-center gap-3 transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white dark:bg-black/60 flex items-center justify-center text-[#1b7e5c] dark:text-emerald-300 shadow-2xs group-hover:scale-105 transition-transform">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <span>Modifier les informations</span>
                </button>
              </div>
            </div>

            {/* Reassurance Box matching image.png */}
            <div className="p-4 rounded-2xl bg-[#ebf5f0] dark:bg-[#121c19] border border-[#134e43]/20 dark:border-emerald-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#1b7e5c] dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#103d34] dark:text-emerald-100">
                  Tout est en sécurité
                </h4>
                <p className="text-[11px] text-[#42645b] dark:text-emerald-200/75 mt-0.5 leading-relaxed">
                  Vos données sont protégées conformément à la loi n° 29-2019 relative à la protection des données personnelles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render "Mes enfants" list
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Mes enfants ({childrenList.length})
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Consultez le dossier médical et d'état civil de chaque enfant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {childrenList.map((child) => (
          <div
            key={child.id}
            className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={child.photoUrl}
                alt={child.prenom}
                className="w-16 h-16 rounded-full object-cover border border-[#1b5e52]/30"
              />
              <div>
                <h3 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                  {child.prenom} {child.nom}
                </h3>
                <p className="text-xs text-slate-400">
                  Né le {child.dateNaissance}
                  {child.poids ? ` · ${child.poids}` : ''}
                </p>
                <span className="text-[11px] font-mono text-[#1b7e5c] dark:text-emerald-300">
                  {child.referenceMaternite}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                {child.status === 'complet' ? '✓ Dossier complet' : 'En cours de validation'}
              </span>
              <button
                onClick={() => onSelectChild(child.id)}
                className="px-3.5 py-1.5 rounded-lg bg-[#134e43] text-white text-xs font-medium hover:bg-[#0e3b33] cursor-pointer"
              >
                Consulter le dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Printable Modals */}
      {selectedChild && showDossierModal && (
        <PrintableChildDossierModal
          isOpen={showDossierModal}
          onClose={() => setShowDossierModal(false)}
          child={selectedChild}
          vaccines={vaccines}
        />
      )}
      {selectedChild && showDeclarationModal && (
        <PrintableDeclarationModal
          isOpen={showDeclarationModal}
          onClose={() => setShowDeclarationModal(false)}
          child={selectedChild}
        />
      )}
    </div>
  );
};
