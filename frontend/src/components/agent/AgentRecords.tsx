import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  FileCheck2,
  X,
  ShieldCheck,
  Printer,
} from 'lucide-react';
import type { Child } from '../../types/dashboard';
import { PrintableChildDossierModal } from '../PrintableChildDossierModal';
import { PrintableDeclarationModal } from '../PrintableDeclarationModal';

interface AgentRecordsProps {
  childrenList: Child[];
  onValidateChildAct: (childId: string) => void;
  onShowToast: (msg: string) => void;
}

export const AgentRecords: React.FC<AgentRecordsProps> = ({
  childrenList,
  onValidateChildAct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complet' | 'en_cours'>('all');
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [childToPrintDossier, setChildToPrintDossier] = useState<Child | null>(null);
  const [childToPrintDeclaration, setChildToPrintDeclaration] = useState<Child | null>(null);

  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.referenceMaternite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.lieuNaissance.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'complet' && child.status === 'complet') ||
      (statusFilter === 'en_cours' && child.status === 'en_cours');

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
            Registre officiel des naissances
          </h2>
          <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
            Dossiers médicaux de naissance et actes d'état civil rattachés.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, référence..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400">Filtrer :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'complet' | 'en_cours')}
            className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100"
          >
            <option value="all">Tous les statuts ({childrenList.length})</option>
            <option value="complet">Actes émis</option>
            <option value="en_cours">En attente de signature</option>
          </select>
        </div>
      </div>

      {/* Children List: Mobile Cards + Desktop Table */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs">
        {/* Mobile View: Cards (md:hidden) */}
        <div className="md:hidden space-y-3">
          {filteredChildren.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Aucun dossier ne correspond à votre recherche.
            </div>
          ) : (
            filteredChildren.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={c.photoUrl}
                      alt={c.prenom}
                      className="w-11 h-11 rounded-full object-cover border border-[#1b5e52]/30 flex-shrink-0"
                    />
                    <div>
                      <strong className="text-sm font-bold text-[#103d34] dark:text-emerald-100 block">
                        {c.prenom} {c.nom}
                      </strong>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block">
                        Né(e) le {c.dateNaissance} · {c.sexe} ({c.poids})
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                      c.status === 'complet'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {c.status === 'complet' ? '✓ Acte émis' : 'En attente'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Réf. Maternité</span>
                    <span className="font-mono text-[#1b5e52] dark:text-emerald-400 font-semibold truncate block">
                      {c.referenceMaternite}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mère</span>
                    <span className="text-slate-700 dark:text-slate-300 truncate block">
                      {c.mere.nom}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedChild(c)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs min-h-[44px] flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Examiner et Gérer le dossier</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 text-xs font-semibold uppercase">
                <th className="py-3 px-3">Enfant</th>
                <th className="py-3 px-3">Date & Lieu</th>
                <th className="py-3 px-3">Référence / Acte</th>
                <th className="py-3 px-3">Parents</th>
                <th className="py-3 px-3">Statut</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredChildren.map((c) => (
                <tr key={c.id} className="hover:bg-[#f9fcfa] dark:hover:bg-[#121c19] transition-colors">
                  <td className="py-3.5 px-3">
                    <strong className="text-[#103d34] dark:text-emerald-100 block font-semibold">
                      {c.prenom} {c.nom}
                    </strong>
                    <span className="text-xs text-slate-400">{c.sexe} · {c.poids}</span>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-[#38554d] dark:text-emerald-200/80">
                    <div>{c.dateNaissance}</div>
                    <div className="text-slate-400 text-[11px] truncate max-w-xs">{c.lieuNaissance}</div>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-xs">
                    <div className="text-[#1b5e52] dark:text-emerald-400 font-semibold">{c.referenceMaternite}</div>
                    <div className="text-slate-400 text-[11px]">{c.numeroActe}</div>
                  </td>
                  <td className="py-3.5 px-3 text-xs">
                    <div>{c.mere.nom}</div>
                    <div className="text-slate-400">{c.mere.telephone}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        c.status === 'complet'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}
                    >
                      {c.status === 'complet' ? '✓ Acte émis' : 'En attente mairie'}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedChild(c)}
                      className="px-3 py-1.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold cursor-pointer shadow-xs min-h-[36px]"
                    >
                      Examiner
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {selectedChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-[#134e43]/20 dark:border-emerald-500/30 overflow-hidden flex flex-col transition-colors">
            <div className="p-5 bg-gradient-to-r from-[#12493e] to-[#0f3d34] dark:from-black dark:to-[#0a1815] text-white flex items-center justify-between border-b border-transparent dark:border-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold text-white">Gestion du dossier nouveau-né</h3>
              </div>
              <button
                onClick={() => setSelectedChild(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedChild.photoUrl}
                  alt={selectedChild.prenom}
                  className="w-16 h-16 rounded-full object-cover border border-[#1b5e52]/30"
                />
                <div>
                  <h4 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                    {selectedChild.prenom} {selectedChild.nom}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Né(e) le {selectedChild.dateNaissance} · {selectedChild.poids}
                  </p>
                  <span className="text-xs font-mono text-[#1b7e5c] dark:text-emerald-300">
                    {selectedChild.referenceMaternite}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-100 dark:border-emerald-500/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lieu de naissance :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChild.lieuNaissance}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mère :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChild.mere.nom} ({selectedChild.mere.telephone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Père :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChild.pere.nom} ({selectedChild.pere.telephone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Numéro d’acte :</span>
                  <strong className="text-[#1b7e5c] dark:text-emerald-300 font-mono">{selectedChild.numeroActe || 'En attente'}</strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                {selectedChild.status === 'en_cours' ? (
                  <button
                    onClick={() => {
                      onValidateChildAct(selectedChild.id);
                      setSelectedChild(null);
                    }}
                    className="w-full py-3 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <FileCheck2 className="w-4 h-4" />
                    <span>Valider & Émettre l'acte de naissance</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs text-center font-semibold border border-emerald-200 dark:border-emerald-800/40">
                    ✓ Acte officiel délivré et accessible aux parents
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setChildToPrintDeclaration(selectedChild);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#1b5e52]/30 dark:border-emerald-500/30 text-xs font-semibold text-[#103d34] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#121c19] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Déclaration Mairie (30j)</span>
                  </button>

                  <button
                    onClick={() => {
                      setChildToPrintDossier(selectedChild);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-[#1b5e52]/30 dark:border-emerald-500/30 text-xs font-semibold text-[#103d34] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-[#121c19] flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dossier Papier Autonome</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable Modals */}
      {childToPrintDossier && (
        <PrintableChildDossierModal
          isOpen={!!childToPrintDossier}
          onClose={() => setChildToPrintDossier(null)}
          child={childToPrintDossier}
        />
      )}
      {childToPrintDeclaration && (
        <PrintableDeclarationModal
          isOpen={!!childToPrintDeclaration}
          onClose={() => setChildToPrintDeclaration(null)}
          child={childToPrintDeclaration}
        />
      )}
    </div>
  );
};
