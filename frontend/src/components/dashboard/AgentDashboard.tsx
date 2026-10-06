import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Baby,
  CheckCircle2,
  Clock,
  Download,
  FileCheck2,
  FileText,
  Filter,
  LogOut,
  QrCode,
  Search,
  ShieldCheck,
  Syringe,
  Plus,
  X,
} from 'lucide-react';
import { Logo } from '../Logo';
import { ThemeToggle } from '../ThemeToggle';
import type { Child, VaccineItem, DocumentItem } from '../../types/dashboard';
import { CURRENT_AGENT } from '../../data/mockDashboardData';
import { ChildRegisterWizard } from './ChildRegisterWizard';

const generateActNumber = () =>
  `ACT-BZV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

interface AgentDashboardProps {
  childrenList: Child[];
  vaccines: VaccineItem[];
  documents: DocumentItem[];
  onAddChild: (child: Child) => void;
  onLogout: () => void;
  onSwitchToParent: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  childrenList,
  vaccines,
  onAddChild,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'apercu' | 'registre' | 'etat_civil' | 'vaccins' | 'scanner'>('apercu');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'complet' | 'en_cours'>('all');
  const [selectedChildForReview, setSelectedChildForReview] = useState<Child | null>(null);

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scanner modal state
  const [scannedCode, setScannedCode] = useState('MAT-2025-04128');
  const [scanResult, setScanResult] = useState<Child | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const handleValidateChildAct = (childId: string) => {
    const child = childrenList.find((c) => c.id === childId);
    if (child) {
      child.status = 'complet';
      child.numeroActe = generateActNumber();
      child.etapes.push({
        titre: 'Acte officiel certifié par l’Officier d’État Civil',
        date: 'Aujourd’hui',
        complete: true,
      });
      showToast(`Acte officiel émis avec succès pour ${child.prenom} ${child.nom} (${child.numeroActe}).`);
      setSelectedChildForReview(null);
    }
  };

  const handleScanVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const found = childrenList.find(
      (c) =>
        c.referenceMaternite.toLowerCase() === scannedCode.trim().toLowerCase() ||
        (c.numeroActe && c.numeroActe.toLowerCase() === scannedCode.trim().toLowerCase())
    );
    if (found) {
      setScanResult(found);
      showToast('Document authentifié avec succès dans le registre national.');
    } else {
      setScanResult(null);
      showToast('Aucun dossier trouvé pour cette référence.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] dark:bg-black text-[#103d34] dark:text-[#e6f4f1] flex transition-colors duration-300">
      {/* Toast Alert popup */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-[#134e43] dark:bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR: AGENT PRO */}
      <aside className="w-64 xl:w-72 bg-[#0c2822] dark:bg-[#070707] text-white flex-shrink-0 hidden md:flex flex-col justify-between p-5 border-r border-[#153f36]/70 dark:border-white/10 transition-colors">
        <div className="space-y-6">
          {/* Logo with Pro Tag */}
          <div className="px-2 pt-2 space-y-1">
            <Logo variant="white" />
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/30">
                Portail Professionnel & État Civil
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => setActiveTab('apercu')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'apercu'
                  ? 'bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => setActiveTab('registre')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'registre'
                  ? 'bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Registre des naissances</span>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full">
                {childrenList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('etat_civil')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'etat_civil'
                  ? 'bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span>Validation État Civil</span>
              </div>
              <span className="text-xs font-mono bg-amber-400 text-black font-bold px-2 py-0.5 rounded-full">
                {childrenList.filter((c) => c.status === 'en_cours').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vaccins')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'vaccins'
                  ? 'bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Syringe className="w-4 h-4 text-emerald-400" />
              <span>Suivi Vaccinal & PMI</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === 'scanner'
                  ? 'bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs'
                  : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Scanner QR Code</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer with Role Switcher & Agent Info */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold block">
              {CURRENT_AGENT.role}
            </span>
            <strong className="text-xs text-white block">{CURRENT_AGENT.nom}</strong>
            <p className="text-[10px] text-emerald-200/70">{CURRENT_AGENT.etablissement}</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-100/75 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-emerald-400" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* MAIN AGENT VIEW */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 px-6 py-4 bg-white/80 dark:bg-[#070707]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                {CURRENT_AGENT.etablissement}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                Matricule: {CURRENT_AGENT.matricule}
              </span>
            </div>
            <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
              Session certifiée · {CURRENT_AGENT.nom} ({CURRENT_AGENT.role})
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Action: Register Birth */}
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Déclarer une naissance</span>
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* Content Tabs */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {/* TAB 1: APERÇU / TABLEAU DE BORD AGENT */}
          {activeTab === 'apercu' && (
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Naissances ce mois</span>
                    <Baby className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    142
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium">
                    +12% par rapport au mois dernier
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Taux déclarations &lt; 30j</span>
                    <Clock className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    98.4%
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium">
                    Conforme à la législation
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>En attente mairie</span>
                    <FileCheck2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-600 dark:text-amber-400">
                    18
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Transmis pour émission d'acte
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Vaccins administrés</span>
                    <Syringe className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    284 doses
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium">
                    100% traçabilité des lots
                  </p>
                </div>
              </div>

              {/* Alert Banner for pending delays */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                      Rappel légal : 2 naissances approchent du délai de 30 jours
                    </h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                      Les parents ont reçu un rappel SMS automatique. L’officier d’état civil peut certifier les dossiers en 1 clic.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('etat_civil')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Voir les dossiers urgents
                </button>
              </div>

              {/* Recent Births Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                      Dernières déclarations enregistrées
                    </h3>
                    <p className="text-xs text-slate-400">
                      Registre synchronisé en temps réel avec les maternités et mairies.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('registre')}
                    className="text-xs font-semibold text-[#1b5e52] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Consulter le registre complet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">Enfant</th>
                        <th className="py-3 px-3">Date de naissance</th>
                        <th className="py-3 px-3">Réf Maternité</th>
                        <th className="py-3 px-3">Parents</th>
                        <th className="py-3 px-3">Statut</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {childrenList.map((c) => (
                        <tr key={c.id} className="hover:bg-[#f9fcfa] dark:hover:bg-[#121c19] transition-colors">
                          <td className="py-3 px-3 font-semibold text-[#103d34] dark:text-emerald-100">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={c.photoUrl}
                                alt={c.prenom}
                                className="w-8 h-8 rounded-full object-cover border border-[#1b5e52]/30"
                              />
                              <div>
                                <span>{c.prenom} {c.nom}</span>
                                <span className="block text-[11px] font-normal text-slate-400">
                                  {c.sexe} · {c.poids}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#38554d] dark:text-emerald-200/80">
                            {c.dateNaissance}
                          </td>
                          <td className="py-3 px-3 font-mono text-xs text-[#1b5e52] dark:text-emerald-400">
                            {c.referenceMaternite}
                          </td>
                          <td className="py-3 px-3 text-xs text-[#48665e] dark:text-emerald-200/80">
                            Mère : {c.mere.nom} ({c.mere.telephone})
                          </td>
                          <td className="py-3 px-3">
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
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setSelectedChildForReview(c)}
                              className="px-3 py-1 rounded-lg bg-[#ebf5f0] dark:bg-[#121c19] hover:bg-[#134e43] hover:text-white dark:hover:bg-emerald-500 dark:hover:text-black text-xs font-semibold text-[#134e43] dark:text-emerald-300 transition-colors cursor-pointer"
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
            </div>
          )}

          {/* TAB 2: REGISTRE DES NAISSANCES */}
          {activeTab === 'registre' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                    Registre officiel des nouveau-nés
                  </h2>
                  <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                    Base de données centralisée et sécurisée pour les maternités et officiers d'état civil.
                  </p>
                </div>

                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer une naissance</span>
                </button>
              </div>

              {/* Filters & Search */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, prénom, réf..."
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
                    <option value="en_cours">En attente de validation</option>
                  </select>
                </div>
              </div>

              {/* Children Table */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs overflow-x-auto">
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
                            onClick={() => setSelectedChildForReview(c)}
                            className="px-3 py-1.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold cursor-pointer shadow-xs"
                          >
                            Gérer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: VALIDATION ÉTAT CIVIL */}
          {activeTab === 'etat_civil' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                  Dossiers en attente de signature d'état civil
                </h2>
                <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                  Validez les avis de naissance transmis par les maternités pour délivrer l'acte de naissance officiel.
                </p>
              </div>

              <div className="space-y-4">
                {childrenList.map((child) => (
                  <div
                    key={child.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                          {child.prenom} {child.nom}
                        </h3>
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300">
                          {child.referenceMaternite}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            child.status === 'complet'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {child.status === 'complet' ? 'Certifié & Acte émis' : 'En attente de signature'}
                        </span>
                      </div>

                      <p className="text-xs text-[#526f67] dark:text-emerald-200/80">
                        Né(e) le {child.dateNaissance} à {child.lieuNaissance} · Mère : {child.mere.nom} ({child.mere.telephone})
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {child.status === 'en_cours' ? (
                        <button
                          onClick={() => handleValidateChildAct(child.id)}
                          className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Signer & Émettre l'acte officiel</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Téléchargement de l'acte officiel ${child.numeroActe}`)}
                          className="px-4 py-2 rounded-xl bg-[#ebf5f0] dark:bg-[#121c19] text-[#134e43] dark:text-emerald-300 hover:bg-[#134e43] hover:text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>Télécharger l'acte certifié</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SUIVI VACCINAL & PMI */}
          {activeTab === 'vaccins' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                    Registre de vaccination & Programme Élargi de Vaccination (PEV)
                  </h2>
                  <p className="text-xs text-[#526f67] dark:text-emerald-200/70">
                    Enregistrement des doses administrées, numéros de lot et traçabilité médicale.
                  </p>
                </div>

                <button
                  onClick={() => showToast('Formulaire de saisie d’administration vaccinale ouvert.')}
                  className="px-4 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-semibold shadow-xs cursor-pointer"
                >
                  Enregistrer une injection
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/10 text-slate-400 text-xs font-semibold uppercase">
                      <th className="py-3 px-3">Vaccin</th>
                      <th className="py-3 px-3">Dose & Âge</th>
                      <th className="py-3 px-3">Date Prévue</th>
                      <th className="py-3 px-3">Statut & Date Effectuée</th>
                      <th className="py-3 px-3">Lot & Professionnel</th>
                      <th className="py-3 px-3 text-right">Rappel</th>
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
                          {v.lotNumero || 'Lot à enregistrer'}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => showToast(`SMS de rappel relancé pour : ${v.nom}`)}
                            className="px-2.5 py-1 rounded-lg bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300 text-xs font-semibold hover:underline cursor-pointer"
                          >
                            Relance SMS
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SCANNER QR CODE */}
          {activeTab === 'scanner' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-[#103d34] dark:text-[#f0fdf9]">
                  Vérificateur officiel de document Enroll Baby
                </h2>
                <p className="text-xs sm:text-sm text-[#526f67] dark:text-emerald-200/70">
                  Scannez ou saisissez la référence QR Code imprimée sur le certificat médical ou l’acte officiel.
                </p>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-6">
                <form onSubmit={handleScanVerify} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#103d34] dark:text-emerald-200 mb-1.5">
                      Référence Maternité ou Numéro d'Acte
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Ex: MAT-2025-04128 ou ACT-BZV-2025-0982"
                        value={scannedCode}
                        onChange={(e) => setScannedCode(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-emerald-500/30 bg-white dark:bg-black text-[#103d34] dark:text-emerald-100 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-[#1b5e52]"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>Vérifier</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Scan Result Preview */}
                {scanResult && (
                  <div className="p-5 rounded-2xl bg-[#f0f8f4] dark:bg-[#121c19] border border-emerald-300 dark:border-emerald-500/40 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1b7e5c] text-white">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Document Officiel Authentifié</span>
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        Signature numérique valide
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm pt-2">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Enfant</span>
                        <strong className="text-[#103d34] dark:text-emerald-100">
                          {scanResult.prenom} {scanResult.nom}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Date de naissance</span>
                        <strong className="text-[#103d34] dark:text-emerald-100">
                          {scanResult.dateNaissance}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Établissement</span>
                        <strong className="text-[#103d34] dark:text-emerald-100">
                          {scanResult.lieuNaissance}
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Mère</span>
                        <strong className="text-[#103d34] dark:text-emerald-100">
                          {scanResult.mere.nom}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Review & Validation Modal for Selected Child */}
      {selectedChildForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0a0a0a] rounded-3xl shadow-2xl border border-[#134e43]/20 dark:border-emerald-500/30 overflow-hidden flex flex-col transition-colors">
            <div className="p-5 bg-gradient-to-r from-[#12493e] to-[#0f3d34] dark:from-black dark:to-[#0a1815] text-white flex items-center justify-between border-b border-transparent dark:border-emerald-500/20">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-300" />
                <h3 className="text-base font-bold text-white">Gestion du dossier nouveau-né</h3>
              </div>
              <button
                onClick={() => setSelectedChildForReview(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedChildForReview.photoUrl}
                  alt={selectedChildForReview.prenom}
                  className="w-16 h-16 rounded-full object-cover border border-[#1b5e52]/30"
                />
                <div>
                  <h4 className="text-lg font-bold text-[#103d34] dark:text-emerald-100">
                    {selectedChildForReview.prenom} {selectedChildForReview.nom}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Né(e) le {selectedChildForReview.dateNaissance} · {selectedChildForReview.poids}
                  </p>
                  <span className="text-xs font-mono text-[#1b7e5c] dark:text-emerald-300">
                    {selectedChildForReview.referenceMaternite}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-100 dark:border-emerald-500/20 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lieu de naissance :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChildForReview.lieuNaissance}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mère :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChildForReview.mere.nom} ({selectedChildForReview.mere.telephone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Père :</span>
                  <strong className="text-[#103d34] dark:text-emerald-100">{selectedChildForReview.pere.nom} ({selectedChildForReview.pere.telephone})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Numéro d’acte :</span>
                  <strong className="text-[#1b7e5c] dark:text-emerald-300 font-mono">{selectedChildForReview.numeroActe || 'En attente'}</strong>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                {selectedChildForReview.status === 'en_cours' ? (
                  <button
                    onClick={() => handleValidateChildAct(selectedChildForReview.id)}
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

                <button
                  onClick={() => {
                    showToast(`Attestation de naissance ${selectedChildForReview.referenceMaternite} téléchargée`);
                    setSelectedChildForReview(null);
                  }}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-emerald-500/30 text-xs font-semibold text-[#103d34] dark:text-emerald-200 hover:bg-slate-50 dark:hover:bg-[#121c19] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Imprimer le certificat médical de naissance</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Register Child Wizard for Agent */}
      <ChildRegisterWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={(newChild) => {
          onAddChild(newChild);
          showToast(`Déclaration de naissance enregistrée avec succès pour ${newChild.prenom} ${newChild.nom} (${newChild.referenceMaternite}).`);
        }}
      />
    </div>
  );
};
