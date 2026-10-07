import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  FileText,
  LogOut,
  Plus,
  Settings,
  Syringe,
  BarChart3,
} from "lucide-react";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import type {
  AgentKpi,
  AgentUser,
  Child,
  VaccineItem,
  DocumentItem,
} from "../../types/dashboard";
import { AgentNewborn } from "./AgentNewborn";
import { AgentRecords } from "./AgentRecords";
import { AgentVaccinations } from "./AgentVaccinations";
import { AgentStatistics } from "./AgentStatistics";
import { AgentSettings } from "./AgentSettings";

interface AgentDashboardProps {
  agent: AgentUser | null;
  kpi: AgentKpi;
  childrenList: Child[];
  vaccines: VaccineItem[];
  documents: DocumentItem[];
  onUpdateChild?: (child: Child) => void;
  /** Persiste un nouveau-né côté API, puis renvoie l'enregistrement réel. */
  creer?: (child: Child) => Promise<Child>;
  onAddChild: (child: Child) => void;
  onLogout: () => void;
  onSwitchToParent: () => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  agent,
  kpi,
  childrenList,
  vaccines,
  onUpdateChild,
  creer,
  onAddChild,
  onLogout,
}) => {
  const identite = agent ?? {
    nom: "",
    role: "",
    etablissement: "",
    matricule: "",
    ville: "",
  };

  /** Dossiers dont le délai de déclaration J+30 se rapproche. */
  const dossiersUrgents = childrenList.filter((c) => {
    if (c.status === "complet") return false;
    const [jour, mois, annee] = c.dateNaissance.split("/");
    const naissance = annee
      ? new Date(`${annee}-${mois}-${jour}`)
      : new Date(c.dateNaissance);
    if (Number.isNaN(naissance.getTime())) return false;
    return Date.now() - naissance.getTime() < 30 * 86400000;
  }).length;

  const naissancesRecentes = childrenList.slice(0, 5);
  const [activeTab, setActiveTab] = useState<
    "apercu" | "nouveau" | "registre" | "vaccins" | "stats" | "settings"
  >("apercu");
  const [vaccineSubTab, setVaccineSubTab] = useState<
    "confirmation" | "lots" | "rendezvous"
  >("confirmation");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openVaccineConfirmation = () => {
    setVaccineSubTab("confirmation");
    setActiveTab("vaccins");
  };

  const handleValidateChildAct = (childId: string) => {
    const child = childrenList.find((c) => c.id === childId);
    if (child) {
      onUpdateChild?.({
        ...child,
        status: "complet",
        etapes: [
          ...child.etapes,
          {
            titre: "Acte officiel certifié par l’Officier d’État Civil",
            date: "Aujourd’hui",
            complete: true,
          },
        ],
      });
      showToast(
        `Dossier de ${child.prenom} ${child.nom} soldé : l'acte peut être délivré.`,
      );
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
                Portail Professionnel & Maternité
              </span>
            </div>
          </div>

          {/* Navigation Links matching directory architecture */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => setActiveTab("apercu")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "apercu"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Tableau de bord</span>
            </button>

            <button
              onClick={() => setActiveTab("nouveau")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "nouveau"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Déclarer une naissance</span>
            </button>

            <button
              onClick={() => setActiveTab("registre")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "registre"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Registre enfants</span>
              </div>
              <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded-full">
                {childrenList.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("vaccins");
                setVaccineSubTab("confirmation");
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "vaccins" && vaccineSubTab === "confirmation"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Confirmation Statuts</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("stats")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "stats"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Statistiques</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                activeTab === "settings"
                  ? "bg-[#1b5e52] dark:bg-[#1a2b27] text-white dark:text-emerald-300 font-semibold shadow-xs"
                  : "text-emerald-100/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Paramètres Agent</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-[11px] text-emerald-300 font-semibold block">
              {identite.role}
            </span>
            <strong className="text-xs text-white block">{identite.nom}</strong>
            <p className="text-[10px] text-emerald-200/70">
              {identite.etablissement}
            </p>
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
        <header className="sticky top-0 z-30 px-3 sm:px-6 py-3 sm:py-4 bg-white/90 dark:bg-[#070707]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-xl font-bold text-[#103d34] dark:text-[#f0fdf9] truncate">
                  {identite.etablissement}
                </h1>
                <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold flex-shrink-0">
                  {identite.matricule}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-[#526f67] dark:text-emerald-200/70 truncate">
                {identite.nom} ·{" "}
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  {identite.role}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => setActiveTab("nouveau")}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] dark:bg-emerald-500 dark:text-black text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Déclarer une naissance</span>
            </button>

            <ThemeToggle />

            {/* Agent Avatar */}
            <div
              onClick={() => setActiveTab("settings")}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1b5e52] dark:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs cursor-pointer"
              title="Paramètres de l'agent"
            >
              {identite.nom
                .split(/\s+/)
                .filter(Boolean)
                .map((partie) => partie.charAt(0))
                .join("")
                .slice(0, 2)
                .toUpperCase() || "AG"}
            </div>
          </div>
        </header>

        {/* Content Tabs */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {activeTab === "apercu" && (
            <div className="space-y-6">
              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div
                  onClick={() => setActiveTab("stats")}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
                  title="Cliquer pour consulter les statistiques épidémiologiques et sanitaires"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                      Naissances & Survie
                    </span>
                    <BarChart3 className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    {kpi.naissances}
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span>{kpi.tauxSurvie} survie · Voir statistiques</span>
                    <ArrowRight className="w-3 h-3" />
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Dossiers suivis</span>
                    <Clock className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    {kpi.dossiers}
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium">
                    {kpi.dossiersComplets} dossiers soldés
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Dossiers encore ouverts</span>
                    <FileCheck2 className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-amber-600 dark:text-amber-400">
                    {Math.max(0, kpi.dossiers - kpi.dossiersComplets)}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Déclaration ou acte en attente
                  </p>
                </div>

                <div
                  onClick={openVaccineConfirmation}
                  className="p-5 rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-2 cursor-pointer hover:border-emerald-500/50 hover:shadow-md transition-all group"
                  title="Cliquer pour gérer la confirmation des statuts vaccinaux"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                      Vaccins & Statuts
                    </span>
                    <Syringe className="w-4 h-4 text-[#1b7e5c] dark:text-emerald-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-serif text-[#103d34] dark:text-[#f0fdf9]">
                    {kpi.dosesAdministrees} doses
                  </div>
                  <p className="text-[11px] text-[#1b7e5c] dark:text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>sur {kpi.doses} échéances · Confirmer →</span>
                  </p>
                </div>
              </div>

              {/* Alert Banner for Vaccine Status (ConfirmationStatutVaccin) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#1b5e52] text-white flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#103d34] dark:text-emerald-200">
                      Confirmation du statut d'un vaccin administré (Module
                      Sage-Femme / Agent)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-emerald-300/80">
                      Suivez les doses à venir, enregistrez les vaccins
                      administrés ou signalez les doses non administrées avec
                      plan de relance.
                    </p>
                  </div>
                </div>

                <button
                  onClick={openVaccineConfirmation}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1b5e52] hover:bg-[#144b41] text-white text-xs font-bold whitespace-nowrap cursor-pointer shadow-xs min-h-[38px] flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirmer les statuts</span>
                </button>
              </div>

              {/* Alert Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
                      Rappel légal : {dossiersUrgents} dossier
                      {dossiersUrgents > 1 ? "s" : ""} proche
                      {dossiersUrgents > 1 ? "s" : ""} du délai légal de 30
                      jours
                    </h4>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                      Les parents ont reçu un rappel automatique. L’officier
                      d’état civil peut certifier les dossiers en 1 clic.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("registre")}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Voir les dossiers urgents
                </button>
              </div>

              {/* Recent Births Container */}
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#134e43]/15 dark:border-emerald-500/25 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#103d34] dark:text-[#f0fdf9]">
                      Dernières déclarations enregistrées
                    </h3>
                    <p className="text-xs text-slate-400">
                      Registre synchronisé en temps réel avec les maternités et
                      mairies.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab("registre")}
                    className="text-xs font-semibold text-[#1b5e52] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                  >
                    <span>Consulter le registre complet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Mobile Cards View (md:hidden) */}
                <div className="md:hidden space-y-3">
                  {naissancesRecentes.map((c) => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl bg-[#f9fcfa] dark:bg-[#121c19] border border-slate-200/80 dark:border-emerald-500/20 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.photoUrl}
                            alt={c.prenom}
                            className="w-9 h-9 rounded-full object-cover border border-[#1b5e52]/30"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-[#103d34] dark:text-emerald-100">
                              {c.prenom} {c.nom}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              Né le {c.dateNaissance} · {c.sexe}
                              {c.poids ? ` (${c.poids})` : ""}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            c.status === "complet"
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                          }`}
                        >
                          {c.status === "complet"
                            ? "✓ Acte émis"
                            : "En attente"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-white/5 text-[11px]">
                        <span className="font-mono text-slate-500 dark:text-emerald-300/80">
                          {c.referenceMaternite}
                        </span>
                        <button
                          onClick={() => setActiveTab("registre")}
                          className="px-3 py-1 rounded-lg bg-[#1b5e52] text-white text-xs font-semibold cursor-pointer"
                        >
                          Examiner
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View (hidden md:block) */}
                <div className="hidden md:block overflow-x-auto">
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
                      {naissancesRecentes.map((c) => (
                        <tr
                          key={c.id}
                          className="hover:bg-[#f9fcfa] dark:hover:bg-[#121c19] transition-colors"
                        >
                          <td className="py-3 px-3 font-semibold text-[#103d34] dark:text-emerald-100">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={c.photoUrl}
                                alt={c.prenom}
                                className="w-8 h-8 rounded-full object-cover border border-[#1b5e52]/30"
                              />
                              <div>
                                <span>
                                  {c.prenom} {c.nom}
                                </span>
                                <span className="block text-[11px] font-normal text-slate-400">
                                  {c.sexe}
                                  {c.poids ? ` · ${c.poids}` : ""}
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
                            {c.mere.nom
                              ? `Mère : ${c.mere.nom}${c.mere.telephone ? ` (${c.mere.telephone})` : ""}`
                              : "Parents non renseignés"}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                                c.status === "complet"
                                  ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                                  : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                              }`}
                            >
                              {c.status === "complet"
                                ? "✓ Acte émis"
                                : "En attente mairie"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => setActiveTab("registre")}
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

          {activeTab === "nouveau" && (
            <AgentNewborn
              onAddChild={onAddChild}
              creer={creer}
              etablissement={identite.etablissement}
              onShowToast={showToast}
              onCancel={() => setActiveTab("apercu")}
            />
          )}

          {activeTab === "registre" && (
            <AgentRecords
              childrenList={childrenList}
              onValidateChildAct={handleValidateChildAct}
              onShowToast={showToast}
            />
          )}

          {activeTab === "vaccins" && (
            <AgentVaccinations
              vaccines={vaccines}
              childrenList={childrenList}
              initialSubTab={vaccineSubTab}
              onShowToast={showToast}
            />
          )}

          {activeTab === "stats" && (
            <AgentStatistics
              kpi={kpi}
              etablissement={identite.etablissement}
              onShowToast={showToast}
            />
          )}

          {activeTab === "settings" && (
            <AgentSettings agent={identite} onShowToast={showToast} />
          )}
        </main>
      </div>

      {/* MOBILE-FIRST BOTTOM NAVIGATION TAB BAR FOR AGENTS */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#070707]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        {/* 1. Aperçu */}
        <button
          onClick={() => setActiveTab("apercu")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl min-h-[50px] min-w-[56px] transition-all active:scale-95 cursor-pointer ${
            activeTab === "apercu"
              ? "text-[#1b5e52] dark:text-emerald-400 font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${activeTab === "apercu" ? "bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300" : ""}`}
          >
            <Activity className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Aperçu</span>
        </button>

        {/* 2. Déclarer (+ Action highlight) */}
        <button
          onClick={() => setActiveTab("nouveau")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl min-h-[50px] min-w-[56px] transition-all active:scale-95 cursor-pointer ${
            activeTab === "nouveau"
              ? "text-[#1b5e52] dark:text-emerald-400 font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${activeTab === "nouveau" ? "bg-[#1b5e52] text-white shadow-xs" : "bg-emerald-100 dark:bg-emerald-950/60 text-[#1b5e52] dark:text-emerald-300"}`}
          >
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Déclarer</span>
        </button>

        {/* 3. Registre */}
        <button
          onClick={() => setActiveTab("registre")}
          className={`relative flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl min-h-[50px] min-w-[56px] transition-all active:scale-95 cursor-pointer ${
            activeTab === "registre"
              ? "text-[#1b5e52] dark:text-emerald-400 font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
          }`}
        >
          <div
            className={`relative p-1.5 rounded-xl transition-colors ${activeTab === "registre" ? "bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300" : ""}`}
          >
            <FileText className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 px-1 min-w-[15px] h-[15px] rounded-full bg-[#1b5e52] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-black">
              {childrenList.length}
            </span>
          </div>
          <span className="text-[10px]">Registre</span>
        </button>

        {/* 4. Suivi Vaccinal PEV */}
        <button
          onClick={() => setActiveTab("vaccins")}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2.5 rounded-2xl min-h-[50px] min-w-[56px] transition-all active:scale-95 cursor-pointer ${
            activeTab === "vaccins"
              ? "text-[#1b5e52] dark:text-emerald-400 font-bold"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-700"
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-colors ${activeTab === "vaccins" ? "bg-[#ebf5f0] dark:bg-[#121c19] text-[#1b5e52] dark:text-emerald-300" : ""}`}
          >
            <Syringe className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Vaccins</span>
        </button>

        {/* 5. Déconnexion */}
        <button
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-2xl min-h-[50px] min-w-[62px] transition-all active:scale-95 cursor-pointer text-[#1b5e52] dark:text-emerald-400 font-bold"
        >
          <div className="p-1.5 rounded-xl">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px]">Déconnexion</span>
        </button>
      </nav>
    </div>
  );
};

